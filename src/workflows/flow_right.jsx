import { ConfigFormV3 } from "../components/generic/config_form_v3/config_form";
import { GetWorkflowFormConfig } from "./workflow_helpers";
import { activeWorkFlow, activeworkFlowBlock, SetWorkflowDataBack, workflowsData } from "./workflow_state";

function SetBlockData(newdata) {
    let workflowData = activeWorkFlow.value["flow_data"];
    let activeBlockID = activeworkFlowBlock.value["id"] || "";
    let currentBlockData = workflowData[activeBlockID] || {};
    let updatedData = {...currentBlockData, newdata};
    currentBlockData = updatedData;
    workflowData[activeBlockID] = currentBlockData;
    let copy = activeWorkFlow.value;
    copy["flow_data"] = workflowData;
    activeWorkFlow.value = {...copy};
}   

export function WorkflowConfigFormPanel() {
    let activeblock = activeworkFlowBlock.value;
    let activeworkflow = activeWorkFlow.value;
    let activeBlockKeys = Object.keys(activeblock);
    let activeWorkFlowKeys = Object.keys(activeworkflow);
    console.log("test data:", activeBlockKeys, activeWorkFlowKeys, activeblock, activeworkflow);
    if(activeBlockKeys.length === 0 || activeWorkFlowKeys.length === 0) {
        return <div> Pick a block</div>
    }
    let data = GetWorkflowFormConfig(activeworkflow, activeblock);
    let blockData = data["data"];
    let formRequirements = data["form_requirements"];
    console.log("data for connfig:",data, formRequirements, blockData);


    return (
        <ConfigFormV3 schema={formRequirements} initialValues={{}} 
        onChange={(data) => {console.log("data changed:",data);}}
        onSubmit={(data) => {SetBlockData(data)}}

        />
    );
}