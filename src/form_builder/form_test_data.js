import { defaultStyle, fieldStyle, labelStyle } from "./configs_view/constantConfigs";

let elementData = {
    "type":"textfield",
    "id": "01",
    "parent": "screen",
    "children": [],
    "order": length, 
    "size_class": "",
    "grow":"",
    "srink":"",
    "height": 50,
    "width":50,
    "config": {},
    "class":"dp25",
    "style": {},
    "panelStyle": defaultStyle,
    "fieldStyle": {},
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
    "valueData": "",
  };

const configs = [
    {...elementData, "onChange": 'return {"01":{"style":"paddng":"30px"}};'},
    {...elementData, "type":"switch", "id":"02", "color":"green"}
];

function CallOnChange(data) {
    console.log("called on Change:",data);
}

export {configs, CallOnChange};