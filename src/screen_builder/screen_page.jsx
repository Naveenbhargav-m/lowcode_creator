import { useEffect } from "preact/hooks";
import { TemplateView } from "../template_builder/template_builder_view";
import ScreenContainerArea2 from "./screen-areas_2";
import {TabComponent , VariableCreator} from "./screen_components";
import { ScreenRightPanel } from "./screen_config_panel";
import { ScreenLeftPanel } from "./screen_left_panel";
import { activeScreen, activeTab, screenLeftnamesAndIds, screenLeftTabSignal } from "./screen_state";
import ScreenBuilderArea from "./screen-areas_2";
import { TemplateOptionTabs, TemplatePage } from "../template_builder/templates_page";

let config = {
  paths: ["id", "tabs", "tab"],
  views_path: ["primitives", "containers", "templates", "tab"],
};

function ScreenPage() {


  // useEffect(() => {
  //   LoadForms();
  // },[]);


  return (
    <div className="min-h-screen h-screen w-full bg-white flex">
      {activeTab.value == "Screen" ? 
      <ScreenView /> :activeTab.value == "Template" ?
       <TemplatepageView /> : activeTab.value == "Components" ?
        <ScreenView /> : <VariableView /> }
    </div>
  );
}


function TemplatepageView() {
  return (
    <TemplatePage />
  );
}


function VariableView() {
  return (
    <div className="min-h-screen h-screen w-full bg-white flex">
      <div className="w-2/12 bg-white p-4 h-screen">
        <ScreenLeftPanel config={{ tabs_path: config["paths"], views_path: config["views_path"] }}
          value={{}}
          actions={{}}/>
      </div>

      <div className="w-10/12 h-screen bg-background scrollable-div">
      <TabComponent />
      <VariableCreator />
      </div>
      <div className="w-2/12 bg-white h-screen scrollable-div">
        <ScreenRightPanel />
      </div>
    </div>
  );
}
function ScreenView() {
  return ( <div className="min-h-screen h-screen w-full bg-white flex">
    <div className="w-2/12 bg-white p-4 h-screen">
    <div className="scrollable-div" style={{ flex: "0 0 auto" }}>
            <TemplateOptionTabs tabs={["screens", "components"]} onChange={(tab) => { screenLeftTabSignal.value = tab; console.log("templates list value:",screenLeftTabSignal.value); } }/>
            </div>
            {
                screenLeftTabSignal.value === "screens" ?
                <ScreensList elementsList={screenLeftnamesAndIds.value} signal={activeScreen}/> :
                <ScreenLeftPanel config={{ tabs_path: config["paths"], views_path: config["views_path"] }}
                value={{}}
                actions={{}}/>
            }
    </div>

    <div className="w-10/12 h-screen bg-background scrollable-div">
    <TabComponent />
    <ScreenBuilderArea />
    </div>
    <div className="w-2/12 bg-white h-screen scrollable-div">
      <ScreenRightPanel />
    </div>
  </div>);
}



function ScreensList({elementsList, signal}) {
  return (
  <div class="scrollable-div pt-4">
      {elementsList.map((item) => {
          console.log("item:",item);
          return (
              <ScreenNameTile name={item["name"]} id={item["id"]} signal={signal}/>
          );
      })}
  </div>);
}


function ScreenNameTile({ name, id , signal}) {
  console.log("name:", name);

  const tileStyle = {
      padding: "10px",
      borderStyle: "solid",
      borderWidth: "1px",
      color:  signal.value == id ? "white":"black",
      backgroundColor :signal.value == id ? "black":"white",
      borderRadius: "20px",
      fontSize: "0.8em",
      margin: "8px 4px",
      borderColor: "#ccc", // Default border color
      transition: "border-color 0.3s ease-in-out", // Smooth transition
  };

  return (
      <div
          style={tileStyle}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#555")} // Darker on hover
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ccc")} // Back to default
          onClick={(e)=> {e.stopPropagation(); signal.value = id}}
      >
          <p>{name}</p>
      </div>
  );
}


export {ScreenPage, ScreensList, ScreenNameTile};