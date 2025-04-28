import { AppID, PrestClient } from "../states/global_state";




async function GetFeatureData(feature) {
    let baseUrl = `${AppID}/public/${feature}`;
    let response = await PrestClient.get(baseUrl);
    return response;
}


function GetScreenGlobalData(myscreens) {
    if (!myscreens || myscreens.length === 0) {
        console.log("my screens is null:", myscreens);
        return {"names":[], "data": {} };
    }

    let tempnames = [];
    let screensmap = {};

    for (let i = 0; i < myscreens.length; i++) {
        let curScreen = myscreens[i];
        screensmap[curScreen["id"]] = { ...curScreen["configs"],"id": curScreen["id"] };
        tempnames.push({ "name": curScreen["screen_name"],"id": curScreen["id"], });
    }
    return {"names": tempnames, "data": screensmap};
}

export {GetFeatureData, GetScreenGlobalData};