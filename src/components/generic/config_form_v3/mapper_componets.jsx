import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Settings, X, Search, Database, Plus, ChevronDown, ChevronRight, Trash2, Edit3, Check, X as XIcon } from 'lucide-react';


// Toggle Switch Component
// @ts-ignore
const ToggleSwitch = React.memo(({ enabled, onChange, label, disabled = false }) => (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>{label}</span>
      <button
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          enabled ? 'bg-blue-600' : 'bg-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  ));

  
// Field Editor Component
// @ts-ignore
const FieldEditor = React.memo(({ field, onSave, onCancel, fieldType }) => {
  const [editField, setEditField] = useState({
    label: field?.label || '',
    value: field?.value || field?.id || '',
    type: field?.type || 'text'
  });

  const handleSave = () => {
    if (editField.label.trim() && editField.value.trim()) {
      onSave({
        id: editField.value,
        value: editField.value,
        label: editField.label,
        type: editField.type,
        isCustom: !field // Mark as custom if it's a new field
      });
    }
  };

  return (
    <div className="p-3 bg-gray-50 border rounded-md space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">
          {field ? `Edit ${fieldType}` : `Add New ${fieldType}`}
        </h4>
        <div className="flex gap-1">
          <button onClick={handleSave} className="p-1 text-green-600 hover:bg-green-50 rounded">
            <Check className="w-4 h-4" />
          </button>
          <button onClick={onCancel} className="p-1 text-gray-500 hover:bg-gray-100 rounded">
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Field Label"
          value={editField.label}
          // @ts-ignore
          onChange={(e) => setEditField(prev => ({ ...prev, label: e.target.value }))}
          className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Field Value/ID"
          value={editField.value}
          // @ts-ignore
          onChange={(e) => setEditField(prev => ({ ...prev, value: e.target.value }))}
          className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <select
        value={editField.type}
        // @ts-ignore
        onChange={(e) => setEditField(prev => ({ ...prev, type: e.target.value }))}
        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
      >
        <option value="text">Text</option>
        <option value="number">Number</option>
        <option value="date">Date</option>
        <option value="boolean">Boolean</option>
      </select>
    </div>
  );
});

// Field List Component
const FieldList = React.memo(({ 
  // @ts-ignore
  fields, 
  // @ts-ignore
  fieldType, 
  // @ts-ignore
  canExtend, 
  // @ts-ignore
  onAddField, 
  // @ts-ignore
  onEditField, 
  // @ts-ignore
  onDeleteField,
  // @ts-ignore
  selectedValue,
  // @ts-ignore
  onSelect,
  // @ts-ignore
  placeholder
}) => {
  const [editingField, setEditingField] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSaveField = useCallback((fieldData) => {
    if (editingField) {
      onEditField(editingField.id || editingField.value, fieldData);
      setEditingField(null);
    } else {
      onAddField(fieldData);
      setShowAddForm(false);
    }
  }, [editingField, onAddField, onEditField]);

  const handleCancelEdit = useCallback(() => {
    setEditingField(null);
    setShowAddForm(false);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          {fieldType} Fields
        </label>
        {canExtend && (
          <button
            onClick={() => setShowAddForm(true)}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add {fieldType}
          </button>
        )}
      </div>

      {showAddForm && (
        <FieldEditor
          // @ts-ignore
          field={null}
          fieldType={fieldType}
          onSave={handleSaveField}
          onCancel={handleCancelEdit}
        />
      )}

      <select
        value={selectedValue}
        // @ts-ignore
        onChange={(e) => onSelect(e.target.value)}
        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
      >
        <option value="">{placeholder}</option>
        {fields.map((field) => (
          <option key={field.id || field.value} value={field.id || field.value}>
            {field.label || field.name} {field.isCustom ? '(Custom)' : ''}
          </option>
        ))}
      </select>

      {fields.length > 0 && (
        <div className="max-h-32 overflow-y-auto space-y-1">
          {fields.map((field) => (
            <div
              key={field.id || field.value}
              className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
            >
              <div className="flex-1">
                <span className="font-medium">{field.label || field.name}</span>
                <span className="text-gray-500 ml-1">({field.id || field.value})</span>
                {field.isCustom && <span className="text-blue-600 ml-1">[Custom]</span>}
              </div>
              {canExtend && field.isCustom && (
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingField(field)}
                    className="p-0.5 text-gray-500 hover:text-blue-600"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDeleteField(field.id || field.value)}
                    className="p-0.5 text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editingField && (
        <FieldEditor
          // @ts-ignore
          field={editingField}
          fieldType={fieldType}
          onSave={handleSaveField}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
});

// Mapping Row Component
const MappingRow = React.memo(({ 
  // @ts-ignore
  mapping, 
  // @ts-ignore
  config, 
  // @ts-ignore
  onUpdate, 
  // @ts-ignore
  onRemove, 
  // @ts-ignore
  onToggleExpand, 
  // @ts-ignore
  isExpanded,
  // @ts-ignore
  onAddSourceField,
  // @ts-ignore
  onEditSourceField,
  // @ts-ignore
  onDeleteSourceField,
  // @ts-ignore
  onAddTargetField,
  // @ts-ignore
  onEditTargetField,
  // @ts-ignore
  onDeleteTargetField
}) => {
  const targetField = config.target_fields.find(f => (f.id || f.value) === mapping.targetField);
  const sourceField = config.source_fields.find(f => (f.id || f.value) === mapping.sourceField);
  const userField = config.userFields.find(f => (f.id || f.value) === mapping.userField);

  const getDisplayText = () => {
    const target = targetField?.label || targetField?.name || 'Select target';
    switch (mapping.type) {
      case 'static':
        return `${target} ← "${mapping.value || 'Enter value'}"`;
      case 'source':
        return `${target} ← ${sourceField?.label || sourceField?.name || 'Select source'}`;
      case 'user':
        return `${target} ← ${userField?.label || userField?.name || 'Select user field'}`;
      default:
        return `${target} ← Configure mapping`;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div
        onClick={() => onToggleExpand(mapping.id)}
        className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
          <span className="text-sm truncate">{getDisplayText()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${
            mapping.type === 'static' ? 'bg-green-100 text-green-700' :
            mapping.type === 'source' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
          }`}>
            {mapping.type}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(mapping.id); }}
            className="p-1 text-gray-400 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 bg-white">
          {/* Target Field Selection */}
          <FieldList
            // @ts-ignore
            fields={config.target_fields}
            fieldType="Target"
            canExtend={config.enableTargetFieldExtension}
            onAddField={onAddTargetField}
            onEditField={onEditTargetField}
            onDeleteField={onDeleteTargetField}
            selectedValue={mapping.targetField}
            onSelect={(value) => onUpdate(mapping.id, { targetField: value })}
            placeholder="Select target field"
          />

          {/* Mapping Type Selection */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Mapping Type</label>
            <div className="flex gap-2">
              {config.enableStaticValues && (
                <button
                  onClick={() => onUpdate(mapping.id, { type: 'static', sourceField: '', userField: '' })}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    mapping.type === 'static' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Static Value
                </button>
              )}
              {config.enableSourceFields && (
                <button
                  onClick={() => onUpdate(mapping.id, { type: 'source', value: '', userField: '' })}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    mapping.type === 'source' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Source Field
                </button>
              )}
              {config.enableUserFields && (
                <button
                  onClick={() => onUpdate(mapping.id, { type: 'user', value: '', sourceField: '' })}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    mapping.type === 'user' ? 'bg-purple-100 text-purple-700 border border-purple-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  User Field
                </button>
              )}
            </div>
          </div>

          {/* Value Input Based on Type */}
          {mapping.type === 'static' && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Static Value</label>
              <input
                type="text"
                value={mapping.value || ''}
                // @ts-ignore
                onChange={(e) => onUpdate(mapping.id, { value: e.target.value })}
                placeholder="Enter static value"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          )}

          {mapping.type === 'source' && (
            <FieldList
              // @ts-ignore
              fields={config.source_fields}
              fieldType="Source"
              canExtend={config.enableSourceFieldExtension}
              onAddField={onAddSourceField}
              onEditField={onEditSourceField}
              onDeleteField={onDeleteSourceField}
              selectedValue={mapping.sourceField}
              onSelect={(value) => onUpdate(mapping.id, { sourceField: value })}
              placeholder="Select source field"
            />
          )}

          {mapping.type === 'user' && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">User Field</label>
              <select
                value={mapping.userField || ''}
                // @ts-ignore
                onChange={(e) => onUpdate(mapping.id, { userField: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select user field</option>
                {config.userFields.map((field) => (
                  <option key={field.id || field.value} value={field.id || field.value}>
                    {field.label || field.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// Main Component
// @ts-ignore
export const ExtendableDataMapperField = React.memo(({ field, value = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [mappings, setMappings] = useState([]);
  const [autoMap, setAutoMap] = useState(false);
  const [sourceFields, setSourceFields] = useState([]);
  const [targetFields, setTargetFields] = useState([]);

  const config = useMemo(() => ({
    target_fields: field.target_fields || [],
    source_fields: field.source_fields || [],
    userFields: field.userFields || [],
    enableStaticValues: field.enableStaticValues ?? true,
    enableUserFields: field.enableUserFields ?? true,
    enableSourceFields: field.enableSourceFields ?? true,
    enableSourceFieldExtension: field.enableSourceFieldExtension ?? false,
    enableTargetFieldExtension: field.enableTargetFieldExtension ?? false,
    label: field.label || "Field Mapping",
    placeholder: field.placeholder || "Configure field mappings"
  }), [
    field.target_fields?.length,
    field.source_fields?.length,
    field.userFields?.length,
    field.enableStaticValues,
    field.enableUserFields,
    field.enableSourceFields,
    field.enableSourceFieldExtension,
    field.enableTargetFieldExtension,
    field.label,
    field.placeholder
  ]);

  // Initialize fields
  useEffect(() => {
    setSourceFields([...config.source_fields]);
    setTargetFields([...config.target_fields]);
  }, [config.source_fields, config.target_fields]);

  const stableValue = useMemo(() => Array.isArray(value) ? value : [], [value]);
  
  useEffect(() => {
    const currentMappingsString = JSON.stringify(mappings);
    const newValueString = JSON.stringify(stableValue);
    
    if (currentMappingsString !== newValueString) {
      if (stableValue.length > 0 || mappings.length === 0) {
        setMappings([...stableValue]);
      }
    }
  }, [stableValue]);

  const mappedCount = useMemo(() => {
    return mappings.filter(m => {
      if (!m.targetField) return false;
      switch (m.type) {
        case 'static': return m.value && m.value.trim();
        case 'source': return m.sourceField;
        case 'user': return m.userField;
        default: return false;
      }
    }).length;
  }, [mappings]);

  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(mappings) !== JSON.stringify(stableValue);
  }, [mappings, stableValue]);

  // Field management callbacks
  const addSourceField = useCallback((fieldData) => {
    setSourceFields(prev => [...prev, fieldData]);
  }, []);

  const editSourceField = useCallback((fieldId, fieldData) => {
    setSourceFields(prev => prev.map(f => 
      (f.id || f.value) === fieldId ? { ...f, ...fieldData } : f
    ));
  }, []);

  const deleteSourceField = useCallback((fieldId) => {
    setSourceFields(prev => prev.filter(f => (f.id || f.value) !== fieldId));
    // Also clean up any mappings using this field
    setMappings(prev => prev.map(m => 
      m.sourceField === fieldId ? { ...m, sourceField: '', type: 'static' } : m
    ));
  }, []);

  const addTargetField = useCallback((fieldData) => {
    setTargetFields(prev => [...prev, fieldData]);
  }, []);

  const editTargetField = useCallback((fieldId, fieldData) => {
    setTargetFields(prev => prev.map(f => 
      (f.id || f.value) === fieldId ? { ...f, ...fieldData } : f
    ));
  }, []);

  const deleteTargetField = useCallback((fieldId) => {
    setTargetFields(prev => prev.filter(f => (f.id || f.value) !== fieldId));
    // Also clean up any mappings using this field
    setMappings(prev => prev.filter(m => m.targetField !== fieldId));
  }, []);

  // Mapping management callbacks
  const addMapping = useCallback(() => {
    const newMapping = {
      id: Date.now().toString(),
      targetField: '',
      type: 'static',
      value: '', 
      sourceField: '', 
      userField: ''
    };
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
    if (JSON.stringify(mappings) !== JSON.stringify(stableValue)) {
      onChange(field.id, mappings);
    }
    setIsOpen(false);
  }, [mappings, onChange, field, stableValue]);

  const filteredMappings = useMemo(() => {
    if (!searchQuery) return mappings;
    const query = searchQuery.toLowerCase();
    return mappings.filter(mapping => {
      const targetField = targetFields.find(f => (f.id || f.value) === mapping.targetField);
      const sourceField = sourceFields.find(f => (f.id || f.value) === mapping.sourceField);
      const userField = config.userFields.find(f => (f.id || f.value) === mapping.userField);
      
      return (targetField?.label || targetField?.name || '')?.toLowerCase().includes(query) ||
             (mapping.value || '')?.toLowerCase().includes(query) ||
             (sourceField?.label || sourceField?.name || '')?.toLowerCase().includes(query) ||
             (userField?.label || userField?.name || '')?.toLowerCase().includes(query);
    });
  }, [mappings, searchQuery, targetFields, sourceFields, config.userFields]);

  const configWithDynamicFields = useMemo(() => ({
    ...config,
    source_fields: sourceFields,
    target_fields: targetFields
  }), [config, sourceFields, targetFields]);

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
          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl flex flex-col">
            
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
                      // @ts-ignore
                      mapping={mapping}
                      config={configWithDynamicFields}
                      onUpdate={updateMapping}
                      onRemove={removeMapping}
                      onToggleExpand={toggleExpanded}
                      isExpanded={expandedRows.has(mapping.id)}
                      onAddSourceField={addSourceField}
                      onEditSourceField={editSourceField}
                      onDeleteSourceField={deleteSourceField}
                      onAddTargetField={addTargetField}
                      onEditTargetField={editTargetField}
                      onDeleteTargetField={deleteTargetField}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-3">
              <ToggleSwitch
                // @ts-ignore
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
  return (
    // @ts-ignore
    JSON.stringify(prevProps.value) === JSON.stringify(nextProps.value) &&
    // @ts-ignore
    JSON.stringify(prevProps.field) === JSON.stringify(nextProps.field) &&
    // @ts-ignore
    prevProps.onChange === nextProps.onChange
  );
});
