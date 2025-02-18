import { signal } from "@preact/signals";
import { defaultStyle, fieldStyle, labelStyle } from "./configs_view/constantConfigs";
import { FunctionExecutor } from "../states/common_actions";

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
    "label":"Check me"
  };

const configs = [
    signal({...elementData, "onChange": 'console.log("called on Change:",cur_value);return {"01":{"style":{"borderRadius":"30px"}, "value":!cur_value},"02":{"value":false}};'}),
    signal({...elementData, "id":"02","type":"switch", "options":[{"label":"Option1", "value":"1"}, {"label":"option2","value":"2"}]})
];

let values = signal({"01":"Hello this is the text", "02":true});
function UpdateConfig(input) {
    let config = input["config"];
    let key = input["key"];
    let curvalue = input["value"];
    let eventCode = config[key];
    if (!eventCode || eventCode.length === 0) {
      return;
    }
    let functionParams = {"cur_element": config,"cur_value":curvalue, "configs": JSON.stringify(configs), "values": JSON.stringify(values)}
    var resp = FunctionExecutor(functionParams, eventCode);
    const id = config["id"];
    let newconfigs = {};
    if(resp !== undefined) {
        newconfigs = {...resp};
    }
     else {
        newconfigs = {...config};
     }
    let newval = input["value"];
    if(newconfigs === undefined) {
        return;
    }
    if(newval !== undefined && newval !== null) {
        let cur = values.peek();
        cur = {...cur, ...newval};
        values.value = cur;
    } 

    Object.keys(newconfigs).map((key) => {
        let data = newconfigs[key];
        configs.map((value, ind) => {
            let curmap = value.peek();
            if(curmap["id"] === key) {
                let newmap = {...curmap, ...data};
                if(data["value"] !== undefined && data["value"] !== null) {
                    let cur = values.peek();
                    cur[key] = data["value"];
                    values.value = cur;
                }
                configs[ind].value = newmap;
            }
        });
    });
}
function CallOnChange(data) {
    console.log("called on Change:",data);
}

export {configs, values, CallOnChange, UpdateConfig};