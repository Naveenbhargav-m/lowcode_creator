import { commonConfig } from "./common_config_provider";


let primitiveConfig = [
  {
    type: "textarea",
    fieldName: "Style",
    label: "Style:",
    inputStyle: { ...commonConfig["inputStyle"], height: "170px", minHeight: "150px", fontSize: "14px"}, // Adjustable height
    wrapperStyle: commonConfig["wrapperStyle"],
    labelStyle: commonConfig["labelStyle"],
    labelPosition: "top",
    language: "js",
    placeholder: "Please enter your JS code here.",
    onChange: (data) => { console.log("CodeEditor onChange:", data); },
    layout: { w: 4, h: 16, x: 0, y: 0, i: "Style", moved: false, static: true },
  },
  {
    type: 'radio-buttons',
    fieldName: 'ElementType',
    label: 'ElementType',
    labelPosition: 'top', 
    direction: 'column',
    options: [
      { value: 'template', label: 'Template', position: 'right' },
      { value: 'element', label: 'Element', position: 'right' },
    ],
    inputStyle: { "border-radius": "15px", "color": "black", width: "100%" },
    wrapperStyle: commonConfig["wrapperStyle"],
    labelStyle: commonConfig["labelStyle"],
    layout: { w: 4, h: 11, x: 0, y: 16, i: "ElementType", moved: false, static: true }, // Adjust y to follow `inputStyle`
  },
  {
    type: "textarea",
    fieldName: "Value",
    label: "Value:",
    inputStyle: { ...commonConfig["inputStyle"], height: "170px", minHeight: "150px",fontSize: "14px" }, // Adjustable height
    wrapperStyle: commonConfig["wrapperStyle"],
    labelStyle: commonConfig["labelStyle"],
    labelPosition: "top",
    language: "js",
    placeholder: "Please enter your JS code here.",
    onChange: (data) => { console.log("CodeEditor onChange:", data); },
    layout: { w: 4, h: 16, x: 0, y: 27, i: "value", moved: false, static: true },
  },
  {
    type: "textarea",
    fieldName: "OnClick",
    label: "onClick:",
    inputStyle: { ...commonConfig["inputStyle"], height: "170px", minHeight: "150px",fontSize: "14px" }, // Adjustable height
    wrapperStyle: commonConfig["wrapperStyle"],
    labelStyle: commonConfig["labelStyle"],
    labelPosition: "top",
    language: "js",
    placeholder: "Please enter your JS code here.",
    onChange: (data) => { console.log("CodeEditor onChange:", data); },
    layout: { w: 4, h: 16, x: 0, y: 43, i: "OnClick", moved: false, static: true },
},
{
  type: "textarea",
  fieldName: "OnDoubleClick",
  label: "OnDoubleClick:",
  inputStyle: { ...commonConfig["inputStyle"], height: "170px", minHeight: "150px",fontSize: "14px" }, // Adjustable height
  wrapperStyle: commonConfig["wrapperStyle"],
  labelStyle: commonConfig["labelStyle"],
  labelPosition: "top",
  language: "js",
  placeholder: "Please enter your JS code here.",
  onChange: (data) => { console.log("CodeEditor onChange:", data); },
  layout: { w: 4, h: 16, x: 0, y: 59, i: "OnDoubleClick", moved: false, static: true },
}

];


let formsElementConfig = [
  {
    type: "textarea",
    fieldName: "Style",
    label: "Style:",
    inputStyle: { ...commonConfig["inputStyle"], height: "170px", minHeight: "150px", fontSize: "14px"}, // Adjustable height
    wrapperStyle: commonConfig["wrapperStyle"],
    labelStyle: commonConfig["labelStyle"],
    labelPosition: "top",
    language: "js",
    placeholder: "Please enter your JS code here.",
    onChange: (data) => { console.log("CodeEditor onChange:", data); },
    layout: { w: 4, h: 16, x: 0, y: 0, i: "Style", moved: false, static: true },
  },
  
  {
    type: "textarea",
    fieldName: "Value",
    label: "Value:",
    inputStyle: { ...commonConfig["inputStyle"], height: "170px", minHeight: "150px",fontSize: "14px" }, // Adjustable height
    wrapperStyle: commonConfig["wrapperStyle"],
    labelStyle: commonConfig["labelStyle"],
    labelPosition: "top",
    language: "js",
    placeholder: "Please enter your JS code here.",
    onChange: (data) => { console.log("CodeEditor onChange:", data); },
    layout: { w: 4, h: 16, x: 0, y: 16, i: "value", moved: false, static: true },
  },
  {
    type: "textarea",
    fieldName: "OnClick",
    label: "onClick:",
    inputStyle: { ...commonConfig["inputStyle"], height: "170px", minHeight: "150px",fontSize: "14px" }, // Adjustable height
    wrapperStyle: commonConfig["wrapperStyle"],
    labelStyle: commonConfig["labelStyle"],
    labelPosition: "top",
    language: "js",
    placeholder: "Please enter your JS code here.",
    onChange: (data) => { console.log("CodeEditor onChange:", data); },
    layout: { w: 4, h: 16, x: 0, y: 32, i: "OnClick", moved: false, static: true },
},
{
  type: "textarea",
  fieldName: "OnDoubleClick",
  label: "OnDoubleClick:",
  inputStyle: { ...commonConfig["inputStyle"], height: "170px", minHeight: "150px",fontSize: "14px" }, // Adjustable height
  wrapperStyle: commonConfig["wrapperStyle"],
  labelStyle: commonConfig["labelStyle"],
  labelPosition: "top",
  language: "js",
  placeholder: "Please enter your JS code here.",
  onChange: (data) => { console.log("CodeEditor onChange:", data); },
  layout: { w: 4, h: 16, x: 0, y: 48, i: "OnDoubleClick", moved: false, static: true },
}
];

let elementConfigmaps = {
  "Text":primitiveConfig,
  "Number":primitiveConfig,
  "TextArea":primitiveConfig,
  "Button":primitiveConfig,
  "DropDown":primitiveConfig,
  "AvatarGroup":primitiveConfig,
  "Avatar":primitiveConfig, 
  "IconButton":primitiveConfig,
  "Icon":primitiveConfig,
  "Image":primitiveConfig,
  "Badge":primitiveConfig,
  "ProgressBar": primitiveConfig,
  "Indicator":primitiveConfig,
  "RichText":primitiveConfig,
  "formElementConfig":formsElementConfig,
};


export {elementConfigmaps};