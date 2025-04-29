import WorkflowConfigForm from "../components/generic/workflow_config_form/example/usage";
import { GetWorkflowFormConfig } from "./workflow_helpers";
import { activeWorkFlow, activeworkFlowBlock } from "./workflow_state";

/*

   sections : [
       id: "",
       "title": "",
       groups: [
           id: "",
          "title": "",
          "fields": [
                {
                  "id": "",
                  "type": "",
                  "description": "",
                  "label": ""
                }
          ],
       ],
   ],
 */


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
    return <WorkflowConfigForm formConfig={formRequirements} initialValues={blockData} />;
}