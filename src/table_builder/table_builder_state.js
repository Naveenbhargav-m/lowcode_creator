import { signal } from "@preact/signals";
import { generateUID } from "../utils/helpers";
import { ApplyEditOperations } from "./table_builder_functions";

let tables_id = signal(null);
let tables = {};
let table_edges = signal([]);
let tableNames = {};

let originalTablesdata = signal({});

let currentTableConfigs = {};
let currentEdges = {};

let dbViewSignal = signal("Tables");
const tablesFlag = signal("");
const activeTable = signal("");
const activeField = signal({});

function UpdateTableEdges(newEdge) {
  let sourceHandler = newEdge["sourceHandle"];
  let targetHandler = newEdge["targetHandle"];
  let key = sourceHandler + "_" + targetHandler;
  newEdge["key"] = key;
  let existingEdges = table_edges.peek();
  let newkey = newEdge["key"];
  let existingedge = currentEdges[newEdge];
  if(existingedge === undefined) {
    currentEdges[newkey] = newEdge;
  } else {
    currentEdges[newkey] = {...existingedge, ...newEdge};
  }
  UpdateRelation(newEdge, "add");
  const updatedEdges = [...existingEdges, newEdge];
  table_edges.value = updatedEdges;

  localStorage.setItem("edges",JSON.stringify(table_edges.peek()));
}


function setDragData(data) {
}

// Function to add a field to an existing table
function addField(data) {
  console.log("called add field", data);
  const tableId = data.dropElementData.table;
  const fieldName = data.data[1];
  const sqltype = data.data[2];
  const tableSignal = tables[tableId];
  console.log("tables signals:",tableSignal, fieldName, tableId);
  if (tableSignal) {
    const updatedTable = { ...tableSignal.value };
    updatedTable.fields = updatedTable.fields || {};
    let fieldsLen = Object.keys(updatedTable.fields).length;
    console.log("fields length:",fieldsLen);
    let fieldData = {
      "uid":generateUID(),
      name: fieldName,
      type: fieldName,
      "sql_type":sqltype,
      table: tableId,
      "order":fieldsLen + 1,
      required: false,
      default:null,
      relation:null,
    };
    let FieldID = fieldData["uid"];
    let currentTable = currentTableConfigs[tableId];
    if(currentTable === undefined) {
      console.log("current table is undefined:",currentTableConfigs, tableId);
      currentTableConfigs[tableId] = {
        "label":tableSignal.value["label"],
        "id":tableId,
        "fields": {FieldID:{"operation":"add",...fieldData}}
      };
    } else {
      let existingfields = currentTableConfigs[tableId]["fields"] || {};
      console.log("current table is existing fields:",existingfields);
      existingfields[FieldID] = {"operation":"add",...fieldData};
      currentTableConfigs[tableId]["fields"] = existingfields;
    }
    updatedTable.fields[FieldID] = { ...fieldData };
    tableSignal.value = updatedTable;
  }
  localStorage.setItem("tables",JSON.stringify(tables));
}

function setTableField(tableID , fieldID, config) {
  console.log("Se tables Field:",tableID, fieldID, config, tables);
  let currtable =  tables[tableID].value;
  updateCurrentEditCopyoffield(tableID, fieldID, config, currtable["label"]);
  if(fieldID === undefined) {
    currtable = {...currtable,...config};
    tables[tableID].value = {...currtable};
    tableNames[tableID] = config["label"];
    return;
  }
  let existingField = currtable["fields"][fieldID];
  if(config["name"] !== existingField["name"] && config["name"] !== "" && config["name"] !== undefined) {
    existingField["old_name"] = config["name"];
  }
  currtable["fields"][fieldID] = {...existingField,...config};
  tables[tableID].value = {...currtable};
  localStorage.setItem("tables",JSON.stringify(tables));  
}


function addContainer(data) {
  const deepCopiedData = JSON.parse(JSON.stringify(data));
  console.log("deep copy data:",deepCopiedData);
  let uid = data["id"];
  tables[uid] = signal({...data});
  let fieldID = "";
  Object.keys(deepCopiedData["fields"]).map((key) => {
    fieldID = key;
  });
  deepCopiedData["fields"][fieldID] = {"operation":"add", ...deepCopiedData["fields"][uid]}; 
  currentTableConfigs[uid] = {...deepCopiedData};
  tableNames[uid] = data.label;
  tablesFlag.value = uid;
  activeTable.value = uid;
  localStorage.setItem("tables", JSON.stringify(tables));
}


// Function to delete a table container
function deleteContainer(index) {
  delete tables[index];
  delete currentTableConfigs[index];
  delete tableNames[index];

}

function Deletefield(tableID , fieldID) {
  let tablesig = tables[tableID].peek();
  let fields = tablesig["fields"];
  fields.splice(fieldID, 1);
  tablesig["fields"] = fields;
  tables[tableID].value = tablesig;
}

