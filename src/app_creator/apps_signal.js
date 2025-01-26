
import { effect, signal } from "@preact/signals";
import {  GetAppsfromAPI } from "../api/api";

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
  GetAppsfromAPI().then((data) => {
    apps.value = [...data];
  });
  
}




export {apps, showForm , getAppsFromStorage , saveAppToStorage, GetAppsfromDB}