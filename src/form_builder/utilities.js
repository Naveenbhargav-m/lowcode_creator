function DeleteFormField(fieldArray , id) {
    let newarr = [];
    for(var i=0;i<fieldArray;i++) {
        let currentField = fieldArray[i];
        if(currentField["id"] === id) {
            continue
        }
        newarr.push(currentField);
    }
    return newarr;
}


function UpdateFormField(fieldArray , newconfig, id , index = -1) {
    let newarr = [];
    for(var i=0;i<fieldArray;i++) {
        let currentField = fieldArray[i];
        if(currentField["id"] === id) {
            currentField = {...currentField, ...newconfig};
            newarr.push(currentField);
        }
        if(index != -1 && index == i) {
            currentField = {...currentField, ...newconfig};
            newarr.push(currentField);
        }
        newarr.push(currentField);
    }
    return newarr;
}


function GetFormField(fieldArray, id , index = -1) {
    if(fieldArray === undefined) {
        return undefined;
    }
    for(var i=0;i<fieldArray.length;i++) {
        let currentField = fieldArray[i];
        if(currentField["id"] === id) {
            console.log("matched:",currentField);
            return currentField;
        }
        if(index != -1 && index == i) {
            return currentField;
        }
    }
    return undefined;
}
function AddFormField(fieldArray , config) {
    if(fieldArray === undefined) {
        return [config];
    }
    fieldArray.push(config);
    return fieldArray;
}


function AddChildren(fieldArray, id, childIds = []) {
    let newarr = [];
    for(var i=0;i<fieldArray;i++) {
        let currentField = fieldArray[i];
        if(currentField["id"] === id) {
            let existingArr = currentField["children"] || [];
            currentField["children"] = [...existingArr, ...childIds];
        }
        newarr.push(currentField);
    }
    return newarr;
}


export {DeleteFormField, GetFormField, UpdateFormField, AddChildren, AddFormField};