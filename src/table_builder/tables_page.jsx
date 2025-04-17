import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Controls,
  Background,
  MiniMap,
  Handle,
  Position,
  NodeResizer,
  useEdgesState,
  useNodesState,
  reconnectEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { PageBuilderLeftGrid } from "./page_builder_left";
import TableBuilderRight from "./table_builder_right";
import { tables, addContainer, addField, tablesFlag, activeTable, activeField, UpdateTableEdges, table_edges, currentTableConfigs, currentEdges, tables_id, Deletefield, UpdateRelation, dbViewSignal } from "./table_builder_state";
import { Drop } from "../components/custom/Drop";
import { SyncTablesData } from "../api/api";
import { SaveTablesData, TablesDataSetterFromAPI } from "./table_builder_helpers";
import { useSignal } from "@preact/signals";
import DynamicIcon from "../components/custom/dynamic_icon";
import { generateUID } from "../utils/helpers";
import { ViewArea } from "../view_creator/view_page";
import { AdvancedView } from "../view_creator/advnaced_views";
import { globalStyle } from "../styles/globalStyle";


const ResizableTableNode = ({ id, selected, onDeleteField }) => {
  const [hoveredField, setHoveredField] = useState(null);

  const table = tables[id]?.value || {};

  return (
    <Drop
      dropElementData={{ table: id }}
      onDrop={(data) => {
        addField(data);
      }}
    >
      <div
        style={{
          position: "relative",
          background: "white",
          borderRadius: 8,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <NodeResizer handleStyle={{"background":"transparent", "border":"none", "padding":"0px"}} isVisible={selected} color="#007AFF" />
        <div
          className="bg-white"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <h3
            className="bg-highlight"
            style={{
              width: "100%",
              textAlign: "center",
              padding: "4px 0",
              borderBottom: "1px solid #ddd",
              fontSize: "12px",
              borderRadius: "8px 8px 0px 0px",
              "color":"black"
            }}
            onClick={() => {
              activeTable.value = table.id;
              activeField.value = {};
            }}
          >
            {table.label || `Table ${id}`}
          </h3>
          <ul
            style={{
              width: "100%",
              padding: "0px 4px",
              margin: 0,
              listStyleType: "none",
            }}
          >
              {Object.entries(table.fields)
  .sort(([, fieldA], [, fieldB]) => fieldA.order - fieldB.order) // Sort by 'order'
  .map(([key, field], idx) => (
    <li
      key={idx}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "4px 8px",
        fontSize: "10px",
        borderBottom:
          idx < Object.keys(table.fields).length - 1 ? "1px solid #ddd" : "none",
        position: "relative",
      }}
      onMouseEnter={() => setHoveredField(idx)}
      onMouseLeave={() => setHoveredField(null)}
      onClick={() => {
        activeTable.value = table.id;
        activeField.value = { id: key, type: field.type };
      }}
    >
      {/* Left: Field Name */}
      <span style={{ flex: 1, textAlign: "left", "color":"black" }}>{field.name}</span>
      {/* Right: Field Type */}
      <span
        style={{
          flex: 1,
          textAlign: "right",
          fontSize: "9px",
          color: "#555",
        }}
      >
        {field.type || "Type"}
      </span>
      {/* Delete Icon */}
      {hoveredField === idx && (
        <span
          style={{
            position: "absolute",
            right: "8px",
            cursor: "pointer",
            fontSize: "12px",
            color: "black",
            backgroundColor: "white",
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the field's onClick
            Deletefield(key, idx);
          }}
        >
          <DynamicIcon name={"delete"} size={10} />
        </span>
      )}
      <Handle
        type="target"
        position={Position.Left}
        id={`target-${table["id"]}-${field["uid"]}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id={`source-${table["id"]}-${field["uid"]}`}
      />
    </li>
  ))}


          </ul>
        </div>
      </div>
    </Drop>
  );
};
const nodeTypes = {
  tableNode: ResizableTableNode,
};


function MyFlow() {

  
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);


  useEffect(() => {
    let edges = table_edges.value;
    setEdges(edges);
  },[table_edges.value]);
  useEffect(() => {
    TablesDataSetterFromAPI();
  },[]);

  // Sync nodes with `tables` signal whenever `tablesFlag` changes
  useEffect(() => {
    const newNodes = Object.entries(tables).map(([id, tableSignal]) => {
      const table = tableSignal.value;
      return {
        id,
        data: { label: table.label },
        position: table.position,
        type: "tableNode",
      };
    });
    setNodes(newNodes);
  }, [tablesFlag.value]); // Dependency on tablesFlag ensures updates only when needed

  // Add a new node dynamically and register it in the `tables` signal
  const addNode = useCallback(() => {
    const id = generateUID();
    const position = { x: Math.random() * 300, y: Math.random() * 300 };
    addContainer({ "id": id, label: `Table ${id}`, position, fields: {[id]:{
      "name": "id",
      "type": "primary",
      "sql_type":"SERIAL PRIMARY",
      "uid": id,
      "id": id,
      "table": `${id}`,
      "order":0,
      "required": false,
      "default": null,
      "relation": null
  },} });
  }, []);

  // Handle edge connection
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
      UpdateTableEdges(params);
    },
    [setEdges]
  );


  const edgeReconnectSuccessful = useSignal(true);

const onReconnectStart = useCallback(() => {
  edgeReconnectSuccessful.value = false; // Reset reconnect status
}, []);

const onReconnect = useCallback((oldEdge, newConnection) => {
  // Update the edge with the new connection
  edgeReconnectSuccessful.value = true; // Mark as successful
  setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds));
  
  const updatedEdge = { ...oldEdge, ...newConnection };
  UpdateTableEdges(updatedEdge); // Update edge in signals
}, []);

const onReconnectEnd = useCallback((_, edge) => {
  if (!edgeReconnectSuccessful.value) {
    // If reconnection failed, delete the edge
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    
    // Remove edge from signals
    let sourceHandler = edge["sourceHandle"];
    let targetHandler = edge["targetHandle"];
    let key = sourceHandler + "_" + targetHandler;
    const newEdges = table_edges.peek().filter((e) => e.key !== key);
    if(currentEdges[key] === undefined) {
      UpdateRelation(edge, "drop");
    }
    delete currentEdges[key];
    table_edges.value = newEdges;
    localStorage.setItem("edges", JSON.stringify(newEdges)); // Persist changes
  }

  edgeReconnectSuccessful.value = true; // Reset for next interaction
}, []);


  return (
    <div className="w-4/6 h-screen min-h-screen mx-4">
      {/* Top-right Button */}
      <div style={{display:"flex", flexDirection:"row", width:"100%", paddingTop:"20px", justifyContent:"space-between", alignItems:"center"}}>
      <TablesTab onTableSelect={(tab) => dbViewSignal.value = tab}/>
      <TablesButtonsBar AddCallBack={addNode} 
      SaveCallback={() => {
        console.log("save call Back is executing:");
        SyncTablesData(currentTableConfigs, currentEdges, tables_id.peek());
        SaveTablesData();}}/>
      </div>
      
      <div className="h-5/6 w-full bg-white mt-4">
        {/* React Flow Instance */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onReconnect={onReconnect}
          onReconnectStart={onReconnectStart}
          onReconnectEnd={onReconnectEnd}
          onEdgesChange={onEdgesChange}
          onNodesChange={onNodesChange}
          onConnect={onConnect}
          fitView
          // @ts-ignore
          nodeTypes={nodeTypes}
        >
          <Controls />
          <MiniMap />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}




function TableBuilderView() {
  return (
    <div className="min-h-screen h-screen w-full flex text-black bg-background">
    {/* Left Panel */}
    <div className="w-1/6 bg-white p-4 min-h-screen">
      <PageBuilderLeftGrid />
    </div>

    {/* Main Content Area */}
    <ReactFlowProvider>
      <MyFlow />
    </ReactFlowProvider>

    {/* Right Panel */}
    <div className="w-1/6 bg-white h-screen scrollable-div">
      <TableBuilderRight />
    </div>
  </div>
  );
}

function TablesButtonsBar({AddCallBack, SaveCallback}) {
  return (
    <div className="flex bg-white justify-end p-4" style={{fontSize:"0.8em", ...globalStyle}}>
    <button
    style={{fontSize:"0.9em",...globalStyle, "color":"white","backgroundColor":"black"}}
    onClick={AddCallBack}
    className="bg-secondary text-white px-4 py-2 rounded-md shadow-md hover:bg-primary"
  >
    <p>Add Table</p>
  </button>

  <button
  style={{fontSize:"0.9em",...globalStyle, "color":"white","backgroundColor":"black"}}
    onClick={(e) => SaveCallback()}
    className="bg-secondary text-white px-4 py-2 rounded-md shadow-md hover:bg-primary ml-4"
  >
    Save Changes
  </button>
  </div>
  );
} 

function TablesTab({ onTableSelect }) {
  const [selectedTable, setSelectedTable] = useState(dbViewSignal.value);
  const tables = ["Tables", "Views", "Triggers", "Advanced"];

  const handleTableClick = (table) => {
    setSelectedTable(table);
    if (onTableSelect) {
      onTableSelect(table);
    }
  };

  return (
    <div style={{display:"flex", backgroundColor:"white", padding:"20px", fontSize:"0.8em", flexDirection:"row", }}>
        {tables.map((table) => (
          <div
            key={table}
            className={`p-2 cursor-pointer rounded-md ${selectedTable === table ? "bg-black text-white" : "bg-white"}`}
            onClick={() => handleTableClick(table)}
          >
            {table}
            </div>
        ))}
    </div>
  );
}


function TablesPage() {
  return (
    <>
      {
      dbViewSignal.value == "Tables" ? <TableBuilderView /> : 
      dbViewSignal.value == "Views" ? <ViewArea /> :
      dbViewSignal.value == "Triggers" ? <ViewArea/> :
      <AdvancedView />
      }
    </>
  );
}



export {TablesPage, TablesTab};
