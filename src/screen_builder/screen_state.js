// Signals for state management
import { signal } from "@preact/signals";
import { styles_mapper } from "../components/configs/primitive_styles_provider";
import { actionsmap } from "./helper_methods";
import { SetScreenToAPI } from "../api/api";

const tabSignal = signal("primitives");
const tabDataSignal = signal({
  "tabs": ["primitives", "containers", "templates"],
  "tab": "primitives",
  primitives: [
    { icon: "text-cursor", title: "Text", "type":"primitive" },
    { icon: "hash", title: "Number" },
    { icon: "align-left", title: "Text Area" ,"type":"primitive" },
    { icon: "bar-chart-2", title: "Progress Bar","type":"primitive"  },
    { icon: "user", title: "Avatar" ,"type":"primitive" },
    { icon: "users", title: "Avatar Group" ,"type":"primitive" },
    { icon: "chevron-down", title: "Dropdown","type":"primitive"  },
    { icon: "square", title: "Button" ,"type":"primitive" },
    { icon: "image", title: "Image","type":"primitive"  },
    { icon: "badge-check", title: "Badge","type":"primitive"  },
    { icon: "smile", title: "Icon","type":"primitive"  },
    { icon: "mouse-pointer", title: "Icon Button","type":"primitive"  },
  ],
  containers: [
    { icon: "square", title: "Card", "type":"container" },
    { icon: "layout", title: "Container","type":"container" },
    { icon: "grid", title: "Grid View" ,"type":"container"},
    { icon: "list", title: "List View","type":"container" },
    { icon: "align-justify", title: "Row","type":"container" },
    { icon: "columns", title: "Column","type":"container" },
    { icon: "scroll", title: "Scroll Area" ,"type":"container"},
    { icon: "chevrons-right", title: "Carousel","type":"container" },
  ],
  templates: [
    { icon: "table", title: "Table", "type":"template" },
    { icon: "bar-chart", title: "Charts" ,"type":"template"},
    { icon: "grid", title: "Grid" ,"type":"template"},
    { icon: "list", title: "List","type":"template" },
    { icon: "file-text", title: "Form" ,"type":"template"},
    { icon: "monitor", title: "Screen" ,"type":"template"},
    {icon:"menu", title:"Navbar", type:"template"},
    {icon:"panel-left", title:"SideBar", type:"template"},
    {icon:"columns-2", title:"SideDrawer", type:"modal"},
    {icon:"picture-in-picture-2", title:"Modal", type:"modal"},
    {icon:"picture-in-picture-2", title:"HovarCard", type:"modal"}
  ],
});

const containerBounds = {"height":0, "width":0};
const activeTab = signal('Screen');
const activeConfigTab = signal("Basic");
const isHoveredSignal = signal(false);
const activeElement = signal("");

let screenConfigjson = localStorage.getItem("screen_config");
let screenConfigsMap = JSON.parse(screenConfigjson);

if (screenConfigsMap === null || screenConfigsMap === undefined) {
  screenConfigsMap = {};
} else {
  // Convert each object in screenConfigsMap to a signal
  for (const key in screenConfigsMap) {
    if (screenConfigsMap.hasOwnProperty(key)) {
      screenConfigsMap[key] = signal(screenConfigsMap[key]);
    }
  }
}

const screenElements = { ...screenConfigsMap };
const screenElementAdded = signal(false);
let activeDrag = signal(false);
let activeDragID = signal("none");


const handleDrop = (data, parentId = null) => {
  // Determine the parent container dimensions
  const parentElement = parentId 
    ? document.querySelector(`[data-id="${parentId}"]`) 
    : document.querySelector("#screen-container");
    
  // @ts-ignore
  const parentWidth = parentElement ? parentElement.offsetWidth : window.innerWidth;
  // @ts-ignore
  const parentHeight = parentElement ? parentElement.offsetHeight : window.innerHeight;
  let i = data.i || `element-${Object.keys(screenElements).length}`;
  let StyleCode = JSON.stringify(styles_mapper[data.data.title]);
  const newItem = {
    i: i,
    type: data.data.type,
    template: "element",
    title: data.data.title,
    position: { x: 0, y: 0 },
    "parent_container":{...containerBounds},
    parent: parentId,
    configs: {
      styleCode: `return ${StyleCode};`,
      style: styles_mapper[data.data.title],
      onClick: "return {};",
      onDoubleClick: "return {};",
      onHover:"return {};"
    },
    value: "",
    valueCode: "return {};",
    childrenCode:"return {};",
    children: [],
    actions: {
      onClick: "return {};",
      onDoubleClick: "return {};",
      onHoverEnter:"return {};",
      onHoverLeave:"return {};"

    }
  };

  if (parentId != null) {
      let parentElement = screenElements[parentId];
        parentElement.value.children.push(newItem.i);
        newItem.parent = parentId;
        screenElements[newItem.i] = signal(newItem);
        screenElements[newItem.i].value = {...newItem}; 
        screenElements[parentId].value = {...parentElement.value};
  } else {
    screenElements[newItem.i] = signal(newItem);
    screenElementAdded.value = true;
  }
  
  localStorage.setItem("screen_config", JSON.stringify(screenElements));
  let screenData = {
    "configs":JSON.stringify(screenElements)
  };
  SetScreenToAPI(screenData,1);
};



function CallbackExecutor(key , input) {
  actionsmap[key](input);
}

export {tabDataSignal , tabSignal, isHoveredSignal,screenElements ,activeTab,activeConfigTab,handleDrop,activeDrag,activeDragID,activeElement,CallbackExecutor, screenElementAdded};