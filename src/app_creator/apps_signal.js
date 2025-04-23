
import { effect, signal } from "@preact/signals";

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

function GetAppsfromDB() {
  
  
}




export {apps, showForm , getAppsFromStorage , saveAppToStorage, GetAppsfromDB}