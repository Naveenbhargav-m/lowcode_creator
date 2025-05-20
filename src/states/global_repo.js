import { APIManager } from "../api/api_manager";
import { GetDataFromAPi } from "../api/api_syncer";
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


function InitGlobalData() {
    LoadGlobalTemplates();
    LoadGlobalScreens();
    LoadGlobalForms();
    LoadGlobalTables();
    LoadGlobalViews();
    LoadGlobalWorkflows();
    LoadQueries();
}


function LoadQueries() {
    let url = `${AppID.value}/public/_queries`;
    ApiClient.get(url).then(
        (data) => {
            if(data === undefined) {
                console.log("queries data is undefined:",data);
            }
            var temp = {};
            let length = data.length;
            for(var i=0;i<length;i++) {
                let cur = data[i];
                let id = cur["id"];
                let innerdata = cur["query_data"];
                innerdata["id"] = id;
                temp[id] = innerdata;
            }
            global_queries = {...temp};
        }
    );
}

function LoadGlobalTemplates() {
    GetDataFromAPi("_templates").then((myscreens) => {  
        if (!myscreens || myscreens.length === 0) {
            global_templates = {};
            return;
        }
        let screensmap = {};
        for (let i = 0; i < myscreens.length; i++) {
            let curScreen = myscreens[i];
            screensmap[curScreen["id"]] = { ...curScreen["configs"],"id": curScreen["id"] };
        }
        global_templates = screensmap;
    }).catch(error => {
        console.error("Error loading global templates:", error);
    });
}


function LoadGlobalScreens() {
    GetDataFromAPi("_screens").then((myscreens) => {  
        if (!myscreens || myscreens.length === 0) {
            global_screens = {};
            return;
        }
        let screensmap = {};
        for (let i = 0; i < myscreens.length; i++) {
            let curScreen = myscreens[i];
            screensmap[curScreen["id"]] = { ...curScreen["configs"],"id": curScreen["id"] };
        }
        global_screens = screensmap;
    }).catch(error => {
        console.error("Error loading global screens:", error);
    });
}


function LoadGlobalForms() {
    GetDataFromAPi("_forms").then((forms_data) => {
        if (!forms_data || forms_data.length === 0) {
            console.log("my forms_data is null:", forms_data);
            global_forms = {};
            return;
        }
        let screensmap = {};
        for (let i = 0; i < forms_data.length; i++) {
            let curForm = forms_data[i];
            screensmap[curForm["id"]] = { ...curForm["configs"],"id": curForm["id"] };
        }
        global_forms = screensmap;
  
    });  
}



function LoadGlobalTables() {
    LoadTables().then((data) => {
        console.log("tables data from db:",data);
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
        for(var i=0;i<tables.length;i++) {
            let curtable = tables[i];
            let name = curtable["name"];
            tablesmap[name] = curtable;
        }

        global_tables = tablesmap;
      });
}



function LoadGlobalViews() {
    let prestApi = new APIManager(PrestDBaseUrl);

    prestApi.get(`/${AppID.value}/public/_views`).then((resp) => {
        if(resp !== undefined) {
            let innerobj = resp[0] || {};
            let viewConfig = innerobj["views_data"] || [];
            var viewmap = {};
            for(var i=0;i<viewConfig.length;i++) {
                let currentView = viewConfig[i];
                let name = currentView["name"];
                global_views[name] = currentView;
            }
        }
    });
}


function LoadGlobalWorkflows() {
    GetDataFromAPi("_workflows").then((myflows) => {
        console.log("called load workflows:",myflows);
        if(myflows === undefined) {
            return;
        }
        if(myflows.length === undefined) {
            return;
        }
        let temp = {};
        for(var i=0;i<myflows.length;i++) {
            let  curflow = myflows[i];
            let id = curflow["id"];
            temp[id] = curflow;
        }
        global_workflows = temp;
        return;
    })
}


export {InitGlobalData, 
     global_components, global_data_templates, global_forms,
     global_screens, global_queries,global_templates,
     global_tables, global_views, global_states, global_groups, global_user_fields,
     global_secrets, global_workflows
    };