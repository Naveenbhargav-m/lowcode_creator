// ConfigForm.js
import TabView, { Accordion, ArrayField, CodeEditorField, KeyValueMapper, SelectField, TextField } from "./components/fields";
import CodeEditorModal from "./components/code_model";
import { Code } from "lucide-react";

import { useState, useEffect } from "preact/hooks";
const ConfigForm = ({
  config,
  initialValues,
  onChange,
  onSubmit
}) => {
  const [values, setValues] = useState(initialValues || {});
  const [activeTab, setActiveTab] = useState('');
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  
  // Update values when initialValues prop changes
  useEffect(() => {
    if (initialValues) {
      setValues(initialValues);
    }
  }, [initialValues]);
  
  // Set activeTab whenever config changes
  useEffect(() => {
    if (config && config.sections && config.sections.length > 0) {
      setActiveTab(config.sections[0]?.id || '');
    }
  }, [config]);
  
  // Create tabs array for TabView component
  const tabs = config?.sections?.map(section => ({
    id: section.id,
    label: section.title
  })) || [];
  
  // Handle field change
  const handleChange = (fieldId, value) => {
    const newValues = { ...values, [fieldId]: value };
    setValues(newValues);
    if (onChange) {
      onChange(newValues);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (onSubmit) {
      onSubmit(values);
    }
  };
  
  // Open code editor
  const openCodeEditor = () => {
    setShowCodeEditor(true);
  };
  
  // Close code editor
  const closeCodeEditor = () => {
    setShowCodeEditor(false);
  };
  
  // Apply JSON changes
  const applyJsonChanges = (updatedValues) => {
    setValues(updatedValues);
    if (onChange) {
      onChange(updatedValues);
    }
    setShowCodeEditor(false);
  };
  
  // Determine if a field should be visible based on dependencies
  const isFieldVisible = (field) => {
    if (!field.dependencies) return true;
    
    for (const dependency of field.dependencies) {
      const { field: dependentField, value, operator = '==', show } = dependency;
      const currentValue = values[dependentField];
      
      let conditionMet = false;
      
      switch (operator) {
        case '==':
          conditionMet = currentValue === value;
          break;
        case '!=':
          conditionMet = currentValue !== value;
          break;
        case '>':
          conditionMet = currentValue > value;
          break;
        case '<':
          conditionMet = currentValue < value;
          break;
        case 'includes':
          conditionMet = Array.isArray(currentValue) && currentValue.includes(value);
          break;
        case 'empty':
          conditionMet = currentValue === undefined || currentValue === '' || 
                       (Array.isArray(currentValue) && currentValue.length === 0);
          break;
        case 'notEmpty':
          conditionMet = currentValue !== undefined && currentValue !== '' && 
                       (!Array.isArray(currentValue) || currentValue.length > 0);
          break;
        default:
          conditionMet = currentValue === value;
      }
      
      if (show === false && conditionMet) return false;
      if (show === true && !conditionMet) return false;
    }
    
    return true;
  };
  
  // Render a field based on its type
  const renderField = (field) => {
    const { id, type, label, description, ...props } = field;
    
    if (!isFieldVisible(field)) return null;
    
    switch (type) {
      case 'text':
        return (
          <TextField
            key={id}
            id={id}
            label={label}
            description={description}
            value={values[id] || ''}
            onChange={(value) => handleChange(id, value)}
            {...props}
          />
        );
      case 'select':
        return (
          <SelectField
            key={id}
            id={id}
            label={label}
            description={description}
            value={values[id] || ''}
            onChange={(value) => handleChange(id, value)}
            {...props}
          />
        );
      case 'mapping':
        return (
          <KeyValueMapper
            key={id}
            id={id}
            label={label}
            description={description}
            value={values[id] || {}}
            onChange={(value) => handleChange(id, value)}
            {...props}
          />
        );
      case 'array':
        return (
          <ArrayField
            key={id}
            id={id}
            label={label}
            description={description}
            value={values[id] || []}
            onChange={(value) => handleChange(id, value)}
            {...props}
          />
        );
      case 'code':
        return (
          <CodeEditorField
            key={id}
            id={id}
            label={label}
            description={description}
            value={values[id] || ""}
            onChange={(value) => handleChange(id, value)}
            {...props} 
          />
        );
      default:
        return null;
    }
  };
  
  // Render the content for the active tab
  const renderActiveTabContent = () => {
    if (!config || !config.sections) return null;
    
    const activeSection = config.sections.find(section => section.id === activeTab);
    if (!activeSection) return null;
    
    return (
      <div className="mt-4">
        {activeSection.groups && activeSection.groups.map((group) => (
          <Accordion key={group.id} title={group.title}>
            <div className="">
              {group.fields && group.fields.map(field => renderField(field))}
            </div>
          </Accordion>
        ))}
      </div>
    );
  };
  
  // If config is not valid, return early
  if (!config || !config.sections || config.sections.length === 0) {
    return <div>No configuration available</div>;
  }
  
  return (
    <div style={{width:"100%"}}>
      <button
        type="button"
        onClick={openCodeEditor}
        className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none flex items-center gap-1"
        title="Edit JSON"
        style={{marginTop:"10px", marginBottom:"10px"}}
      >
        <Code />
        <span className="text-sm font-medium">Code</span>
      </button>
      <div className="w-full relative" style={{width:"inherit"}}>
        <TabView 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          className=""
        />
        
        {renderActiveTabContent()}
        
        <div className="mt-6 flex justify-end">
          <button 
            type="button" 
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Configuration
          </button>
        </div>
        
        {/* Use the separate CodeEditorModal component */}
        <CodeEditorModal
          isOpen={showCodeEditor}
          initialValue={JSON.stringify(values, null, 2)}
          onClose={closeCodeEditor}
          onSave={applyJsonChanges}
        />
      </div>
    </div>
  );
};

export { ConfigForm };