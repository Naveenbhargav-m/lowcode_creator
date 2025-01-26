import { signal } from "@preact/signals";
import { FormRendererStatic } from "../components/custom/formComponents";
// @ts-ignore
import { formConfigs } from "../components/custom/screenConfigForms";
import { activeElement } from "./form_state2";
import { elementConfigmaps } from "../components/configs/primitive_config_provider";

const myconfig = signal({});



function FormRightPanel() {

    let myelement = activeElement.value;
    console.log("my element:", myelement);
    const updateConfig = () => {
        console.log("my element in update config:", myelement);

        if (myelement) {
            let temp = myelement;
            let codestr = temp["styleCode"];
            myconfig.value = {
                "Style":codestr,
                "OnClick":temp["onClick"],
                "OnDoubleClick":temp["onDoubleClick"],
                "Value":temp["valueCode"],
            };
    }};
    updateConfig();
    
    function UpdateBack(Data) {
        myelement["styleCode"] = Data.Style;
        myelement["onClick"] = Data.OnClick;
        myelement["onDoubleClick"] = Data.OnDoubleClick;
        myelement["valueCode"] = Data.Valuel;
        activeElement.value = myelement;
    }


    return (
        <div>
            { myelement ? 
                <FormRendererStatic
                formConfig={elementConfigmaps.formElementConfig}
                formData={{...myconfig.value}}
                styles={{"Save": {"margin": "20px 10px", "width": "90%", "text": "Save"}}}
                onFormChange={(data) => UpdateBack(data)}
                onSubmit={(data) => console.log("form config in screen:", data)}
            /> : <div></div>
            }
        </div>
    );
}


// function FormRightPanel() {
//     return <div>
//         <FormRendererStatic formConfig={formConfigs} 
//         formData={{}} styles={{"submit":{"margin":"20px 10px", "width":"90%"}}} 
//         onFormChange={(data) => console.log("form config data:",data)}
//         onSubmit={(data) => console.log("form config data:",data)}
//         />
//     </div>
// }

export {FormRightPanel};