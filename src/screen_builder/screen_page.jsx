import { useEffect, useState } from "preact/hooks";
import { ScreenRightPanel } from "./screen_config_panel";
import { ScreenLeftPanel } from "./screen_left_panel";
import { 
  activeScreen, 
  LoadScreens, 
  screenNamesList, 
  screenLeftTabSignal, 
  screens,
  SyncActiveScreen,
  SyncAllUnsavedScreens,
  unsavedScreens,
  isLoading,
  apiError,
  HasUnsavedChanges,
  DeleteScreen,
  CreatenewScreen,
  SetCurrentScreen
} from "./screen_state";
import { ScreenBuilderArea } from "./screen-areas_2";
import { TemplateOptionTabs } from "../template_builder/templates_page";
import { SyncButton } from "../components/generic/sync_button";
import { SyncData } from "../api/api_syncer";
import { useAuthCheck } from "../hooks/hooks";
import { ScreensListPanels } from "./screens_list";
import { ModernSyncControls } from "./screen_components"; // Import the new component

const CONFIG = {
  paths: ["id", "tabs", "tab"],
  views_path: ["primitives", "containers", "templates", "my_templates", "tab"],
};

const viewstyle = {
  "height": "95vh",
  "width": "95vw",
};

function ScreenPage() {
  useAuthCheck();
  const [syncMode, setSyncMode] = useState("active"); // "active" or "all"
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    LoadScreens();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      if (syncMode === "active") {
        await SyncActiveScreen();
      } else {
        await SyncAllUnsavedScreens();
      }
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLegacySync = () => {
    SyncData("_screens", screens);
  };

  const handleDismissError = () => {
    if (apiError) {
      apiError.value = null;
    }
  };

  // Calculate sync status
  const unsavedCount = unsavedScreens?.value?.size || 0;
  const activeScreenHasChanges = activeScreen.value && HasUnsavedChanges(activeScreen.value);
  const canSyncActive = activeScreen.value && activeScreenHasChanges;
  const canSyncAll = unsavedCount > 0;

  return (
    <div className="min-h-screen h-screen w-full bg-white flex">
      <div className="min-h-screen h-screen w-screen bg-white flex" style={{...viewstyle}}>
        {/* Left Panel */}
        <div 
          className="w-2/12 bg-white p-4 h-screen" 
          style={{ width: "18vw", height: "90vh" }}
        >
          <div 
            className="scrollable-div" 
            style={{ flex: "0 0 auto", overflow: "hidden" }}
          >
            <TemplateOptionTabs 
              tabs={["screens", "components"]} 
              onChange={(tab) => { 
                screenLeftTabSignal.value = tab; 
                console.log("Screen list value:", screenLeftTabSignal.value); 
              }} 
            />
          </div>
          
          {screenLeftTabSignal.value === "screens" ? (
            <ScreensListPanels 
              activeScreen={activeScreen.value}
              screens={screens}
              onDeleteScreen={DeleteScreen}
              onCreateScreen={CreatenewScreen}
              onScreenSelect={SetCurrentScreen}
              hasUnsavedChanges={HasUnsavedChanges}
             />
          ) : (
            <ScreenLeftPanel 
              config={{ 
                tabs_path: CONFIG.paths, 
                views_path: CONFIG.views_path 
              }}
              value={{}}
              actions={{}}
            />
          )}
        </div>

        {/* Center Panel */}
        <div 
          className="w-7/12 h-screen bg-background scrollable-div"
          style={{ width: "54vw" }}
        >
          {/* Modern Sync Controls - Replace the old UI */}
          <ModernSyncControls
            syncMode={syncMode}
            setSyncMode={setSyncMode}
            isSyncing={isSyncing}
            isLoading={isLoading?.value}
            activeScreen={activeScreen.value}
            screenNamesList={screenNamesList.value}
            unsavedCount={unsavedCount}
            activeScreenHasChanges={activeScreenHasChanges}
            canSyncActive={canSyncActive}
            canSyncAll={canSyncAll}
            handleSync={handleSync}
            handleLegacySync={handleLegacySync}
            apiError={apiError?.value}
            onDismissError={handleDismissError}
            showLegacySync={true}
            showProgressBar={true}
            compact={false}
          />

          {/* Screen Builder Area */}
          <ScreenBuilderArea />
        </div>

        {/* Right Panel */}
        <div 
          className="w-3/12 bg-white h-screen scrollable-div"
          style={{ width: "28vw" }}
        >
          <ScreenRightPanel />
        </div>
      </div>
    </div>
  );
}

function ScreenView() {
  useEffect(() => { LoadScreens() }, []);
  
  return (
    <div className="min-h-screen h-screen w-screen bg-white flex" style={{...viewstyle}}>
      <div className="w-2/12 bg-white p-4 h-screen">
        <div className="scrollable-div" style={{ flex: "0 0 auto" }}>
          <TemplateOptionTabs 
            tabs={["screens", "components"]} 
            onChange={(tab) => { 
              screenLeftTabSignal.value = tab; 
              console.log("templates list value:", screenLeftTabSignal.value); 
            }} 
          />
        </div>
        {
          screenLeftTabSignal.value === "screens" ?
          <ScreensListPanels 
          activeScreen={activeScreen.value}
          screens={screens}
          onDeleteScreen={DeleteScreen}
          onCreateScreen={CreatenewScreen}
          onScreenSelect={SetCurrentScreen}
          hasUnsavedChanges={HasUnsavedChanges}
         />
            :
            <ScreenLeftPanel 
              config={{ tabs_path: CONFIG["paths"], views_path: CONFIG["views_path"] }}
              value={{}}
              actions={{}}
            />
        }
      </div>

      <div className="w-7/12 h-screen bg-background scrollable-div">
        {/* Keep the simple sync for ScreenView */}
        <div style={{display:"flex", "flexDirection": "row", "justifyContent": "space-between", alignItems:"center"}}>
          <SyncButton title={"sync"} onClick={(e) => {SyncData("_screens", screens);}} style={{marginRight:"40px"}}/>
        </div>
        <ScreenBuilderArea />
      </div>
      
      <div className="w-3/12 bg-white h-screen scrollable-div">
        <ScreenRightPanel />
      </div>
    </div>
  );
}

export { ScreenPage, ScreenView };