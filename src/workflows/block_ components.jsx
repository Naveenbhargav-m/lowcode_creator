import { NodeResizer } from "@xyflow/react";
import { Handle, Position } from '@xyflow/react';
import DynamicIcon from "../components/custom/dynamic_icon";
import { activeworkFlowBlock } from "./workflow_state";
import { useCallback } from "preact/hooks";

// Sleek modern color palette
const COLORS = {
  insert: "#38bdf8", // Bright blue
  update: "#4ade80", // Bright green
  condition: "#f97316", // Orange
  start: "#06b6d4", // Cyan
  end: "#a855f7", // Purple
};

const handleStyle = { left: 10 };
 

function TextUpdaterNode({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
 
  // Function to stop event propagation so the node doesn't move when clicking handles
  const onHandleMouseDown = (e) => {
    // Stop the event from bubbling up to the node
    e.stopPropagation();
  };
 
  return (
    <div className="text-updater-node" style={{
      position: "relative",
      background: "white",
      border: "1px solid #ddd",
      borderRadius: "6px",
      padding: "10px",
      width: "300px"
    }}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{
          width: "12px",
          height: "12px",
          background: "#38bdf8",
          border: "2px solid white",
          top: "-6px",
          zIndex: 10
        }}
        onMouseDown={onHandleMouseDown} // Add mouse down handler
      />
      <div>
        <label htmlFor="text" style={{ marginBottom: "8px", display: "block" }}>Text:</label>
        <div style={{
          width: "100%", 
          height: "200px", 
          backgroundColor: "grey",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white"
        }}>
          Am the Box with static data
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={{
          width: "12px",
          height: "12px",
          background: "#4ade80",
          border: "2px solid white",
          bottom: "-6px",
          left: "30%",
          zIndex: 10
        }}
        isConnectable={isConnectable}
        onMouseDown={onHandleMouseDown} // Add mouse down handler
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={{
          width: "12px",
          height: "12px",
          background: "#f97316",
          border: "2px solid white",
          bottom: "-6px",
          left: "70%",
          zIndex: 10
        }}
        isConnectable={isConnectable}
        onMouseDown={onHandleMouseDown} // Add mouse down handler
      />
    </div>
  );
}

// Base Node Component with improved sleek styling
function FlowNode({ data, name, icon, color, children }) {
  const handleNodeClick = () => {
    activeworkFlowBlock.value = { ...data };
  };

  const baseStyle = {
    width: "180px", // Fixed width for consistency
    backgroundColor: "white",
    color: "#333",
    fontSize: "0.85em",
    borderRadius: "6px",
    border: `1px solid #e2e8f0`,
    boxShadow: `0 2px 4px rgba(0, 0, 0, 0.05), 0 0 0 2px ${color}20`,
    position: "relative", // Needed for absolute positioned elements
    display: "flex",
    padding: "10px",
    cursor: "pointer"
  };

  const iconContainerStyle = {
    marginRight: "10px",
    background: `${color}15`,
    padding: "6px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  const contentStyle = {
    display: "flex",
    flexDirection: "column"
  };

  const labelStyle = {
    fontWeight: "600",
    textAlign: "left",
    width: "100%",
    color: "#1e293b",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden"
  };

  const childrenStyle = {
    fontSize: "0.8em",
    marginTop: "2px",
    color: "#64748b",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  };

  // Color accent on left side
  const accentStyle = {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "3px",
    backgroundColor: color,
    borderTopLeftRadius: "6px",
    borderBottomLeftRadius: "6px"
  };

  // Base handle style
  const handleBaseStyle = {
    background: color,
    width: "8px",
    height: "8px",
    border: "2px solid white",
  };

  return (
    <div onClick={handleNodeClick}>
      {/* Render handles from data */}
      {data.handles?.map((handle) => (
        <Handle
          key={handle.id}
          id={handle.id}
          type={handle.type}
          position={handle.position || Position.Top}
          style={{
            ...handleBaseStyle,
            ...(handle.style || {})
          }}
          isConnectable={true}
        />
      ))}
      
      <div style={baseStyle}>
        <div style={accentStyle}></div>
        <div style={iconContainerStyle}>
          <DynamicIcon name={icon} size={18} style={{ color: color }} />
        </div>
        <div style={contentStyle}>
          <div style={labelStyle}>{name}</div>
          <div style={childrenStyle}>{children}</div>
        </div>
      </div>
    </div>
  );
}

