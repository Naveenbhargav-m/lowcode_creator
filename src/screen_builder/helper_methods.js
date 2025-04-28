import { activeElement } from "../screen_builder/screen_state";
import { AppID, PrestClient } from "../states/global_state";
import { templateNamesList } from "../template_builder/templates_state";


function setActiveElement(i) {
    console.log("called set active element");
    activeElement.value = i;
}


function UserTemplatesAndComponents() {
    let templateUrl = `${AppID}/_templates`;
    let componentsUrl = `${AppID}/_components`;
    PrestClient.get(templateUrl);
    PrestClient.get(componentsUrl);
}
const actionsmap = {
    "activeElement": setActiveElement,

};

export {actionsmap};
