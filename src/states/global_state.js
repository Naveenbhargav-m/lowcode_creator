import { signal } from "@preact/signals";
import { SetGlobalFieldsToAPI } from "../api/api";

let activeElementID = signal(null);
let sideBarEnable = signal(true);


let showFormPopup = signal("");



let test1 = {};
test1["click1"] = signal(0);



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

// Export variables and functions
export {
    sideBarEnable, 
    addVariable, variableMap, variableKeys, newVariableKey,
    test1 , showFormPopup
};


