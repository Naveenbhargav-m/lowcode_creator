import { signal } from "@preact/signals";
import { generateUID } from "../utils/helpers";


let activeWorkFlow = signal({});
let workflows = signal([]);
let workflownames = signal([]);
let flowTab = signal("blocks");
let activeFloweUpdated = signal("");

function LoadWorkflows() {
    let jsonstr = localStorage.getItem("workflows");
    if(jsonstr === null || jsonstr === undefined) {
        return;
    }
    if(jsonstr.length === 0) {
        return;
    }
    let workflowObj = JSON.parse(jsonstr);
    if(workflowObj === undefined) {
        return;
    }
    let mylist = [];
    workflowObj.map((value) => {
        let obj = {"name": value["name"], "id": value["id"]};
        mylist.push(obj);
    })
    workflownames.value = [...mylist];
    workflows.value = [...workflowObj];
}

function UpdateActiveWorkflowNodes(updatedNodes) {
    let existingFlow = activeWorkFlow.peek(); // Avoid triggering reactivity
    if(existingFlow === undefined || updatedNodes === undefined) {
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
    activeWorkFlow.value = {
        ...existingFlow,
        nodes: nodes,
    };
    UpdateWorkflowsWithLatest(existingFlow);
}


function UpdateActiveWorkflowEdges(updatedEdges) {
    let existingFlow = activeWorkFlow.peek(); // Use peek() to avoid triggering reactivity
    if(existingFlow === undefined || updatedEdges === undefined) {
        return;
    }
    activeWorkFlow.value = {
        ...existingFlow,
        edges: updatedEdges,
    };
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
    let obj = {"name": name, "id": id,
         "nodes": [{"label":"start", "type":"start", "id": startID, "data": {"handles": [{"id":StarthandleID, "position": "bottom", "type": "source"}]},position: { x: 250, y: 250 }}, {"label":"end", "type":"end","id": endID, "data" :{ "handles": [{"id":stopHandleID, "position":"top", "type":"target"}]},position: { x: 350, y: 250 },}],
         "edges": []};
    let exist = workflows.peek();
    exist.push(obj);
    workflows.value = [...exist];
    let namesexists = workflownames.peek();
    namesexists.push(obj);
    workflownames.value = [...namesexists];
    localStorage.setItem("workflows", JSON.stringify(workflows));
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
    let newnode = {"label": name, "type":  operation, "id": newid , position: { x: 250, y: 250 }, data:{"handles": [...handles]}};
    let curFlow = activeWorkFlow.value;
    let nodes = curFlow["nodes"];
    let lastVal = curFlow["nodes"].pop();
    nodes.push(newnode);
    nodes.push(lastVal);
    curFlow["nodes"] = [...nodes];
    activeWorkFlow.value = {...curFlow};
    console.log("current flow:",curFlow);
    activeFloweUpdated.value = operation; 
    UpdateWorkflowsWithLatest(curFlow);
}



function SetWorkFlowActive(id) {
    let flow = workflows.peek();
    flow.map((value) => {
        if(value["id"] === id) {
            activeWorkFlow.value = {...value};
        }
    });
    activeFloweUpdated.value = id;
    console.log("setting active workflow:",activeWorkFlow);
}
LoadWorkflows();
export {activeWorkFlow, workflows, workflownames, 
    CreateWorkflow, SetWorkFlowActive, flowTab, 
    UpdateActiveWorkflowNodes, HandleWorkFlowBlockDrop,UpdateActiveWorkflowEdges,
    activeFloweUpdated,
};