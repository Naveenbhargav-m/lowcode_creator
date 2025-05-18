import { useContext } from "preact/hooks";
import DynamicIcon from "../components/custom/dynamic_icon";
import { activeWorkFlow, CreateWorkflow, flowTab, SetWorkFlowActive, workflownames } from "./workflow_state";
import { TemplateOptionTabs } from "../template_builder/templates_page";
import { CreateFormButton } from "../template_builder/template_builder_view";
import { Draggable } from "../components/custom/Drag";


// Sleek modern color palette - lighter and more premium
const COLORS = {
  insert: "#60a5fa", // Softer blue
  update: "#34d399", // Softer green
  condition: "#fb923c", // Softer orange
  code: "#c084fc", // Softer purple
  background: "#fafafa", // Almost white background
  active: "#334155", // Softer dark slate for active items
  text: "#475569", // Softer text color
  textLight: "#f8fafc", // Light text
  border: "#e2e8f0", // Light border

  }
// Map node types to their colors
const NODE_COLORS = {
  "code_block": COLORS.code,
  "insert_row": COLORS.insert,
  "update_row": COLORS.update,
  "condition": COLORS.condition,
};

// Icons mapping
const icons = [
  "database",
  "database",
  "parentheses",
  "workflow",
];

function WorkflowsList() {
  return (
    <div style={{  }}>
      <CreateFormButton
        formLabel={"New Flow"} 
        placeHolder={"Flow Name:"} 
        buttonLabel={"Create"} 
        callback={(data) => { CreateWorkflow(data) }}
      />
      <div className="scrollable-div" style={{ flex: "0 0 auto", marginTop: "16px" }}>
        <TemplateOptionTabs 
          tabs={["flows", "blocks"]} 
          onChange={(tab) => { 
            flowTab.value = tab; 
            console.log("flow tab:", flowTab.value); 
          }}
        />
      </div>
      <div style={{ marginTop: "16px" }}>
        {flowTab.value === "blocks" ? <DragComponent /> : <WorkflowsListPanel />}
      </div>
    </div>
  );
}

function WorkflowsListPanel() {
  return(
    <div style={{ width: "100%", height: "100%" }}>
      {workflownames.value.map((value, index) => {
        return (
          <WorkflowNameTile obj={value} key={index} />
        );
      })}
    </div>
  );
}

function WorkflowNameTile({ obj }) {
  const isActive = obj["id"] === activeWorkFlow.value["fid"];
  
  return (
    <div
      style={{
        padding: "12px",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        border: `1px solid ${COLORS.border}`,
        borderRadius: "10px",
        margin: "8px 0",
        boxShadow: isActive ? COLORS.shadow : "none",
        cursor: "pointer",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "hidden"
      }}
      onClick={() => SetWorkFlowActive(obj["id"])}
    >
      {/* Colored bar indicating active state */}
      <div style={{ 
        position: "absolute",
        left: 0,
        top: 0,
        width: "8px",
        height: "100%",
        backgroundColor: isActive ? COLORS.active : COLORS.border,
      }}></div>
      
      <div style={{ 
        backgroundColor: isActive ? COLORS.active : "#f1f5f9",
        borderRadius: "50%",
        width: "28px",
        height: "28px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "16px",
        marginRight: "12px"
      }}>
        <DynamicIcon name="workflow" size={16} color={isActive ? "white" : COLORS.text} />
      </div>
      <p style={{ 
        color: COLORS.text, 
        fontWeight: isActive ? "600" : "normal",
        margin: 0 
      }}>
        {obj["name"]}
      </p>
    </div>
  );
}

function DragComponent() {  
  let registerNodes = [
    {"name": "Code", "type": "code_block", "handles": [{"position": "bottom", "type": "source"}, {"position": "top", "type": "target"}]}, 
    {"name": "Insert Row", "type": "insert_row", "handles": [{"position": "bottom", "type": "source"}, {"position": "top", "type": "target"}]}, 
    {"name": "Update Row", "type": "update_row", "handles": [{"position": "bottom", "type": "source"}, {"position": "top", "type": "target"}]}, 
    {"name": "Condition", "type": "condition", "handles": [{"position": "bottom", "type": "source"}, {"position": "top", "type": "target"}]},
  ];
  
  return (
    <div className="custom-drag-list" style={{ padding: "8px 0" }}> 
      {registerNodes.map((item, ind) => {
        const nodeColor = NODE_COLORS[item.type] || COLORS.active;
        
        return (
          <Draggable 
            key={ind}
            onDragStart={(data) => {console.log("drag data:", data);}} 
            data={{...item}}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "white",
                fontSize: "0.9em",
                margin: "12px 0",
                padding: "0",
                borderRadius: "10px",
                boxShadow: COLORS.shadow,
                cursor: "grab",
                color: COLORS.text,
                border: "1px solid #e2e8f0",
                position: "relative",
                overflow: "hidden"
              }}
              className="custom-drag-item"
            >
              {/* Colored vertical bar */}
              <div style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "8px",
                height: "100%",
                backgroundColor: nodeColor
              }}></div>
              
              {/* Icon container */}
              <div style={{ 
                padding: "0px 8px",
                marginLeft: "16px", // Space after the vertical bar
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%"
              }}>
                <DynamicIcon name={icons[ind]} size={20} color={COLORS.text} />
              </div>
              
              {/* Text container */}
              <div style={{
                padding: "18px 16px 18px 8px"
              }}>
                {item.name}
              </div>
            </div>
          </Draggable>
        ); 
      })}
    </div>
  );
}

export { DragComponent, WorkflowsList };