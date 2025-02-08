import {AdvnacedForm} from "./configs_view/advanced_form";
import FlexConfigurator from "./configs_view/flex_config";
import FormFieldConfigurator from "./configs_view/formFieldConfigurator";
import { activeTab, currentForm, currentFormElements, formActiveElement, formBuilderView, formRenderSignal, forms } from "./form_builder_state";


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
    let activeElement = currentFormElements.peek()[eleID];  ;
    const handleChange = (config) => {
      console.log("existing element:",activeElement);
      if(activeElement !== undefined) {
        console.log("config:",config);
        activeElement["style"] = {...activeElement["style"],...config};
        let allElement = currentFormElements.peek();
        allElement[eleID] = {...activeElement};
        currentFormElements.value = {...allElement};
      }
    };
  
    const handleSubmit = (config) => {
      if(activeElement !== undefined) {
        activeElement["style"] = {...activeElement["style"],...config};
        let allElement = currentFormElements.peek();
        allElement[eleID] = {...activeElement};
        currentFormElements.value = {...allElement};
        let myform = forms[currentForm.value];
        if(formBuilderView.value === "smartphone") {
            myform["mobile_children"] = currentFormElements.value;
        } else {
            myform["desktop_children"] = currentFormElements.value;

        }
        forms[currentForm.value] = myform;
        localStorage.setItem("form",JSON.stringify(forms));
      }
    };
    const onAdvancedSubmit = (data) => {
      console.log("advanced config data:",data);
      if(activeElement !== undefined) {
        if(data["style"] !== undefined) {
            let temp = JSON.parse(data["style"]);
            if(temp !== undefined) {
              data["style"] = temp;
            }
        }
        activeElement = {...activeElement,...data};
        let allElement = currentFormElements.peek();
        allElement[eleID] = {...activeElement};
        currentFormElements.value = {...allElement};
        let myform = forms[currentForm.value];
        if(formBuilderView.value === "smartphone") {
            myform["mobile_children"] = currentFormElements.value;
        } else {
            myform["desktop_children"] = currentFormElements.value;

        }
        console.log("my form:", myform, currentFormElements);
        forms[currentForm.value] = myform;
        localStorage.setItem("forms",JSON.stringify(forms));
        formRenderSignal.value = true;
      }
    }
  
    let advancedConfig = {};
    let type = "column";
      let configs = {};
      if(activeElement === undefined) {
        configs = {};
      } else {
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
  