// Enhanced Global Variables Page
import { GetDataFromAPi } from "../api/api_syncer";
import { useEffect, useState } from "preact/hooks";
import { signal } from "@preact/signals";
import { Plus, Edit2, Trash2, Save, X, Search, RefreshCw, Zap, Download, Settings } from "lucide-react";
import { CreateDataToAPI, UpdateDataToAPI } from "../api/api_syncerv2";
import { AppID } from "../states/global_state";

// Global state signals
export const globalVariables = signal({});
export const isLoading = signal(false);
export const isSyncing = signal(false);
export const apiError = signal(null);
export const searchTerm = signal('');
export const selectedType = signal('all');
export const lastSyncTime = signal(null);
export const selectedVariable = signal(null);

// Constants
const VARIABLE_TYPES = ['string', 'number', 'boolean', 'object', 'array'];

const TYPE_COLORS = {
  string: 'bg-blue-100 text-blue-800',
  number: 'bg-emerald-100 text-emerald-800',
  boolean: 'bg-purple-100 text-purple-800',
  object: 'bg-orange-100 text-orange-800',
  array: 'bg-pink-100 text-pink-800'
};

// Utility functions
const parseValue = (value, type) => {
  try {
    switch (type) {
      case 'number': return parseFloat(value) || 0;
      case 'boolean': return value === 'true' || value === true;
      case 'object':
      case 'array': return typeof value === 'string' ? JSON.parse(value) : value;
      default: return value;
    }
  } catch { return value; }
};

