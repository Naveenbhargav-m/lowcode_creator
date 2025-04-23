// === TextField Component ===

let commonStyle = {
    "color":"black",
    colorScheme:"auto", // Changes the overall color scheme
     accentColor: "#3b82f6", // Changes the accent color for the icon
};
function TextField({ config = {}, onAction }) {
    const defaultStyle = {
      padding: "0.5rem",
      borderRadius: "0.25rem",
      border: "1px solid #cbd5e1",
      width: "100%",
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      transition: "border-color 0.15s ease-in-out"
    };
  
    return (
      <input
        type="text"
        name={config.name || "text"}
        placeholder={config.placeholder || ""}
        aria-label={config.label}
        value={config.value || ""}
        style={{ ...defaultStyle, ...config.fieldStyle }}
        onBlur={(e) => onAction(e, "onBlur", config.value)}
        onFocus={(e) => onAction(e, "onFocus", config.value)}
        onClick={(e) => onAction(e, "onClick", config.value)}
        onKeyDown={(e) => onAction(e, "onKeyDown", config.value)}
        onChange={(e) => onAction(e, "onChange", e.target.value)}
        onMouseEnter={(e) => onAction(e, "onMouseEnter", config.value)}
      />
    );
  }
  
  // === Checkbox Component ===
  function Checkbox({ config = {}, onAction }) {
    const defaultStyle = {
      cursor: "pointer",
      width: "1rem",
      height: "1rem"
    };
  
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input
          type="checkbox"
          name={config.name || "checkbox"}
          checked={config.checked || false}
          aria-label={config.label}
          style={{ ...defaultStyle, ...config.fieldStyle }}
          onBlur={(e) => onAction(e, "onBlur", e.target.checked)}
          onFocus={(e) => onAction(e, "onFocus", e.target.checked)}
          onClick={(e) => onAction(e, "onClick", e.target.checked)}
          onChange={(e) => onAction(e, "onChange", e.target.checked)}
          onMouseEnter={(e) => onAction(e, "onMouseEnter", e.target.checked)}
        />
        {config.label && <label>{config.label}</label>}
      </div>
    );
  }
  
  // === Toggle Component ===
  function Toggle({ config = {}, onAction }) {
    const checked = config.checked || false;
    
    const trackStyle = {
      position: "relative",
      width: "3rem",
      height: "1.5rem",
      backgroundColor: checked ? "#3b82f6" : "#cbd5e1",
      borderRadius: "1.5rem",
      transition: "background-color 0.2s",
      cursor: "pointer",
      ...config.trackStyle
    };
    
    const thumbStyle = {
      position: "absolute",
      top: "0.25rem",
      left: checked ? "1.75rem" : "0.25rem",
      width: "1rem",
      height: "1rem",
      backgroundColor: "white",
      borderRadius: "50%",
      transition: "left 0.2s",
      ...config.thumbStyle
    };
  
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {config.labelPosition === "left" && config.label && <label>{config.label}</label>}
        <div
          style={trackStyle}
          onClick={(e) => onAction(e, "onChange", !checked)}
          onMouseEnter={(e) => onAction(e, "onMouseEnter", checked)}
        >
          <div style={thumbStyle}></div>
        </div>
        {(!config.labelPosition || config.labelPosition === "right") && config.label && 
          <label>{config.label}</label>}
      </div>
    );
  }
  
  // === RangeSlider Component ===
  function RangeSlider({ config = {}, onAction }) {
    const defaultStyle = {
      width: "100%",
      cursor: "pointer"
    };
  
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {config.label && <label>{config.label}</label>}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {config.showMinValue && <span>{config.min || 0}</span>}
          <input
            type="range"
            name={config.name || "range"}
            min={config.min || 0}
            max={config.max || 100}
            step={config.step || 1}
            value={config.value || 0}
            style={{ ...defaultStyle, ...config.fieldStyle }}
            onBlur={(e) => onAction(e, "onBlur", e.target.value)}
            onFocus={(e) => onAction(e, "onFocus", e.target.value)}
            onClick={(e) => onAction(e, "onClick", e.target.value)}
            onChange={(e) => onAction(e, "onChange", e.target.value)}
            onMouseEnter={(e) => onAction(e, "onMouseEnter", e.target.value)}
          />
          {config.showMaxValue && <span>{config.max || 100}</span>}
        </div>
        {config.showValue && (
          <div style={{ textAlign: "center" }}>
            {config.value || 0}
          </div>
        )}
      </div>
    );
  }
  
  // === ButtonGroup Component ===
  function ButtonGroup({ config = {}, onAction }) {
    const options = config.options || [];
    const selectedValue = config.value;
    
    const groupStyle = {
      display: "flex",
      overflow: "hidden",
      borderRadius: "0.25rem",
      border: "1px solid #cbd5e1",
      ...config.groupStyle
    };
    
    const buttonDefaultStyle = {
      flex: 1,
      padding: "0.5rem 1rem",
      border: "none",
      backgroundColor: "white", 
      cursor: "pointer",
      borderRight: "1px solid #cbd5e1",
      fontSize: "0.875rem",
      transition: "background-color 0.15s ease-in-out"
    };
    
    const selectedButtonStyle = {
      ...buttonDefaultStyle,
      backgroundColor: "#3b82f6",
      color: "white"
    };
  
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {config.label && <label>{config.label}</label>}
        <div style={groupStyle}>
          {options.map((option, index) => (
            <button
              key={index}
              style={{
                ...buttonDefaultStyle,
                ...(option.value === selectedValue ? selectedButtonStyle : {}),
                ...(index === options.length - 1 ? { borderRight: "none" } : {}),
                ...config.fieldStyle
              }}
              onClick={(e) => onAction(e, "onChange", option.value)}
              onBlur={(e) => onAction(e, "onBlur", option.value)} 
              onFocus={(e) => onAction(e, "onFocus", option.value)}
              onMouseEnter={(e) => onAction(e, "onMouseEnter", option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  // === RadioGroup Component ===
  function RadioGroup({ config = {}, onAction }) {
    const options = config.options || [];
    const selectedValue = config.value;
    
    const radioStyle = {
      cursor: "pointer",
      width: "1rem",
      height: "1rem"
    };
  
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {config.label && <label>{config.label}</label>}
        <div style={{ display: "flex", flexDirection: config.layout || "column", gap: "0.5rem" }}>
          {options.map((option, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="radio"
                name={config.name || "radio-group"}
                value={option.value}
                checked={option.value === selectedValue}
                style={{ ...radioStyle, ...config.fieldStyle }}
                onChange={(e) => onAction(e, "onChange", option.value)}
                onBlur={(e) => onAction(e, "onBlur", option.value)}
                onFocus={(e) => onAction(e, "onFocus", option.value)}
                onClick={(e) => onAction(e, "onClick", option.value)}
                onMouseEnter={(e) => onAction(e, "onMouseEnter", option.value)}
              />
              <label>{option.label}</label>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // === Select Component ===
  function Select({ config = {}, onAction }) {
    const options = config.options || [];
    
    const defaultStyle = {
      padding: "0.5rem",
      borderRadius: "0.25rem",
      border: "1px solid #cbd5e1",
      width: "100%",
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      backgroundColor: "white",
      cursor: "pointer"
    };
  
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {config.label && <label>{config.label}</label>}
        <select
          name={config.name || "select"}
          value={config.value || ""}
          aria-label={config.label}
          style={{ ...defaultStyle, ...config.fieldStyle }}
          onBlur={(e) => onAction(e, "onBlur", e.target.value)}
          onFocus={(e) => onAction(e, "onFocus", e.target.value)}
          onClick={(e) => onAction(e, "onClick", e.target.value)}
          onChange={(e) => onAction(e, "onChange", e.target.value)}
          onMouseEnter={(e) => onAction(e, "onMouseEnter", e.target.value)}
        >
          {config.placeholder && (
            <option value="" disabled>
              {config.placeholder}
            </option>
          )}
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
  
  // === MultiSelect Component ===
  function MultiSelect({ config = {}, onAction }) {
    const options = config.options || [];
    const selectedValues = config.value || [];
    
    const defaultStyle = {
      padding: "0.5rem",
      borderRadius: "0.25rem",
      border: "1px solid #cbd5e1",
      width: "100%",
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      backgroundColor: "white",
      cursor: "pointer"
    };
  
    const handleChange = (e) => {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      onAction(e, "onChange", selectedOptions);
    };
  
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {config.label && <label>{config.label}</label>}
        <select
          name={config.name || "multi-select"}
          multiple
          value={selectedValues}
          aria-label={config.label}
          style={{ ...defaultStyle, ...config.fieldStyle, height: config.height || "120px" }}
          onBlur={(e) => onAction(e, "onBlur", selectedValues)}
          onFocus={(e) => onAction(e, "onFocus", selectedValues)}
          onClick={(e) => onAction(e, "onClick", selectedValues)}
          onChange={handleChange}
          onMouseEnter={(e) => onAction(e, "onMouseEnter", selectedValues)}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
  
  // === ColorField Component ===
  function ColorField({ config = {}, onAction }) {
    const defaultStyle = {
      width: "100%",
      height: "2rem",
      padding: "0",
      border: "1px solid #cbd5e1",
      borderRadius: "0.25rem",
      cursor: "pointer"
    };
  
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {config.label && <label>{config.label}</label>}
        <input
          type="color"
          name={config.name || "color"}
          value={config.value || "#000000"}
          aria-label={config.label}
          style={{ ...defaultStyle, ...config.fieldStyle }}
          onBlur={(e) => onAction(e, "onBlur", e.target.value)}
          onFocus={(e) => onAction(e, "onFocus", e.target.value)}
          onClick={(e) => onAction(e, "onClick", e.target.value)}
          onChange={(e) => onAction(e, "onChange", e.target.value)}
          onMouseEnter={(e) => onAction(e, "onMouseEnter", e.target.value)}
        />
      </div>
    );
  }
  
  // === TextArea Component ===
  function TextArea({ config = {}, onAction }) {
    const defaultStyle = {
      padding: "0.5rem",
      borderRadius: "0.25rem",
      border: "1px solid #cbd5e1",
      width: "100%",
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      resize: config.resize || "vertical",
      minHeight: "5rem"
    };
  
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {config.label && <label>{config.label}</label>}
        <textarea
          name={config.name || "textarea"}
          placeholder={config.placeholder || ""}
          aria-label={config.label}
          value={config.value || ""}
          style={{ ...defaultStyle, ...config.fieldStyle }}
          rows={config.rows || 4}
          onBlur={(e) => onAction(e, "onBlur", e.target.value)}
          onFocus={(e) => onAction(e, "onFocus", e.target.value)}
          onClick={(e) => onAction(e, "onClick", e.target.value)}
          onChange={(e) => onAction(e, "onChange", e.target.value)}
          onKeyDown={(e) => onAction(e, "onKeyDown", e.target.value)}
          onMouseEnter={(e) => onAction(e, "onMouseEnter", e.target.value)}
        />
      </div>
    );
  }
  
  // === FileUpload Component ===
  function FileUpload({ config = {}, onAction }) {
    const defaultStyle = {
      display: "none" // Hidden actual input
    };
    
    const buttonStyle = {
      display: "inline-flex",
      alignItems: "center",
      padding: "0.5rem 1rem",
      backgroundColor: "#3b82f6",
      color: "white",
      borderRadius: "0.25rem",
      border: "none",
      cursor: "pointer",
      fontSize: "0.875rem",
      transition: "background-color 0.15s ease-in-out"
    };
    
    const fileListStyle = {
      marginTop: "0.5rem",
      fontSize: "0.875rem"
    };
  
    const fileInputId = config.id || "file-upload";
    const multiple = config.multiple || false;
    const accept = config.accept || "";
    const selectedFiles = config.value || [];
  
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {config.label && <label>{config.label}</label>}
        <div>
          <input
            type="file"
            id={fileInputId}
            name={config.name || "file"}
            accept={accept}
            multiple={multiple}
            style={defaultStyle}
            onChange={(e) => {
              const files = Array.from(e.target.files);
              onAction(e, "onChange", files);
            }}
            onBlur={(e) => onAction(e, "onBlur", selectedFiles)}
            onFocus={(e) => onAction(e, "onFocus", selectedFiles)}
          />
          <label 
            htmlFor={fileInputId} 
            style={{ ...buttonStyle, ...config.buttonStyle }}
            onMouseEnter={(e) => onAction(e, "onMouseEnter", selectedFiles)}
            onClick={(e) => onAction(e, "onClick", selectedFiles)}
          >
            {config.buttonText || "Choose File"}
          </label>
          
          {selectedFiles && selectedFiles.length > 0 && (
            <div style={fileListStyle}>
              <p>{multiple ? "Selected files:" : "Selected file:"}</p>
              <ul>
                {selectedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // === Rating Component ===
  function Rating({ config = {}, onAction }) {
    const value = config.value || 0;
    const totalStars = config.totalStars || 5;
    
    const starStyle = {
      fontSize: "1.5rem",
      cursor: "pointer",
      color: "#cbd5e1"
    };
    
    const filledStarStyle = {
      ...starStyle,
      color: "#f59e0b"
    };
  
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {config.label && <label>{config.label}</label>}
        <div style={{ display: "flex", gap: "0.25rem" }}>
          {[...Array(totalStars)].map((_, index) => {
            const starValue = index + 1;
            return (
              <span
                key={index}
                style={starValue <= value ? { ...filledStarStyle, ...config.fieldStyle } : { ...starStyle, ...config.fieldStyle }}
                onClick={(e) => onAction(e, "onChange", starValue)}
                onMouseEnter={(e) => onAction(e, "onMouseEnter", starValue)}
                onFocus={(e) => onAction(e, "onFocus", starValue)}
                onBlur={(e) => onAction(e, "onBlur", value)}
              >
                ★
              </span>
            );
          })}
        </div>
      </div>
    );
  }
  
  // === DatePicker Component ===
  function DatePicker({ config = {}, onAction }) {
    const defaultStyle = {
      padding: "0.5rem",
      borderRadius: "0.25rem",
      border: "1px solid #cbd5e1",
      width: "100%",
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      ...commonStyle,
    };
  
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {config.label && <label>{config.label}</label>}
        <input
          type="date"
          name={config.name || "date"}
          value={config.value || ""}
          min={config.min || ""}
          max={config.max || ""}
          aria-label={config.label}
          style={{ ...defaultStyle, ...config.fieldStyle }}
          onBlur={(e) => onAction(e, "onBlur", e.target.value)}
          onFocus={(e) => onAction(e, "onFocus", e.target.value)}
          onClick={(e) => onAction(e, "onClick", e.target.value)}
          onChange={(e) => onAction(e, "onChange", e.target.value)}
          onMouseEnter={(e) => onAction(e, "onMouseEnter", e.target.value)}
        />
      </div>
    );
  }
  
  // === DateTimePicker Component ===
  function DateTimePicker({ config = {}, onAction }) {
    const defaultStyle = {
      padding: "0.5rem",
      borderRadius: "0.25rem",
      border: "1px solid #cbd5e1",
      width: "100%",
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      ...commonStyle

    };
  
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {config.label && <label>{config.label}</label>}
        <input
          type="datetime-local"
          name={config.name || "datetime"}
          value={config.value || ""}
          min={config.min || ""}
          max={config.max || ""}
          aria-label={config.label}
          style={{ ...defaultStyle, ...config.fieldStyle }}
          onBlur={(e) => onAction(e, "onBlur", e.target.value)}
          onFocus={(e) => onAction(e, "onFocus", e.target.value)}
          onClick={(e) => onAction(e, "onClick", e.target.value)}
          onChange={(e) => onAction(e, "onChange", e.target.value)}
          onMouseEnter={(e) => onAction(e, "onMouseEnter", e.target.value)}
        />
      </div>
    );
  }
  
  // === TimePicker Component ===
  function TimePicker({ config = {}, onAction }) {
    const defaultStyle = {
      padding: "0.5rem",
      borderRadius: "0.25rem",
      border: "1px solid #cbd5e1",
      width: "100%",
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      ...commonStyle

    };
  
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {config.label && <label>{config.label}</label>}
        <input
          type="time"
          name={config.name || "time"}
          value={config.value || ""}
          min={config.min || ""}
          max={config.max || ""}
          aria-label={config.label}
          style={{ ...defaultStyle, ...config.fieldStyle }}
          onBlur={(e) => onAction(e, "onBlur", e.target.value)}
          onFocus={(e) => onAction(e, "onFocus", e.target.value)}
          onClick={(e) => onAction(e, "onClick", e.target.value)}
          onChange={(e) => onAction(e, "onChange", e.target.value)}
          onMouseEnter={(e) => onAction(e, "onMouseEnter", e.target.value)}
        />
      </div>
    );
  }
  
  // === MonthPicker Component ===
  function MonthPicker({ config = {}, onAction }) {
    const defaultStyle = {
      padding: "0.5rem",
      borderRadius: "0.25rem",
      border: "1px solid #cbd5e1",
      width: "100%",
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      ...commonStyle

    };
  
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {config.label && <label>{config.label}</label>}
        <input
          type="month"
          name={config.name || "month"}
          value={config.value || ""}
          min={config.min || ""}
          max={config.max || ""}
          aria-label={config.label}
          style={{ ...defaultStyle, ...config.fieldStyle }}
          onBlur={(e) => onAction(e, "onBlur", e.target.value)}
          onFocus={(e) => onAction(e, "onFocus", e.target.value)}
          onClick={(e) => onAction(e, "onClick", e.target.value)}
          onChange={(e) => onAction(e, "onChange", e.target.value)}
          onMouseEnter={(e) => onAction(e, "onMouseEnter", e.target.value)}
        />
      </div>
    );
  }
  
  // === WeekPicker Component ===
  function WeekPicker({ config = {}, onAction }) {
    const defaultStyle = {
      padding: "0.5rem",
      borderRadius: "0.25rem",
      border: "1px solid #cbd5e1",
      width: "100%",
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      ...commonStyle

    };
  
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {config.label && <label>{config.label}</label>}
        <input
          type="week"
          name={config.name || "week"}
          value={config.value || ""}
          min={config.min || ""}
          max={config.max || ""}
          aria-label={config.label}
          style={{ ...defaultStyle, ...config.fieldStyle }}
          onBlur={(e) => onAction(e, "onBlur", e.target.value)}
          onFocus={(e) => onAction(e, "onFocus", e.target.value)}
          onClick={(e) => onAction(e, "onClick", e.target.value)}
          onChange={(e) => onAction(e, "onChange", e.target.value)}
          onMouseEnter={(e) => onAction(e, "onMouseEnter", e.target.value)}
        />
      </div>
    );
  }
  
  // === ArrayList Component ===
  function ArrayList({ config = {}, onAction }) {
    const items = config.value || [];
    
    const containerStyle = {
      border: "1px solid #cbd5e1",
      borderRadius: "0.25rem",
      padding: "1rem",
      width: "100%",
      ...commonStyle,
    };
    
    const itemStyle = {
      display: "flex",
      gap: "0.5rem",
      marginBottom: "0.5rem"
    };
    
    const buttonStyle = {
      padding: "0.25rem 0.5rem",
      backgroundColor: "#ef4444",
      color: "white",
      border: "none",
      borderRadius: "0.25rem",
      cursor: "pointer",
      fontSize: "0.75rem"
    };
    
    const addButtonStyle = {
      padding: "0.5rem 1rem",
      backgroundColor: "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "0.25rem",
      cursor: "pointer",
      fontSize: "0.875rem",
      marginTop: "0.5rem"
    };
  
    const handleRemove = (index, e) => {
      const newItems = [...items];
      newItems.splice(index, 1);
      onAction(e, "onChange", newItems);
    };
  
    const handleAdd = (e) => {
      const newItems = [...items, config.defaultItem || ""];
      onAction(e, "onChange", newItems);
    };
  
    const handleItemChange = (index, e) => {
      const newItems = [...items];
      newItems[index] = e.target.value;
      onAction(e, "onChange", newItems);
    };
  
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {config.label && <label>{config.label}</label>}
        <div style={{ ...containerStyle, ...config.containerStyle }}>
          {items.map((item, index) => (
            <div key={index} style={itemStyle}>
              <input
                type="text"
                value={item}
                onChange={(e) => handleItemChange(index, e)}
                style={{ flex: 1, padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #cbd5e1" }}
              />
              <button
                type="button"
                onClick={(e) => handleRemove(index, e)}
                style={buttonStyle}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAdd}
            style={addButtonStyle}
          >
            {config.addButtonText || "Add Item"}
          </button>
        </div>
      </div>
    );
  }
  
  // === SubForm Component ===
  function SubForm({ config = {}, onAction }) {
    const fields = config.fields || [];
    const formData = config.value || {};
    
    const containerStyle = {
      border: "1px solid #cbd5e1",
      borderRadius: "0.25rem",
      padding: "1rem",
      width: "100%",
      ...commonStyle,
    };
  
    const handleFieldChange = (fieldName, value) => {
      const newFormData = { ...formData, [fieldName]: value };
      onAction({ target: { name: config.name } }, "onChange", newFormData);
    };
  
    // Simple field renderer - in a real app, you would use a more sophisticated component factory
    const renderField = (field) => {
      switch (field.type) {
        case "text":
          return (
            <div key={field.name} style={{ marginBottom: "1rem" }}>
              <TextField
                config={{
                  ...field,
                  value: formData[field.name] || ""
                }}
                onAction={(e, action, value) => {
                  if (action === "onChange") {
                    handleFieldChange(field.name, value);
                  }
                }}
              />
            </div>
          );
        case "checkbox":
          return (
            <div key={field.name} style={{ marginBottom: "1rem" }}>
              <Checkbox
                config={{
                  ...field,
                  checked: formData[field.name] || false
                }}
                onAction={(e, action, value) => {
                  if (action === "onChange") {
                    handleFieldChange(field.name, value);
                  }
                }}
              />
            </div>
          );
        default:
          return null;
      }
    };
  
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {config.label && <label>{config.label}</label>}
        <div style={{ ...containerStyle, ...config.containerStyle }}>
          {fields.map(field => renderField(field))}
        </div>
      </div>
    );
  }
  
  // === GridField Component ===
  function GridField({ config = {}, onAction }) {
    const rows = config.value || [];
    const columns = config.columns || [];
    
    const containerStyle = {
      border: "1px solid #cbd5e1",
      borderRadius: "0.25rem",
      width: "100%",
      overflow: "auto",
      ...commonStyle
    };
    
    const tableStyle = {
      width: "100%",
      borderCollapse: "collapse"
    };
    
    const headerStyle = {
        backgroundColor: "#f1f5f9",
        fontWeight: "bold",
        padding: "0.75rem",
        textAlign: "left",
        borderBottom: "1px solid #cbd5e1",
        ...commonStyle
      };
      
      const cellStyle = {
        padding: "0.75rem",
        borderBottom: "1px solid #cbd5e1"
      };
      
      const buttonStyle = {
        padding: "0.5rem 1rem",
        backgroundColor: "#3b82f6",
        color: "white",
        border: "none",
        borderRadius: "0.25rem",
        cursor: "pointer",
        fontSize: "0.875rem",
        marginTop: "0.5rem"
      };
      
      const deleteButtonStyle = {
        padding: "0.25rem 0.5rem",
        backgroundColor: "#ef4444",
        color: "white",
        border: "none",
        borderRadius: "0.25rem",
        cursor: "pointer",
        fontSize: "0.75rem"
      };
    
      const handleAdd = (e) => {
        const emptyRow = {};
        columns.forEach(column => {
          emptyRow[column.field] = "";
        });
        const newRows = [...rows, emptyRow];
        onAction(e, "onChange", newRows);
      };
    
      const handleRemove = (index, e) => {
        const newRows = [...rows];
        newRows.splice(index, 1);
        onAction(e, "onChange", newRows);
      };
    
      const handleCellChange = (rowIndex, field, e) => {
        const newRows = [...rows];
        newRows[rowIndex] = { ...newRows[rowIndex], [field]: e.target.value };
        onAction(e, "onChange", newRows);
      };
    
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {config.label && <label>{config.label}</label>}
          <div style={{ ...containerStyle, ...config.containerStyle }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th key={index} style={headerStyle}>
                      {column.header}
                    </th>
                  ))}
                  <th style={headerStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} style={cellStyle}>
                        <input
                          type="text"
                          value={row[column.field] || ""}
                          onChange={(e) => handleCellChange(rowIndex, column.field, e)}
                          style={{ width: "100%", padding: "0.25rem", border: "1px solid #cbd5e1", borderRadius: "0.25rem" }}
                        />
                      </td>
                    ))}
                    <td style={cellStyle}>
                      <button
                        type="button"
                        onClick={(e) => handleRemove(rowIndex, e)}
                        style={deleteButtonStyle}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            style={buttonStyle}
          >
            {config.addButtonText || "Add Row"}
          </button>
        </div>
      );
    }
    
    // === DayPicker Component ===
    function DayPicker({ config = {}, onAction }) {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const selectedDay = config.value || "";
      
      const containerStyle = {
        display: "flex",
        flexDirection: config.layout === "vertical" ? "column" : "row",
        gap: "0.5rem",
        flexWrap: config.layout === "vertical" ? "nowrap" : "wrap"
      };
      
      const dayStyle = {
        padding: "0.5rem",
        border: "1px solid #cbd5e1",
        borderRadius: "0.25rem",
        cursor: "pointer",
        flex: config.layout === "vertical" ? "none" : "1",
        textAlign: "center",
        backgroundColor: "white",
        fontSize: "0.875rem",
        ...commonStyle
      };
      
      const selectedDayStyle = {
        ...dayStyle,
        backgroundColor: "#3b82f6",
        color: "white",
        borderColor: "#2563eb",
        ...commonStyle

      };
    
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {config.label && <label>{config.label}</label>}
          <div style={{ ...containerStyle, ...config.containerStyle }}>
            {days.map((day, index) => (
              <div
                key={index}
                style={day === selectedDay ? { ...selectedDayStyle, ...config.fieldStyle } : { ...dayStyle, ...config.fieldStyle }}
                onClick={(e) => onAction(e, "onChange", day)}
                onMouseEnter={(e) => onAction(e, "onMouseEnter", day)}
                onFocus={(e) => onAction(e, "onFocus", day)}
                onBlur={(e) => onAction(e, "onBlur", selectedDay)}
              >
                {config.shortNames ? day.substring(0, 3) : day}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // Export all components
    export {
      TextField,
      Checkbox,
      Toggle,
      RangeSlider,
      ButtonGroup,
      RadioGroup,
      Select,
      MultiSelect,
      ColorField,
      TextArea,
      FileUpload,
      Rating,
      DatePicker,
      DateTimePicker,
      TimePicker,
      MonthPicker,
      WeekPicker,
      ArrayList,
      SubForm,
      GridField,
      DayPicker
    };