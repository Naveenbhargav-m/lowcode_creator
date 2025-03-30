// Signals for state management
import { effect, signal } from "@preact/signals";
import { actionsmap } from "./helper_methods";
import { SetScreenToAPI } from "../api/api";
import { generateUID } from "../utils/helpers";
import { PrimitivesStylesMap } from "../components/primitives/primitives_base_styles";
import { ContainersStylesMap } from "../components/containers/containers_bse_styles";
import { GetDataFromAPi } from "../api/api_syncer";


const screenStyle = {"display":"flex","flexDirection":"column","minHeight":"200px", "minWidth":"150px","height":"100%", "width":"100%"};

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
const activeScreen = signal("");
const screenView = signal("smartphone");
let screenLeftnamesAndIds = signal([]);
const screenLeftTabSignal = signal("");
let screens = {};
let screenElements = { };
const screenElementAdded = signal(false);
screenElementAdded.value = true;

let screenViewKey = "mobile_children";


function LoadScreens() {
  console.log("called LoadScreens");

  GetDataFromAPi("_screens").then((myscreens) => {
      console.log("my screens:", myscreens);

      if (!myscreens || myscreens.length === 0) {
          console.log("my screens is null:", myscreens);
          screens = {};
          return;
      }

      let tempnames = [];
      let screensmap = {};

      for (let i = 0; i < myscreens.length; i++) {
          let curScreen = myscreens[i];
          screensmap[curScreen["id"]] = { ...curScreen["configs"],"id": curScreen["id"] };
          tempnames.push({ "name": curScreen["screen_name"],"id": curScreen["id"], });
      }

      screenLeftnamesAndIds.value = [...tempnames];

      console.log("my screens is finally:", myscreens);
      screens = screensmap;
  }).catch(error => {
      console.error("Error loading screens:", error);
  });
}



function SetCurrentScreen() {
  let id = activeScreen.value;
  if (screens[id] === undefined) {
    return;
  }
  let key = "mobile_children";
  let otherkey = "desktop_children";
  if(screenView.value !== "smartphone") {
    key = "desktop_children";
    otherkey = "mobile_children"
  }
  let elements = JSON.parse(JSON.stringify(screens[id][key]));
  if(IsEmptyMap(elements)) {

    let elements = JSON.parse(JSON.stringify(screens[id][otherkey]));
    if(!IsEmptyMap(elements)) {
      screens[id]["_change_type"] = screens[id]["_change_type"] || "update";
      screens[id][key] = JSON.parse(JSON.stringify(elements));
    }
  }
  let newElements = {};
  for(const key in elements) {
    let val = elements[key].value;
    newElements[key] = signal({...elements[key]});
  }
  localStorage.setItem("screen_config",JSON.stringify(screens));
  screenElements = {...newElements};
  screenElementAdded.value = false;
  screenElementAdded.value = true;
}
const handleDrop = (data, parentId = null) => {
  console.log("called handle drop:",data, parentId);
  let i = generateUID();
  let myconfig = {};
  let type = data.data.type;
  let title = data.data.value;
  if(type === "primitive") {
    myconfig = JSON.parse(JSON.stringify(PrimitivesStylesMap[title]));
  } else if(type === "container") {
    myconfig = JSON.parse(JSON.stringify(ContainersStylesMap[title]));
  }
    const newItem = {
    id: i,
    type: type,
    template: "element",
    title: title,
    "parent_container":{...containerBounds},
    parent: parentId,
    children: [],
    ...myconfig,
  };

  if (parentId != null) {
      let parentElement = screenElements[parentId];
        parentElement.value.children.push(newItem.id);
        newItem.parent = parentId;
        screenElements[newItem.id] = signal(newItem);
        screenElements[newItem.id].value = {...newItem}; 
        screenElements[parentId].value = {...parentElement.value};
  } else {
    let curLength = Object.keys(screenElements).length + 1;
    newItem["order"] = curLength;
    screenElements[newItem.id] = signal(newItem);
    screenElementAdded.value = false;
    screenElementAdded.value = true;
  }
  let temp = screens[activeScreen.value];
  console.log("temp screens after drop:",temp);
  if(temp !== undefined) {
    let key = "mobile_children";
    if(screenView.peek() !== "smartphone") {
      key = "desktop_children";
    }
    temp[key] = JSON.parse(JSON.stringify(screenElements));
    screenViewKey = key;
    screens[activeScreen.value] = temp;
    screens[activeScreen.value]["_change_type"] = screens[activeScreen.value]["_change_type"] || "update";
  }
  console.log("new screens after drop:",screens);
  localStorage.setItem("screen_config", JSON.stringify(screens));
};

function CreatenewScreen(data) {
  let name = data["name"];
  let length = Object.keys(screens).length;
  let id = generateUID();
  let newScreenData = {"id": id, "_change_type": "add","screen_name": name, "mobile_style": {...screenStyle}, "desktop_style": {...screenStyle},"mobile_children": {}, "desktop_children": {},"order":length};
  screens[id] = newScreenData;
  screenElements = {};
  let existingnames = screenLeftnamesAndIds.peek();
  existingnames.push({"name": name, "id":id});
  screenLeftnamesAndIds.value = [...existingnames];
  localStorage.setItem("screen_config",JSON.stringify(screens));
  screenElementAdded.value = false;
  screenElementAdded.value = true;
}



function CallbackExecutor(key , input) {
  actionsmap[key](input);
}

function IsEmptyMap(curmap) {
  if(curmap === undefined || curmap === null) {
    return true;
  }
  if(Object.keys(curmap).length === 0) {
    return true;
  }
  return false;
}

export {tabDataSignal , tabSignal, 
  isHoveredSignal,screenElements ,activeTab,
  activeConfigTab,handleDrop,activeElement,
  CallbackExecutor, screenElementAdded,
  activeScreen, screenView,screenLeftTabSignal,screenLeftnamesAndIds,
   SetCurrentScreen, CreatenewScreen, screens, LoadScreens, screenViewKey
};