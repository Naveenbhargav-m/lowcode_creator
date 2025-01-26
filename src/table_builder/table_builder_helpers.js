import { signal } from "@preact/signals";
import { GetAllTableDataFromAPI, SetTableDataToAPI } from "../api/api";
import { currentEdges, currentTableConfigs, originalTablesdata, table_edges, tableNames, tables, tables_id, tablesFlag } from "./table_builder_state";


function TablesDataSetterFromAPI() {
  GetAllTableDataFromAPI().then((data) => {
    if(data !== undefined) {
      if(data["length"] === 0) {
        tables_id.value = null;
        return;
      } else {
        tables_id.value = data[0]["id"];
      }
      let tablesdata = data[0]["tables"];
      let edgesdata = data[0]["edges"];
      console.log("tables:",tablesdata);
      console.log("edges data:",edgesdata);
      let originalTablesdataString = JSON.stringify(tablesdata);
      originalTablesdata.value = JSON.parse(originalTablesdataString);
      if(tablesdata !== undefined) {
        Object.keys(tablesdata).forEach((key) => {
  
          tables[key] = signal({...tablesdata[key]});
          tableNames[key] = tablesdata[key]["label"]
        });
        tablesFlag.value = "1";
      }
      if(edgesdata !== undefined) {
        let edgearr = [];
        Object.keys(edgesdata).forEach((key) => {
          edgearr.push(edgesdata[key]);
        });
        table_edges.value = [...edgearr];
      }
    }
  })
}




function SaveTablesData() {
  let alltables = tables;
  let alledges = table_edges;
  let tablesJson = JSON.stringify(alltables);
  let edgesJson = JSON.stringify(alledges);
  let data = {"edges":edgesJson,"tables":tablesJson};
  SetTableDataToAPI(data, tables_id.peek());
}


export {TablesDataSetterFromAPI, SaveTablesData};