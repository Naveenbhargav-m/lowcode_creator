import { signal } from "@preact/signals";
import { generateUID } from "../utils/helpers";
import { GetDataFromAPi, CreateDataToAPI, UpdateDataToAPI, DeleteDataFromAPI } from "../api/api_syncerv2";
import { AppID } from "../states/global_state";

// Core workflow state signals
const activeWorkFlow = signal({});
const workflows = signal([]);
const workflowsData = signal({});
const workflownames = signal([]);
const activeworkFlowBlock = signal({});
const flowTab = signal("blocks");
const activeFloweUpdated = signal("");

// Track which workflows have unsaved changes
const unsavedWorkflows = signal(new Set());
const isLoading = signal(false);
const apiError = signal(null);

// Default workflow structure
const DEFAULT_WORKFLOW_STRUCTURE = {
    name: "",
    id: "",
    nodes: [],
    edges: [],
    flow_data: {},
    workflow_schema: {}
};

/**
 * Load all workflows from API
 */
async function LoadWorkflows() {
    try {
        isLoading.value = true;
        apiError.value = null;
        let url = `${AppID.value}/public/_workflows`;
        const response = await GetDataFromAPi(url);
        console.log("Loaded workflows:", response);

        if (!response || response.length === 0) {
            console.log("No workflows found");
            workflows.value = [];
            workflownames.value = [];
            return;
        }

        const workflowsList = [];
        const workflowNamesList = [];

        response.forEach(workflow => {
            const workflowData = {
                ...DEFAULT_WORKFLOW_STRUCTURE,
                id: workflow.id,
                fid: workflow.fid || workflow.id,
                name: workflow.name || `Workflow ${workflow.id}`,
                nodes: workflow.nodes || [],
                edges: workflow.edges || [],
                flow_data: workflow.flow_data || {},
                workflow_schema: workflow.workflow_schema || {}
            };
            
            workflowsList.push(workflowData);
            workflowNamesList.push({
                name: workflowData.name,
                id: workflowData.id
            });
        });

        workflows.value = workflowsList;
        workflownames.value = workflowNamesList;
        
        // Clear unsaved changes after successful load
        unsavedWorkflows.value = new Set();
        
        // Set first workflow as active if none selected
        // @ts-ignore
        if (workflowsList.length > 0 && !activeWorkFlow.value?.id) {
            SetWorkFlowActive(workflowsList[0].id);
        }
        
    } catch (error) {
        console.error("Error loading workflows:", error);
        apiError.value = "Failed to load workflows";
    } finally {
        isLoading.value = false;
    }
}

/**
 * Create a new workflow via API
 */
async function CreateWorkflow(data) {
    // Validate input
    if (!data || typeof data !== 'object' || !data.name) {
        console.error("CreateWorkflow: Invalid workflow data. Name is required.");
        throw new Error("Workflow name is required");
    }
    
    try {
        isLoading.value = true;
        apiError.value = null;
        
        const name = data.name;
        const fid = generateUID();
        const endID = generateUID();
        const startID = generateUID();
        const StarthandleID = generateUID();
        const stopHandleID = generateUID();
        
        // Create workflow object with start and end nodes
        const newWorkflow = {
            fid: fid,
            name: name,
            nodes: [
                {
                    label: "start", 
                    type: "start", 
                    id: startID, 
                    data: {
                        type: "start", 
                        id: startID,
                        handles: [{
                            id: StarthandleID, 
                            position: "bottom", 
                            type: "source"
                        }]
                    },
                    position: { x: 250, y: 250 }
                },
                {
                    label: "end", 
                    type: "end",
                    id: endID, 
                    data: { 
                        type: "end", 
                        id: endID, 
                        handles: [{
                            id: stopHandleID, 
                            position: "top", 
                            type: "target"
                        }]
                    },
                    position: { x: 350, y: 350 }
                }
            ],
            edges: [],
            flow_data: {},
            workflow_schema: {},
            inputs: {}
        };

        // Make API call to create workflow
        let url = `${AppID.value}/public/_workflows`;
        const response = await CreateDataToAPI(url, newWorkflow);
        
        if (response && response.id) {
            // Add to local state with server-generated ID
            const createdWorkflow = {
                ...newWorkflow,
                id: response.id,
                _change_type: "create"
            };
            
            const existingWorkflows = [...workflows.value];
            existingWorkflows.push(createdWorkflow);
            workflows.value = existingWorkflows;
            
            // Update workflow names
            const existingNames = [...workflownames.value];
            existingNames.push({
                id: createdWorkflow.id,
                name: createdWorkflow.name
            });
            workflownames.value = existingNames;
            
            // Set this workflow as active
            SetWorkFlowActive(createdWorkflow.id);
            
            console.log("Workflow created successfully:", response.id);
            return createdWorkflow.id;
        } else {
            throw new Error("Invalid response from server");
        }
        
    } catch (error) {
        console.error("Error creating workflow:", error);
        apiError.value = "Failed to create workflow";
        throw error;
    } finally {
        isLoading.value = false;
    }
}

