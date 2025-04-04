import { signal } from "@preact/signals";
import { generateUID } from "../utils/helpers";
import { PrimitivesStylesMap } from "../components/primitives/primitives_base_styles";
import { ContainersStylesMap } from "../components/containers/containers_bse_styles";


const templates = {};
let templateNamesList = signal([]);
let templatesPagesSignal = signal("components");
let activeTamplate = signal("");
let templateDesignView = signal("smartphone");
let activeTemplateElements = {};
let activeTemplateElement = signal("");
let templateRightPanelActiveTab = signal("Basic");
let isTemplateChanged = signal("");
function LoadTemplates( ) {
    let templatesStr = localStorage.getItem("templates");
    let templatesmap = JSON.parse(templatesStr);
    let names = [];
    if(templatesmap === undefined || templatesmap === null) {
        return;
    }
    Object.keys(templatesmap).map((key) => {
        templates[key] ={...templatesmap[key]};
        let name = templatesmap[key]["name"];
        let id = templatesmap[key]["id"];
        let order = templatesmap[key]["order"]
        names.push({"name":name, "id": id, "order":order})
    });
    templateNamesList.value = names;

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
    styleObj = PrimitivesStylesMap[title];
  } else if(type === "container") {
    styleObj = ContainersStylesMap[title];
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
//   let screenData = {
//     "configs":JSON.stringify(screenElements)
//   };
  // SetScreenToAPI(screenData,1);
}
LoadTemplates();
export {
    templates,  CreateTemplate, HandleTemplateDrop,SetTemplateActiveElements,
    templateNamesList, templatesPagesSignal, templateRightPanelActiveTab,
    activeTamplate, templateDesignView, activeTemplateElements, 
    isTemplateChanged, activeTemplateElement
};