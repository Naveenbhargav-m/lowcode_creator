import { APIManager } from "../api/api_manager";
import { AppID, CreatorBackendUrl, PrestDBaseUrl } from "../states/global_state";

let creatorapi = new APIManager(CreatorBackendUrl);
let prestApi = new APIManager(PrestDBaseUrl);


async function RunViewCode(code) {
    let resp = await creatorapi.post(`/api/views/${AppID.value}`, {body:{"code": code}});
    console.log("resp from view:",resp);
}


export {RunViewCode};