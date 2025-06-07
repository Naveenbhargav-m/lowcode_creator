import { ConfigFormV3 } from "../components/generic/config_form_v3/config_form";
import { fieldsMap, global_workflows } from "../states/global_repo";
import { getBlockNames, getBlockWithInputs } from "../states/helpers";
import { FormButtonSchema, formFieldSchema } from "./configs/form_options";
import { currentForm, currentFormConfig, formActiveElement, formBuilderView, forms, MarkFormAsChanged } from "./form_builder_state";
import { GetFormField, UpdateFormField } from "./utilities";

function get_workflow_fields(formValues, fieldconfig, context) {

    let workflowID = formValues?.submit_actions?.worflow_id ?? "";
    let formID = currentForm.value;
    let fields = getBlockWithInputs("workflows", workflowID);
    let inputs2 = fields["inputs"] || [];
    let view = formBuilderView.value;
    let device = "mobile_children";
    if (view === "desktop") {
        device = "desktop_children"
    }
    let formfields = getBlockWithInputs("forms", formID, device);
    let formfieldsinner = formfields.inputs || {};
    let innerobj = formfieldsinner["fields"] || [];
    return {
        "inputs": innerobj,
        "workflow_fields": inputs2
    };
}

function get_workflow_names( formValues, fieldconfig, context) {
    let blocknames = getBlockNames("workflows");
    return blocknames;
}

function GetActiveElementConifg(id) {
    console.log("id , current form config:",id, currentFormConfig.value);
    if(id === "submit" || id === "form") {
        let curform = currentForm.value;
        let formdata = forms[curform];
        let submitactions = formdata["submit_actions"] || {};
        let activeView = formBuilderView.value;
        let config = {
            "submit_actions": submitactions,
        };
        if(activeView === "smartphone") {
            config["style"] = formdata["mobile_style"];
        } else if(activeView === "desktop") {
            config["style"] = formdata["desktop_style"];
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
        let curformid = currentForm.value;
        let formdata = forms[curformid];
        let existing = formdata;
        let submitActions = existing["submit_actions"] || {};
        let newdata = {...submitActions, ...data["submit_actions"]};
        existing["submit_actions"] = newdata;
        forms[curformid] = {...existing};
        MarkFormAsChanged(currentForm.value);
        return;
    }
    let fields = currentFormConfig.value["fields"] || [];
    let currfield = GetFormField(fields, activeID);
    let newfield = {...currfield, ...data};
    let newarr = UpdateFormField(fields, newfield, activeID);
    let curconfig = currentFormConfig.value;
    curconfig["fields"] = newarr;
    currentFormConfig.value = {...curconfig};
    let curform = forms[currentForm.value];
    let activeView = formBuilderView.value;
    if(activeView === "smartphone") {
        curform["mobile_children"] = currentFormConfig.value;
    } else if(activeView === "desktop") {
        curform["desktop_children"] = currentFormConfig.value;
    }
    forms[currentForm.value] = curform;
    MarkFormAsChanged(currentForm.value);
    return;
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