import { useState } from "preact/hooks";
import DynamicIcon from "../components/custom/dynamic_icon";
import { RecordsetList } from "../components/general/recordset_list";
import { generateUID } from "../utils/helpers";
import { activeWorkFlow, activeworkFlowBlock, workflow_datas } from "./workflow_state";
import { blocksRequirements } from "./blocks_requirements";
import { globalConfigs } from "../states/global_state";
import { TextAreaWithPopup } from "../form_builder/configs_view/advanced_form";
import { signal } from "@preact/signals";
import WorkflowFormusage from "../components/generic/workflow_config_form/example/usage";




export function WorkflowConfigForm() {

    return <WorkflowFormusage />;
}