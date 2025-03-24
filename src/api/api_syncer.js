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


export {SyncData};