import { APIManager } from "../api/api_manager";
import { GetDataFromAPi } from "../api/api_syncer";
import { queries } from "../query_builder/query_signal";
import { LoadTables } from "../table_builder/table_builder_state";
import { ApiClient, AppID, PrestDBaseUrl } from "./global_state";

let global_templates = {};
let global_screens = {};
let global_components = {};
let global_forms = {};
let global_states = {};
let global_workflows = {};
let global_tables = {};
let global_views = {};
let global_queries = {};
let global_data_templates = {};
let global_secrets = {};
let global_groups = {};
let global_user_fields = {};

let data_map = {};

// APPROACH 1: Using Promise.all (Recommended)
async function InitGlobalData() {
    try {
        await Promise.all([
            LoadGlobalTemplates(),
            LoadGlobalScreens(),
            LoadGlobalForms(),
            LoadGlobalTables(),
            LoadGlobalViews(),
            LoadGlobalWorkflows(),
            LoadQueries()
        ]);
        
        // Now all data is loaded, create the data map
        CreateDataMap();
        console.log("All global data loaded and data map created:", data_map);
    } catch (error) {
        console.error("Error loading global data:", error);
    }
}

// APPROACH 2: Using a counter (Alternative)
/*
let loadingCounter = 0;
const totalLoaders = 7; // Number of loading functions

function InitGlobalData() {
    LoadGlobalTemplates();
    LoadGlobalScreens();
    LoadGlobalForms();
    LoadGlobalTables();
    LoadGlobalViews();
    LoadGlobalWorkflows();
    LoadQueries();
}

function onLoadComplete() {
    loadingCounter++;
    if (loadingCounter === totalLoaders) {
        CreateDataMap();
        console.log("All global data loaded and data map created:", data_map);
    }
}
*/

async function LoadQueries() {
    try {
        let url = `${AppID.value}/public/_queries`;
        const data = await ApiClient.get(url);
        
        if(data === undefined) {
            console.log("queries data is undefined:", data);
            return;
        }
        
        var temp = {};
        let length = data.length;
        for(var i = 0; i < length; i++) {
            let cur = data[i];
            let id = cur["id"];
            let innerdata = cur["query_data"];
            innerdata["id"] = id;
            temp[id] = innerdata;
        }
        global_queries = {...temp};
        console.log("global queries:", global_queries);
        
        // If using counter approach, uncomment this:
        // onLoadComplete();
    } catch (error) {
        console.error("Error loading queries:", error);
        throw error; // Re-throw for Promise.all to catch
    }
}

async function LoadGlobalTemplates() {
    try {
        const myscreens = await GetDataFromAPi("_templates");
        
        if (!myscreens || myscreens.length === 0) {
            global_templates = {};
            return;
        }
        
        let screensmap = {};
        for (let i = 0; i < myscreens.length; i++) {
            let curScreen = myscreens[i];
            screensmap[curScreen["id"]] = { ...curScreen["configs"], "id": curScreen["id"] };
        }
        global_templates = screensmap;
        console.log("global templates:", global_templates);
        
        // If using counter approach, uncomment this:
        // onLoadComplete();
    } catch (error) {
        console.error("Error loading global templates:", error);
        throw error;
    }
}

async function LoadGlobalScreens() {
    try {
        const myscreens = await GetDataFromAPi("_screens");
        
        if (!myscreens || myscreens.length === 0) {
            global_screens = {};
            return;
        }
        
        let screensmap = {};
        for (let i = 0; i < myscreens.length; i++) {
            let curScreen = myscreens[i];
            screensmap[curScreen["id"]] = { ...curScreen["configs"], "id": curScreen["id"], "name": curScreen["screen_name"] };
        }
        global_screens = screensmap;
        console.log("global screens:", screensmap);
        
        // If using counter approach, uncomment this:
        // onLoadComplete();
    } catch (error) {
        console.error("Error loading global screens:", error);
        throw error;
    }
}

async function LoadGlobalForms() {
    try {
        const forms_data = await GetDataFromAPi("_forms");
        
        if (!forms_data || forms_data.length === 0) {
            console.log("my forms_data is null:", forms_data);
            global_forms = {};
            return;
        }
        
        let screensmap = {};
        for (let i = 0; i < forms_data.length; i++) {
            let curForm = forms_data[i];
            screensmap[curForm["id"]] = { ...curForm["configs"], "id": curForm["id"], "name": curForm["form_name"] };
        }
        global_forms = screensmap;
        console.log("global forms:", global_forms);
        
        // If using counter approach, uncomment this:
        // onLoadComplete();
    } catch (error) {
        console.error("Error loading global forms:", error);
        throw error;
    }
}

