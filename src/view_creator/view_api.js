import { APIManager } from "../api/api_manager";
import { AppID, CreatorBackendUrl, PrestDBaseUrl } from "../states/global_state";
import { views } from "./views_state";

let creatorapi = new APIManager(CreatorBackendUrl);
let prestApi = new APIManager(PrestDBaseUrl);


async function RunViewCode(code) {
    let resp = await creatorapi.post(`/api/views/${AppID.value}`, {body:{"code": code}});
    SyncView(resp);
}

async function SyncView(data) {
    console.log("data:",data);
    let query = {"view_name": data["view_name"]};
    let resp = await prestApi.get(`/${AppID.value}/public/db_views`, {"query":query});
    if(resp === undefined) {
        let body = {"view_name": data["view_name"], "view_columns": JSON.stringify(data["columns"])};
        let out = await prestApi.post(`/${AppID.value}/public/db_views`, {"body":body});
        console.log("out :",out);
        return data;
    }
    let parsed = resp;
    if(parsed.length > 0) {
        let body = {"view_columns": JSON.stringify(data["columns"])};
        let out = await prestApi.put(`/${AppID.value}/public/db_views?view_name=${data["view_name"]}`, {"body":body});
        console.log("out:",out);
        return data;
    }
        let body = {"view_name": data["view_name"], "view_columns": JSON.stringify(data["columns"])};
        let out = await prestApi.post(`/${AppID.value}/public/db_views`, {"body":body});
        console.log("out :",out);
        return data;
}


async function InitViews() {
    let resp = await prestApi.get(`/${AppID.value}/public/db_views`);
    if(resp !== undefined) {
        views.value = [...resp];
    }
}

InitViews();
export {RunViewCode, SyncView};