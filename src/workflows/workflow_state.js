import { signal } from "@preact/signals";
import { generateUID } from "../utils/helpers";


let activeWorkFlow = signal({});
let workflows = signal([]);
let workflowsData = signal({});
let workflownames = signal([]);
let activeworkFlowBlock = signal({});
let flowTab = signal("blocks");
let activeFloweUpdated = signal("");



function UpdateActiveWorkflowNodes(updatedNodes) {
    let existingFlow = activeWorkFlow.peek(); // Avoid triggering reactivity
    console.log("UpdateActiveWorkflowNodes:",existingFlow);
    if(existingFlow === undefined || updatedNodes === undefined) {
        return;
    }
    if(existingFlow["fid"] === undefined) {
        return;
    }
    if(existingFlow["nodes"] === undefined) {
        return;
    }
    let nodes = [...existingFlow["nodes"]]; // Clone the nodes array to prevent mutation issues

    // Update or add new nodes
    updatedNodes.forEach((updatedNode) => {
        let index = nodes.findIndex((node) => node.id === updatedNode.id);
        if (index !== -1) {
            nodes[index] = { ...nodes[index], ...updatedNode }; // Merge changes
        } else {
            nodes.push(updatedNode); // Add new node if it doesn’t exist
        }
    });
    let isChanged = existingFlow["_change_type"] || "update";
    activeWorkFlow.value = {
        ...existingFlow,
        nodes: nodes,
        "_change_type": isChanged
    };
    console.log("after nodes change active Flow:",activeWorkFlow.value);
    UpdateWorkflowsWithLatest(existingFlow);
}


function UpdateActiveWorkflowEdges(updatedEdges) {
    let existingFlow = activeWorkFlow.peek(); // Use peek() to avoid triggering reactivity
    console.log("update Active Workflow Edges:",existingFlow);
    if(existingFlow === undefined || updatedEdges === undefined) {
        return;
    }
     if(existingFlow["fid"] === undefined) {
        return;
    }
    for(let i=0;i<updatedEdges.length;i++) {
        updatedEdges[i]["type"] = "smoothstep";
    }
    let isChanged = existingFlow["_change_type"] || "update";
    activeWorkFlow.value = {
        ...existingFlow,
        edges: updatedEdges,
        "_change_type": isChanged
    };
    console.log("after edges change active Flow:",activeWorkFlow.value);
    UpdateWorkflowsWithLatest(existingFlow);
} 

function UpdateWorkflowsWithLatest(existingFlow) {
    if(existingFlow === undefined) {
        return;
    }
    let activeID = existingFlow["id"];
    if(activeID === undefined) {
        return;
    }
    let flows = workflows.peek().map((flow1) =>
        flow1.id === activeID ? activeWorkFlow.peek() : flow1
    );
    console.log("sorted flows before updating:",flows);
    workflows.value = [...flows];
    localStorage.setItem("workflows", JSON.stringify(workflows.value));
}

function CreateWorkflow(data) {
    let name = data["name"];
    let id = generateUID();
    let endID = generateUID();
    let startID = generateUID();
    let StarthandleID = generateUID();
    let stopHandleID = generateUID();
    let obj = {"name": name,
         "fid": id,
         "nodes": [
          {"label":"start", "type":"start", "id": startID, 
            "data": {"type":"start", "id": startID,"handles": [{"id":StarthandleID, "position": "bottom", "type": "source"}]},position: { x: 250, y: 250 }},
          {"label":"end", "type":"end","id": endID, "data" :{ "type": "end", "id": endID, "handles": [{"id":stopHandleID, "position":"top", "type":"target"}]},position: { x: 350, y: 250 },}],
         "edges": [],
         "_change_type": "create"
        };
    let exist = workflows.peek();
    exist.push(obj);
    workflows.value = [...exist];
    let namesexists = workflownames.peek();
    let nameObj = {};
    nameObj["id"] = obj["fid"];
    nameObj["name"] = obj["name"];
    namesexists.push(nameObj);
    workflownames.value = [...namesexists];
    SetWorkFlowActive(id);
}


function HandleWorkFlowBlockDrop(data) {
    let operation = data["data"]["type"];
    let name = data["data"]["name"];
    let newid = generateUID();
    let handles = data["data"]["handles"];
    for(let i = 0;i<handles.length;i++) {
        let id = generateUID();
        handles[i]["id"] = id;
    }
    let newnode = {
        "label": name, 
        "type":  operation, "id": newid , 
        position: { x: 250, y: 250 }, 
        data:{"type":  operation, "id": newid,"handles": [...handles]},
    };
    let curFlow = activeWorkFlow.value;
    let nodes = curFlow["nodes"];
    let lastVal = curFlow["nodes"].pop();
    nodes.push(newnode);
    nodes.push(lastVal);
    curFlow["nodes"] = [...nodes];
    let isChanged = curFlow["_change_type"] || "update";
    activeWorkFlow.value = {...curFlow, "_change_type": isChanged};
    console.log("current flow:",curFlow);
    activeFloweUpdated.value = generateUID(); 
    UpdateWorkflowsWithLatest(curFlow);
}



function SetWorkFlowActive(id) {
    let flow = workflows.peek();
    flow.map((value) => {
        if(value["fid"] === id) {
            activeWorkFlow.value = {...value};
        }
    });
    activeFloweUpdated.value = generateUID();
    console.log("setting active workflow:",activeWorkFlow);
}
export {activeWorkFlow, workflows, workflownames, 
    CreateWorkflow, SetWorkFlowActive, flowTab, 
    UpdateActiveWorkflowNodes, HandleWorkFlowBlockDrop,UpdateActiveWorkflowEdges,
    activeFloweUpdated, activeworkFlowBlock, workflowsData
};