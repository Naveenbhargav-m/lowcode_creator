import { ConfigFormV3 } from "../components/generic/config_form_v3/config_form";
import { GetQueries, GetQueryInputs, GetQueryOutputsOnly } from "../config_helpers/config_callbacks";
import { GeneralElementSchema, RootElementSchema, TemplateElementConfigFormSchema } from "./configs";
import { activeTamplate, activeTemplateElement, activeTemplateElements, MarkTemplateAsChanged, templateDesignView, templateRightPanelActiveTab, templates } from "./templates_state";


function GetConfigs(activeelementID) {  
  if(activeelementID === "screen" || activeelementID === "template") {
    return RootElementSchema;
  } else {
    return GeneralElementSchema
  }
}


export function TemplateBuilderRightView() {
    let activeElementID = activeTemplateElement.value;
    let activeElement = {};

    if(activeElementID.length === 0) {
        return <div></div>;
    } else {
      let activeSignal = activeTemplateElements[activeElementID] || {};
      activeElement = activeSignal.value;
    }

    const handleChange = (data) => {
      if(activeElementID === "screen") {
        console.log("Data: ",data);
      }
      if(activeElement !== undefined) {
        activeElement = {...activeElement,...data};
        activeTemplateElements[activeElementID].value = {...activeElement};
        MarkTemplateAsChanged(activeTamplate.value);
      }
    };
  
    const handleSubmit = (data) => {
      if(activeElementID === "screen") {
        console.log("new data:",data);
        return;
      }
      if(activeElement !== undefined && activeElementID !== "screen") {
        activeElement= {...activeElement,...data};
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
        MarkTemplateAsChanged(activeTamplate.value);
        localStorage.setItem("templates",JSON.stringify(templates));
      }
    };
    console.log("Active Element:",activeElement);
    let schema = GetConfigs(activeElementID);
    return (
    <div style={{width:"100%", "color": "black"}}>
      <ConfigFormV3 
      context={{
        "callbacks": {
          "get_query_names": GetQueries,
          "get_query_field_map": GetQueryOutputsOnly
        },
      }}
      schema={schema} 
      initialValues={{...activeElement}} 
      onChange={(data) => {handleChange(data|| {});}} onSubmit={(data) => {handleSubmit(data || {})}}/>
    </div>);
}