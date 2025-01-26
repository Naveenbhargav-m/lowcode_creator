import { useState } from "preact/hooks";

// Field Component
const Field = ({ type, options, value, onChange, fieldStyle, ...props }) => {
  switch (type) {
    case 'textfield':
      return <input type="text" value={value} onChange={onChange} style={fieldStyle} {...props} />;
    case 'checkbox':
      return <input type="checkbox" checked={value} onChange={onChange} style={fieldStyle} {...props} />;
    case 'toggle':
      return (
        <label style={{ ...fieldStyle, display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" checked={value} onChange={onChange} {...props} />
          <span style={{ marginLeft: '5px' }}>Toggle</span>
        </label>
      );
    case 'buttonGroup':
      return (
        <div style={fieldStyle}>
          {options.map((option) => (
            <button
              key={option.value}
              style={{
                padding: '5px 10px',
                margin: '5px',
                backgroundColor: value === option.value ? '#ddd' : '#fff',
                border: '1px solid #ccc',
                cursor: 'pointer',
              }}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      );
    default:
      return null;
  }
};

// PanelField Component
const PanelField = ({ label, labelPosition, errorMessage, showError, children, panelStyle, labelStyle }) => {
  const getLabelContainerStyle = () => {
    const baseStyle = { display: 'flex', alignItems: 'center', margin: '5px 0' };
    switch (labelPosition) {
      case 'top':
        return { ...baseStyle, flexDirection: 'column', alignItems: 'flex-start' };
      case 'right':
        return { ...baseStyle, flexDirection: 'row-reverse', justifyContent: 'space-between' };
      case 'left':
        return { ...baseStyle, flexDirection: 'row', justifyContent: 'space-between' };
      case 'bottom':
        return { ...baseStyle, flexDirection: 'column-reverse', alignItems: 'flex-start' };
      case 'center':
        return { ...baseStyle, flexDirection: 'column', alignItems: 'center', textAlign: 'center' };
      default:
        return baseStyle;
    }
  };

  return (
    <div style={panelStyle}>
      <div style={getLabelContainerStyle()}>
        {label && <div style={{ ...labelStyle }}>{label}</div>}
        <div>{children}</div>
      </div>
      {showError && errorMessage && (
        <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>
      )}
    </div>
  );
};

// Example Page
const ExamplePage = ({ formConfig }) => {
  const [formState, setFormState] = useState(
    formConfig.reduce((acc, field) => {
      acc[field.name] = field.value || '';
      return acc;
    }, {})
  );

  const handleFieldChange = (name, value) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form>
      {formConfig.map((fieldConfig) => (
        <PanelField
          key={fieldConfig.name}
          label={fieldConfig.label}
          labelPosition={fieldConfig.labelPosition}
          errorMessage={fieldConfig.errorMessage}
          showError={fieldConfig.showError}
          panelStyle={fieldConfig.panelStyle}
          labelStyle={fieldConfig.labelStyle}
        >
          <Field
            type={fieldConfig.type}
            options={fieldConfig.options}
            value={formState[fieldConfig.name]}
            onChange={(e) =>
              handleFieldChange(
                fieldConfig.name,
                fieldConfig.type === 'checkbox' ? e.target.checked : e.target.value
              )
            }
            fieldStyle={fieldConfig.fieldStyle}
          />
        </PanelField>
      ))}
    </form>
  );
};

// Example Form Configuration
const formConfig = [
  {
    name: 'username',
    type: 'textfield',
    label: 'Username',
    labelPosition: 'top',
    value: '',
    showError: true,
    errorMessage: 'Username is required.',
    panelStyle: { margin: '10px 0', padding: '10px', border: '1px solid #ccc' },
    fieldStyle: { padding: '5px', width: '100%' },
    labelStyle: { fontWeight: 'bold' },
  },
  {
    name: 'subscribe',
    type: 'checkbox',
    label: 'Subscribe to newsletter',
    labelPosition: 'top',
    value: false,
    showError: true,
    errorMessage: '',
    panelStyle: { margin: '10px 0' },
    fieldStyle: { margin: '5px' },
    labelStyle: { fontStyle: 'italic' },
  },
  {
    name: 'theme',
    type: 'buttonGroup',
    label: 'Theme',
    labelPosition: 'top',
    options: [
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
    ],
    value: 'light',
    showError: false,
    errorMessage: '',
    panelStyle: { margin: '10px 0', padding: '10px', border: '1px solid #ccc' },
    fieldStyle: { display: 'flex', justifyContent: 'space-between' },
    labelStyle: { textAlign: 'center', fontWeight: 'bold' },
  },
];

export function FormTestpage() {
  return <ExamplePage formConfig={formConfig} />;
}
