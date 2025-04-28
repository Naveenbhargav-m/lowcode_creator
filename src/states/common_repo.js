import { signal } from "@preact/signals";
import { PrestClient } from "./global_state";
import { GetFeatureData, GetScreenGlobalData } from "../api/api_get_functions";

let dbtables = ["_templates", "_screens","_forms",
    "_components", "_global_states", "_themes","_workflows", "_queries", "_groups"];
let Templates = signal([]);
let Screens = signal([]);
let Components = signal([]);
let GlobalStates = signal([]);
let Workflows = signal([]);
let Themes = signal([]);
let Tables = signal([]);
let Views = signal([]);
let Triggers = signal([]);
let Relations = signal([]);
let QueryBlocks = signal([]);
let Forms = signal([]);
let Groups = signal([]);

let fieldsGlobalSignals = signal({});

function LoadTheDataRepo() {
  GetFeatureData("_screens").then((screens) => {
    let sortedScreens = GetScreenGlobalData(screens);
    let names = sortedScreens["names"];
    Screens.value = names;
  });

  GetFeatureData("_templates").then((screens) => {
    let sortedScreens = GetScreenGlobalData(screens);
    let names = sortedScreens["names"];
    Screens.value = names;
  });
}


export { 
   Templates, Screens, Components, GlobalStates,
   Workflows, Themes, Tables, Relations, QueryBlocks,
  Forms, Groups , Views, Triggers, fieldsGlobalSignals };