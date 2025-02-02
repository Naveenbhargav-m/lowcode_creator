// @ts-ignore
import { h } from "preact";
import { useSignal } from "@preact/signals";
import "../styles/formFieldConfigurator.css";

// Updated Configuration Schema
const formFieldConfigSchema = {
    panel: {
      height: { label: "Height", type: "text" },
      width: { label: "Width", type: "text" },
      backgroundColor: { label: "Background Color", type: "color" },
      borderRadius: { label: "Border Radius", type: "text" },
      flexDirection: {
        label: "Flex Direction",
        options: [
          { label: "Row", value: "row" },
          { label: "Column", value: "column" },
          { label: "Row Reverse", value: "row-reverse" },
          { label: "Column Reverse", value: "column-reverse" },
        ],
      },
    },
    field: {
      height: { label: "Height", type: "text" },
      width: { label: "Width", type: "text" },
      backgroundColor: { label: "Background Color", type: "color" },
      borderRadius: { label: "Border Radius", type: "text" },
      padding: { label: "Padding", type: "text" },
      placeholder: {label: "placeholder", type:"text"},
    },
    labelStyle: {
      color: { label: "Color", type: "color" },
      value: { label: "Value", type: "text" },
      position: {
        label: "Position",
        options: [
          { label: "Top", value: "top" },
          { label: "Left", value: "left" },
          { label: "Right", value: "right" },
          { label: "Bottom", value: "bottom" },
        ],
      },
      backgroundColor: { label: "Background Color", type: "color" },
    },
    generalConfig: {
      showPanel: { label: "Show Panel", type: "checkbox" },
      validations: { label: "Validations", type: "text" },
      toggleOption: { label: "Enable Toggle", type: "checkbox" },
      buttonGroup: {
        label: "Button Group",
        options: [
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
          { label: "Option 3", value: "option3" },
        ],
      },
    },
  };
  
  // Collapsible Section Component
  const CollapsibleSection = ({ title, children }) => {
    const isOpen = useSignal(false);
  
    return (
      <div className="collapsible-section">
        <button
          type="button"
          className="section-toggle"
          onClick={() => (isOpen.value = !isOpen.value)}
        >
          {title} {isOpen.value ? "-" : "+"}
        </button>
        {isOpen.value && <div className="section-content">{children}</div>}
      </div>
    );
  };
  
  // FormFieldConfigurator Component
  const FormFieldConfigurator = ({ onChange, onSubmit, existingConfig }) => {
    let config = { ...existingConfig };
  
    const updateConfig = (section, key, value) => {
      config[section] = { ...config[section], [key]: value };
      if (onChange) onChange(config);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (onSubmit) onSubmit(config);
    };
  
    const renderField = (section, key, schema) => {
      if (schema.options) {
        // Button Group Rendering
        if (key === "buttonGroup") {
          return (
            <div key={key} className="button-group">
              {schema.label}:
              {schema.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`button ${config[section]?.[key] === option.value ? "active" : ""}`}
                  onClick={() => updateConfig(section, key, option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          );
        }
  
        // Dropdown Rendering
        return (
          <label key={key}>
            {schema.label}:
            <select
              value={config[section]?.[key] || ""}
              // @ts-ignore
              onChange={(e) => updateConfig(section, key, e.target.value)}
            >
              {schema.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        );
      } else {
        // Checkbox Rendering
        if (schema.type === "checkbox") {
          return (
            <label key={key}>
            {schema.label}
              <input
                type="checkbox"
                checked={config[section]?.[key] || false}
                // @ts-ignore
                onChange={(e) => updateConfig(section, key, e.target.checked)}
              />
            </label>
          );
        }
  
        // Text Input Rendering
        return (
          <label key={key}>
            {schema.label}:
            <input
              type={schema.type || "text"}
              value={config[section]?.[key] || ""}
              className={key === "smallTextBox" ? "small-text-box" : "mytext"}

              onChange={(e) =>
                updateConfig(
                  section,
                  key,
                  // @ts-ignore
                  schema.type === "number" ? Number(e.target.value) : e.target.value
                )
              }
            />
          </label>
        );
      }
    };
  
    return (
      <div className="form-field-configurator">
        <form onSubmit={handleSubmit}>
          <h2>Form Field Configurator</h2>
  
          {Object.entries(formFieldConfigSchema).map(([section, fields]) => (
            <CollapsibleSection
              key={section}
              title={section.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            >
              {Object.entries(fields).map(([key, schema]) =>
                renderField(section, key, schema)
              )}
            </CollapsibleSection>
          ))}
  
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  };
  
  export default FormFieldConfigurator;
  