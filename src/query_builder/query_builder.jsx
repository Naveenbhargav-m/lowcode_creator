import React, { useState, useEffect } from 'react';
import { ArrowRight, PlusCircle, Trash2, FileCode, Database, Table, Settings, Code, Link2, Play, Check, Save } from 'lucide-react';

// Mock data for tables and their fields
const mockTables = [
  { 
    id: 'users', 
    name: 'Users', 
    fields: [
      { id: 'id', name: 'ID', type: 'number' },
      { id: 'name', name: 'Name', type: 'string' },
      { id: 'email', name: 'Email', type: 'string' },
      { id: 'created_at', name: 'Created At', type: 'datetime' }
    ]
  },
  { 
    id: 'orders', 
    name: 'Orders', 
    fields: [
      { id: 'id', name: 'ID', type: 'number' },
      { id: 'user_id', name: 'User ID', type: 'number' },
      { id: 'amount', name: 'Amount', type: 'number' },
      { id: 'status', name: 'Status', type: 'string' },
      { id: 'created_at', name: 'Created At', type: 'datetime' }
    ]
  },
  { 
    id: 'products', 
    name: 'Products', 
    fields: [
      { id: 'id', name: 'ID', type: 'number' },
      { id: 'name', name: 'Name', type: 'string' },
      { id: 'price', name: 'Price', type: 'number' },
      { id: 'stock', name: 'Stock', type: 'number' }
    ]
  }
];

