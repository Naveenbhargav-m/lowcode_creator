import { GetDataFromAPi } from "../api/api_syncer";
import { AppID, PrestClient } from "../states/global_state";
import { activeWorkFlow, workflownames, workflows, workflowsData } from "./workflow_state";


function NormalizeWorkflows() {
    let flows = workflows.value;
    let newflows = [];
    for(var i=0;i<flows.length;i++) {
        let curflow = flows[i];
        delete curflow["_change_type"];
        newflows.push(curflow); 
    }
    workflows.value = [...newflows];
    let activeExists = activeWorkFlow.value;
    delete activeExists["_change_type"];
    activeWorkFlow.value = {...activeExists};
}
function GetWorkflowDataFromAPI() {
    GetDataFromAPi("_workflows").then((myflows) => {
        console.log("called load workflows:",myflows);
        if(myflows === undefined) {
            return;
        }
        if(myflows.length === undefined) {
            return;
        }
        let temp = [];
        let namesAndIDs = [];
        for(var i=0;i<myflows.length;i++) {
            let  curflow = myflows[i];
            let data = curflow["flow_data"];
            let id = curflow["fid"];
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


function SyncWorkflowData() {
    let workflowsToSync = workflows.value;
    let workflowsDataToSync = workflowsData.value;
    console.log("called sync on workflows:", workflowsToSync, workflowsDataToSync);
    
    if(!workflowsToSync || workflowsToSync.length === 0) {
        return;
    }
    
    let createFlows = [];
    let updateFlows = [];
    
    for(let i=0; i<workflowsToSync.length; i++) {
        let curFlow = workflowsToSync[i];
        let data = workflowsDataToSync[curFlow["id"]] || {};
        let operation = curFlow["_change_type"] || "";
        let dataOperation = data["_change_type"] || "";
        
        if(operation === "" && dataOperation === "update") {
            operation = "update";
        }
        
        // Create a clean copy for API submission
        let flowCopy = { ...curFlow };
        let dataCopy = { ...data };
        delete dataCopy["_change_type"];
        flowCopy["flow_data"] = dataCopy;
        delete flowCopy["_change_type"];
        flowCopy["flow_data"] = JSON.stringify(flowCopy["flow_data"]);
        flowCopy["edges"] = JSON.stringify(flowCopy["edges"]);
        flowCopy["nodes"] = JSON.stringify(flowCopy["nodes"]);
        if(operation === "create") {  // Changed from "add" to "create"
            createFlows.push(flowCopy);
        } else if(operation === "update") {
            updateFlows.push(flowCopy);
        }

    }
    
    if(createFlows.length > 0) {
        console.log("Creating workflows:", createFlows);
        InsertBatchWorkflows(createFlows);
    }
    
    if(updateFlows.length > 0) {
        console.log("Updating workflows:", updateFlows);
        UpdateWorkflowsBatch(updateFlows);
    }
    NormalizeWorkflows();
}

function UpdateWorkflowsBatch(workflows) {
    if(workflows === undefined) {
        return;
    }
    if(workflows.length === 0) {
        return;
    }
    let endpoint = `${AppID}/public/_workflows`
    for(let i=0;i<workflows.length;i++) {
        let flowID = workflows[i]["fid"];
        delete workflows[i]["id"];
        PrestClient.patch(endpoint, {"query": {"fid": flowID}, "body": workflows[i]});
    }
}


function InsertBatchWorkflows(workflows) {
    if(workflows === undefined) {
        return;
    }
    if(workflows.length === 0) {
        return;
    }
    let endPoint = `batch/${AppID}/public/_workflows`;
    PrestClient.post(endPoint,  {"body":workflows});
}


export {SyncWorkflowData, GetWorkflowDataFromAPI};