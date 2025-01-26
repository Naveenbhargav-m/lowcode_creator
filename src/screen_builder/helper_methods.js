import { activeElement } from "../screen_builder/screen_state";


function setActiveElement(i) {
    console.log("called set active element");
    activeElement.value = i;
}

const actionsmap = {
    "activeElement": setActiveElement,

};

export {actionsmap};
