import { AppID, CreatorBackendUrl } from "../states/global_state";

let api = new APIManager(CreatorBackendUrl);



async function RunViewCode(code) {
    let resp = await api.get(`/api/views/${AppID.value}`, {body:{"code": code}});
    console.log("resp from view:",resp);
}


export {RunViewCode};