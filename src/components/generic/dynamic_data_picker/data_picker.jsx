// @ts-ignore
import React, { useState, useMemo, useCallback, memo } from 'react';
// @ts-ignore
import { ChevronRight, Settings, X, Link, MapPin, Check, Workflow, Search, Filter, User, Database, Type, Hash } from 'lucide-react';
import { data_map_v2 } from '../../../states/global_repo';




/*

  What are all the blocks that used across each other.
  forms, workflows.
  queries, forms.
  workflows , queries.
  queries , templates. 
  queries , tables.
  forms , tables.
  workflow state, tables.

  forms , workflows, queries, tables, templates, global state 
*/
// Constants and Data

const USER_ATTRIBUTES = [
  { id: 'user.id', label: 'User ID', type: 'text', description: 'Unique user identifier' },
  { id: 'user.email', label: 'User Email', type: 'email', description: 'User\'s email address' },
  { id: 'user.name', label: 'Full Name', type: 'text', description: 'User\'s full name' },
  { id: 'user.firstName', label: 'First Name', type: 'text', description: 'User\'s first name' },
  { id: 'user.lastName', label: 'Last Name', type: 'text', description: 'User\'s last name' },
  { id: 'user.phone', label: 'Phone Number', type: 'tel', description: 'User\'s phone number' },
  { id: 'user.avatar', label: 'Avatar URL', type: 'text', description: 'User\'s profile picture' },
  { id: 'user.role', label: 'User Role', type: 'text', description: 'User\'s system role' },
  { id: 'user.company', label: 'Company', type: 'text', description: 'User\'s company' },
  { id: 'user.department', label: 'Department', type: 'text', description: 'User\'s department' },
  { id: 'user.createdAt', label: 'Registration Date', type: 'date', description: 'When user registered' },
  { id: 'user.lastLogin', label: 'Last Login', type: 'date', description: 'User\'s last login time' }
];

const GLOBAL_STATE_FIELDS = [
  { id: 'app.version', label: 'App Version', type: 'text', description: 'Current application version' },
  { id: 'app.environment', label: 'Environment', type: 'text', description: 'Current environment (dev/staging/prod)' },
  { id: 'session.id', label: 'Session ID', type: 'text', description: 'Current session identifier' },
  { id: 'session.startTime', label: 'Session Start', type: 'date', description: 'When session started' },
  { id: 'config.apiUrl', label: 'API URL', type: 'text', description: 'Current API endpoint' },
  { id: 'config.theme', label: 'Theme', type: 'text', description: 'Current UI theme' },
  { id: 'state.currentPage', label: 'Current Page', type: 'text', description: 'Current page/route' },
  { id: 'state.previousPage', label: 'Previous Page', type: 'text', description: 'Previous page/route' },
  { id: 'cart.itemCount', label: 'Cart Items', type: 'number', description: 'Number of items in cart' },
  { id: 'cart.total', label: 'Cart Total', type: 'number', description: 'Total cart value' }
];

const MAPPING_TYPES = [
  { id: 'form', label: 'Form Fields', icon: Database, color: 'blue', description: 'Map to form input fields' },
  { id: 'user', label: 'User Attributes', icon: User, color: 'green', description: 'Map to user profile data' },
  { id: 'global', label: 'Global State', icon: Hash, color: 'purple', description: 'Map to application state' },
  { id: 'hardcoded', label: 'Static Value', icon: Type, color: 'orange', description: 'Use a fixed value' }
];

// Utility Hooks
const useFieldData = () => {
  return useMemo(() => ({
    form: data_map_v2["forms"],
    user: USER_ATTRIBUTES,
    global: GLOBAL_STATE_FIELDS
  }), []);
};

