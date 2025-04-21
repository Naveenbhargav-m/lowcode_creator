import { useState, useEffect } from 'react';
import { Plus, X, Trash2, Save, Database, Table as TableIcon } from 'lucide-react';

// Data types for PostgreSQL
const DATA_TYPES = [
  'VARCHAR', 'TEXT', 'INTEGER', 'BIGINT', 'SMALLINT', 
  'BOOLEAN', 'DATE', 'TIME', 'TIMESTAMP', 'DECIMAL', 
  'NUMERIC', 'REAL', 'DOUBLE PRECISION', 'JSON', 'JSONB',
  'UUID', 'SERIAL', 'BIGSERIAL'
];

let fieldStyle = {
    "color": "black"
};


let table_headers = ["name", "type", "length", "primary_key", "required", "default", "delete" ];
// Main component
export default function TableBuilder() {
  const [tables, setTables] = useState([
    {
      id: 1,
      name: 'users',
      fields: [
        { id: 1, name: 'id', type: 'SERIAL', primaryKey: true, nullable: false, defaultValue: null },
        { id: 2, name: 'username', type: 'VARCHAR', length: 100, nullable: false, defaultValue: null },
        { id: 3, name: 'email', type: 'VARCHAR', length: 255, nullable: false, defaultValue: null },
        { id: 4, name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'NOW()' },
      ]
    },
    {
      id: 2,
      name: 'posts',
      fields: [
        { id: 1, name: 'id', type: 'SERIAL', primaryKey: true, nullable: false, defaultValue: null },
        { id: 2, name: 'title', type: 'VARCHAR', length: 200, nullable: false, defaultValue: null },
        { id: 3, name: 'content', type: 'TEXT', nullable: true, defaultValue: null },
        { id: 4, name: 'user_id', type: 'INTEGER', nullable: false, defaultValue: null },
        { id: 5, name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'NOW()' },
      ]
    }
  ]);
  
  const [relations, setRelations] = useState([
    { id: 1, fromTable: 'posts', fromField: 'user_id', toTable: 'users', toField: 'id' }
  ]);
  
  const [activeTable, setActiveTable] = useState(null);
  const [isCreatingTable, setIsCreatingTable] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [showSql, setShowSql] = useState(false);
  const [jsonOutput, setJsonOutput] = useState('');
  
  // Set the first table as active by default
  useEffect(() => {
    if (tables.length > 0 && activeTable === null) {
      setActiveTable(tables[0].id);
    }
  }, [tables, activeTable]);
  
  // Find active table
  const currentTable = tables.find(t => t.id === activeTable);
  
  // Create a new table
  const handleCreateTable = () => {
    console.log("new table name:",newTableName);
    if (!newTableName.trim()) return;
    
    const newId = Math.max(0, ...tables.map(t => t.id)) + 1;
    const newTable = {
      id: newId,
      name: newTableName.trim().toLowerCase(),
      fields: [
        { id: 1, name: 'id', type: 'SERIAL', primaryKey: true, nullable: false, defaultValue: null }
      ]
    };
    
    setTables([...tables, newTable]);
    setActiveTable(newId);
    setNewTableName('');
    setIsCreatingTable(false);
  };
  
  // Delete a table
  const handleDeleteTable = (tableId) => {
    setTables(tables.filter(t => t.id !== tableId));
    
    // Delete relations involving this table
    const tableToDelete = tables.find(t => t.id === tableId);
    if (tableToDelete) {
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
            { id: newFieldId, name: 'new_field', type: 'VARCHAR', length: 255, nullable: true, defaultValue: null }
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
    setTables(tables.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          fields: table.fields.filter(field => field.id !== fieldId)
        };
      }
      return table;
    }));
  };
  
  // Add a new relation
  const handleAddRelation = () => {
    if (tables.length < 2) return;
    
    const fromTable = tables[0].name;
    const toTable = tables[1].name;
    const fromField = `${toTable}_id`;
    const toField = 'id';
    
    // Add the foreign key field to the first table if it doesn't exist
    const table1 = tables.find(t => t.name === fromTable);
    if (table1 && !table1.fields.some(f => f.name === fromField)) {
      handleAddField(table1.id);
      const newFieldId = Math.max(0, ...table1.fields.map(f => f.id)) + 1;
      handleUpdateField(table1.id, newFieldId, 'name', fromField);
      handleUpdateField(table1.id, newFieldId, 'type', 'INTEGER');
    }
    
    // Add the relation
    const newId = Math.max(0, ...relations.map(r => r.id)) + 1;
    const newRelation = {
      id: newId,
      fromTable,
      fromField,
      toTable,
      toField
    };
    
    setRelations([...relations, newRelation]);
  };
  
  // Delete a relation
  const handleDeleteRelation = (relationId) => {
    setRelations(relations.filter(r => r.id !== relationId));
  };
  
  // Generate SQL statements for the tables and relations
  const generateSql = () => {
    let sqlStatements = [];
    
    // Create tables
    tables.forEach(table => {
      let fieldDefs = table.fields.map(field => {
        let def = `${field.name} ${field.type}`;
        if (field.length) def += `(${field.length})`;
        if (field.primaryKey) def += ' PRIMARY KEY';
        if (!field.nullable) def += ' NOT NULL';
        if (field.defaultValue) def += ` DEFAULT ${field.defaultValue}`;
        return def;
      }).join(', ');
      
      sqlStatements.push(`CREATE TABLE ${table.name} (${fieldDefs});`);
    });
    
    // Create foreign key constraints
    relations.forEach(relation => {
      sqlStatements.push(
        `ALTER TABLE ${relation.fromTable} ADD CONSTRAINT fk_${relation.fromTable}_${relation.toTable} ` +
        `FOREIGN KEY (${relation.fromField}) REFERENCES ${relation.toTable}(${relation.toField});`
      );
    });
    
    return sqlStatements;
  };
  
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
    
    // Generate the transactions JSON (for backend to process)
    const transactions = generateTransactions();
    
    // Combine both outputs
    const output = {
      config: configJson,
      transactions: transactions
    };
    
    setJsonOutput(JSON.stringify(output, null, 2));
    setShowSql(true);
  };
  
  const generateTransactions = () => {
    let transactions = [];
    
    // Create table transactions
    tables.forEach(table => {
      const tableTransaction = {
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
      };
      
      transactions.push(tableTransaction);
    });
    
    // Create foreign key transactions
    relations.forEach(relation => {
      const relationTransaction = {
        id: `create_relation_${relation.id}`,
        type: 'create_foreign_key',
        constraintName: `fk_${relation.fromTable}_${relation.toTable}`,
        sourceTable: relation.fromTable,
        sourceColumn: relation.fromField,
        targetTable: relation.toTable,
        targetColumn: relation.toField
      };
      
      transactions.push(relationTransaction);
    });
    
    return transactions;
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
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
        {/* Left Sidebar - Tables List */}
        <div className="w-64 bg-white shadow-md border-r border-gray-200 p-4">
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
            <div className="mb-4 flex items-center relative" style={{ zIndex: 100,...fieldStyle }}>
            <input
              type="text"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              placeholder="Table name"
              className="flex-1 p-2 border border-gray-300 rounded mr-2"
              
            />
            <button
              onClick={() => handleCreateTable()}
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
          <ul className="space-y-1" style={{...fieldStyle}}>
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
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTable(table.id);
                  }}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
          
          {/* Relations Section */}
          <div className="mt-6" style={{...fieldStyle}}>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">Relations</h2>
              <button 
                onClick={handleAddRelation}
                className="bg-indigo-600 text-white p-1 rounded hover:bg-indigo-700 transition-colors"
                disabled={tables.length < 2}
              >
                <Plus size={20} />
              </button>
            </div>
            
            <ul className="space-y-1">
              {relations.map(relation => (
                <li key={relation.id} className="bg-gray-50 p-2 rounded text-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{relation.fromTable}</span>
                      .{relation.fromField} → 
                      <span className="font-medium">{relation.toTable}</span>
                      .{relation.toField}
                    </div>
                    <button
                      onClick={() => handleDeleteRelation(relation.id)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Main Content - Table Editor */}
        <div className="flex-1 p-6 overflow-auto">
          {currentTable ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentTable.name}
                </h2>
                <button
                  onClick={() => handleAddField(currentTable.id)}
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
                     {table_headers.map((value)=> {
                        return (
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{value}</th>
                        );
                     })}
                    </tr>
                  </thead>
                  <tbody>
                    {currentTable.fields.map(field => (
                      <tr key={field.id} className="border-t border-gray-200">
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={field.name}
                            onChange={(e) => handleUpdateField(currentTable.id, field.id, 'name', e.target.value)}
                            className="w-full p-1 border border-gray-300 rounded"
                            style={{...fieldStyle}}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={field.type}
                            onChange={(e) => handleUpdateField(currentTable.id, field.id, 'type', e.target.value)}
                            className="w-full p-1 border border-gray-300 rounded"
                            style={{...fieldStyle}}

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
                              onChange={(e) => handleUpdateField(currentTable.id, field.id, 'length', e.target.value ? parseInt(e.target.value) : null)}
                              className="w-full p-1 border border-gray-300 rounded"
                              style={{...fieldStyle}}

                            />
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={field.primaryKey || false}
                            onChange={(e) => handleUpdateField(currentTable.id, field.id, 'primaryKey', e.target.checked)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            style={{...fieldStyle}}

                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={field.nullable || false}
                            onChange={(e) => handleUpdateField(currentTable.id, field.id, 'nullable', e.target.checked)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            style={{...fieldStyle}}

                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={field.defaultValue || ''}
                            onChange={(e) => handleUpdateField(currentTable.id, field.id, 'defaultValue', e.target.value || null)}
                            className="w-full p-1 border border-gray-300 rounded"
                            placeholder="Default value"
                            style={{...fieldStyle}}

                          />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteField(currentTable.id, field.id)}
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
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <TableIcon size={48} className="mb-4" />
              <p>Select a table or create a new one</p>
            </div>
          )}
        </div>
      </div>
      
      {showSql && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{...fieldStyle}}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium">JSON Output</h3>
              <button
                onClick={() => setShowSql(false)}
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
                onClick={() => setShowSql(false)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}