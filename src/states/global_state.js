import { effect, signal } from "@preact/signals";
import { SetGlobalFieldsToAPI } from "../api/api";

let sideBarEnable = signal(true);


let showFormPopup = signal("");


// Retrieve stored variables from localStorage
let localVars = localStorage.getItem("global_var");
let localVarsmap;

try {
  localVarsmap = localVars ? JSON.parse(localVars) : {};
} catch (error) {
  localVarsmap = {};
}

const variableMap = {};
for (const [key, value] of Object.entries(localVarsmap)) {
  variableMap[key] = signal(value);
}
// Initialize signals
const newVariableKey = signal('');
const variableKeys = signal(Object.keys(variableMap));

const addVariable = () => {
    const key = newVariableKey.value.trim();
    if (key && !(key in variableMap)) {
      variableMap[key] = signal({});
      console.log("in if condition global map", variableMap);
      variableKeys.value = Object.keys(variableMap);
      newVariableKey.value = ''; // Reset the input field
    }
    localStorage.setItem("global_var", JSON.stringify(variableMap));
    SetGlobalFieldsToAPI({"states":JSON.stringify(variableMap), "screen_id":1,"screen_name":"Sample Screen"},1);
};


const DefaultThemeID = signal("");
const DefaultMode = signal("light");
const DefaultTheme = signal({});


let previousKeys = new Set(Object.keys(DefaultTheme.value));

effect(() => {
  console.log("updating the document with new theme:",DefaultTheme.value);
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
    DefaultMode, DefaultTheme, DefaultThemeID
};


