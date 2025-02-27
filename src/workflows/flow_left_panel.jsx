import { useContext } from "preact/hooks";
import { BuilderContext } from "react-flow-builder";
import DynamicIcon from "../components/custom/dynamic_icon";
import { activeWorkFlow, CreateWorkflow, flowTab, SetWorkFlowActive, workflownames } from "./workflow_state";
import { TemplateOptionTabs } from "../template_builder/templates_page";
import { CreateFormButton } from "../template_builder/template_builder_view";



const icons = [
    "database",
    "database",
    "parentheses",
    "workflow",
];

function WorkflowsList({onDragStart ,onDragEnd}) {
  return (
           <div className="w-2/12 bg-white p-4" style={{height:"93%"}}>
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
        {flowTab.value === "blocks" ?   <DragComponent onDragEnd={onDragEnd} onDragStart={onDragStart}/> :
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
  let bgcolor = obj["id"] === activeWorkFlow.value["id"] ? "black" : "white";
  let textColor = obj["id"] === activeWorkFlow.value["id"] ? "white" : "black"
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

function DragComponent( {    
    onDragStart ,
    onDragEnd ,
  } ) {  
    const { registerNodes } = useContext ( BuilderContext ) ;   
  
    return ( 
      < div className = " custom-drag-list "> 
        { registerNodes.filter( ( item ) => ! item . isStart && ! item . isEnd ).map ( ( item , ind) => {
            console.log("ind", ind);
           return (
            < div
            style={{"display":"flex", "flexDirection":"row",backgroundColor:"black", "fontSize":"0.8em",margin:"10px 20px", padding:"20px", borderRadius:"20px"}}
              key = {ind}
              className = " custom-drag-item "
              draggable
              onDragStart = { ( ) => onDragStart ( item . type ) }  
              onDragEnd = { onDragEnd }
            >
              <DynamicIcon name={icons[ind]} size={20}/>
              { item.name }
            </ div >
           ); 
        } ) }
      </ div >
    ) ;
  } ;

export {DragComponent, WorkflowsList};