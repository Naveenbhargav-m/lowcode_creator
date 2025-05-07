import { signal } from "@preact/signals";

let ComponentView = signal("smartphone");
let componentPagesSignal = signal("ui_components");

let componentNameList = signal([]);

let components = {};
export {ComponentView, componentPagesSignal, components, componentNameList};