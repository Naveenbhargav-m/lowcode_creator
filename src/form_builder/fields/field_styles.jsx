const baseStyle = { 
    border: "1px solid #ccc",
    padding: "8px",
    borderRadius: "4px",
    fontSize: "14px",
    color: "#333",
    backgroundColor: "#fff",
    width: "100%",};
const textFieldConfig = {
    fieldStyle: {...baseStyle},
    "panelStyle": {},
    "labelStyle": {},
    "placeholder": "This is textfield",
    "value": "",
    "label":"Pick a BG"
  };
  
  const passwordFieldConfig = {
    fieldStyle: {...baseStyle},
    "panelStyle": {},
    "labelStyle": {},
    "placeholder": "Your password...",
    "value": "",
    "label":"Pick a BG"
  };
  
  const switchConfig = {
    fieldStyle:{
        width: "40px",
        height: "20px",
        backgroundColor: "#ddd",
        borderRadius: "10px",
        cursor: "pointer",
    },
    "panelStyle": {},
    "labelStyle": {},
    "label": "I Agree",
    "value": true,
  };
  
  const checkboxConfig = {
    fieldStyle: {
        width: "16px",
        height: "16px",
        border: "1px solid #ccc",
        borderRadius: "3px",
        cursor: "pointer",
    },
    "panelStyle": {},
    "labelStyle": {},
    "options": [{"value":"op1", "label": "triller"}],
  };
  
  const radioConfig = {
    fieldStyle: {
        width: "16px",
        height: "16px",
        border: "2px solid #333",
        borderRadius: "50%",
        cursor: "pointer",
    },
    "panelStyle": {},
    "labelStyle": {},
    "options": [{"value":"op1", "label": "triller"}, {"value":"drama", "label":"drama"}, {"value":"romcom", "label":"romcom"}],
  };
  
const dropDownConfig = {
    fieldStyle: {...baseStyle},
    "panelStyle": {},
    "labelStyle": {},
    "name":  "Select a movie",
    "options": [{"value":"Shutter Island", "label":"Shutter Island"},{"vaue":"Inception", "label":"Inception"},{"value":"Intersteller", "label":"Intersteller"}],
    "value":""
  };


  const multiSelectConfig = {
    fieldStyle: {...baseStyle},
    "panelStyle": {},
    "labelStyle": {},
    "name":  "Select a movie",
    "options": [{"value":"Shutter Island", "label":"Shutter Island"},{"vaue":"Inception", "label":"Inception"},{"value":"Intersteller", "label":"Intersteller"}],
    "value":""
  };
  
const sliderConfig = {
    fieldStyle: {
        width: "100%",
        height: "4px",
        backgroundColor: "#ddd",
        borderRadius: "2px",
    },
    "panelStyle": {},
    "labelStyle": {},
    "label":"Age Range",
    "value":30,
  };
  
  const colorPickerConfig = {
    fieldStyle: {
        width: "40px",
        height: "40px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        cursor: "pointer",
    },
    "panelStyle": {},
    "labelStyle": {},
    "value":"#606c38",
    "label":"Pick a BG"
  };
  
  const textAreaConfig = {
    fieldStyle: {...baseStyle,minHeight: "100px" },
    "panelStyle": {},
    "labelStyle": {},
    "placeholder": "text area holder",
    "label":"Add text"
  };
  
const fileUploadConfig = {
    fieldStyle: {
        border: "1px dashed #ccc",
        padding: "12px",
        borderRadius: "4px",
        fontSize: "14px",
        color: "#333",
        backgroundColor: "#f9f9f9",
        width: "100%",
        textAlign: "center",
    },
    "panelStyle": {},
    "labelStyle": {},
  };
  
  const ratingConfig = {
    fieldStyle: {
        display: "flex",
        gap: "4px",
        color: "#f5c518",
        cursor: "pointer",
    },
    "panelStyle": {},
    "labelStyle": {},
    "label":"Rate meee"
  };
  
const datePickerConfig = {
    fieldStyle: {...baseStyle},
    "panelStyle": {},
    "labelStyle": {},
    "label": "pick a date",
  };
  

  const fieldsConfigs = {
    textfield: textFieldConfig,
    password: passwordFieldConfig,
    switch: switchConfig,
    checkbox: checkboxConfig,
    radio: radioConfig,
    dropdown: dropDownConfig,
    multi_select: multiSelectConfig,
    slider: sliderConfig,
    color: colorPickerConfig,
    textarea: textAreaConfig,
    file_upload: fileUploadConfig,
    rating: ratingConfig,
    date: datePickerConfig,
  };


  export {fieldsConfigs}