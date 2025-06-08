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
import { FileText, Plus, Trash2 } from "lucide-react";

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
              <FormsList
              forms={forms} activeForm={currentForm.value} 
              hasUnsavedChanges={HasUnsavedChanges}
              onCreateForm={CreateNewForm} onDeleteForm={DeleteForm} onFormSelect={setCurrentForm} />
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


// FormsList Component - Updated to match TablesList pattern
function FormsList({ forms, activeForm, onFormSelect, onCreateForm, onDeleteForm, hasUnsavedChanges }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    if (newName.trim()) {
      onCreateForm(newName);
      setNewName('');
      setIsCreating(false);
    }
  };

  // Convert forms object to array
  const formsArray = Object.values(forms || {});

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Forms</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white p-1.5 rounded hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {isCreating && (
        <div className="mb-4 space-y-2">
          <input
            type="text"
            value={newName}
            // @ts-ignore
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Form name"
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            autoFocus
            onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
          />
          <div className="flex gap-2">
            <button 
              onClick={handleCreate} 
              className="flex-1 bg-indigo-600 text-white py-1.5 rounded text-sm hover:bg-indigo-700 transition-colors"
            >
              Create
            </button>
            <button 
              onClick={() => setIsCreating(false)} 
              className="flex-1 bg-gray-200 text-gray-700 py-1.5 rounded text-sm hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1 max-h-64 overflow-y-auto">
        {formsArray.map(form => (
          <div 
            key={form.id}
            className={`flex items-center justify-between p-2.5 rounded-md cursor-pointer transition-colors ${
              activeForm === form.id 
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                : 'hover:bg-gray-100'
            }`}
            onClick={() => onFormSelect(form.id)}
          >
            <div className="flex items-center">
              <FileText size={16} className="mr-2 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{form.form_name || form.name}</span>
                {hasUnsavedChanges(form.id) && (
                  <span className="text-xs text-amber-600">• Unsaved</span>
                )}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteForm(form.id);
              }}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {formsArray.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <FileText size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No forms yet</p>
          <p className="text-xs mt-1">Create your first form to get started</p>
        </div>
      )}
    </div>
  );
}



export { FormBuilderPage };