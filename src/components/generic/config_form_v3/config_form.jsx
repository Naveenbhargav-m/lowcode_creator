import "./config_form.css";
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Code, Eye } from 'lucide-react';
import { Accordion, ArrayField, CheckboxField, ColorField, DateField, DynamicKeyValueField, NumberField, SelectField, StaticKeyValueField, styles, TextField, TimeField } from './components';

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

// Clean empty objects recursively
const cleanEmptyObjects = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  
  const result = { ...obj };
  
  Object.keys(result).forEach(key => {
    if (typeof result[key] === 'object' && result[key] !== null) {
      // Clean nested objects
      result[key] = cleanEmptyObjects(result[key]);
      
      // Remove empty objects
      if (Object.keys(result[key]).length === 0) {
        delete result[key];
      }
    } else if (result[key] === undefined) {
      // Remove undefined values
      delete result[key];
    }
  });
  
  return result;
};

// Enhanced main form component with nested object support

export const ConfigFormV3 = ({ 
  schema, 
  initialValues = {}, 
  onChange, 
  onSubmit 
}) => {
  const [activeTab, setActiveTab] = useState(schema.tabs && schema.tabs.length > 0 ? schema.tabs[0].id : null);
  const [formValues, setFormValues] = useState(initialValues);
  const [openSections, setOpenSections] = useState({});
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [jsonError, setJsonError] = useState(null);
  const [jsonValue, setJsonValue] = useState(JSON.stringify(initialValues, null, 2));

  // Initialize open sections
  useEffect(() => {
    // First section of each tab is open by default
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
  }, [schema]);

  useEffect(() => {
    setFormValues({...initialValues});
  }, [initialValues]);

  // Handle value changes with support for nested paths
  const handleFieldChange = (fieldId, value) => {
    setFormValues(prev => {
      // Support for nested paths
      const updatedValues = setNestedValue(prev, fieldId, value);
      
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

  // Get field definition by ID
  const getFieldById = (fieldId) => {
    if (!schema.fields) return null;
    return schema.fields.find(field => field.id === fieldId);
  };

  // Determine if a field should be visible based on conditions
  const isFieldVisible = (field) => {
    if (!field.condition) return true;
    
    const { dependsOn, operator, value } = field.condition;
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
      default:
        return true;
    }
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

  // Render field based on type with support for nested values
  const renderField = (field) => {
    if (!field || !isFieldVisible(field)) return null;

    // Get the actual field value using the path
    const fieldValue = getNestedValue(formValues, field.id);
    
    let fieldComponent;
    switch (field.type) {
      case 'text':
        fieldComponent = <TextField field={field} value={fieldValue} onChange={(id, value) => handleFieldChange(field.id, value)} />;
        break;
      case 'number':
        fieldComponent = <NumberField field={field} value={fieldValue} onChange={(id, value) => handleFieldChange(field.id, value)} />;
        break;
      case 'select':
        fieldComponent = <SelectField field={field} value={fieldValue} onChange={(id, value) => handleFieldChange(field.id, value)} />;
        break;
      case 'checkbox':
        fieldComponent = <CheckboxField field={field} value={fieldValue} onChange={(id, value) => handleFieldChange(field.id, value)} />;
        break;
      case 'array': 
        fieldComponent = <ArrayField field={field} value={fieldValue} onChange={(id, value) => handleFieldChange(field.id, value)} />;
        break;
      case 'color': 
        fieldComponent = <ColorField field={field} value={fieldValue} onChange={(id, value) => handleFieldChange(field.id, value)} />;
        break;
      case 'static_key_value': 
        fieldComponent = <StaticKeyValueField field={field} value={fieldValue} onChange={(id, value) => handleFieldChange(field.id, value)} />;
        break;
      case 'dynamic_key_value': 
        fieldComponent = <DynamicKeyValueField field={field} value={fieldValue} onChange={(id, value) => handleFieldChange(field.id, value)} />;
        break;
      case 'date': 
        fieldComponent = <DateField field={field} value={fieldValue} onChange={(id, value) => handleFieldChange(field.id, value)} />;
        break;
      case 'time': 
        fieldComponent = <TimeField field={field} value={fieldValue} onChange={(id, value) => handleFieldChange(field.id, value)} />;
        break;
      default:
        fieldComponent = <div>Unsupported field type: {field.type}</div>;
    }

    return (
      <div key={field.id} className={styles.fieldGroup}>
        {field.label && (
          <label htmlFor={field.id} className={styles.fieldLabel}>
            {getFieldGroupLabel(field)}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {fieldComponent}
        {field.description && (
          <p className="mt-1 text-sm text-gray-500">{field.description}</p>
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
      return fields.map(field => renderField(field));
    }
    // If fields is an array of field IDs, look up fields and render them
    return fields.map(fieldId => renderFieldById(fieldId));
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
          key={section.id}
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
          key={section.id}
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
      <div>
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
                  key={tab.id}
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
                key={tab.id}
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
              key={button.id}
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
};

// Sample usage with demo data - using the new structure with nested objects
export default function NestedConfigFormDemo() {
  const [values, setValues] = useState({
    name: 'Component 1',
    style: {
      container: {
        borderRadius: '30px',
        color: 'blue',
        padding: '10px'
      },
      label: {
        borderRadius: '5px',
        color: 'red',
        fontWeight: 'bold'
      }
    },
    animation: {
      enabled: true,
      duration: 300,
      type: 'fade'
    }
  });

  const handleChange = (newValues) => {
    setValues(newValues);
    console.log('Form values changed:', newValues);
  };

  const handleSubmit = (formValues) => {
    console.log('Form submitted with values:', formValues);
    alert('Configuration saved!');
  };

  // Schema structure with nested fields
  const schema = {
    title: 'Component Configuration',
    // Centralized field definitions with paths
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Component Name',
        placeholder: 'Enter component name',
        required: true,
      },
      // Style section - Container fields
      {
        id: 'style.container.borderRadius',
        type: 'text',
        label: 'Border Radius',
        placeholder: '0px',
        path: 'style.container',
      },
      {
        id: 'style.container.color',
        type: 'color',
        label: 'Color',
        path: 'style.container',
      },
      {
        id: 'style.container.padding',
        type: 'text',
        label: 'Padding',
        placeholder: '0px',
        path: 'style.container',
      },
      // Style section - Label fields
      {
        id: 'style.label.borderRadius',
        type: 'text',
        label: 'Border Radius',
        placeholder: '0px',
        path: 'style.label',
      },
      {
        id: 'style.label.color',
        type: 'color',
        label: 'Color',
        path: 'style.label',
      },
      {
        id: 'style.label.fontWeight',
        type: 'select',
        label: 'Font Weight',
        options: [
          { value: 'normal', label: 'Normal' },
          { value: 'bold', label: 'Bold' },
          { value: 'lighter', label: 'Lighter' },
          { value: 'bolder', label: 'Bolder' },
        ],
        path: 'style.label',
      },
      // Animation settings
      {
        id: 'animation.enabled',
        type: 'checkbox',
        checkboxLabel: 'Enable Animation',
        path: 'animation',
      },
      {
        id: 'animation.duration',
        type: 'number',
        label: 'Duration (ms)',
        min: 100,
        max: 5000,
        path: 'animation',
        condition: {
          dependsOn: 'animation.enabled',
          operator: 'equals',
          value: true,
        },
      },
      {
        id: 'animation.type',
        type: 'select',
        label: 'Animation Type',
        options: [
          { value: 'fade', label: 'Fade' },
          { value: 'slide', label: 'Slide' },
          { value: 'zoom', label: 'Zoom' },
        ],
        path: 'animation',
        condition: {
          dependsOn: 'animation.enabled',
          operator: 'equals',
          value: true,
        },
      },
    ],
    // Section definitions
    sections: [
      {
        id: 'general',
        title: 'General Information',
        fieldIds: ['name'],
      },
      {
        id: 'container-style',
        title: 'Container Style',
        fieldIds: ['style.container.borderRadius', 'style.container.color', 'style.container.padding'],
      },
      {
        id: 'label-style',
        title: 'Label Style',
        fieldIds: ['style.label.borderRadius', 'style.label.color', 'style.label.fontWeight'],
      },
      {
        id: 'animation-settings',
        title: 'Animation Settings',
        fieldIds: ['animation.enabled', 'animation.duration', 'animation.type'],
      },
    ],
    // Tab definitions
    tabs: [
      {
        id: 'basic',
        title: 'Basic Settings',
        sectionIds: ['general'],
      },
      {
        id: 'styles',
        title: 'Style Settings',
        sectionIds: ['container-style', 'label-style'],
      },
      {
        id: 'advanced',
        title: 'Advanced Settings',
        sectionIds: ['animation-settings'],
      },
    ],
    buttons: [
      {
        id: 'save',
        label: 'Save Configuration',
        type: 'submit',
        variant: 'primary',
      },
      {
        id: 'reset',
        label: 'Reset',
        type: 'button',
        variant: 'secondary',
        onClick: () => setValues({
          name: 'Component 1',
          style: {
            container: {
              borderRadius: '30px',
              color: 'blue',
              padding: '10px'
            },
            label: {
              borderRadius: '5px',
              color: 'red',
              fontWeight: 'bold'
            }
          },
          animation: {
            enabled: true,
            duration: 300,
            type: 'fade'
          }
        }),
      },
    ],
  };

  return (
    <div className="p-4 space-y-8 h-screen overflow-y-auto" style={{ maxHeight: 'calc(100vh - 40px)' }}>
      <ConfigFormV3
        schema={schema} 
        initialValues={values} 
        onChange={handleChange} 
        onSubmit={handleSubmit} 
      />
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-bold mb-2">Current Form Values:</h3>
        <pre className="whitespace-pre-wrap overflow-auto max-h-64">
          {JSON.stringify(values, null, 2)}
        </pre>
      </div>
    </div>

  );
}