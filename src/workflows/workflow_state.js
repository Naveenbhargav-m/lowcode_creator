import { signal } from "@preact/signals";
import { generateUID } from "../utils/helpers";

/**
 * State Management for Workflows
 * Using signals for reactive state management
 */

// Core workflow state signals
const activeWorkFlow = signal({});
const workflows = signal([]);
const workflowsData = signal({});
const workflownames = signal([]);
const activeworkFlowBlock = signal({});
const flowTab = signal("blocks");
const activeFloweUpdated = signal("");

/**
 * Updates nodes in the active workflow
 * @param {Array} updatedNodes - Array of nodes to update or add
 * @returns {void}
 */
function UpdateActiveWorkflowNodes(updatedNodes) {
    // Validate inputs
    if (!updatedNodes || !Array.isArray(updatedNodes)) {
        console.warn("UpdateActiveWorkflowNodes: Invalid nodes data provided");
        return;
    }

    const existingFlow = activeWorkFlow.peek(); // Avoid triggering reactivity
    
    // Validate existing flow
    if (!existingFlow || typeof existingFlow !== 'object') {
        console.warn("UpdateActiveWorkflowNodes: No active workflow exists");
        return;
    }
    
    if (!existingFlow["fid"]) {
        console.warn("UpdateActiveWorkflowNodes: Active workflow missing fid");
        return;
    }
    
    // Handle case where nodes might be undefined
    const currentNodes = Array.isArray(existingFlow["nodes"]) ? [...existingFlow["nodes"]] : [];
    
    // Update or add new nodes
    updatedNodes.forEach((updatedNode) => {
        if (!updatedNode || !updatedNode.id) {
            console.warn("UpdateActiveWorkflowNodes: Received invalid node", updatedNode);
            return;
        }
        
        const index = currentNodes.findIndex((node) => node && node.id === updatedNode.id);
        if (index !== -1) {
            currentNodes[index] = { ...currentNodes[index], ...updatedNode }; // Merge changes
        } else {
            currentNodes.push(updatedNode); // Add new node
        }
    });
    
    const isChanged = existingFlow["_change_type"] || "update";
    
    // Update active workflow with new nodes
    activeWorkFlow.value = {
        ...existingFlow,
        nodes: currentNodes,
        _change_type: isChanged
    };
    
    // Update workflows collection with latest changes
    UpdateWorkflowsWithLatest(existingFlow);
}

/**
 * Updates edges in the active workflow
 * @param {Array} updatedEdges - Array of edges to update
 * @returns {void}
 */
function UpdateActiveWorkflowEdges(updatedEdges) {
    // Validate inputs
    if (!updatedEdges || !Array.isArray(updatedEdges)) {
        console.warn("UpdateActiveWorkflowEdges: Invalid edges data provided");
        return;
    }

    const existingFlow = activeWorkFlow.peek(); // Use peek() to avoid triggering reactivity
    
    // Validate existing flow
    if (!existingFlow || typeof existingFlow !== 'object') {
        console.warn("UpdateActiveWorkflowEdges: No active workflow exists");
        return;
    }
    
    if (!existingFlow["fid"]) {
        console.warn("UpdateActiveWorkflowEdges: Active workflow missing fid");
        return;
    }
    
    // Apply edge type to all edges for consistency
    const processedEdges = updatedEdges.map(edge => ({
        ...edge,
        type: "smoothstep"
    }));
    
    const isChanged = existingFlow["_change_type"] || "update";
    
    // Update active workflow with new edges
    activeWorkFlow.value = {
        ...existingFlow,
        edges: processedEdges,
        _change_type: isChanged
    };
    
    // Update workflows collection with latest changes
    UpdateWorkflowsWithLatest(existingFlow);
}

/**
 * Updates the workflows collection with the latest active workflow
 * @param {Object} existingFlow - The current active workflow
 * @returns {void}
 */
function UpdateWorkflowsWithLatest(existingFlow) {
    // Validate inputs
    if (!existingFlow || typeof existingFlow !== 'object') {
        console.warn("UpdateWorkflowsWithLatest: Invalid flow provided");
        return;
    }
    
    const activeID = existingFlow.id;
    if (!activeID) {
        console.warn("UpdateWorkflowsWithLatest: Flow missing ID");
        return;
    }
    
    // Get current workflows and update the matching one
    const currentWorkflows = workflows.peek();
    if (!Array.isArray(currentWorkflows)) {
        console.warn("UpdateWorkflowsWithLatest: workflows is not an array");
        return;
    }
    
    const updatedWorkflows = currentWorkflows.map((flow) => 
        flow && flow.id === activeID ? activeWorkFlow.peek() : flow
    );
    
    // Update workflows signal and persist to localStorage
    workflows.value = [...updatedWorkflows];
    try {
        localStorage.setItem("workflows", JSON.stringify(updatedWorkflows));
    } catch (error) {
        console.error("Failed to save workflows to localStorage:", error);
    }
}

/**
 * Creates a new workflow
 * @param {Object} data - Data for the new workflow
 * @returns {string} - ID of the created workflow
 */
