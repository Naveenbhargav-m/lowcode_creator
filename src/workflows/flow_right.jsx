import { ConfigFormV3 } from "../components/generic/config_form_v3/config_form";
import { GetWorkflowFormConfig } from "./workflow_helpers";
import { activeWorkFlow, activeworkFlowBlock, SetWorkflowDataBack } from "./workflow_state";

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
    let config = data["config"];
    let blockData = data["data"];
    let formRequirements = data["form_requirements"];
    console.log("data for connfig:",data, formRequirements, blockData);
    return (
        <ConfigFormV3 schema={formRequirements} initialValues={{}} 
        onChange={(data) => {console.log("data changed:",data);}}
        onSubmit={(data) => {console.log("data submitted:",data);}}

        />
    );
}