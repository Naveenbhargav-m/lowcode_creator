import React, { useState, useEffect } from 'react';
import ConfigSection from './components/configSection';
import TabNav from './components/tabNav';
import { processFormValues, validateConfig } from './utils/formHelpers';
import { globalStyle } from '../../../styles/globalStyle';

const ConfigForm = ({ 
  config, 
  initialValues = {}, 
  onSave, 
  onCancel,
  onChange,
  readOnly = false
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  
  // Extract tabs from config
  const tabs = config.tabs || [{ title: 'Configuration', sections: config.sections || [] }];
  
  useEffect(() => {
    // Initialize form with default values if not provided in initialValues
    const defaultValues = {};
    
    tabs.forEach(tab => {
      tab.sections.forEach(section => {
        section.fields.forEach(field => {
          if (field.defaultValue !== undefined && values[field.id] === undefined) {
            defaultValues[field.id] = field.defaultValue;
          }
        });
      });
    });
    
    if (Object.keys(defaultValues).length > 0) {
      setValues(prev => ({ ...prev, ...defaultValues }));
    }
  }, [config]);
  
  const handleChange = (fieldId, value) => {
    setValues(prev => {
      const newValues = { ...prev, [fieldId]: value };
      
      // Run any field-specific validation
      const fieldConfig = findFieldConfig(fieldId);
      if (fieldConfig && fieldConfig.validate) {
        const error = fieldConfig.validate(value, newValues);
        setErrors(prev => ({
          ...prev,
          [fieldId]: error
        }));
      }
      
      // Call onChange callback if provided
      if (onChange) {
        onChange(newValues);
      }
      
      return newValues;
    });
  };
  
  const findFieldConfig = (fieldId) => {
    let foundField = null;
    tabs.some(tab => {
      return tab.sections.some(section => {
        const field = section.fields.find(f => f.id === fieldId);
        if (field) {
          foundField = field;
          return true;
        }
        return false;
      });
    });
    return foundField;
  };
  
  const handleSave = () => {
    // Validate all fields
    const validationErrors = validateConfig(values, tabs);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Process values before saving (e.g., format dates, etc.)
    const processedValues = processFormValues(values, tabs);
    
    if (onSave) {
      onSave(processedValues);
    }
  };
  
  return (
    <div className="config-form" style={{...globalStyle}}>
      {tabs.length > 1 && (
        <TabNav 
          tabs={tabs.map(tab => tab.title)} 
          defaultActiveTab={activeTab}
          onChange={setActiveTab} 
        />
      )}
      
      <div className="config-form-content">
        {tabs[activeTab].sections.map((section, index) => (
          <ConfigSection
            key={`section-${index}`}
            section={section}
            values={values}
            errors={errors}
            onChange={handleChange}
            readOnly={readOnly}
          />
        ))}
      </div>
      
      <div className="config-form-actions">
        {onCancel && (
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={readOnly}
          >
            Cancel
          </button>
        )}
        {onSave && (
          <button 
            type="button" 
            className="btn btn-primary ml-2" 
            onClick={handleSave}
            disabled={readOnly}
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default ConfigForm;
