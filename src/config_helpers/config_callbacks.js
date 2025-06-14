import { getBlockNames, getBlockWithInputs } from "../states/helpers";
import { activeWorkFlow } from "../workflows/workflow_state";

function GetCurrentWorkflowInputs(formvalues, fieldConfig, context) {
    let curflow = activeWorkFlow.value;
    let inputs = curflow["inputs"];
    return inputs;
}

function GetTableFields(formvalues, fieldConfig, context) {
    let table = formvalues["input_mapping"]["table"] || "";
    let fields = getBlockWithInputs("tables", table);
    let table_fields = fields.inputs;
    for(var i=0;i<table_fields.length;i++) {
        let new1 = {...table_fields[i]};
        new1["label"] = new1["name"];
        new1["value"] = new1["id"];
        table_fields[i] = new1;
    }
    let inputs = GetCurrentWorkflowInputs(formvalues, fieldConfig, context);
    let inputobjs = [];
    for(var j=0;j<inputs.length;j++) {
        let obj = {
            "name": inputs[j],
            "id": inputs[j],
            "value": inputs[j],
            "label": inputs[j]
        };
        inputobjs.push(obj);
    }
    return {
        "source_fields": inputobjs,
        "target_fields": table_fields
    };
}

function GetQuerySelectFields(formvalues, fieldConfig, context) {
    let table = formvalues["input_mapping"]["table"] || "";
    let fields = getBlockWithInputs("tables", table);
    let table_fields = fields.inputs;
    for(var i=0;i<table_fields.length;i++) {
        let new1 = {...table_fields[i]};
        new1["label"] = new1["name"];
        new1["value"] = new1["id"];
        table_fields[i] = new1;
    }
    let inputs = GetCurrentWorkflowInputs(formvalues, fieldConfig, context);
    let inputobjs = [];
    for(var j=0;j<inputs.length;j++) {
        let obj = {
            "name": inputs[j],
            "id": inputs[j],
            "value": inputs[j],
            "label": inputs[j]
        };
        inputobjs.push(obj);
    }
    return {
        "source_fields": inputobjs,
        "target_fields": table_fields
    };
}
function GetQueries(formValues, fieldConfig, context) {
    let queries = getBlockNames("queries");
    return queries;
}

function GetQueryInputs(formValues, fieldConfig, context) {
    let queryid = formValues["input_mapping"]["query_block"] || "";
    let queryfields = getBlockWithInputs("queries", queryid);
    let inputsarr = queryfields["inputs"] || [];
    for(var i=0;i<inputsarr.length;i++) {
        let cur = inputsarr[i];
        cur["name"] = cur["label"];
        inputsarr[i] = cur;
    }
    let table = formValues["input_mapping"]["table"] || "";
    let fields = getBlockWithInputs("tables", table);
    let table_fields = fields.inputs;
    for(var i=0;i<table_fields.length;i++) {
        let new1 = {...table_fields[i]};
        new1["label"] = new1["name"];
        new1["value"] = new1["id"];
        table_fields[i] = new1;
    }
    return {
        "source_fields": inputsarr,
        "target_fields": table_fields
    };
}


export {
    GetCurrentWorkflowInputs, GetQueries, GetQueryInputs, GetTableFields, GetQuerySelectFields
};