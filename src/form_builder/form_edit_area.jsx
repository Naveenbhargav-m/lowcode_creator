import { signal } from "@preact/signals";
import { Drop } from "../components/custom/Drop";
import { DesktopMockup } from "../screen_builder/screen_components";
import AdvnacedForm from "./advanced_form";
import FlexConfigurator from "./flex_config";
import { FormBuilderLeftPanel } from "./form_builder_left";
import { generateUID } from "../utils/helpers";
import { Column, DatesTest, Field, PanelField, Row } from "./fields";
import FormFieldConfigurator from "./formFieldConfigurator";
import { defaultStyle, fieldStyle, labelStyle } from "./constantConfigs";




// Signals for managing form data
const activeTab = signal('Basic');
let activeElementID = signal("");
let elements = signal({});


function AddtoElements(data) {
  console.log("add to element called:",data);
  let fieldData = data["data"];
  let formName = data["dropElementData"]["id"];
  let newid = generateUID();
  let elementData = {
    "type":fieldData[1],
    "id": newid,
    "parent": formName,
    "children": [],
    "size_class": "",
    "grow":"",
    "srink":"",
    "height": 50,
    "width":50,
    "config": {},
    "class":"dp25",
    "style": defaultStyle,
    "panelStyle": defaultStyle,
    "fieldStyle": fieldStyle,
    "labelStyle":labelStyle,
    "onClick": "",
    "onChange": "",
    "onHover": "",
    "onDoubleTap": "",
    "onDrop": "",
    "onDrag": "",
    "onMount": "",
    "onDestroy": "",
    "value": "",
    "valueData": "",
  };
  let existing = elements.peek();
  if(formName != "screen") {
    elementData["parent"] = formName;
    let parent = existing[formName];
    parent["children"].push(newid);
    existing[formName] = parent;
  }
  existing[newid] = elementData;
  elements.value = {...existing};
  console.log("elements after adding new field:",elements.value);

}

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
    let temp = elements.value[childID];
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
      activeElementID.value = id;
      console.log("active element ID:", activeElementID.value);
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
    return (<DesktopMockup>
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
          {RenderElements(elements.value, false)}
      </Drop>
      </div>
      </DesktopMockup>)
  }
  
  
  
  export function FormBuilderTest() {
    return (
    <div className="min-h-screen h-screen w-full flex">
    <div className="w-1/6 bg-white p-4 min-h-screen scrollable-div">
      <FormBuilderLeftPanel />
    </div>
  
    {/* Main content area */}
    <div className="w-4/6 h-screen bg-background scrollable-div">
        <EditArea />
    </div>
  
    <div className="w-1/6 bg-white h-screen scrollable-div">
     <FlexRightPanel />
    </div>
  </div>);
  }
  
  
  function FlexRightPanel() {
    let eleID = activeElementID.value;
    console.log("element ID renderering:",eleID, elements);
    let activeElement = elements.peek()[eleID];  ;
    const handleChange = (config) => {
      console.log("existing element:",activeElement);
      if(activeElement !== undefined) {
        console.log("config:",config);
        activeElement["style"] = {...activeElement["style"],...config};
        let allElement = elements.peek();
        allElement[eleID] = {...activeElement};
        elements.value = {...allElement};
      }
    };
  
    const handleSubmit = (config) => {
      if(activeElement !== undefined) {
        activeElement["style"] = {...activeElement["style"],...config};
        let allElement = elements.peek();
        allElement[eleID] = {...activeElement};
        elements.value = {...allElement};
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
        let allElement = elements.peek();
        allElement[eleID] = {...activeElement};
        elements.value = {...allElement};
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
  
  
  