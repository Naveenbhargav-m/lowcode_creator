import { currentFormConfig, formActiveElement } from "./form_builder_state";
import { GetFormField } from "./utilities";



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


export function FormBuilderRightPanel() {
    let activeElementID = formActiveElement.value;
    let config = GetActiveElementConifg(activeElementID);
    console.log("form right panel config:",JSON.stringify(config), config);
    return (
        <div>
            Config for current field:
            {JSON.stringify(config)}
        </div>
    );
}