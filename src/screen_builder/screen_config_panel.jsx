import { signal } from "@preact/signals"; // Assuming you have this import in your file
import {activeElement, activeScreen, screenElementAdded, screenElements, screens, screenView } from "./screen_state";
import { generateUID } from "../utils/helpers";
import ConfigUpdater from "../components/generic/config_form";
import { ConfigFormV3 } from "../components/generic/config_form_v3/config_form";
import { TemplateElementConfigFormSchema } from "../template_builder/configs";
import { data } from "autoprefixer";


function ScreenRightPanel() {
    let actElem = activeElement.value;
    let myelementsignal = screenElements[actElem] || {};
    let myelement = myelementsignal.value || {};
    const updateDataback = (data) => {
        if (myelement) {
        let temp = JSON.parse(JSON.stringify(myelement));
        
        screenElements[activeElement.peek()].value = {...temp, ...data}; 
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

    return (
        <ConfigFormV3 schema={TemplateElementConfigFormSchema} initialValues={myelement} 
        onChange={(data) => {
            updateDataback(data);
        }} onSubmit={
            () => {updateDataback(data)}
        }/>
    );
}
export { ScreenRightPanel };