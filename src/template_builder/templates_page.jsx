// template_page.jsx
import { useEffect, useState } from "preact/hooks";
import { SyncButton } from "../components/generic/sync_button";
import { ScreenLeftPanel, TabElement } from "../screen_builder/screen_left_panel";
import { TemplateBuilderRightView } from "./template_builder_right";
import { TemplateView } from "./template_builder_view";
import { TemplatesListPanel } from "./template_left_panel";
import { 
  LoadTemplates, 
  templateNamesList, 
  templatesPagesSignal,
  SyncActiveTemplate,
  SyncAllUnsavedTemplates,
  unsavedTemplates,
  isLoading,
  apiError,
  activeTamplate,
  HasUnsavedChanges
} from "./templates_state";

const CONFIG = {
  paths: ["id", "tabs", "tab"],
  views_path: ["primitives", "containers", "templates", "tab"],
};

function TemplatePage() {
  const [syncMode, setSyncMode] = useState("active"); // "active" or "all"
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    LoadTemplates();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      if (syncMode === "active") {
        await SyncActiveTemplate();
      } else {
        await SyncAllUnsavedTemplates();
      }
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const unsavedCount = unsavedTemplates.value.size;
  const activeTemplateHasChanges = activeTamplate.value && HasUnsavedChanges(activeTamplate.value);
  const canSyncActive = activeTamplate.value && activeTemplateHasChanges;
  const canSyncAll = unsavedCount > 0;

  return (
    <div style={{ display: "contents" }}>
      <div className="min-h-screen h-screen w-full bg-white flex">
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
              tabs={["templates", "components"]} 
              onChange={(tab) => { 
                templatesPagesSignal.value = tab; 
                console.log("Templates list value:", templatesPagesSignal.value); 
              }} 
            />
          </div>
          
          {templatesPagesSignal.value === "templates" ? (
            <TemplatesListPanel elementsList={templateNamesList.value} />
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
          className="w-10/12 h-screen bg-background scrollable-div" 
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
                  <option value="active">Active Template</option>
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
                  {unsavedCount} template{unsavedCount > 1 ? 's' : ''} with unsaved changes
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
                  isLoading.value || 
                  (syncMode === "active" && !canSyncActive) ||
                  (syncMode === "all" && !canSyncAll)
                }
                style={{
                  opacity: (
                    isSyncing || 
                    isLoading.value || 
                    (syncMode === "active" && !canSyncActive) ||
                    (syncMode === "all" && !canSyncAll)
                  ) ? 0.5 : 1,
                  cursor: (
                    isSyncing || 
                    isLoading.value || 
                    (syncMode === "active" && !canSyncActive) ||
                    (syncMode === "all" && !canSyncAll)
                  ) ? "not-allowed" : "pointer"
                }}
              />

              {/* Active Template Indicator */}
              {activeTamplate.value && (
                <div 
                  style={{
                    padding: "4px 8px",
                    backgroundColor: activeTemplateHasChanges ? "#fef3c7" : "#f0f9ff",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    color: activeTemplateHasChanges ? "#92400e" : "#1e40af",
                    border: `1px solid ${activeTemplateHasChanges ? "#fcd34d" : "#93c5fd"}`
                  }}
                >
                  Active: {templateNamesList.value.find(t => t.id === activeTamplate.value)?.name || "Unknown"}
                  {activeTemplateHasChanges && " •"}
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {apiError.value && (
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

          {/* Template View */}
          <TemplateView />
        </div>

        {/* Right Panel */}
        <div 
          className="w-2/12 bg-white h-screen scrollable-div" 
          style={{ width: "28vw" }}
        >
          <TemplateBuilderRightView />
        </div>
      </div>
    </div>
  );
}

function TemplateOptionTabs({ tabs, onChange }) {
  return (
    <TabElement
      config={{ 
        tabs: tabs, 
        init: 1, 
        elementStyle: { "font-size": "16px" } 
      }}
      actions={{ onChange: onChange }}
    />
  );
}

export { TemplatePage, TemplateOptionTabs };