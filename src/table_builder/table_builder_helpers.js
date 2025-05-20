import { signal } from "@preact/signals";
import { originalTablesdata, tables, tables_id, tablesFlag } from "./table_builder_state";
import { ApiClient, AppID, PrestClient } from "../states/global_state";


function TablesDataSetterFromAPI() {
}




function SaveTablesData(data) {
  let baseurl = `${AppID}/update-tables`;
  console.log("before patching prest data:",baseurl, data);
  ApiClient.post(baseurl, { "body": data});
}

export {TablesDataSetterFromAPI, SaveTablesData};