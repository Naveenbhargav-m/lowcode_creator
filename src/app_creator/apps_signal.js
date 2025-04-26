
import { effect, signal } from "@preact/signals";
import { CreatorAPPID, PrestClient } from "../states/global_state";

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
  let myclient = PrestClient;
  let url = `${CreatorAPPID}/public/apps`;
  let response = await myclient.get(url);

  apps.value = [...response];
}


function InsertNewApp(appData) {

}



export {apps, showForm , getAppsFromStorage , saveAppToStorage, GetAppsfromDB, InsertNewApp}