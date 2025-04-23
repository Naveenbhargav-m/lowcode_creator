import { effect, signal } from "@preact/signals";
import { APIManager } from "../api/api_manager";
import { GetDataFromAPi, SyncData } from "../api/api_syncer";

let sideBarEnable = signal(true);
const PrestDBaseUrl = "http://localhost:8000";
const CreatorBackendUrl = "http://localhost:8001";
const AppID = signal("doctors_app1chjxp");
const CreatorAPPID = signal("nokodo_creator");
let showFormPopup = signal("");

let globalConfigs = signal({
  "tables": ["customers", "Products", "sales", "teams", "items", "catalogs"],
  "screens": ["home", "customers", "others"],
});

let ApiClient = new APIManager(CreatorBackendUrl, 1000);
let PrestClient = new APIManager(PrestDBaseUrl, 1000);

let globalSignalsID = 1;
const variableMap = {};
// for (const [key, value] of Object.entries(localVarsmap)) {
//   variableMap[key] = signal(value);
// }
// Initialize signals
const newVariableKey = signal('');
const variableKeys = signal(Object.keys(variableMap));

//Add variable will add the new variable to the global signals.
const addVariable = () => {
    const key = newVariableKey.value.trim();
    if (key && !(key in variableMap)) {
      variableMap[key] = signal({});
      variableKeys.value = Object.keys(variableMap);
      newVariableKey.value = ''; // Reset the input field
    }
    SyncData("_global_states", [{"signals": variableMap, "id": globalSignalsID, "_change_type": "update"}]);
};

function LoadSignals() {
  GetDataFromAPi("_global_states").then((value) => {
    if(value === undefined) {
      return;
    }
    let globalElement = value[0];
    let id = globalElement["id"];
    let signals = globalElement["signals"];
    let keys = Object.keys(signals);
    for(var i=0;i<keys.length;i++) {
      variableMap[keys[i]] = signal({});
    }
    variableKeys.value = [...keys];
    globalSignalsID = id;
  });
}

// the below code part is regards the themes etc.
// setting default theme to the document and other stuff.
const DefaultThemeID = signal("");
const DefaultMode = signal("light");
const DefaultTheme = signal({});


let previousKeys = new Set(Object.keys(DefaultTheme.value));

effect(() => {
  const root = document.documentElement;
  let currentTheme = DefaultTheme.value;
  let mode = DefaultMode.value;
  let finalTheme = currentTheme[mode];
  if(finalTheme === undefined || finalTheme === null) {
    return;
  } 
  const newKeys = Object.keys(finalTheme);

  previousKeys.forEach((key) => {
    if (!newKeys.includes(key)) {
      root.style.removeProperty(`--${key}`);
    }
  });

  newKeys.forEach((key) => {
    root.style.setProperty(`--${key}`, finalTheme[key]);
  });
  previousKeys = new Set(newKeys);
});




// Export variables and functions
export {
    sideBarEnable, 
    addVariable, variableMap, variableKeys, newVariableKey, showFormPopup,
    DefaultMode, DefaultTheme, DefaultThemeID,
    PrestDBaseUrl, CreatorBackendUrl, AppID, globalConfigs,
    PrestClient, ApiClient, LoadSignals
};


