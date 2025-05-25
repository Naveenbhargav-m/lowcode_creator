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
  HasUnsavedChanges,
} from "./templates_state";
import { ModernSyncControls } from "../screen_builder/screen_components";

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
           {/* Modern Sync Controls - Replace the old UI */}
           <ModernSyncControls
            onDismissError={() => {}}
            syncMode={syncMode}
            setSyncMode={setSyncMode}
            isSyncing={isSyncing}
            isLoading={isLoading?.value}
            activeScreen={activeTamplate.value}
            screenNamesList={templateNamesList.value}
            unsavedCount={unsavedCount}
            activeScreenHasChanges={activeTemplateHasChanges}
            canSyncActive={canSyncActive}
            canSyncAll={canSyncAll}
            handleSync={handleSync}
            apiError={apiError?.value}
            showLegacySync={true}
            showProgressBar={true}
            compact={false}
          />
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