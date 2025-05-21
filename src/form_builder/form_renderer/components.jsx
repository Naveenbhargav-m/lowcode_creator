import { useState } from "preact/hooks";
import { styles } from "./styles";

export function TextInput({ 
    id, 
    label, 
    value, 
    onChange, 
    onFocus, 
    onBlur, 
    error, 
    style = {}, 
    hidden = false,
    ...props 
  }) {
    const [focused, setFocused] = useState(false);
    
    if (hidden) return null;
    
    return (
      <div style={{...styles.base.field, ...style["container"]}}>
        {label && <label htmlFor={id} style={{...styles.base.label, ...style["label"]}}>{label}</label>}
        <input
          id={id}
          value={value || ''}
          // @ts-ignore
          onChange={(e) => onChange(id, e.target.value, e)}
          onFocus={(e) => {
            setFocused(true);
            onFocus && onFocus(id, e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur && onBlur(id, e);
          }}
          style={{
            ...styles.base.input,
            ...(focused ? styles.base.focused : {}),
            ...(error ? styles.base.error : {}),
            ...style["input"]
          }}
          {...props}
        />
        {error && <div style={{...styles.base.errorText, ...style["error"]}}>{error}</div>}
      </div>
    );
  }
  
  export function SelectInput({ 
    id, 
    label, 
    value, 
    options = [], 
    onChange, 
    onFocus, 
    onBlur, 
    error, 
    style = {}, 
    hidden = false,
    ...props 
  }) {
    const [focused, setFocused] = useState(false);
    
    if (hidden) return null;
    
    return (
      <div style={{...styles.base.field, ...style["contianer"]}}>
        {label && <label htmlFor={id} style={{...styles.base.label, ...style["label"]}}>{label}</label>}
        <select
          id={id}
          value={value || ''}
          onChange={(e) => onChange(id, e.target["value"], e)}
          onFocus={(e) => {
            setFocused(true);
            onFocus && onFocus(id, e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur && onBlur(id, e);
          }}
          style={{
            ...styles.base.select,
            ...(focused ? styles.base.focused : {}),
            ...(error ? styles.base.error : {}),
            ...style["input"]
          }}
          {...props}
        >
          <option value="">{props.placeholder || 'Select an option...'}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <div style={{...styles.base.errorText, ...style["error"]}}>{error}</div>}
      </div>
    );
  }
  
  export function CheckboxInput({ 
    id, 
    label, 
    checked, 
    onChange, 
    onFocus, 
    onBlur, 
    error, 
    style = {}, 
    hidden = false,
    ...props 
  }) {
    if (hidden) return null;
    
    return (
      <div style={{...styles.base.field, ...style["container"]}}>
        <div style={{...styles.base.checkbox}}>
          <input
            id={id}
            type="checkbox"
            checked={checked || false}
            onChange={(e) => onChange(id, e.target["checked"], e)}
            onFocus={(e) => onFocus && onFocus(id, e)}
            onBlur={(e) => onBlur && onBlur(id, e)}
            style={{...styles.base.checkboxInput, ...style["input"]}}
            {...props}
          />
          {label && <label htmlFor={id} style={{...styles.base.label, margin: 0, ...style["label"]}}>{label}</label>}
        </div>
        {error && <div style={{...styles.base.errorText, ...style["error"]}}>{error}</div>}
      </div>
    );
  }
  
  export function TextareaInput({ 
    id, 
    label, 
    value, 
    onChange, 
    onFocus, 
    onBlur, 
    error, 
    style = {}, 
    hidden = false,
    ...props 
  }) {
    const [focused, setFocused] = useState(false);
    
    if (hidden) return null;
    
    return (
      <div style={{...styles.base.field, ...style["container"]}}>
        {label && <label htmlFor={id} style={{...styles.base.label, ...style["label"]}}>{label}</label>}
        <textarea
          id={id}
          value={value || ''}
          onChange={(e) => onChange(id, e.target["value"], e)}
          onFocus={(e) => {
            setFocused(true);
            onFocus && onFocus(id, e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur && onBlur(id, e);
          }}
          style={{
            ...styles.base.input,
            ...(focused ? styles.base.focused : {}),
            ...(error ? styles.base.error : {}),
            ...style["input"]
          }}
          {...props}
        />
        {error && <div style={{...styles.base.errorText, ...style["error"]}}>{error}</div>}
      </div>
    );
  }
  
  // Layout Components
  export function Row({ children, style = {}, hidden = false }) {
    if (hidden) return null;
    
    return (
      <div style={{...styles.layout.row, ...style}}>
        {children}
      </div>
    );
  }
  
  export function Column({ children, style = {}, hidden = false }) {
    if (hidden) return null;
    
    return (
      <div style={{...styles.layout.column, ...style["container"]}}>
        {children}
      </div>
    );
  }
  
  export function Panel({ title, children, style = {}, hidden = false }) {
    if (hidden) return null;
    
    return (
      <div style={{...styles.layout.panel, ...style["container"]}}>
        {title && <h3 style={{margin: '0 0 12px 0', fontSize: '16px', ...style["label"]}}>{title}</h3>}
        <div style={{...style["input"]}}>
          {children}
        </div>
      </div>
    );
  }
  
  // Form Steps Component
  export function FormSteps({ steps, currentStep, onStepChange, style = {} }) {
    return (
      <div style={{...styles.layout.steps, ...style["container"]}}>
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => onStepChange(index)}
            style={{
              ...styles.layout.step,
              ...(index === currentStep 
                ? styles.layout.activeStep 
                : index < currentStep 
                  ? styles.layout.completedStep 
                  : styles.layout.inactiveStep),
              ...style["input"]
            }}
          >
            {step.title}
          </button>
        ))}
      </div>
    );
  }
  