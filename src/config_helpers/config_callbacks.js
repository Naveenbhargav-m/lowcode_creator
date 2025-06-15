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

function GetQueryID(formValues, customPaths = []) {
    if (!formValues || typeof formValues !== 'object') {
        return "";
    }

    const searchPaths = [
        ...customPaths,
        "input_mapping.query_block",
        "configs.data_source.data_query"
    ];

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((current, key) => {
            return current?.[key];
        }, obj);
    };

    for (const path of searchPaths) {
        const value = getNestedValue(formValues, path);
        if (value && typeof value === 'string') {
            return value;
        }
    }

    return "";
}

function GetQueryInputs(formValues, fieldConfig, context) {
    let queryid = GetQueryID(formValues);
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


function GetQueryInputsOnly(formValues, fieldConfig, context) {
    let queryid = GetQueryID(formValues);
    let queryfields = getBlockWithInputs("queries", queryid);
    debugger;
    let inputsarr = queryfields["inputs"] || [];
    for(var i=0;i<inputsarr.length;i++) {
        let cur = inputsarr[i];
        cur["name"] = cur["label"];
        inputsarr[i] = cur;
    }
    return {
        "source_fields": inputsarr,
        "target_fields": [],
    };
}

function GetQueryOutputsOnly(formValues, fieldConfig, context) {
    let queryid = GetQueryID(formValues);
    let queryfields = getBlockWithInputs("queries", queryid);
    let rawdata = queryfields["raw_data"] || {};
    let outputs = rawdata["output_params"] || [];
    let outarr = [];
    for(var i=0;i<outputs.length;i++) {
        let cur = outputs[i];
        var obj = {
            "id": cur,
            "label": cur,
            "name": cur,
            "value": cur
        };
        outarr.push(obj);
    };
    let targetFields = [];
    if(context !== undefined) {
        let existingData = context["data"] || {};
        targetFields = existingData["target_fields"] || [];
    }
    return {
        "source_fields": outarr,
        "target_fields": targetFields,
    };
}

function GetQueryInputsAndOutputs(formValues, fieldConfig, context) {
    let queryid = GetQueryID(formValues);
    let queryfields = getBlockWithInputs("queries", queryid);
    let inputsarr = queryfields["inputs"] || [];
    for(var i=0;i<inputsarr.length;i++) {
        let cur = inputsarr[i];
        cur["name"] = cur["label"];
        inputsarr[i] = cur;
    }

    let rawdata = queryfields["raw_data"] || {};
    let outputs = rawdata["output_params"] || [];

    let outarr = [];
    for(var i=0;i<outputs.length;i++) {
        let cur = outputs[i];
        var obj = {
            "id": cur,
            "label": cur,
            "name": cur,
            "value": cur
        };
        outarr.push(obj);
    }
    return {
        "source_fields": inputsarr,
        "target_fields": outarr,
    };
}

function GetParentData(formValues, fieldConfig, context) {
    
}
export {
    GetCurrentWorkflowInputs, GetQueries, GetQueryInputs, GetTableFields, GetQuerySelectFields,
    GetQueryOutputsOnly,GetQueryInputsOnly, GetQueryInputsAndOutputs
};