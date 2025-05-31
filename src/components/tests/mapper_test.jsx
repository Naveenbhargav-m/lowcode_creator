import React, { useState, useMemo } from 'react';
import { Plus, X, ArrowRight, Settings, Type, Database, User, Search, ChevronDown, ChevronRight } from 'lucide-react';
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
const DataMapper = ({
  targetFields = [],
  sourceFields = [],
  userFields = [],
  mappings = [],
  onMappingChange,
  enableStaticValues = true,
  enableUserFields = true,
  enableSourceFields = true,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const mappingTypes = [
    { 
      id: 'static', 
      label: 'Static', 
      icon: Type, 
      enabled: enableStaticValues,
    },
    { 
      id: 'source', 
      label: 'Source', 
      icon: Database, 
      enabled: enableSourceFields,
    },
    { 
      id: 'user', 
      label: 'User', 
      icon: User, 
      enabled: enableUserFields,
    }
  ];

  // Calculate mapped count
  const mappedCount = useMemo(() => {
    return mappings.filter(m => m.targetField && 
      ((m.type === 'static' && m.value) || 
       (m.type === 'source' && m.sourceField) || 
       (m.type === 'user' && m.userField))
    ).length;
  }, [mappings, targetFields]);

  const addMapping = () => {
    const newMapping = {
      id: Date.now().toString(),
      targetField: '',
      type: 'static',
      value: '',
      sourceField: '',
      userField: ''
    };
    onMappingChange([...mappings, newMapping]);
    setExpandedRows(new Set([...expandedRows, newMapping.id]));
  };

  const updateMapping = (id, updates) => {
    const updated = mappings.map(mapping => 
      mapping.id === id ? { ...mapping, ...updates } : mapping
    );
    onMappingChange(updated);
  };

  const removeMapping = (id) => {
    const newExpanded = new Set(expandedRows);
    newExpanded.delete(id);
    setExpandedRows(newExpanded);
    onMappingChange(mappings.filter(mapping => mapping.id !== id));
  };

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getMappingPreview = (mapping) => {
    if (!mapping.targetField) return 'No target selected';
    
    switch (mapping.type) {
      case 'static':
        return mapping.value ? `"${mapping.value}"` : 'No value';
      case 'source':
        if (mapping.sourceField) {
          const field = sourceFields.find(f => f.value === mapping.sourceField);
          return field ? field.label : mapping.sourceField;
        }
        return 'No source selected';
      case 'user':
        if (mapping.userField) {
          const field = userFields.find(f => f.value === mapping.userField);
          return field ? field.label : mapping.userField;
        }
        return 'No user field selected';
      default:
        return 'Not configured';
    }
  };

  const isValidMapping = (mapping) => {
    return mapping.targetField && 
      ((mapping.type === 'static' && mapping.value) || 
       (mapping.type === 'source' && mapping.sourceField) || 
       (mapping.type === 'user' && mapping.userField));
  };

  const filteredMappings = mappings.filter(mapping => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const targetField = targetFields.find(f => f.value === mapping.targetField);
    return (targetField?.label?.toLowerCase().includes(query)) ||
           (mapping.value?.toLowerCase().includes(query)) ||
           (mapping.sourceField?.toLowerCase().includes(query)) ||
           (mapping.userField?.toLowerCase().includes(query));
  });

  return (
    <div className={className}>
      {/* Config Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <Settings className="w-4 h-4" />
        Field Mapping
        {mappedCount > 0 && (
          <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
            {mappedCount}
          </span>
        )}
      </button>

      {/* Side Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-25" onClick={() => setIsOpen(false)} />
          
          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Field Mapping</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={addMapping}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Mapping
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                >
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
                  <button
                    onClick={addMapping}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Mapping
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {filteredMappings.map((mapping) => {
                    const isExpanded = expandedRows.has(mapping.id);
                    const isValid = isValidMapping(mapping);
                    const targetField = targetFields.find(f => f.value === mapping.targetField);
                    
                    return (
                      <div key={mapping.id} className={`border rounded-lg overflow-hidden ${
                        isValid ? 'border-green-200 bg-green-50' : 'border-gray-200'
                      }`}>
                        {/* Collapsed View */}
                        <div 
                          className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => toggleExpanded(mapping.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {targetField?.label || 'Select target field'}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <ArrowRight className="w-3 h-3" />
                                  <span className="truncate">{getMappingPreview(mapping)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {mappingTypes.find(t => t.id === mapping.type)?.label}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeMapping(mapping.id);
                                }}
                                className="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded View */}
                        {isExpanded && (
                          <div className="px-4 pb-4 bg-white border-t border-gray-100">
                            <div className="space-y-3">
                              {/* Target Field */}
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Target Field
                                </label>
                                <select
                                  value={mapping.targetField}
                                  onChange={(e) => updateMapping(mapping.id, { targetField: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                >
                                  <option value="">Select target field...</option>
                                  {targetFields.map(field => (
                                    <option key={field.value} value={field.value}>
                                      {field.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Mapping Type */}
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Type
                                </label>
                                <div className="flex gap-1">
                                  {mappingTypes.filter(type => type.enabled).map(type => {
                                    const isSelected = mapping.type === type.id;
                                    return (
                                      <button
                                        key={type.id}
                                        onClick={() => updateMapping(mapping.id, { type: type.id })}
                                        className={`flex-1 px-2 py-1.5 rounded-md border text-xs font-medium transition-colors ${
                                          isSelected
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                      >
                                        {type.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Value Input */}
                              {mapping.type === 'static' && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Value
                                  </label>
                                  <input
                                    type="text"
                                    value={mapping.value || ''}
                                    onChange={(e) => updateMapping(mapping.id, { value: e.target.value })}
                                    placeholder="Enter static value..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  />
                                </div>
                              )}

                              {mapping.type === 'source' && enableSourceFields && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Source Field
                                  </label>
                                  <select
                                    value={mapping.sourceField || ''}
                                    onChange={(e) => updateMapping(mapping.id, { sourceField: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  >
                                    <option value="">Select source field...</option>
                                    {sourceFields.map(field => (
                                      <option key={field.value} value={field.value}>
                                        {field.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}

                              {mapping.type === 'user' && enableUserFields && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    User Field
                                  </label>
                                  <select
                                    value={mapping.userField || ''}
                                    onChange={(e) => updateMapping(mapping.id, { userField: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  >
                                    <option value="">Select user field...</option>
                                    {userFields.map(field => (
                                      <option key={field.value} value={field.value}>
                                        {field.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                 <Toggle />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Demo Component
const DataMapperDemo = () => {
  const [mappings, setMappings] = useState([
    {
      id: '1',
      targetField: 'email',
      type: 'source',
      value: '',
      sourceField: 'user_email',
      userField: ''
    },
    {
      id: '2',
      targetField: 'name',
      type: 'static',
      value: 'John Doe',
      sourceField: '',
      userField: ''
    }
  ]);

  const targetFields = [
    { value: 'name', label: 'Full Name' },
    { value: 'email', label: 'Email Address' },
    { value: 'phone', label: 'Phone Number' },
    { value: 'company', label: 'Company Name' },
    { value: 'role', label: 'Job Role' },
    { value: 'department', label: 'Department' },
    { value: 'location', label: 'Location' },
    { value: 'start_date', label: 'Start Date' }
  ];

  const sourceFields = [
    { value: 'user_name', label: 'User Name' },
    { value: 'user_email', label: 'User Email' },
    { value: 'user_phone', label: 'User Phone' },
    { value: 'form_company', label: 'Form Company Field' },
    { value: 'form_title', label: 'Form Title Field' },
    { value: 'form_dept', label: 'Form Department' },
    { value: 'form_location', label: 'Form Location' }
  ];

  const userFields = [
    { value: 'current_user_name', label: 'Current User Name' },
    { value: 'current_user_email', label: 'Current User Email' },
    { value: 'current_user_role', label: 'Current User Role' },
    { value: 'current_user_dept', label: 'Current User Department' },
    { value: 'current_user_location', label: 'Current User Location' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Compact Data Mapper
          </h1>
          <p className="text-lg text-gray-600">
            Professional field mapping component for embedded forms
          </p>
        </div>

        {/* Example Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Example Form Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                defaultValue="User Registration Form"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target System
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <option>Salesforce</option>
                <option>HubSpot</option>
                <option>Database</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Field Mapping Configuration
              </label>
              <div className="flex items-center gap-4">
                <DataMapper
                  targetFields={targetFields}
                  sourceFields={sourceFields}
                  userFields={userFields}
                  mappings={mappings}
                  onMappingChange={setMappings}
                  enableStaticValues={true}
                  enableUserFields={true}
                  enableSourceFields={true}
                />
                <span className="text-sm text-gray-500">
                  Configure how form fields map to your target system
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Current State */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Mappings State</h3>
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-auto">
            <pre className="text-sm text-gray-600 whitespace-pre-wrap">
              {JSON.stringify(mappings, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataMapperDemo;