import { useState, useCallback } from 'react';
import{
  MiniMap,
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle, Position,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Define custom node types with handles
const nodeTypes = {
  default: ({ data }) => (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-md">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
      <div className="font-bold text-gray-700">{data.label}</div>
      {data.description && (
        <div className="text-sm text-gray-500 mt-1">{data.description}</div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
    </div>
  ),
  process: ({ data }) => (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 shadow-md">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
      <div className="font-bold text-blue-700">{data.label}</div>
      {data.description && (
        <div className="text-sm text-blue-500 mt-1">{data.description}</div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
    </div>
  ),
  decision: ({ data }) => (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 shadow-md rotate-45">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-amber-500 -rotate-45" 
        style={{ transform: 'translateX(-50%) translateY(-50%) rotate(-45deg)' }}
      />
      <div className="font-bold text-amber-700 -rotate-45">{data.label}</div>
      {data.description && (
        <div className="text-sm text-amber-500 mt-1 -rotate-45">{data.description}</div>
      )}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-amber-500 -rotate-45" 
        style={{ transform: 'translateX(-50%) translateY(50%) rotate(-45deg)' }}
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 bg-amber-500 -rotate-45" 
        style={{ transform: 'translateX(50%) translateY(-50%) rotate(-45deg)' }}
      />
    </div>
  ),
  end: ({ data }) => (
    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 shadow-md">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-green-500" />
      <div className="font-bold text-green-700">{data.label}</div>
      {data.description && (
        <div className="text-sm text-green-500 mt-1">{data.description}</div>
      )}
    </div>
  ),
};

// Initial elements
const initialNodes = [
  {
    id: '1',
    type: 'default',
    position: { x: 250, y: 100 },
    data: { label: 'Start', description: 'Begin workflow here' },
  },
  {
    id: '2',
    type: 'process',
    position: { x: 250, y: 250 },
    data: { label: 'Process', description: 'Perform action' },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
];

export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setNodeName] = useState('');
  const [nodeDescription, setNodeDescription] = useState('');
  const [nodeType, setNodeType] = useState('default');

  // Handle connections
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  // Add new node
  const addNode = () => {
    if (!nodeName) return;
    
    const newNode = {
      id: (nodes.length + 1).toString(),
      type: nodeType,
      position: {
        x: Math.random() * 300 + 100,
        y: Math.random() * 300 + 100,
      },
      data: {
        label: nodeName,
        description: nodeDescription,
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    setNodeName('');
    setNodeDescription('');
  };

  // Delete selected nodes
  const deleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
  }, [setNodes, setEdges]);

  // Handle keyboard events
  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        deleteSelected();
      }
    },
    [deleteSelected]
  );

  return (
    <div className="h-screen w-full" tabIndex={0} onKeyDown={onKeyDown}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        deleteKeyCode="Delete"
      >
        <Controls />
        <MiniMap 
          nodeStrokeColor="#aaa"
          nodeColor={(node) => {
            switch (node.type) {
              case 'process':
                return '#dbeafe';
              case 'decision':
                return '#fef3c7';
              case 'end':
                return '#d1fae5';
              default:
                return '#f9fafb';
            }
          }}
        />
        <Background color="#f8fafc" gap={16} />
        
        {/* Node creation panel */}
        <Panel position="top-left" className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-lg font-bold mb-3 text-gray-700">Add New Node</h3>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Node Type
              </label>
              <select
                value={nodeType}
                onChange={(e) => setNodeType(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">Default</option>
                <option value="process">Process</option>
                <option value="decision">Decision</option>
                <option value="end">End</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Node Name
              </label>
              <input
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter node name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <input
                value={nodeDescription}
                onChange={(e) => setNodeDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
              />
            </div>
            
            <button
              onClick={addNode}
              disabled={!nodeName}
              className={`px-4 py-2 rounded-md ${
                !nodeName
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Add Node
            </button>
          </div>
        </Panel>
        
        {/* Instructions */}
        <Panel position="top-right" className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-lg font-bold mb-2 text-gray-700">Instructions</h3>
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
            <li>Drag nodes to reposition</li>
            <li>Connect nodes by dragging from one handle to another</li>
            <li>Add new nodes using the left panel</li>
            <li>Select and press Delete to remove nodes</li>
            <li>Decision nodes have two outputs (bottom and right)</li>
          </ul>
        </Panel>
      </ReactFlow>
    </div>
  );
}