import { effect, signal } from "@preact/signals";
import { generateUID, setElementByID } from "../utils/helpers";
import { GetDataFromAPi } from "../api/api_syncer";
import { fieldConfigs } from "./configs/form_configs";
import { AddChildren, AddFormField, DeleteFormField } from "./utilities";

const formStyle = {"display":"flex","flexDirection":"column","minHeight":"200px", "minWidth":"150px","height":"100%", "width":"100%"};

let forms = {};
let currentForm = signal("");
let currentFormConfig = signal({});
const formBuilderView = signal("smartphone");
let formActiveElement = signal("");
const activeTab = signal('Basic');
const formActiveLeftTab = signal("forms");
let formLeftNamesList = signal([]);
let formRenderSignal = signal("");


function AddtoElements(data) {
    console.log("add to element called:",data);
    let fieldData = data["data"];
    let formName = data["dropElementData"]["id"];
    let newid = generateUID();
    let existing = currentFormConfig.value;
    let fields = existing["fields"] || [];
    let length = fields.length;
    let commonConfig = JSON.parse(JSON.stringify(fieldConfigs[fieldData[1]]));
    let elementData = {
      "type":fieldData[1],
      "id": newid,
      "parent": formName,
      "children": [],
      "order": length, 
      ...commonConfig,
    };
    let newfields = AddFormField(fields, elementData);
    if(formName !== "screen") {
        newfields = AddChildren(newfields, formName, [newid]);
    }
    existing["fields"] = newfields;
    currentFormConfig.value = {...existing};
    formRenderSignal.value = generateUID();
    let currForm = forms[currentForm.peek()];
    if(formBuilderView.peek() === "smartphone") {
        let copy = JSON.parse(JSON.stringify(existing));
        currForm["mobile_children"] = {...copy};
    } else {
        let copy = JSON.parse(JSON.stringify(existing)); 
        currForm["desktop_children"] =  {...copy};
    }
    currForm["_change_type"] = currForm["_change_type"] || "update";
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
        length = Object.keys(forms).length;
    };
    let newdata = {"id": id, "_change_type": "add", "form_name":name,
        "mobile_style":{...formStyle},"desktop_style": {...formStyle},
        "mobile_children": {} , "desktop_children": {},"order":length};
    forms[id] = newdata;
    let existing = formLeftNamesList.peek();
    existing.push({"id":id, "name":name});
    formLeftNamesList.value = [...existing];
    localStorage.setItem("forms", JSON.stringify(forms));
  }

function LoadForms() {
    GetDataFromAPi("_forms").then((forms_data) => {
        if (!forms_data || forms_data.length === 0) {
            console.log("my forms_data is null:", forms_data);
            forms = {};
            return;
        }
  
        let tempnames = [];
        let screensmap = {};
        for (let i = 0; i < forms_data.length; i++) {
            let curForm = forms_data[i];
            screensmap[curForm["id"]] = { ...curForm["configs"],"id": curForm["id"] };
            tempnames.push({ "name": curForm["form_name"],"id": curForm["id"], });
        }
        forms = screensmap;
        formLeftNamesList.value = [...tempnames];
  
    });  
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
        if(mobileChildren.length === 0) {
            let deskchildren = curForm["desktop_children"];
            if(deskchildren.length > 0) {
                mobileChildren = deskchildren;
            } else {
                mobileChildren = [];
            }
            finalElements = JSON.parse(JSON.stringify(mobileChildren));
        } else if(Object.keys(mobileChildren).length == 0) {
            let deskchildren = curForm["desktop_children"];
            if(deskchildren.length > 0) {
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
    curForm["_change_type"] = curForm["_change_type"] || "update";
    forms[currentForm.value] = curForm;
    localStorage.setItem("forms", JSON.stringify(forms));
    currentFormConfig.value = {...finalElements};
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
    let finalElementSignals = {};
    for(var key in temp) {
        finalElementSignals[key] = signal({...temp[key]});
    }
    formRenderSignal.value = id;
    currentFormConfig.value = {...finalElementSignals};
}
function setCurrentElements(newElements) {
    currentFormConfig.value = {...newElements};
}


function DeleteFormElement(id) {
    console.log("called delete from element:",id);
    let fields = currentFormConfig.value["fields"];
    if(fields === undefined) {
        return;
    }
    let temp = currentFormConfig.value;
    let newfields = DeleteFormField(fields, id);
    let obj = {"fields": newfields};

    currentFormConfig.value = {...temp, ...obj};
    formRenderSignal.value = generateUID();
    forms[currentForm.value]["_change_type"] = forms[currentForm.value]["_change_type"] || "update";
    let key = formBuilderView.value === "smartphone" ? "mobile_children" : "desktop_children";
    forms[currentForm.value][key] = JSON.parse(JSON.stringify(currentFormConfig.value));
}
export {formBuilderView, forms, 
    currentForm, currentFormConfig, formActiveElement ,
    activeTab,formActiveLeftTab,formLeftNamesList, formRenderSignal, LoadForms, CreateNewForm,
    AddtoElements, SwapChildrenBasedonView, setCurrentForm, setCurrentElements, DeleteFormElement};