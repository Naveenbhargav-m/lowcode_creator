import { ConfigFormV3 } from "../components/generic/config_form_v3/config_form";
import { elementConfig, groupings, groupObjectValues, ungroupObjectValues } from "./configs";
import { activeTamplate, activeTemplateElement, activeTemplateElements, templateDesignView, templateRightPanelActiveTab, templates } from "./templates_state";



export function TemplateBuilderRightView() {
    let activeElementID = activeTemplateElement.value;
    let activeElement = {};
    if(activeElementID.length === 0) {
        return <div></div>;
    } else {
      activeElement = activeTemplateElements[activeElementID].value;
    } 
    console.log("active template element changed:",activeElementID);
    const handleChange = (styles) => {
      // styles = groupObjectValues(styles, groupings);
      console.log("existing element:",activeElement);
      if(activeElement !== undefined) {
        console.log("config:",styles);
        activeElement["configs"]["style"] = {...activeElement["configs"]["style"],...styles};
        activeTemplateElements[activeElementID].value = {...activeElement};
      }
    };
  
    const handleSubmit = (styles) => {
      styles = groupObjectValues(styles, groupings);
      console.log("inner styles to update:",styles);
      if(activeElement !== undefined) {
        activeElement["configs"]["style"] = {...activeElement["configs"]["style"],...styles};
        activeTemplateElements[activeElementID].value = {...activeElement};
        let mytemp = templates[activeTamplate.peek()];
        if(templateDesignView.value === "smartphone") {
            mytemp["mobile_children"] = JSON.parse(JSON.stringify(activeTemplateElements));
            mytemp["_change_type"] = mytemp["_change_type"] || "update";
        } else {
            mytemp["desktop_children"] =  JSON.parse(JSON.stringify(activeTemplateElements));
            mytemp["_change_type"] = mytemp["_change_type"] || "update";

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
            mytemp["_change_type"] = mytemp["_change_type"] || "update";
        } else {
            mytemp["desktop_children"] =  JSON.parse(JSON.stringify(activeTemplateElements));
            mytemp["_change_type"] = mytemp["_change_type"] || "update";

        }
        templates[activeTamplate.peek()] = mytemp;
        localStorage.setItem("templates",JSON.stringify(templates));
      }
    }
    console.log("active element:", activeElement);
    var initalConfig = activeElement["configs"] || {};
    var initalStyles = initalConfig["style"] || {};
    console.log("inital styles1:",initalStyles );
    var innerstyles = ungroupObjectValues(initalStyles);
    console.log("inner styles:",innerstyles);
    return (
    <div style={{width:"100%", "color": "black"}}>
      <ConfigFormV3 schema={elementConfig} initialValues={{...innerstyles.values}} 
      onChange={(data) => {handleChange(data|| {});}} onSubmit={(data) => {handleSubmit(data || {})}}/>
    </div>);
}