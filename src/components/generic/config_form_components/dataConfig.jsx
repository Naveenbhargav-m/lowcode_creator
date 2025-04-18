import { useState, useEffect } from 'react';
import { X, Plus, Code, ChevronDown, ChevronUp } from 'lucide-react';

// Reusable form components
const FormGroup = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    {children}
  </div>
);

const TextField = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
    style={{"color": "black"}}
  />
);

const SelectField = ({ value, onChange, options }) => (
  <select 
    value={value} 
    onChange={(e) => onChange(e.target.value)}
    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
    style={{"color": "black"}}
  >
    {options.map(option => (
      <option key={option.value} value={option.value}>{option.label}</option>
    ))}
  </select>
);

// Advanced Code Editor Modal Component
const CodeEditorModal = ({ isOpen, onClose, code, onChange, onApply }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-4/5 max-w-4xl max-h-5/6 flex flex-col">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-lg font-medium">Code Editor</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 flex-grow overflow-auto">
          <textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-96 font-mono text-sm p-4 border border-gray-300 rounded-md"
            style={{ color: "black" }}
            placeholder="Enter your code here..."
          />
        </div>
        
        <div className="border-t px-6 py-4 flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700"
          >
            Cancel
          </button>
          <button 
            onClick={onApply}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// Dynamic field renderer based on field type
const DynamicField = ({ field, value, onChange }) => {
  switch (field.type) {
    case 'text':
      return (
        <TextField 
          value={value} 
          onChange={onChange}
          placeholder={field.placeholder}
        />
      );
    case 'select':
      return (
        <SelectField 
          value={value} 
          onChange={onChange}
          options={field.options}

        />
      );
    case 'key-value-list':
      return (
        <KeyValueListField 
          value={value} 
          onChange={onChange}
        />
      );
    default:
      return (
        <TextField 
          value={value} 
          onChange={onChange}
          placeholder={"NA"}
        />
      );
  }
};

// Key-Value List Field Component
const KeyValueListField = ({ value = [], onChange }) => {
  const addItem = () => {
    onChange([...value, { key: '', value: '' }]);
  };

  let style = {
    "width": "150px",
    "color": "black"

  };

  const removeItem = (index) => {
    const newItems = [...value];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  const updateItem = (index, field, newValue) => {
    const newItems = [...value];
    newItems[index] = { ...newItems[index], [field]: newValue };
    onChange(newItems);
  };

  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input 
            type="text" 
            value={item.key} 
            onChange={(e) => updateItem(index, 'key', e.target.value)}
            placeholder="Key" 
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
            style={{...style}}
          />
          <input 
            type="text" 
            value={item.value} 
            onChange={(e) => updateItem(index, 'value', e.target.value)}
            placeholder="Value" 
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
            style={{...style}}
          />
          <button 
            className="p-2 text-gray-500 hover:text-gray-700"
            onClick={() => removeItem(index)}
          >
            <X size={16} />
          </button>
        </div>
      ))}
      <button 
        className="flex items-center gap-1 text-sm text-blue-600 font-medium"
        onClick={addItem}
      >
        <Plus size={16} />
        Add Item
      </button>
    </div>
  );
};

