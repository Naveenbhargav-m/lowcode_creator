import { AppID, PrestClient } from "../states/global_state";
import { ProcessFormsDataToWrite, ProcessScreenDataToWrite, ProcessSignalsToWrite, ProcessTemplatesDataTOWrite, ProcessThemesDataToWrite } from "./data_functions";



function SyncData(key, forms) {
    if (!forms) {
        return;
    }
    if (!Array.isArray(forms)) {
        let temp = [];
        Object.keys(forms).map((key) => {
            temp.push(forms[key]);
        });
        forms = temp;
    }

    let createFlows = [];
    let updateFlows = [];
    for (let i = 0; i < forms.length; i++) {
        let curFlow = { ...forms[i] };
        let operation = curFlow["_change_type"] || "";
        delete curFlow["_change_type"];
        console.log("operation:", operation);
        if (operation === "add") {
            createFlows.push(curFlow);
        } else if (operation === "update") {
            updateFlows.push(curFlow);
        }
    }
    createFlows = ProcessDataToWrite(key,createFlows);
    updateFlows = ProcessDataToWrite(key, updateFlows);
    if (createFlows.length) {
        InsertBatchData(key, createFlows);
    }

    if (updateFlows.length) {
        UpdateBatchData(key, updateFlows);
    }
}


function UpdateBatchData(key,forms) {
    console.log("called UpdateBatchData:", key, forms);
    if(forms === undefined) {
        return;
    }
    if(forms.length === 0) {
        return;
    }
    let endpoint = `/${AppID}/public/${key}`
    for(let i=0;i<forms.length;i++) {
        let formID = forms[i]["id"];
        delete forms[i]["id"];
        PrestClient.patch(endpoint, {"query": {"id": formID}, "body": forms[i]});
    }
}


function InsertBatchData(key,forms) {
    console.log("called Insert Batch Data:", key, forms);
    if(forms === undefined) {
        return;
    }
    if(forms.length === 0) {
        return;
    }
    let endPoint = `/batch/${AppID}/public/${key}`;
    let temp = [];
    for(let i=0;i<forms.length;i++) {
        let temp1 = forms[i];
        delete temp1["id"];
        temp.push(temp1);

    }
    PrestClient.post(endPoint,  {"body":forms});
}

async function GetDataFromAPi(key) {
    let endpoint = `/${AppID}/public/${key}`;
    try {
        let response = await PrestClient.get(endpoint);
        return response || [];  // Always return an array
    } catch (error) {
        console.error(`Error fetching data for key "${key}":`, error);
        return [];  // Return empty array instead of breaking the app
    }
}


function ProcessDataToWrite(tableName, data) {
    let tableKeysMap = {
        "_screens": ProcessScreenDataToWrite,
        "_forms": ProcessFormsDataToWrite,
        "_global_states": ProcessSignalsToWrite,
        "_templates": ProcessTemplatesDataTOWrite,
        "_themes": ProcessThemesDataToWrite,
        "_components": { "component_name": "text", "configs": "json" },
        "_tables": { "tables_data": "json" },
        "_views": { "views_data": "json" },
        "_workflows": { "nodes": "json", "edges": "json", "flow_data": "json", "name": "text" },
        "_triggers": { "triggers_data": "json" }
    };    
    let respData = [];
    let tabelFunc = tableKeysMap[tableName];
    respData = tabelFunc(data);
    return respData;
}



export {SyncData, GetDataFromAPi};