import { addEdge, ConnectionLineType, ConnectionMode, ReactFlow, useEdgesState, useNodesState, Controls, Background, Panel } from "@xyflow/react";
import { activeFloweUpdated, activeWorkFlow, apiError, HandleWorkFlowBlockDrop, HasUnsavedChanges, isLoading, LoadWorkflows, SyncActiveWorkflow, SyncAllUnsavedWorkflows, unsavedWorkflows, UpdateActiveWorkflowEdges, UpdateActiveWorkflowNodes, workflownames, workflows, workflowsData } from "./workflow_state";
import { useCallback, useEffect, useState, useRef } from "preact/hooks";
import { CodeBlock, Condition, CreateTopic, DeleteRow, DeleteTopic, End, HttpCall, InsertRow, Loop, ReadRow, Start, SubscribeTopic, UnsubscribeTopic, UpdateRow } from "./block_ components";
import { Drop } from "../components/custom/Drop";
import { SyncButton } from "../components/generic/sync_button";
import { SyncWorkflowData } from "./workflow_api";
import { ModernSyncControls } from "../screen_builder/screen_components";

let nodeTypes = {
  "insert_row": InsertRow,
  "update_row": UpdateRow,
  "code_block": CodeBlock,
  "condition": Condition,
  "start": Start,
  "end": End,
  "read_rows": ReadRow,
  "delete_rows": DeleteRow,
  "loop": Loop,
  "http_call": HttpCall,
  "subscribe_topic": SubscribeTopic,
  "unsubscribe_topic": UnsubscribeTopic,
  "create_topic": CreateTopic,
  "delete_topic": DeleteTopic,
};

function FlowBuilder() {
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [selectedElements, setSelectedElements] = useState({ nodes: [], edges: [] });
  const reactFlowInstance = useRef(null);

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
      console.log("Connection params:", params);
      setEdges((eds) => addEdge(params, eds));
    },
    [],
  );

  // Handle node selection
  const onSelectionChange = useCallback(
    (elements) => {
      setSelectedElements(elements);
    },
    []
  );

  // Delete selected elements (nodes and edges)
  const deleteSelectedElements = useCallback(() => {
    // Delete selected edges
    if (selectedElements.edges && selectedElements.edges.length > 0) {
      setEdges((eds) => eds.filter(e => !selectedElements.edges.some(se => se.id === e.id)));
    }
    
    // Delete selected nodes
    if (selectedElements.nodes && selectedElements.nodes.length > 0) {
      const nodesToRemove = selectedElements.nodes.map(node => node.id);
      setNodes((nds) => nds.filter(node => !nodesToRemove.includes(node.id)));
      
      // Also remove any connected edges
      setEdges((eds) => eds.filter(
        edge => !nodesToRemove.includes(edge.source) && !nodesToRemove.includes(edge.target)
      ));
    }
  }, [selectedElements, setEdges, setNodes]);

  // Handle keyboard shortcuts
  const onKeyDown = useCallback(
    (event) => {
      // Delete on Delete or Backspace key
      if ((event.key === 'Delete' || event.key === 'Backspace') && 
          (selectedElements.nodes.length > 0 || selectedElements.edges.length > 0)) {
        event.preventDefault();
        deleteSelectedElements();
      }
    },
    [deleteSelectedElements, selectedElements]
  );

  // Register keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  // Store React Flow instance
  const onInit = useCallback(
    (instance) => {
      reactFlowInstance.current = instance;
    },
    []
  );

  // Default React Flow props for better connection behavior
  const defaultEdgeOptions = {
    animated: true,
    style: {
      stroke: '#555',
      strokeWidth: 2,
    },
  };

  const [syncMode, setSyncMode] = useState("active"); // "active" or "all"
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        LoadWorkflows();
    }, []);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            if (syncMode === "active") {
                await SyncActiveWorkflow();
            } else {
                await SyncAllUnsavedWorkflows();
            }
        } catch (error) {
            console.error("Sync failed:", error);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleDismissError = () => {
        // You might want to implement a way to clear the error in your state
        console.log("Error dismissed");
    };

    const unsavedCount = unsavedWorkflows.value.size;
    const activeQueryHasChanges = activeWorkFlow.value && HasUnsavedChanges(activeWorkFlow.value);
    const canSyncActive = activeWorkFlow.value && activeQueryHasChanges;
    const canSyncAll = unsavedCount > 0;

  console.log("rendering the flow builder", nodes);
  return (
    <>
      <div style={{display:"flex", "flexDirection": "row-reverse", "justifyContent": "space-between", alignItems:"center"}}>
                      <ModernSyncControls
                        onDismissError={handleDismissError}
                        syncMode={syncMode}
                        setSyncMode={setSyncMode}
                        isSyncing={isSyncing}
                        isLoading={isLoading?.value}
                        // @ts-ignore
                        activeScreen={activeWorkFlow.value.id}
                        screenNamesList={workflownames.value}
                        unsavedCount={unsavedCount}
                        activeScreenHasChanges={activeQueryHasChanges}
                        canSyncActive={canSyncActive}
                        canSyncAll={canSyncAll}
                        handleSync={handleSync}
                        apiError={apiError?.value}
                        showLegacySync={true}
                        showProgressBar={true}
                        compact={false}
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
            onInit={onInit}
            onSelectionChange={onSelectionChange}
            deleteKeyCode={['Delete', 'Backspace']}
            selectionOnDrag
            selectionKeyCode="partial"
            multiSelectionKeyCode="Control"
          >
            {/* Controls for zoom, fit view */}
            <Controls />
            
            {/* Background grid pattern */}
            <Background color="#aaa" gap={16} />
            
            {/* Custom panel with delete button
            <Panel position="top-right" style={{ marginRight: '10px', marginTop: '10px' }}>
              <button 
                onClick={deleteSelectedElements}
                disabled={!selectedElements.nodes.length && !selectedElements.edges.length}
                style={{
                  padding: '6px 10px',
                  backgroundColor: (selectedElements.nodes.length || selectedElements.edges.length) ? '#f44336' : '#e0e0e0',
                  color: (selectedElements.nodes.length || selectedElements.edges.length) ? 'white' : '#9e9e9e',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: (selectedElements.nodes.length || selectedElements.edges.length) ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '14px'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Delete
              </button>
            </Panel> */}
          </ReactFlow>
        </div>
      </Drop>
    </>
  );
}

export {FlowBuilder};