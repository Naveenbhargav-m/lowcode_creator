import { GetDataFromAPi } from "../api/api_syncer";
import { ApiClient, AppID, PrestClient } from "../states/global_state";
import { generateWorkflowSchema } from "./workflow_helpers";
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
        let workflowSchema = generateWorkflowSchema(flowCopy);
        console.log("workflow schema generated:",workflowSchema);
        flowCopy["workflow_schema"] = JSON.stringify(workflowSchema);
        delete flowCopy["_change_type"];
        flowCopy["flow_data"] = JSON.stringify(flowCopy["flow_data"]);
        flowCopy["edges"] = JSON.stringify(flowCopy["edges"]);
        flowCopy["nodes"] = JSON.stringify(flowCopy["nodes"]);
        console.log("flow copy:",flowCopy);
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

function UpdateWorkflowsBatch(updateflows) {
    if(updateflows === undefined) {
        return;
    }
    if(updateflows.length === 0) {
        return;
    }
    let endpoint = `${AppID}/public/_workflows`
    for(let i=0;i<updateflows.length;i++) {
        let flowID = updateflows[i]["fid"];
        delete updateflows[i]["id"];
        ApiClient.patch(endpoint, {"query": {"where=fid": flowID}, "body": updateflows[i]});
    }
}


function InsertBatchWorkflows(createflows) {
    if(createflows === undefined) {
        return;
    }
    if(createflows.length === 0) {
        return;
    }
    let createflows2 = [];
    for(let i=0;i<createflows.length;i++) {
        let temp = createflows[i];
        delete temp["id"];
        createflows2.push(temp);
    }
    let endPoint = `${AppID}/public/_workflows`;
    ApiClient.post(endPoint,  {"body":createflows2});
}


export {SyncWorkflowData, GetWorkflowDataFromAPI};