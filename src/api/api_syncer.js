import { AppID, PrestClient } from "../states/global_state";



function SyncData(key, forms) {
    console.log("called syncData:", key, forms);

    if (!forms) {
        return;
    }

    // Ensure forms is always an array
    if (!Array.isArray(forms)) {
        let temp = [];
        Object.keys(forms).map((key) => {
            temp.push(forms[key]);
        });
        forms = temp;
    }

    let createFlows = [];
    let updateFlows = [];
    console.log("form before the loop:",forms);
    for (let i = 0; i < forms.length; i++) {
        let curFlow = { ...forms[i] }; // Create a shallow copy to avoid modifying original object
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
    console.log("insert data:", createFlows);
    console.log("update data:", updateFlows);
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
        "_templates": { "template_name": "text", "configs": "json", "tags": "text[]" },
        "_components": { "component_name": "text", "configs": "json" },
        "_themes": { "theme_name": "text", "dark_theme": "json", "light_theme": "json", "is_default": "bool" },
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

function ProcessSignalsToWrite(variables) {
    let signals = JSON.stringify(variables["signals"]);
    let body = [{"signals": signals, "id": variables["id"]}];
    return body;
}

function ProcessScreenDataToWrite(screens) {
    let resp = [];
    for(let i=0;i<screens.length;i++) {
        let temp = {};
        let cur = screens[i];
        temp["screen_name"] = cur["screen_name"];
        temp["id"] = cur["id"];
        delete cur["screen_name"];
        let json = JSON.stringify(cur);
        temp["configs"] = json;
        resp.push(temp);
    }
    return resp;
}

function ProcessScreenDataToRead(data) {
    let resp = [];
    for(let i=0;i<data.length;i++) {
        let cur = data[i];
        let obj = {};
        obj["screen_name"] = cur["screen_name"];
        let configs = JSON.parse(cur["configs"]);
        let newobj = {...obj, ...configs};
        resp.push(newobj);
    }
    return resp;
}



function ProcessFormsDataToWrite(forms) {
    let resp = [];
    for(let i=0;i<forms.length;i++) {
        let temp = {};
        let cur = forms[i];
        temp["form_name"] = cur["form_name"];
        temp["id"] = cur["id"];
        let json = JSON.stringify(cur);
        temp["configs"] = json;
        resp.push(temp);
    }
    return resp;
}

function ProcessFormsDataToRead(data) {
    let resp = [];
    for(let i=0;i<data.length;i++) {
        let cur = data[i];
        let obj = {};
        obj["form_name"] = cur["form_name"];
        let configs = JSON.parse(cur["configs"]);
        let newobj = {...obj, ...configs};
        resp.push(newobj);
    }
    return resp;
}



export {SyncData, GetDataFromAPi};