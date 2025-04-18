import { NodeResizer } from "@xyflow/react";
import { Handle } from '@xyflow/react';
import DynamicIcon from "../components/custom/dynamic_icon";
import { activeworkFlowBlock } from "./workflow_state";

// Shared component styles and utility functions
const COLORS = {
  insert: "#99d98c", // Indigo
  update: "#0369a1", // Blue
  condition: "#b45309", // Amber
  start: "#047857", // Emerald
  end: "#be123c", // Rose
};

// Base Node Component for reusability
function FlowNode({ data, name, icon, color, children }) {
  const handleNodeClick = () => {
    activeworkFlowBlock.value = { ...data };
  };

  const baseStyle = {
    display: "flex",
    height: "inherit",
    width: "inherit",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "white", // Zinc-900
    color: "black", // Slate-50
    fontSize: "0.9em",
    margin: "10px 0px",
    padding: "12px 16px",
    borderRadius: "12px",
    border: `10px solid ${color}`,
    boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`,
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
    position: "relative",
  };

  const iconContainerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color,
    padding: "8px",
    borderRadius: "50%",
    marginBottom: "8px",
  };

  const labelStyle = {
    fontWeight: "500",
    textAlign: "center",
    width: "100%",
  };

  return (
    <div onClick={handleNodeClick}>
      <NodeResizer isVisible={true} minWidth={120} minHeight={80} />
      {data.handles?.map((handle) => (
        <Handle
          key={handle.id}
          id={handle.id}
          type={handle.type}
          position={handle.position}
          style={{
            background: color,
            width: "12px",
            height: "12px",
            border: `2px solid #18181b`,
          }}
          isConnectable={true}
        />
      ))}
      <div style={baseStyle}>
        <div style={iconContainerStyle}>
          <DynamicIcon name={icon} size={22} color="#ffffff" />
        </div>
        <div style={labelStyle}>{name}</div>
        {children}
      </div>
    </div>
  );
}

// Individual Node Components
export function InsertRow({ data }) {
  return (
    <FlowNode
      data={data}
      name="Insert Row"
      icon="diamond-plus"
      color={COLORS.insert}
    > This is Insert Row</FlowNode>
  );
}

export function UpdateRow({ data }) {
  return (
    <FlowNode
      data={data}
      name="Update Row"
      icon="database-edit"
      color={COLORS.update}
    >This is update Row</FlowNode>
  );
}

export function Condition({ data }) {
  return (
    <FlowNode
      data={data}
      name="Condition"
      icon="git-branch"
      color={COLORS.condition}
    >
      <div style={{ fontSize: "0.8em", marginTop: "6px", opacity: 0.8 }}>
        if (condition) → then...
      </div>
    </FlowNode>
  );
}

export function Start({ data }) {
  return (
    <FlowNode
      data={data}
      name="Start"
      icon="play"
      color={COLORS.start}
    >Start of Flow</FlowNode>
  );
}

export function End({ data }) {
  return (
    <FlowNode
      data={data}
      name="End"
      icon="circle-check"
      color={COLORS.end}
    >End of the Flow</FlowNode>
  );
}