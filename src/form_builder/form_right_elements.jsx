import { ConfigFormV3 } from "../components/generic/config_form_v3/config_form";
import { fieldsMap, global_workflows } from "../states/global_repo";
import { FormButtonSchema, formFieldSchema } from "./configs/form_options";
import { currentForm, currentFormConfig, formActiveElement, formBuilderView, MarkFormAsChanged } from "./form_builder_state";
import { GetFormField, UpdateFormField } from "./utilities";

function get_workflow_fields(formValues, fieldconfig, context) {

    let screenelement = currentFormConfig.value["fields"] || [];
    let inputs = [];
    // if(screenelement.length === 0) {
    //     for(var i=0;i<5;i++) {
    //         var temp = {
    //             "label": `inputs ${i}`,
    //             "id": `inputs ${i}`,
    //             "value": `inputs ${i}`
    //         };
    //         inputs.push(temp);
    //     }
    // } else {
    //     inputs = [...screenelement];
    // }

    // let queryid = formValues?.submit_actions?.worflow_id ?? "";

    // let queryFields = fieldsMap?.workflows?.[queryid] || [];
    let queryFields = [];
    for(var i=0;i<5;i++) {
        var temp = {
            "label": `inputs ${i}`,
            "id": `inputs ${i}`,
            "value": `inputs ${i}`
        };
        var queryObj = {
            "label": `query ${i}`,
            "id": `query ${i}`,
            "value": `query ${i}`
        };
        inputs.push(temp);
        queryFields.push(queryObj);
    }
    console.log("get query field map is called:", queryFields, inputs);

    return {
        "inputs": inputs,
        "workflow_fields": queryFields
    };
}

function get_workflow_names( formValues, fieldconfig, context) {
    let queries = Object.keys(global_workflows);
    let query_options = [];
    for(var i=0;i<queries.length;i++) {
        let name = global_workflows[queries[i]]["name"] || queries[i];
        let obj = {"value": queries[i], "label": name};
        query_options.push(obj);
    }
    console.log("get workflows names called:",query_options);
    return query_options;
}

function GetActiveElementConifg(id) {
    console.log("id , current form config:",id, currentFormConfig.value);
    if(id === "submit" || id === "form") {
        let submitactions = currentFormConfig.value["submit_actions"] || {};
        let activeView = formBuilderView.value;
        let config = {
            "submit_actions": submitactions,
        };
        if(activeView === "smartphone") {
            config["style"] = currentFormConfig.value["mobile_style"];
        } else if(activeView === "smartphone") {
            config["style"] = currentFormConfig.value["desktop_style"];
        }
        let schema = FormButtonSchema;
        return {
            "config": config,
            "schema": schema,
        };
    }
    let fields = currentFormConfig.value["fields"] || [];
    console.log("fields : ", fields);
    let config = GetFormField(fields, id);
    console.log("config output:",config);
    if (config === undefined) {
        config = {};
    }
    return {
        "config": config,
        "schema": formFieldSchema
    };
}


function HandleDataChange(data) {
    let activeID = formActiveElement.value;
    if(activeID === "submit" || activeID === "form") {
        let existing = currentFormConfig.value;
        let submitActions = existing["submit_actions"] || {};
        let newdata = {...submitActions, ...data};
        existing["submit_actions"] = newdata;
        currentFormConfig.value = {...existing};
        MarkFormAsChanged(currentForm.value);
    }
    let fields = currentFormConfig.value["fields"] || [];
    let currfield = GetFormField(fields, activeID);
    let newfield = {...currfield, ...data};
    let newarr = UpdateFormField(fields, newfield, activeID);
    let curconfig = currentFormConfig.value;
    curconfig["fields"] = newarr;
    currentFormConfig.value = {...curconfig};
    MarkFormAsChanged(currentForm.value);
}



export function FormBuilderRightPanel() {
    let activeElementID = formActiveElement.value;
    let resp = GetActiveElementConifg(activeElementID);
    let config = resp["config"];
    let schema = resp["schema"];
    return (
        <div>
           <ConfigFormV3 
           context={{
                "callbacks": {
                    "get_workflow_names": get_workflow_names,
                    "get_workflow_fields": get_workflow_fields
                }
           }}
           initialValues={{...config}} 
           schema={{...schema}} onChange=
           {
            (data) => {
            HandleDataChange(data);
           }} 
           onSubmit={
            (data) => {HandleDataChange(data)}
           }/>
        </div>
    );
}