// Individual Node Components
export function InsertRow({ data }) {
  // Default handles if none provided
  const nodeData = {
    ...data,
    handles: data.handles || [
      { id: 'target', type: 'target', position: Position.Top },
      { id: 'source', type: 'source', position: Position.Bottom }
    ]
  };

  return (
    <FlowNode
      data={nodeData}
      name="Insert Row"
      icon="diamond-plus"
      color={COLORS.insert}
    >
      Add new record
    </FlowNode>
  );
}

export function UpdateRow({ data }) {
  // Default handles if none provided
  const nodeData = {
    ...data,
    handles: data.handles || [
      { id: 'target', type: 'target', position: Position.Top },
      { id: 'source', type: 'source', position: Position.Bottom }
    ]
  };

  return (
    <FlowNode
      data={nodeData}
      name="Update Row"
      icon="pencil"
      color={COLORS.update}
    >
      Modify existing data
    </FlowNode>
  );
}

export function Condition({ data }) {
  // Default handles for condition nodes
  const nodeData = {
    ...data,
    handles: data.handles || [
      { id: 'target', type: 'target', position: Position.Top },
      { id: 'source-true', type: 'source', position: Position.Bottom, style: { left: 30 } },
      { id: 'source-false', type: 'source', position: Position.Bottom, style: { left: 'auto', right: 30 } }
    ]
  };

  return (
    <FlowNode
      data={nodeData}
      name="Condition"
      icon="git-branch"
      color={COLORS.condition}
    >
      if (condition) → then...
    </FlowNode>
  );
}

export function Start({ data }) {
  // Start only has output
  const nodeData = {
    ...data,
    handles: data.handles || [
      { id: 'source', type: 'source', position: Position.Bottom }
    ]
  };

  return (
    <FlowNode
      data={nodeData}
      name="Start"
      icon="play"
      color={COLORS.start}
    >
      Begin workflow
    </FlowNode>
  );
}

export function End({ data }) {
  // End only has input
  const nodeData = {
    ...data,
    handles: data.handles || [
      { id: 'target', type: 'target', position: Position.Top }
    ]
  };

  return (
    <FlowNode
      data={nodeData}
      name="End"
      icon="circle-check"
      color={COLORS.end}
    >
      Complete workflow
    </FlowNode>
  );
}



export function CodeBlock({ data }) {
  // Default handles if none provided
  const nodeData = {
    ...data,
    handles: data.handles || [
      { id: 'target', type: 'target', position: Position.Top },
      { id: 'source', type: 'source', position: Position.Bottom }
    ]
  };

  // Determine language for syntax highlighting
  const language = data.language || 'javascript';

  // Function to format code for preview
  const formatCodePreview = (code) => {
    if (!code) return null;
    
    // Split code into lines
    const lines = code.split('\n');
    
    // If code is small enough, show it all
    if (lines.length <= 5 && code.length < 200) {
      return code;
    }
    
    // Otherwise, show first few lines with ellipsis
    return lines.slice(0, 3).join('\n') + (lines.length > 3 ? '\n...' : '');
  };

  return (
    <FlowNode
      data={nodeData}
      name="Code Block"
      icon="code-2"
      color={COLORS.code || "#6366F1"} // Indigo color if COLORS.code not defined
    >
      {data.code ? (
        <div className="w-full max-w-full">
          <div className="flex items-center justify-between mb-1 px-1">
            <span className="text-xs font-medium text-gray-500">{language}</span>
            <span className="text-xs text-gray-400">{data.code.split('\n').length} lines</span>
          </div>
          <div className="code-preview text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-hidden whitespace-pre border-l-4 border-indigo-500">
            {formatCodePreview(data.code)}
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2 text-gray-500">
          <span>Execute code snippet</span>
        </div>  
      )}
    </FlowNode>
  );
}



