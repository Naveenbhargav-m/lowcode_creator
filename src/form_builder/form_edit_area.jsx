import { Drop } from "../components/custom/Drop";
import { DesktopMockup } from "../screen_builder/screen_components";
import { FormBuilderLeftPanel } from "./form_builder_left";

import { SwapChildrenBasedonView, AddtoElements, CreateNewForm, currentForm, currentFormConfig, formActiveElement, formActiveLeftTab, formBuilderView, formLeftNamesList, formRenderSignal, setCurrentForm, forms, LoadForms } from "./form_builder_state";
import MobileMockup from "../components/custom/mobile_mockup";
import { CreateAndbuttonbar } from "../screen_builder/screen-areas_2";
import { TemplateOptionTabs } from "../template_builder/templates_page";
import { ScreensList } from "../screen_builder/screen_page";
import { useEffect } from "preact/hooks";
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
      />

                <SyncButton title={"sync"} onClick={(e) => {SyncData("_forms", forms);}} style={{marginRight:"40px", "marginTop":"10px"}}/>
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
        <div style={style} onClick={(e) => {formActiveElement.value = "form" }}>
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
  
  export function FormBuilderTest() {
    useAuthCheck();
    return (
    <div className="min-h-screen h-screen w-full flex">
    <div className="bg-white p-4 min-h-screen scrollable-div" style={{height:"100vh", width:"14vw"}}>
    <div className="scrollable-div" style={{ flex: "0 0 auto" }}>
            <TemplateOptionTabs tabs={["forms", "components"]} onChange={(tab) => { 
              formActiveLeftTab.value = tab;
               console.log("templates list value:",formBuilderView.value); } }/>
            </div>
            {
                formActiveLeftTab.value === "forms" ?
                <ScreensList elementsList={formLeftNamesList.value} signal={currentForm} callBack={(id) => setCurrentForm(id)}/> :
                <FormBuilderLeftPanel />
            }
    </div>
  
    <div className="bg-background w-3/6 scrollable-div" style={{height:"100vh", width:"58vw"}}>
        <EditArea />
    </div>
  
    <div className="w-2/6 bg-white h-screen scrollable-div" style={{height:"100vh", width:"24vw"}}>
            <FormBuilderRightPanel />
    </div>
  </div>);
  }  