import { addEdge, ConnectionLineType, ConnectionMode, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
import { activeFloweUpdated, activeWorkFlow, HandleWorkFlowBlockDrop, UpdateActiveWorkflowEdges, UpdateActiveWorkflowNodes, workflows, workflowsData } from "./workflow_state";
import { useCallback, useEffect, useState } from "preact/hooks";
import { Condition, End, InsertRow, Start, UpdateRow } from "./block_ components";
import { Drop } from "../components/custom/Drop";
import { SyncButton } from "../components/generic/sync_button";
import { SyncWorkflowData } from "./workflow_api";



let nodeTypes = {
  "insert_row": InsertRow,
  "update_row": UpdateRow,
  "condition": Condition,
  "start": Start,
  "end": End,
};

function FlowBuilder() {
  
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  useEffect(() => {
    const activeFlow = activeWorkFlow.value || { nodes: [], edges: [] };
    if(activeFlow["nodes"] === null || activeFlow["edges"] === null) {
      activeFlow["nodes"] = [];
    }

    if(activeFlow["edges"] === null || activeFlow["edges"] === null) {
      activeFlow["edges"] = [];
    }
    console.log("active flow:", activeFlow);
    setNodes(activeFlow["nodes"]);
    setEdges(activeFlow["edges"]);
  }, [activeFloweUpdated.value]);

  useEffect(() => {
    UpdateActiveWorkflowNodes(nodes);
  }, [nodes]);

  useEffect(() => {
    UpdateActiveWorkflowEdges(edges);
  }, [edges]);

  const onConnect = useCallback(
    (params) => {
      console.log("Connection params:", params); // Debugging log
      setEdges((eds) => addEdge(params, eds));
    },
    [],
  );

  // Default React Flow props for better connection behavior
  const defaultEdgeOptions = {
    animated: true,
    style: {
      stroke: '#555',
      strokeWidth: 2,
    },
  };

  console.log("rendering the flow builder", nodes);
  return (
    <>
      <div style={{display:"flex", "flexDirection": "row-reverse", "justifyContent": "space-between", alignItems:"center"}}>
        <SyncButton 
          title={"sync"} 
          onClick={(e) => {SyncWorkflowData();}} 
          style={{marginRight:"40px", "marginTop":"10px"}}
        />
      </div>
      <Drop onDrop={(data) => {HandleWorkFlowBlockDrop(data)}} dropElementData={{"element":"screen"}} wrapParent={true}>
        <div style={{height:"90vh", width:"70vw"}}>
          <ReactFlow 
            style={{
              "--pico-primary-background": "black", 
              "--pico-primary-hover-background": "black"
            }}
            nodes={nodes} 
            edges={edges} 
            onNodesChange={onNodesChange} 
            onEdgesChange={onEdgesChange} 
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            connectionMode={ConnectionMode.Loose}
            fitView 
            connectionLineStyle={{ stroke: '#aaa', strokeWidth: 2 }}
            connectionLineType={ConnectionLineType.SmoothStep}
            selectNodesOnDrag={false}
            // panOnDrag={[1, 2]} // Only pan when middle or right mouse button is used for dragging
            zoomOnDoubleClick={false} // Disable zoom on double click
          />
        </div>
      </Drop>
    </>
  );
}

export {FlowBuilder};