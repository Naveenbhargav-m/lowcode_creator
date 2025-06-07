import { APIManager } from "../api/api_manager";
import { GetDataFromAPi } from "../api/api_syncer";
import { currentForm } from "../form_builder/form_builder_state";
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
let data_map_v2 = {};
let fieldsMap = {};
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
        CreateDataMapV2();
        console.log("All global data loaded and data map created:", data_map);
    } catch (error) {
        console.error("Error loading global data:", error);
    }
}



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

function CreateDataMapV2() {
    // Original data map structure
    let tempmap = {
        "queries": [],
        "screens": [],
        "forms": [],
        "tables": {},
        "workflows": [],
        "templates": [],
    };
    
    // Additional copy with enhanced structure and error handling
    let enhanced_data_map = {
        "queries": {
            list: [],
            map: {},
            count: 0
        },
        "screens": {
            list: [],
            map: {},
            count: 0
        },
        "forms": {
            list: [],
            map: {},
            count: 0
        },
        "tables": {
            list: [],
            map: {},
            fields_map: {},
            count: 0
        },
        "workflows": {
            list: [],
            map: {},
            count: 0
        },
        "templates": {
            list: [],
            map: {},
            count: 0
        },
        "views": {
            list: [],
            map: {},
            count: 0
        }
    };
        // Helper function to safely get property
        const safeGet = (obj, key, defaultValue = null) => {
            try {
                return obj && obj[key] !== undefined ? obj[key] : defaultValue;
            } catch (e) {
                return defaultValue;
            }
        };

    // Process Queries
    try {
        let mykeys = Object.keys(global_queries || {});
        let queriesmap = {};
        for(var i = 0; i < mykeys.length; i++) {
            let key = mykeys[i];
            let query = global_queries[key];
            let name = safeGet(query, "name", `Query ${i + 1}`);
            
            var obj = {"id": key, "name": name};
            tempmap["queries"].push(obj);
            let inputs = query["input_params"] || [];
            var inpusarr = [];
            for(var j=0;j<inputs.length;j++) {
                let obj1 = {
                    "id": inputs[j],
                    "label": inputs[j],
                    "value": inputs[j]
                };
                inpusarr.push(obj1);
            }
            queriesmap[key] = inpusarr;
            // Enhanced version
            enhanced_data_map.queries.list.push(obj);
            enhanced_data_map.queries.map[key] = {
                ...obj,
                raw_data: query
            };
        }
        fieldsMap["queries"] = queriesmap;
        enhanced_data_map.queries.count = mykeys.length;
    } catch (error) {
        console.error("Error processing queries:", error);
    }
    
    // Process Screens
    try {
        let mykeys = Object.keys(global_screens || {});
        console.log("global screens:", global_screens);
        for(var i = 0; i < mykeys.length; i++) {
            let key = mykeys[i];
            let screen = global_screens[key];
            let name = safeGet(screen, "name", `Screen ${i + 1}`);
            
            var obj = {"id": key, "name": name};
            tempmap["screens"].push(obj);
            
            // Enhanced version
            enhanced_data_map.screens.list.push(obj);
            enhanced_data_map.screens.map[key] = {
                ...obj,
                raw_data: screen
            };
        }
        enhanced_data_map.screens.count = mykeys.length;
    } catch (error) {
        console.error("Error processing screens:", error);
    }
    
    // Process Forms
    try {
        let mykeys = Object.keys(global_forms || {});
        console.log("global forms:", global_forms);
        let formsmap = {};
        let formslist = [];
        for(var i = 0; i < mykeys.length; i++) {
            let key = mykeys[i];
            let form = global_forms[key];
            let name = form["name"] || "";
            var obj2 = {"id": key, "name": name, "value": key, "label": name};
            tempmap["forms"].push(obj2);
            let fields = form["mobile_children"] || [];
            for(var j=0;j<fields.length;j++) {
                let curfield = fields[j];
                let extra = {"label": curfield["label"], "value": curfield["id"]};
                fields[j] = {...extra, ...fields[j]};
            }
            let desktopChildren = form["desktop_children"] || [];
            for(var k=0;i<desktopChildren.length;k++) {
                let curfield = desktopChildren[k];
                let extra = {"label": curfield["label"], "value": curfield["id"]};
                desktopChildren[k] = {...extra, ...desktopChildren[k]};
            }
            formsmap[key] = {"mobile_children": fields, "desktop_children": desktopChildren};
            formslist.push(obj);
            enhanced_data_map.forms.map[key] = {...obj2, ...currentForm};
        }
        fieldsMap["forms"] = formsmap;
        enhanced_data_map.forms.count = mykeys.length;
        enhanced_data_map.forms.list = [...formslist];
    } catch (error) {
        console.error("Error processing forms:", error);
    }

    // Process Tables
    try {
        let mykeys = Object.keys(global_tables || {});
        let tablesmap = {};
        for(var i = 0; i < mykeys.length; i++) {
            let key = mykeys[i];
            let curtable = global_tables[key];
            let tableName = safeGet(curtable, "name", key);
            
            // Create array of field objects with name and id (original logic)
            let fieldsArray = [];
            try {
                let fields = safeGet(curtable, "fields", []);
                if (Array.isArray(fields)) {
                    fieldsArray = fields.map(field => ({
                        "name": field?.name || field || "unknown_field",
                        "id": field?.name || field?.id || field || "unknown_field"
                    }));
                }
            } catch (e) {
                console.error("Error processing table fields:", e);
                fieldsArray = [];
            }
            tablesmap[tableName] = fieldsArray;
            tempmap["tables"][tableName] = fieldsArray;
            
            // Enhanced version
            let tableObj = {"id": key, "name": tableName};
            enhanced_data_map.tables.list.push(tableObj);
            enhanced_data_map.tables.map[key] = {
                ...tableObj,
                fields: fieldsArray,
                raw_data: curtable
            };
            enhanced_data_map.tables.fields_map[tableName] = fieldsArray;
        }
        fieldsMap["tables"] = tablesmap;
        enhanced_data_map.tables.count = mykeys.length;
    } catch (error) {
        console.error("Error processing tables:", error);
    }

    // Process Workflows
    try {
        let mykeys = Object.keys(global_workflows || {});
        let workflowsmap = {};
        for(var i = 0; i < mykeys.length; i++) {
            let key = mykeys[i];
            let workflow = global_workflows[key];
            let name = safeGet(workflow, "name", `Workflow ${i + 1}`);
            
            var obj = {"id": key, "name": name};
            tempmap["workflows"].push(obj);
            let inputs = workflow["inputs"] || [];
            let inputmaps = [];
            for(var j=0;j<inputs.length;j++) {
                let map1 = {"id": inputs[j], "name": inputs[j], "required": false, "label": inputs[j]};
                inputmaps.push(map1);
            }
            workflowsmap[key] = inputmaps;
            // Enhanced version
            enhanced_data_map.workflows.list.push(obj);
            enhanced_data_map.workflows.map[key] = {
                ...obj,
                raw_data: workflow
            };
        }
        fieldsMap["workflows"] = workflowsmap;
        enhanced_data_map.workflows.count = mykeys.length;
    } catch (error) {
        console.error("Error processing workflows:", error);
    }

    // Process Templates
    try {
        let mykeys = Object.keys(global_templates || {});
        for(var i = 0; i < mykeys.length; i++) {
            let key = mykeys[i];
            let template = global_templates[key];
            let name = safeGet(template, "name", `Template ${i + 1}`);
            
            var obj = {"id": key, "name": name};
            tempmap["templates"].push(obj);
            
            // Enhanced version
            enhanced_data_map.templates.list.push(obj);
            enhanced_data_map.templates.map[key] = {
                ...obj,
                raw_data: template
            };
        }
        enhanced_data_map.templates.count = mykeys.length;
    } catch (error) {
        console.error("Error processing templates:", error);
    }

    // Process Views (enhanced version only since it's not in original)
    try {
        let mykeys = Object.keys(global_views || {});
        for(var i = 0; i < mykeys.length; i++) {
            let key = mykeys[i];
            let view = global_views[key];
            let name = safeGet(view, "name", `View ${i + 1}`);
            
            var obj = {"id": key, "name": name};
            enhanced_data_map.views.list.push(obj);
            enhanced_data_map.views.map[key] = {
                ...obj,
                raw_data: view
            };
        }
        enhanced_data_map.views.count = mykeys.length;
    } catch (error) {
        console.error("Error processing views:", error);
    }

    // Set both data maps
    data_map = tempmap;
    data_map_v2 = enhanced_data_map;
    console.log("fields map:",fieldsMap);
    console.log("Original data map:", data_map);
    console.log("Enhanced data map:", enhanced_data_map);
}
export {
    InitGlobalData, 
    global_components, global_data_templates, global_forms,
    global_screens, global_queries, global_templates,
    global_tables, global_views, global_states, global_groups, global_user_fields,
    global_secrets, global_workflows, data_map, data_map_v2, fieldsMap
};