const formatValue = (value, type) => {
  if (type === 'object' || type === 'array') {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
};

// API Functions
const loadGlobalVariables = async () => {
  try {
    isLoading.value = true;
    apiError.value = null;
    
    const url = `_global_states`;
    const response = await GetDataFromAPi(url);
    
    globalVariables.value = response?.[0]?.signals || {};
  } catch (error) {
    console.error("Error loading variables:", error);
    apiError.value = "Failed to load variables";
  } finally {
    isLoading.value = false;
  }
};

const syncVariables = async () => {
  try {
    isSyncing.value = true;
    apiError.value = null;
    
    const updateData = { signals:globalVariables.value };
    let url = `_global_states`;
    const existing = await GetDataFromAPi(url);
    
    if (existing?.length > 0) {
      url = `${AppID.value}/public/_global_states?where=id=${existing[0].id}`;
      await UpdateDataToAPI(url, updateData);
    } else {
      url = `${AppID.value}/public/_global_states`;
      await CreateDataToAPI(url, updateData);
    }
    
    lastSyncTime.value = new Date().toISOString();
  } catch (error) {
    console.error("Sync error:", error);
    apiError.value = "Failed to sync variables";
  } finally {
    isSyncing.value = false;
  }
};

export function VariablesPage() {
  useEffect(() => {
    loadGlobalVariables();
  }, []);

  return (
    <div className="min-h-screen h-screen w-full bg-gray-50 flex">
      {/* Left Panel - Controls */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <LeftPanel />
      </div>

      {/* Center Panel - Variables List */}
      <div className="flex-1 flex flex-col">
        <CenterPanel />
      </div>

      {/* Right Panel - Variable Editor */}
      {selectedVariable.value && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <RightPanel />
        </div>
      )}
    </div>
  );
}

const LeftPanel = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = async () => {
    if (!newName.trim()) return;
    
    const variables = { ...globalVariables.value };
    variables[newName] = {
      value: '',
      type: 'string',
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    globalVariables.value = variables;
    selectedVariable.value = newName; // Auto-select for editing
    setNewName('');
    setIsCreating(false);
    await syncVariables();
  };

  const handleDelete = async (key) => {
    if (confirm(`Delete "${key}"?`)) {
      const variables = { ...globalVariables.value };
      delete variables[key];
      globalVariables.value = variables;
      if (selectedVariable.value === key) selectedVariable.value = null;
      await syncVariables();
    }
  };

  const exportVars = () => {
    const dataStr = JSON.stringify(globalVariables.value, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'variables.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const variablesList = Object.entries(globalVariables.value).filter(([key, data]) => {
    const matchesSearch = key.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         (data.description?.toLowerCase().includes(searchTerm.value.toLowerCase()));
    const matchesType = selectedType.value === 'all' || data.type === selectedType.value;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Variables</h2>
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-indigo-600 text-white p-1.5 rounded hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Create Form */}
        {isCreating && (
          <div className="mb-4 space-y-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Variable name"
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            />
            <div className="flex gap-2">
              <button 
                onClick={handleCreate} 
                className="flex-1 bg-indigo-600 text-white py-1.5 rounded text-sm hover:bg-indigo-700 transition-colors"
              >
                Create
              </button>
              <button 
                onClick={() => setIsCreating(false)} 
                className="flex-1 bg-gray-200 text-gray-700 py-1.5 rounded text-sm hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="space-y-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search variables..."
              value={searchTerm.value}
              onInput={(e) => searchTerm.value = e.target.value}
              className="w-full pl-8 pr-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Type Filter */}
          <select 
            value={selectedType.value}
            onChange={(e) => selectedType.value = e.target.value}
            className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Types</option>
            {VARIABLE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Variables List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1 max-h-full">
          {variablesList.map(([key, data]) => (
            <div 
              key={key}
              className={`flex items-center justify-between p-2.5 rounded-md cursor-pointer transition-colors ${
                selectedVariable.value === key 
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => selectedVariable.value = key}
            >
              <div className="flex items-center min-w-0">
                <Settings size={16} className="mr-2 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{key}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[data.type]}`}>
                      {data.type}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(key);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          
          {variablesList.length === 0 && (
            <div className="text-center text-gray-500 py-8 text-sm">
              {Object.keys(globalVariables.value).length === 0 
                ? "No variables yet"
                : "No variables match your search"
              }
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button
          onClick={syncVariables}
          disabled={isSyncing.value}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isSyncing.value ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <Zap size={14} />
              Sync All
            </>
          )}
        </button>

        <button
          onClick={exportVars}
          className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 border border-gray-300 text-sm rounded-md hover:bg-gray-50 transition-colors"
        >
          <Download size={14} />
          Export JSON
        </button>

        {/* Error Display */}
        {apiError.value && (
          <div className="bg-red-50 border border-red-200 rounded-md p-2">
            <div className="text-red-800 text-xs">{apiError.value}</div>
          </div>
        )}

        {/* Last Sync Time */}
        {lastSyncTime.value && (
          <div className="text-xs text-gray-500 text-center">
            Last sync: {new Date(lastSyncTime.value).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

const CenterPanel = () => {
  const filteredVariables = Object.entries(globalVariables.value).filter(([key, data]) => {
    const matchesSearch = key.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         (data.description?.toLowerCase().includes(searchTerm.value.toLowerCase()));
    const matchesType = selectedType.value === 'all' || data.type === selectedType.value;
    return matchesSearch && matchesType;
  });

  return (
    <>
      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Global Variables</h1>
            <p className="text-gray-600 mt-1">Manage your application's global state</p>
          </div>
          {isSyncing.value && (
            <div className="flex items-center gap-1 text-indigo-600">
              <RefreshCw size={14} className="animate-spin" />
              <span className="text-sm">Syncing...</span>
            </div>
          )}
        </div>
      </div>

      {/* Variables List */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading.value ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <RefreshCw size={24} className="animate-spin mb-2" />
            Loading variables...
          </div>
        ) : filteredVariables.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            {Object.keys(globalVariables.value).length === 0 
              ? "No variables yet. Use the left panel to add some."
              : "No variables match your search."
            }
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-4">
              {filteredVariables.map(([key, data]) => (
                <VariableCard 
                  key={key}
                  varKey={key}
                  data={data}
                  isSelected={selectedVariable.value === key}
                  onClick={() => selectedVariable.value = key}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const VariableCard = ({ varKey, data, isSelected, onClick }) => (
  <div 
    className={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${
      isSelected ? 'ring-2 ring-indigo-500 border-indigo-200' : 'border-gray-200'
    }`}
    onClick={onClick}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-semibold text-gray-900 truncate">{varKey}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${TYPE_COLORS[data.type]}`}>
            {data.type}
          </span>
        </div>
        
        {data.description && (
          <p className="text-sm text-gray-600 mb-2">{data.description}</p>
        )}
        
        <div className="bg-gray-50 rounded p-2 font-mono text-xs overflow-hidden">
          <div className="truncate">
            {formatValue(data.value, data.type)}
          </div>
        </div>
        
        {data.updatedAt && (
          <p className="text-xs text-gray-400 mt-2">
            Updated: {new Date(data.updatedAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  </div>
);

const RightPanel = () => {
  const varKey = selectedVariable.value;
  const data = globalVariables.value[varKey];
  
  const [editValue, setEditValue] = useState(formatValue(data.value, data.type));
  const [editDescription, setEditDescription] = useState(data.description || '');
  const [editType, setEditType] = useState(data.type);

  useEffect(() => {
    if (data) {
      setEditValue(formatValue(data.value, data.type));
      setEditDescription(data.description || '');
      setEditType(data.type);
    }
  }, [varKey]);

  const handleSave = async () => {
    const variables = { ...globalVariables.value };
    variables[varKey] = {
      ...variables[varKey],
      value: parseValue(editValue, editType),
      type: editType,
      description: editDescription,
      updatedAt: new Date().toISOString()
    };
    globalVariables.value = variables;
    await syncVariables();
  };

  const handleClose = () => {
    selectedVariable.value = null;
  };

  if (!data) return null;

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <h3 className="font-semibold text-gray-900">Edit Variable</h3>
        <button
          onClick={handleClose}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Key</label>
          <input
            type="text"
            value={varKey}
            disabled
            className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={editType}
            onChange={(e) => setEditType(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {VARIABLE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            rows={editType === 'object' || editType === 'array' ? 8 : 3}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Optional description"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Save size={16} />
          Save Changes
        </button>

        {data.createdAt && (
          <div className="pt-4 border-t border-gray-200 text-xs text-gray-500">
            <p>Created: {new Date(data.createdAt).toLocaleString()}</p>
            {data.updatedAt && (
              <p>Updated: {new Date(data.updatedAt).toLocaleString()}</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};