

function ProcessSignalsToWrite(variables) {
    let signals = JSON.stringify(variables["signals"]);
    let body = [{"signals": signals, "id": variables["id"]}];
    return body;
}

function ProcessScreenDataToWrite(screens) {
    let resp = [];
    for(let i=0;i<screens.length;i++) {
        let temp = {};
        let cur = screens[i];
        temp["screen_name"] = cur["screen_name"];
        temp["id"] = cur["id"];
        delete cur["screen_name"];
        let json = JSON.stringify(cur);
        temp["configs"] = json;
        resp.push(temp);
    }
    return resp;
}

function ProcessFormsDataToWrite(forms) {
    let resp = [];
    for(let i=0;i<forms.length;i++) {
        let temp = {};
        let cur = forms[i];
        temp["form_name"] = cur["form_name"];
        temp["id"] = cur["id"];
        let json = JSON.stringify(cur);
        temp["configs"] = json;
        resp.push(temp);
    }
    return resp;
}

function ProcessTemplatesDataTOWrite(screens) {
    let resp = [];
    for(let i=0;i<screens.length;i++) {
        let temp = {};
        let cur = screens[i];
        temp["template_name"] = cur["name"];
        temp["id"] = cur["id"];
        delete cur["template_name"];
        let json = JSON.stringify(cur);
        temp["configs"] = json;
        resp.push(temp);
    }
    return resp;
}

function ProcessThemesDataToWrite(themes) {
    let resp = [];
    for(let i=0;i<themes.length;i++) {
        let temp = {};
        let cur = themes[i];
        temp["theme_name"] = cur["theme_name"];
        temp["id"] = cur["id"];
        delete cur["template_name"];
        let darkJson = JSON.stringify(cur["dark_theme"]);
        let light_json = JSON.stringify(cur["light_theme"]);
        let isDefault = cur["is_default"] || false;
        temp["dark_theme"] = darkJson;
        temp["light_theme"] = light_json;
        temp["is_default"] = isDefault;
        resp.push(temp);
    }
    return resp;
}



export {ProcessFormsDataToWrite, ProcessScreenDataToWrite, ProcessSignalsToWrite, ProcessTemplatesDataTOWrite, ProcessThemesDataToWrite};