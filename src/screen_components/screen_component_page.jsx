


import { useEffect } from "preact/hooks";
import { SyncData } from "../api/api_syncer";
import { SyncButton } from "../components/generic/sync_button";
import { TabComponent } from "../screen_builder/screen_components";
import { ScreenLeftPanel, TabElement, Tabs } from "../screen_builder/screen_left_panel";
import { TemplateBuilderRightView } from "../template_builder/template_builder_right";
import { TemplatesListPanel } from "../template_builder/template_left_panel";
import { TemplateOptionTabs } from "../template_builder/templates_page";
import { componentNameList, componentPagesSignal, components } from "./screen_components";
import { ScreenComponentView } from "./screen_component_view";


let config = {
    paths: ["id", "tabs", "tab"],
    views_path: ["primitives", "containers", "templates", "tab"],
  };

function ScreenComponentPage() {
    useEffect((() => {
        // LoadTemplates();
    }), []);
    return (
        <div style={{display:"contents"}}>
            <div className="min-h-screen h-screen w-full bg-white flex">
            <div className="w-2/12 bg-white p-4 h-screen" style={{width:"18vw", height:"90vh"}}>
            <div className="scrollable-div" style={{ flex: "0 0 auto", "overflow": "hidden" }}>
            <TemplateOptionTabs tabs={["ui_components", "components"]} onChange={(tab) => { 
                componentPagesSignal.value = tab; 
                console.log("templates list value:",componentPagesSignal.value); } }/>
            </div>
            {
                componentPagesSignal.value === "ui_components" ?
                <TemplatesListPanel elementsList={componentNameList.value}/> :
                <ScreenLeftPanel config={{ tabs_path: config["paths"], views_path: config["views_path"] }}
                value={{}}
                actions={{}}/>
            }
            </div>

            <div className="w-10/12 h-screen bg-background scrollable-div" style={{width:"54vw"}}>
            <div style={{display:"flex", "flexDirection": "row", "justifyContent": "space-between", alignItems:"center"}}>
                <TabComponent />
                <SyncButton title={"sync"} onClick={(e) => {SyncData("_components", components);}} style={{marginRight:"40px"}}/>
            </div>
            <div><ScreenComponentView /></div>

            </div>
            <div className="w-2/12 bg-white h-screen scrollable-div" style={{"width":"28vw"}}>
                <TemplateBuilderRightView />
            </div>
            </div>
        </div>
    );
}




export {ScreenComponentPage};