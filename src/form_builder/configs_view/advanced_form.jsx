import { h } from 'preact';
import { effect, useSignal } from '@preact/signals';
import { useState } from 'preact/hooks';
import '../styles/AdvancedFormStyle.css';

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

const TextAreaWithPopup = ({ label, configKey, valueSignal, onChange , wrapperStyle = {}, labelStyle={}, style  = {}}) => {
  const isPopupOpen = useSignal(false);

  const handleTextAreaClick = () => {
    isPopupOpen.value = true;
  };

  const handlePopupSubmit = (newValue) => {
    valueSignal.value = newValue;
    onChange(configKey, newValue);
    isPopupOpen.value = false;
  };

  return (
    <div className="form-field" style={{...wrapperStyle}}>
      <label style={{...labelStyle}}>{label}</label>
      <textarea
        readOnly
        value={valueSignal.value} // ✅ Use `.value` here
        onClick={handleTextAreaClick}
        style={{...style}}
      />
      <Popup
        isOpen={isPopupOpen.value}
        onClose={() => (isPopupOpen.value = false)}
        onSubmit={handlePopupSubmit}
        value={valueSignal.value} // ✅ Use `.value` here
        label={label}
      />
    </div>
  );
};

// TextAreaWithPopup component
// const TextAreaWithPopup = ({ label, configKey, valueSignal, onChange }) => {
//   const isPopupOpen = useSignal(false);

//   const handleTextAreaClick = () => {
//     isPopupOpen.value = true;
//   };

//   const handlePopupSubmit = (newValue) => {
//     valueSignal.value = newValue;
//     onChange(configKey, newValue);
//     isPopupOpen.value = false;
//   };

//   return (
//     <div className="form-field">
//       <label>{label}</label>
//       <textarea
//         readOnly
//         value={valueSignal}
//         onClick={handleTextAreaClick}
//       />
//       <Popup
//         isOpen={isPopupOpen.value}
//         onClose={() => (isPopupOpen.value = false)}
//         onSubmit={handlePopupSubmit}
//         value={valueSignal}
//         label={label}
//       />
//     </div>
//   );
// };

// Main Form component
const AdvnacedForm = ({ configsInp,onSubmit  }) => {
  console.log("rerendering the advanced form:",configsInp);
  let configs = {};
  if(configsInp == undefined) {
    return <></>;
  }
 // Track keys that were originally objects
const objectKeys = new Set();

// Initialize configs with signals
Object.keys(configsInp).forEach((key) => {
  if (typeof configsInp[key] === 'object' && configsInp[key] !== null) {
    console.log("key is object type:",key);
    objectKeys.add(key); // Track object keys
    configs[key] = useSignal(JSON.stringify(configsInp[key]));
  } else {
    configs[key] = useSignal(configsInp[key]);
  }
});

// Handle change with proper stringification for object keys
const handleChange = (key, value) => {
    configs[key].value = value;
  console.log(`Updated: ${key} -> ${value}`);
};



const handleSubmit = () => {
  console.log("before submit:", configs, objectKeys);

  const result = Object.fromEntries(
    Object.entries(configs).map(([key, signal]) => {
      const originalValue = signal.peek();
      let parsedValue = originalValue;

      // Check if the key exists in the set and if value is a parsable string
      if (objectKeys.has(key) && typeof parsedValue === "string") {
        console.log("key:", key, parsedValue);
        try {
          parsedValue = JSON.parse(parsedValue); // Parse if it's a valid JSON string
          console.log("parsed once:", parsedValue, typeof parsedValue);

          // Check if parsedValue is still a string and needs further parsing
          if (typeof parsedValue === "string") {
            parsedValue = JSON.parse(parsedValue);
            console.log("parsed twice:", parsedValue, typeof parsedValue);
          }
        } catch (error) {
          console.warn(`Failed to parse key "${key}":`, error);
        }
      }

      return [key, parsedValue];
    })
  );

  console.log("Form Submitted:", result);
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

export  {AdvnacedForm, TextAreaWithPopup , Popup};