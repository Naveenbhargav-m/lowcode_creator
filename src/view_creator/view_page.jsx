import { signal } from "@preact/signals";
import { Popup } from "../form_builder/configs_view/advanced_form";
import { dbViewSignal } from "../table_builder/table_builder_state";
import { TablesTab } from "../table_builder/tables_page";
import { TablesButtonsBar } from "./buttonBar";
import { RunViewCode } from "./view_api";

const popupOpen = signal(false);
function handleViewCreate() {
    popupOpen.value = true;

}

function ViewArea() {
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
       <div style={{"backgroundColor":"white", borderRadius:"20px",height:"80%", width:"90%" ,marginTop:"30px" }}>
                this is others
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