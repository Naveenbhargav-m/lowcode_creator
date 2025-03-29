import { useEffect } from "preact/hooks";
import { TemplateView } from "../template_builder/template_builder_view";
import {TabComponent , VariableCreator} from "./screen_components";
import { ScreenRightPanel } from "./screen_config_panel";
import { ScreenLeftPanel } from "./screen_left_panel";
import { activeScreen, activeTab, LoadScreens, screenLeftnamesAndIds, screenLeftTabSignal, screens, SetCurrentScreen } from "./screen_state";
import {ScreenBuilderArea} from "./screen-areas_2";
import { TemplateOptionTabs, TemplatePage } from "../template_builder/templates_page";
import { ThemePage } from "../theme_creator/theme_config_area";
import { SyncButton } from "../components/generic/sync_button";
import { SyncData } from "../api/api_syncer";
import { variableMap } from "../states/global_state";

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
        <ScreenView /> : activeTab.value === "Themes" ? <ThemePage /> : <VariableView /> }
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
      <div style={{display:"flex", "flexDirection": "row", "justifyContent": "space-between", alignItems:"center"}}>
                <TabComponent />
                <SyncButton title={"sync"} onClick={(e) => {SyncData("_global_states", variableMap);}} style={{marginRight:"40px"}}/>
            </div>
      <VariableCreator />
      </div>
      <div className="w-2/12 bg-white h-screen scrollable-div">
        <ScreenRightPanel />
      </div>
    </div>
  );
}
function ScreenView() {

  useEffect(()=> {LoadScreens()}, []);
  return ( <div className="min-h-screen h-screen w-full bg-white flex">
    <div className="w-2/12 bg-white p-4 h-screen">
    <div className="scrollable-div" style={{ flex: "0 0 auto" }}>
            <TemplateOptionTabs tabs={["screens", "components"]} onChange={(tab) => { screenLeftTabSignal.value = tab; console.log("templates list value:",screenLeftTabSignal.value); } }/>
            </div>
            {
                screenLeftTabSignal.value === "screens" ?
                <ScreensList elementsList={screenLeftnamesAndIds.value} signal={activeScreen} callBack={(id) => SetCurrentScreen()}/> :
                <ScreenLeftPanel config={{ tabs_path: config["paths"], views_path: config["views_path"] }}
                value={{}}
                actions={{}}/>
            }
    </div>

    <div className="w-10/12 h-screen bg-background scrollable-div">
    <div style={{display:"flex", "flexDirection": "row", "justifyContent": "space-between", alignItems:"center"}}>
    <TabComponent />
    <SyncButton title={"sync"} onClick={(e) => {SyncData("_screens", screens);}} style={{marginRight:"40px"}}/>
    </div>
    <ScreenBuilderArea />
    </div>
    <div className="w-2/12 bg-white h-screen scrollable-div">
      <ScreenRightPanel />
    </div>
  </div>);
}



function ScreensList({elementsList, signal, callBack = (id) => {}}) {
  return (
  <div class="scrollable-div pt-4">
      {elementsList.map((item) => {
          console.log("item:",item);
          return (
              <ScreenNameTile name={item["name"]} id={item["id"]} signal={signal} callBack={callBack}/>
          );
      })}
  </div>);
}


function ScreenNameTile({ name, id , signal, callBack = (id) => {}}) {

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
          onClick={(e)=> {e.stopPropagation(); signal.value = id; callBack(id)}}
      >
          <p>{name}</p>
      </div>
  );
}


export {ScreenPage, ScreensList, ScreenNameTile};