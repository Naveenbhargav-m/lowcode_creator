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
  "condition": COLORS.insert,
  "loop": COLORS.condition,
  "insert_row": COLORS.insert,
  "update_row": COLORS.update,
  "read_rows": COLORS.active,
  "delete_rows": COLORS.condition,
  "http_request": COLORS.code,
  "create_topic": COLORS.insert,
  "subscribe_topic": COLORS.insert,
  "unsubscribe_topic": COLORS.condition,
  "delete_topic": COLORS.border,

};

// Icons mapping
const icons = [
  "database",
  "database",
  "parentheses",
  "workflow",
  "book-open",
  "trash",
  "repeat",
  "webhook",
  "radio",
  "mail-check",
  "mail-question",
  "trash"
];

import { useState } from "preact/hooks";
import { 
  DeleteWorkflow,
  DuplicateWorkflow,
  HasUnsavedChanges,
  isLoading,
  apiError,
} from "./workflow_state";

function WorkflowsList() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleCreateWorkflow = async (e) => {
    e.preventDefault();
    if (!newWorkflowName.trim()) return;

    try {
      await CreateWorkflow({ name: newWorkflowName.trim() });
      setNewWorkflowName("");
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create workflow:", error);
    }
  };

  const handleDeleteWorkflow = async (workflowId) => {
    if (showDeleteConfirm !== workflowId) {
      setShowDeleteConfirm(workflowId);
      return;
    }

    try {
      await DeleteWorkflow(workflowId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete workflow:", error);
    }
  };

  const handleDuplicateWorkflow = async (workflowId) => {
    try {
      await DuplicateWorkflow(workflowId);
    } catch (error) {
      console.error("Failed to duplicate workflow:", error);
    }
  };

  const filteredWorkflows = workflownames.value.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ 
      height: "100%", 
      display: "flex", 
      flexDirection: "column",
      padding: "16px"
    }}>
      {/* Header */}
      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ 
          fontSize: "18px", 
          fontWeight: "600", 
          margin: "0 0 12px 0",
          color: "#1f2937"
        }}>
          Workflows
        </h3>

        {/* API Error Display */}
        {apiError.value && (
          <div style={{
            padding: "8px 12px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "6px",
            color: "#dc2626",
            fontSize: "14px",
            marginBottom: "12px"
          }}>
            {apiError.value}
          </div>
        )}
        
        {/* Search */}
        <input
          type="text"
          placeholder="Search workflows..."
          value={searchTerm}
          // @ts-ignore
          onInput={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "14px",
            marginBottom: "12px"
          }}
        />

        {/* Create New Button */}
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          disabled={isLoading.value}
          style={{
            width: "100%",
            padding: "8px 16px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: isLoading.value ? "not-allowed" : "pointer",
            opacity: isLoading.value ? 0.6 : 1
          }}
        >
          {isLoading.value ? "Loading..." : "+ New Workflow"}
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div style={{
          padding: "12px",
          backgroundColor: "#f9fafb",
          borderRadius: "6px",
          marginBottom: "16px",
          border: "1px solid #e5e7eb"
        }}>
          <form onSubmit={handleCreateWorkflow}>
            <input
              type="text"
              placeholder="Workflow name..."
              value={newWorkflowName}
              // @ts-ignore
              onInput={(e) => setNewWorkflowName(e.target.value)}
              autoFocus
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                fontSize: "14px",
                marginBottom: "8px"
              }}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="submit"
                disabled={!newWorkflowName.trim() || isLoading.value}
                style={{
                  flex: 1,
                  padding: "6px 12px",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: (!newWorkflowName.trim() || isLoading.value) ? "not-allowed" : "pointer",
                  opacity: (!newWorkflowName.trim() || isLoading.value) ? 0.6 : 1
                }}
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewWorkflowName("");
                }}
                style={{
                  flex: 1,
                  padding: "6px 12px",
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="scrollable-div" style={{ flex: "0 0 auto", marginTop: "16px" }}>
        <TemplateOptionTabs 
          tabs={["flows", "blocks"]} 
          onChange={(tab) => { 
            flowTab.value = tab; 
            console.log("flow tab:", flowTab.value); 
          }}
        />
      </div>

      {/* Content */}
      <div style={{ marginTop: "16px", flex: 1, overflow: "hidden" }}>
        {flowTab.value === "blocks" ? <DragComponent /> : (
          <WorkflowsListPanel 
            workflows={filteredWorkflows}
            searchTerm={searchTerm}
            showDeleteConfirm={showDeleteConfirm}
            onDelete={handleDeleteWorkflow}
            onDuplicate={handleDuplicateWorkflow}
            onCancelDelete={() => setShowDeleteConfirm(null)}
          />
        )}
      </div>
    </div>
  );
}

