// @ts-ignore

export function TextField({ config, value }) {
    const {
      label,
      onInput,
      labelStyle,
      labelPosition,
      inputStyle,
      // @ts-ignore
      size,
    } = config;
  
    console.log("new config TextField:", config);
  
    const labelStyles = {
      display: labelPosition === "top" ? "block" : "inline-block",
      marginRight: labelPosition === "left" ? "8px" : "0",
      ...labelStyle,
    };
  
    const fieldStyles = {
      width:"100%",
      height: "100%",
      ...inputStyle,
    };
  
    return (
      <div className="field" style={{ display: "inline-block" }}>
        <label style={labelStyles}>{label}</label>
        <input
          type="text"
          value={value || ""}
          style={fieldStyles}
          // @ts-ignore
          onChange={(e) => onInput(e.target.value)}
          // @ts-ignore
          onInput={(e) => onInput(e.target.value)}
        />
      </div>
    );
  }
  
  export function TextArea({ config, value }) {
    const {
      label,
      onInput,
      labelStyle,
      labelPosition,
      inputStyle,
      // @ts-ignore
      size,
    } = config;
  
    console.log("new config TextField:", config);
  
    const labelStyles = {
      display: labelPosition === "top" ? "block" : "inline-block",
      marginRight: labelPosition === "left" ? "8px" : "0",
      ...labelStyle,
    };
  
    const fieldStyles = {
      width:"100%",
      height: "100%",
      ...inputStyle,
    };
  
    return (
      <div className="field" style={{ display: "inline-block" }}>
        <label style={labelStyles}>{label}</label>
        <textarea
          value={value || ""}
          style={fieldStyles}
          // @ts-ignore
          onInput={(e) => onInput(e.target.value)}
        ></textarea>
      </div>
    );
  }
  
  export function CheckBox({ config, value }) {
   
    const {
      label,
      onInput,
      labelStyle,
      labelPosition,
      inputStyle,
      // @ts-ignore
      size,
    } = config;
  
    console.log("new config TextField:", config);
  
    const labelStyles = {
      display: labelPosition === "top" ? "block" : "inline-block",
      marginRight: labelPosition === "left" ? "8px" : "0",
      ...labelStyle,
    };
  
    const fieldStyles = {
      width:"100%",
      height: "100%",
      ...inputStyle,
    };
    return (
      <div className="field" style={{ display: "inline-block" }}>
        <label style={labelStyles}>
          <input
            type="checkbox"
            checked={value || false}
            style={fieldStyles}
            // @ts-ignore
            onChange={(e) => onInput(e.target.checked)}
          />
          {label}
        </label>
      </div>
    );
  }
  
  export function ButtonGroup({ config, value }) {
    const {
      label,
      onInput,
      labelStyle,
      labelPosition,
      inputStyle,
      options,
      // @ts-ignore
      size,
    } = config;
  
    console.log("new config TextField:", config);
  
    const labelStyles = {
      display: labelPosition === "top" ? "block" : "inline-block",
      marginRight: labelPosition === "left" ? "8px" : "0",
      ...labelStyle,
    };
  
    // @ts-ignore
    const fieldStyles = {
      width:"100%",
      height: "100%",
      ...inputStyle,
    };
    const groupStyles = {
      display: "flex",
      gap: "8px",
      ...inputStyle,
    };
  
    return (
      <div className="field" style={{ display: "inline-block" }}>
        <label style={labelStyles}>{label}</label>
        <div className="button-group" style={groupStyles}>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => onInput(option.value)}
              className={value === option.value ? "active" : ""}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  export function SelectBox({ config, value }) {
    const {
      label,
      onInput,
      labelStyle,
      labelPosition,
      inputStyle,
      options,
      // @ts-ignore
      size,
    } = config;
  
    console.log("new config TextField:", config);
  
    const labelStyles = {
      display: labelPosition === "top" ? "block" : "inline-block",
      marginRight: labelPosition === "left" ? "8px" : "0",
      ...labelStyle,
    };
  
  
    const fieldStyles = {
      width:"100%",
      height: "100%",
      ...inputStyle,
    };
  
    return (
      <div className="field" style={{ display: "inline-block" }}>
        <label style={labelStyles}>{label}</label>
        <select
          value={value || ""}
          style={fieldStyles}
          // @ts-ignore
          onChange={(e) => onInput(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
  
  export function Slider({ config, value }) {
    // @ts-ignore
    const { label, min, max, step, onInput, labelStyle, labelPosition, inputStyle , size} = config;
    console.log("new config Slider:", config);
  
    
    const labelStyles = {
      display: labelPosition === "top" ? "block" : "inline-block",
      marginRight: labelPosition === "left" ? "8px" : "0",
      ...labelStyle,
    };
  
  
    const fieldStyles = {
      width:"100%",
      height: "100%",
      ...inputStyle,
    };
  
    return (
      <div className="field" style={{ display: "inline-block" }}>
        <label style={labelStyles}>{label}</label>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value || min}
          style={fieldStyles}
          // @ts-ignore
          onInput={(e) => onInput(e.target.value)}
        />
        <span>{value}</span>
      </div>
    );
  }
  
  
  export function NumberField({ config, value }) {
    // @ts-ignore
    const { label, min, max, step, onInput, labelStyle, labelPosition, inputStyle, size } = config;
  
    const labelStyles = {
      display: labelPosition === "top" ? "block" : "inline-block",
      marginRight: labelPosition === "left" ? "8px" : "0",
      ...labelStyle,
    };
  
  
    const fieldStyles = {
      width:"100%",
      height: "100%",
      ...inputStyle,
    };
  
    return (
      <div className="field" style={{ display: "inline-block" }}>
        <label style={labelStyles}>{label}</label>
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value || ""}
          style={fieldStyles}
          // @ts-ignore
          onInput={(e) => onInput(Number(e.target.value))}
        />
      </div>
    );
  }
  
  export function DropDown({ config, value }) {
    // @ts-ignore
    const { label, options, onInput, labelStyle, labelPosition, inputStyle, size } = config;
  
    const labelStyles = {
      display: labelPosition === "top" ? "block" : "inline-block",
      marginRight: labelPosition === "left" ? "8px" : "0",
      ...labelStyle,
    };
  
  
    const fieldStyles = {
      width:"100%",
      height: "100%",
      ...inputStyle,
    };
  
    return (
      <div className="field" style={{ display: "inline-block" }}>
        <label style={labelStyles}>{label}</label>
        <select
          value={value || ""}
          style={fieldStyles}
          // @ts-ignore
          onChange={(e) => onInput(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
  
  export function DateTime({ config, value }) {
    // @ts-ignore
    const { label, onInput, labelStyle, labelPosition, inputStyle, size } = config;
  
    const labelStyles = {
      display: labelPosition === "top" ? "block" : "inline-block",
      marginRight: labelPosition === "left" ? "8px" : "0",
      ...labelStyle,
    };
  
    
    const fieldStyles = {
      width:"100%",
      height: "100%",
      ...inputStyle,
    };
  
    return (
      <div className="field" style={{ display: "inline-block" }}>
        <label style={labelStyles}>{label}</label>
        <input
          type="datetime-local"
          value={value || ""}
          style={fieldStyles}
          // @ts-ignore
          onInput={(e) => onInput(e.target.value)}
        />
      </div>
    );
  }
  
  export function EmailField({ config, value }) {
    // @ts-ignore
    const { label, onInput, labelStyle, labelPosition, inputStyle, size } = config;
  
    const labelStyles = {
      display: labelPosition === "top" ? "block" : "inline-block",
      marginRight: labelPosition === "left" ? "8px" : "0",
      ...labelStyle,
    };
  
  
    const fieldStyles = {
      width:"100%",
      height: "100%",
      ...inputStyle,
    };
  
    return (
      <div className="field" style={{ display: "inline-block" }}>
        <label style={labelStyles}>{label}</label>
        <input
          type="email"
          value={value || ""}
          style={fieldStyles}
          // @ts-ignore
          onInput={(e) => onInput(e.target.value)}
        />
      </div>
    );
  }
  
  export function LocationField({ config, value }) {
    // @ts-ignore
    const { label, onInput, labelStyle, labelPosition, inputStyle, size } = config;
  
    const labelStyles = {
      display: labelPosition === "top" ? "block" : "inline-block",
      marginRight: labelPosition === "left" ? "8px" : "0",
      ...labelStyle,
    };
  
  
    const fieldStyles = {
      width:"100%",
      height: "100%",
      ...inputStyle,
    };
  
    return (
      <div className="field" style={{ display: "inline-block" }}>
        <label style={labelStyles}>{label}</label>
        <input
          type="text"
          placeholder="Enter location"
          value={value || ""}
          style={fieldStyles}
          // @ts-ignore
          onInput={(e) => onInput(e.target.value)}
        />
      </div>
    );
  }
  
  
  
  export const primitives = {
    "TextField":TextField,
    "Text":TextField,
    TextArea,
    "Checkbox":CheckBox,
    ButtonGroup,
    SelectBox,
    Slider,
    "Number":NumberField,
    "Integer":NumberField,
    DropDown,
    DateTime,
    "Email":EmailField,
    LocationField,
  };
  