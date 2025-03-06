import { signal } from "@preact/signals";
import { generateUID } from "../utils/helpers";


let activeWorkFlow = signal({});
let workflows = signal([]);
let workflownames = signal([]);
let flowTab = signal("blocks");

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
    activeWorkFlow.value = [...updatedNodes];
    let activeID = activeWorkFlow.peek()["id"];
    let flows = workflows.value;
    flows.map((flow1, ind) => {
        if(flow1["id"] === activeID) {
            flows[ind] = activeWorkFlow.peek();
        }
    })
    workflows.value = [...flows];
    localStorage.setItem("workflows", JSON.stringify(workflows));
} 
function CreateWorkflow(data) {
    let name = data["name"];
    let id = generateUID();
    let endID = generateUID();
    let startID = generateUID();
    let obj = {"name": name, "id": id,
         "nodes": [{"label":"start", "type":"start", "id": startID, position: { x: 250, y: 250 }}, {"label":"end", "type":"end","id": endID, position: { x: 350, y: 250 },}],
         "edges": [{"id": startID + "_"+ endID, "source": startID, "end": endID}]};
    let exist = workflows.peek();
    exist.push(obj);
    workflows.value = [...exist];
    let namesexists = workflownames.peek();
    namesexists.push(obj);
    workflownames.value = [...namesexists];
    localStorage.setItem("workflows", JSON.stringify(workflows));
}


function SetWorkFlowActive(id) {
    let flow = workflows.peek();
    flow.map((value) => {
        if(value["id"] === id) {
            activeWorkFlow.value = {...value};
        }
    })
}
LoadWorkflows();
export {activeWorkFlow, workflows, workflownames, CreateWorkflow, SetWorkFlowActive, flowTab, UpdateActiveWorkflowNodes};