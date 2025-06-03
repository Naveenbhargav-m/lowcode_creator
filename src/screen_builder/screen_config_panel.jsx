import {activeElement, activeScreen, screenElementAdded, activeScreenElements, screens, screenViewKey, MarkScreenAsChanged } from "./screen_state";
import { generateUID } from "../utils/helpers";
import { ConfigFormV3 } from "../components/generic/config_form_v3/config_form";
import { TemplateElementConfigFormSchema } from "../template_builder/configs";
import { data } from "autoprefixer";
import { fieldsMap, global_queries, global_user_fields } from "../states/global_repo";


function get_query_field_map(formValues, fieldconfig, context) {
    let id = activeElement?.value;
    let screenelement = activeScreenElements?.[id] || {};
    let elementval = screenelement?.value || {};
    let inputs = screenelement?.inputs || [];
    if(inputs.length === 0) {
        for(var i=0;i<5;i++) {
            var temp = {
                "label": `inputs ${i}`,
                "id": `inputs ${i}`,
                "value": `inputs ${i}`
            };
            inputs.push(temp);
        }
    }

    let queryid = formValues?.configs?.data_source?.data_query ?? "";

    let queryFields = fieldsMap?.queries?.[queryid] || [];
    console.log("get query field map is called:", queryFields, inputs);

    return {
        "inputs": inputs,
        "query_fields": queryFields
    };
}

function get_query_names( formValues, fieldconfig, context) {
    let queries = Object.keys(global_queries);
    let query_options = [];
    for(var i=0;i<queries.length;i++) {
        let name = global_queries[queries[i]]["name"] || queries[i];
        let obj = {"value": queries[i], "label": name};
        query_options.push(obj);
    }
    console.log("get query names called:",query_options);
    return query_options;
}

function ScreenRightPanel() {
    let actElem = activeElement.value;
    let myelementsignal = activeScreenElements[actElem] || {};
    let myelement = myelementsignal.value || {};
    const updateDataback = (data) => {
        if (myelement) {
        let temp = JSON.parse(JSON.stringify(myelement));
        
        activeScreenElements[activeElement.peek()].value = {...temp, ...data}; 
        let temp2 = screens[activeScreen.value];
        if(temp2 !== undefined) {
            let key = "mobile_children";
            if(screenViewKey.peek() !== "smartphone") {
                key = "desktop_children";
            }
            temp2[key] = JSON.parse(JSON.stringify(activeScreenElements));
            temp2["_change_type"] = temp2["_change_type"] || "update";
            screens[activeScreen.value] = temp2;

        } 
        } else {
            let view = screenViewKey.value;
            let key = "desktop_style";
            if(view === "smartphone") {
                key = "mobile_style"
            }
            screens[activeScreen.value][key] = data["Style"];
            screens[activeScreen.value]["_change_type"] = screens[activeScreen.value]["_change_type"] || "update";

        }
        MarkScreenAsChanged(activeScreen.value);
        localStorage.setItem("screen_config", JSON.stringify(screens));
        screenElementAdded.value = generateUID();
    }

    return (
        <ConfigFormV3 schema={TemplateElementConfigFormSchema}
         context={{
            "callbacks": {
                "get_query_field_map": get_query_field_map,
                "get_query_names": get_query_names
            }
         }}
         initialValues={myelement} 
        onChange={(data) => {
            updateDataback(data);
        }} onSubmit={
            () => {updateDataback(data)}
        }/>
    );
}
export { ScreenRightPanel };