// Badge component for selected fields, tables, etc.
const Badge = ({ children, onRemove, color = "bg-blue-100 text-blue-800" }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color} mr-2 mb-2`}>
    {children}
    {onRemove && (
      <button onClick={onRemove} className="ml-1 inline-flex items-center justify-center h-4 w-4 rounded-full hover:bg-blue-200">
        <span className="sr-only">Remove</span>
        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
        </svg>
      </button>
    )}
  </span>
);

// Dropdown Menu Component
const Dropdown = ({ label, options, value, onChange, className }) => (
  <div className={`relative ${className}`}>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
);

// Card component for sections
const Card = ({ title, icon, children, className }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center">
        {icon}
        <h3 className="ml-2 text-lg font-medium text-gray-900">{title}</h3>
      </div>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

// Table Fields Selector
const TableFieldsSelector = ({ table, selectedFields, onFieldToggle }) => {
  if (!table) return null;
  
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Select Fields</h4>
      <div className="space-y-2">
        {table.fields.map((field) => (
          <div key={field.id} className="flex items-center">
            <input
              id={`field-${field.id}`}
              type="checkbox"
              checked={selectedFields.some(f => f.id === field.id && f.tableId === table.id)}
              onChange={() => onFieldToggle(table.id, field)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor={`field-${field.id}`} className="ml-2 block text-sm text-gray-900">
              {field.name} <span className="text-xs text-gray-500">({field.type})</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

// Join Condition Component
const JoinCondition = ({ tables, joins, setJoins, index }) => {
  const updateJoin = (field, value) => {
    const newJoins = [...joins];
    newJoins[index] = { ...newJoins[index], [field]: value };
    setJoins(newJoins);
  };

  // Get fields for a specific table
  const getTableFields = (tableId) => {
    const table = tables.find(t => t.id === tableId);
    return table ? table.fields : [];
  };

  return (
    <div className="bg-gray-50 p-3 rounded-md mb-3 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium">Join Condition {index + 1}</h4>
        <button 
          onClick={() => {
            const newJoins = [...joins];
            newJoins.splice(index, 1);
            setJoins(newJoins);
          }}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <div className="grid grid-cols-11 gap-2 items-center">
        <div className="col-span-5">
          <Dropdown 
            label="Source Table"
            className={""}
            options={tables}
            value={joins[index]?.sourceTable || ''}
            onChange={(value) => updateJoin('sourceTable', value)}
          />
          {joins[index]?.sourceTable && (
            <Dropdown
              label="Source Field"
              options={getTableFields(joins[index].sourceTable)}
              value={joins[index]?.sourceField || ''}
              onChange={(value) => updateJoin('sourceField', value)}
              className="mt-2"
            />
          )}
        </div>
        
        <div className="col-span-1 flex justify-center items-center pt-4">
          <ArrowRight className="text-gray-500" />
        </div>
        
        <div className="col-span-5">
          <Dropdown 
            label="Target Table"
            options={tables}
            value={joins[index]?.targetTable || ''}
            onChange={(value) => updateJoin('targetTable', value)}
            className={""}
          />
          {joins[index]?.targetTable && (
            <Dropdown
              label="Target Field"
              options={getTableFields(joins[index].targetTable)}
              value={joins[index]?.targetField || ''}
              onChange={(value) => updateJoin('targetField', value)}
              className="mt-2"
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Code Editor Component
const CodeEditor = ({ code, onChange }) => {
  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10 flex">
        <button className="bg-gray-100 hover:bg-gray-200 rounded p-1 mr-1">
          <Settings size={16} className="text-gray-600" />
        </button>
        <button className="bg-indigo-100 hover:bg-indigo-200 rounded p-1">
          <Play size={16} className="text-indigo-600" />
        </button>
      </div>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-32 p-3 text-sm font-mono bg-gray-50 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="// Write your data transformation code here
function transform(data) {
  // Example: return data.map(item => ({ ...item, fullName: item.firstName + ' ' + item.lastName }));
  return data;
}"
      />
    </div>
  );
};

// URL Preview Component
const URLPreview = ({ query }) => {
  const baseUrl = "https://api.example.com/data";
  const queryString = Object.entries(query)
    .filter(([_, value]) => value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
  
  const fullUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;
  
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">API URL</label>
      <div className="flex">
        <input
          type="text"
          readOnly
          value={fullUrl}
          className="flex-1 p-2 text-sm font-mono bg-gray-50 border border-gray-300 rounded-l-md"
        />
        <button className="bg-gray-100 hover:bg-gray-200 px-3 border border-l-0 border-gray-300 rounded-r-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Main Query Creator Component
const QueryCreator = () => {
  const [queryName, setQueryName] = useState("");
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedFields, setSelectedFields] = useState([]);
  const [joins, setJoins] = useState([]);
  const [transformCode, setTransformCode] = useState("");
  const [urlQuery, setUrlQuery] = useState({});
  const [activeTab, setActiveTab] = useState("tables");

  // Find table by ID
  const getTableById = (id) => mockTables.find(table => table.id === id);

  // Handle table selection
  const handleTableSelect = (tableId) => {
    const table = getTableById(tableId);
    setSelectedTable(table);
    // Clear selected fields when changing tables
    setSelectedFields(selectedFields.filter(field => field.tableId !== tableId));
  };

  // Handle field toggle
  const handleFieldToggle = (tableId, field) => {
    const fieldWithTable = { ...field, tableId };
    const fieldIndex = selectedFields.findIndex(f => f.id === field.id && f.tableId === tableId);
    
    if (fieldIndex === -1) {
      setSelectedFields([...selectedFields, fieldWithTable]);
    } else {
      const newSelectedFields = [...selectedFields];
      newSelectedFields.splice(fieldIndex, 1);
      setSelectedFields(newSelectedFields);
    }
  };

  // Add new join
  const addJoin = () => {
    setJoins([...joins, { sourceTable: "", sourceField: "", targetTable: "", targetField: "" }]);
  };

  // Update URL query whenever selections change
  useEffect(() => {
    const query = {
      name: queryName,
      table: selectedTable?.id || "",
      fields: selectedFields.map(f => `${f.tableId}.${f.id}`).join(","),
      joins: joins.filter(j => j.sourceTable && j.sourceField && j.targetTable && j.targetField)
        .map(j => `${j.sourceTable}.${j.sourceField}:${j.targetTable}.${j.targetField}`)
        .join(";")
    };
    setUrlQuery(query);
  }, [queryName, selectedTable, selectedFields, joins]);

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Query Creator</h1>
            <p className="text-sm text-gray-500">Build and configure data queries for your application</p>
          </div>
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Save size={16} className="mr-2" />
              Save Query
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Play size={16} className="mr-2" />
              Run Query
            </button>
          </div>
        </div>

        {/* Query Name */}
        <div className="mb-6">
          <label htmlFor="query-name" className="block text-sm font-medium text-gray-700">Query Name</label>
          <input
            type="text"
            id="query-name"
            value={queryName}
            onChange={(e) => setQueryName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="My Query"
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-7 gap-6">
          {/* Left Column */}
          <div className="col-span-2">
            <Card 
              title="Data Sources" 
              icon={<Database size={18} className="text-indigo-500" />}
              className="h-full"
            >
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-4">
                  <button
                    onClick={() => setActiveTab("tables")}
                    className={`${
                      activeTab === "tables"
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <Table size={16} className="mr-2" />
                    Tables
                  </button>
                  <button
                    onClick={() => setActiveTab("apis")}
                    className={`${
                      activeTab === "apis"
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <Code size={16} className="mr-2" />
                    APIs
                  </button>
                </nav>
              </div>

              {/* Tables List */}
              {activeTab === "tables" && (
                <div className="space-y-1">
                  {mockTables.map((table) => (
                    <button
                      key={table.id}
                      onClick={() => handleTableSelect(table.id)}
                      className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                        selectedTable?.id === table.id
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Table 
                        size={16} 
                        className={`mr-2 ${
                          selectedTable?.id === table.id ? "text-indigo-500" : "text-gray-400"
                        }`} 
                      />
                      {table.name}
                    </button>
                  ))}
                </div>
              )}

              {/* APIs */}
              {activeTab === "apis" && (
                <div className="text-center py-8 text-gray-500">
                  <Code size={32} className="mx-auto mb-2" />
                  <p>API sources coming soon</p>
                </div>
              )}
            </Card>
          </div>

          {/* Middle Column */}
          <div className="col-span-3">
            <Card 
              title="Query Builder" 
              icon={<FileCode size={18} className="text-indigo-500" />}
              className={""}
            >
              {/* Selected Table */}
              {selectedTable ? (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Selected Table</h4>
                  <Badge color="bg-indigo-100 text-indigo-800" onRemove={() => {}}>
                    <Table size={12} className="mr-1" /> {selectedTable.name}
                  </Badge>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 mb-4">
                  <p>Select a table from the left panel</p>
                </div>
              )}

              {/* Fields Selector */}
              {selectedTable && (
                <TableFieldsSelector 
                  table={selectedTable}
                  selectedFields={selectedFields}
                  onFieldToggle={handleFieldToggle}
                />
              )}

              {/* Selected Fields */}
              {selectedFields.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Fields</h4>
                  <div>
                    {selectedFields.map((field) => {
                      const table = getTableById(field.tableId);
                      return (
                        <Badge 
                          key={`${field.tableId}-${field.id}`}
                          onRemove={() => handleFieldToggle(field.tableId, field)}
                        >
                          {table?.name}.{field.name}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Joins */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Table Joins</h4>
                  <button 
                    onClick={addJoin}
                    className="inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    <PlusCircle size={14} className="mr-1" /> Add Join
                  </button>
                </div>
                
                {joins.length > 0 ? (
                  <div>
                    {joins.map((_, index) => (
                      <JoinCondition 
                        key={index}
                        tables={mockTables}
                        joins={joins}
                        setJoins={setJoins}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 border border-dashed border-gray-300 rounded-md">
                    <Link2 size={20} className="mx-auto mb-1" />
                    <p className="text-sm">No joins configured</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="col-span-2">
            <Card 
              title="Transform & Preview" 
              icon={<Code size={18} className="text-indigo-500" />}
              className={""}
            >
              {/* Code Transformation */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Data Transformation</h4>
                <CodeEditor
                  code={transformCode}
                  onChange={setTransformCode}
                />
              </div>

              {/* URL Preview */}
              <URLPreview query={urlQuery} />

              {/* Preview Results */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Results Preview</h4>
                  <button className="text-xs text-indigo-600 hover:text-indigo-500 flex items-center">
                    <Play size={14} className="mr-1" /> Run Query
                  </button>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 flex items-center justify-center h-40 text-gray-500">
                  <div className="text-center">
                    <p className="mb-2">Run your query to see results</p>
                    <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-sm hover:bg-indigo-200">
                      Preview Data
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryCreator;