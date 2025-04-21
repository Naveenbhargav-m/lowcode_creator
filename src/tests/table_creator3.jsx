// Main App Component
import { useState, useEffect } from 'react';
import { Database } from 'lucide-react';

import { Plus, X, Save, Trash2, Table as TableIcon } from 'lucide-react';

let fieldStyle = {"color": "black"};
export default function TableBuilderV2() {
  const [tables, setTables] = useState([
    {
      id: 1,
      name: 'users',
      isNew: false,
      fields: [
        { id: 1, name: 'id', type: 'SERIAL', primaryKey: true, nullable: false, defaultValue: null, isNew: false },
        { id: 2, name: 'username', type: 'VARCHAR', length: 100, nullable: false, defaultValue: null, isNew: false },
        { id: 3, name: 'email', type: 'VARCHAR', length: 255, nullable: false, defaultValue: null, isNew: false },
        { id: 4, name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'NOW()', isNew: false },
      ]
    },
    {
      id: 2,
      name: 'posts',
      isNew: false,
      fields: [
        { id: 1, name: 'id', type: 'SERIAL', primaryKey: true, nullable: false, defaultValue: null, isNew: false },
        { id: 2, name: 'title', type: 'VARCHAR', length: 200, nullable: false, defaultValue: null, isNew: false },
        { id: 3, name: 'content', type: 'TEXT', nullable: true, defaultValue: null, isNew: false },
        { id: 4, name: 'user_id', type: 'INTEGER', nullable: false, defaultValue: null, isNew: false },
        { id: 5, name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'NOW()', isNew: false },
      ]
    }
  ]);
  
  const [relations, setRelations] = useState([
    { id: 1, fromTable: 'posts', fromField: 'user_id', toTable: 'users', toField: 'id', isNew: false }
  ]);
  
  const [activeTable, setActiveTable] = useState(null);
  const [showSql, setShowSql] = useState(false);
  const [jsonOutput, setJsonOutput] = useState('');
  
  // Track changed/deleted items for transactions
  const [deletedTables, setDeletedTables] = useState([]);
  const [deletedFields, setDeletedFields] = useState([]);
  const [deletedRelations, setDeletedRelations] = useState([]);
  
  // Set the first table as active by default
  useEffect(() => {
    if (tables.length > 0 && activeTable === null) {
      setActiveTable(tables[0].id);
    }
  }, [tables, activeTable]);
  
  // Find active table
  const currentTable = tables.find(t => t.id === activeTable);
  
  // Create a new table
  const handleCreateTable = (tableName) => {
    if (!tableName.trim()) return;
    
    const newId = Math.max(0, ...tables.map(t => t.id)) + 1;
    const newTable = {
      id: newId,
      name: tableName.trim().toLowerCase(),
      isNew: true,
      fields: [
        { id: 1, name: 'id', type: 'SERIAL', primaryKey: true, nullable: false, defaultValue: null, isNew: true }
      ]
    };
    
    setTables([...tables, newTable]);
    setActiveTable(newId);
    return newTable;
  };
  
  // Delete a table
  const handleDeleteTable = (tableId) => {
    const tableToDelete = tables.find(t => t.id === tableId);
    
    if (tableToDelete && !tableToDelete.isNew) {
      setDeletedTables([...deletedTables, tableToDelete]);
    }
    
    setTables(tables.filter(t => t.id !== tableId));
    
    // Delete relations involving this table
    if (tableToDelete) {
      const relationsToDelete = relations.filter(r => 
        r.fromTable === tableToDelete.name || r.toTable === tableToDelete.name
      );
      
      relationsToDelete.forEach(relation => {
        if (!relation.isNew) {
          setDeletedRelations([...deletedRelations, relation]);
        }
      });
      
      setRelations(relations.filter(r => 
        r.fromTable !== tableToDelete.name && r.toTable !== tableToDelete.name
      ));
    }
    
    // Set active table to another one if the active one is deleted
    if (activeTable === tableId) {
      const remainingTables = tables.filter(t => t.id !== tableId);
      setActiveTable(remainingTables.length > 0 ? remainingTables[0].id : null);
    }
  };
  
  // Add a new field to a table
  const handleAddField = (tableId) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        const newFieldId = Math.max(0, ...table.fields.map(f => f.id)) + 1;
        return {
          ...table,
          fields: [
            ...table.fields,
            { id: newFieldId, name: 'new_field', type: 'VARCHAR', length: 255, nullable: true, defaultValue: null, isNew: true }
          ]
        };
      }
      return table;
    }));
  };
  
  // Update a field property
  const handleUpdateField = (tableId, fieldId, property, value) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          fields: table.fields.map(field => {
            if (field.id === fieldId) {
              return { ...field, [property]: value };
            }
            return field;
          })
        };
      }
      return table;
    }));
  };
  
  // Delete a field
  const handleDeleteField = (tableId, fieldId) => {
    const tableToUpdate = tables.find(t => t.id === tableId);
    if (tableToUpdate) {
      const fieldToDelete = tableToUpdate.fields.find(f => f.id === fieldId);
      
      if (fieldToDelete && !fieldToDelete.isNew) {
        setDeletedFields([...deletedFields, { 
          tableName: tableToUpdate.name, 
          fieldName: fieldToDelete.name 
        }]);
      }
      
      setTables(tables.map(table => {
        if (table.id === tableId) {
          return {
            ...table,
            fields: table.fields.filter(field => field.id !== fieldId)
          };
        }
        return table;
      }));
    }
  };
  
  // Add a new relation
  const handleAddRelation = (fromTable, fromField, toTable, toField) => {
    const newId = Math.max(0, ...relations.map(r => r.id)) + 1;
    const newRelation = {
      id: newId,
      fromTable,
      fromField,
      toTable,
      toField,
      isNew: true
    };
    
    setRelations([...relations, newRelation]);
    return newRelation;
  };
  
  // Delete a relation
  const handleDeleteRelation = (relationId) => {
    const relationToDelete = relations.find(r => r.id === relationId);
    
    if (relationToDelete && !relationToDelete.isNew) {
      setDeletedRelations([...deletedRelations, relationToDelete]);
    }
    
    setRelations(relations.filter(r => r.id !== relationId));
  };
  
  // Generate transactions for the current state
  const generateTransactions = () => {
    let transactions = [];
    
    // Add transactions for new tables
    tables.filter(table => table.isNew).forEach(table => {
      transactions.push({
        id: `create_table_${table.id}`,
        type: 'create_table',
        table: table.name,
        fields: table.fields.map(field => ({
          name: field.name,
          dataType: field.type,
          length: field.length || null,
          primaryKey: !!field.primaryKey,
          nullable: !!field.nullable,
          defaultValue: field.defaultValue || null
        }))
      });
    });
    
    // Add transactions for new fields in existing tables
    tables.filter(table => !table.isNew).forEach(table => {
      table.fields.filter(field => field.isNew).forEach(field => {
        transactions.push({
          id: `add_field_${table.id}_${field.id}`,
          type: 'add_field',
          table: table.name,
          field: {
            name: field.name,
            dataType: field.type,
            length: field.length || null,
            primaryKey: !!field.primaryKey,
            nullable: !!field.nullable,
            defaultValue: field.defaultValue || null
          }
        });
      });
    });
    
    // Add transactions for updated fields
    // For simplicity, we'll only include modified fields that existed before (not new)
    // You would need to track original field values to implement this properly
    
    // Add transactions for deleted fields
    deletedFields.forEach(field => {
      transactions.push({
        id: `drop_field_${field.tableName}_${field.fieldName}`,
        type: 'drop_field',
        table: field.tableName,
        field: field.fieldName
      });
    });
    
    // Add transactions for deleted tables
    deletedTables.forEach(table => {
      transactions.push({
        id: `drop_table_${table.id}`,
        type: 'drop_table',
        table: table.name
      });
    });
    
    // Add transactions for new relations
    relations.filter(relation => relation.isNew).forEach(relation => {
      transactions.push({
        id: `create_relation_${relation.id}`,
        type: 'create_foreign_key',
        constraintName: `fk_${relation.fromTable}_${relation.toTable}`,
        sourceTable: relation.fromTable,
        sourceColumn: relation.fromField,
        targetTable: relation.toTable,
        targetColumn: relation.toField
      });
    });
    
    // Add transactions for deleted relations
    deletedRelations.forEach(relation => {
      transactions.push({
        id: `drop_relation_${relation.id}`,
        type: 'drop_foreign_key',
        constraintName: `fk_${relation.fromTable}_${relation.toTable}`,
        sourceTable: relation.fromTable
      });
    });
    
    return transactions;
  };
  
  // Generate SQL output 
  const handleGenerateJson = () => {
    // Generate the configuration JSON (for reloading the state)
    const configJson = {
      tables: tables.map(table => ({
        id: table.id,
        name: table.name,
        fields: table.fields.map(field => ({
          id: field.id,
          name: field.name,
          type: field.type,
          length: field.length || null,
          primaryKey: !!field.primaryKey,
          nullable: !!field.nullable,
          defaultValue: field.defaultValue || null
        }))
      })),
      relations: relations.map(relation => ({
        id: relation.id,
        fromTable: relation.fromTable,
        fromField: relation.fromField,
        toTable: relation.toTable,
        toField: relation.toField
      }))
    };
    
    // Generate the transactions JSON
    const transactions = generateTransactions();
    
    // Combine both outputs
    const output = {
      config: configJson,
      transactions: transactions
    };
    
    setJsonOutput(JSON.stringify(output, null, 2));
    setShowSql(true);
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50" style={{...fieldStyle}}>
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Database className="mr-2" />
            <h1 className="text-xl font-semibold">PostgreSQL Table Builder</h1>
          </div>
          <button 
            onClick={handleGenerateJson}
            className="bg-white text-indigo-600 px-4 py-2 rounded shadow hover:bg-indigo-50 transition-colors"
          >
            Generate SQL
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-white shadow-md border-r border-gray-200 p-4">
          {/* Tables List Component */}
          <TablesList 
            tables={tables}
            activeTable={activeTable}
            setActiveTable={setActiveTable}
            onCreateTable={handleCreateTable}
            onDeleteTable={handleDeleteTable}
          />
          
          {/* Relations Panel Component */}
          <RelationsPanel 
            tables={tables}
            relations={relations}
            onAddRelation={handleAddRelation}
            onDeleteRelation={handleDeleteRelation}
          />
        </div>
        
        {/* Main Content - Table Editor */}
        <div className="flex-1 p-6 overflow-auto">
          {currentTable ? (
            <TableEditor
              table={currentTable}
              onAddField={handleAddField}
              onUpdateField={handleUpdateField}
              onDeleteField={handleDeleteField}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Database size={48} className="mb-4" />
              <p>Select a table or create a new one</p>
            </div>
          )}
        </div>
      </div>
      
      {/* SQL Output Modal */}
      <SqlModal
        isOpen={showSql}
        onClose={() => setShowSql(false)}
        jsonOutput={jsonOutput}
      />
    </div>
  );
}

