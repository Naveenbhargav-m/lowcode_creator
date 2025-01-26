import React, { useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";


// Utility function to evaluate simple conditions
const evaluateCondition = (condition, formValues) => {
  const { field, operator, value } = condition;
  const fieldValue = formValues[field];
  switch (operator) {
    case "==":
      return fieldValue == value;
    case "===":
      return fieldValue === value;
    case "!=":
      return fieldValue != value;
    case "!==":
      return fieldValue !== value;
    case ">":
      return fieldValue > value;
    case ">=":
      return fieldValue >= value;
    case "<":
      return fieldValue < value;
    case "<=":
      return fieldValue <= value;
    default:
      return false;
  }
};

// Utility function to calculate field values
const calculateValue = (formula, formValues) => {
  try {
    const func = new Function("values", `return ${formula};`);
    return func(formValues);
  } catch (error) {
    console.error("Calculation error:", error);
    return null;
  }
};

// Default theme for the form
const defaultTheme = {
  form: "custom-form",
  field: "custom-field",
  text_area: "custom-input",
  label: "custom-label",
  input: "custom-input",
  select: "custom-select",
  slider: "custom-slider",
  checkbox: "custom-checkbox",
  submit: "custom-submit",
  "preferredContact-input": "custom-button-group",
  "preferredContact-selected": "custom-button-group-selected",
};

const DynamicForm = ({ config, styles = {}, values = {}, onSubmit , isEdit}) => {
  const [formValues, setFormValues] = useState(values);

  // Merge user styles with the default theme
  const mergedStyles = { ...defaultTheme, ...styles };

  useEffect(() => {
    const initialValues = { ...formValues };
    applyConditionsAndCalculations(initialValues);
    setFormValues(initialValues);
  }, []);

  const applyConditionsAndCalculations = (updatedValues) => {
    // Apply conditions
    if (config.conditions) {
      config.conditions.forEach(({ if: condition, then }) => {
        if (evaluateCondition(condition, updatedValues)) {
          updatedValues[then.field] = then.value;
        }
      });
    }

    // Apply calculations
    Object.entries(config.fields).forEach(([fieldName, fieldConfig]) => {
      if (fieldConfig.calculations?.formula) {
        updatedValues[fieldName] = calculateValue(
          fieldConfig.calculations.formula,
          updatedValues,
        );
      }
    });
  };

  const handleChange = (field, value) => {
    setFormValues((prevValues) => {
      const updatedValues = {
        ...prevValues,
        [field]: value,
      };
      applyConditionsAndCalculations(updatedValues);
      return updatedValues;
    });
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formValues);
    }
  };

  const renderField = (fieldConfig, fieldName , isEdit) => {
    const { type, label, labelPosition, labelSpacing, labelStyle, options } =
      fieldConfig;

    const labelElement = (
      <label
        style={{
          marginBottom: labelPosition === "top" ? labelSpacing : 0,
          ...labelStyle,
        }}
      >
        {label}
      </label>
    );
    let classname1 = mergedStyles[fieldName]
      ? mergedStyles[fieldName] + " " + mergedStyles.field
      : mergedStyles.field;
    let computed_style = {
      display:
        labelPosition === "left" || labelPosition === "right"
          ? "flex"
          : "block",
      alignItems:
        labelPosition === "left" || labelPosition === "right"
          ? "center"
          : "unset",
    };
    switch (type) {
      case "text":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" ? labelElement : null}
            {labelPosition === "top" ? labelElement : null}
            <input
              type="text"
              value={formValues[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className={
                mergedStyles[fieldName + "-input"]
                  ? mergedStyles[fieldName + "-input"]
                  : mergedStyles.input
              }
            />
            {labelPosition === "right" ? labelElement : null}
            {labelPosition === "bottom" ? labelElement : null}
          </div>
        );
      case "number":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" ? labelElement : null}
            {labelPosition === "top" ? labelElement : null}
            <input
              type="number"
              value={formValues[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className={mergedStyles.input}
            />
            {labelPosition === "right" ? labelElement : null}
            {labelPosition === "bottom" ? labelElement : null}
          </div>
        );
      case "dropdown":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" ? labelElement : null}

            {labelPosition === "top" ? labelElement : null}
            <select
              value={formValues[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className={mergedStyles.select}
            >
              <option value="" disabled>
                Select an option
              </option>
              {options &&
                options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
            </select>
            {labelPosition === "right" ? labelElement : null}
            {labelPosition === "bottom" ? labelElement : null}
          </div>
        );
      case "checkbox-single":
      case "radio-single":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" || labelPosition === "top"
              ? labelElement
              : null}
            <input
              type={type === "checkbox-single" ? "checkbox" : "radio"}
              checked={formValues[fieldName] || false}
              onChange={(e) => handleChange(fieldName, e.target.checked)}
              className={mergedStyles.checkbox}
            />
            {labelPosition === "right" || labelPosition === "bottom"
              ? labelElement
              : null}
          </div>
        );

      case "button-group":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" ? labelElement : null}
            {labelPosition === "top" ? labelElement : null}
            <div>
              {options.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleChange(fieldName, option)}
                  className={
                    formValues[fieldName] === option
                      ? mergedStyles[fieldName + "-selected"]
                      : mergedStyles[fieldName + "-input"]
                        ? mergedStyles[fieldName + "-input"]
                        : mergedStyles[fieldName + "-input"]
                  }
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case "radio-group":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" ? labelElement : null}
            {labelPosition === "top" ? labelElement : null}
            {options.map((option, index) => (
              <div>
                <label key={index} className={mergedStyles.radioLabel}>
                  <input
                    type="radio"
                    value={option}
                    checked={formValues[fieldName] === option}
                    onChange={(e) => handleChange(fieldName, e.target.value)}
                    className={mergedStyles.radioInput}
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case "multi-checkbox":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" ? labelElement : null}
            {labelPosition === "top" ? labelElement : null}
            {options.map((option, index) => (
              <label key={index} className={mergedStyles.checkboxLabel}>
                <input
                  type="checkbox"
                  value={option}
                  checked={(formValues[fieldName] || []).includes(option)}
                  onChange={(e) => {
                    const newValue = [...(formValues[fieldName] || [])];
                    if (e.target.checked) {
                      newValue.push(option);
                    } else {
                      const index = newValue.indexOf(option);
                      newValue.splice(index, 1);
                    }
                    handleChange(fieldName, newValue);
                  }}
                  className={mergedStyles.checkboxInput}
                />
                {option}
              </label>
            ))}
          </div>
        );

      case "switch":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" ? labelElement : null}
            {labelPosition === "top" ? labelElement : null}
            <label className={mergedStyles.switchLabel}>
              <input
                type="checkbox"
                checked={formValues[fieldName] || false}
                onChange={(e) => handleChange(fieldName, e.target.checked)}
                className={mergedStyles.switchInput}
              />
              <span className={mergedStyles.switchSlider}></span>
            </label>
          </div>
        );

      case "date-time":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" ? labelElement : null}
            {labelPosition === "top" ? labelElement : null}
            <input
              type="datetime-local"
              value={formValues[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className={mergedStyles.input}
            />
          </div>
        );

      case "date":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" ? labelElement : null}
            {labelPosition === "top" ? labelElement : null}
            <input
              type="date"
              value={formValues[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className={mergedStyles.input}
            />
          </div>
        );

      case "month":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" ? labelElement : null}
            {labelPosition === "top" ? labelElement : null}
            <input
              type="month"
              value={formValues[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className={mergedStyles.input}
            />
          </div>
        );

      case "year":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" ? labelElement : null}
            {labelPosition === "top" ? labelElement : null}
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={formValues[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className={mergedStyles.input}
            />
          </div>
        );

      case "week":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" ? labelElement : null}
            {labelPosition === "top" ? labelElement : null}
            <input
              type="week"
              value={formValues[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className={mergedStyles.input}
            />
          </div>
        );

      case "url":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" ? labelElement : null}
            {labelPosition === "top" ? labelElement : null}
            <input
              type="url"
              value={formValues[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className={mergedStyles.input}
            />
          </div>
        );

      case "phone":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" ? labelElement : null}
            {labelPosition === "top" ? labelElement : null}
            <input
              type="tel"
              value={formValues[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className={mergedStyles.input}
            />
          </div>
        );

      case "location":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" ? labelElement : null}
            {labelPosition === "top" ? labelElement : null}
            <input
              type="text"
              placeholder="Longitude"
              value={formValues[`${fieldName}_lng`] || ""}
              onChange={(e) => handleChange(`${fieldName}_lng`, e.target.value)}
              className={mergedStyles.input}
            />
            <input
              type="text"
              placeholder="Latitude"
              value={formValues[`${fieldName}_lat`] || ""}
              onChange={(e) => handleChange(`${fieldName}_lat`, e.target.value)}
              className={mergedStyles.input}
            />
          </div>
        );

      case "slider":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" ? labelElement : null}
            {labelPosition === "top" ? labelElement : null}

            <input
              type="range"
              min={config.min || 0}
              max={config.max || 100}
              step={config.step || 1}
              value={formValues[fieldName] || config.min || 0}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className={mergedStyles.slider}
            />
          </div>
        );

      case "email":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" ? labelElement : null}
            {labelPosition === "top" ? labelElement : null}
            <input
              type="email"
              value={formValues[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className={mergedStyles.input}
            />
          </div>
        );

      case "password":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" ? labelElement : null}
            {labelPosition === "top" ? labelElement : null}
            <input
              type="password"
              value={formValues[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className={mergedStyles.input}
            />
          </div>
        );

      case "time":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" ? labelElement : null}
            {labelPosition === "top" ? labelElement : null}
            <input
              type="time"
              value={formValues[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className={mergedStyles.input}
            />
          </div>
        );

      case "long-text":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" ? labelElement : null}
            {labelPosition === "top" ? labelElement : null}
            <textarea
              value={formValues[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className={mergedStyles.text_area}
            />
          </div>
        );

      case "multiple-text":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" ? labelElement : null}
            {labelPosition === "top" ? labelElement : null}
            {(formValues[fieldName] || [""]).map((text, index) => (
              <input
                key={index}
                type="text"
                value={text}
                onChange={(e) => {
                  const newValues = [...(formValues[fieldName] || [""])];
                  newValues[index] = e.target.value;
                  handleChange(fieldName, newValues);
                }}
                className={mergedStyles.input}
              />
            ))}
            <button
              type="button"
              onClick={() =>
                handleChange(fieldName, [
                  ...(formValues[fieldName] || [""]),
                  "",
                ])
              }
            >
              Add
            </button>
          </div>
        );
      case "tags":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            {labelPosition === "left" ? labelElement : null}
            {labelPosition === "top" ? labelElement : null}
            {options.map((tag, index) => {
              return (
                <span key={index} className="tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => {
                      const newTags = options.filter((_, i) => i !== index);
                      console.log("called remove");
                    }}
                    className="remove-tag"
                  ></button>
                </span>
              );
            })}
            <input
              key={fieldName}
              type="text"
              onChange={(e) => {
                const newValues = [...(formValues[fieldName] || [""])];
                newValues.push(e.target.value);
                handleChange(fieldName, newValues);
              }}
              className={mergedStyles.input}
            />
            <button
              type="button"
              onClick={() => {
                let inputvalue = formValues[fieldName].at(-1);
                console.log(inputvalue);
                console.log(formValues[fieldName]);
                if (inputvalue.trim() !== "") {
                  options.push(inputvalue);
                  formValues[fieldName] = [];
                  handleChange(fieldName, options);
                  console.log(formValues[fieldName]);
                }
              }}
            >
              Add
            </button>
            <div className="tags-list"></div>
          </div>
        );
      case "file":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            <input
              type="file"
              onChange={(e) => handleChange(fieldName, e.target.files[0])}
              className={mergedStyles.input}
            />
          </div>
        );

      case "image":
        return (
          <div key={fieldName} className={classname1} style={computed_style}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleChange(fieldName, e.target.files[0])}
              className={mergedStyles.input}
            />
          </div>
        );
      default:
        return null;
    }
  };
  const ResponsiveGridLayout = WidthProvider(Responsive);
  let layout = [
    { i: "firstName", x: 0, y: 0, w: 6, h: 3 },
    { i: "age", x: 6, y: 0, w: 6, h: 3 },
  ];
  return (
    <div className={mergedStyles.form}>
      {
        isEdit ?   <ResponsiveGridLayout
        className="layout bg-background"
        layouts={{ lg: layout }}  // Ensure 'lg' (or breakpoint) is the key
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30}
        autoSize={true}
        margin={[8, 8]}
        onLayoutChange={(layout) => console.log(layout)}
        compactType={null}
      >
    {Object.entries(config.fields).map(([fieldName, fieldConfig]) => {
      if (fieldConfig["layout"] != undefined) {
        return <div key={fieldName} data-grid={fieldConfig["layout"]} className="container">
          {renderField(fieldConfig, fieldName, isEdit)}
        </div>;
      } else {
        return renderField(fieldConfig, fieldName);
      }
    }
    )}
    </ResponsiveGridLayout> : Object.entries(config.fields).map(([fieldName, fieldConfig]) => {
      if (fieldConfig["layout"] != undefined) {
        return <div key={fieldName} data-grid={fieldConfig["layout"]} className="container">
          {renderField(fieldConfig, fieldName)}
        </div>;
      } else {
        return renderField(fieldConfig, fieldName);
      }
    }
    )}
    
      <button
        type="button"
        onClick={handleSubmit}
        className={mergedStyles.submit}
      >
        Submit
      </button>
    </div>
  );
};

export default DynamicForm;
