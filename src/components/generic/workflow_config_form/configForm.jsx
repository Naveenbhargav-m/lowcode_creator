// ConfigForm.jsx
import { useState } from "preact/hooks";
import TabView, { TextField, KeyValueMapper, ArrayField, Accordion, SelectField } from "./components/fields";

const ConfigForm = ({ 
  config, 
  initialValues, 
  onChange, 
  onSubmit 
}) => {
  const [values, setValues] = useState(initialValues || {});
  const [activeTab, setActiveTab] = useState(config.sections[0]?.id || '');
  
  // Create tabs array for TabView component
  const tabs = config.sections.map(section => ({
    id: section.id,
    label: section.title
  }));
  
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
    e.preventDefault();
    if (onSubmit) {
      onSubmit(values);
    }
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
      default:
        return null;
    }
  };
  
  // Render the content for the active tab
  const renderActiveTabContent = () => {
    const activeSection = config.sections.find(section => section.id === activeTab);
    if (!activeSection) return null;
    
    return (
      <div className="mt-4">
        {activeSection.groups.map((group) => (
          <Accordion key={group.id} title={group.title}>
            <div className="p-4 space-y-4">
              {group.fields.map(field => renderField(field))}
            </div>
          </Accordion>
        ))}
      </div>
    );
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl">
      <TabView 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        className={""}
      />
      
      {renderActiveTabContent()}
      
      <div className="mt-6 flex justify-end">
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Save Configuration
        </button>
      </div>
    </form>
  );
};

export default ConfigForm;