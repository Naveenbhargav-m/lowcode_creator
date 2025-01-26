import { signal } from "@preact/signals";
import { tables } from "../table_builder/table_builder_state";
import { GetAllFormsFromAPI, SetFormToAPI } from "../api/api";
import { generateUID } from "../utils/helpers";

let forms = {};
let FormtableFields = signal([]);
let formActiveTable = signal("");
let values = {};
let formChanged = signal("");
let activeElement = signal({});
let keysLen = {};
let activeTabForms = signal("forms");

let formParentSize = signal({});


function SetFormParentSize(bounds) {
    formParentSize.value = {...bounds};
}

// Function to initialize forms from localStorage
function LoadForms() {

var my_forms = GetAllFormsFromAPI();
my_forms.then((data) => {
    for(var i=0;i<data.length;i++) {
        console.log("data:",data);
        var obj = {};
        obj["table_name"] = data[i]["table_name"];
        obj["id"] = data[i]["id"];
        obj["form_name"] = data[i]["form_name"];
        var fields = data[i]["fields"];
        var fieldsmap = fields;
        var fieldObj = {};
        if(fieldsmap !== undefined && fieldsmap !== null) {
            for (const [id, entity] of Object.entries(fieldsmap)) {
                fieldObj[id] = signal({...entity});
            }
        }
        obj["fields"] = fieldObj;
        forms[data[i]["id"]] = obj;
    }
    formChanged.value = data[0]["id"];
    formActiveTable.value = data[0]["table_name"];
    console.log("forms ---:",forms);
});
}
function AddtoForm(data) {
    console.log("data in Add to form:", data);
    let fieldData = data["data"];
    let formName = data["dropElementData"]["name"];
    let fieldID = generateUID();
    let elementCondig = {
        id: fieldID,
        name: fieldData[1],
        type: fieldData[2],
        children: [],
        valueCode: "return NA;",
        position: { x: 10, y: 10 },
        size: { width: 50, height: 50 },
        value: "Some",
        styleCode: "return {};",
        style: {},
        onClick: "return nil;",
        onDoubleClick: "return nil;",
        onHover: "return nil",
        takeFocus: false,
        label: "Add Label:",
        labelPosition: "top",
    };

    let element = data["dropElementData"]["element"];
    console.log("element , formName", element, formName);
    if (element === "form") {
        let fields = forms[formName]["fields"];
        if (fields === undefined) {
            forms[formName]["fields"] = {};
        }
        forms[formName]["fields"][fieldID] = signal({ ...elementCondig });
        keysLen[formName] = keysLen[formName] + 1;
        console.log("forms:", forms);
        formChanged.value = "";
        formChanged.value = formName;
    } else {
        let requiredElement = forms[formName]["fields"][element].value;
        requiredElement["children"].push(elementCondig.id);
        forms[formName]["fields"][element].value = requiredElement;
        forms[formName]["fields"][keysLen[formName]] = signal({ ...elementCondig });
    }

    SetFormToAPI(forms[formName], formName);
    localStorage.setItem("forms", JSON.stringify(forms));
}

function UpdateDrag(formName, fieldsID, position) {
    if (forms[formName] && forms[formName]["fields"][fieldsID]) {
        let updatedField = { ...forms[formName]["fields"][fieldsID].value };
        updatedField.position = position;
        forms[formName]["fields"][fieldsID].value = updatedField;
        console.log(`Updated position for ${fieldsID} in ${formName}:`, position);
        activeElement.value = updatedField;
    }
    // SetFormToAPI(forms[formName], formName);
    localStorage.setItem("forms",JSON.stringify(forms));
}

function UpdateSize(formName, fieldsID, size) {
    if (forms[formName] && forms[formName]["fields"][fieldsID]) {
        let updatedField = { ...forms[formName]["fields"][fieldsID].value };
        updatedField.size = size;
        forms[formName]["fields"][fieldsID].value = updatedField;
        console.log(`Updated size for ${fieldsID} in ${formName}:`, size);

    }
    // SetFormToAPI(forms[formName], formName);
    localStorage.setItem("forms",JSON.stringify(forms));
}

function AddNewForm(name, table) {
    console.log("form name:", name, table);
    var obj = {"form_name":name, "table_name":table};
    let uid = generateUID();
    forms[uid] = {"uid":uid ,"form_name": name, "table_name":table ,fields: {} };
    var resp = SetFormToAPI(obj);
    resp.then(() => {
        formChanged.value = uid;
        formActiveTable.value = table;
        MakeFormTableFields();
        activeTabForms.value = "forms";
        localStorage.setItem("forms", JSON.stringify(forms));
    }
    );
}

function ChangeActiveForm(name) {
    console.log("Form Name:",name, forms);
    let tableName = forms[name]["table_name"];
    console.log("table name:",tableName);
    formActiveTable.value = tableName;
    formChanged.value = name;
    MakeFormTableFields();
}

function MakeFormTableFields() {
    let currentTable = formActiveTable.peek();
    let alltables = tables;
    Object.keys(alltables).map((key, ind) => {
        let innerSignal = tables[key].peek();
        console.log("inner signal:", innerSignal, currentTable);
        if (innerSignal["label"] === currentTable) {
            console.log("inner signal value", innerSignal);
            FormtableFields.value = [...Object.values(innerSignal["fields"])];

        }
    });
}

function UpdateFormField(formName, fieldID, fieldConfig) {
    // Ensure the form and field exist
    if (forms[formName] && forms[formName]["fields"][fieldID]) {
        // Create a copy of the current field's value
        let updatedField = { ...forms[formName]["fields"][fieldID].value };

        // Merge the new configuration into the existing field's value
        updatedField = { ...updatedField, ...fieldConfig };

        // Update the signal value with the merged configuration
        forms[formName]["fields"][fieldID].value = updatedField;

        // Log the update for debugging purposes
        console.log(`Updated field ${fieldID} in form ${formName}:`, updatedField);

        if (activeElement.value["id"] === fieldID && formChanged.value === formName) {
            activeElement.value = updatedField;
        }

        // Save changes to localStorage
        localStorage.setItem("forms", JSON.stringify(forms));
        SetFormToAPI(forms[formName], formName);
    } else {
        console.warn(`Field ${fieldID} or form ${formName} does not exist.`);
    }
}

export {
    formChanged,
    forms,
    activeTabForms,
    values,
    activeElement,
    FormtableFields,
    UpdateDrag,
    UpdateSize,
    AddtoForm,
    AddNewForm,
    ChangeActiveForm,
    UpdateFormField,
    LoadForms,
    SetFormParentSize,
};
