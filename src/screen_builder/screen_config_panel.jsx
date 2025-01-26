import { signal } from "@preact/signals"; // Assuming you have this import in your file
import { containerConfigmaps } from "../components/configs/container_config_provider";
import { FormRendererStatic } from "../components/custom/formComponents";
import { activeElement, screenElements } from "./screen_state";
import { elementConfigmaps } from "../components/configs/primitive_config_provider";
import AdvnacedForm from "../form_builder2/advanced_form";
import { FlexConfigTab } from "../form_builder2/form_edit_area";
import FlexConfigurator from "../form_builder2/flex_config";
const myconfig = signal({});

function ScreenRightPanel() {
    let myelement = screenElements[activeElement.value];
    const updateConfig = () => {

        if (myelement) {
            let temp = myelement.peek();
            let codestr = temp.configs.styleCode;
            myconfig.value = {
                "Style":codestr,
                "OnClick":temp.actions.onClick,
                "OnDoubleClick":temp.actions.onDoubleClick,
                "Value":temp.valueCode,
                "ShowHide":temp.childrenCode,
            };
    }};
    updateConfig();
    const updateDataback = (data) => {
        if (myelement) {
        let temp = myelement.peek();
        temp.configs.styleCode = data["Style"];
        temp.actions.onClick = data["OnClick"];
        temp.actions.onDoubleClick = data["OnDoubleClick"];
        temp.valueCode = data["Value"];
        temp.childrenCode = data["ShowHide"];
        screenElements[activeElement.peek()].value = {...temp}; 
        }
    }

    return (
        <div>
            <FlexConfigTab />
            {activeTab.value === "Basic" ? 
          <FlexConfigurator onChange={handleChange} onSubmit={handleSubmit} existingConfig={configs} />
       :
        <AdvnacedForm configsInp={advancedConfig} onSubmit={onAdvancedSubmit} />
            }
        </div>
    );
}


export { ScreenRightPanel };
