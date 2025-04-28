import { GetDataFromAPi } from "../api/api_syncer";
import { AppID, PrestClient } from "../states/global_state";
import { workflownames, workflows, workflowsData } from "./workflow_state";


function GetWorkflowDataFromAPI() {
    GetDataFromAPi("_workflows").then((myflows) => {
        if(myflows === undefined) {
            return;
        }
        if(myflows.length === undefined) {
            return;
        }
        let temp = [];
        let namesAndIDs = [];
        for(var i=0;i<myflows.length;i++) {
            let  curflow = workflows[i];
            let data = curflow["flow_data"];
            let id = curflow["id"];
            workflowsData[id] = data;
            delete curflow["flow_data"];
            temp.push(curflow);
            let obj = {
                "id": id,
                "name": curflow["name"]
            };
            namesAndIDs.push(obj);
        }
        workflows.value = [...temp];
        workflownames.value = [...namesAndIDs];
        return;
    })
}


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


export {SyncWorkflowData, GetWorkflowDataFromAPI};