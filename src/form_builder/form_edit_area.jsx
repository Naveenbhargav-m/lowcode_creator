import { Drop } from "../components/custom/Drop";
import { DesktopMockup } from "../screen_builder/screen_components";
import { FormBuilderLeftPanel } from "./form_builder_left";
import { Column, Field, PanelField, Row } from "./fields";
import { SwapChildrenBasedonView, AddtoElements, CreateNewForm, currentForm, currentFormElements, formActiveElement, formActiveLeftTab, formBuilderView, formLeftNamesList, formRenderSignal } from "./form_builder_state";
import MobileMockup from "../components/custom/mobile_mockup";
import { CreateAndbuttonbar } from "../screen_builder/screen-areas_2";
import { TemplateOptionTabs } from "../template_builder/templates_page";
import { ScreensList } from "../screen_builder/screen_page";
import { FlexRightPanel } from "./form_right_elements";
import { useEffect } from "preact/hooks";
import { SetCurrentScreen } from "../screen_builder/screen_state";


function RenderRoworColumnChildren(children) {
  if(children === undefined) {
    return <></>;
  }
  let childElements = {};
  for(var i=0;i<children.length;i++) {
    let childID = children[i];
    let temp = currentFormElements.value[childID];
    childElements[childID] = temp;
  }
  return RenderElements(childElements, true);
}


function SelectAble({children , id}) {
  return (
    <div
    style={{ display: "contents" }}
    onClick={(e) => {
      e.stopPropagation();
      formActiveElement.value = id;
      console.log("active element ID:", formActiveElement.value);
    }}
  >
    {children}
  </div>
  );
}

function RenderElements(elementsValue , areChildren) {
    if(elementsValue === undefined) {
      return <></>;
    }
    return (<div style={{display:"contents"}}>
    {Object.values(elementsValue).map(value => {
        let type = value["type"];
        let id = value["id"];
        let parent = value["parent"];
        if(parent !== "screen" && !areChildren) {
          return;
        }
        if(type === "column") {
          let children = value["children"];
          return (
            <SelectAble id={id}>
            <Column config={value} onDrop={AddtoElements}>
              {RenderRoworColumnChildren(children)}
            </Column>
            </SelectAble>
          
          );

        }
        if(type === "row") {
          let children = value["children"];
          return (
            <SelectAble id={id}>
            <Row config={value} onDrop={AddtoElements}>
              {RenderRoworColumnChildren(children)}
            </Row>
            </SelectAble>
          );
        }
        let style = value["panelStyle"];
        let labelStyle = value["labelStyle"];
        let fieldStyle = value["fieldStyle"];
        let config = value["config"];
        return (
        <SelectAble id={id}>
        <PanelField 
        label={"test label"} 
        labelPosition={"top"} 
        labelStyle={labelStyle} 
        panelStyle={style} 
        showError={false} 
        errorMessage={{}}>
          <Field type={type} options={[{"key":"key", "value":"value"}]} fieldStyle={fieldStyle} value={"test"} onChange={()=> console.log("field changes:",id)} />
        </PanelField>
        </SelectAble>
      );
    })} 
    </div>);
}


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
    let values = currentFormElements.value;
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
    let values = currentFormElements.value;
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
                <ScreensList elementsList={formLeftNamesList.value} signal={currentForm} callBack={(id) => SetCurrentScreen(id)}/> :
                <FormBuilderLeftPanel />
            }
    </div>
  
    {/* Main content area */}
    <div className="bg-background scrollable-div" style={{height:"100vh", width:"90%", padding:"20px"}}>
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
  
  
  