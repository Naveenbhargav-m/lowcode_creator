import { addEdge, applyEdgeChanges, applyNodeChanges, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
import { activeWorkFlow, HandleWorkFlowBlockDrop } from "./workflow_state";
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
  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  useEffect(() => {
    const activeFlow = activeWorkFlow.value || { nodes: [], edges: [] };
    console.log("active flow:",activeFlow);
    setNodes(activeFlow["nodes"]);
    setEdges(activeFlow["edges"]);
  }, [activeWorkFlow.value]);

      // Effect to call other functions when nodes or edges change
      useEffect(() => {
        // Call your function to update the config of workflows here
        console.log("called the nodes updation callback", nodes);
        // updateWorkflowConfig(nodes, edges);
      }, [nodes]);

      useEffect(() => {
        console.log("called the edges updation callback", edges);
      },[edges])

      const onConnect = useCallback(
        (params) => {
          console.log("Connection params:", params); // Debugging log
          setEdges((eds) => addEdge(params, eds));
        },
        [],
      );


  return (
    <Drop onDrop={(data) => {HandleWorkFlowBlockDrop(data)}} dropElementData={{"element":"screen"}} wrapParent={true}>
    <div style={{height:"90vh", width:"70vw"}}>
      <ReactFlow 
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