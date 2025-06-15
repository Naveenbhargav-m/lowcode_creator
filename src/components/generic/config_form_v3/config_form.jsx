import "./config_form.css";
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Code, Eye } from 'lucide-react';
import Demo, { Accordion, ActionsConfig, ArrayField, CheckboxField, ColorField, DateField, DynamicKeyValueField, GlobalSelectField, NumberField, OptionsListField, SelectField, StaticKeyValueField, styles, TextField, TimeField } from './components';
import DataMappingComponent from "../dynamic_data_picker/data_picker";
import { DataMapperField, GlobalJavaScriptField } from "./componentss2";
import { ExtendableDataMapperField } from "./mapper_componets";
import { MultiValuePicker, SingleValuePicker } from "./data_pickers";


// Helper functions for handling nested objects
const getNestedValue = (obj, path) => {
  if (!path) return obj;
  
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === undefined || result === null) return undefined;
    result = result[key];
  }
  
  return result;
};

const setNestedValue = (obj, path, value) => {
  if (!path) return value;
  
  const keys = path.split('.');
  const result = { ...obj };
  let current = result;
  
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    
    if (i === keys.length - 1) {
      // If value is undefined or null and we want to clear it
      if (value === undefined || value === null) {
        delete current[key];
      } else {
        current[key] = value;
      }
    } else {
      // Create the object path if it doesn't exist
      if (current[key] === undefined || current[key] === null) {
        current[key] = {};
      }
      current = current[key];
    }
  }
  
  return result;
};

const cleanEmptyObjects = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj
      .map(item => cleanEmptyObjects(item))
      .filter(item => {
        if (typeof item === 'object' && item !== null) {
          return Object.keys(item).length > 0;
        }
        return item !== undefined;
      });
  }
  
  // Handle objects
  const result = { ...obj };
  
  Object.keys(result).forEach(key => {
    if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = cleanEmptyObjects(result[key]);
      
      if (Array.isArray(result[key])) {
        // Keep arrays even if empty, or remove based on your needs
      } else if (Object.keys(result[key]).length === 0) {
        delete result[key];
      }
    } else if (result[key] === undefined) {
      delete result[key];
    }
  });
  
  return result;
};

// Helper function to evaluate dynamic conditions
const evaluateCondition = (condition, formValues) => {
  if (!condition) return true;
  
  const { dependsOn, operator, value } = condition;
  const dependentValue = getNestedValue(formValues, dependsOn);
  switch (operator) {
    case 'equals':
      return dependentValue === value;
    case 'notEquals':
      return dependentValue !== value;
    case 'contains':
      return dependentValue?.includes(value);
    case 'greaterThan':
      return dependentValue > value;
    case 'lessThan':
      return dependentValue < value;
    case 'exists':
      return dependentValue !== undefined && dependentValue !== null;
    case 'notExists':
      return dependentValue === undefined || dependentValue === null;
    case 'in':
      return Array.isArray(value) && value.includes(dependentValue);
    case 'notIn':
      return Array.isArray(value) && !value.includes(dependentValue);
    default:
      return true;
  }
};


// Helper function to safely set nested properties
const setNestedProperty = (obj, path, value) => {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
};

// Helper function to get nested property value
const getNestedProperty = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// Helper function to merge arrays based on merge mode
const mergeArrays = (original = [], newData = [], mergeMode = 'replace', filterCondition = null) => {
  switch (mergeMode) {
    case 'append':
      return [...original, ...newData];
    case 'prepend':
      return [...newData, ...original];
    case 'filter':
      return filterCondition 
        ? original.filter(filterCondition)
        : original.filter(item => newData.includes(item.value || item));
    case 'merge':
      // Merge objects in arrays, or combine unique primitives
      if (original.length && typeof original[0] === 'object') {
        const merged = [...original];
        newData.forEach(newItem => {
          const existingIndex = merged.findIndex(item => item.id === newItem.id || item.value === newItem.value);
          if (existingIndex >= 0) {
            merged[existingIndex] = { ...merged[existingIndex], ...newItem };
          } else {
            merged.push(newItem);
          }
        });
        return merged;
      }
      return [...new Set([...original, ...newData])];
    case 'replace':
    default:
      return newData;
  }
};