function updateCurrentEditCopyoffield(tableID , fieldID , config , tableLabel) {
  console.log("update current Edit copyOff field data:",tableID, fieldID, config, tableLabel, originalTablesdata.value);
  let curtable = currentTableConfigs[tableID];

  let oldtable = originalTablesdata.value[tableID];
  if(curtable === undefined) {
    if(fieldID === undefined) {
      let oldLabel = oldtable["label"];
      currentTableConfigs[tableID] = {"operation":"rename_table","old_name":oldLabel,...config};
    } else {
      let orignalField = oldtable["fields"][fieldID];
      config = ApplyEditOperations(config, orignalField);
      currentTableConfigs[tableID] = {
        "label": tableLabel,
        "fields":[{...config}]
      };
    }
      return;
  }
  if(fieldID === undefined) {
    if(oldtable === undefined) {
      let temp = currentTableConfigs[tableID];
      let mergedObj = {...temp, ...config};
      console.log("------------ temp --------:",temp, config, mergedObj);
      currentTableConfigs[tableID] = mergedObj;
      curtable = mergedObj;
    } else {
      let oldLabel = oldtable["label"];
      curtable = {...curtable, "operation":"rename_table","old_name":oldLabel,...config};
    }
  } else {
    let existingField = curtable["fields"][fieldID];
    if(existingField === undefined) {
      let orignalField = oldtable["fields"][fieldID];
      config = ApplyEditOperations(config, orignalField);
      curtable["fields"][fieldID] = {"operation":"edit",...config};
    } else {
      curtable["fields"][fieldID] = {...existingField,...config};
    }
  }

  currentTableConfigs[tableID] = curtable;

}

function UpdateRelation(edge,action) {
  console.log("edge Data:",edge);
  let sourceHandler = edge["sourceHandle"];
  let targetHandler = edge["targetHandle"];

  let sourceparts = sourceHandler.split("-");
  let sourceTableID = sourceparts[1];
  let sourceFieldID = sourceparts[2];

  let targetParts = targetHandler.split("-");
  let targetTableID = targetParts[1];
  let targetFieldID = targetParts[2];

  let curSourceTable = currentTableConfigs[sourceTableID];

  let isCurSourceFound = true;
  let isCurSourceFieldsFound = true;
  let isCurSourceFieldRequiredFound = true;

  let isTargetSourceFound = true;
  let isTargetSourceFieldsFound = true;
  let idTargetSourceFieldRequiredFound = false;

  if(curSourceTable === undefined) {
    console.log("current source table ID:",sourceTableID);
    curSourceTable = originalTablesdata.value[sourceTableID];
    isCurSourceFound = false;
  }

  let curFields = curSourceTable["fields"];
  if(curFields === undefined) {
    curFields = originalTablesdata.value[sourceTableID]["fields"];
    isCurSourceFieldsFound = false;
  }
  let currequiredField = curFields[sourceFieldID];
  if(currequiredField === undefined) {
    currequiredField = originalTablesdata.value[sourceTableID]["fields"][sourceFieldID]; 
      isCurSourceFieldRequiredFound = false;
  }

  let curTargetTable = currentTableConfigs[targetTableID];

  if(curTargetTable === undefined) {
    curTargetTable = originalTablesdata.value[sourceTableID];
    isTargetSourceFound = false;
  }

  let curTargetFields = curTargetTable["fields"];
  if(curTargetFields === undefined) {
    curTargetFields = originalTablesdata.value[targetTableID]["fields"];
    isTargetSourceFieldsFound = false;
  }
  let currequiredTargetField = curTargetFields[targetFieldID];
  if(currequiredTargetField === undefined) {
    console.log("orignal tables data:",originalTablesdata.value);
    currequiredTargetField = originalTablesdata.value[targetTableID]["fields"][targetFieldID];
    idTargetSourceFieldRequiredFound = true;
  }


  if(isCurSourceFound && isCurSourceFieldsFound && isCurSourceFieldRequiredFound ) {
    if(action === "add") {
      let curtableName = curTargetTable["label"];
      currequiredField["relation"] = curtableName + "."+currequiredTargetField["name"];
    } else if(action === "drop") {
      currequiredField["relation"] = null;
    }
    currentTableConfigs[sourceTableID]["fields"][sourceFieldID] = currequiredField;
  }
  if(isCurSourceFound && (!isCurSourceFieldsFound && isCurSourceFieldRequiredFound) ) {
    if(action === "add") {
      let curtableName = curTargetTable["label"];
      currequiredField["relation"] = curtableName + "."+currequiredTargetField["name"];
    } else if(action === "drop") {
      currequiredField["relation"] = null;
    }

    currentTableConfigs[sourceTableID]["fields"][sourceFieldID] = {...currequiredField};
  }

  if(isCurSourceFound && isCurSourceFieldsFound && (!isCurSourceFieldRequiredFound)) {
    if(action === "add") {
      let curtableName = curTargetTable["label"];
      currequiredField["relation"] = curtableName + "."+currequiredTargetField["name"];
    } else if(action === "drop") {
      currequiredField["relation"] = null;
    }

    currentTableConfigs[sourceTableID]["fields"][sourceFieldID] = {...currequiredField};
  }
}

export { setDragData, addContainer, deleteContainer, addField,
   tables,tablesFlag , activeField , activeTable, setTableField,
   tableNames,UpdateTableEdges,table_edges,currentTableConfigs , currentEdges,
   tables_id,Deletefield, UpdateRelation, originalTablesdata,
   dbViewSignal,
  };
