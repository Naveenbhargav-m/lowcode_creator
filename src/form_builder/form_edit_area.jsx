import { Drop } from "../components/custom/Drop";
import { DesktopMockup } from "../screen_builder/screen_components";
import { FormBuilderLeftPanel } from "./form_builder_left";

import { SwapChildrenBasedonView, AddtoElements, CreateNewForm, currentForm, currentFormConfig, formActiveElement, formActiveLeftTab, formBuilderView, formLeftNamesList, formRenderSignal, setCurrentForm, forms, LoadForms, DeleteForm } from "./form_builder_state";
import MobileMockup from "../components/custom/mobile_mockup";
import { CreateAndbuttonbar } from "../screen_builder/screen-areas_2";
import { TemplateOptionTabs } from "../template_builder/templates_page";
import { useEffect, useState } from "preact/hooks";
import { SyncButton } from "../components/generic/sync_button";
import { SyncData } from "../api/api_syncer";
import { useAuthCheck } from "../hooks/hooks";
import { DynamicForm } from "./form_renderer/dynamic_form";
import { FormBuilderRightPanel } from "./form_right_elements";

function EditArea() {
    useEffect((
      ()=> {
        LoadForms();
      }
    ),[]);
    return (
    <div>
       <div style={{display:"flex", "flexDirection": "row", "justifyContent": "space-between", alignItems:"center"}}>
      <CreateAndbuttonbar 
         iconNames={["smartphone", "app-window-mac"]} 
         onIconChange={(name) => {formBuilderView.value = name; SwapChildrenBasedonView(formBuilderView.value);}}
         formLabel={"Create New Form"}
         placeHolder={"Form Name:"}
         buttonLabel={"Create Form"}
         buttonCallBack={(data) => {CreateNewForm (data);}}
         showCreateButton={false}
      />
            </div>
      <div style={{height:"94vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
      {formBuilderView.value == "smartphone" ? <FormEditMobileView /> : <FormEditDesktopView />}
      </div>
      </div>
  );
  }


  function FormEditMobileView() {
    let temp = currentFormConfig.value;
   let curScreen = currentForm.value;
    let style = {"display":"content"};
    if(curScreen !== undefined && curScreen !== "") {
      style = forms[curScreen]["mobile_style"];
    }
    let values = temp;
    return (
      <MobileMockup>
    <div
       style={{
        color:"black",
         width: "100%",
         height: "100%",
         backgroundColor: "#f9f9f9",
         border: "1px solid #e0e0e0",
         scrollbarWidth: "none",
         msOverflowStyle: "none",
       }}
       className="scrollable-div"
     >
      <Drop 
          wrapParent={true}
          onDrop={(data) => {AddtoElements(data)}}
          dropElementData={{ "id":"screen" }}
       >
        <div style={style} onClick={(e) => {e.stopPropagation();formActiveElement.value = "form" }}>
          {formRenderSignal.value && <DynamicForm formConfig={values}/>}
          </div>
      </Drop>
      </div>
      </MobileMockup>
    );
  }
  
  
  function FormEditDesktopView() {
    let temp = currentFormConfig.value;
    let values = temp;
    let curScreen = currentForm.value;
    let style = {"display":"content"};
    if(curScreen !== undefined && curScreen !== "") {
      style = forms[curScreen]["desktop_style"];
    }


    return (
      <DesktopMockup>
    <div
       style={{
        color:"black",
         width: "100%",
         height: "100%",
         backgroundColor: "#f9f9f9",
         border: "1px solid #e0e0e0",
         scrollbarWidth: "none",
         msOverflowStyle: "none",
         "display": "flex",
         "flexDirection": "column"
       }}
       className="scrollable-div"
     >
      <Drop
        wrapParent={true} 
         onDrop={(data) => {AddtoElements(data)}}
         dropElementData={{ "id":"screen" }}
       >
        <div style={style} onClick={(e) => {formActiveElement.value = "form" }}>
          {formRenderSignal.value && <DynamicForm formConfig={values}/>}
          </div>
      </Drop>
      </div>
      </DesktopMockup>
    );
  }
  



  // form_builder_page.jsx

import { globalStyle } from "../styles/globalStyle";
import { ModernSyncControls } from "../screen_builder/screen_components";

import {
  SyncActiveForm,
  SyncAllUnsavedForms,
  unsavedForms,
  isLoading,
  apiError,
  HasUnsavedChanges,
} from "./form_builder_state";

function FormBuilderPage() {
  useAuthCheck();
  
  const [syncMode, setSyncMode] = useState("active"); // "active" or "all"
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    LoadForms();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      if (syncMode === "active") {
        await SyncActiveForm();
      } else {
        await SyncAllUnsavedForms();
      }
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDismissError = () => {
    // You might want to implement a way to clear the error in your state
    console.log("Error dismissed");
  };

  const unsavedCount = unsavedForms.value.size;
  const activeFormHasChanges = currentForm.value && HasUnsavedChanges(currentForm.value);
  const canSyncActive = currentForm.value && activeFormHasChanges;
  const canSyncAll = unsavedCount > 0;

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
      ...globalStyle
    }}>
      {/* Left Panel - Forms List and Components */}
      <div style={{
        width: "300px",
        minWidth: "300px",
        height: "100vh",
        borderRight: "1px solid #e5e7eb",
        backgroundColor: "#ffffff",
        boxShadow: "2px 0 4px rgba(0, 0, 0, 0.05)",
        zIndex: 10,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Tab Navigation */}
        <div style={{
          flexShrink: 0,
          padding: "16px",
          borderBottom: "1px solid #e5e7eb"
        }}>
          <TemplateOptionTabs 
            tabs={["forms", "components"]} 
            onChange={(tab) => { 
              formActiveLeftTab.value = tab;
              console.log("templates list value:", formBuilderView.value); 
            }}
          />
        </div>
        
        {/* Content Area */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {formActiveLeftTab.value === "forms" ? (
            <div style={{ padding: "16px" }}>
              <FormsList />
            </div>
          ) : (
            <FormBuilderLeftPanel />
          )}
        </div>
      </div>

      {/* Center Panel - Edit Area */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        minWidth: 0
      }}>
        {/* Sync Controls Bar */}
        <div style={{
          flexShrink: 0,
          borderBottom: "1px solid #e5e7eb",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
          zIndex: 5
        }}>
          <ModernSyncControls
            onDismissError={handleDismissError}
            syncMode={syncMode}
            setSyncMode={setSyncMode}
            isSyncing={isSyncing}
            isLoading={isLoading?.value}
            activeScreen={currentForm.value}
            screenNamesList={formLeftNamesList.value}
            unsavedCount={unsavedCount}
            activeScreenHasChanges={activeFormHasChanges}
            canSyncActive={canSyncActive}
            canSyncAll={canSyncAll}
            handleSync={handleSync}
            apiError={apiError?.value}
            showLegacySync={true}
            showProgressBar={true}
            compact={false}
          />
        </div>

        {/* Main Edit Area */}
        <div style={{
          flex: 1,
          overflow: "auto",
          backgroundColor: "#f8fafc"
        }}>
          <EditArea />
        </div>
      </div>

      {/* Right Panel - Properties */}
      <div style={{
        width: "320px",
        minWidth: "320px",
        height: "100vh",
        borderLeft: "1px solid #e5e7eb",
        marginRight: "100px",
        backgroundColor: "#ffffff",
        boxShadow: "-2px 0 4px rgba(0, 0, 0, 0.05)",
        overflow: "auto"
      }}>
        <FormBuilderRightPanel />
      </div>

      {/* Enhanced Loading Overlay */}
      {isLoading.value && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(2px)"
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "32px 40px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            maxWidth: "300px",
            textAlign: "center"
          }}>
            <div style={{ 
              display: "flex", 
              flexDirection: "column",
              alignItems: "center", 
              gap: "16px" 
            }}>
              {/* Enhanced Loading Spinner */}
              <div style={{
                width: "32px",
                height: "32px",
                border: "3px solid #e5e7eb",
                borderTop: "3px solid #3b82f6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }}></div>
              <div>
                <div style={{ 
                  fontSize: "16px", 
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "4px"
                }}>
                  Loading Forms
                </div>
                <div style={{ 
                  fontSize: "14px", 
                  color: "#6b7280" 
                }}>
                  Please wait...
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animation for spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Forms List Component for the left panel
function FormsList() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFormName, setNewFormName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateForm = async () => {
    if (!newFormName.trim()) return;
    
    setIsCreating(true);
    try {
      await CreateNewForm({ name: newFormName.trim() });
      setNewFormName("");
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create form:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteForm = async (formId, formName) => {
    if (confirm(`Are you sure you want to delete "${formName}"?`)) {
      try {
        await DeleteForm(formId);
      } catch (error) {
        console.error("Failed to delete form:", error);
      }
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px"
      }}>
        <h3 style={{
          fontSize: "18px",
          fontWeight: "600",
          color: "#1f2937",
          margin: 0
        }}>
          Forms
        </h3>
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            padding: "6px 12px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          + New
        </button>
      </div>

      {/* Create Form Modal/Inline */}
      {showCreateForm && (
        <div style={{
          padding: "16px",
          backgroundColor: "#f8fafc",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          marginBottom: "16px"
        }}>
          <input
            type="text"
            placeholder="Form name"
            value={newFormName}
            // @ts-ignore
            onChange={(e) => setNewFormName(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              marginBottom: "12px",
              fontSize: "14px"
            }}
            disabled={isCreating}
          />
          <div style={{
            display: "flex",
            gap: "8px",
            justifyContent: "flex-end"
          }}>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewFormName("");
              }}
              style={{
                padding: "6px 12px",
                backgroundColor: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer"
              }}
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateForm}
              style={{
                padding: "6px 12px",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer"
              }}
              disabled={isCreating || !newFormName.trim()}
            >
              {isCreating ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      )}

      {/* Forms List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {formLeftNamesList.value.map((form) => (
          <div
            key={form.id}
            style={{
              padding: "12px",
              backgroundColor: currentForm.value === form.id ? "#eff6ff" : "#ffffff",
              border: `1px solid ${currentForm.value === form.id ? "#3b82f6" : "#e5e7eb"}`,
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "all 0.2s ease"
            }}
            onClick={() => setCurrentForm(form.id)}
          >
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#1f2937",
                marginBottom: "2px"
              }}>
                {form.name}
                {HasUnsavedChanges(form.id) && (
                  <span style={{
                    marginLeft: "8px",
                    fontSize: "12px",
                    color: "#f59e0b",
                    fontWeight: "400"
                  }}>
                    • Unsaved
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteForm(form.id, form.name);
              }}
              style={{
                padding: "4px",
                backgroundColor: "transparent",
                border: "none",
                color: "#ef4444",
                cursor: "pointer",
                borderRadius: "4px",
                fontSize: "12px"
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {formLeftNamesList.value.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "32px 16px",
          color: "#6b7280",
          fontSize: "14px"
        }}>
          No forms yet. Create your first form!
        </div>
      )}
    </div>
  );
}

export { FormBuilderPage };