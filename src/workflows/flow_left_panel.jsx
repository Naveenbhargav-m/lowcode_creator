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
  "insert_rows": COLORS.insert,
  "update_rows": COLORS.update,
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

import { Plus, Search, Workflow, Copy, Trash2, Palette, Star } from "lucide-react";

// Workflows Component
function WorkflowsList() {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleCreate = async () => {
    if (newName.trim()) {
      try {
        await CreateWorkflow({ name: newName.trim() });
        setNewName("");
        setIsCreating(false);
      } catch (error) {
        console.error("Failed to create workflow:", error);
      }
    }
  };

  const handleDelete = async (workflowId) => {
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

  const handleDuplicate = async (workflowId) => {
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
    <div className="h-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Workflows</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700 transition-colors"
          disabled={isLoading.value}
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search workflows..."
          value={searchTerm}
          // @ts-ignore
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {isCreating && (
        <div className="mb-4 space-y-2">
          <input
            type="text"
            value={newName}
            // @ts-ignore
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Workflow name"
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
            onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
          />
          <div className="flex gap-2">
            <button 
              onClick={handleCreate} 
              className="flex-1 bg-blue-600 text-white py-1.5 rounded text-sm hover:bg-blue-700 transition-colors"
              disabled={!newName.trim() || isLoading.value}
            >
              Create
            </button>
            <button 
              onClick={() => {
                setIsCreating(false);
                setNewName('');
              }} 
              className="flex-1 bg-gray-200 text-gray-700 py-1.5 rounded text-sm hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {apiError.value && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{apiError.value}</p>
        </div>
      )}

      {isLoading.value && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600">Loading...</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-4">
        <TemplateOptionTabs 
          tabs={["flows", "blocks"]} 
          onChange={(tab) => { 
            flowTab.value = tab; 
            console.log("flow tab:", flowTab.value); 
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {flowTab.value === "blocks" ? <DragComponent /> : (
          <div className="space-y-1 max-h-full overflow-y-auto border border-gray-200 rounded-md">
            {filteredWorkflows.length === 0 ? (
              <div className="text-center text-gray-500 p-8">
                <Workflow size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {searchTerm ? "No workflows match your search" : "No workflows found"}
                </p>
                <p className="text-xs mt-1 text-gray-400">Create your first workflow to get started</p>
              </div>
            ) : (
              filteredWorkflows.map((workflow, index) => {
                // @ts-ignore
                const isActive = workflow.id === activeWorkFlow.value?.id;
                const hasChanges = HasUnsavedChanges(workflow.id);
                const isDeleting = showDeleteConfirm === workflow.id;
                
                return (
                  <div 
                    key={workflow.id || index}
                    className={`flex items-center justify-between p-2.5 border-b border-gray-100 cursor-pointer transition-colors ${
                      isActive 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => SetWorkFlowActive(workflow.id)}
                  >
                    <div className="flex items-center flex-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 ${
                        isActive ? 'bg-blue-600' : 'bg-gray-200'
                      }`}>
                        <Workflow size={14} className={isActive ? 'text-white' : 'text-gray-600'} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="text-sm font-medium truncate">{workflow.name}</span>
                          {hasChanges && (
                            <span className="ml-2 w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">ID: {workflow.id}</div>
                        {hasChanges && (
                          <div className="text-xs text-gray-500">Unsaved changes</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {isDeleting ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(workflow.id);
                            }}
                            disabled={isLoading.value}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteConfirm(null);
                            }}
                            className="px-2 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicate(workflow.id);
                            }}
                            disabled={isLoading.value}
                            className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                            title="Duplicate workflow"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(workflow.id);
                            }}
                            disabled={isLoading.value}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Delete workflow"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
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
    {"name": "Insert Row", "type": "insert_rows", "handles": [{"position": "bottom", "type": "source"}, {"position": "top", "type": "target"}]}, 
    {"name": "Update Row", "type": "update_rows", "handles": [{"position": "bottom", "type": "source"}, {"position": "top", "type": "target"}]}, 
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