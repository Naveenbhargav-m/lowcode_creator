import { blockFormRequirements, blocksRequirements } from "./blocks_requirements";
import { activeWorkFlow, activeworkFlowBlock, workflowsData } from "./workflow_state";



function GetWorkflowFormConfig(activeworkflow, activeblock) {
    let response = {};
    let flowdata = workflowsData.value;
    let id = activeworkflow["id"] || "";
    let blockID = activeblock["id"] || "";
    let currentWorkflowData = flowdata[id] || {};
    let currentBlockData = currentWorkflowData[blockID] || {};
    response["data"] = currentBlockData;
    let blockType = activeblock["type"];
    let requirements = blocksRequirements[blockType];
    let formRequirements = blockFormRequirements[blockType]; 
    response["config"] = requirements;
    response["form_requirements"] = formRequirements;
    return response;
}

export {GetWorkflowFormConfig};