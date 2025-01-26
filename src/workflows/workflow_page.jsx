

import { useCallback } from "react";
import {
    ReactFlow,
    Handle,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
  } from '@xyflow/react';
  import { getBezierPath, getEdgeCenter } from "@xyflow/react";

   
  import '@xyflow/react/dist/style.css';



function WorkFlowPage() {
    return (
        <div className="p-10 bg-gray-100 text-black h-screen">
            <div className="border rounded-lg shadow-lg bg-white h-[85vh] p-4">
                <FlowRenderer />
            </div>
        </div>
    );
}

// Initial nodes and edges
const initialNodes = [
    {
        id: "1",
        position: { x: 50, y: 50 },
        data: { label: "Start Node" },
        type: "customNode"
    },
    {
        id: "2",
        position: { x: 200, y: 200 },
        data: { label: "Second Node" },
        type: "customNode"
    }
];

const initialEdges = [
    {
        id: "e1-2",
        source: "1",
        target: "2",
        type: "default"
    }
];


const FlowRenderer = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([
        {
            id: "1",
            position: { x: 50, y: 50 },
            data: {
                label: "Start Node",
                fields: [
                    { name: "Field 1", value: "" },
                    { name: "Field 2", value: "" }
                ],
                updateNode: (fields) =>
                    setNodes((nds) =>
                        nds.map((n) => (n.id === "1" ? { ...n, data: { ...n.data, fields } } : n))
                    )
            },
            type: "customNode"
        },
        {
            id: "2",
            position: { x: 200, y: 200 },
            data: {
                label: "Second Node",
                fields: [
                    { name: "Field A", value: "" },
                    { name: "Field B", value: "" }
                ],
                updateNode: (fields) =>
                    setNodes((nds) =>
                        nds.map((n) => (n.id === "2" ? { ...n, data: { ...n.data, fields } } : n))
                    )
            },
            type: "customNode"
        }
    ]);

    const [edges, setEdges, onEdgesChange] = useEdgesState([
        {
            id: "e1-2",
            source: "1",
            target: "2",
            type: "custom-edge",
            data: { mapping: [] }
        }
    ]);

    const onConnect = useCallback(
        (connection) =>
            setEdges((eds) =>
                addEdge(
                    { ...connection, type: "custom-edge", data: { mapping: [] } },
                    eds
                )
            ),
        [setEdges]
    );

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={{ customNode: NodeComponent }}
                edgeTypes={{ "custom-edge": EdgeComponent }}
                fitView
            >
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
};



const EdgeComponent = ({ id, sourceX, sourceY, targetX, targetY, data, markerEnd }) => {
    const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY });

    return (
        <>
            <path
                id={id}
                className="react-flow__edge-path stroke-current text-gray-500"
                d={edgePath}
                markerEnd={markerEnd}
            />
            <foreignObject
                width={150}
                height={50}
                x={labelX - 75}
                y={labelY - 25}
                className="pointer-events-none"
            >
                <div className="bg-white text-xs p-1 rounded shadow-md">
                    {data?.mapping?.map((m, index) => (
                        <div key={index}>
                            {m.from} → {m.to}
                        </div>
                    ))}
                </div>
            </foreignObject>
        </>
    );
};

export default EdgeComponent;


const NodeComponent = ({ data }) => {
    const { fields, label, updateNode } = data;

    // Handler for updating fields
    const handleFieldChange = (index, value) => {
        const updatedFields = [...fields];
        updatedFields[index].value = value;
        updateNode(updatedFields);
    };

    return (
        <div className="p-4 bg-blue-500 text-white rounded-lg shadow-md relative">
            <strong>{label}</strong>
            <div className="mt-2">
                {fields.map((field, index) => (
                    <div key={index} className="mt-1">
                        <label className="block text-sm">{field.name}:</label>
                        <input
                            type="text"
                            value={field.value}
                            onChange={(e) => handleFieldChange(index, e.target.value)}
                            className="mt-1 p-1 rounded text-black w-full"
                        />
                    </div>
                ))}
            </div>
            {/* Source and Target Handles */}
            <Handle type="target" position="left" className="bg-red-500" />
            <Handle type="source" position="right" className="bg-green-500" />
        </div>
    );
};


export {WorkFlowPage};