import React, { useCallback, useEffect, useState } from 'react';
import { Code, Edit3, X, Check } from 'lucide-react';

// Generic JavaScript Code Editor Component
const JavaScriptEditor = ({ field, value = '', onChange, placeholder = 'Enter JavaScript code...' }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [tempValue, setTempValue] = useState('');

  const handleOpenPopup = () => {
    setTempValue(value || '');
    setIsPopupOpen(true);
  };

  const handleSave = () => {
    onChange(field.id, tempValue);
    setIsPopupOpen(false);
  };

  const handleCancel = () => {
    setTempValue('');
    setIsPopupOpen(false);
  };

  const getPreviewText = () => {
    if (!value) return placeholder;
    const lines = value.split('\n');
    if (lines.length === 1) {
      return value.length > 40 ? `${value.substring(0, 40)}...` : value;
    }
    return `${lines[0].substring(0, 30)}... (${lines.length} lines)`;
  };

  return (
    <>
      {/* Compact Preview Box */}
      <div className="relative">
        <div
          onClick={handleOpenPopup}
          className="w-full min-h-[40px] p-3 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <Code className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="text-sm text-gray-700 truncate font-mono">
              {getPreviewText()}
            </div>
          </div>
          <Edit3 className="w-4 h-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
        </div>
        {field.required && !value && (
          <div className="text-xs text-red-500 mt-1">This field is required</div>
        )}
      </div>

      {/* Popup Editor */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {field.label || 'JavaScript Editor'}
                </h3>
              </div>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Editor */}
            <div className="flex-1 p-4">
              <textarea
                value={tempValue}
                // @ts-ignore
                onChange={(e) => setTempValue(e.target.value)}
                placeholder={placeholder}
                className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ minHeight: '400px' }}
                spellcheck={false}
              />
              {field.description && (
                <p className="text-sm text-gray-600 mt-2">{field.description}</p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-4 border-t bg-gray-50">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Save Code</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Global JavaScript Field Component (following your pattern)
const GlobalJavaScriptField = ({ field, value, onChange }) => {
  return (
    <div className="space-y-2">
      {field.label && (
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <JavaScriptEditor
        field={field}
        value={value}
        onChange={onChange}
        placeholder={field.placeholder || 'Enter JavaScript code...'}
      />
    </div>
  );
};



import {useMemo } from 'react';
import { Plus, ArrowRight, Settings, Type, Database, User, Search, ChevronDown, ChevronRight } from 'lucide-react';
export function Toggle() {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    setIsOn(!isOn);
  };
  let label = "auto map remaining";

  return (
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-medium text-gray-700">
           {label}
          </span>
          
          {/* Toggle Switch */}
          <button
            onClick={toggleSwitch}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isOn ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                isOn ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
  );
}

// Mapping Type Button Component
const MappingTypeButton = ({ type, isSelected, onClick, enabled }) => {
  if (!enabled) return null;
  
  return (
    <button
      onClick={() => onClick(type.id)}
      className={`flex-1 px-2 py-1.5 rounded-md border text-xs font-medium transition-colors ${
        isSelected
          ? 'border-blue-500 bg-blue-50 text-blue-700'
          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
      }`}
    >
      {type.label}
    </button>
  );
};

// Value Input Component
const ValueInput = ({ mapping, onUpdate, config }) => {
  const { type } = mapping;
  const { source_fields = [], userFields = [], enableSourceFields, enableUserFields } = config;

  if (type === 'static') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
        <input
          type="text"
          value={mapping.value || ''}
          // @ts-ignore
          onChange={(e) => onUpdate({ value: e.target.value })}
          placeholder="Enter static value..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>
    );
  }

  if (type === 'source' && enableSourceFields) {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Source Field</label>
        <select
          value={mapping.sourceField || ''}
          // @ts-ignore
          onChange={(e) => onUpdate({ sourceField: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="">Select source field...</option>
          {source_fields.map(field => (
            <option key={field.value} value={field.value}>{field.label}</option>
          ))}
        </select>
      </div>
    );
  }

  if (type === 'user' && enableUserFields) {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">User Field</label>
        <select
          value={mapping.userField || ''}
          // @ts-ignore
          onChange={(e) => onUpdate({ userField: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="">Select user field...</option>
          {userFields.map(field => (
            <option key={field.value} value={field.value}>{field.label}</option>
          ))}
        </select>
      </div>
    );
  }

  return null;
};

// Toggle Switch Component
const ToggleSwitch = ({ enabled, onChange, label }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

// Mapping Row Component
const MappingRow = ({ mapping, config, onUpdate, onRemove, onToggleExpand, isExpanded }) => {
  const { target_fields = [], source_fields = [], userFields = [] } = config;
  
  const isValid = mapping.targetField && 
    ((mapping.type === 'static' && mapping.value) || 
     (mapping.type === 'source' && mapping.sourceField) || 
     (mapping.type === 'user' && mapping.userField));

  const targetField = target_fields.find(f => f.value === mapping.targetField);
  
  const getPreview = () => {
    if (!mapping.targetField) return 'No target selected';
    switch (mapping.type) {
      case 'static': return mapping.value ? `"${mapping.value}"` : 'No value';
      case 'source': 
        const sourceField = source_fields.find(f => f.value === mapping.sourceField);
        return sourceField ? sourceField.label : 'No source selected';
      case 'user':
        const userField = userFields.find(f => f.value === mapping.userField);
        return userField ? userField.label : 'No user field selected';
      default: return 'Not configured';
    }
  };

  const mappingTypes = [
    { id: 'static', label: 'Static', enabled: config.enableStaticValues ?? true },
    { id: 'source', label: 'Source', enabled: config.enableSourceFields ?? true },
    { id: 'user', label: 'User', enabled: config.enableUserFields ?? true }
  ].filter(type => type.enabled);

  return (
    <div className={`border rounded-lg overflow-hidden ${isValid ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
      {/* Collapsed View */}
      <div className="p-3 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => onToggleExpand(mapping.id)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-900 truncate">
                {targetField?.label || 'Select target field'}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <ArrowRight className="w-3 h-3" />
                <span className="truncate">{getPreview()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {mappingTypes.find(t => t.id === mapping.type)?.label}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(mapping.id); }}
              className="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div className="px-4 pb-4 bg-white border-t border-gray-100 space-y-3">
          {/* Target Field */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Target Field</label>
            <select
              value={mapping.targetField}
              // @ts-ignore
              onChange={(e) => onUpdate(mapping.id, { targetField: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Select target field...</option>
              {target_fields.map(field => (
                <option key={field.value} value={field.value}>{field.label}</option>
              ))}
            </select>
          </div>

          {/* Mapping Type */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
            <div className="flex gap-1">
              {mappingTypes.map(type => (
                <MappingTypeButton
                  key={type.id}
                  type={type}
                  isSelected={mapping.type === type.id}
                  onClick={(typeId) => onUpdate(mapping.id, { type: typeId })}
                  enabled={type.enabled}
                />
              ))}
            </div>
          </div>

          <ValueInput
            mapping={mapping}
            onUpdate={(updates) => onUpdate(mapping.id, updates)}
            config={config}
          />
        </div>
      )}
    </div>
  );
};

// @ts-ignore
export const DataMapperField = React.memo(({ field, value = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [mappings, setMappings] = useState([]);
  const [autoMap, setAutoMap] = useState(false);

  const config = useMemo(() => {
    return {
      target_fields: field.target_fields || [],
      source_fields: field.source_fields || [],
      userFields: field.userFields || [],
      enableStaticValues: field.enableStaticValues ?? true,
      enableUserFields: field.enableUserFields ?? true,
      enableSourceFields: field.enableSourceFields ?? true,
      label: field.label || "Field Mapping",
      placeholder: field.placeholder || "Configure field mappings"
    };
  }, [
    field.target_fields?.length,
    field.source_fields?.length,
    field.userFields?.length,
    field.enableStaticValues,
    field.enableUserFields,
    field.enableSourceFields,
    field.label,
    field.placeholder
  ]);
  
  // Use a more stable value comparison to prevent unnecessary re-renders
  const stableValue = useMemo(() => {
    debugger;
    return Array.isArray(value) ? value : [];
  }, [value]);
  
  useEffect(() => {
    // Only update if the values are actually different
    const currentMappingsString = JSON.stringify(mappings);
    const newValueString = JSON.stringify(stableValue);
    
    if (currentMappingsString !== newValueString) {
      setMappings(JSON.parse(JSON.stringify(stableValue)));
    }
  }, [stableValue]); // Use stableValue instead of value

  const mappedCount = useMemo(() => {
    console.log("called mapping count filtering mapping", mappings);
    return mappings.filter(m => m.targetField && 
      ((m.type === 'static' && m.value) || 
       (m.type === 'source' && m.sourceField) || 
       (m.type === 'user' && m.userField))
    ).length;
  }, [mappings]);

  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(mappings) !== JSON.stringify(stableValue);
  }, [mappings, stableValue]);

  const addMapping = useCallback(() => {
    const newMapping = {
      id: Date.now().toString(),
      targetField: '',
      type: 'static',
      value: '', sourceField: '', userField: ''
    };
    console.log("adding mapping", newMapping);
    setMappings(prev => [...prev, newMapping]);
    setExpandedRows(prev => new Set([...prev, newMapping.id]));
  }, []);

  const updateMapping = useCallback((id, updates) => {
    setMappings(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  const removeMapping = useCallback((id) => {
    setExpandedRows(prev => { const newSet = new Set(prev); newSet.delete(id); return newSet; });
    setMappings(prev => prev.filter(m => m.id !== id));
  }, []);

  const toggleExpanded = useCallback((id) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  }, []);

  const handleSave = useCallback(() => {
    console.log("called handle save callback", mappings);
    // Only call onChange if there are actual changes
    if (JSON.stringify(mappings) !== JSON.stringify(stableValue)) {
      onChange(field["id"], mappings);
    }
    setIsOpen(false);
  }, [mappings, onChange, field, stableValue]);

  const filteredMappings = useMemo(() => {
    if (!searchQuery) return mappings;
    const query = searchQuery.toLowerCase();
    return mappings.filter(mapping => {
      const targetField = config.target_fields.find(f => f.value === mapping.targetField);
      return targetField?.label?.toLowerCase().includes(query) ||
             mapping.value?.toLowerCase().includes(query) ||
             mapping.sourceField?.toLowerCase().includes(query) ||
             mapping.userField?.toLowerCase().includes(query);
    });
  }, [mappings, searchQuery, config.target_fields]);

  console.log("rendering the datamapperfield");
  
  return (
    <div className={field.className || ""}>
      {field.label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors w-full justify-between"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span>{mappedCount > 0 ? `${mappedCount} mapping(s) configured` : config.placeholder}</span>
        </div>
        <div className="flex items-center gap-2">
          {mappedCount > 0 && (
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">{mappedCount}</span>
          )}
          {hasUnsavedChanges && <span className="w-2 h-2 bg-orange-500 rounded-full" />}
        </div>
      </button>

      {field.helpText && <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>}

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-25" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">{config.label}</h3>
              <div className="flex items-center gap-2">
                <button onClick={addMapping} className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                  Add Mapping
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-200 rounded-md">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search mappings..."
                  value={searchQuery}
                  // @ts-ignore
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Mappings List */}
            <div className="flex-1 overflow-y-auto">
              {filteredMappings.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                    <Database className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mb-3">No mappings configured</p>
                  <button onClick={addMapping} className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                    <Plus className="w-4 h-4" />Add Mapping
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {filteredMappings.map((mapping) => (
                    <MappingRow
                      key={mapping.id}
                      mapping={mapping}
                      config={config}
                      onUpdate={updateMapping}
                      onRemove={removeMapping}
                      onToggleExpand={toggleExpanded}
                      isExpanded={expandedRows.has(mapping.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-3">
              <ToggleSwitch
                enabled={autoMap}
                onChange={setAutoMap}
                label="Auto Map"
              />
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {hasUnsavedChanges ? (
                    <span className="flex items-center gap-1 text-orange-600">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      Unsaved changes
                    </span>
                  ) : (
                    <span className="text-green-600">All changes saved</span>
                  )}
                </div>
                <button
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    hasUnsavedChanges ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    // @ts-ignore
    JSON.stringify(prevProps.value) === JSON.stringify(nextProps.value) &&
    // @ts-ignore
    JSON.stringify(prevProps.field) === JSON.stringify(nextProps.field) &&
    // @ts-ignore
    prevProps.onChange === nextProps.onChange
  );
});
// Demo Component
export default function DynamicMapperTest() {
  const [mappings, setMappings] = useState([]);

  const fieldConfig = {
    label: "Data Field Mapping",
    placeholder: "Configure your field mappings",
    helpText: "Map your data fields to target fields.",
    required: true,
    target_fields: [
      { value: 'name', label: 'Full Name' },
      { value: 'email', label: 'Email Address' },
      { value: 'phone', label: 'Phone Number' }
    ],
    source_fields: [
      { value: 'first_name', label: 'First Name' },
      { value: 'email_addr', label: 'Email' },
      { value: 'phone_num', label: 'Phone' }
    ],
    enableStaticValues: true,
    enableSourceFields: true,
    enableUserFields: false
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Refactored Data Mapper</h1>
      <DataMapperField 
// @ts-ignore
      field={fieldConfig} value={mappings} onChange={setMappings} />
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Current Mappings:</h3>
        <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto">
          {JSON.stringify(mappings, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export {GlobalJavaScriptField, JavaScriptEditor};