const useFieldSearch = (fields, searchTerm, selectedCategory, mappingType) => {
  return useMemo(() => {
    return fields.filter(field => {
      const matchesSearch = !searchTerm || 
        field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (field.description && field.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !selectedCategory || 
        (mappingType === 'form' && field.category === selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [fields, searchTerm, selectedCategory, mappingType]);
};

// Reusable Components

// 1. Modal Component
// @ts-ignore
const Modal = memo(({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl shadow-2xl w-full ${maxWidth} max-h-[80vh] overflow-hidden`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-96">
          {children}
        </div>
      </div>
    </div>
  );
});

// 2. Drawer Component
// @ts-ignore
const Drawer = memo(({ isOpen, onClose, title, subtitle, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white h-full w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 truncate">{title}</h2>
            {subtitle && <p className="text-sm text-gray-600 mt-1 truncate">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {footer && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
});

// 3. Progress Bar Component
// @ts-ignore
const ProgressBar = memo(({ current, total, className = "" }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <div className={`w-24 bg-gray-200 rounded-full h-2 ${className}`}>
      <div 
        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
});

// 4. Search Input Component
// @ts-ignore
const SearchInput = memo(({ value, onChange, placeholder = "Search..." }) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      // @ts-ignore
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
    />
  </div>
));

// 5. Field Item Component
// @ts-ignore
const FieldItem = memo(({ field, onSelect, mappingType, className = "" }) => {
  const getFieldIcon = () => {
    switch (mappingType) {
      case 'user': return <User className="w-3 h-3 text-green-500" />;
      case 'global': return <Hash className="w-3 h-3 text-purple-500" />;
      default: return <div className="w-2 h-2 bg-blue-400 rounded-full" />;
    }
  };

  return (
    <button
      onClick={() => onSelect(field.id)}
      className={`w-full text-left p-3 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-between group border border-transparent hover:border-blue-200 ${className}`}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {getFieldIcon()}
        <div className="flex-1 min-w-0 py-0 px-2 max-h-14">
          <span className="text-sm text-gray-700 font-medium p-0 truncate max-h-2">
            {field.label}
          </span>
          <div className="flex items-center space-x-2 text-xs text-gray-500 max-h-2">
            <span>{field.type}</span>
            {field.category && <span>• {field.category}</span>}
            {field.id.includes('.') && <span>• {field.id}</span>}
          </div>
          {field.description && (
            <span className="text-xs text-gray-400 truncate mt-1 h-4">
              {field.description}
            </span>
          )}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
    </button>
  );
});

// 6. Virtualized Field List Component
// @ts-ignore
const VirtualizedFieldList = memo(({ fields, onFieldSelect, searchTerm, selectedCategory, mappingType }) => {
  const [visibleCount, setVisibleCount] = useState(20);
  
  const filteredFields = useFieldSearch(fields, searchTerm, selectedCategory, mappingType);
  
  const visibleFields = useMemo(() => {
    return filteredFields.slice(0, visibleCount);
  }, [filteredFields, visibleCount]);

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + 20, filteredFields.length));
  }, [filteredFields.length]);

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {visibleFields.map((field) => (
        <FieldItem
          key={field.id}
          // @ts-ignore
          field={field}
          onSelect={onFieldSelect}
          mappingType={mappingType}
        />
      ))}
      
      {visibleCount < filteredFields.length && (
        <button
          onClick={loadMore}
          className="w-full p-3 text-center text-blue-600 hover:text-blue-700 font-medium text-sm border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Load More ({filteredFields.length - visibleCount} remaining)
        </button>
      )}
      
      {filteredFields.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No fields found matching your criteria</p>
        </div>
      )}
    </div>
  );
});

// 7. Mapping Type Selector Component
// @ts-ignore
const MappingTypeSelector = memo(({ selectedType, onTypeSelect, types = MAPPING_TYPES }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Choose mapping type:
    </label>
    <div className="grid grid-cols-2 gap-2">
      {types.map((type) => {
        const Icon = type.icon;
        return (
          <button
            key={type.id}
            onClick={() => onTypeSelect(type.id)}
            className={`p-3 border rounded-lg text-left transition-all ${
              selectedType === type.id
                ? `border-${type.color}-500 bg-${type.color}-50 text-${type.color}-700`
                : 'border-gray-200 hover:border-gray-300 hover:bg-white'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{type.label}</span>
            </div>
            <p className="text-xs opacity-75">{type.description}</p>
          </button>
        );
      })}
    </div>
  </div>
));

// 8. Hardcoded Value Input Component
// @ts-ignore
const HardcodedValueInput = memo(({ onSave, onCancel, initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);

  const handleSave = useCallback(() => {
    if (value.trim()) {
      onSave(value.trim());
    }
  }, [value, onSave]);

  return (
    <div className="space-y-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter static value:
        </label>
        <input
          type="text"
          value={value}
          // @ts-ignore
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a fixed value..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
          autoFocus
        />
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleSave}
          disabled={!value.trim()}
          className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
        >
          Save Value
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
});

// 9. Workflow Picker Component
// @ts-ignore
const WorkflowPicker = memo(({ workflows = data_map_v2["workflows"]["list"], onSelect, isOpen, onClose }) => (
  <Modal 
// @ts-ignore
  isOpen={isOpen} onClose={onClose} title="Select Workflow">
    <div className="p-6">
      <div className="space-y-3">
        {workflows.map((workflow) => (
          <button
            key={workflow.id}
            onClick={() => onSelect(workflow)}
            className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 group-hover:text-blue-700 truncate">
                  {workflow.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{workflow.description}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full">
                  {workflow.category}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 mt-1 flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>
    </div>
  </Modal>
));

// 10. Field Mapping Input Component
const FieldMappingInput = memo(({ 
  // @ts-ignore
  input, 
  // @ts-ignore
  mapping, 
  // @ts-ignore
  isSelected, 
  // @ts-ignore
  onInputClick, 
  // @ts-ignore
  onFieldMapping, 
  // @ts-ignore
  onHardcodedValue,
  // @ts-ignore
  fieldData,
  // @ts-ignore
  mappingTypes = MAPPING_TYPES 
}) => {
  const [selectedMappingType, setSelectedMappingType] = useState('form');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showHardcodedInput, setShowHardcodedInput] = useState(false);

  const getCurrentFields = useMemo(() => {
    return fieldData[selectedMappingType] || [];
  }, [fieldData, selectedMappingType]);

  const categories = useMemo(() => {
    if (selectedMappingType === 'form') {
      return [...new Set(getCurrentFields.map(f => f.category))].sort();
    }
    return [];
  }, [selectedMappingType, getCurrentFields]);

  const getMappingTypeInfo = useCallback((mapping) => {
    if (!mapping) return null;
    return mappingTypes.find(t => t.id === mapping.type) || mappingTypes[0];
  }, [mappingTypes]);

  const getFieldLabel = useCallback((mapping) => {
    if (!mapping) return '';
    
    if (mapping.type === 'hardcoded') {
      return mapping.displayValue || mapping.value;
    }
    
    const allFields = [...fieldData.form, ...fieldData.user, ...fieldData.global];
    const field = allFields.find(f => f.id === mapping.fieldId);
    return field ? field.label : mapping.value;
  }, [fieldData]);

  const handleMappingTypeSelect = useCallback((type) => {
    setSelectedMappingType(type);
    setSearchTerm('');
    setSelectedCategory('');
    setShowHardcodedInput(type === 'hardcoded');
  }, []);

  const handleFieldSelect = useCallback((fieldId) => {
    onFieldMapping(input.id, fieldId, selectedMappingType);
  }, [input.id, onFieldMapping, selectedMappingType]);

  const handleHardcodedSave = useCallback((value) => {
    onHardcodedValue(input.id, value);
    setShowHardcodedInput(false);
  }, [input.id, onHardcodedValue]);

  const mappingTypeInfo = getMappingTypeInfo(mapping);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${input.required ? 'bg-red-400' : 'bg-gray-300'}`} />
            <span className="font-medium text-gray-900 truncate">{input.label}</span>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded flex-shrink-0">
            {input.type}
          </span>
        </div>
        
        <button
          onClick={() => onInputClick(input.id)}
          className={`w-full flex items-center justify-between p-3 border rounded-lg transition-all ${
            mapping 
              ? `border-${mappingTypeInfo?.color}-300 bg-${mappingTypeInfo?.color}-50 text-${mappingTypeInfo?.color}-700` 
              : 'border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50'
          }`}
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {mapping ? (
              <>
                {mappingTypeInfo && <mappingTypeInfo.icon className="w-4 h-4 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {getFieldLabel(mapping)}
                  </p>
                  <span className="text-xs opacity-75">
                    {mappingTypeInfo?.label}
                  </span>
                </div>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-500">Choose mapping...</span>
              </>
            )}
          </div>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
        </button>
      </div>

      {isSelected && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="space-y-4">
            <MappingTypeSelector
              // @ts-ignore
              selectedType={selectedMappingType}
              onTypeSelect={handleMappingTypeSelect}
              types={mappingTypes}
            />

            {showHardcodedInput && selectedMappingType === 'hardcoded' && (
              <HardcodedValueInput
                // @ts-ignore
                onSave={handleHardcodedSave}
                onCancel={() => setShowHardcodedInput(false)}
                initialValue={mapping?.type === 'hardcoded' ? mapping.value : ''}
              />
            )}

            {selectedMappingType !== 'hardcoded' && !showHardcodedInput && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <SearchInput
                    // @ts-ignore
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search fields..."
                  />
                  
                  {categories.length > 0 && (
                    <select
                      value={selectedCategory}
                      // @ts-ignore
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  )}
                </div>

                <VirtualizedFieldList
                  // @ts-ignore
                  fields={getCurrentFields}
                  onFieldSelect={handleFieldSelect}
                  searchTerm={searchTerm}
                  selectedCategory={selectedCategory}
                  mappingType={selectedMappingType}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

// 11. Main Data Mapping Component
const DataMappingComponent = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [showWorkflowPicker, setShowWorkflowPicker] = useState(false);
  const [showMapper, setShowMapper] = useState(false);
  const [mappings, setMappings] = useState({});
  const [selectedInput, setSelectedInput] = useState(null);

  const fieldData = useFieldData();

  const handleWorkflowSelect = useCallback((workflow) => {
    setSelectedWorkflow(workflow);
    setShowWorkflowPicker(false);
    setMappings({});
    setShowMapper(true);
  }, []);

  const handleFieldMapping = useCallback((inputId, fieldId, mappingType = 'form') => {
    setMappings(prev => ({ 
      ...prev, 
      [inputId]: { 
        type: mappingType, 
        value: fieldId,
        fieldId: fieldId
      }
    }));
    setSelectedInput(null);
  }, []);

  const handleHardcodedValue = useCallback((inputId, value) => {
    setMappings(prev => ({ 
      ...prev, 
      [inputId]: { 
        type: 'hardcoded', 
        value: value,
        displayValue: value
      }
    }));
    setSelectedInput(null);
  }, []);

  const handleInputClick = useCallback((inputId) => {
    setSelectedInput(selectedInput === inputId ? null : inputId);
  }, [selectedInput]);

  const { mappedCount, totalInputs } = useMemo(() => {
    const workflowInputs = data_map_v2["workflows"]["list"][selectedWorkflow?.id] || [];
    return {
      mappedCount: Object.keys(mappings).length,
      totalInputs: workflowInputs.length
    };
  }, [mappings, selectedWorkflow]);

  const workflowInputs = useMemo(() => {
    return data_map_v2["workflows"]["list"][selectedWorkflow?.id] || [];
  }, [selectedWorkflow]);

  return (
    <div className="w-full max-w-md mx-auto bg-white">
      {/* Trigger Field */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Trigger Workflow
        </label>
        <button
          onClick={() => setShowWorkflowPicker(true)}
          className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-white"
        >
          <div className="flex items-center space-x-2">
            <Workflow className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 truncate">
              {selectedWorkflow ? selectedWorkflow.name : 'Select workflow...'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </button>
        
        {selectedWorkflow && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">
                  {mappedCount}/{totalInputs} fields mapped
                </span>
              </div>
              <button
                onClick={() => setShowMapper(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Configure
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Workflow Picker */}
      <WorkflowPicker
        // @ts-ignore
        isOpen={showWorkflowPicker}
        onClose={() => setShowWorkflowPicker(false)}
        onSelect={handleWorkflowSelect}
      />

      {/* Field Mapper */}
      <Drawer
        // @ts-ignore
        isOpen={showMapper && selectedWorkflow}
        onClose={() => setShowMapper(false)}
        title="Field Mapping"
        subtitle={selectedWorkflow?.name}
        footer={
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">
                Progress: {mappedCount}/{totalInputs} mapped
              </span>
              <ProgressBar 
// @ts-ignore
              current={mappedCount} total={totalInputs} />
            </div>
            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={mappedCount === 0}
            >
              Save Mapping
            </button>
          </>
        }
      >
        <div className="p-6 space-y-4">
          {workflowInputs.map((input) => (
            <FieldMappingInput
              key={input.id}
              // @ts-ignore
              input={input}
              mapping={mappings[input.id]}
              isSelected={selectedInput === input.id}
              onInputClick={handleInputClick}
              onFieldMapping={handleFieldMapping}
              onHardcodedValue={handleHardcodedValue}
              fieldData={fieldData}
            />
          ))}
        </div>
      </Drawer>
    </div>
  );
};

export default DataMappingComponent;