async function LoadGlobalTables() {
    try {
        const data = await LoadTables();
        
        console.log("tables data from db:", data);
        if(data === undefined) {
            return;
        }
        
        let firstObj = data[0];
        if(firstObj === undefined) {
            return;
        }
        
        var tableData = firstObj["tables_data"];
        if(tableData === undefined) {
            return;
        }
        
        let tables = tableData["tables"] || [];
        let relations = tableData["relations"] || [];
        var tablesmap = {};
        
        for(var i = 0; i < tables.length; i++) {
            let curtable = tables[i];
            let name = curtable["name"];
            tablesmap[name] = curtable;
        }

        global_tables = tablesmap;
        console.log("global tables:", global_tables);
        
        // If using counter approach, uncomment this:
        // onLoadComplete();
    } catch (error) {
        console.error("Error loading global tables:", error);
        throw error;
    }
}

async function LoadGlobalViews() {
    try {
        let prestApi = new APIManager(PrestDBaseUrl);
        const resp = await prestApi.get(`/${AppID.value}/public/_views`);
        
        if(resp !== undefined) {
            let innerobj = resp[0] || {};
            let viewConfig = innerobj["views_data"] || [];
            var viewmap = {};
            
            for(var i = 0; i < viewConfig.length; i++) {
                let currentView = viewConfig[i];
                let name = currentView["name"];
                global_views[name] = currentView;
            }
            console.log("global views:", global_views);
        }
        
        // If using counter approach, uncomment this:
        // onLoadComplete();
    } catch (error) {
        console.error("Error loading global views:", error);
        throw error;
    }
}

async function LoadGlobalWorkflows() {
    try {
        const myflows = await GetDataFromAPi("_workflows");
        
        console.log("called load workflows:", myflows);
        if(myflows === undefined) {
            return;
        }
        if(myflows.length === undefined) {
            return;
        }
        
        let temp = {};
        for(var i = 0; i < myflows.length; i++) {
            let curflow = myflows[i];
            let id = curflow["id"];
            temp[id] = curflow;
        }
        global_workflows = temp;
        console.log("global workflows:", global_workflows);
        
        // If using counter approach, uncomment this:
        // onLoadComplete();
    } catch (error) {
        console.error("Error loading global workflows:", error);
        throw error;
    }
}

function CreateDataMap() {
    let tempmap = {
        "queries": [],
        "screens": [],
        "forms": [],
        "tables": {},
        "workflows": [],
        "templates": [],
    };
    
    let mykeys = Object.keys(global_queries);
    for(var i = 0; i < mykeys.length; i++) {
        let name = global_queries[mykeys[i]]["name"]
        var obj = {"id": mykeys[i], "name": name};
        tempmap["queries"].push(obj); 
    }
    
    mykeys = Object.keys(global_screens);
    console.log("global screens:", global_screens);
    for(var i = 0; i < mykeys.length; i++) {
        let name = global_screens[mykeys[i]]["name"]
        var obj = {"id": mykeys[i], "name": name};
        tempmap["screens"].push(obj); 
    }
    
    mykeys = Object.keys(global_forms);
    console.log("global forms:", global_forms);
    for(var i = 0; i < mykeys.length; i++) {
        let name = global_forms[mykeys[i]]["name"]
        var obj = {"id": mykeys[i], "name": name};
        tempmap["forms"].push(obj); 
    }

    mykeys = Object.keys(global_tables);
    for(var i = 0; i < mykeys.length; i++) {
        let curtable = global_tables[mykeys[i]];
        let tableName = curtable["name"];
        
        // Create array of field objects with name and id
        let fieldsArray = curtable["fields"].map(field => ({
            "name": field.name || field, // assuming field might be string or object
            "id": field.name || field // assuming field might have id property
        }));
        tempmap["tables"][tableName] = fieldsArray;
    }

    mykeys = Object.keys(global_workflows);
    for(var i = 0; i < mykeys.length; i++) {
        let curtable = global_workflows[mykeys[i]];
        let name = global_workflows[mykeys[i]]["name"];
        var obj = {"id": mykeys[i], "name": name};
        tempmap["workflows"].push(obj); 
    }

    mykeys = Object.keys(global_templates);
    for(var i = 0; i < mykeys.length; i++) {
        let curtable = global_templates[mykeys[i]];
        let name = global_templates[mykeys[i]]["name"];
        var obj = {"id": mykeys[i], "name": name};
        tempmap["templates"].push(obj); 
    }

    data_map = tempmap;
}
export {
    InitGlobalData, 
    global_components, global_data_templates, global_forms,
    global_screens, global_queries, global_templates,
    global_tables, global_views, global_states, global_groups, global_user_fields,
    global_secrets, global_workflows, data_map
};