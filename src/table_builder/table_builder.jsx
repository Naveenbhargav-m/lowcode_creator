import { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Database, Plus, X, Save, Trash2, Table, Settings, ChevronRight } from 'lucide-react';
import TransactionModal from './transactions_modal';
import  { createChangeDetector,TransactionValidator } from './change_tracker';

// Mock functions - replace with your actual implementations
const generateUID = () => Math.random().toString(36).substr(2, 9);

const LoadTables = async () => {
  return [];
};

const SaveTablesData = async (config) => {
  console.log('Saving:', config);
  return { success: true };
};

const DATA_TYPES = [
  'VARCHAR', 'TEXT', 'INTEGER', 'BIGINT', 'SMALLINT', 
  'BOOLEAN', 'DATE', 'TIME', 'TIMESTAMP', 'DECIMAL', 
  'NUMERIC', 'REAL', 'DOUBLE PRECISION', 'JSON', 'JSONB',
  'UUID', 'SERIAL', 'BIGSERIAL'
];

// Helper function to get default values for field types
const getDefaultFieldConfig = (type) => {
  const config = {
    length: null,
    defaultValue: null,
    nullable: true,
    primaryKey: false
  };

  switch (type) {
    case 'VARCHAR':
      config.length = 255;
      break;
    case 'DECIMAL':
    case 'NUMERIC':
      config.length = 10;
      break;
    case 'SERIAL':
    case 'BIGSERIAL':
      config.nullable = false;
      break;
    default:
      break;
  }

  return config;
};

