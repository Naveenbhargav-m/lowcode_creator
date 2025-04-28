import { signal } from "@preact/signals";
import { ApiClient, AppID, PrestClient } from "../states/global_state";

let tables_id = signal(null);
let tables = signal([]);
let originalTablesdata = signal({});
let dbViewSignal = signal("Tables");
const tablesFlag = signal("");
const activeTable = signal("");
const activeField = signal({});

async function LoadTables() {
  var endpoint = `${AppID}/public/_tables`;
  let dbtables = await PrestClient.get(endpoint);
  return dbtables;
}

async function SaveTablesData(data) {
  let datajson = data;
  let baseurl = `update-table/${AppID}`
  let resp = await ApiClient.post(baseurl, {body: datajson} );
  return resp;
}

export {
   tables,tablesFlag , activeField , activeTable,
   tables_id, originalTablesdata,
   dbViewSignal, LoadTables, SaveTablesData
  };