/**
 * Update a specific workflow via API
 */
async function UpdateWorkflow(workflowid) {
    try {
        isLoading.value = true;
        apiError.value = null;
        
        const workflow = workflows.value.find(w => w.id === workflowid);
        if (!workflow) {
            throw new Error("Workflow not found");
        }

        const updateData = {
            id: workflow.id,
            name: workflow.name,
            nodes: workflow.nodes,
            edges: workflow.edges,
            flow_data: workflow.flow_data,
            workflow_schema: workflow.workflow_schemam,
            inputs: workflow.inputs
        };
        
        let url = `${AppID.value}/public/_workflows?where=id=${workflowid}`;
        await UpdateDataToAPI(url, updateData);
        
        // Remove from unsaved changes
        const currentUnsaved = new Set(unsavedWorkflows.value);
        currentUnsaved.delete(workflowid);
        unsavedWorkflows.value = currentUnsaved;
        
        console.log("Workflow updated successfully:", workflowid);
        return true;
        
    } catch (error) {
        console.error("Error updating workflow:", error);
        apiError.value = "Failed to update workflow";
        throw error;
    } finally {
        isLoading.value = false;
    }
}

/**
 * Delete a workflow via API
 */
async function DeleteWorkflow(workflowid) {
    try {
        isLoading.value = true;
        apiError.value = null;
        let url = `${AppID.value}/public/_workflows?where=id=${workflowid}`;
        await DeleteDataFromAPI(url);
        
        // Remove from local state
        const updatedWorkflows = workflows.value.filter(w => w.id !== workflowid);
        workflows.value = updatedWorkflows;
        
        // Update workflow names list
        const updatedNames = workflownames.value.filter(w => w.id !== workflowid);
        workflownames.value = updatedNames;
        
        // Remove from unsaved changes
        const currentUnsaved = new Set(unsavedWorkflows.value);
        currentUnsaved.delete(workflowid);
        unsavedWorkflows.value = currentUnsaved;
        
        // If this was the active workflow, set new active or clear
        // @ts-ignore
        if (activeWorkFlow.value?.id === workflowid) {
            if (updatedWorkflows.length > 0) {
                SetWorkFlowActive(updatedWorkflows[0].id);
            } else {
                activeWorkFlow.value = {};
            }
        }
        
        console.log("Workflow deleted successfully:", workflowid);
        return true;
        
    } catch (error) {
        console.error("Error deleting workflow:", error);
        apiError.value = "Failed to delete workflow";
        throw error;
    } finally {
        isLoading.value = false;
    }
}

/**
 * Duplicate an existing workflow
 */
async function DuplicateWorkflow(sourceWorkflowid) {
    const sourceWorkflow = workflows.value.find(w => w.id === sourceWorkflowid);
    if (!sourceWorkflow) {
        throw new Error("Source workflow not found");
    }
    
    const duplicateData = {
        name: `${sourceWorkflow.name} (Copy)`,
        // Don't copy the fid - let CreateWorkflow generate a new one
    };
    
    return CreateWorkflow(duplicateData);
}

/**
 * Sync all workflows that have unsaved changes
 */
async function SyncAllUnsavedWorkflows() {
    const unsavedIds = Array.from(unsavedWorkflows.value);
    if (unsavedIds.length === 0) {
        console.log("No unsaved workflows to sync");
        return;
    }
    
    try {
        const promises = unsavedIds.map(id => UpdateWorkflow(id));
        await Promise.all(promises);
        console.log("All unsaved workflows synced successfully");
    } catch (error) {
        console.error("Failed to sync some workflows:", error);
        throw error;
    }
}

