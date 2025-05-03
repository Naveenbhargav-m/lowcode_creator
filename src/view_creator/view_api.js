import { APIManager } from "../api/api_manager";
import { AppID, CreatorBackendUrl, PrestDBaseUrl } from "../states/global_state";
import { originalViews, views } from "./views_state";

let creatorapi = new APIManager(CreatorBackendUrl);
let prestApi = new APIManager(PrestDBaseUrl);

async function SyncViews(allviews) {
    console.log("views to sync:",allviews);

}


async function RunViewCode(code) {
    let resp = await creatorapi.post(`/api/views/${AppID.value}`, {body:{"code": code}});
    SyncView(resp);
}

async function SyncView(data) {
    console.log("views to sync:",data);
}


async function InitViews() {
    let resp = await prestApi.get(`/${AppID.value}/public/_views`);
    if(resp !== undefined) {
        let innerobj = resp[0] || {};
        originalViews.value = innerobj;
        let viewConfig = innerobj["views_data"] || [];
        views.value = [...viewConfig];
    }
}

export {RunViewCode, SyncView, InitViews, SyncViews};