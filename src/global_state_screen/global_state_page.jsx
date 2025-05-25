import { SyncData } from "../api/api_syncer";
import { SyncButton } from "../components/generic/sync_button";
import { ScreenRightPanel } from "../screen_builder/screen_config_panel";
import { variableMap } from "../states/global_state";
import { VariableCreator } from "./components";

export function VariablesPage() {
    return (
      <div className="min-h-screen h-screen w-full bg-white flex">
        <div className="w-2/12 bg-white p-4 h-screen">
        </div>
  
        <div className="w-10/12 h-screen bg-background scrollable-div">
        <div style={{display:"flex", "flexDirection": "row", "justifyContent": "space-between", alignItems:"center"}}>
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