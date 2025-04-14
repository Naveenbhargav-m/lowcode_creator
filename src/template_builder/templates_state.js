import { signal } from "@preact/signals";
import { generateUID } from "../utils/helpers";
import { PrimitivesStylesMap } from "../components/primitives/primitives_base_styles";
import { ContainersStylesMap } from "../components/containers/containers_bse_styles";
import { GetDataFromAPi } from "../api/api_syncer";
let templates = {};
let templateNamesList = signal([]);
let templatesPagesSignal = signal("components");
let activeTamplate = signal("");
let templateDesignView = signal("smartphone");
let activeTemplateElements = {};
let activeTemplateElement = signal("");
let templateRightPanelActiveTab = signal("Basic");
let isTemplateChanged = signal("");
function LoadTemplates( ) {
    GetDataFromAPi("_templates").then((myscreens) => {
      console.log("my templates:", myscreens);

      if (!myscreens || myscreens.length === 0) {
          console.log("my screens is null:", myscreens);
          templates = {};
          return;
      }
      let tempnames = [];
      let screensmap = {};

      for (let i = 0; i < myscreens.length; i++) {
          let curScreen = myscreens[i];
          screensmap[curScreen["id"]] = { ...curScreen["configs"],"id": curScreen["id"] };
          tempnames.push({ "name": curScreen["screen_name"],"id": curScreen["id"], "order": curScreen["configs"]["order"]});
      }

      templateNamesList.value = [...tempnames];

      templates = screensmap;
  }).catch(error => {
      console.error("Error loading screens:", error);
  });
}

function SetTemplateActiveElements() {
  let templateID = activeTamplate.peek();
    let curTemplate = templates[templateID];
    let designView = templateDesignView.peek();
    if(curTemplate === undefined) {
      return;
    }
    let elements = {};
    if(designView === "smartphone") {
        elements = JSON.parse(JSON.stringify(curTemplate["mobile_children"]));
        if(IsObjectEmpty(elements)) {
            elements = JSON.parse(JSON.stringify(curTemplate["desktop_children"]));
            curTemplate["mobile_children"] = JSON.parse(JSON.stringify(elements));
            curTemplate["_change_type"] = curTemplate["_change_type"] || "update";
        }
    } else {
        elements = JSON.parse(JSON.stringify(curTemplate["desktop_children"]));
        if(IsObjectEmpty(elements)) {
            elements = JSON.parse(JSON.stringify(curTemplate["mobile_children"]));
            curTemplate["desktop_children"] = JSON.parse(JSON.stringify(elements));
            curTemplate["_change_type"] = curTemplate["_change_type"] || "update";
        }
    }

    templates[templateID] = curTemplate;
    localStorage.setItem("templates", JSON.stringify(templates));
    activeTemplateElements = {};
    Object.entries(elements).forEach(([key, value]) => {
      activeTemplateElements[key] = signal({ ...value });
  });
    isTemplateChanged.value = templateID;
}

function CreateTemplate(formdata) {
    let name = formdata["name"]
    let currentLen = Object.keys(templates).length;
    let order = currentLen + 1;
    let uID = generateUID();
    templates[uID] = {"name":name,"_change_type": "add" ,"id": uID, "order":order,"mobile_children":{}, "desktop_children":{}};
    let existingList = templateNamesList.peek();
    templateNamesList.value = [...existingList, { "name": name, "id": uID }];
    localStorage.setItem("templates", JSON.stringify(templates));
}


function IsObjectEmpty(object) {
    if(object === undefined || object === null) {
        return true;
    }
    let len = Object.keys(object).length;
    if(len === 0) {
        return true;
    }
    return false;
}


function HandleTemplateDrop(data, parentId = null) {

  let i = generateUID();
  let styleObj = {};
  let type = data.data.type;
  let title = data.data.value;
  if(type === "primitive") {
    styleObj = JSON.parse(JSON.stringify(PrimitivesStylesMap[title]));
  } else if(type === "container") {
    styleObj = JSON.parse(JSON.stringify(ContainersStylesMap[title]));
  }
    const newItem = {
    id: i,
    type: type,
    template: "element",
    title: title,
    parent: parentId,
    children: [],
    value:"",
    configs: {
      style: styleObj,
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
      let parentElement = activeTemplateElements[parentId];
        parentElement.value.children.push(newItem.id);
        newItem.parent = parentId;
        activeTemplateElements[newItem.id] = signal(newItem);
        activeTemplateElements[newItem.id].value = {...newItem}; 
        activeTemplateElements[parentId].value = {...parentElement.value};
  } else {
    activeTemplateElements[newItem.id] = signal(newItem);
  }
  let activeTemp = activeTamplate.peek();
  let temp = templates[activeTemp];
  if(temp !== undefined) {
    let view = templateDesignView.peek();
    let key = "mobile_children";
    if(view !== "smartphone" ) {
        key = "desktop_children";
    }
    temp[key] = JSON.parse(JSON.stringify(activeTemplateElements));
    temp["_change_type"] = temp["_change_type"] || "update";
    templates[activeTemp] = temp;
  }
  isTemplateChanged.value = "";
  isTemplateChanged.value = activeTemp;
  localStorage.setItem("templates", JSON.stringify(templates));
}


function DeleteTemplateElements(id) {
  console.log("existing:",activeTemplateElements[id]);
  delete activeTemplateElements[id];
  let keys = Object.keys(activeTemplateElements);
  for(var i=0;i<keys.length;i++) {
    let currentElement = activeTemplateElements[keys[i]].value;
    let children = currentElement["children"];
    let newChildren = [];
    for(var j=0;j<children.length;j++) {
      if(children[j] === id) {
        continue
      }
      newChildren.push(children[j]);
    }
    if(newChildren.length > 0) {
      currentElement["children"] = newChildren;
      activeTemplateElements[keys[i]].value = currentElement;
    } 
  }
  templates[activeTamplate.value][templateDesignView.value] = JSON.parse(JSON.stringify(activeTemplateElements));
  templates[activeTamplate.value]["_change_type"] = templates[activeTamplate.value]["_change_type"] || "update";
  isTemplateChanged.value = generateUID();
  isTemplateChanged.value = generateUID();
}
export {
    templates,templateNamesList, templatesPagesSignal, templateRightPanelActiveTab,
    activeTamplate, templateDesignView, activeTemplateElements, isTemplateChanged, 
    activeTemplateElement, LoadTemplates,CreateTemplate, HandleTemplateDrop,SetTemplateActiveElements, DeleteTemplateElements
};