export function ReadRow({ data }) {
  // Default handles if none provided
  const nodeData = {
    ...data,
    handles: data.handles || [
      { id: 'target', type: 'target', position: Position.Top },
      { id: 'source', type: 'source', position: Position.Bottom }
    ]
  };

  return (
    <FlowNode
      data={nodeData}
      name="Read Row"
      icon="database"
      color={COLORS.database || "#10B981"} // Green color if COLORS.database not defined
    >
      <div className="flex flex-col space-y-1">
        {data.table && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium">Table:</span>
            <span className="text-xs">{data.table}</span>
          </div>
        )}
        {data.conditions && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium">Conditions:</span>
            <span className="text-xs">{data.conditions}</span>
          </div>
        )}
        {!data.table && !data.conditions && (
          <div className="flex items-center space-x-2 text-gray-500">
            <span>Read data from database</span>
          </div>
        )}
      </div>
    </FlowNode>
  );
}

export function DeleteRow({ data }) {
  // Default handles if none provided
  const nodeData = {
    ...data,
    handles: data.handles || [
      { id: 'target', type: 'target', position: Position.Top },
      { id: 'source', type: 'source', position: Position.Bottom }
    ]
  };

  return (
    <FlowNode
      data={nodeData}
      name="Delete Row"
      icon="trash-2"
      color={COLORS.delete || "#EF4444"} // Red color if COLORS.delete not defined
    >
      <div className="flex flex-col space-y-1">
        {data.table && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium">Table:</span>
            <span className="text-xs">{data.table}</span>
          </div>
        )}
        {data.conditions && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium">Conditions:</span>
            <span className="text-xs">{data.conditions}</span>
          </div>
        )}
        {!data.table && !data.conditions && (
          <div className="flex items-center space-x-2 text-gray-500">
            <span>Delete data from database</span>
          </div>
        )}
      </div>
    </FlowNode>
  );
}

export function HttpCall({ data }) {
  // Default handles if none provided
  const nodeData = {
    ...data,
    handles: data.handles || [
      { id: 'target', type: 'target', position: Position.Top },
      { id: 'source', type: 'source', position: Position.Bottom }
    ]
  };

  return (
    <FlowNode
      data={nodeData}
      name="HTTP Call"
      icon="globe"
      color={COLORS.http || "#8B5CF6"} // Purple color if COLORS.http not defined
    >
      <div className="flex flex-col space-y-1">
        {data.method && data.url && (
          <>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium px-1 py-0.5 bg-purple-100 dark:bg-purple-900 rounded">
                {data.method}
              </span>
              <span className="text-xs truncate max-w-xs">{data.url}</span>
            </div>
            {data.headers && (
              <div className="text-xs text-gray-500">
                {Object.keys(data.headers).length} header{Object.keys(data.headers).length !== 1 ? 's' : ''}
              </div>
            )}
          </>
        )}
        {(!data.method || !data.url) && (
          <div className="flex items-center space-x-2 text-gray-500">
            <span>Make API request</span>
          </div>
        )}
      </div>
    </FlowNode>
  );
}

export function Loop({ data }) {
  // Default handles if none provided
  const nodeData = {
    ...data,
    handles: data.handles || [
      { id: 'target', type: 'target', position: Position.Top },
      { id: 'source', type: 'source', position: Position.Bottom },
      { id: 'loop-body', type: 'source', position: Position.Right }
    ]
  };

  return (
    <FlowNode
      data={nodeData}
      name="Loop"
      icon="repeat"
      color={COLORS.loop || "#F59E0B"} // Amber color if COLORS.loop not defined
    >
      <div className="flex flex-col space-y-1">
        {data.collection && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium">Collection:</span>
            <span className="text-xs">{data.collection}</span>
          </div>
        )}
        {data.variable && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium">Variable:</span>
            <span className="text-xs">{data.variable}</span>
          </div>
        )}
        {!data.collection && !data.variable && (
          <div className="flex items-center space-x-2 text-gray-500">
            <span>Iterate through items</span>
          </div>
        )}
      </div>
    </FlowNode>
  );
}

