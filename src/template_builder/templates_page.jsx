import { TabComponent } from "../screen_builder/screen_components";
import { ScreenRightPanel } from "../screen_builder/screen_config_panel";
import { ScreenLeftPanel, TabElement, Tabs } from "../screen_builder/screen_left_panel";
import { TemplateView } from "./template_builder_view";
import { TemplatesListPanel } from "./template_left_panel";
import { templateNamesList, templatesPagesSignal } from "./templates_state";


let config = {
    paths: ["id", "tabs", "tab"],
    views_path: ["primitives", "containers", "templates", "tab"],
  };

function TemplatePage() {
    return (
        <div style={{display:"contents"}}>
            <div className="min-h-screen h-screen w-full bg-white flex">
            <div className="w-2/12 bg-white p-4 h-screen">
            <div className="scrollable-div" style={{ flex: "0 0 auto" }}>
            <TemplateOptionTabs tabs={["templates", "components"]} onChange={(tab) => { templatesPagesSignal.value = tab; console.log("templates list value:",templatesPagesSignal.value); } }/>
            </div>
            {
                templatesPagesSignal.value === "templates" ?
                <TemplatesListPanel elementsList={templateNamesList.value}/> :
                <ScreenLeftPanel config={{ tabs_path: config["paths"], views_path: config["views_path"] }}
                value={{}}
                actions={{}}/>
            }
            </div>

            <div className="w-10/12 h-screen bg-background scrollable-div">
            <TabComponent />
            <TemplateView />

            </div>
            <div className="w-2/12 bg-white h-screen scrollable-div">
                <ScreenRightPanel />
            </div>
            </div>
        </div>
    );
}


function TemplateOptionTabs( {tabs ,onChange}) {
    return (
        <TabElement
        config={{ "tabs": tabs, init:1, elementStyle: { "font-size": "16px" } }}
        actions={{"onChange": onChange}}
        />
    );
}

export {TemplatePage, TemplateOptionTabs};