export default function TableBuilderV7() {
  const [tables, setTables] = useState([]);
  const [relations, setRelations] = useState([]);
  const [activeTable, setActiveTable] = useState(null);
  const [activeField, setActiveField] = useState(null);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [originalData, setOriginalData] = useState({ tables: [], relations: [] });

  const [transactionGenerator] = useState(() => createChangeDetector({}));
const [lastGeneratedTransactions, setLastGeneratedTransactions] = useState([]);
const [showTransactionModal, setShowTransactionModal] = useState(false);

// Modify your sync handler to generate transactions
const handleSync = async () => {
  const transactions = generateTransactions();
  
  if (transactions.length === 0) {
    console.log('No changes detected');
    return;
  }

  const validation = TransactionValidator.validate(transactions);
  
  if (!validation.isValid) {
    console.error('Transaction validation failed:', validation.errors);
    alert('Invalid transactions detected. Please check console for details.');
    return;
  }

  const config = { 
    tables, 
    relations, 
    transactions // Send transactions instead of full data
  };
  
  try {
    const result = await SaveTablesData(config);
    if (result.success) {
      // Update original data after successful sync
      setOriginalData({ 
        tables: JSON.parse(JSON.stringify(tables)), 
        relations: JSON.parse(JSON.stringify(relations)) 
      });
      setLastGeneratedTransactions(transactions);
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
};

// New function to generate transactions
const generateTransactions = () => {
  const currentData = { tables, relations };
  return transactionGenerator.detectChanges(originalData, currentData);
};

// New function to view transactions without syncing
const handleViewTransactions = () => {
  const transactions = generateTransactions();
  setLastGeneratedTransactions(transactions);
  setShowTransactionModal(true);
};


  // Load initial data
  useEffect(() => {
    LoadTables().then((data) => {
      if (!data?.[0]?.tables_data) return;
      
      const { tables = [], relations = [] } = data[0].tables_data;
      setTables(tables);
      setRelations(relations);
      setOriginalData({ tables: JSON.parse(JSON.stringify(tables)), relations: JSON.parse(JSON.stringify(relations)) });
      
      if (tables.length > 0 && !activeTable) {
        setActiveTable(tables[0].fid);
      }
    });
  }, []);

  // Close drawer when activeField changes
  useEffect(() => {
    if (activeField) {
      setRightDrawerOpen(true);
    } else {
      setRightDrawerOpen(false);
    }
  }, [activeField]);

  // Table operations
  const createTable = (name) => {
    if (!name.trim()) return;
    
    const newTable = {
      id: Math.max(0, ...tables.map(t => t.id)) + 1,
      fid: generateUID(),
      name: name.trim().toLowerCase(),
      fields: [
        { id: 1, fid: generateUID(), name: 'id', type: 'SERIAL', primaryKey: true, nullable: false }
      ]
    };
    
    setTables(prev => [...prev, newTable]);
    setActiveTable(newTable.fid);
  };

  const deleteTable = (tableId) => {
    const table = tables.find(t => t.fid === tableId);
    if (!table) return;

    // Remove related relations
    setRelations(prev => prev.filter(r => 
      r.fromTable !== table.name && r.toTable !== table.name
    ));
    
    setTables(prev => prev.filter(t => t.fid !== tableId));
    
    if (activeTable === tableId) {
      const remaining = tables.filter(t => t.fid !== tableId);
      setActiveTable(remaining.length > 0 ? remaining[0].fid : null);
    }

    // Close drawer if field from deleted table was active
    if (activeField) {
      const deletedTable = tables.find(t => t.fid === tableId);
      if (deletedTable?.fields.some(f => f.fid === activeField)) {
        setActiveField(null);
      }
    }
  };

  // Field operations
  const addField = (tableId) => {
    const defaultConfig = getDefaultFieldConfig('VARCHAR');
    const newField = {
      id: Date.now(),
      fid: generateUID(),
      name: 'new_field',
      type: 'VARCHAR',
      ...defaultConfig
    };

    setTables(prev => prev.map(table => 
      table.fid === tableId 
        ? { ...table, fields: [...table.fields, newField] }
        : table
    ));

    // Auto-open the new field for editing
    setActiveField(newField.fid);
  };

  const updateField = (tableId, fieldId, property, value) => {
    setTables(prev => prev.map(table => 
      table.fid === tableId 
        ? {
            ...table,
            fields: table.fields.map(field => {
              if (field.fid === fieldId) {
                const updatedField = { ...field, [property]: value };
                
                // If type changed, reset type-specific properties
                if (property === 'type') {
                  const defaultConfig = getDefaultFieldConfig(value);
                  return {
                    ...updatedField,
                    length: defaultConfig.length,
                    defaultValue: defaultConfig.defaultValue
                  };
                }
                
                return updatedField;
              }
              return field;
            })
          }
        : table
    ));
  };

  const deleteField = (tableId, fieldId) => {
    setTables(prev => prev.map(table => 
      table.fid === tableId 
        ? { ...table, fields: table.fields.filter(f => f.fid !== fieldId) }
        : table
    ));

    // Close drawer if this field was active
    if (activeField === fieldId) {
      setActiveField(null);
    }
  };

  // Relation operations
  const addRelation = (fromTable, fromField, toTable, toField) => {
    const newRelation = {
      id: Date.now(),
      fid: generateUID(),
      fromTable,
      fromField,
      toTable,
      toField
    };
    
    setRelations(prev => [...prev, newRelation]);
  };

  const deleteRelation = (relationId) => {
    setRelations(prev => prev.filter(r => r.fid !== relationId));
  };

  const currentTable = tables.find(t => t.fid === activeTable);
  const currentField = activeField ? 
    tables.flatMap(t => t.fields).find(f => f.fid === activeField) : null;
  const currentFieldTableId = activeField ? 
    tables.find(t => t.fields.some(f => f.fid === activeField))?.fid : null;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with Sync Button */}
      <div className="flex items-center justify-end px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex gap-2">
          <button 
            onClick={handleViewTransactions}
            className="bg-gray-600 text-white px-4 py-2 rounded-md shadow hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 00-2 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            View Changes
          </button>
          
          <button 
            onClick={handleSync}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Sync ({generateTransactions().length})
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-white shadow-md border-r border-gray-200 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <TablesList 
              tables={tables}
              activeTable={activeTable}
              onTableSelect={setActiveTable}
              onCreateTable={createTable}
              onDeleteTable={deleteTable}
            />
            
            <div className="mt-6">
              <RelationsPanel 
                tables={tables}
                relations={relations}
                onAddRelation={addRelation}
                onDeleteRelation={deleteRelation}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${rightDrawerOpen ? 'mr-80' : ''}`}>
          <div className="h-full overflow-auto">
            <div className="max-w-4xl mx-auto p-6" style={{maxWidth:"500px"}}>
              {currentTable ? (
                <TableEditor
                  table={currentTable}
                  activeField={activeField}
                  onFieldSelect={setActiveField}
                  onAddField={addField}
                  onDeleteField={deleteField}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Database size={48} className="mb-4" />
                  <p className="text-lg">Select a table or create a new one</p>
                </div>
              )}
            </div>
          </div>
            {showTransactionModal && (
              <TransactionModal 
                transactions={lastGeneratedTransactions}
                onClose={() => setShowTransactionModal(false)}
                onSync={handleSync}
              />
            )}
        </div>

        {/* Right Drawer */}
        {rightDrawerOpen && currentField && (
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg border-l border-gray-200 z-10">
            <FieldConfigDrawer
              field={currentField}
              tableId={currentFieldTableId}
              onUpdate={updateField}
              onClose={() => setActiveField(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function TablesList({ tables, activeTable, onTableSelect, onCreateTable, onDeleteTable }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    if (newName.trim()) {
      onCreateTable(newName);
      setNewName('');
      setIsCreating(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Tables</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white p-1.5 rounded hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {isCreating && (
        <div className="mb-4 space-y-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target["value"])}
            placeholder="Table name"
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

      <div className="space-y-1 max-h-64 overflow-y-auto">
        {tables.map(table => (
          <div 
            key={table.fid}
            className={`flex items-center justify-between p-2.5 rounded-md cursor-pointer transition-colors ${
              activeTable === table.fid 
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                : 'hover:bg-gray-100'
            }`}
            onClick={() => onTableSelect(table.fid)}
          >
            <div className="flex items-center">
              <Table size={16} className="mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">{table.name}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTable(table.fid);
              }}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function RelationsPanel({ tables, relations, onAddRelation, onDeleteRelation }) {
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({ fromTable: '', fromField: '', toTable: '', toField: '' });

  const handleAdd = () => {
    if (form.fromTable && form.fromField && form.toTable && form.toField) {
      onAddRelation(form.fromTable, form.fromField, form.toTable, form.toField);
      setForm({ fromTable: '', fromField: '', toTable: '', toField: '' });
      setIsCreating(false);
    }
  };

  const getTableFields = (tableName) => {
    const table = tables.find(t => t.name === tableName);
    return table?.fields || [];
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Relations</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white p-1.5 rounded hover:bg-indigo-700 transition-colors disabled:bg-gray-300"
          disabled={tables.length < 2}
        >
          <Plus size={18} />
        </button>
      </div>

      {isCreating && (
        <div className="bg-indigo-50 p-3 rounded-md border border-indigo-200 mb-4">
          <h3 className="text-sm font-semibold mb-3 text-indigo-700">Create Relation</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700">From Table</label>
              <select 
                value={form.fromTable}
                onChange={(e) => setForm({...form, fromTable: e.target["value"], fromField: ''})}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select table</option>
                {tables.map(table => (
                  <option key={table.fid} value={table.name}>{table.name}</option>
                ))}
              </select>
            </div>

            {form.fromTable && (
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700">From Field</label>
                <select 
                  value={form.fromField}
                  onChange={(e) => setForm({...form, fromField: e.target["value"]})}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select field</option>
                  {getTableFields(form.fromTable).map(field => (
                    <option key={field.fid} value={field.name}>{field.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700">To Table</label>
              <select 
                value={form.toTable}
                onChange={(e) => setForm({...form, toTable: e.target["value"], toField: ''})}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select table</option>
                {tables.map(table => (
                  <option key={table.fid} value={table.name}>{table.name}</option>
                ))}
              </select>
            </div>

            {form.toTable && (
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700">To Field</label>
                <select 
                  value={form.toField}
                  onChange={(e) => setForm({...form, toField: e.target["value"]})}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select field</option>
                  {getTableFields(form.toTable).map(field => (
                    <option key={field.fid} value={field.name}>{field.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAdd}
                disabled={!form.fromTable || !form.fromField || !form.toTable || !form.toField}
                className="flex-1 py-2 rounded-md text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {relations.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No relations defined</p>
        ) : (
          relations.map(relation => (
            <div key={relation.fid} className="bg-white border border-gray-200 rounded-md p-2.5 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-xs">
                  <span className="font-medium text-gray-900">{relation.fromTable}</span>
                  <span className="text-gray-500 mx-1">.{relation.fromField}</span>
                  <ArrowRight size={12} className="mx-1 text-gray-400" />
                  <span className="font-medium text-gray-900">{relation.toTable}</span>
                  <span className="text-gray-500 mx-1">.{relation.toField}</span>
                </div>
                <button
                  onClick={() => onDeleteRelation(relation.fid)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TableEditor({ table, activeField, onFieldSelect, onAddField, onDeleteField }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{table.name}</h2>
        <button
          onClick={() => onAddField(table.fid)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Add Field
        </button>
      </div>

      <div className="space-y-3">
        {table.fields.map(field => (
          <FieldRow
            key={field.fid}
            field={field}
            tableId={table.fid}
            isActive={activeField === field.fid}
            onSelect={() => onFieldSelect(field.fid)}
            onDelete={onDeleteField}
          />
        ))}

        {table.fields.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500">No fields defined yet. Click "Add Field" to create one.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FieldRow({ field, tableId, isActive, onSelect, onDelete }) {
  const getTypeDisplay = (field) => {
    if (field.length && ['VARCHAR', 'CHAR', 'DECIMAL', 'NUMERIC'].includes(field.type)) {
      return `${field.type}(${field.length})`;
    }
    return field.type;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border transition-all ${
      isActive ? 'border-indigo-300 shadow-md' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div 
        className={`flex items-center justify-between p-4 cursor-pointer ${
          isActive ? 'bg-indigo-50' : 'hover:bg-gray-50'
        }`}
        onClick={onSelect}
      >
        <div className="flex items-center gap-3">
          <Settings size={16} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{field.name || 'Unnamed Field'}</span>
              {field.primaryKey && (
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-medium">
                  PRIMARY KEY
                </span>
              )}
              {!field.nullable && !field.primaryKey && (
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-medium">
                  REQUIRED
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 mt-0.5">
              {getTypeDisplay(field)}
              {field.defaultValue && (
                <span className="ml-2">• Default: {field.defaultValue}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(tableId, field.fid);
            }}
            disabled={field.primaryKey}
            className={`p-1.5 rounded transition-colors ${
              field.primaryKey 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <Trash2 size={16} />
          </button>
          <ChevronRight size={16} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
        </div>
      </div>
    </div>
  );
}

function FieldConfigDrawer({ field, tableId, onUpdate, onClose }) {
  const needsLength = ['VARCHAR', 'CHAR', 'DECIMAL', 'NUMERIC'].includes(field.type);
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Field Configuration</h3>
          <p className="text-sm text-gray-500 mt-1">{field.name}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Field Name</label>
            <input
              type="text"
              value={field.name || ''}
              onChange={(e) => onUpdate(tableId, field.fid, 'name', e.target["value"])}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter field name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Type</label>
            <select
              value={field.type}
              onChange={(e) => onUpdate(tableId, field.fid, 'type', e.target["value"])}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {DATA_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {needsLength && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.type === 'VARCHAR' || field.type === 'CHAR' ? 'Length' : 'Precision'}
              </label>
              <input
                type="number"
                value={field.length || ''}
                onChange={(e) => onUpdate(tableId, field.fid, 'length', e.target["value"] ? parseInt(e.target["value"]) : null)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter length"
                min="1"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Value</label>
            <input
              type="text"
              value={field.defaultValue || ''}
              onChange={(e) => onUpdate(tableId, field.fid, 'defaultValue', e.target["value"] || null)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter default value"
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Constraints</h4>
            
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={field.primaryKey || false}
                // @ts-ignore
                onChange={(e) => onUpdate(tableId, field.fid, 'primaryKey', e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">Primary Key</div>
                <div className="text-xs text-gray-500">Uniquely identifies each row</div>
              </div>
            </label>
            
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={!field.nullable}
                // @ts-ignore
                onChange={(e) => onUpdate(tableId, field.fid, 'nullable', !e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">Required</div>
                <div className="text-xs text-gray-500">Field cannot be empty</div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}