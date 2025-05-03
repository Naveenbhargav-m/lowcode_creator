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

let fieldsGlobalSignals = signal({
    "users": [
      { "name": "id", "value": "id" },
      { "name": "name", "value": "name" },
      { "name": "age", "value": "age" },
      { "name": "post_id", "value": "post_id" },
      { "name": "order_id", "value": "order_id" },
      { "name": "account_id", "value": "account_id" },
      { "name": "locality", "value": "locality" },
      { "name": "scoring", "value": "scoring" }
    ],
    "orders": [
      { "name": "id", "value": "id" },
      { "name": "name", "value": "name" },
      { "name": "from", "value": "from" },
      { "name": "to", "value": "to" },
      { "name": "order_date", "value": "order_date" },
      { "name": "item", "value": "item" }
    ],
    "posts": [
      { "name": "id", "value": "id" },
      { "name": "name", "value": "name" },
      { "name": "posted_at", "value": "posted_at" },
      { "name": "to_location", "value": "to_location" },
      { "name": "to_user", "value": "to_user" }
    ]
    
});

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