import { h } from 'preact';
import { effect, useSignal } from '@preact/signals';
import { useState } from 'preact/hooks';
import './AdvancedFormStyle.css';

// Popup component
const Popup = ({ isOpen, onClose, onSubmit, value, label }) => {
  if (!isOpen) return null;

  const [inputValue, setInputValue] = useState(value);

  const handleSave = () => {
    onSubmit(inputValue);
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h3>Edit {label}</h3>
        <textarea
          className="popup-textarea"
          value={inputValue}
          onInput={(e) => setInputValue(e.target["value"])}
        />
        <div className="popup-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

// TextAreaWithPopup component
const TextAreaWithPopup = ({ label, configKey, valueSignal, onChange }) => {
  const isPopupOpen = useSignal(false);

  const handleTextAreaClick = () => {
    isPopupOpen.value = true;
  };

  const handlePopupSubmit = (newValue) => {
    valueSignal.value = newValue;
    onChange(configKey, newValue);
  };

  return (
    <div className="form-field">
      <label>{label}</label>
      <textarea
        readOnly
        value={valueSignal}
        onClick={handleTextAreaClick}
      />
      <Popup
        isOpen={isPopupOpen.value}
        onClose={() => (isPopupOpen.value = false)}
        onSubmit={handlePopupSubmit}
        value={valueSignal}
        label={label}
      />
    </div>
  );
};

// Main Form component
const AdvnacedForm = ({ configsInp,onSubmit  }) => {
  console.log("rerendering the advanced form:",configsInp);
  let configs = {
    style: useSignal(configsInp["style"]),
    value: useSignal(configsInp["value"]),
    onClick: useSignal(configsInp["onClick"]),
    onChange: useSignal(configsInp["onChange"]),
    onHover: useSignal(configsInp["onHover"]),
    onDoubleTap: useSignal(configsInp["onDoubleTap"]),
    onDrop: useSignal(configsInp["onDrop"]),
    onDrag: useSignal(configsInp["onDrag"]),
    onMount: useSignal(configsInp["onMount"]),
    onDestroy: useSignal(configsInp["onDestroy"]),
  };

  const handleChange = (key, value) => {
    configs[key].value = value;
    console.log(`Updated: ${key} -> ${value}`);
  };

  const handleSubmit = () => {
    const result = Object.fromEntries(
      Object.entries(configs).map(([key, signal]) => [key, signal.value])
    );
    console.log('Form Submitted:', result);
    onSubmit(result);
  };

  return (
    <div className="form-container">
      {Object.entries(configs).map(([key, signal]) => (
        <TextAreaWithPopup
          key={key}
          label={key}
          configKey={key}
          valueSignal={signal}
          onChange={handleChange}
        />
      ))}
      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default AdvnacedForm;