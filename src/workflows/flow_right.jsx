import { ConfigFormV3 } from "../components/generic/config_form_v3/config_form";
import { formFocusKey } from "./flow_builder";
import { GetWorkflowFormConfig } from "./workflow_helpers";
import { activeWorkFlow, activeworkFlowBlock, MarkWorkflowAsChanged, SetWorkflowDataBack, workflowsData } from "./workflow_state";



// This approach prevents the keydown event from reaching ReactFlow entirely
const handleFormKeyDown = (e) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
        // Only prevent if the target is actually an input element
        const target = e.target;
        if (target.tagName === 'INPUT' || 
            target.tagName === 'TEXTAREA' || 
            target.contentEditable === 'true' ||
            target.getAttribute('role') === 'textbox') {
            e.stopPropagation();
        }
        e.stopPropagation();
    }
};


function SetBlockData(newdata) {
    let workflowData = activeWorkFlow.value["flow_data"];
    let activeBlockID = activeworkFlowBlock.value["id"] || "";
    let currentBlockData = workflowData[activeBlockID] || {};
    let updatedData = {...currentBlockData, ...newdata};
    currentBlockData = updatedData;
    workflowData[activeBlockID] = currentBlockData;
    let copy = activeWorkFlow.value;
    copy["flow_data"] = workflowData;
    copy["_change_type"] = "update";
    activeWorkFlow.value = {...copy};
    MarkWorkflowAsChanged(activeWorkFlow.value["id"]);
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
    let temp = GetWorkflowFormConfig(activeworkflow, activeblock);
    let data = JSON.parse(JSON.stringify(temp));
    let blockData = data["data"];
    let formRequirements = data["form_requirements"];
    console.log("data for connfig:",data, formRequirements, blockData);


    return (
        <div 
            onFocus={(e) => {formFocusKey.value = true; e.stopPropagation();}}
            onBlur={(e) => {e.stopPropagation();;formFocusKey.value = false}}
            onKeyDown={(e) => {handleFormKeyDown(e)}}
        >
        <ConfigFormV3 schema={formRequirements} initialValues={{...blockData}} 
            onChange={(data) => {SetBlockData(data)}}
            onSubmit={(data) => {SetBlockData(data)}}
        />
    </div>
    );
}