function TablesList({ tables, activeTable, setActiveTable, onCreateTable, onDeleteTable }) {
  const [isCreatingTable, setIsCreatingTable] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  
  const handleCreateTable = () => {
    if (newTableName.trim()) {
      onCreateTable(newTableName);
      setNewTableName('');
      setIsCreatingTable(false);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Tables</h2>
        <button 
          onClick={() => setIsCreatingTable(true)}
          className="bg-indigo-600 text-white p-1 rounded hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
      
      {/* New Table Input */}
      {isCreatingTable && (
        <div className="mb-4 flex items-center">
          <input
            type="text"
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            placeholder="Table name"
            className="flex-1 p-2 border border-gray-300 rounded mr-2"
          />
          <button
            onClick={handleCreateTable}
            className="bg-green-500 text-white p-1 rounded hover:bg-green-600 transition-colors"
          >
            <Save size={18} />
          </button>
          <button
            onClick={() => setIsCreatingTable(false)}
            className="ml-1 bg-gray-300 text-gray-700 p-1 rounded hover:bg-gray-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}
      
      {/* Tables List */}
      <ul className="space-y-1">
        {tables.map(table => (
          <li 
            key={table.id}
            className={`flex items-center justify-between p-2 rounded cursor-pointer ${
              activeTable === table.id ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
            }`}
            onClick={() => setActiveTable(table.id)}
          >
            <div className="flex items-center">
              <TableIcon size={16} className="mr-2" />
              <span>{table.name}</span>
              {table.isNew && (
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">New</span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTable(table.id);
              }}
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}


function RelationsPanel({ tables, relations, onAddRelation, onDeleteRelation }) {
  const [isCreatingRelation, setIsCreatingRelation] = useState(false);
  const [fromTable, setFromTable] = useState('');
  const [fromField, setFromField] = useState('');
  const [toTable, setToTable] = useState('');
  const [toField, setToField] = useState('');
  
  const handleAddRelation = () => {
    if (fromTable && fromField && toTable && toField) {
      onAddRelation(fromTable, fromField, toTable, toField);
      resetForm();
    }
  };
  
  const resetForm = () => {
    setFromTable('');
    setFromField('');
    setToTable('');
    setToField('');
    setIsCreatingRelation(false);
  };
  
  const getTableFields = (tableName) => {
    const table = tables.find(t => t.name === tableName);
    return table ? table.fields : [];
  };
  
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium">Relations</h2>
        <button 
          onClick={() => setIsCreatingRelation(true)}
          className="bg-indigo-600 text-white p-1 rounded hover:bg-indigo-700 transition-colors"
          disabled={tables.length < 2}
        >
          <Plus size={20} />
        </button>
      </div>
      
      {/* Relation Creator */}
      {isCreatingRelation && (
        <div className="mb-4 bg-gray-50 p-3 rounded border border-gray-200">
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">From Table</label>
            <select 
              value={fromTable} 
              onChange={(e) => {
                setFromTable(e.target.value);
                setFromField('');
              }}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            >
              <option value="">Select table</option>
              {tables.map(table => (
                <option key={table.id} value={table.name}>{table.name}</option>
              ))}
            </select>
            
            {fromTable && (
              <>
                <label className="block text-sm font-medium mb-1">From Field</label>
                <select 
                  value={fromField} 
                  onChange={(e) => setFromField(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                >
                  <option value="">Select field</option>
                  {getTableFields(fromTable).map(field => (
                    <option key={field.id} value={field.name}>{field.name}</option>
                  ))}
                </select>
              </>
            )}
          </div>
          
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">To Table</label>
            <select 
              value={toTable} 
              onChange={(e) => {
                setToTable(e.target.value);
                setToField('');
              }}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            >
              <option value="">Select table</option>
              {tables.map(table => (
                <option key={table.id} value={table.name}>{table.name}</option>
              ))}
            </select>
            
            {toTable && (
              <>
                <label className="block text-sm font-medium mb-1">To Field</label>
                <select 
                  value={toField} 
                  onChange={(e) => setToField(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                >
                  <option value="">Select field</option>
                  {getTableFields(toTable).map(field => (
                    <option key={field.id} value={field.name}>{field.name}</option>
                  ))}
                </select>
              </>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleAddRelation}
              disabled={!fromTable || !fromField || !toTable || !toField}
              className={`flex-1 py-1 rounded ${
                !fromTable || !fromField || !toTable || !toField
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              Add
            </button>
            <button
              onClick={resetForm}
              className="flex-1 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Relations List */}
      <ul className="space-y-1">
        {relations.map(relation => (
          <li key={relation.id} className="bg-gray-50 p-2 rounded text-sm">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">{relation.fromTable}</span>
                .{relation.fromField} → 
                <span className="font-medium">{relation.toTable}</span>
                .{relation.toField}
                {relation.isNew && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">New</span>
                )}
              </div>
              <button
                onClick={() => onDeleteRelation(relation.id)}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// components/TableEditor.jsx

// Data types for PostgreSQL
const DATA_TYPES = [
  'VARCHAR', 'TEXT', 'INTEGER', 'BIGINT', 'SMALLINT', 
  'BOOLEAN', 'DATE', 'TIME', 'TIMESTAMP', 'DECIMAL', 
  'NUMERIC', 'REAL', 'DOUBLE PRECISION', 'JSON', 'JSONB',
  'UUID', 'SERIAL', 'BIGSERIAL'
];

function TableEditor({ table, onAddField, onUpdateField, onDeleteField }) {
  const TABLE_HEADERS = ["name", "type", "length", "primary_key", "required", "default", "delete"];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {table.name}
          {table.isNew && (
            <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">New Table</span>
          )}
        </h2>
        <button
          onClick={() => onAddField(table.id)}
          className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add Field
        </button>
      </div>
      
      {/* Table Fields */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              {TABLE_HEADERS.map((header, index) => (
                <th key={index} className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.fields.map(field => (
              <tr key={field.id} className="border-t border-gray-200">
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => onUpdateField(table.id, field.id, 'name', e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                  {field.isNew && (
                    <span className="text-xs text-green-600">New</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={field.type}
                    onChange={(e) => onUpdateField(table.id, field.id, 'type', e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded"
                  >
                    {DATA_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  {['VARCHAR', 'CHAR', 'DECIMAL', 'NUMERIC'].includes(field.type) && (
                    <input
                      type="number"
                      value={field.length || ''}
                      onChange={(e) => onUpdateField(table.id, field.id, 'length', e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full p-1 border border-gray-300 rounded"
                    />
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={field.primaryKey || false}
                    onChange={(e) => onUpdateField(table.id, field.id, 'primaryKey', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={!field.nullable}
                    onChange={(e) => onUpdateField(table.id, field.id, 'nullable', !e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={field.defaultValue || ''}
                    onChange={(e) => onUpdateField(table.id, field.id, 'defaultValue', e.target.value || null)}
                    className="w-full p-1 border border-gray-300 rounded"
                    placeholder="Default value"
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onDeleteField(table.id, field.id)}
                    disabled={field.primaryKey}
                    className={`p-1 rounded ${
                      field.primaryKey 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    } transition-colors`}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SqlModal({ isOpen, onClose, jsonOutput }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium">JSON Output</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
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