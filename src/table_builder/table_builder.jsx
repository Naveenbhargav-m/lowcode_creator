import { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Database, Plus, X, Save, Trash2, Table } from 'lucide-react';

// Mock functions - replace with your actual implementations
const generateUID = () => Math.random().toString(36).substr(2, 9);
const GenerateTransactionsV2 = (origTables, tables, origRelations, relations) => ({ changes: 'mock' });
const LoadTables = () => Promise.resolve([{ tables_data: { tables: [], relations: [] } }]);
const SaveTablesData = (data) => Promise.resolve(data.config);

const DATA_TYPES = [
  'VARCHAR', 'TEXT', 'INTEGER', 'BIGINT', 'SMALLINT', 
  'BOOLEAN', 'DATE', 'TIME', 'TIMESTAMP', 'DECIMAL', 
  'NUMERIC', 'REAL', 'DOUBLE PRECISION', 'JSON', 'JSONB',
  'UUID', 'SERIAL', 'BIGSERIAL'
];

export default function TableBuilderV7() {
  const [tables, setTables] = useState([]);
  const [relations, setRelations] = useState([]);
  const [activeTable, setActiveTable] = useState(null);
  const [activeField, setActiveField] = useState(null);
  const [originalData, setOriginalData] = useState({ tables: [], relations: [] });
  const [showSql, setShowSql] = useState(false);
  const [jsonOutput, setJsonOutput] = useState('');

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
  };

  // Field operations
  const addField = (tableId) => {
    const newField = {
      id: Date.now(),
      fid: generateUID(),
      name: 'new_field',
      type: 'VARCHAR',
      length: 255,
      nullable: true
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
            fields: table.fields.map(field => 
              field.fid === fieldId 
                ? { ...field, [property]: value }
                : field
            )
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

  // Sync operation
  const handleSync = async () => {
    const config = { tables, relations };
    const transactions = GenerateTransactionsV2(originalData.tables, tables, originalData.relations, relations);
    const output = { config, transactions };
    
    try {
      const result = await SaveTablesData(output);
      // Update original data to current state after successful sync
      setOriginalData({ tables: JSON.parse(JSON.stringify(tables)), relations: JSON.parse(JSON.stringify(relations)) });
      setJsonOutput(JSON.stringify(output, null, 2));
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const currentTable = tables.find(t => t.fid === activeTable);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Table Builder</h1>
          <button 
            onClick={handleSync}
            className="bg-white text-indigo-600 px-4 py-2 rounded shadow hover:bg-indigo-50 transition-colors"
          >
            Sync
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Made fully scrollable */}
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
        <div className="flex-1 p-6 overflow-auto">
          {currentTable ? (
            <TableEditor
              table={currentTable}
              activeField={activeField}
              onFieldSelect={setActiveField}
              onAddField={addField}
              onUpdateField={updateField}
              onDeleteField={deleteField}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Database size={48} className="mb-4" />
              <p>Select a table or create a new one</p>
            </div>
          )}
        </div>
      </div>

      {/* SQL Modal */}
      {showSql && (
        <SqlModal
          isOpen={showSql}
          onClose={() => setShowSql(false)}
          jsonOutput={jsonOutput}
        />
      )}
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
        <h2 className="text-lg font-medium text-gray-900">Tables</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white p-1 rounded hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {isCreating && (
        <div className="mb-4 flex items-center">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Table name"
            className="flex-1 p-2 border border-gray-300 rounded mr-2 text-sm"
            autoFocus
          />
          <button onClick={handleCreate} className="bg-green-500 text-white p-1 rounded hover:bg-green-600">
            <Save size={18} />
          </button>
          <button onClick={() => setIsCreating(false)} className="ml-1 bg-gray-300 text-gray-700 p-1 rounded hover:bg-gray-400">
            <X size={18} />
          </button>
        </div>
      )}

      <div className="space-y-1 max-h-64 overflow-y-auto">
        {tables.map(table => (
          <div 
            key={table.fid}
            className={`flex items-center justify-between p-2 rounded cursor-pointer ${
              activeTable === table.fid ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
            }`}
            onClick={() => onTableSelect(table.fid)}
          >
            <div className="flex items-center">
              <Table size={16} className="mr-2" />
              <span className="text-sm">{table.name}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTable(table.fid);
              }}
              className="text-gray-500 hover:text-red-500 transition-colors"
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
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium text-gray-900">Relations</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white p-1 rounded hover:bg-indigo-700 transition-colors"
          disabled={tables.length < 2}
        >
          <Plus size={20} />
        </button>
      </div>

      {isCreating && (
        <div className="bg-indigo-50 p-3 rounded border mb-4 max-h-80 overflow-y-auto">
          <h3 className="text-sm font-medium mb-3 text-indigo-700">Create Relation</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">From Table</label>
              <select 
                value={form.fromTable}
                onChange={(e) => setForm({...form, fromTable: e.target.value, fromField: ''})}
                className="w-full p-2 text-sm border rounded"
              >
                <option value="">Select table</option>
                {tables.map(table => (
                  <option key={table.fid} value={table.name}>{table.name}</option>
                ))}
              </select>
            </div>

            {form.fromTable && (
              <div>
                <label className="block text-xs font-medium mb-1">From Field</label>
                <select 
                  value={form.fromField}
                  onChange={(e) => setForm({...form, fromField: e.target.value})}
                  className="w-full p-2 text-sm border rounded"
                >
                  <option value="">Select field</option>
                  {getTableFields(form.fromTable).map(field => (
                    <option key={field.fid} value={field.name}>{field.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium mb-1">To Table</label>
              <select 
                value={form.toTable}
                onChange={(e) => setForm({...form, toTable: e.target.value, toField: ''})}
                className="w-full p-2 text-sm border rounded"
              >
                <option value="">Select table</option>
                {tables.map(table => (
                  <option key={table.fid} value={table.name}>{table.name}</option>
                ))}
              </select>
            </div>

            {form.toTable && (
              <div>
                <label className="block text-xs font-medium mb-1">To Field</label>
                <select 
                  value={form.toField}
                  onChange={(e) => setForm({...form, toField: e.target.value})}
                  className="w-full p-2 text-sm border rounded"
                >
                  <option value="">Select field</option>
                  {getTableFields(form.toTable).map(field => (
                    <option key={field.fid} value={field.name}>{field.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex space-x-2">
              <button
                onClick={handleAdd}
                disabled={!form.fromTable || !form.fromField || !form.toTable || !form.toField}
                className="flex-1 py-2 rounded text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300"
              >
                Add
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
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
            <div key={relation.fid} className="bg-white border rounded p-2 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-xs">
                  <span className="font-medium">{relation.fromTable}</span>
                  <span className="text-gray-500 mx-1">.{relation.fromField}</span>
                  <ArrowRight size={12} className="mx-1" />
                  <span className="font-medium">{relation.toTable}</span>
                  <span className="text-gray-500 mx-1">.{relation.toField}</span>
                </div>
                <button
                  onClick={() => onDeleteRelation(relation.fid)}
                  className="text-gray-400 hover:text-red-500"
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

function TableEditor({ table, activeField, onFieldSelect, onAddField, onUpdateField, onDeleteField }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{table.name}</h2>
        <button
          onClick={() => onAddField(table.fid)}
          className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add Field
        </button>
      </div>

      <div className="space-y-3">
        {table.fields.map(field => (
          <FieldEditor
            key={field.fid}
            field={field}
            tableId={table.fid}
            isActive={activeField === field.fid}
            onToggle={() => onFieldSelect(activeField === field.fid ? null : field.fid)}
            onUpdate={onUpdateField}
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

function FieldEditor({ field, tableId, isActive, onToggle, onUpdate, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div 
        className={`flex items-center justify-between p-3 cursor-pointer ${
          isActive ? 'bg-indigo-50 border-b border-indigo-100' : 'hover:bg-gray-50'
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center">
          <div>
            <div className="flex items-center">
              <span className="font-medium">{field.name || 'Unnamed Field'}</span>
              {field.primaryKey && (
                <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">PK</span>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {field.type}{field.length ? `(${field.length})` : ''}
            </span>
          </div>
        </div>
        
        <div className="flex items-center">
          <button className="text-gray-400 hover:text-indigo-600 p-1">
            {isActive ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(tableId, field.fid);
            }}
            disabled={field.primaryKey}
            className={`ml-1 p-1 rounded ${
              field.primaryKey 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-400 hover:text-red-600'
            }`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {isActive && (
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={field.name || ''}
                onChange={(e) => onUpdate(tableId, field.fid, 'name', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Field name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={field.type}
                onChange={(e) => onUpdate(tableId, field.fid, 'type', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                {DATA_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {['VARCHAR', 'CHAR', 'DECIMAL', 'NUMERIC'].includes(field.type) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
                <input
                  type="number"
                  value={field.length || ''}
                  onChange={(e) => onUpdate(tableId, field.fid, 'length', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Value</label>
              <input
                type="text"
                value={field.defaultValue || ''}
                onChange={(e) => onUpdate(tableId, field.fid, 'defaultValue', e.target.value || null)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="col-span-2 flex space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={field.primaryKey || false}
                  onChange={(e) => onUpdate(tableId, field.fid, 'primaryKey', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Primary Key</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={!field.nullable}
                  onChange={(e) => onUpdate(tableId, field.fid, 'nullable', !e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Required</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SqlModal({ isOpen, onClose, jsonOutput }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium">JSON Output</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="p-4">
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
            {jsonOutput}
          </pre>
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}