/**
 * Sync only the currently active workflow
 */
async function SyncActiveWorkflow() {
    // @ts-ignore
    const activeFid = activeWorkFlow.value?.id;
    if (!activeFid) {
        console.warn("No active workflow to sync");
        return;
    }
    
    try {
        await UpdateWorkflow(activeFid);
        console.log("Active workflow synced successfully");
    } catch (error) {
        console.error("Failed to sync active workflow:", error);
        throw error;
    }
}

/**
 * Mark workflow as having unsaved changes
 */
function MarkWorkflowAsChanged(workflowFid) {
    const currentUnsaved = new Set(unsavedWorkflows.value);
    currentUnsaved.add(workflowFid);
    unsavedWorkflows.value = currentUnsaved;
}

/**
 * Check if workflow has unsaved changes
 */
function HasUnsavedChanges(workflowFid) {
    return unsavedWorkflows.value.has(workflowFid);
}

function UpdateActiveWorkflowNodes(updatedNodes) {
    // Validate inputs
    if (!updatedNodes || !Array.isArray(updatedNodes)) {
        console.warn("UpdateActiveWorkflowNodes: Invalid nodes data provided");
        return;
    }

    const existingFlow = activeWorkFlow.peek();
    
    if (!existingFlow || typeof existingFlow !== 'object') {
        console.warn("UpdateActiveWorkflowNodes: No active workflow exists");
        return;
    }
    
    if (!existingFlow["id"]) {
        console.warn("UpdateActiveWorkflowNodes: Active workflow missing id");
        return;
    }
    
    const currentNodes = Array.isArray(existingFlow["nodes"]) ? [...existingFlow["nodes"]] : [];
    
    updatedNodes.forEach((updatedNode) => {
        if (!updatedNode || !updatedNode.id) {
            console.warn("UpdateActiveWorkflowNodes: Received invalid node", updatedNode);
            return;
        }
        
        const index = currentNodes.findIndex((node) => node && node.id === updatedNode.id);
        if (index !== -1) {
            currentNodes[index] = { ...currentNodes[index], ...updatedNode };
        } else {
            currentNodes.push(updatedNode);
        }
    });
    
    // Update active workflow with new nodes
    activeWorkFlow.value = {
        ...existingFlow,
        nodes: currentNodes,
        _change_type: "update"
    };
    
    // Mark as changed and update workflows collection
    // @ts-ignore
    MarkWorkflowAsChanged(existingFlow.id);
    UpdateWorkflowsWithLatest(existingFlow);
}

function UpdateActiveWorkflowEdges(updatedEdges) {
    if (!updatedEdges || !Array.isArray(updatedEdges)) {
        console.warn("UpdateActiveWorkflowEdges: Invalid edges data provided");
        return;
    }

    const existingFlow = activeWorkFlow.peek();
    
    if (!existingFlow || typeof existingFlow !== 'object') {
        console.warn("UpdateActiveWorkflowEdges: No active workflow exists");
        return;
    }
    
    if (!existingFlow["id"]) {
        console.warn("UpdateActiveWorkflowEdges: Active workflow missing id");
        return;
    }
    
    const processedEdges = updatedEdges.map(edge => ({
        ...edge,
        type: "smoothstep"
    }));
    
    activeWorkFlow.value = {
        ...existingFlow,
        edges: processedEdges,
        _change_type: "update"
    };
    
    // @ts-ignore
    MarkWorkflowAsChanged(existingFlow.id);
    UpdateWorkflowsWithLatest(existingFlow);
}

/**
 * Updates the workflows collection with the latest active workflow
 */
function UpdateWorkflowsWithLatest(existingFlow) {
    if (!existingFlow || typeof existingFlow !== 'object') {
        console.warn("UpdateWorkflowsWithLatest: Invalid flow provided");
        return;
    }
    
    const activeFid = existingFlow.id;
    if (!activeFid) {
        console.warn("UpdateWorkflowsWithLatest: Flow missing id");
        return;
    }
    
    const currentWorkflows = workflows.peek();
    if (!Array.isArray(currentWorkflows)) {
        console.warn("UpdateWorkflowsWithLatest: workflows is not an array");
        return;
    }
    
    const updatedWorkflows = currentWorkflows.map((flow) => 
        flow && flow.id === activeFid ? activeWorkFlow.peek() : flow
    );
    
    workflows.value = [...updatedWorkflows];
}

