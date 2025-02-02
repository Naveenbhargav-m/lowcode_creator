import { signal } from "@preact/signals";
import { Drop } from "../components/custom/Drop";
import { DesktopMockup } from "../screen_builder/screen_components";
import AdvnacedForm from "./configs_view/advanced_form";
import FlexConfigurator from "./configs_view/flex_config";
import { FormBuilderLeftPanel } from "./form_builder_left";
import { Column, DatesTest, Field, PanelField, Row } from "./fields";
import FormFieldConfigurator from "./configs_view/formFieldConfigurator";
import { activeTab, AddtoElements, CreateNewForm, currentForm, currentFormElements, formActiveElement, formActiveLeftTab, formBuilderView, formLeftNamesList } from "./form_builder_state";
import MobileMockup from "../components/custom/mobile_mockup";
import { CreateAndbuttonbar } from "../screen_builder/screen-areas_2";
import { TemplateOptionTabs } from "../template_builder/templates_page";
import { ScreensList } from "../screen_builder/screen_page";


function GetAdvancedConfigs(element, isField) {
  if(element === undefined) {
      return {
        "style": "",
        "onClick": "",
        "onChange": "",
        "onHover": "",
        "onDoubleTap": "",
        "onDrop": "",
        "onDrag": "",
        "onMount": "",
        "onDestroy": "",
        "value": "",
      };
  }
  let blockKeys = ["onClick","onChange","style","value","onHover","onDoubleTap","onDrop","onDrag","onMount","onDestroy"];
  let Fieldkeys = ["config","onClick","onChange","panelStyle","labelStyle","fieldStyle"];
  let keys = isField === true ? Fieldkeys : blockKeys;
  console.log("isField and keys:",isField, keys);
  let configMap = {};
  keys.map((value) => {
    let temp = element[value];
    if(value === "style") {
      configMap[value] = JSON.stringify(temp);
    } else {
      configMap[value] = temp;
    }
  });
  return configMap;
}



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
        <PanelField label={"test label"} labelPosition={"top"} labelStyle={labelStyle} panelStyle={style} showError={false} errorMessage={{}}>
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
         onIconChange={(name) => {formBuilderView.value = name}}
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
         onDrop={(data) => {AddtoElements(data)}}
         dropElementData={{ "id":"screen" }}
       >
          {RenderElements(currentFormElements.value, false)}
      </Drop>
      </div>
      </MobileMockup>
    );
  }
  
  
  function FormEditDesktopView() {
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
         onDrop={(data) => {AddtoElements(data)}}
         dropElementData={{ "id":"screen" }}
       >
          {RenderElements(currentFormElements.value, false)}
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
                <ScreensList elementsList={formLeftNamesList.value} signal={currentForm}/> :
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
  
  
  function FlexRightPanel() {
    let eleID = formActiveElement.value;
    console.log("element ID renderering:",eleID, currentFormElements);
    let activeElement = currentFormElements.peek()[eleID];  ;
    const handleChange = (config) => {
      console.log("existing element:",activeElement);
      if(activeElement !== undefined) {
        console.log("config:",config);
        activeElement["style"] = {...activeElement["style"],...config};
        let allElement = currentFormElements.peek();
        allElement[eleID] = {...activeElement};
        currentFormElements.value = {...allElement};
      }
    };
  
    const handleSubmit = (config) => {
      if(activeElement !== undefined) {
        activeElement["style"] = {...activeElement["style"],...config};
        let allElement = currentFormElements.peek();
        allElement[eleID] = {...activeElement};
        currentFormElements.value = {...allElement};
      }
    };
    const onAdvancedSubmit = (data) => {
      console.log("advanced config data:",data);
      if(activeElement !== undefined) {
        if(data["style"] !== undefined) {
            let temp = JSON.parse(data["style"]);
            if(temp !== undefined) {
              data["style"] = temp;
            }
        }
        activeElement = {...activeElement,...data};
        let allElement = currentFormElements.peek();
        allElement[eleID] = {...activeElement};
        currentFormElements.value = {...allElement};
      }
    }
  
    let advancedConfig = {};
    let type = "column";
      let configs = {};
      if(activeElement === undefined) {
        configs = {};
      } else {
        configs = activeElement["style"];
        type = activeElement["type"];
        if(type === "column" || type === "row") {
          advancedConfig = GetAdvancedConfigs(activeElement,false);

        } else {
          advancedConfig = GetAdvancedConfigs(activeElement,true);

        }

      }
      return (<div>
      <FlexConfigTab tablSignal={activeTab} />
      {activeTab.value === "Basic" ? (
        type === "column" || type === "row" ? (
          <FlexConfigurator onChange={handleChange} onSubmit={handleSubmit} existingConfig={configs} />
        ) : (
          <FormFieldConfigurator onChange={handleChange} onSubmit={handleSubmit} existingConfig={configs} />
        )
      ) : (
        <AdvnacedForm configsInp={advancedConfig} onSubmit={onAdvancedSubmit} />
      )}
    </div>);
  }
  
  
  export function FlexConfigTab({tablSignal}) {
    const switchTab = (tab) => {
      tablSignal.value = tab;
    };
  
    let tabs = ["Basic","Advanced"];
  
    return (
      <div class="flex-config-tab">
        <div class="tab-header">
          {tabs.map((value)=>{
            return (
              <button
            class={`tab-button ${tablSignal.value === value ? 'active' : ''}`}
            onClick={() => switchTab(value)}
          >
            {value}
          </button>
            );
          })}
          </div>
        </div>
    );
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
  
  
  