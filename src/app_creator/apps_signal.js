
import { effect, signal } from "@preact/signals";
import { ApiClient, CreatorAPPID, PrestClient } from "../states/global_state";

const APP_STORAGE_KEY = "apps";


const getAppsFromStorage = () => {
  const apps = localStorage.getItem(APP_STORAGE_KEY);
  return apps ? JSON.parse(apps) : [];
};

const saveAppToStorage = (apps) => {
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(apps));
};

const apps = signal([]);
const showForm = signal(false);

async function GetAppsfromDB() {
  let myclient = ApiClient;
  let url = `${CreatorAPPID}/public/apps`;
  let response = await myclient.get(url);

  apps.value = [...response];
}


function InsertNewApp(appData) {
  let baseurl = `create-database`;
  let dbname = appData["gen_name"];
  let firstbody = {"name": dbname};
  ApiClient.post(baseurl, {body:firstbody}).then((resp) => {
    if(resp === undefined) {
      return;
    }
    if(resp["status"] !== "success") {
      return;
    }
    let creatorBase = `${CreatorAPPID}/public/apps`;
    ApiClient.post(creatorBase, {body:appData});
    let existing = apps.value;
    existing.push(appData);
    apps.value = [...existing];

  });
}



export {apps, showForm , getAppsFromStorage , saveAppToStorage, GetAppsfromDB, InsertNewApp}