export default function DataQueryConfig() {
  // Query mode toggle
  const [queryMode, setQueryMode] = useState('visual');
  
  // Config for query builder
  const queryConfig = {
    fields: [
      { 
        id: 'dataSource', 
        label: 'Data Source', 
        type: 'select',
        options: [
          { value: 'api', label: 'API Endpoint' },
          { value: 'database', label: 'Database' },
          { value: 'localStorage', label: 'Local State' },
          { value: 'globalState', label: 'Global State' }
        ],
        defaultValue: 'api'
      },
      { 
        id: 'endpoint', 
        label: 'Endpoint URL', 
        type: 'text',
        placeholder: 'https://api.example.com/data',
        defaultValue: 'https://api.example.com/data',
        dependsOn: { field: 'dataSource', value: 'api' }
      },
      { 
        id: 'method', 
        label: 'Request Method', 
        type: 'select',
        options: [
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
          { value: 'PUT', label: 'PUT' },
          { value: 'DELETE', label: 'DELETE' }
        ],
        defaultValue: 'GET',
        dependsOn: { field: 'dataSource', value: 'api' }
      },
      { 
        id: 'headers', 
        label: 'Request Headers', 
        type: 'key-value-list',
        defaultValue: [{ key: 'Content-Type', value: 'application/json' }],
        dependsOn: { field: 'dataSource', value: 'api' }
      }
    ]
  };

  // Initialize query data from config
  const initQueryData = () => {
    const data = {};
    queryConfig.fields.forEach(field => {
      data[field.id] = field.defaultValue;
    });
    return data;
  };

  // State for query data
  const [queryData, setQueryData] = useState(initQueryData);
  
  // State for code editor
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [codeText, setCodeText] = useState('');
  
  // Generate code from queryData
  const generateCode = () => {
    if (queryData.dataSource === 'api') {
      const headersStr = queryData.headers && queryData.headers.length > 0
        ? `\n    headers: {\n${queryData.headers
            .filter(h => h.key.trim())
            .map(h => `      '${h.key}': '${h.value}'`)
            .join(',\n')}\n    }`
        : '';
        
      return `// Define your data query
async function fetchData() {
  const response = await fetch('${queryData.endpoint}', {
    method: '${queryData.method}',${headersStr}
  });
  
  return await response.json();
}`;
    } else if (queryData.dataSource === 'database') {
      return `// Database query example
async function fetchData() {
  // Connect to database and execute query
  // Replace with actual database interaction
  return db.collection('items').findAll();
}`;
    } else if (queryData.dataSource === 'localStorage') {
      return `// Get data from local storage
function fetchData() {
  const data = localStorage.getItem('appData');
  return data ? JSON.parse(data) : null;
}`;
    } else {
      return `// Get data from global state
function fetchData() {
  // Example using Redux or similar state management
  return store.getState().data;
}`;
    }
  };
  
  // Update code when queryData changes
  useEffect(() => {
    setCodeText(generateCode());
  }, [queryData]);
  
  // Update queryData based on code changes
  const parseCodeToData = (code) => {
    // This is a simplified parser - in a real app you'd need more robust parsing
    // Extract endpoint URL
    const endpointMatch = code.match(/fetch\(['"]([^'"]+)['"]/);
    const endpoint = endpointMatch ? endpointMatch[1] : '';
    
    // Extract method
    const methodMatch = code.match(/method:\s*['"]([^'"]+)['"]/);
    const method = methodMatch ? methodMatch[1] : 'GET';
    
    // Extract headers
    const headersRegex = /headers:\s*{([^}]*)}/s;
    const headersMatch = code.match(headersRegex);
    const headers = [];
    
    if (headersMatch) {
      const headersPart = headersMatch[1];
      const headerEntries = headersPart.match(/'([^']+)':\s*'([^']+)'/g);
      
      if (headerEntries) {
        headerEntries.forEach(entry => {
          const parts = entry.match(/'([^']+)':\s*'([^']+)'/);
          if (parts && parts.length >= 3) {
            headers.push({ key: parts[1], value: parts[2] });
          }
        });
      }
    }
    
    // Determine data source
    let dataSource = 'api';
    if (code.includes('localStorage')) {
      dataSource = 'localStorage';
    } else if (code.includes('db.collection')) {
      dataSource = 'database';
    } else if (code.includes('store.getState')) {
      dataSource = 'globalState';
    }
    
    return {
      dataSource,
      endpoint,
      method,
      headers: headers.length > 0 ? headers : [{ key: '', value: '' }]
    };
  };
  
  // Apply code changes
  const applyCodeChanges = () => {
    const newData = parseCodeToData(codeText);
    setQueryData({...queryData, ...newData});
    setIsEditorOpen(false);
  };
  
  // Handle field updates
  const updateField = (fieldId, value) => {
    setQueryData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Open code editor
  const openCodeEditor = () => {
    setCodeText(generateCode());
    setIsEditorOpen(true);
  };
  
  // Should field be shown based on dependencies
  const shouldShowField = (field) => {
    if (!field.dependsOn) return true;
    
    const { field: depField, value: depValue } = field.dependsOn;
    return queryData[depField] === depValue;
  };

  return (
    <div className="space-y-6 overflow-hidden max-w-2xl">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">Data Query</h3>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-md overflow-hidden">
            <button 
              className={`px-3 py-1.5 text-xs font-medium ${queryMode === 'visual' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
              onClick={() => setQueryMode('visual')}
            >
              Visual
            </button>
            <button 
              className={`px-3 py-1.5 text-xs font-medium ${queryMode === 'code' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
              onClick={() => setQueryMode('code')}
            >
              Code
            </button>
          </div>
          {queryMode === 'visual' && (
            <button 
              className="flex items-center gap-1 text-sm text-blue-600 font-medium"
              onClick={openCodeEditor}
            >
              <Code size={16} />
              Advanced
            </button>
          )}
        </div>
      </div>
      
      {queryMode === 'visual' ? (
        <div className="space-y-4">
          {queryConfig.fields.map(field => 
            shouldShowField(field) && (
              <FormGroup key={field.id} label={field.label}>
                <DynamicField 
                  field={field}
                  value={queryData[field.id]} 
                  onChange={(value) => updateField(field.id, value)}
                />
              </FormGroup>
            )
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-md border border-gray-200 p-4 h-64 overflow-auto">
          <pre className="text-sm text-gray-800">
            {codeText}
          </pre>
        </div>
      )}
      
      <div className="flex justify-end gap-2 pt-3">
        <button 
          className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700"
          onClick={() => setQueryData(initQueryData())}
        >
          Reset
        </button>
        <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md">
          Apply Query
        </button>
      </div>

      {/* Code Editor Modal */}
      <CodeEditorModal 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        code={codeText}
        onChange={setCodeText}
        onApply={applyCodeChanges}
      />
    </div>
  );
}