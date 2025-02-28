import { ReactFlow } from "@xyflow/react";
import { activeWorkFlow } from "./workflow_state";





function FlowBuilder() {
  let activeFlow = activeWorkFlow.value || {};
  let nodes = activeFlow["nodes"] || [];
  let edges = activeFlow["edges"] || [];
  return (
    <div style={{height:"100%" , width:"100%"}}>
      <ReactFlow nodes={nodes} edges={edges} fitView/>
    </div>
  );
}


export {FlowBuilder};