function HandleWorkFlowBlockDrop(data) {
    if (!data || !data.data || !data.data.type || !data.data.name) {
        console.error("HandleWorkFlowBlockDrop: Invalid block data");
        return;
    }
    
    const curFlow = activeWorkFlow.value;
    if (!curFlow || !curFlow["nodes"] || !Array.isArray(curFlow["nodes"])) {
        console.error("HandleWorkFlowBlockDrop: No active workflow or nodes array");
        return;
    }
    
    const operation = data.data.type;
    const name = data.data.name;
    const newid = generateUID();
    
    let handles = Array.isArray(data.data.handles) ? [...data.data.handles] : [];
    handles = handles.map(handle => ({
        ...handle,
        id: generateUID()
    }));
    
    const newnode = {
        label: name, 
        type: operation, 
        id: newid, 
        position: { x: 250, y: 250 }, 
        data: {
            type: operation, 
            id: newid,
            handles: handles
        },
    };
    
    const nodes = [...curFlow["nodes"]];
    const endNodeIndex = nodes.findIndex(node => node && node.type === "end");
    
    if (endNodeIndex !== -1) {
        const endNode = nodes.splice(endNodeIndex, 1)[0];
        nodes.push(newnode);
        nodes.push(endNode);
    } else {
        nodes.push(newnode);
    }
    
    activeWorkFlow.value = {
        ...curFlow,
        nodes: nodes,
        _change_type: "update"
    };
    
    // @ts-ignore
    MarkWorkflowAsChanged(curFlow.id);
    activeFloweUpdated.value = generateUID();
    UpdateWorkflowsWithLatest(curFlow);
}

function SetWorkflowDataBack(newData, workflowID, blockID) {
    console.log("called set workflow data back:", newData, workflowID, blockID);
    if (!newData || typeof newData !== 'object') {
        console.warn("SetWorkflowDataBack: Invalid data provided");
        return;
    }
    
    if (!workflowID || !blockID) {
        console.warn("SetWorkflowDataBack: Missing workflow ID or block ID");
        return;
    }
    
    const existingData = workflowsData.value || {};
    const currentflowData = existingData[workflowID] || {};
    const currentBlockData = currentflowData[blockID] || {};
    const data = currentBlockData.data || {};
    
    const newBlockData = {
        ...currentBlockData,
        ...data,
        ...newData   
    };
    
    currentflowData[blockID] = newBlockData;
    currentflowData["_change_type"] = currentflowData["_change_type"] || "update";
    console.log("current flow data:", currentflowData, workflowID, blockID);
    existingData[workflowID] = currentflowData;
    workflowsData.value = {...existingData};
    
    // Mark workflow as changed
    MarkWorkflowAsChanged(workflowID);
}

function SetWorkFlowActive(id) {
    if (!id) {
        console.warn("SetWorkFlowActive: No workflow ID provided");
        return false;
    }
    
    const currentWorkflows = workflows.peek();
    if (!Array.isArray(currentWorkflows)) {
        console.warn("SetWorkFlowActive: workflows is not an array");
        return false;
    }
    
    const targetWorkflow = currentWorkflows.find(flow => flow && flow.id === id);
    
    if (!targetWorkflow) {
        console.warn(`SetWorkFlowActive: Workflow with id ${id} not found`);
        return false;
    }
    
    activeWorkFlow.value = {...targetWorkflow};    
    activeFloweUpdated.value = generateUID();
    return true;
}

export {
    // State
    activeWorkFlow, 
    workflows, 
    workflownames, 
    workflowsData,
    activeworkFlowBlock, 
    flowTab,
    activeFloweUpdated,
    unsavedWorkflows,
    isLoading,
    apiError,
    
    // CRUD Operations
    LoadWorkflows,
    CreateWorkflow,
    UpdateWorkflow,
    DeleteWorkflow,
    DuplicateWorkflow,
    SyncActiveWorkflow,
    SyncAllUnsavedWorkflows,
    
    // Workflow Management
    SetWorkFlowActive, 
    UpdateActiveWorkflowNodes, 
    HandleWorkFlowBlockDrop,
    UpdateActiveWorkflowEdges,
    SetWorkflowDataBack,
    MarkWorkflowAsChanged,
    HasUnsavedChanges
};