import { useEffect } from "preact/hooks";
import { ScreenRightPanel } from "./screen_config_panel";
import { ScreenLeftPanel } from "./screen_left_panel";
import { LoadScreens, screenNamesList, screenLeftTabSignal, screens } from "./screen_state";
import {ScreenBuilderArea} from "./screen-areas_2";
import { TemplateOptionTabs, TemplatePage } from "../template_builder/templates_page";
import { SyncButton } from "../components/generic/sync_button";
import { SyncData } from "../api/api_syncer";
import { useAuthCheck } from "../hooks/hooks";
import { ScreensListPanels } from "./screens_list";

let config = {
  paths: ["id", "tabs", "tab"],
  views_path: ["primitives", "containers", "templates", "my_templates","tab"],
};

let viewstyle = {
  "height": "95vh",
  "width": "95vw",
};

function ScreenPage() {

  useAuthCheck();
  // useEffect(() => {
  //   LoadForms();
  // },[]);


  return (
    <div className="min-h-screen h-screen w-full bg-white flex">
      <ScreenView />
    </div>
  );
}

function ScreenView() {

  useEffect(()=> {LoadScreens()}, []);
  return ( <div className="min-h-screen h-screen w-screen bg-white flex" style={{...viewstyle}}>
    <div className="w-2/12 bg-white p-4 h-screen">
    <div className="scrollable-div" style={{ flex: "0 0 auto" }}>
            <TemplateOptionTabs tabs={["screens", "components"]} onChange={(tab) => { screenLeftTabSignal.value = tab; console.log("templates list value:",screenLeftTabSignal.value); } }/>
            </div>
            {
                screenLeftTabSignal.value === "screens" ?
                <ScreensListPanels elementsList={screenNamesList.value}/>                :
                <ScreenLeftPanel config={{ tabs_path: config["paths"], views_path: config["views_path"] }}
                value={{}}
                actions={{}}/>
            }
    </div>

    <div className="w-7/12 h-screen bg-background scrollable-div">
    <div style={{display:"flex", "flexDirection": "row", "justifyContent": "space-between", alignItems:"center"}}>
    <SyncButton title={"sync"} onClick={(e) => {SyncData("_screens", screens);}} style={{marginRight:"40px"}}/>
    </div>
    <ScreenBuilderArea />
    </div>
    <div className="w-3/12 bg-white h-screen scrollable-div">
      <ScreenRightPanel />
    </div>
  </div>);
}


export {ScreenPage};