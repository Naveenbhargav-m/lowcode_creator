import { ConfigFormV3 } from "../components/generic/config_form_v3/config_form";
import { GetQueries, GetQueryOutputsOnly } from "../config_helpers/config_callbacks";
import { GeneralElementSchema, RootElementSchema } from "./configs";
import { activeTamplate, activeTemplateElement, activeTemplateElements, MarkTemplateAsChanged, templateDesignView, templateRightPanelActiveTab, templates } from "./templates_state";


function GetConfigs(activeelementID) {  
  if(activeelementID === "screen" || activeelementID === "template") {
    return RootElementSchema;
  } else {
    return GeneralElementSchema
  }
}

function GetTemplateInputs(template_id) {
  let curtemp = templates[template_id];
  let configs = curtemp["configs"];
  if(configs["configs"] !== undefined) {
    configs = configs["configs"];
  }
  let datasource = configs["data_source"] || {};
  let inputs = datasource["inputs"] || {};
  let inparr = [];
  for(var i=0;i<inputs.length;i++) {
    let cur = inputs[i];
    let obj = {
      "id": cur,
      "value": cur,
      "name": cur,
      "label": cur
    };
    inparr.push(obj);
  }
  return inparr;
}

function get_parent_inputs(formValues, fieldConfig, context) {
  if(context === undefined) {
    return [];
  }
  let data = context["data"] || {};
  let inputs = data["template_inputs"] || [];
  return inputs;
}


export function TemplateBuilderRightView() {
    let activeElementID = activeTemplateElement.value;
    let activeElement = {};

    if(activeElementID.length === 0) {
        return <div></div>;
    } else if(activeElementID === "screen") {
      let template_id = activeTamplate.value;
      let curtemplate = templates[template_id] || {};
      let configs = curtemplate["configs"];
      if(configs["configs"] !== undefined) {
        configs = configs["configs"];
      }
      activeElement =  {"configs": {
        "data_source": configs["data_source"] || {},
        "style": configs["style"] || {},
      }};
    } else {
      let activeSignal = activeTemplateElements[activeElementID] || {};
      activeElement = activeSignal.value;
    }

    const handleChange = (data) => {
      if(activeElementID === "screen") {
        let template_id = activeTamplate.value;
        let curtemplate = templates[template_id] || {};
        curtemplate["configs"] = {...curtemplate["configs"], ...data["configs"]};
        templates[template_id] = curtemplate;
        MarkTemplateAsChanged(activeTamplate.value);
        return;
      }
      if(activeElement !== undefined) {
        activeElement = {...activeElement,...data};
        activeTemplateElements[activeElementID].value = {...activeElement};
        MarkTemplateAsChanged(activeTamplate.value);
      }
    };
  
    const handleSubmit = (data) => {
        if(activeElementID === "screen") {
          let template_id = activeTamplate.value;
          let curtemplate = templates[template_id] || {};
          curtemplate["configs"] = {...curtemplate["configs"], ...data["configs"]};
          templates[template_id] = curtemplate;
          MarkTemplateAsChanged(activeTamplate.value);
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
    let inputsdata = GetTemplateInputs(activeTamplate.value);
    return (
    <div style={{width:"100%", "color": "black"}}>
      <ConfigFormV3 
      context={{
        "data": {
          "target_fields": inputsdata,
          "template_inputs": inputsdata,
        },
        "callbacks": {
          "get_query_names": GetQueries,
          "get_query_field_map": GetQueryOutputsOnly,
          "get_parent_inputs": get_parent_inputs,
        },
      }}
      schema={schema} 
      initialValues={{...activeElement}} 
      onChange={(data) => {handleChange(data|| {});}} onSubmit={(data) => {handleSubmit(data || {})}}/>
    </div>);
}