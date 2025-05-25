import { activeElement } from "../screen_builder/screen_state";
import { variableKeys, variableMap } from "./global_state";

function FunctionExecutor(signals, functionStr) {
    if(typeof functionStr !== "string") {
        return undefined;
    }
    // Get keys and values from the signals object
    const keys = Object.keys(signals);
    const values = Object.values(signals);
    // Dynamically create a function with the signal keys as parameters
    const myfunc = new Function(...keys, functionStr);

    // Call the function with the values of the signals object
    const response = myfunc(...values);

    return response;
}



function ActionExecutor( i , action) {
    let element = {};
    return;
    const actionStr = element["configs"][action];
    let myfunc;
    const keys = Object.keys(variableMap); // Get parameter names from variableMap
    const values = Object.values(variableMap); // Get corresponding values
    
    try {
        // Dynamically create a function with variableMap keys as parameters
        myfunc = new Function(...keys, actionStr);
    } catch (error) {
        return;
    }
    
    let response;
    try {
        // Call the function, passing in variableMap values as individual arguments
        response = myfunc(...values);
    } catch (error) {
        return;
    }
    
    
    // Ensure the response is an object
    const responseObj = typeof response === 'object' && response !== null ? response : {};
    
    for (const key in responseObj) {
        const cursignal = variableMap[key];
        if (cursignal == null) {

            continue;
        }
    
        // Merge current signal value with response data for the key
        const curvalue = cursignal.peek();
        let updatedValue;
        if (typeof responseObj[key] === 'object' && responseObj[key] !== null) {
            // Merge if responseObj[key] is an object
            updatedValue = { ...curvalue, ...responseObj[key] };
            variableMap[key].value = updatedValue;
        } else {
            // Directly assign if responseObj[key] is a primitive value
            updatedValue = responseObj[key];
            variableMap[key].value = updatedValue;
        }
    }
    

}


export {FunctionExecutor , ActionExecutor};