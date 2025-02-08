import { h } from 'preact';
import { useState } from 'preact/hooks';
import { signal, useSignal } from '@preact/signals';
import { Draggable } from '../components/custom/Drag';
import DynamicIcon from '../components/custom/dynamic_icon';
import { Drop } from '../components/custom/Drop';
import { DesktopMockup } from '../screen_builder/screen_components';
import { generateUID } from '../utils/helpers';
import FlexConfigurator from './flex_config';
import AdvnacedForm from './advanced_form';
import { CreateFormButton } from '../template_builder/template_builder_view';

let defaultStyle = {
    flexDirection: 'row',
    display:"flex",
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    flexWrap: 'nowrap',
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto',
    order: 0,
    alignSelf: 'auto',
    width: '100%',
    height: 'auto',
    color: '#000000',
    backgroundColor: '#ffffff',
    padding: '0',
    margin: '0',
    border: 'none',
    borderRadius: '0',
    boxShadow: 'none',
    minHeight:"70px",
    minWidth:"70px"
  };


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
    "children": [],
    "size_class": "",
    "grow":"",
    "srink":"",
    "height": 50,
    "width":50,
    "class":"dp25",
    "style": defaultStyle,
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

function GetAdvancedConfigs(element) {
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
  let keys = ["onClick","onChange","style","value","onHover","onDoubleTap","onDrop","onDrag","onMount","onDestroy"];
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


function OptionsMapper({ options }) {
  return (
    <div>
      {options.map((innerlist) => {
        return (
          <Draggable data={innerlist} onDragStart={(data) => {console.log("data:", data)}}>
            <div className="cell p-2 bg-white rounded-md my-2 border-2 border-highlight">
              <div className="flex flex-row items-center scroll-px-4">
                <div className="px-2">
                  <DynamicIcon name={innerlist[0]} size={30} />
                </div>
                <p className="text-sm">{innerlist[1]}</p>
              </div>
            </div>
          </Draggable>
        );
      })}
    </div>
  );
}

function RenderElement(element) {
    console.log("element:",element);
    let type = element["type"];
      if(type === "column") {
        console.log("in column condition:",type);
        return (<Column config={element}> 
          {(element.children || []).map((id, ind) => {
            let elementdata = elements.value[id];
            if (!elementdata) return null;
            return RenderElement(elementdata);})}
        </Column>);
      } else if( type === "row") {
        return (<Row config={element}> 
          {element.children.map((id, ind) => {
            let elementdata = elements.value[id];
            return RenderElement(elementdata);
          })}
        </Row>);
      } else {
        return (<Box config={element}/>);
      }
}
function RenderElements() {
  console.log("rendering elements:",elements.value);
  return (
    <>
      {elements.value &&
        Object.entries(elements.value).map(([key, value]) => {
          console.log("key:",key);
          if(value.parent === undefined) {
            console.log("value:",value);
            return RenderElement(value);
          }
})}
    </>
  );
}


function Box({config}) {
  return <div class="dp50" style={config["style"]}   onClick={(e)=> {
    e.stopPropagation();
    activeElementID.value = config["id"];
  }}>
    <div style={{ height:"50px",width:"50px"} }></div>
  </div>
}
function Column({children, config}) {
  console.log("column config:",config, children);
  return (
    <Drop wrapParent={false} dropElementData={{"id": config["id"]}} onDrop={(data) => AddtoElements(data)}>
    <div class="column" style={config["style"]}   onClick={(e)=> {
      e.stopPropagation();
      activeElementID.value = config["id"];
    }}>
    {children}
    </div>
  </Drop>
  );
}

function Row({children, config}) {
  return (
    <Drop wrapParent={false} dropElementData={{"id": config["id"]}} onDrop={(data) => AddtoElements(data)}>
    <div class="row" style={config["style"]} onClick={(e)=> {
      e.stopPropagation();
      activeElementID.value = config["id"];
    }}>
      {children}
    </div>
  </Drop>

  );
}

function LeftPage() {
  let elements = [
    ["instagram","column"],
    ["store","row"],
    ["store","box"],
    ["store","rounded"],
    ["store","others"]
  ];
  return <OptionsMapper options={elements}/>
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
        {RenderElements()}
    </Drop>
    </div>
    </DesktopMockup>)
}



export function FormsPageNew() {
  return (
  <div className="min-h-screen h-screen w-full flex">
  <div className="w-1/6 bg-white p-4 min-h-screen">
    <LeftPage />
  </div>

  {/* Main content area */}
  <div className="w-4/6 h-screen bg-background scrollable-div">
      {/* <CreateFormButton /> */}
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


  let advancedConfig = GetAdvancedConfigs(activeElement);
    let configs = {};
    if(activeElement === undefined) {
      configs = {};
    } else {
      configs = activeElement["style"];
    }
    return (
    <div>
      <FlexConfigTab />
      {activeTab.value == "Basic"? 
      <FlexConfigurator onChange={handleChange} onSubmit={handleSubmit} existingConfig={configs} /> 
      :
      <AdvnacedForm configsInp={advancedConfig} onSubmit={onAdvancedSubmit} />
      }
      
    </div>);
}


export function FlexConfigTab() {
  const switchTab = (tab) => {
    activeTab.value = tab;
  };

  let tabs = ["Basic","Advanced"];

  return (
    <div class="flex-config-tab">
      <div class="tab-header">
        {tabs.map((value)=>{
          return (
            <button
          class={`tab-button ${activeTab.value === value ? 'active' : ''}`}
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


