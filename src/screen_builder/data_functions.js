import { global_templates } from "../states/global_repo"
import { tabDataSignal } from "./screen_state";

function LoadUserTemplates() {
    let alltemplates = global_templates;
    let templatesList = [];
    let keys = Object.keys(alltemplates);
    //{ icon: "square", title: "Card", value: "card", type: "container" },
    for(var i=0;i<keys.length;i++) {
        let curtemplate = alltemplates[keys[i]] || {};
        var obj = {
            "id": keys[i],
            "name": curtemplate["name"],
            "icon": "square",
            "title": curtemplate["name"],
            "value": keys[i],
            "type": "user_template"
        };

        templatesList.push(obj);
    }

    let existing = tabDataSignal.value;
    existing.my_templates = [...templatesList];
    tabDataSignal.value = {...existing};
}



export {LoadUserTemplates}