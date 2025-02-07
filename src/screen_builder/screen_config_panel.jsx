import { signal } from "@preact/signals"; // Assuming you have this import in your file
import { activeConfigTab, activeElement, activeScreen, screenElements, screens, screenView } from "./screen_state";
import AdvnacedForm from "../form_builder/configs_view/advanced_form";
import { FlexConfigTab } from "../form_builder/form_right_elements";
import FlexConfigurator from "../form_builder/configs_view/flex_config";
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
        let temp2 = screens[activeScreen.value];
        if(temp2 !== undefined) {
            let key = "mobile_children";
            if(screenView.peek() !== "smartphone") {
                key = "desktop_children";
            }
            temp2[key] = JSON.parse(JSON.stringify(screenElements));
            screens[activeScreen.value] = temp2;
        } 
        localStorage.setItem("screen_config", JSON.stringify(screens));
        }
    }

    const updateStyleback = (data) => {
        if(myelement) {
            let temp = myelement.peek();
            temp.configs.style = {...temp.configs.style, ...data};
            screenElements[activeElement.peek()].value = {...temp};
            let temp2 = screens[activeScreen.value];
            if(temp2 !== undefined) {
                let key = "mobile_children";
                if(screenView.peek() !== "smartphone") {
                    key = "desktop_children";
                }
                temp2[key] = JSON.parse(JSON.stringify(screenElements));
                screens[activeScreen.value] = temp2;
            } 
            localStorage.setItem("screen_config", JSON.stringify(screens));
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
