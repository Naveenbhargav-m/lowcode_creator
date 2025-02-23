import { Drop } from "../components/custom/Drop";
import { DesktopMockup } from "../screen_builder/screen_components";
import { FormBuilderLeftPanel } from "./form_builder_left";
import { Column, PanelField, Row } from "./fields/fields";
import { Field } from "./fields/chakra_fields";
import { SwapChildrenBasedonView, AddtoElements, CreateNewForm, currentForm, currentFormElements, formActiveElement, formActiveLeftTab, formBuilderView, formLeftNamesList, formRenderSignal, setCurrentForm } from "./form_builder_state";
import MobileMockup from "../components/custom/mobile_mockup";
import { CreateAndbuttonbar } from "../screen_builder/screen-areas_2";
import { TemplateOptionTabs } from "../template_builder/templates_page";
import { ScreensList } from "../screen_builder/screen_page";
import { FlexRightPanel } from "./form_right_elements";
import { useEffect } from "preact/hooks";
import { DynamicFormComponent, RenderElements } from "./form_renderer";
import { getSortedFields , getSortedSignalFields } from "../utils/helpers";
import { CallOnChange, configs, UpdateConfig, values } from "./form_test_data";

function EditArea() {
    return (
    <div>
      <CreateAndbuttonbar 
         iconNames={["smartphone", "app-window-mac"]} 
         onIconChange={(name) => {formBuilderView.value = name; SwapChildrenBasedonView(formBuilderView.value);}}
         formLabel={"Create New Form"}
         placeHolder={"Form Name:"}
         buttonLabel={"Create Form"}
         buttonCallBack={(data) => {CreateNewForm (data);}}
      />
      <div style={{height:"94vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
      {formBuilderView.value == "smartphone" ? <FormEditMobileView /> : <FormEditDesktopView />}
      </div>
      </div>
  );
  }


  function FormEditMobileView() {
    useEffect(() => {
      console.log("Re-render triggered");
    },[]);
    let temp = currentFormElements;

    let values = temp;
    return (
      <MobileMockup>
    <div
       style={{
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
          {formRenderSignal.value && RenderElements(values, false)}
      </Drop>
      </div>
      </MobileMockup>
    );
  }
  
  
  function FormEditDesktopView() {
    let temp = currentFormElements;
    let values = temp;
    return (
      <DesktopMockup>
    <div
       style={{
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
          {formRenderSignal.value && RenderElements(values, false)}
      </Drop>
      </div>
      </DesktopMockup>
    );
  }
  
  export function FormBuilderTest() {
    return (
    <div className="min-h-screen h-screen w-full flex">
    <div className="w-1/6 bg-white p-4 min-h-screen scrollable-div">
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
  
    {/* Main content area */}
    <div className="bg-background scrollable-div" style={{height:"100vh", width:"90%", padding:"20px"}}>
            {/* <div>
              <DynamicFormComponent
               configs={configs}
               values={values} 
               onChange={(data) => {CallOnChange(data)}}
               onSubmit={(data) => CallOnChange(data)}
               updateCallback={(data) => UpdateConfig(data)}
               />
            </div> */}
        <EditArea />
    </div>
  
    <div className="w-1/6 bg-white h-screen scrollable-div">
     <FlexRightPanel />
    </div>
  </div>);
  }
  

  
  /*
   On Click,
   OnChange,
   Style,
   OnHover,
   OnDoubleTap,
   OnDrop,
   OnDrag,
   Onmount,
   OnDestroy,
   Value,
   */
  
  
  