function CreateWorkflow(data) {
    // Validate input
    if (!data || typeof data !== 'object' || !data.name) {
        console.error("CreateWorkflow: Invalid workflow data. Name is required.");
        return null;
    }
    
    const name = data.name;
    const id = generateUID();
    const endID = generateUID();
    const startID = generateUID();
    const StarthandleID = generateUID();
    const stopHandleID = generateUID();
    
    // Create workflow object with start and end nodes
    const newWorkflow = {
        name: name,
        fid: id,
        id: id, // Ensure both id and fid exist for consistency
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
        _change_type: "create"
    };
    
    // Update workflows signal
    const existingWorkflows = Array.isArray(workflows.peek()) ? [...workflows.peek()] : [];
    existingWorkflows.push(newWorkflow);
    workflows.value = existingWorkflows;
    
    // Update workflow names
    const existingNames = Array.isArray(workflownames.peek()) ? [...workflownames.peek()] : [];
    const nameObj = {
        id: newWorkflow.fid,
        name: newWorkflow.name
    };
    existingNames.push(nameObj);
    workflownames.value = existingNames;
    
    // Set this workflow as active
    SetWorkFlowActive(id);
    
    return id;
}

/**
 * Handles dropping a block onto the workflow canvas
 * @param {Object} data - Data for the dropped block
 * @returns {void}
 */
function HandleWorkFlowBlockDrop(data) {
    // Validate input
    if (!data || !data.data || !data.data.type || !data.data.name) {
        console.error("HandleWorkFlowBlockDrop: Invalid block data");
        return;
    }
    
    // Check if active workflow exists
    const curFlow = activeWorkFlow.value;
    if (!curFlow || !curFlow["nodes"] || !Array.isArray(curFlow["nodes"])) {
        console.error("HandleWorkFlowBlockDrop: No active workflow or nodes array");
        return;
    }
    
    const operation = data.data.type;
    const name = data.data.name;
    const newid = generateUID();
    
    // Process handles and ensure they have unique IDs
    let handles = Array.isArray(data.data.handles) ? [...data.data.handles] : [];
    handles = handles.map(handle => ({
        ...handle,
        id: generateUID()
    }));
    
    // Create new node
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
    
    // Insert the new node before the end node
    const nodes = [...curFlow["nodes"]];
    // Find the end node to ensure it stays at the end
    const endNodeIndex = nodes.findIndex(node => node && node.type === "end");
    
    if (endNodeIndex !== -1) {
        const endNode = nodes.splice(endNodeIndex, 1)[0];
        nodes.push(newnode);
        nodes.push(endNode);
    } else {
        // If no end node found (shouldn't happen), just add the new node
        nodes.push(newnode);
    }
    
    // Update workflow
    const isChanged = curFlow["_change_type"] || "update";
    activeWorkFlow.value = {
        ...curFlow,
        nodes: nodes,
        _change_type: isChanged
    };
    
    activeFloweUpdated.value = generateUID();
    UpdateWorkflowsWithLatest(curFlow);
}

/**
 * Stores block-specific data for a workflow
 * @param {Object} newData - Data to store
 * @param {string} workflowID - ID of the workflow
 * @param {string} blockID - ID of the block
 * @returns {void}
 */
function SetWorkflowDataBack(newData, workflowID, blockID) {
    // Validate inputs
    console.log("called set workflow data back:",newData, workflowID, blockID);
    if (!newData || typeof newData !== 'object') {
        console.warn("SetWorkflowDataBack: Invalid data provided");
        return;
    }
    
    if (!workflowID || !blockID) {
        console.warn("SetWorkflowDataBack: Missing workflow ID or block ID");
        return;
    }
    
    // Get existing data structure or initialize new ones
    const existingData = workflowsData.value || {};
    const currentflowData = existingData[workflowID] || {};
    const currentBlockData = currentflowData[blockID] || {};
    const data = currentBlockData.data || {};
    
    // Merge the new data with existing data
    const newBlockData = {
        ...currentBlockData,
            ...data,
            ...newData   
    };
    // Update data structure
    currentflowData[blockID] = newBlockData;
    currentflowData["_change_type"] = currentflowData["_change_type"] || "update";
    console.log("current flow data:",currentflowData, workflowID, blockID);
    existingData[workflowID] = currentflowData;
    workflowsData.value = {...existingData};
}

/**
 * Sets a workflow as the active workflow
 * @param {string} id - ID of the workflow to activate
 * @returns {boolean} - Success status
 */
function SetWorkFlowActive(id) {
    // Validate input
    if (!id) {
        console.warn("SetWorkFlowActive: No workflow ID provided");
        return false;
    }
    
    // Find the workflow with matching ID
    const currentWorkflows = workflows.peek();
    if (!Array.isArray(currentWorkflows)) {
        console.warn("SetWorkFlowActive: workflows is not an array");
        return false;
    }
    
    const targetWorkflow = currentWorkflows.find(flow => flow && flow.id === id);
    
    if (!targetWorkflow) {
        console.warn(`SetWorkFlowActive: Workflow with ID ${id} not found`);
        return false;
    }
    
    // Set as active workflow
    activeWorkFlow.value = {...targetWorkflow};    
    activeFloweUpdated.value = generateUID();
    return true;
}

// Initialize workflow state from localStorage if available
try {
    const savedWorkflows = localStorage.getItem("workflows");
    if (savedWorkflows) {
        const parsed = JSON.parse(savedWorkflows);
        if (Array.isArray(parsed) && parsed.length > 0) {
            workflows.value = parsed;
            
            // Build workflow names list
            const names = parsed.map(flow => ({
                id: flow.fid,
                name: flow.name
            }));
            workflownames.value = names;
        }
    }
} catch (error) {
    console.error("Error loading workflows from localStorage:", error);
}

export {
    activeWorkFlow, 
    workflows, 
    workflownames, 
    CreateWorkflow, 
    SetWorkFlowActive, 
    flowTab, 
    UpdateActiveWorkflowNodes, 
    HandleWorkFlowBlockDrop,
    UpdateActiveWorkflowEdges,
    activeFloweUpdated, 
    activeworkFlowBlock, 
    workflowsData, 
    SetWorkflowDataBack
};