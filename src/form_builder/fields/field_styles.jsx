const baseStyle = { 
    border: "1px solid #ccc",
    padding: "8px",
    borderRadius: "4px",
    fontSize: "14px",
    color: "#333",
    backgroundColor: "#fff",
    width: "100%",};
const textFieldConfig = {
    style: {...baseStyle},
    "placeholder": "This is textfield",
    "value": "",
    "label":"Pick a BG"
  };
  
  const passwordFieldConfig = {
    style: {...baseStyle},
    "placeholder": "Your password...",
    "value": "",
    "label":"Pick a BG"
  };
  
  const switchConfig = {
    style:{
        width: "40px",
        height: "20px",
        backgroundColor: "#ddd",
        borderRadius: "10px",
        cursor: "pointer",
    },
    "label": "I Agree",
    "value": true,
  };
  
  const checkboxConfig = {
    style: {
        width: "16px",
        height: "16px",
        border: "1px solid #ccc",
        borderRadius: "3px",
        cursor: "pointer",
    },
    "options": [{"value":"op1", "label": "triller"}],
  };
  
  const radioConfig = {
    style: {
        width: "16px",
        height: "16px",
        border: "2px solid #333",
        borderRadius: "50%",
        cursor: "pointer",
    },
    "options": [{"value":"op1", "label": "triller"}, {"value":"drama", "label":"drama"}, {"value":"romcom", "label":"romcom"}],
  };
  
const dropDownConfig = {
    style: {...baseStyle},
    "name":  "Select a movie",
    "options": [{"value":"Shutter Island", "label":"Shutter Island"},{"vaue":"Inception", "label":"Inception"},{"value":"Intersteller", "label":"Intersteller"}],
    "value":""
  };


  const multiSelectConfig = {
    style: {...baseStyle},
    "name":  "Select a movie",
    "options": [{"value":"Shutter Island", "label":"Shutter Island"},{"vaue":"Inception", "label":"Inception"},{"value":"Intersteller", "label":"Intersteller"}],
    "value":""
  };
  
const sliderConfig = {
    style: {
        width: "100%",
        height: "4px",
        backgroundColor: "#ddd",
        borderRadius: "2px",
    },
    "label":"Age Range",
    "value":30,
  };
  
  const colorPickerConfig = {
    style: {
        width: "40px",
        height: "40px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        cursor: "pointer",
    },
    "value":"#606c38",
    "label":"Pick a BG"
  };
  
  const textAreaConfig = {
    style: {...baseStyle,minHeight: "100px" },
    "placeholder": "text area holder",
    "label":"Add text"
  };
  
const fileUploadConfig = {
    style: {
        border: "1px dashed #ccc",
        padding: "12px",
        borderRadius: "4px",
        fontSize: "14px",
        color: "#333",
        backgroundColor: "#f9f9f9",
        width: "100%",
        textAlign: "center",
    }
  };
  
  const ratingConfig = {
    style: {
        display: "flex",
        gap: "4px",
        color: "#f5c518",
        cursor: "pointer",
    },
    "label":"Rate meee"
  };
  
const datePickerConfig = {
    style: {...baseStyle},
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