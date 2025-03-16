import { addEdge, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
import { activeFloweUpdated, activeWorkFlow, HandleWorkFlowBlockDrop, UpdateActiveWorkflowEdges, UpdateActiveWorkflowNodes } from "./workflow_state";
import { useCallback, useEffect, useState } from "preact/hooks";
import { Condition, End, InsertRow, Start, UpdateRow } from "./block_ components";
import { Drop } from "../components/custom/Drop";



let nodeTypes = {
  "insert_row": InsertRow,
  "update_row": UpdateRow,
  "condition": Condition,
  "start": Start,
  "end": End,
};

function FlowBuilder() {
  
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodes, setNodes , onNodesChange] = useNodesState([]);

  useEffect(() => {
    const activeFlow = activeWorkFlow.value || { nodes: [], edges: [] };
    console.log("active flow:",activeFlow);
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

  console.log("rendering the flow builder", nodes);
  return (
    <Drop onDrop={(data) => {HandleWorkFlowBlockDrop(data)}} dropElementData={{"element":"screen"}} wrapParent={true}>
    <div style={{height:"90vh", width:"70vw"}}>
      <ReactFlow 
      style={{"--pico-primary-background":"black", "--pico-primary-hover-background": "black"}}
        nodes={nodes} 
        edges={edges} 
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange} 
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView 
      />
    </div>
    </Drop>
  );
}

export {FlowBuilder};