import { addEdge, applyEdgeChanges, applyNodeChanges, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
import { activeWorkFlow } from "./workflow_state";
import { useCallback, useEffect, useState } from "preact/hooks";





function FlowBuilder() {
  
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  useEffect(() => {
    const activeFlow = activeWorkFlow.value || { nodes: [], edges: [] };
    console.log("active flow:",activeFlow);
    setNodes(activeFlow["nodes"]);
    setEdges(activeFlow["edges"]);
  }, [activeWorkFlow.value]);


  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
      console.log("params:",params);
    },
    [setEdges]
  );



  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange} 
        onConnect={onConnect}
        fitView 
      />
    </div>
  );
}


export {FlowBuilder};