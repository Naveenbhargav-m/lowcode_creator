import { effect, signal } from "@preact/signals";
import { generateUID } from "../utils/helpers";
import { defaultStyle, fieldStyle, labelStyle } from "./configs_view/constantConfigs";

let forms = {};
let currentForm = signal("");
let currentFormElements = signal({});
const formBuilderView = signal("smartphone");
let formActiveElement = signal("");
const activeTab = signal('Basic');
const formActiveLeftTab = signal("forms");
let formLeftNamesList = signal([]);
let formRenderSignal = signal(true);

function AddtoElements(data) {
    console.log("add to element called:",data);
    let fieldData = data["data"];
    let formName = data["dropElementData"]["id"];
    let newid = generateUID();
    let existing = currentFormElements.peek();
    let length = Object.keys(existing).length;
    let elementData = {
      "type":fieldData[1],
      "id": newid,
      "parent": formName,
      "children": [],
      "order": length, 
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
    if(formName != "screen") {
      elementData["parent"] = formName;
      let parent = existing[formName];
      parent["children"].push(newid);
      existing[formName] = parent;
    }
    existing[newid] = elementData;
    let copy1 = JSON.parse(JSON.stringify(existing));
    console.log("existing:",copy1);
    currentFormElements.value = {...copy1};
    formRenderSignal.value = false;
    formRenderSignal.value = true;
    let currForm = forms[currentForm.peek()];
    if(formBuilderView.peek() === "smartphone") {
        let copy = JSON.parse(JSON.stringify(existing));
        currForm["mobile_children"] = {...copy};
    } else {
        let copy = JSON.parse(JSON.stringify(existing)); 
        currForm["desktop_children"] =  {...copy};
    }
    forms[currentForm.peek()] =  currForm;
    localStorage.setItem("forms", JSON.stringify(forms));  
  }


  function CreateNewForm(data) {
    let name = data["name"];
    let id = generateUID();
    let length = 0;
    if(forms === null || forms === undefined) {
        forms = new Object();
        length = 0;
    } else {
        length = Object.keys(forms).length
    };
    let newdata = {"id": id, "name":name, "mobile_children": {} , "desktop_children": {},"order":length};
    forms[id] = newdata;
    let existing = formLeftNamesList.peek();
    existing.push({"id":id, "name":name});
    formLeftNamesList.value = [...existing];
    localStorage.setItem("forms", JSON.stringify(forms));
  }

function LoadForms() {
    let formsjson = localStorage.getItem("forms");
    let formsObj= JSON.parse(formsjson);
    let tempNamesObj = [];
    for(const key in formsObj) {
        let curform = formsObj[key];
        let tempdata = {"name": curform["name"], "id": curform["id"]};
        tempNamesObj.push(tempdata);
    }
    formLeftNamesList.value = [...tempNamesObj];
    forms = formsObj;
}


function SwapChildrenBasedonView(formView) {
    let curForm = forms[currentForm.peek()];
    console.log("currentform:",curForm, formView);
    if(curForm === undefined) {
        return;
    }
    let finalElements = {};
    let viewName = "";
    if(formView == "smartphone") {
        let mobileChildren = curForm["mobile_children"];
        if(mobileChildren === undefined || mobileChildren === null) {
            let deskchildren = curForm["desktop_children"];
            if(deskchildren !== undefined && deskchildren !== null) {
                mobileChildren = deskchildren;
            } else {
                mobileChildren = {};
            }
            finalElements = JSON.parse(JSON.stringify(mobileChildren));
        } else if(Object.keys(mobileChildren).length == 0) {
            let deskchildren = curForm["desktop_children"];
            if(deskchildren !== undefined && deskchildren !== null) {
                mobileChildren = deskchildren;
            } else {
                mobileChildren = {};
            }
            finalElements = JSON.parse(JSON.stringify(mobileChildren));
        } else {
            finalElements = JSON.parse(JSON.stringify(mobileChildren));
        }
        viewName = "mobile_children";
    } else {
        let deskChildren = curForm["desktop_children"];
        if(deskChildren === undefined || deskChildren === null) {
            let mobile_children = curForm["mobile_children"];
            if(mobile_children !== undefined && mobile_children !== null) {
                deskChildren = mobile_children;
            } else {
                deskChildren = {};
            }
            finalElements = JSON.parse(JSON.stringify(deskChildren));
        }  else if(Object.keys(deskChildren).length == 0) {
            let mobileChildren = curForm["mobile_children"];
            if(mobileChildren !== undefined && mobileChildren !== null) {
                deskChildren = mobileChildren;
            } else {
                deskChildren = {};
            }
            finalElements = JSON.parse(JSON.stringify(deskChildren));
        } else {
            finalElements = JSON.parse(JSON.stringify(deskChildren));
        }
        viewName = "desktop_children";
    }
    curForm[viewName] = finalElements;
    forms[currentForm.value] = curForm;
    localStorage.setItem("forms", JSON.stringify(forms));
    currentFormElements.value = {...finalElements};
}
function setCurrentForm(id) {
    let myform = forms[id];
    if(myform === undefined) {
        return;
    }
    let children = {};
    if(formBuilderView.value === "smartphone") {
        children = myform["mobile_children"];
    } else {
        children = myform["desktop_children"];

    }
    let temp = JSON.parse(JSON.stringify(children));
    currentFormElements.value = {...temp};
}
LoadForms();
export {formBuilderView, forms, 
    currentForm, currentFormElements, formActiveElement ,
    activeTab,formActiveLeftTab,formLeftNamesList, formRenderSignal, CreateNewForm,
    AddtoElements, SwapChildrenBasedonView, setCurrentForm};