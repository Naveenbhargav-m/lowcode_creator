import { APIManager } from "../api/api_manager";
import { AppID, CreatorBackendUrl, PrestDBaseUrl } from "../states/global_state";
import { originalViews, views_signal } from "./views_state";

let creatorapi = new APIManager(CreatorBackendUrl);
let prestApi = new APIManager(PrestDBaseUrl);

async function SyncViews(data) {
    if(data === undefined) {
        return;
    }
    console.log("data to sync:", data);
    
    // Create a deep copy of the data to avoid reference issues
    let dataCopy = JSON.parse(JSON.stringify(data));
    
    var changed_views = [];
    for(var i=0; i < dataCopy.length; i++) {
        var curview = dataCopy[i];
        if(curview["_change_type"] === "add" || curview["_change_type"] === "update") {
            delete curview["_change_type"];
            curview["index"] = i;
            changed_views.push(curview);
        }
    }
    
    console.log("changed_views:", changed_views);
    
    // Process each view and update its status
    for(var j=0; j < changed_views.length; j++) {
        let curview = changed_views[j];
        console.log("Processing view:", curview.name || "unnamed view");
        let code = curview["sqlCode"];
        
        try {
            let resp = await RunViewCode(code);
            console.log("Response for view:", resp);
            
            if(resp === undefined) {
                console.log("Setting failed status for view:", curview.name);
                curview["status"] = "failed";
            } else {
                console.log("Setting success status for view:", curview.name);
                curview["status"] = "success";
            }
        } catch (error) {
            console.error("Error running view code:", error);
            curview["status"] = "failed";
        }
        
        changed_views[j] = curview;
    }
    
    // Update the original data array with the processed views
    for(var k = 0; k < changed_views.length; k++) {
        let myview = changed_views[k];
        var curind = myview["index"];
        delete myview["index"];
        dataCopy[curind] = myview;
    }
    
    console.log("Updated data:", dataCopy);
    await creatorapi.patch(`/${AppID.value}/public/_views`, {body:{"views_data": dataCopy}, query: {"where=id": 1}});    
    // Update the state with the new data to trigger re-render
    views_signal.value = [...dataCopy];
}

async function RunViewCode(code) {
    console.log("running code:",code);
    let url = `views/${AppID.value}`;
    console.log("url:",url);
    let resp = await creatorapi.post(url, {body:{"code": code}});
    console.log("response:",resp);

    return resp;
}


async function InitViews() {
    let resp = await creatorapi.get(`/${AppID.value}/public/_views`);
    console.log("resp of views data:",resp);
    if(resp !== undefined) {
        let innerobj = resp[0] || {};
        originalViews.value = innerobj;
        let viewConfig = innerobj["views_data"] || [];
        views_signal.value = [...viewConfig];
    }
}

export {RunViewCode, InitViews, SyncViews};