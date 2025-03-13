import { getElementByID, setElementByID } from "../utils/helpers";
import {AdvnacedForm} from "./configs_view/advanced_form";
import FlexConfigurator from "./configs_view/flex_config";
import FormFieldConfigurator from "./configs_view/formFieldConfigurator";
import { activeTab, currentForm, currentFormElements, formActiveElement, formBuilderView, formRenderSignal, forms, setCurrentElements } from "./form_builder_state";



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
  

  
export function FlexRightPanel() {
    let eleID = formActiveElement.value;
    let temp = undefined;
    let activeElement = undefined;
    let isform = false;
    if(eleID !== "form") {
      temp = getElementByID(currentFormElements, eleID);
      console.log("temp:",temp, currentFormElements);
      if(temp === undefined) {
        return <div></div>;
      }
      activeElement = temp.peek();
      console.log("active element:",activeElement);
    } else {
        isform = true;
    }
    const handleFlexChange = (config) => {
      if(activeElement !== undefined && !isform) {
        activeElement["style"] = {...activeElement["style"],...config};
        let allElement = currentFormElements;
        allElement = setElementByID(allElement, eleID, activeElement);
        setCurrentElements(allElement);
      }
      if(isform) {
        let key = "mobile_style";
        let view = formBuilderView.value;
        if(view !== "smartphone") {
          key = "desktop_style";
        }
        forms[currentForm.value][key] = {...config};
      }
      formRenderSignal.value = false;
      formRenderSignal.value = true;
    };
  
    const handleFlexSubmit = (config) => {
      if(activeElement !== undefined && !isform) {
        activeElement["style"] = {...activeElement["style"],...config};
        let allElement = currentFormElements;
        allElement = setElementByID(allElement, eleID, activeElement);
        setCurrentElements(allElement);
        let myform = forms[currentForm.value];
        if(formBuilderView.value === "smartphone") {
            myform["mobile_children"] = currentFormElements;
        } else {
            myform["desktop_children"] = currentFormElements;

        }
        forms[currentForm.value] = myform;
      } else if(isform) {
        let key = "mobile_style";
        let view = formBuilderView.value;
        if(view !== "smartphone") {
          key = "desktop_style";
        }
        forms[currentForm.value][key] = {...config};
      }
      formRenderSignal.value = false;
      formRenderSignal.value = true;
      localStorage.setItem("forms",JSON.stringify(forms));
    };
    const onAdvancedFlexSubmit = (data) => {
      console.log("advanced config data:",data);
      if(activeElement !== undefined && !isform) {
          if(data["style"] !== undefined) {
              let temp = JSON.parse(data["style"]);
              if(temp !== undefined) {
                data["style"] = temp;
              }
          }
          if(data["fieldStyle"] !== undefined) {
            let temp = data["fieldStyle"];
            if(temp !== undefined) {
              data["fieldStyle"] = temp;
            }
        }
        if(data["labelStyle"] !== undefined) {
          let temp = data["labelStyle"];
          if(temp !== undefined) {
            data["labelStyle"] = temp;
          }
      }
      if(data["panelStyle"] !== undefined) {
        let temp = data["panelStyle"];
        if(temp !== undefined) {
          data["panelStyle"] = temp;
        }
      }
        activeElement = {...activeElement,...data};
        let allElement = currentFormElements;
        allElement = setElementByID(allElement, eleID, activeElement);
        setCurrentElements(allElement);
        let myform = forms[currentForm.value];
        if(formBuilderView.value === "smartphone") {
            myform["mobile_children"] = currentFormElements;
        } else {
            myform["desktop_children"] = currentFormElements;

        }
        console.log("my form:", myform, currentFormElements);
        forms[currentForm.value] = myform;
      }  else if(isform) {
        let key = "mobile_style";
        let view = formBuilderView.value;
        if(view !== "smartphone") {
          key = "desktop_style";
        }
        forms[currentForm.value][key] = JSON.parse(data["style"]);
      }
      formRenderSignal.value = false;
      formRenderSignal.value = true;
      localStorage.setItem("forms",JSON.stringify(forms));
    }
  
    let advancedConfig = {};
    let type = "column";
      let configs = {};
      if(activeElement === undefined && !isform) {
        console.log("if:", isform, activeElement);
        configs = {};
      } else if(isform) {
        console.log("else id form:", isform, activeElement);
        let key = "mobile_style";
        let view = formBuilderView.value;
        if(view !== "smartphone") {
          key = "desktop_style";
        }
        let curForm = forms[currentForm.value];
        if(curForm === undefined) {
          return;
        }
        configs = curForm[key];
        advancedConfig = {"style": configs};
      }
         else {
          console.log("ellse:", isform, activeElement);
          type = activeElement["type"];
          if(type === "column" || type === "row") {
            advancedConfig = GetAdvancedConfigs(activeElement,false);
            configs = activeElement["style"];

          } else {
            advancedConfig = GetAdvancedConfigs(activeElement,true);
            configs = {"fieldStyle": activeElement["fieldStyle"],"labelStyle": activeElement["labelStyle"],"panelStyle": activeElement["panelStyle"]};
          }

      }

      function handleFormFieldSubmit(data) {
        if(activeElement !== undefined && !isform) {
          activeElement["fieldStyle"] = {...activeElement["fieldStyle"],...data["fieldStyle"]};
          activeElement["labelStyle"] = {...activeElement["labelStyle"],...data["labelStyle"]};
          activeElement["panelStyle"] = {...activeElement["panelStyle"],...data["panelStyle"]};
          let allElement = currentFormElements;
          allElement = setElementByID(allElement, eleID, activeElement);
          setCurrentElements(allElement);
          let myform = forms[currentForm.value];
          if(formBuilderView.value === "smartphone") {
              myform["mobile_children"] = currentFormElements;
          } else {
              myform["desktop_children"] = currentFormElements;
  
          }
          forms[currentForm.value] = myform;
          formRenderSignal.value = false;
          formRenderSignal.value = true;
          localStorage.setItem("forms",JSON.stringify(forms));
        }
      }
      return (<div>
      <FlexConfigTab tablSignal={activeTab} />
      {activeTab.value === "Basic" ? (
        type === "column" || type === "row" ? (
          <FlexConfigurator onChange={handleFlexChange} onSubmit={handleFlexSubmit} existingConfig={configs} />
        ) : (
          <FormFieldConfigurator onChange={handleFormFieldSubmit} onSubmit={handleFormFieldSubmit} existingConfig={configs} />
        )
      ) : (
        <AdvnacedForm configsInp={advancedConfig} onSubmit={onAdvancedFlexSubmit} />
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
  