import { signal } from "@preact/signals";
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
    signal({...elementData, "onChange": 'return {"01":{"style":{"borderRadius":"30px"}},"02":{"value":false}};'}),
    signal({...elementData, "type":"switch", "id":"02", "color":"green"})
];

let values = signal({"01":"Hello this is the text", "02":true});
function UpdateConfig(input) {
    let newconfigs = input["config"];
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