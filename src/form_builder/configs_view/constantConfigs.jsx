let defaultStyle = {
    color: '#000000',
    backgroundColor: '#ffffff',
    padding: '10px',
    margin: '10px',
    border: 'none',
    borderRadius: '20px',
    boxShadow: 'none',
    minHeight:"70px",
    minWidth:"70px"
  };


let fieldStyle = {
    width: '100%',
    height: 'auto',
    color: '#000000',
    padding: '10px',
    margin: '0px',
    border: '2px solid black',
    borderRadius: '20px',
    boxShadow: 'none',
};

let labelStyle = {
    width: '100%',
    height: 'auto',
    color: '#000000',
    padding: '0px',
    margin: '0px',
    border: 'none',
    borderRadius: '0',
    boxShadow: 'none',
};


const commonConfig = {
    "size_class": "",
    "grow":"",
    "srink":"",
    "height": 50,
    "width":50,
    "config": {},
    "class":"dp25",
    "style": defaultStyle,
    "panelStyle": defaultStyle,
    "fieldStyle": fieldStyle,
    "labelStyle":labelStyle,
    "onClick": "",
    "onChange": "",
    "onHover": "",
    "onDoubleTap": "",
    "onDrop": "",
    "onDrag": "",
    "onMount": "",
    "onDestroy": "",
    "value": "",
    "valueData": ""
};


const textFieldConfig = {
    ...commonConfig,
    "value":"Text Value Here...",
    "style":{ "backgroundColor":"black", "--pico-color":"green", "borderRadius":"20px", "border":"2px solid black"},
};

const passwordConfig = {
    ...commonConfig,
    "place_holder": "password Here..."
};

const switchConfig = {
    ...commonConfig,
    "value": true,
    "color":"green",
    "style":{"color":"green", "backgroundColor":"black", "--pico-color":"green"},
};

const checkBoxConfig = {
    ...commonConfig,
    "value": true,
    "color":"green",
    "style":{...commonConfig["style"], "color":"green", "backgroundColor":"black"},
    "options": [{"label":"option1", "value": "option1"}, {"label":"option2", "value":"option2"}],
};

const radioConfigs = {
    ...commonConfig,
    "value": true,
    "color":"green",
    "style":{...commonConfig["style"], "color":"green", "backgroundColor":"black"},
    "options": [{"label":"option1", "value": "option1"}, {"label":"option2", "value":"option2"}],
};
const fieldsConfigs = {
    "textfield": textFieldConfig,
    "passwordfield": passwordConfig,
    "switch":switchConfig,
    "checkbox": checkBoxConfig,
    "radio": radioConfigs,
};
export {defaultStyle, labelStyle , fieldStyle, fieldsConfigs};