export function CreateTopic({ data }) {
  // Default handles if none provided
  const nodeData = {
    ...data,
    handles: data.handles || [
      { id: 'target', type: 'target', position: Position.Top },
      { id: 'source', type: 'source', position: Position.Bottom }
    ]
  };

  return (
    <FlowNode
      data={nodeData}
      name="Create Topic"
      icon="message-square-plus"
      color={COLORS.topic || "#0EA5E9"} // Sky blue color if COLORS.topic not defined
    >
      <div className="flex flex-col space-y-1">
        {data.topicName && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium">Topic:</span>
            <span className="text-xs">{data.topicName}</span>
          </div>
        )}
        {data.options && Object.keys(data.options).length > 0 && (
          <div className="text-xs text-gray-500">
            With {Object.keys(data.options).length} option{Object.keys(data.options).length !== 1 ? 's' : ''}
          </div>
        )}
        {!data.topicName && (
          <div className="flex items-center space-x-2 text-gray-500">
            <span>Create topic</span>
          </div>
        )}
      </div>
    </FlowNode>
  );
}

export function SubscribeTopic({ data }) {
  // Default handles if none provided
  const nodeData = {
    ...data,
    handles: data.handles || [
      { id: 'target', type: 'target', position: Position.Top },
      { id: 'source', type: 'source', position: Position.Bottom }
    ]
  };

  return (
    <FlowNode
      data={nodeData}
      name="Subscribe Topic"
      icon="bell"
      color={COLORS.topic || "#0EA5E9"} // Sky blue color if COLORS.topic not defined
    >
      <div className="flex flex-col space-y-1">
        {data.topicName && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium">Topic:</span>
            <span className="text-xs">{data.topicName}</span>
          </div>
        )}
        {data.subscriber && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium">Subscriber:</span>
            <span className="text-xs">{data.subscriber}</span>
          </div>
        )}
        {!data.topicName && !data.subscriber && (
          <div className="flex items-center space-x-2 text-gray-500">
            <span>Subscribe to messaging topic</span>
          </div>
        )}
      </div>
    </FlowNode>
  );
}

export function UnsubscribeTopic({ data }) {
  // Default handles if none provided
  const nodeData = {
    ...data,
    handles: data.handles || [
      { id: 'target', type: 'target', position: Position.Top },
      { id: 'source', type: 'source', position: Position.Bottom }
    ]
  };

  return (
    <FlowNode
      data={nodeData}
      name="Unsubscribe Topic"
      icon="bell-off"
      color={COLORS.topic || "#0EA5E9"} // Sky blue color if COLORS.topic not defined
    >
      <div className="flex flex-col space-y-1">
        {data.topicName && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium">Topic:</span>
            <span className="text-xs">{data.topicName}</span>
          </div>
        )}
        {data.subscriber && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium">Subscriber:</span>
            <span className="text-xs">{data.subscriber}</span>
          </div>
        )}
        {!data.topicName && !data.subscriber && (
          <div className="flex items-center space-x-2 text-gray-500">
            <span>Unsubscribe topic</span>
          </div>
        )}
      </div>
    </FlowNode>
  );
}

export function DeleteTopic({ data }) {
  // Default handles if none provided
  const nodeData = {
    ...data,
    handles: data.handles || [
      { id: 'target', type: 'target', position: Position.Top },
      { id: 'source', type: 'source', position: Position.Bottom }
    ]
  };

  return (
    <FlowNode
      data={nodeData}
      name="Delete Topic"
      icon="message-square-x"
      color={COLORS.topic || "#0EA5E9"} // Sky blue color if COLORS.topic not defined
    >
      <div className="flex flex-col space-y-1">
        {data.topicName && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium">Topic:</span>
            <span className="text-xs">{data.topicName}</span>
          </div>
        )}
        {!data.topicName && (
          <div className="flex items-center space-x-2 text-gray-500">
            <span>Delete topic</span>
          </div>
        )}
      </div>
    </FlowNode>
  );
}