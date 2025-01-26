import { h } from 'preact';
import { signal, useSignal } from '@preact/signals';
import './FlexConfigurator.css';

// Configuration Object
const flexConfigSchema = {
  "flexContainer": {
    "flexDirection": {
      label: "Flex Direction",
      options: [
        { label: "Row", value: "row" },
        { label: "Column", value: "column" },
        { label: "Row Reverse", value: "row-reverse" },
        { label: "Column Reverse", value: "column-reverse" },
      ],
    },
    "justifyContent": {
      label: "Justify Content",
      options: [
        { label: "Flex Start", value: "flex-start" },
        { label: "Center", value: "center" },
        { label: "Flex End", value: "flex-end" },
        { label: "Space Around", value: "space-around" },
        { label: "Space Between", value: "space-between" },
        { label: "Space Evenly", value: "space-evenly" },
      ],
    },
    "alignItems": {
      label: "Align Items",
      options: [
        { label: "Stretch", value: "stretch" },
        { label: "Flex Start", value: "flex-start" },
        { label: "Center", value: "center" },
        { label: "Flex End", value: "flex-end" },
        { label: "Baseline", value: "baseline" },
      ],
    },
    "alignContent": {
      label: "Align Content",
      options: [
        { label: "Stretch", value: "stretch" },
        { label: "Flex Start", value: "flex-start" },
        { label: "Center", value: "center" },
        { label: "Flex End", value: "flex-end" },
        { label: "Space Between", value: "space-between" },
        { label: "Space Around", value: "space-around" },
      ],
    },
    "flexWrap": {
      label: "Flex Wrap",
      options: [
        { label: "No Wrap", value: "nowrap" },
        { label: "Wrap", value: "wrap" },
        { label: "Wrap Reverse", value: "wrap-reverse" },
      ],
    },
  },
  "flexItem": {
    "flexGrow": { label: "Flex Grow", type: "number" },
    "flexShrink": { label: "Flex Shrink", type: "number" },
    "flexBasis": { label: "Flex Basis", type: "text" },
    "order": { label: "Order", type: "number" },
    "alignSelf": {
      label: "Align Self",
      options: [
        { label: "Auto", value: "auto" },
        { label: "Flex Start", value: "flex-start" },
        { label: "Center", value: "center" },
        { label: "Flex End", value: "flex-end" },
        { label: "Stretch", value: "stretch" },
        { label: "Baseline", value: "baseline" },
      ],
    },
  },
  "style": {
    "width": { label: "Width", type: "text" },
    "height": { label: "Height", type: "text" },
    "gap": { label: "Gap", type: "text" },
    "color": { label: "Color", type: "color" },
    "backgroundColor": { label: "Background Color", type: "color" },
    "padding": { label: "Padding", type: "text" },
    "margin": { label: "Margin", type: "text" },
    "border": { label: "Border", type: "text" },
    "borderRadius": { label: "Border Radius", type: "text" },
    "boxShadow": { label: "Box Shadow", type: "text" },
  },
};

// Flex Configurator Component
const FlexConfigurator = ({ onChange, onSubmit, existingConfig }) => {
  let config = { ...existingConfig };

  const updateConfig = (key, value) => {
    config = { ...config, [key]: value };
    if (onChange) onChange(config);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(config);
  };

  const renderField = (key, schema) => {
    if (schema.options) {
      return (
        <label key={key}>
          {schema.label}:
          <select
            value={config[key] || ""}
            onChange={(e) => updateConfig(key, e.target["value"])}
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
      return (
        <label key={key}>
          {schema.label}:
          <input
            type={schema.type || "text"}
            value={config[key] || ""}
            onChange={(e) => updateConfig(key, schema.type === "number" ? Number(e.target["value"]) : e.target["value"])}
          />
        </label>
      );
    }
  };

  return (
    <div className="flex-configurator">
      <form onSubmit={handleSubmit}>
        <h2>Flex Configurator</h2>

        {Object.entries(flexConfigSchema).map(([section, fields]) => (
          <fieldset key={section}>
            <legend>{section.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</legend>
            {Object.entries(fields).map(([key, schema]) => renderField(key, schema))}
          </fieldset>
        ))}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FlexConfigurator;
