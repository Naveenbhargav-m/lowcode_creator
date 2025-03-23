import { AppID, PrestClient } from "../states/global_state";



function SyncData(forms) {
    if(forms === undefined) {
        return;
    }
    let createFlows = [];
    let updateFlows = [];
    for(let i=0;i<forms.length;i++) {
        let curFlow = forms[i];
        let operation = curFlow["_change_type"] || "";
        delete curFlow["_change_type"];

        if(operation === "add") {
            createFlows.push(curFlow);
        } else if(operation === "update") {
            updateFlows.push(curFlow);
        }
    }
    InsertBatchData();
    UpdateBatchData();
}

function UpdateBatchData(forms) {
    if(forms === undefined) {
        return;
    }
    if(forms.length === 0) {
        return;
    }
    let endpoint = `/${AppID}/public/forms`
    for(let i=0;i<forms.length;i++) {
        let formID = forms[i]["id"];
        delete forms[i]["id"];
        PrestClient.patch(endpoint, {"query": {"id": formID}, "body": forms[i]});
    }
}


function InsertBatchData(forms) {
    if(forms === undefined) {
        return;
    }
    if(forms.length === 0) {
        return;
    }
    let endPoint = `/batch${AppID}/public/forms`;
    PrestClient.post(endPoint,  {"body":forms});
}


export {SyncData};