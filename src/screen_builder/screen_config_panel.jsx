import { signal } from "@preact/signals"; // Assuming you have this import in your file
import { activeConfigTab, activeElement, activeScreen, screenElementAdded, screenElements, screens, screenView } from "./screen_state";
import {AdvnacedForm} from "../form_builder/configs_view/advanced_form";
import { FlexConfigTab } from "../form_builder/form_right_elements";
import FlexConfigurator from "../form_builder/configs_view/flex_config";
import { generateUID } from "../utils/helpers";
import ConfigurableForm from "../components/generic/form";
import ConfigUpdater from "../components/generic/config_form";
const myconfig = signal({});
const basicConfig = signal({});

const defaultValues = {
    color: '#000000',
    backgroundColor: '#ffffff',
    borderRadius: '0px',
    fontFamily: 'Inter',
    fontSize: '14px',
    fontWeight: '400',
    padding: '0px',
    margin: '0px'
};
function ScreenRightPanel() {
    let actElem = activeElement.value;
    console.log("activity element:",actElem);
    let myelement = null;
    if(actElem === "screen") {

    } else {
        myelement = screenElements[activeElement.value];
    }
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
    } else {
        let configs = screens[activeScreen.value];
        if(configs === undefined) {
            return;
        }
        let view = screenView.value;
        let key = "desktop_style";
        if(view === "smartphone") {
            key = "mobile_style"
        }
        myconfig.value = {
            "Style":configs[key]
        };
        basicConfig.value = {...configs[key]};
    }
};
    updateConfig();
    const updateDataback = (data) => {
        if (myelement) {
        let temp = JSON.parse(JSON.stringify(myelement.peek()));
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
            temp2["_change_type"] = temp2["_change_type"] || "update";
            screens[activeScreen.value] = temp2;

        } 
        } else {
            let view = screenView.value;
            let key = "desktop_style";
            if(view === "smartphone") {
                key = "mobile_style"
            }
            screens[activeScreen.value][key] = data["Style"];
            screens[activeScreen.value]["_change_type"] = screens[activeScreen.value]["_change_type"] || "update";

        }
        localStorage.setItem("screen_config", JSON.stringify(screens));
        screenElementAdded.value = generateUID();
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
                temp2["_change_type"] = temp2["_change_type"] || "update";

                screens[activeScreen.value] = temp2;
            } 
        } else {
            let view = screenView.value;
            let key = "desktop_style";
            if(view === "smartphone") {
                key = "mobile_style"
            }
            screens[activeScreen.value][key] = {...data};
            screens[activeScreen.value]["_change_type"] = screens[activeScreen.value]["_change_type"] || "update";
        }
        screenElementAdded.value = generateUID();
        localStorage.setItem("screen_config", JSON.stringify(screens));
    }
    return (
        <ConfigUpdater initalData={basicConfig.value} updateCallBack={(newdata) => {updateStyleback(newdata)}}/>
    );
}


export { ScreenRightPanel };
