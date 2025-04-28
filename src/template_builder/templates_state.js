import { signal } from "@preact/signals";
import { generateUID } from "../utils/helpers";
import { PrimitivesStylesMap } from "../components/primitives/primitives_base_styles";
import { ContainersStylesMap } from "../components/containers/containers_bse_styles";
import { GetDataFromAPi } from "../api/api_syncer";
const containerBounds = {"height":0, "width":0};
let templates = {};
let templateNamesList = signal([]);
let templatesPagesSignal = signal("components");
let activeTamplate = signal("");
let templateDesignView = signal("smartphone");
let activeTemplateElements = {};
let activeTemplateElement = signal("");
let templateRightPanelActiveTab = signal("Basic");
let isTemplateChanged = signal("");
let TemplateSorted = signal("");
let templateViewKey = "mobile_children";

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
          tempnames.push({ "name": curScreen["template_name"],"id": curScreen["id"], "order": curScreen["configs"]["order"]});
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
    TemplateSorted.value = generateUID();
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
    isTemplateChanged.value = generateUID();
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

  if (parentId !== null) {
      let parentElement = activeTemplateElements[parentId];
        parentElement.value.children.push(newItem.id);
        newItem.parent = parentId;
        activeTemplateElements[newItem.id] = signal(newItem);
        activeTemplateElements[newItem.id].value = {...newItem}; 
        activeTemplateElements[parentId].value = {...parentElement.value};
  } else {
    let curLength = Object.keys(activeTemplateElements).length + 1;
    newItem["order"] = curLength;
    activeTemplateElements[newItem.id] = signal(newItem);
    activeTemplateElements[newItem.id].value = {...newItem}; 
    isTemplateChanged.value = newItem.id;
  }
  let temp = templates[activeTamplate.value];
  console.log("temp screens after drop:",temp);
  if(temp !== undefined) {
    let key = "mobile_children";
    if(templateDesignView.peek() !== "smartphone") {
      key = "desktop_children";
    }
    temp[key] = JSON.parse(JSON.stringify(activeTemplateElements));
    templateViewKey = key;
    templates[activeTamplate.value] = temp;
    templates[activeTamplate.value]["_change_type"] = templates[activeTamplate.value]["_change_type"] || "update";
  }
  isTemplateChanged.value = i;
  TemplateSorted.value = i;
  console.log("new screens after drop:",templates);
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
    if(children.length > 0) {
      currentElement["children"] = newChildren;
      activeTemplateElements[keys[i]].value = currentElement;
    }
  }
  templates[activeTamplate.value][templateDesignView.value] = JSON.parse(JSON.stringify(activeTemplateElements));
  templates[activeTamplate.value]["_change_type"] = templates[activeTamplate.value]["_change_type"] || "update";
  isTemplateChanged.value = generateUID();
  TemplateSorted.value = generateUID();
}


function GetScreenTamplateByID(templateID) {
  let curtemplate = JSON.parse(JSON.stringify(templates[templateID]));
  curtemplate["is_template"] = true;
  return curtemplate;

}
export {
    templates,templateNamesList, templatesPagesSignal, templateRightPanelActiveTab,
    activeTamplate, templateDesignView, activeTemplateElements, isTemplateChanged, 
    activeTemplateElement, LoadTemplates,CreateTemplate, HandleTemplateDrop,SetTemplateActiveElements, DeleteTemplateElements,
    TemplateSorted,
    GetScreenTamplateByID,
};