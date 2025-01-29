import { signal } from "@preact/signals"; // Assuming you have this import in your file
import { containerConfigmaps } from "../components/configs/container_config_provider";
import { FormRendererStatic } from "../components/custom/formComponents";
import { activeConfigTab, activeElement, screenElements } from "./screen_state";
import { elementConfigmaps } from "../components/configs/primitive_config_provider";
import AdvnacedForm from "../form_builder2/advanced_form";
import { FlexConfigTab } from "../form_builder2/form_edit_area";
import FlexConfigurator from "../form_builder2/flex_config";
const myconfig = signal({});
const basicConfig = signal({});

function ScreenRightPanel() {
    let myelement = screenElements[activeElement.value];
    console.log("active element in screen config panel:",activeElement.value, activeConfigTab.value);
    const updateConfig = () => {

        if (myelement) {
            let temp = myelement.peek();
            let configs = temp.configs;
            myconfig.value = {
                "Style":configs["style"],
                "OnClick":configs["onClick"],
                "OnDoubleClick":configs["onDoubleClick"],
                "Value":configs["value"],
                "ShowHide":configs["childrenCode"]
            };

            basicConfig.value = {...configs["style"]};
            console.log("basic config value:",basicConfig.value, configs);
    }};
    updateConfig();
    const updateDataback = (data) => {
        if (myelement) {
        let temp = myelement.peek();
        temp.configs.style = data["Style"];
        temp.configs.onClick = data["OnClick"];
        temp.configs.onDoubleClick = data["OnDoubleClick"];
        temp.configs.valueCode = data["Value"];
        temp.configs.childrenCode = data["ShowHide"];
        screenElements[activeElement.peek()].value = {...temp}; 
        localStorage.setItem("screen_config", JSON.stringify(screenElements));
        }
    }

    const updateStyleback = (data) => {
        if(myelement) {
            let temp = myelement.peek();
            temp.configs.style = {...temp.configs.style, ...data};
            screenElements[activeElement.peek()].value = {...temp}; 
            localStorage.setItem("screen_config", JSON.stringify(screenElements));
        }
    }
    return (
        <div>
            <FlexConfigTab tablSignal={activeConfigTab} />
            {activeConfigTab.value === "Basic" ? 
            <FlexConfigurator onChange={updateStyleback} onSubmit={updateStyleback} existingConfig={basicConfig.value} />
            : <AdvnacedForm configsInp={myconfig.value} onSubmit={updateDataback} />}
        </div>
    );
}


export { ScreenRightPanel };