function WorkflowsListPanel({ 
  workflows, 
  searchTerm, 
  showDeleteConfirm, 
  onDelete, 
  onDuplicate, 
  onCancelDelete 
}) {
  return (
    <div style={{ 
      height: "100%", 
      overflow: "auto",
      border: "1px solid #e5e7eb",
      borderRadius: "6px"
    }}>
      {workflows.length === 0 ? (
        <div style={{
          padding: "24px",
          textAlign: "center",
          color: "#6b7280",
          fontSize: "14px"
        }}>
          {searchTerm ? "No workflows match your search" : "No workflows found"}
        </div>
      ) : (
        workflows.map((workflow, index) => (
          <WorkflowNameTile 
            key={workflow.id || index} 
            workflow={workflow}
            // @ts-ignore
            isActive={workflow.id === activeWorkFlow.value?.id}
            hasUnsavedChanges={HasUnsavedChanges(workflow.id)}
            showDeleteConfirm={showDeleteConfirm === workflow.id}
            onSelect={() => SetWorkFlowActive(workflow.id)}
            onDelete={() => onDelete(workflow.id)}
            onDuplicate={() => onDuplicate(workflow.id)}
            onCancelDelete={onCancelDelete}
            isLoading={isLoading.value}
          />
        ))
      )}
    </div>
  );
}

function WorkflowNameTile({ 
  workflow,
  isActive, 
  hasUnsavedChanges,
  showDeleteConfirm,
  onSelect, 
  onDelete, 
  onDuplicate,
  onCancelDelete,
  isLoading
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      style={{
        padding: "12px",
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: isActive ? "#eff6ff" : "white",
        cursor: "pointer",
        position: "relative"
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={onSelect}
    >
      {/* Colored bar indicating active state */}
      <div style={{ 
        position: "absolute",
        left: 0,
        top: 0,
        width: "4px",
        height: "100%",
        backgroundColor: isActive ? (COLORS?.active || "#3b82f6") : "transparent",
      }}></div>
      
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center",
          flex: 1,
          minWidth: 0,
          marginLeft: "8px"
        }}>
          <div style={{ 
            backgroundColor: isActive ? (COLORS?.active || "#3b82f6") : "#f1f5f9",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: "12px",
            flexShrink: 0
          }}>
            {DynamicIcon ? (
              <DynamicIcon 
                name="workflow" 
                size={16} 
                style={{color: isActive ? "white" : (COLORS?.text || "#374151") }}
              />
            ) : (
              <span style={{ fontSize: "16px" }}>⚡</span>
            )}
          </div>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: "14px",
              fontWeight: isActive ? "600" : "500",
              color: isActive ? "#1d4ed8" : "#1f2937",
              marginBottom: "2px",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <span style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}>
                {workflow.name}
              </span>
              {hasUnsavedChanges && (
                <span style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#f59e0b",
                  borderRadius: "50%",
                  flexShrink: 0
                }} />
              )}
            </div>
            <div style={{
              fontSize: "12px",
              color: "#6b7280"
            }}>
              ID: {workflow.id}
            </div>
          </div>
        </div>

        {/* Actions */}
        {(showActions || showDeleteConfirm) && (
          <div style={{
            display: "flex",
            gap: "4px",
            marginLeft: "8px"
          }}>
            {showDeleteConfirm ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  disabled={isLoading}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "11px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.6 : 1
                  }}
                >
                  Confirm
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelDelete();
                  }}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#6b7280",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "11px",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate();
                  }}
                  disabled={isLoading}
                  title="Duplicate workflow"
                  style={{
                    padding: "4px 6px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "11px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.6 : 1
                  }}
                >
                  📋
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  disabled={isLoading}
                  title="Delete workflow"
                  style={{
                    padding: "4px 6px",
                    backgroundColor: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "11px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.6 : 1
                  }}
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DragComponent() {  
  let registerNodes = [
    {"name": "Code", "type": "code_block", "handles": [{"position": "bottom", "type": "source"}, {"position": "top", "type": "target"}]}, 
    {"name": "Insert Row", "type": "insert_row", "handles": [{"position": "bottom", "type": "source"}, {"position": "top", "type": "target"}]}, 
    {"name": "Update Row", "type": "update_row", "handles": [{"position": "bottom", "type": "source"}, {"position": "top", "type": "target"}]}, 
    {"name": "Condition", "type": "condition", "handles": [{"position": "bottom", "type": "source"}, {"position": "top", "type": "target"}]},
    {"name": "Read Rows", "type": "read_rows", "handles": [{"position": "bottom", "type": "source"}, {"position": "top", "type": "target"}]},
    {"name": "Delete Rows", "type": "delete_rows", "handles": [{"position": "bottom", "type": "source"}, {"position": "top", "type": "target"}]},
    {"name": "Loop", "type": "loop", "handles": [{"position": "bottom", "type": "source"}, {"position": "top", "type": "target"}]},
    {"name": "http_call", "type": "http_call", "handles": [{"position": "bottom", "type": "source"}, {"position": "top", "type": "target"}]},
    {"name": "create_topic", "type": "create_topic", "handles": [{"position": "bottom", "type": "source"}, {"position": "top", "type": "target"}]},
    {"name": "subscribe topic", "type": "subscribe_topic", "handles": [{"position": "bottom", "type": "source"}, {"position": "top", "type": "target"}]},
    {"name": "unsubscribe topic", "type": "unsubscribe_topic", "handles": [{"position": "bottom", "type": "source"}, {"position": "top", "type": "target"}]},
    {"name": "delete topic", "type": "delete_topic", "handles": [{"position": "bottom", "type": "source"}, {"position": "top", "type": "target"}]},

  ];
  
  return (
    <div className="custom-drag-list scrollable-div" style={{ padding: "8px 0" , height:"70vh" }}> 
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
                <DynamicIcon name={icons[ind]} size={20} style={{color:COLORS.text}} />
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