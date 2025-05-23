import { SyncData } from "../api/api_syncer";
import { ApiClient, AppID } from "../states/global_state";

// READ - Your existing function
async function GetDataFromAPI() {
    let url = `${AppID}/public/_secrets`;
    let groupUrl = `${AppID}/public/_secret_groups`;
    
    const [secrets, groups] = await Promise.all([
        ApiClient.get(url),
        ApiClient.get(groupUrl)
    ]);
    
    return { "secrets": secrets, "groups": groups };
}


function SetDataToAPI(secrets, groups) {
    console.log("secrets to sync:",secrets);
    console.log("groups to sync:",groups);
    SyncData("_secrets",secrets);
    SyncData("_secret_groups",groups);
}
export {GetDataFromAPI, SetDataToAPI};