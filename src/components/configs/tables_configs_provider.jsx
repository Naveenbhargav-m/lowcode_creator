import { commonConfig } from "./common_config_provider";

let tablesFielsConfig = [
    {
      type: "text",
      fieldName: "name",
      label: "Column Name:",
      inputStyle: { ...commonConfig["inputStyle"], minHeight: "40px", fontSize: "14px"}, // Adjustable height
      wrapperStyle: commonConfig["wrapperStyle"],
      labelStyle: commonConfig["labelStyle"],
      labelPosition: "top",
      language: "js",
      placeholder: "Please enter your JS code here.",
      onChange: (data) => { console.log("CodeEditor onChange:", data); },
      layout: { w: 4, h: 6, x: 0, y: 10, i: "name", moved: false, static: true },
    },
    
    {
      type: "checkbox",
      fieldName: "required",
      label: "Required?:",
      inputStyle: { ...commonConfig["inputStyle"], borderRadius:"6px" ,  marginLeft:"20px" , height: "20px", width:"20px", minHeight: "10px",fontSize: "14px" }, // Adjustable height
      wrapperStyle: commonConfig["wrapperStyle"],
      labelStyle: {...commonConfig["labelStyle"], "marginTop":"20px"},
      labelPosition: "top",
      language: "js",
      placeholder: "Please enter your JS code here.",
      onChange: (data) => { console.log("CodeEditor onChange:", data); },
      layout: { w: 4, h: 3, x: 0, y: 16, i: "required", moved: false, static: true },
    },
    {
        type: "text",
        fieldName: "default",
        label: "Default:",
        inputStyle: { ...commonConfig["inputStyle"], borderRadius:"16px",height: "40px", minHeight: "10px",fontSize: "14px" }, // Adjustable height
        wrapperStyle: commonConfig["wrapperStyle"],
        labelStyle: {...commonConfig["labelStyle"], "marginTop":"20px"},
        labelPosition: "top",
        language: "js",
        placeholder: "Please enter your JS code here.",
        onChange: (data) => { console.log("CodeEditor onChange:", data); },
        layout: { w: 4, h: 3, x: 0, y: 19, i: "default", moved: false, static: true },
      },
  {
    type: "dropdown",
    fieldName: "relation",
    label: "Relation To:",
    inputStyle: { ...commonConfig["inputStyle"], height: "170px", minHeight: "150px",fontSize: "14px" }, // Adjustable height
    wrapperStyle: commonConfig["wrapperStyle"],
    labelStyle: commonConfig["labelStyle"],
    options:[{"label":"table","value":"table"}],
    labelPosition: "top",
    language: "js",
    placeholder: "Please enter your JS code here.",
    onChange: (data) => { console.log("CodeEditor onChange:", data); },
    layout: { w: 4, h: 16, x: 0, y: 26, i: "relation", moved: false, static: true },
  }
  ];


  let tableConfig = [
    {
      type: "text",
      fieldName: "label",
      label: "Table Name:",
      inputStyle: { ...commonConfig["inputStyle"], minHeight: "40px", fontSize: "14px"}, // Adjustable height
      wrapperStyle: commonConfig["wrapperStyle"],
      labelStyle: commonConfig["labelStyle"],
      labelPosition: "top",
      language: "js",
      placeholder: "Please enter your JS code here.",
      onChange: (data) => { console.log("CodeEditor onChange:", data); },
      layout: { w: 4, h: 6, x: 0, y: 10, i: "label", moved: false, static: true },
    }
  ];
  export const tablesConfigs = {
    "tables_field":tablesFielsConfig,
    "table_config":tableConfig
  };  