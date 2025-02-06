import AdvnacedForm from "../form_builder/configs_view/advanced_form";
import FlexConfigurator from "../form_builder/configs_view/flex_config";
import { FlexConfigTab } from "../form_builder/form_right_elements";
import { activeTamplate, activeTemplateElement, activeTemplateElements, templateDesignView, templateRightPanelActiveTab, templates } from "./templates_state";


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


export function TemplateBuilderRightView() {
    let activeElementID = activeTemplateElement.value;
    let activeElement = {};
    if(activeElementID.length === 0) {
        return <div></div>;
    } else {
      activeElement = activeTemplateElements[activeElementID].value;
    } 
    console.log("active template element changed:",activeElementID);
    const handleChange = (config) => {
      console.log("existing element:",activeElement);
      if(activeElement !== undefined) {
        console.log("config:",config);
        activeElement["configs"]["style"] = {...activeElement["configs"]["style"],...config};
        activeTemplateElements[activeElementID].value = {...activeElement};
      }
    };
  
    const handleSubmit = (config) => {
      if(activeElement !== undefined) {
        activeElement["configs"]["style"] = {...activeElement["configs"]["style"],...config};
        activeTemplateElements[activeElementID].value = {...activeElement};
        let mytemp = templates[activeTamplate.peek()];
        if(templateDesignView.value === "smartphone") {
            mytemp["mobile_children"] = JSON.parse(JSON.stringify(activeTemplateElements));
        } else {
            mytemp["desktop_children"] =  JSON.parse(JSON.stringify(activeTemplateElements));

        }
        templates[activeTamplate.peek()] = mytemp;
        localStorage.setItem("templates",JSON.stringify(templates));
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
        activeElement["configs"] = {...activeElement["configs"],...data};
        activeTemplateElements[activeElementID].value = {...activeElement};
        let mytemp = templates[activeTamplate.peek()];
        if(templateDesignView.value === "smartphone") {
            mytemp["mobile_children"] = JSON.parse(JSON.stringify(activeTemplateElements));
        } else {
            mytemp["desktop_children"] =  JSON.parse(JSON.stringify(activeTemplateElements));

        }
        templates[activeTamplate.peek()] = mytemp;
        localStorage.setItem("templates",JSON.stringify(templates));
      }
    }
  
    let advancedConfig = {};
    let configs = {};
    if(activeElement === undefined) {
        configs = {};
    } else {
        console.log("active Element:",activeElement);
        configs = activeElement["configs"]["style"];
        advancedConfig = GetAdvancedConfigs(activeElement,false);
    }
    return (<div>
      <FlexConfigTab tablSignal={templateRightPanelActiveTab} />
      {templateRightPanelActiveTab.value === "Basic" ?
          <FlexConfigurator onChange={handleChange} onSubmit={handleSubmit} existingConfig={configs} />
        : 
        <AdvnacedForm configsInp={advancedConfig} onSubmit={onAdvancedSubmit} />
      }
    </div>);
}