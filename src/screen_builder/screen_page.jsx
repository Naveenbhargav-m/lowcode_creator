import { useEffect } from "preact/hooks";
import { TemplateView } from "../template_builder/template_builder_view";
import ScreenContainerArea2 from "./screen-areas_2";
import {TabComponent , VariableCreator} from "./screen_components";
import { ScreenRightPanel } from "./screen_config_panel";
import { ScreenLeftPanel } from "./screen_left_panel";
import { activeTab } from "./screen_state";
import ScreenBuilderArea from "./screen-areas_2";
import { TemplatePage } from "../template_builder/templates_page";

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
      <ScreenLeftPanel config={{ tabs_path: config["paths"], views_path: config["views_path"] }}
        value={{}}
        actions={{}}/>
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
export default ScreenPage;














