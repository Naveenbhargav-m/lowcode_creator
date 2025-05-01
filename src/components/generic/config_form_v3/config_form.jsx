import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Code, Eye } from 'lucide-react';

// Centralized styles
const styles = {
  container: "w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md",
  header: "flex justify-between items-center p-4 border-b border-gray-200",
  title: "text-xl font-semibold text-gray-800",
  formContainer: "p-6",
  tabsContainer: "flex mb-6 border-b border-gray-200",
  tab: "px-4 py-2 mr-2 font-medium cursor-pointer transition-all",
  activeTab: "border-b-2 border-blue-500 text-blue-600",
  inactiveTab: "text-gray-600 hover:text-gray-800",
  accordion: "mb-4 border border-gray-200 rounded-md overflow-hidden",
  accordionHeader: "flex justify-between items-center p-4 bg-gray-50 cursor-pointer",
  accordionTitle: "font-medium text-gray-700",
  accordionContent: "p-4 border-t border-gray-200 bg-white",
  fieldGroup: "mb-4",
  fieldLabel: "block mb-2 text-sm font-medium text-gray-700",
  textInput: "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  numberInput: "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  selectInput: "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  checkboxContainer: "flex items-center",
  checkbox: "w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2",
  buttonGroup: "flex justify-end mt-6 space-x-2",
  button: "px-4 py-2 rounded-md font-medium transition-colors",
  primaryButton: "bg-blue-600 text-white hover:bg-blue-700",
  secondaryButton: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  jsonEditor: "w-full h-64 p-2 font-mono text-sm border border-gray-300 rounded-md",
  jsonEditorHeader: "flex justify-between items-center mb-2",
  modeSwitcher: "flex items-center text-sm text-blue-600 cursor-pointer",
  error: "mt-1 text-sm text-red-600",
};

// Field components
const TextField = ({ field, value, onChange }) => (
  <input
    type="text"
    id={field.id}
    value={value || ''}
    // @ts-ignore
    onChange={(e) => onChange(field.id, e.target.value)}
    placeholder={field.placeholder}
    className={styles.textInput}
    disabled={field.disabled}
  />
);

const NumberField = ({ field, value, onChange }) => (
  <input
    type="number"
    id={field.id}
    value={value || ''}
    // @ts-ignore
    onChange={(e) => onChange(field.id, e.target.value)}
    min={field.min}
    max={field.max}
    step={field.step || 1}
    placeholder={field.placeholder}
    className={styles.numberInput}
    disabled={field.disabled}
  />
);

const SelectField = ({ field, value, onChange }) => (
  <select
    id={field.id}
    value={value || ''}
    // @ts-ignore
    onChange={(e) => onChange(field.id, e.target.value)}
    className={styles.selectInput}
    disabled={field.disabled}
  >
    {field.placeholder && (
      <option value="" disabled>
        {field.placeholder}
      </option>
    )}
    {field.options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const CheckboxField = ({ field, value, onChange }) => (
  <div className={styles.checkboxContainer}>
    <input
      type="checkbox"
      id={field.id}
      checked={!!value}
      // @ts-ignore
      onChange={(e) => onChange(field.id, e.target.checked)}
      className={styles.checkbox}
      disabled={field.disabled}
    />
    <label htmlFor={field.id} className="text-sm text-gray-700">
      {field.checkboxLabel}
    </label>
  </div>
);

// Accordion component
const Accordion = ({ title, children, isOpen, toggle }) => (
  <div className={styles.accordion}>
    <div className={styles.accordionHeader} onClick={toggle}>
      <h3 className={styles.accordionTitle}>{title}</h3>
      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </div>
    {isOpen && <div className={styles.accordionContent}>{children}</div>}
  </div>
);

// Main form component
const ConfigFormV3 = ({ 
  schema, 
  initialValues = {}, 
  onChange, 
  onSubmit 
}) => {
  const [activeTab, setActiveTab] = useState(schema.tabs ? schema.tabs[0].id : null);
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
        if (tab.sections && tab.sections.length > 0) {
          initialOpenSections[tab.sections[0].id] = true;
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
    if (!isFieldVisible(field)) return null;

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

  // Render section fields
  const renderSectionFields = (fields) => {
    return fields.map(field => renderField(field));
  };

  // Render sections
  const renderSections = (sections) => {
    return sections.map(section => (
      <Accordion
        key={section.id}
        title={section.title}
        isOpen={!!openSections[section.id]}
        toggle={() => toggleSection(section.id)}
      >
        {renderSectionFields(section.fields)}
      </Accordion>
    ));
  };

  // Render a tab's content
  const renderTabContent = (tab) => {
    return (
      <div>
        {tab.sections ? renderSections(tab.sections) : renderSectionFields(tab.fields)}
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
        {isJsonMode ? (
          renderJsonEditor()
        ) : schema.tabs ? (
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
        ) : schema.sections ? (
          renderSections(schema.sections)
        ) : (
          renderSectionFields(schema.fields)
        )}

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

// Sample usage with demo data
export default function ConfigFormDemo() {
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

  const schema = {
    title: 'Workflow Configuration',
    tabs: [
      {
        id: 'basic',
        title: 'Basic Settings',
        sections: [
          {
            id: 'general',
            title: 'General Information',
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
            ],
          },
          {
            id: 'execution',
            title: 'Execution Settings',
            fields: [
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
            ],
          },
        ],
      },
      {
        id: 'advanced',
        title: 'Advanced Settings',
        sections: [
          {
            id: 'notifications',
            title: 'Notifications',
            fields: [
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
          },
        ],
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

  return (
    <div className="p-4">
      <ConfigFormV3 
        schema={schema} 
        initialValues={values} 
        onChange={handleChange} 
        onSubmit={handleSubmit} 
      />
    </div>
  );
}