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
    let activeElement = activeTemplateElements[activeElementID];  ;
    const handleChange = (config) => {
      console.log("existing element:",activeElement);
      if(activeElement !== undefined) {
        console.log("config:",config);
        activeElement["style"] = {...activeElement["style"],...config};
        activeTemplateElements[activeElement].value = {...activeElement};
        // let mytemp = templates[activeTamplate.peek()];
        // if(templateDesignView.value === "smartphone") {
        //     mytemp["mobile_children"] = JSON.parse(JSON.stringify(activeTemplateElements));
        // } else {
        //     mytemp["desktop_children"] =  JSON.parse(JSON.stringify(activeTemplateElements));

        // }
        // templates[activeTamplate.peek()] = mytemp;
        // localStorage.setItem("templates",JSON.stringify(templates));
      }
    };
  
    const handleSubmit = (config) => {
      if(activeElement !== undefined) {
        activeElement["style"] = {...activeElement["style"],...config};
        activeTemplateElements[activeElement].value = {...activeElement};
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
        activeElement = {...activeElement,...data};
        activeTemplateElements[activeElement].value = {...activeElement};
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
        configs = activeElement["style"];
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