// Enhanced dynamic configuration function
const applyDynamicConfig = (field, formValues, context = {}) => {
  if (!field.dynamicConfig) return field;
  
  let dynamicField = { ...field };
  
  // Process each dynamic configuration rule
  for (const config of field.dynamicConfig) {
    if (evaluateCondition(config.condition, formValues)) {
      // Handle callback-based changes
      if (config.callback) {
        try {
          let callbackResult;
          
          if (typeof config.callback === 'function') {
            // Direct function callback
            callbackResult = config.callback(formValues, field, context);
          } else if (typeof config.callback === 'string') {
            // Named callback from context
            const callbackFn = context.callbacks?.[config.callback];
            if (callbackFn) {
              console.log("in config form context:", formValues, field);
              callbackResult = callbackFn(formValues, field, context);
            }
          } else if (typeof config.callback === 'object') {
            // Callback configuration object
            const { fn, params = {} } = config.callback;
            const callbackFn = typeof fn === 'string' ? context.callbacks?.[fn] : fn;
            if (callbackFn) {
              callbackResult = callbackFn(formValues, field, context, params);
            }
          }
          
          // Process callback result
          if (callbackResult) {
            if (config.assignTo) {
              // Assign callback result to specific key(s)
              if (Array.isArray(config.assignTo)) {
                // Multiple assignments
                config.assignTo.forEach(assignment => {
                  const { key, transform } = typeof assignment === 'string' 
                    ? { key: assignment, transform: null }
                    : assignment;
                  
                  let value = callbackResult;
                  if (transform && typeof transform === 'function') {
                    value = transform(value, formValues, field);
                  }
                  
                  setNestedProperty(dynamicField, key, value);
                });
              } else if (typeof config.assignTo === 'string') {
                // Single assignment
                setNestedProperty(dynamicField, config.assignTo, callbackResult);
              } else if (typeof config.assignTo === 'object') {
                // Object-based assignment with transformations
                Object.entries(config.assignTo).forEach(([key, transform]) => {
                  let value = callbackResult;
                  if (typeof transform === 'function') {
                    value = transform(value, formValues, field);
                  } else if (typeof transform === 'string') {
                    // JSONPath-like selector for nested callback result
                    value = getNestedProperty(callbackResult, transform);
                  }
                  setNestedProperty(dynamicField, key, value);
                });
              }
            } else {
              // Default: merge callback result into field
              dynamicField = { ...dynamicField, ...callbackResult };
            }
          }
        } catch (error) {
          console.error('Dynamic config callback error:', error);
          // Continue processing other configs
        }
      }
      
      // Handle static changes
      if (config.changes) {
        Object.entries(config.changes).forEach(([key, value]) => {
          const currentValue = getNestedProperty(dynamicField, key);
          
          // Special handling for arrays
          if (Array.isArray(currentValue) || Array.isArray(value)) {
            const mergeMode = config.mergeMode || 'replace';
            const mergedValue = mergeArrays(
              currentValue, 
              value, 
              mergeMode,
              config.filterCondition
            );
            setNestedProperty(dynamicField, key, mergedValue);
          }
          // Special handling for objects (like validation rules)
          else if (currentValue && typeof currentValue === 'object' && typeof value === 'object') {
            const mergeMode = config.mergeMode || 'merge';
            if (mergeMode === 'replace') {
              setNestedProperty(dynamicField, key, value);
            } else {
              setNestedProperty(dynamicField, key, { ...currentValue, ...value });
            }
          }
          // Primitive values
          else {
            setNestedProperty(dynamicField, key, value);
          }
        });
      }
      
      // Handle conditional field transformations
      if (config.transform && typeof config.transform === 'function') {
        dynamicField = config.transform(dynamicField, formValues, context);
      }
    }
  }
  
  return dynamicField;
};


// Enhanced main form component with nested object support and dynamic field configuration


