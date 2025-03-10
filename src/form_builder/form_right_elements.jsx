import { setElementByID } from "../utils/helpers";
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
      temp = currentFormElements[eleID];
      if(temp === undefined) {
        return <div></div>;
      }
      activeElement = temp.peek();
    } else {
        isform = true;
    }
    const handleChange = (config) => {
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
  
    const handleSubmit = (config) => {
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
    const onAdvancedSubmit = (data) => {
      console.log("advanced config data:",data);
      if(activeElement !== undefined && !isform) {
        if(data["style"] !== undefined) {
            let temp = JSON.parse(data["style"]);
            if(temp !== undefined) {
              data["style"] = temp;
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
        configs = {};
      } else if(isform) {
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
        configs = activeElement["style"];
        type = activeElement["type"];
        if(type === "column" || type === "row") {
          advancedConfig = GetAdvancedConfigs(activeElement,false);

        } else {
          advancedConfig = GetAdvancedConfigs(activeElement,true);

        }

      }
      return (<div>
      <FlexConfigTab tablSignal={activeTab} />
      {activeTab.value === "Basic" ? (
        type === "column" || type === "row" ? (
          <FlexConfigurator onChange={handleChange} onSubmit={handleSubmit} existingConfig={configs} />
        ) : (
          <FormFieldConfigurator onChange={handleChange} onSubmit={handleSubmit} existingConfig={configs} />
        )
      ) : (
        <AdvnacedForm configsInp={advancedConfig} onSubmit={onAdvancedSubmit} />
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
  