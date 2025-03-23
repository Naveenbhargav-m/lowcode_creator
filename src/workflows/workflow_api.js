import { AppID, PrestClient } from "../states/global_state";



function SyncWorkflowData(workflows, workflowsData) {
    if(workflows === undefined) {
        return;
    }
    let createFlows = [];
    let updateFlows = [];
    for(let i=0;i<workflows.length;i++) {
        let curFlow = workflows[i];
        let data = workflowsData[curFlow["id"]] || {};
        let operation = curFlow["_change_type"] || "";
        let dataOperation = data["_change_type"] || "";
        if(operation === "") {
            if(dataOperation === "update") {
                operation = "update";
            }
        }
        delete data["_change_type"];
        curFlow["flow_data"] = data;
        delete curFlow["_change_type"];

        if(operation === "add") {
            createFlows.push(curFlow);
        } else if(operation === "update") {
            updateFlows.push(curFlow);
        }
    }
    InsertBatchWorkflows();
    UpdateWorkflowsBatch();
}

function UpdateWorkflowsBatch(workflows) {
    if(workflows === undefined) {
        return;
    }
    if(workflows.length === 0) {
        return;
    }
    let endpoint = `/${AppID}/public/workflows`
    for(let i=0;i<workflows.length;i++) {
        let flowID = workflows[i]["id"];
        delete workflows[i]["id"];
        PrestClient.patch(endpoint, {"query": {"id": flowID}, "body": workflows[i]});
    }
}


function InsertBatchWorkflows(workflows) {
    if(workflows === undefined) {
        return;
    }
    if(workflows.length === 0) {
        return;
    }
    let endPoint = `/batch${AppID}/public/workflows`;
    PrestClient.post(endPoint,  {"body":workflows});
}


export {SyncWorkflowData};