export function ConfigFormV3({ 
  schema, 
  initialValues = {}, 
  context = {},
  onChange, 
  onSubmit 
}) {
  const [activeTab, setActiveTab] = useState(schema.tabs && schema.tabs.length > 0 ? schema.tabs[0].id : null);
  const [formValues, setFormValues] = useState(initialValues);
  const [openSections, setOpenSections] = useState({});
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [jsonError, setJsonError] = useState(null);
  const [jsonValue, setJsonValue] = useState(JSON.stringify(initialValues, null, 2));

  // Reset component state when schema changes (new block type)
  useEffect(() => {
    // Reset active tab
    const newActiveTab = schema.tabs && schema.tabs.length > 0 ? schema.tabs[0].id : null;
    setActiveTab(newActiveTab);
    
    // Reset JSON mode
    setIsJsonMode(false);
    setJsonError(null);
    
    // Reset form values
    setFormValues({...initialValues});
    setJsonValue(JSON.stringify(initialValues, null, 2));
    
    // Reset open sections
    const initialOpenSections = {};
    if (schema.tabs) {
      schema.tabs.forEach(tab => {
        if (tab.sectionIds && tab.sectionIds.length > 0) {
          initialOpenSections[tab.sectionIds[0]] = true;
        }
      });
    } else if (schema.sections) {
      if (schema.sections.length > 0) {
        initialOpenSections[schema.sections[0].id] = true;
      }
    }
    setOpenSections(initialOpenSections);
  }, [schema, initialValues]); // Add both schema and initialValues as dependencies

  // Handle value changes with support for nested paths
  const handleFieldChange = (fieldId, value) => {
    setFormValues(prev => {
      // Support for nested paths
      const updatedValues = setNestedValue(prev, fieldId, value);
      console.log("handle change:", updatedValues, fieldId);
      if (onChange) {
        // Clean empty objects before returning
        onChange(cleanEmptyObjects(updatedValues));
      }
      
      return updatedValues;
    });
  };

  // Toggle accordion sections
  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Handle JSON editor changes
  const handleJsonChange = (jsonString) => {
    setJsonValue(jsonString);
    try {
      const parsed = JSON.parse(jsonString);
      setJsonError(null);
      setFormValues(parsed);
      if (onChange) {
        onChange(cleanEmptyObjects(parsed));
      }
    } catch (error) {
      setJsonError('Invalid JSON format');
    }
  };

  // Toggle between form and JSON mode
  const toggleJsonMode = () => {
    if (!isJsonMode) {
      // Switching to JSON mode
      setJsonValue(JSON.stringify(formValues, null, 2));
    }
    setIsJsonMode(!isJsonMode);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (onSubmit) {
      // Clean empty objects before submitting
      onSubmit(cleanEmptyObjects(formValues));
    }
  };

  // Get field definition by ID with dynamic configuration applied
  const getFieldById = (fieldId) => {
    if (!schema.fields) return null;
    const field = schema.fields.find(field => field.id === fieldId);
    if (!field) return null;
    
    // Apply dynamic configuration based on current form values
    return applyDynamicConfig(field, formValues, context);
  };

  // Determine if a field should be visible based on conditions
  const isFieldVisible = (field) => {
    return evaluateCondition(field.condition, formValues);
  };

  // Generate a field label with path information
  const getFieldGroupLabel = (field) => {
    // If the field has a parent path, show it
    if (field.path && !field.hidePathInLabel) {
      const pathParts = field.path.split('.');
      return `${pathParts[pathParts.length - 1]}: ${field.label || ''}`;
    }
    
    return field.label || '';
  };

  // Render field based on type with support for nested values and dynamic configuration
  const renderField = (field) => {
    if (!field || !isFieldVisible(field)) return null;

    // Apply dynamic configuration to the field
    const dynamicField = applyDynamicConfig(field, formValues, context);
    
    // Get the actual field value using the path
    const fieldValue = getNestedValue(formValues, dynamicField.id);
    
    let fieldComponent;
    switch (dynamicField.type) {
      case 'actions_config': 
        console.log("field value :",fieldValue, dynamicField, formValues, field);
        fieldComponent = <ActionsConfig configs={fieldValue} onChange={(value) => {
          console.log("value to be updated:",value, dynamicField.id);
          handleFieldChange(dynamicField.id, value);
        }}/>
        break;
      case "single_picker":
        fieldComponent = <SingleValuePicker 
          field={dynamicField}
          value={fieldValue}
          onChange={(id, value) => handleFieldChange(dynamicField.id, value)}
        />
        break;
      case "mulit_picker":
        fieldComponent = <MultiValuePicker 
          field={dynamicField}
          value={fieldValue}
          onChange={(id, value) => handleFieldChange(dynamicField.id, value)}
        />
        break;
      case "extended_data_mapper":
          fieldComponent = <ExtendableDataMapperField 
          // @ts-ignore
          field={dynamicField} value={fieldValue} 
          onChange={(id, value) => {handleFieldChange(dynamicField.id, value)}} />
          break;
      case "data_mapper":
          // @ts-ignore
          fieldComponent = <DataMapperField field={dynamicField} value={fieldValue} onChange={(is,value) => {console.log("dynamic field value:",value);handleFieldChange(dynamicField.id, value)}}/>;
          break;
      case "code":
          fieldComponent = <GlobalJavaScriptField field={dynamicField} value={fieldValue} onChange={(id, value) => handleFieldChange(dynamicField.id, value)}/>;
          break;
      case "field_mapper":
          fieldComponent = <DataMappingComponent field={dynamicField} value={fieldValue} onChange={(id,value) => handleFieldChange(dynamicField.id, value)} />
          break;
      case 'data_picker':
        fieldComponent = <GlobalSelectField field={dynamicField} value={fieldValue} onChange={(id, value) => handleFieldChange(dynamicField.id, value)}/>
        break;
      case 'option_mapper':
        fieldComponent = <OptionsListField field={dynamicField} value={fieldValue} onChange={(id, value) => handleFieldChange(dynamicField.id, value)} />
        break;
      case 'text':
        fieldComponent = <TextField field={dynamicField} value={fieldValue} onChange={(id, value) => handleFieldChange(dynamicField.id, value)} />;
        break;
      case 'number':
        fieldComponent = <NumberField field={dynamicField} value={fieldValue} onChange={(id, value) => handleFieldChange(dynamicField.id, value)} />;
        break;
      case 'dropdown':
      case 'select':
        fieldComponent = <SelectField field={dynamicField} value={fieldValue} onChange={(id, value) => handleFieldChange(dynamicField.id, value)} />;
        break;
      case 'checkbox':
        fieldComponent = <CheckboxField field={dynamicField} value={fieldValue} onChange={(id, value) => handleFieldChange(dynamicField.id, value)} />;
        break;
      case 'array': 
        fieldComponent = <ArrayField field={dynamicField} value={fieldValue} onChange={(id, value) => handleFieldChange(dynamicField.id, value)} />;
        break;
      case 'color': 
        fieldComponent = <ColorField field={dynamicField} value={fieldValue} onChange={(id, value) => handleFieldChange(dynamicField.id, value)} />;
        break;
      case 'static_key_value': 
        fieldComponent = <StaticKeyValueField field={dynamicField} value={fieldValue} onChange={(id, value) => handleFieldChange(dynamicField.id, value)} />;
        break;
      case 'dynamic_key_value': 
        fieldComponent = <DynamicKeyValueField field={dynamicField} value={fieldValue} onChange={(id, value) => handleFieldChange(dynamicField.id, value)} />;
        break;
      case 'date': 
        fieldComponent = <DateField field={dynamicField} value={fieldValue} onChange={(id, value) => handleFieldChange(dynamicField.id, value)} />;
        break;
      case 'time': 
        fieldComponent = <TimeField field={dynamicField} value={fieldValue} onChange={(id, value) => handleFieldChange(dynamicField.id, value)} />;
        break;
      default:
        fieldComponent = <div>Unsupported field type: {dynamicField.type}</div>;
    }

    return (
      <div key={dynamicField.id} className={styles.fieldGroup}>
        {dynamicField.label && (
          <label htmlFor={dynamicField.id} className={styles.fieldLabel}>
            {getFieldGroupLabel(dynamicField)}
            {dynamicField.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {fieldComponent}
        {dynamicField.description && (
          <p className="mt-1 text-sm text-gray-500">{dynamicField.description}</p>
        )}
      </div>
    );
  };

  // Render field by ID
  const renderFieldById = (fieldId) => {
    const field = getFieldById(fieldId);
    return renderField(field);
  };

  // Render section fields
  const renderSectionFields = (fields) => {
    // If fields is an array of field objects, render them directly
    if (fields && typeof fields[0] === 'object') {
      return fields.map((field, index) => renderField({...field, key: `field-${field.id || index}`}));
    }
    // If fields is an array of field IDs, look up fields and render them
    return fields.map((fieldId, index) => renderFieldById(fieldId));
  };

  // Get section by ID
  const getSectionById = (sectionId) => {
    if (!schema.sections) return null;
    return schema.sections.find(section => section.id === sectionId);
  };

  // Render sections
  const renderSections = (sections) => {
    // If sections is an array of section objects, render them directly
    if (sections && typeof sections[0] === 'object') {
      return sections.map(section => (
        <Accordion
          key={`section-${section.id}`}
          title={section.title}
          isOpen={!!openSections[section.id]}
          toggle={() => toggleSection(section.id)}
        >
          {section.fields && renderSectionFields(section.fields)}
          {section.fieldIds && renderSectionFields(section.fieldIds)}
        </Accordion>
      ));
    }
    // If sections is an array of section IDs, look up sections and render them
    return sections.map(sectionId => {
      const section = getSectionById(sectionId);
      if (!section) return null;
      
      return (
        <Accordion
          key={`section-${section.id}`}
          title={section.title}
          isOpen={!!openSections[section.id]}
          toggle={() => toggleSection(section.id)}
        >
          {section.fields && renderSectionFields(section.fields)}
          {section.fieldIds && renderSectionFields(section.fieldIds)}
        </Accordion>
      );
    });
  };

  // Render a tab's content
  const renderTabContent = (tab) => {
    return (
      <div key={`tab-content-${tab.id}`}>
        {tab.sections && renderSections(tab.sections)}
        {tab.sectionIds && renderSections(tab.sectionIds)}
        {tab.fields && renderSectionFields(tab.fields)}
        {tab.fieldIds && renderSectionFields(tab.fieldIds)}
      </div>
    );
  };

  // Render the JSON editor
  const renderJsonEditor = () => {
    return (
      <div>
        <div className={styles.jsonEditorHeader}>
          <h3 className="text-md font-medium">JSON Editor</h3>
        </div>
        <textarea
          className={styles.jsonEditor}
          value={jsonValue}
          // @ts-ignore
          onChange={(e) => handleJsonChange(e.target.value)}
        />
        {jsonError && <div className={styles.error}>{jsonError}</div>}
      </div>
    );
  };

  // Render form content based on schema structure
  const renderFormContent = () => {
    if (isJsonMode) {
      return renderJsonEditor();
    }

    if (schema.tabs) {
      return (
        <>
         <div className="overflow-x-auto pb-4">
         <div className="flex whitespace-nowrap">
              {schema.tabs.map((tab) => (
                <div
                  key={`tab-${tab.id}`}
                  className={`${styles.tab} ${
                    activeTab === tab.id ? styles.activeTab : styles.inactiveTab
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.title}
                </div>
              ))}
            </div>
          </div>
         
          <div className={styles.tabContent}>
            {schema.tabs.map((tab) => (
              <div
                key={`tab-content-wrapper-${tab.id}`}
                style={{ display: activeTab === tab.id ? 'block' : 'none' }}
              >
                {renderTabContent(tab)}
              </div>
            ))}
            </div>
        </>
      );
    }

    if (schema.sections) {
      return renderSections(schema.sections);
    }

    if (schema.sectionIds) {
      return renderSections(schema.sectionIds);
    }

    if (schema.fields) {
      return renderSectionFields(schema.fields);
    }

    if (schema.fieldIds) {
      return renderSectionFields(schema.fieldIds);
    }

    return <div>No form content defined</div>;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{schema.title || 'Configuration'}</h2>
        <div 
          className={styles.modeSwitcher} 
          onClick={toggleJsonMode}
        >
          {isJsonMode ? (
            <>
              <Eye size={14} className="mr-1" /> Form Mode
            </>
          ) : (
            <>
              <Code size={14} className="mr-1" /> JSON Mode
            </>
          )}
        </div>
      </div>

      <div className={styles.formContainer}>
        {renderFormContent()}

        <div className={styles.buttonGroup}>
          {schema.buttons?.map((button) => (
            <button
              key={`button-${button.id}`}
              type="button"
              className={`${styles.button} ${
                button.variant === 'primary' ? styles.primaryButton : styles.secondaryButton
              }`}
              onClick={button.type === 'submit' ? handleSubmit : button.onClick}
            >
              {button.label}
            </button>
          ))}
          {!schema.buttons && (
            <button
              type="button"
              className={`${styles.button} ${styles.primaryButton}`}
              onClick={handleSubmit}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}



































/*
USAGE EXAMPLES:

// Example 1: Dynamic Select Options based on another field
const schemaExample1 = {
  fields: [
    {
      id: 'category',
      type: 'select',
      label: 'Category',
      options: [
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' },
        { value: 'books', label: 'Books' }
      ]
    },
    {
      id: 'subcategory',
      type: 'select',
      label: 'Subcategory',
      options: [], // Base options (empty)
      dynamicConfig: [
        {
          condition: { dependsOn: 'category', operator: 'equals', value: 'electronics' },
          changes: {
            options: [
              { value: 'phones', label: 'Phones' },
              { value: 'laptops', label: 'Laptops' },
              { value: 'tablets', label: 'Tablets' }
            ]
          },
          mergeMode: 'replace'
        },
        {
          condition: { dependsOn: 'category', operator: 'equals', value: 'clothing' },
          changes: {
            options: [
              { value: 'shirts', label: 'Shirts' },
              { value: 'pants', label: 'Pants' },
              { value: 'shoes', label: 'Shoes' }
            ]
          },
          mergeMode: 'replace'
        },
        {
          condition: { dependsOn: 'category', operator: 'equals', value: 'books' },
          changes: {
            options: [
              { value: 'fiction', label: 'Fiction' },
              { value: 'non-fiction', label: 'Non-Fiction' },
              { value: 'textbooks', label: 'Textbooks' }
            ]
          },
          mergeMode: 'replace'
        }
      ]
    }
  ]
};

// Example 2: Dynamic Field Properties (label, required, validation)
const schemaExample2 = {
  fields: [
    {
      id: 'userType',
      type: 'select',
      label: 'User Type',
      options: [
        { value: 'individual', label: 'Individual' },
        { value: 'business', label: 'Business' }
      ]
    },
    {
      id: 'taxId',
      type: 'text',
      label: 'Tax ID',
      required: false,
      dynamicConfig: [
        {
          condition: { dependsOn: 'userType', operator: 'equals', value: 'business' },
          changes: {
            label: 'Business Tax ID',
            required: true,
            validation: {
              pattern: '^[0-9]{2}-[0-9]{7}$',
              message: 'Tax ID must be in format: XX-XXXXXXX'
            }
          }
        },
        {
          condition: { dependsOn: 'userType', operator: 'equals', value: 'individual' },
          changes: {
            label: 'SSN (Optional)',
            required: false,
            validation: {
              pattern: '^[0-9]{3}-[0-9]{2}-[0-9]{4}$',
              message: 'SSN must be in format: XXX-XX-XXXX'
            }
          }
        }
      ]
    }
  ]
};

// Example 3: Dynamic Field Type Change
const schemaExample3 = {
  fields: [
    {
      id: 'inputMode',
      type: 'select',
      label: 'Input Mode',
      options: [
        { value: 'text', label: 'Text Input' },
        { value: 'select', label: 'Dropdown' },
        { value: 'number', label: 'Number Input' }
      ]
    },
    {
      id: 'dynamicField',
      type: 'text',
      label: 'Dynamic Field',
      dynamicConfig: [
        {
          condition: { dependsOn: 'inputMode', operator: 'equals', value: 'select' },
          changes: {
            type: 'select',
            options: [
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' }
            ]
          }
        },
        {
          condition: { dependsOn: 'inputMode', operator: 'equals', value: 'number' },
          changes: {
            type: 'number',
            validation: {
              min: 0,
              max: 100
            }
          }
        }
      ]
    }
  ]
};

// Example 4: Conditional Options Filtering
const schemaExample4 = {
  fields: [
    {
      id: 'plan',
      type: 'select',
      label: 'Plan Type',
      options: [
        { value: 'basic', label: 'Basic' },
        { value: 'premium', label: 'Premium' },
        { value: 'enterprise', label: 'Enterprise' }
      ]
    },
    {
      id: 'features',
      type: 'select',
      label: 'Available Features',
      multiple: true,
      options: [
        { value: 'feature1', label: 'Basic Feature 1', plan: 'basic' },
        { value: 'feature2', label: 'Basic Feature 2', plan: 'basic' },
        { value: 'feature3', label: 'Premium Feature 1', plan: 'premium' },
        { value: 'feature4', label: 'Premium Feature 2', plan: 'premium' },
        { value: 'feature5', label: 'Enterprise Feature 1', plan: 'enterprise' },
        { value: 'feature6', label: 'Enterprise Feature 2', plan: 'enterprise' }
      ],
      dynamicConfig: [
        {
          condition: { dependsOn: 'plan', operator: 'equals', value: 'basic' },
          changes: {
            options: [
              { value: 'feature1', label: 'Basic Feature 1' },
              { value: 'feature2', label: 'Basic Feature 2' }
            ]
          },
          mergeMode: 'replace'
        },
        {
          condition: { dependsOn: 'plan', operator: 'equals', value: 'premium' },
          changes: {
            options: [
              { value: 'feature1', label: 'Basic Feature 1' },
              { value: 'feature2', label: 'Basic Feature 2' },
              { value: 'feature3', label: 'Premium Feature 1' },
              { value: 'feature4', label: 'Premium Feature 2' }
            ]
          },
          mergeMode: 'replace'
        }
      ]
    }
  ]
};

*/