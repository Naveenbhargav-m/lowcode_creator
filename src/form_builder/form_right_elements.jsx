import { ConfigFormV3 } from "../components/generic/config_form_v3/config_form";
import { formFieldSchema } from "./configs/form_options";
import { currentFormConfig, formActiveElement } from "./form_builder_state";
import { GetFormField, UpdateFormField } from "./utilities";



function GetActiveElementConifg(id) {
    console.log("id , current form config:",id, currentFormConfig.value);
    let fields = currentFormConfig.value["fields"] || [];
    console.log("fields : ", fields);
    let config = GetFormField(fields, id);
    console.log("config output:",config);
    if (config === undefined) {
        config = {};
    }
    return config;
}


function HandleDataChange(data) {
    let activeID = formActiveElement.value;
    let fields = currentFormConfig.value["fields"] || [];
    let currfield = GetFormField(fields, activeID);
    let newfield = {...currfield, ...data};
    let newarr = UpdateFormField(fields, newfield, activeID);
    let curconfig = currentFormConfig.value;
    curconfig["fields"] = newarr;
    currentFormConfig.value = {...curconfig};
    
}

export function FormBuilderRightPanel() {
    let activeElementID = formActiveElement.value;
    let config = GetActiveElementConifg(activeElementID);
    console.log("form right panel config:",JSON.stringify(config), config);
    return (
        <div>
           <ConfigFormV3 initialValues={{...config}} schema={formFieldSchema} onChange=
           {
            (data) => {
            HandleDataChange(data);
           }} 
           onSubmit={
            (data) => {HandleDataChange(data)}
           }/>
        </div>
    );
}