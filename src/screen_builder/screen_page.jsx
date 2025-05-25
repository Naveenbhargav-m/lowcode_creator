import { useEffect, useState } from "preact/hooks";
import { ScreenRightPanel } from "./screen_config_panel";
import { ScreenLeftPanel } from "./screen_left_panel";
import { 
  activeScreen, 
  activeTab, 
  LoadScreens, 
  screenNamesList, 
  screenLeftTabSignal, 
  screens,
  SyncActiveScreen,
  SyncAllUnsavedScreens,
  unsavedScreens,
  isLoading,
  apiError,
  HasUnsavedChanges
} from "./screen_state";
import { ScreenBuilderArea } from "./screen-areas_2";
import { TemplateOptionTabs } from "../template_builder/templates_page";
import { SyncButton } from "../components/generic/sync_button";
import { SyncData } from "../api/api_syncer";
import { useAuthCheck } from "../hooks/hooks";
import { ScreensListPanels } from "./screens_list";

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
            <ScreensListPanels elementsList={screenNamesList.value} />
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
          {/* Sync Controls */}
          <div 
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
              borderBottom: "1px solid #e5e7eb"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* Sync Mode Toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <label style={{ fontSize: "0.875rem", color: "#374151" }}>
                  Sync mode:
                </label>
                <select
                  value={syncMode}
                  // @ts-ignore
                  onChange={(e) => setSyncMode(e.target.value)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid #d1d5db",
                    fontSize: "0.875rem"
                  }}
                >
                  <option value="active">Active Screen</option>
                  <option value="all">All Unsaved ({unsavedCount})</option>
                </select>
              </div>

              {/* Sync Status */}
              {unsavedCount > 0 && (
                <div 
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#fef3c7",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    color: "#92400e"
                  }}
                >
                  {unsavedCount} screen{unsavedCount > 1 ? 's' : ''} with unsaved changes
                </div>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Sync Button */}
              <SyncButton
                title={
                  isSyncing 
                    ? "Syncing..." 
                    : syncMode === "active" 
                      ? "Sync Active" 
                      : `Sync All (${unsavedCount})`
                }
                onClick={handleSync}
                // @ts-ignore
                disabled={
                  isSyncing || 
                  isLoading?.value || 
                  (syncMode === "active" && !canSyncActive) ||
                  (syncMode === "all" && !canSyncAll)
                }
                style={{
                  opacity: (
                    isSyncing || 
                    isLoading?.value || 
                    (syncMode === "active" && !canSyncActive) ||
                    (syncMode === "all" && !canSyncAll)
                  ) ? 0.5 : 1,
                  cursor: (
                    isSyncing || 
                    isLoading?.value || 
                    (syncMode === "active" && !canSyncActive) ||
                    (syncMode === "all" && !canSyncAll)
                  ) ? "not-allowed" : "pointer"
                }}
              />

              {/* Legacy Sync Button (fallback) */}
              <SyncButton 
                title={"Legacy Sync"} 
                onClick={(e) => {SyncData("_screens", screens);}} 
                style={{
                  marginLeft: "8px",
                  fontSize: "0.75rem",
                  padding: "4px 8px"
                }}
              />

              {/* Active Screen Indicator */}
              {activeScreen.value && (
                <div 
                  style={{
                    padding: "4px 8px",
                    backgroundColor: activeScreenHasChanges ? "#fef3c7" : "#f0f9ff",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    color: activeScreenHasChanges ? "#92400e" : "#1e40af",
                    border: `1px solid ${activeScreenHasChanges ? "#fcd34d" : "#93c5fd"}`
                  }}
                >
                  Active: {screenNamesList.value.find(s => s.id === activeScreen.value)?.name || "Unknown"}
                  {activeScreenHasChanges && " •"}
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {apiError?.value && (
            <div style={{
              margin: "16px",
              padding: "12px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "6px",
              color: "#dc2626"
            }}>
              <strong>Error:</strong> {apiError.value}
            </div>
          )}

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
            <ScreensListPanels elementsList={screenNamesList.value} /> :
            <ScreenLeftPanel 
              config={{ tabs_path: CONFIG["paths"], views_path: CONFIG["views_path"] }}
              value={{}}
              actions={{}}
            />
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
    </div>
  );
}

export { ScreenPage, ScreenView };