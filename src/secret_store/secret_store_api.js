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

// CREATE
async function CreateDataInAPI(secretData, groupData) {
    let secretUrl = `${AppID}/public/_secrets`;
    let groupUrl = `${AppID}/public/_secret_groups`;
    
    const promises = [];
    
    if (secretData) {
        promises.push(ApiClient.post(secretUrl, secretData));
    }
    
    if (groupData) {
        promises.push(ApiClient.post(groupUrl, groupData));
    }
    
    const results = await Promise.all(promises);
    
    return {
        "secret": secretData ? results[0] : null,
        "group": groupData ? results[secretData ? 1 : 0] : null
    };
}

// UPDATE
async function UpdateDataInAPI(secretId, secretData, groupId, groupData) {
    let secretUrl = `${AppID}/public/_secrets/${secretId}`;
    let groupUrl = `${AppID}/public/_secret_groups/${groupId}`;
    
    const promises = [];
    
    if (secretId && secretData) {
        promises.push(ApiClient.put(secretUrl, secretData));
    }
    
    if (groupId && groupData) {
        promises.push(ApiClient.put(groupUrl, groupData));
    }
    
    const results = await Promise.all(promises);
    
    return {
        "secret": secretId && secretData ? results[0] : null,
        "group": groupId && groupData ? results[secretId && secretData ? 1 : 0] : null
    };
}

// DELETE
async function DeleteDataFromAPI(secretId, groupId) {
    let secretUrl = `${AppID}/public/_secrets/${secretId}`;
    let groupUrl = `${AppID}/public/_secret_groups/${groupId}`;
    
    const promises = [];
    
    if (secretId) {
        promises.push(ApiClient.delete(secretUrl));
    }
    
    if (groupId) {
        promises.push(ApiClient.delete(groupUrl));
    }
    
    const results = await Promise.all(promises);
    
    return {
        "secretDeleted": secretId ? results[0] : null,
        "groupDeleted": groupId ? results[secretId ? 1 : 0] : null
    };
}

// Your existing placeholder function
function SetDataToAPI(data) {
    console.log("data to be sent to api");
}


async function CreateSecret(secretData) {
    let url = `${AppID}/public/_secrets`;
    delete secretData["id"];
    return await ApiClient.post(url, {"body": secretData});
}

async function CreateGroup(groupData) {
    let url = `${AppID}/public/_secret_groups`;
    delete groupData["id"]
    return await ApiClient.post(url, {"body": groupData});
}

async function UpdateSecret(secretId, secretData) {
    let url = `${AppID}/public/_secrets`;
    return await ApiClient.put(url, {"query": {"where": `id=${secretId}`}, "body" : secretData});
}

async function UpdateGroup(groupId, groupData) {
    let url = `${AppID}/public/_secret_groups`;
    return await ApiClient.put(url, {"query": {"where": `id=${groupId}`}, "body": groupData});
}

async function DeleteSecret(secretId) {
    let url = `${AppID}/public/_secrets`;
    return await ApiClient.delete(url, {"query": {"where": `id=${secretId}`}});
}

async function DeleteGroup(groupId) {
    let url = `${AppID}/public/_secret_groups/${groupId}`;
    return await ApiClient.delete(url, {"query": {"where": `id=${groupId}`}});
}
export {GetDataFromAPI, CreateSecret, CreateGroup, UpdateSecret, UpdateGroup, DeleteSecret, DeleteGroup};