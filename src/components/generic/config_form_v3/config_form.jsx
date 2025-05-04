import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Code, Eye } from 'lucide-react';
import { Accordion, ArrayField, CheckboxField, ColorField, DateField, DynamicKeyValueField, NumberField, SelectField, StaticKeyValueField, styles, TextField, TimeField } from './components';

// Centralized styles - same as original

// Improved main form component
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

  // Handle value changes
  const handleFieldChange = (fieldId, value) => {
    setFormValues(prev => {
      const newValues = { ...prev, [fieldId]: value };
      if (onChange) {
        onChange(newValues);
      }
      return newValues;
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
        onChange(parsed);
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
      onSubmit(formValues);
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
    const dependentValue = formValues[dependsOn];
    
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

  // Render field based on type
  const renderField = (field) => {
    if (!field || !isFieldVisible(field)) return null;

    let fieldComponent;
    switch (field.type) {
      case 'text':
        fieldComponent = <TextField field={field} value={formValues[field.id]} onChange={handleFieldChange} />;
        break;
      case 'number':
        fieldComponent = <NumberField field={field} value={formValues[field.id]} onChange={handleFieldChange} />;
        break;
      case 'select':
        fieldComponent = <SelectField field={field} value={formValues[field.id]} onChange={handleFieldChange} />;
        break;
      case 'checkbox':
        fieldComponent = <CheckboxField field={field} value={formValues[field.id]} onChange={handleFieldChange} />;
        break;
      case 'array': 
        fieldComponent = <ArrayField field={field} value={formValues[field.id]} onChange={handleFieldChange}/>
        break;
      case 'color': 
        fieldComponent = <ColorField field={field} value={formValues[field.id]} onChange={handleFieldChange}/>
        break;
      case 'static_key_value': 
        fieldComponent = <StaticKeyValueField field={field} value={formValues[field.id]} onChange={handleFieldChange}/>
        break;
      case 'dynamic_key_value': 
        fieldComponent = <DynamicKeyValueField field={field} value={formValues[field.id]} onChange={handleFieldChange}/>
        break;
      case 'date': 
        fieldComponent = <DateField field={field} value={formValues[field.id]} onChange={handleFieldChange}/>
        break;
      case 'time': 
        fieldComponent = <TimeField field={field} value={formValues[field.id]} onChange={handleFieldChange}/>
        break;
      default:
        fieldComponent = <div>Unsupported field type: {field.type}</div>;
    }

    return (
      <div key={field.id} className={styles.fieldGroup}>
        {field.label && (
          <label htmlFor={field.id} className={styles.fieldLabel}>
            {field.label}
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
          <div className={styles.tabsContainer}>
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
          {schema.tabs.map((tab) => (
            <div
              key={tab.id}
              style={{ display: activeTab === tab.id ? 'block' : 'none' }}
            >
              {renderTabContent(tab)}
            </div>
          ))}
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
              <Eye size={16} className="mr-1" /> Form Mode
            </>
          ) : (
            <>
              <Code size={16} className="mr-1" /> JSON Mode
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

// Sample usage with demo data - using the new structure
export default function ImprovedConfigFormDemo() {
  const [values, setValues] = useState({
    name: 'Workflow 1',
    type: 'sequential',
    maxRetries: 3,
    timeout: 60,
    enableLogging: true,
    description: 'This is a sample workflow',
    notification: false,
    notificationEmail: '',
  });

  const handleChange = (newValues) => {
    setValues(newValues);
    console.log('Form values changed:', newValues);
  };

  const handleSubmit = (formValues) => {
    console.log('Form submitted with values:', formValues);
    alert('Configuration saved!');
  };

  // New schema structure with centralized fields
  const schema = {
    title: 'Workflow Configuration',
    // Centralized field definitions
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Workflow Name',
        placeholder: 'Enter workflow name',
        required: true,
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        placeholder: 'Enter description',
      },
      {
        id: 'type',
        type: 'select',
        label: 'Workflow Type',
        options: [
          { value: 'sequential', label: 'Sequential' },
          { value: 'parallel', label: 'Parallel' },
          { value: 'conditional', label: 'Conditional' },
        ],
      },
      {
        id: 'maxRetries',
        type: 'number',
        label: 'Max Retries',
        min: 0,
        max: 10,
      },
      {
        id: 'timeout',
        type: 'number',
        label: 'Timeout (seconds)',
        min: 0,
      },
      {
        id: 'enableLogging',
        type: 'checkbox',
        checkboxLabel: 'Enable Logging',
      },
      {
        id: 'notification',
        type: 'checkbox',
        checkboxLabel: 'Enable Email Notifications',
      },
      {
        id: 'notificationEmail',
        type: 'text',
        label: 'Notification Email',
        placeholder: 'Enter email address',
        condition: {
          dependsOn: 'notification',
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
        fieldIds: ['name', 'description', 'type'],
      },
      {
        id: 'execution',
        title: 'Execution Settings',
        fieldIds: ['maxRetries', 'timeout', 'enableLogging'],
      },
      {
        id: 'notifications',
        title: 'Notifications',
        fieldIds: ['notification', 'notificationEmail'],
      },
    ],
    // Tab definitions
    tabs: [
      {
        id: 'basic',
        title: 'Basic Settings',
        sectionIds: ['general', 'execution'],
      },
      {
        id: 'advanced',
        title: 'Advanced Settings',
        sectionIds: ['notifications'],
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
          name: 'Workflow 1',
          type: 'sequential',
          maxRetries: 3,
          timeout: 60,
          enableLogging: true,
          description: 'This is a sample workflow',
          notification: false,
          notificationEmail: '',
        }),
      },
    ],
  };

  // Simple flat schema example - no tabs or sections
  const simpleSchema = {
    title: 'Simple Configuration',
    // Direct list of fields
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Name',
        placeholder: 'Enter name',
        required: true,
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        placeholder: 'Enter description',
        condition: {
          dependsOn: 'enableFeature',
          operator: 'equals',
          value: true,
        },
      },
      {
        id: 'enableFeature',
        type: 'checkbox',
        checkboxLabel: 'Enable Feature',
      },
      {
        id: 'brandColor',
        type: 'color',
        label: 'Brand Color',
        placeholder: 'Select a color',
      },
      {
        id: 'tags',
        type: 'array',
        label: 'Tags',
        itemPlaceholder: 'Enter a tag',
        addButtonText: 'Add Tag',
      },
      {
        id: 'contactInfo',
        type: 'static_key_value',
        label: 'Contact Information',
        keys: ['email', 'phone', 'address'],
        valuePlaceholder: 'Enter information',
      },
      {
        id: 'customFields',
        type: 'dynamic_key_value',
        label: 'Custom Fields',
        keyPlaceholder: 'Field Name',
        valuePlaceholder: 'Field Value',
        addButtonText: 'Add Custom Field',
      },
      {
        id: 'startDate',
        type: 'date',
        label: 'Start Date',
        min: '2000-01-01',
        max: '2030-12-31',
        showCalendarIcon: true,
      },
      {
        id: 'meetingTime',
        type: 'time',
        label: 'Meeting Time',
        showSeconds: true,
        showClockIcon: true,
      },
    
    ],
    buttons: [
      {
        id: 'save',
        label: 'Save',
        type: 'submit',
        variant: 'primary',
      },
    ],
  };

  return (
    <div className="p-4 space-y-8" style={{color:"black"}}>
      <ConfigFormV3 
        schema={schema} 
        initialValues={values} 
        onChange={handleChange} 
        onSubmit={handleSubmit} 
      />
      
      <h2 className="text-xl font-bold mt-8 mb-4">Simple Flat Configuration</h2>
      <ConfigFormV3 
        schema={simpleSchema} 
        initialValues={{name: '', description: '', enableFeature: false}} 
        onChange={console.log} 
        onSubmit={console.log} 
      />
    </div>
  );
}