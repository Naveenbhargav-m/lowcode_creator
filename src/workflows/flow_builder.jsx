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


// function FlowBuilder() {
//   console.log("nodes:",activeWorkFlow.value["nodes"]);
//   console.log("edges:",activeWorkFlow.value["edges"]);
//   const onNodesChange = useCallback((nodes) => {
//       console.log("updated nodes:",nodes);
//       UpdateActiveWorkflowNodes(nodes);
//   }, []);

//   const onEdgesChange = useCallback((edges) => {
//     UpdateActiveWorkflowEdges(edges);
//   }, []);

//   const onConnect = useCallback((params) => {
//       console.log("on connect params:",params);
//   }, []);


//   return (
//     <Drop
//       onDrop={(data) => HandleWorkFlowBlockDrop(data)}
//       dropElementData={{ element: "screen" }}
//       wrapParent={true}
//     >
//       <div style={{ height: "90vh", width: "70vw" }}>
//         <ReactFlow
//           nodes={activeWorkFlow.value.nodes}
//           edges={activeWorkFlow.value.edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           nodeTypes={nodeTypes}
//           fitView
//         />
//       </div>
//     </Drop>
//   );
// }


export {FlowBuilder};