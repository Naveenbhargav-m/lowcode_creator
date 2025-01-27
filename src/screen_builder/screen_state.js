// Signals for state management
import { signal } from "@preact/signals";
import { styles_mapper } from "../components/configs/primitive_styles_provider";
import { actionsmap } from "./helper_methods";
import { SetScreenToAPI } from "../api/api";
import { generateUID } from "../utils/helpers";

const tabSignal = signal("primitives");
const tabDataSignal = signal({
  "tabs": ["primitives", "containers", "templates"],
  "tab": "primitives",
  primitives: [
      { icon: "text-cursor", title: "Text", value: "text", type: "primitive" },
      { icon: "hash", title: "Number", value: "number", type: "primitive" },
      { icon: "align-left", title: "Text Area", value: "text_area", type: "primitive" },
      { icon: "bar-chart-2", title: "Progress Bar", value: "progress_bar", type: "primitive" },
      { icon: "user", title: "Avatar", value: "avatar", type: "primitive" },
      { icon: "users", title: "Avatar Group", value: "avatar_group", type: "primitive" },
      { icon: "chevron-down", title: "Dropdown", value: "drop_down", type: "primitive" },
      { icon: "square", title: "Button", value: "button", type: "primitive" },
      { icon: "image", title: "Image", value: "image", type: "primitive" },
      { icon: "badge-check", title: "Badge", value: "badge", type: "primitive" },
      { icon: "smile", title: "Icon", value: "icon", type: "primitive" },
      { icon: "mouse-pointer", title: "Icon Button", value: "icon_button", type: "primitive" },
    ],
  containers:  [
    { icon: "square", title: "Card", value: "card", type: "container" },
    { icon: "layout", title: "Container", value: "container", type: "container" },
    { icon: "grid", title: "Grid View", value: "grid_view", type: "container" },
    { icon: "list", title: "List View", value: "list_view", type: "container" },
    { icon: "align-justify", title: "Row", value: "row", type: "container" },
    { icon: "columns", title: "Column", value: "column", type: "container" },
    { icon: "scroll", title: "Scroll Area", value: "scroll_area", type: "container" },
    { icon: "chevrons-right", title: "Carousel", value: "carousel", type: "container" },
],
  templates:  [
    { icon: "table", title: "Table", value: "table", type: "template" },
    { icon: "bar-chart", title: "Charts", value: "charts", type: "template" },
    { icon: "grid", title: "Grid", value: "grid", type: "template" },
    { icon: "list", title: "List", value: "list", type: "template" },
    { icon: "file-text", title: "Form", value: "form", type: "template" },
    { icon: "monitor", title: "Screen", value: "screen", type: "template" },
    { icon: "menu", title: "Navbar", value: "navbar", type: "template" },
    { icon: "panel-left", title: "SideBar", value: "sidebar", type: "template" },
    { icon: "columns-2", title: "SideDrawer", value: "side_drawer", type: "modal" },
    { icon: "picture-in-picture-2", title: "Modal", value: "modal", type: "modal" },
    { icon: "picture-in-picture-2", title: "HoverCard", value: "hover_card", type: "modal" },
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
  const parentElement = parentId ? document.querySelector(`[data-id="${parentId}"]`) 
  : document.querySelector("#screen-container");
    
  // @ts-ignore
  const parentWidth = parentElement ? parentElement.offsetWidth : window.innerWidth;
  // @ts-ignore
  const parentHeight = parentElement ? parentElement.offsetHeight : window.innerHeight;
  let i = generateUID();
  let StyleCode = JSON.stringify(styles_mapper[data.data.title]);
  const newItem = {
    id: i,
    type: data.data.type,
    template: "element",
    title: data.data.value,
    "parent_container":{...containerBounds},
    parent: parentId,
    style: styles_mapper[data.data.vlaue],
    children: [],
    value:"",
    configs: {
      styleCode: `return ${StyleCode};`,
      onClick: "return {};",
      onDoubleClick: "return {};",
      onHover:"return {};",
      onHoverEnter:"return {};",
      onHoverLeave:"return {};",
      valueCode: "return {};",
      childrenCode:"return {};",
    },
  };

  if (parentId != null) {
      let parentElement = screenElements[parentId];
        parentElement.value.children.push(newItem.id);
        newItem.parent = parentId;
        screenElements[newItem.id] = signal(newItem);
        screenElements[newItem.id].value = {...newItem}; 
        screenElements[parentId].value = {...parentElement.value};
  } else {
    screenElements[newItem.id] = signal(newItem);
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