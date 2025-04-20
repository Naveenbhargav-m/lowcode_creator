import { signal } from "@preact/signals";
import { Popup } from "../form_builder/configs_view/advanced_form";
import { dbViewSignal } from "../table_builder/table_builder_state";
import { TablesTab } from "../table_builder/tables_page";
import { TablesButtonsBar } from "./buttonBar";
import { InitViews, RunViewCode } from "./view_api";
import { views } from "./views_state";
import { useEffect } from "preact/hooks";

const popupOpen = signal(false);
function handleViewCreate() {
    popupOpen.value = true;

}

function ViewArea() {

    useEffect((()=> {
        InitViews();
    }), []);
    return (
    <div className="w-4/6 h-screen bg-background min-h-screen mx-4"
     style={{"display":"flex", "flexDirection":"column", "alignItems":"center"}}>
        <div style={{display:"flex", width:"90%", flexDirection:"row", paddingTop:"20px", justifyContent:"space-between", alignItems:"center", "alignSelf":"center"}}>
            <TablesTab onTableSelect={(tab) => dbViewSignal.value = tab}/>
            <div style={{height:"inherit",paddingLeft:"30px"}}>
            <TablesButtonsBar 
            configs={{"buttons":["Create View"], "callbacks":[handleViewCreate]}}
            />
            </div>
        </div>
       <div style={{"display":"flex", "flexDirection":"row","backgroundColor":"white", borderRadius:"20px",height:"80%", width:"90%" ,marginTop:"30px" }}>
                {views.value.map((item) => {
                    return (
                        <div style={{"padding":"0px 0px","margin":"10px",backgroundColor:"white", "height":"40%","width":"30%",border:"2px solid black", borderRadius:"20px"}}>
                            <div style={{"padding":"4px 8px", "color":"black", "backgroundColor":"#C0EBA6", "borderRadius":"20px"}}>
                            {item.view_name}
                            </div>
                            <div style={{"padding":"4px 8px", "color":"black"}}>
                                {item.view_columns.map((column) => {
                                   return(
                                    <div style={{"padding":"4px 0px","display":"flex", "flexDirection":"row", "alignItems":"center", "justifyContent":"space-between"}}>
                                    <div style={{padding:"0px 4px"}}>
                                        <span>{column.name}</span>
                                    </div>
                                    <div style={{padding:"0px 4px"}}>
                                    <span>{column.type}</span>
                                    </div>
                                </div>
                                   );
                                })}
                            </div>
                        </div>
                    );
                })}
       </div>
       <Popup 
        isOpen={popupOpen.value}
        onClose={() => popupOpen.value = false}
        onSubmit={(value) => RunViewCode(value)}
        value={"CREATE OR REPLACE VIEW "}
        label={"Create View"}
        closeText={"Cancel"}
        submitText={"Create"}
       />
    </div>
    );
}

export {ViewArea};