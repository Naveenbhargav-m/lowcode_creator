import { useContext } from "preact/hooks";
import DynamicIcon from "../components/custom/dynamic_icon";
import { activeWorkFlow, CreateWorkflow, flowTab, SetWorkFlowActive, workflownames } from "./workflow_state";
import { TemplateOptionTabs } from "../template_builder/templates_page";
import { CreateFormButton } from "../template_builder/template_builder_view";
import { Draggable } from "../components/custom/Drag";



const icons = [
    "database",
    "database",
    "parentheses",
    "workflow",
];

function WorkflowsList() {
  return (
           <div>
            <CreateFormButton
             formLabel={"New Flow"} 
             placeHolder={"Flow Name:"} 
             buttonLabel={"Create"} 
             callback={(data) => { CreateWorkflow(data)}}/>
          <div className="scrollable-div" style={{ flex: "0 0 auto" }}>
              <TemplateOptionTabs tabs={["flows", "blocks"]} onChange={(tab) => { 
                  flowTab.value = tab; 
                  console.log("flow tab:",flowTab.value); } }/>
              </div>
        {flowTab.value === "blocks" ?   <DragComponent /> :
          <WorkflowsListPanel />
        }
    </div>
  );
}


function WorkflowsListPanel() {
    return(
      <div style={{backgroundColor:"white", color:"black", width:"100%", height:"100%"}}>
          {workflownames.value.map((value) => {
              return (
                <WorkflowNameTile obj={value}/>
              );
          })}
      </div>
    );
}

function WorkflowNameTile({ obj }) {
  let bgcolor = obj["id"] === activeWorkFlow.value["fid"] ? "black" : "white";
  let textColor = obj["id"] === activeWorkFlow.value["fid"] ? "white" : "black"
  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: bgcolor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        border:"2px solid black",
        borderRadius:"20px"
      }}
      onClick={() => SetWorkFlowActive(obj["id"])}
    >
      <p style={{ color: textColor, textAlign: "center", margin: 0 }}>
        {obj["name"]}
      </p>
    </div>
  );
}

function DragComponent( ) {  
  let registerNodes = [
    {"name": "Insert Row", "type":"insert_row", "handles":[{"position": "bottom", "type":"source"}, {"position": "top", "type":"target"}]}, 
    {"name":"update Row", "type":"update_row","handles":[{"position": "bottom","type":"source"}, {"position": "top","type":"target"}]}, 
    {"name":"condition", "type":"condition","handles":[{"position": "bottom","type":"source"}, {"position": "top","type":"target"}]},];
    return ( 
      < div className = " custom-drag-list " style={{color:"white"}}> 
        { registerNodes.map ( ( item , ind) => {
            console.log("ind", ind);
           return (
            <Draggable onDragStart={(data) => {console.log("drag data:",data);}} data={{...item}}>
            < div
            style={{"display":"flex", "flexDirection":"row",backgroundColor:"black", "fontSize":"0.8em",margin:"10px 0px", padding:"18px", borderRadius:"20px"}}
              key = {ind}
              className = " custom-drag-item "
            >
              <div style={{"padding":"0px 4px",color:"white"}}><DynamicIcon name={icons[ind]} size={20}/></div>
              { item.name }
            </ div >
            </Draggable>
           ); 
        } ) }
      </ div >
    ) ;
  } ;

export {DragComponent, WorkflowsList};