
import "./app_style.css";
import { useEffect, useState } from "preact/hooks";
import { apps, GetAppsfromDB, saveAppToStorage, showForm } from "./apps_signal";
import { generateRandomName } from "../utils/helpers";
import { CreateDatabase, databaseSignal, InsertAppToAPI } from "../api/api";

function AppList({ apps }) {
  useEffect((()=>{
    GetAppsfromDB();
  }),[]);
  return(
    <div class="app-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {apps.value.length > 0 ? (
        apps.value.map((app) => (
          <div
            key={app.id}
            class="w-40 h-40 border border-white shadow-md rounded-lg flex justify-center items-center bg-white"
            onClick={()=> {
                let newappname = app["gen_name"]+"/";
                localStorage.setItem("db_name",newappname);
                databaseSignal.value = newappname;
               }}
          >
            <span class="text-center font-medium text-black">{app.name}</span>
          </div>
        ))
      ) : (
        <div class="w-full text-center col-span-full">
          <p>No apps created yet.</p>
        </div>
      )}
    </div>
  );
}
  
  
  const AppForm = ({ apps, onClose }) => {
    const [appName, setAppName] = useState("");
  
    const handleSubmit = (e) => {
      e.preventDefault(); 
      if (appName.trim()) {
        const newApp = { created_at: new Date().toISOString(), name: appName , "gen_name":generateRandomName(appName) };
        InsertAppToAPI(newApp);
        CreateDatabase(newApp["gen_name"]);
        const updatedApps = [...apps.value, newApp];
        apps.value = updatedApps;
        saveAppToStorage(updatedApps);
        setAppName("");
        onClose();
      }
    };
  
    return (
      <div class="app-form-overlay">
        <div class="app-form-container">
          <h2>Create New App</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter app name"
              value={appName}
              // @ts-ignore
              onInput={(e) => setAppName(e.target.value)}
            />
            <div class="form-actions">
              <button type="submit" class="submit-button">
                Save
              </button>
              <button type="button" class="cancel-button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  

  

const CreateAppButton = ({ onClick }) => (
    <button class="create-app-button" onClick={onClick}>
      Create App
    </button>
  );

  function AppCreatorPage() {
    return (
      <div class="flex flex-col px-4">
        <h1 class="text-center text-lg font-bold mb-4">Low-Code App Builder</h1>
        <div class="flex justify-end mb-4">
          <div class="w-auto">
            <CreateAppButton onClick={() => (showForm.value = true)} />
          </div>
        </div>
        {showForm.value && <AppForm apps={apps} onClose={() => (showForm.value = false)} />}
        <div class="flex justify-center">
          <AppList apps={apps} />
        </div>
      </div>
    );
  }
  
  
export default AppCreatorPage;