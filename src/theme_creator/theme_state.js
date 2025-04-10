import { signal } from "@preact/signals";
import { generateUID } from "../utils/helpers";
import { DefaultTheme, DefaultThemeID } from "../states/global_state";

let themes = {};
const themeNameAndIDSList = signal([]);
const ActiveTheme = signal("");
const currentThemes = [signal(""), signal("")];
function AddTheme(data) {
    let name = data["name"];
    let id = generateUID();
    let newTheme = {"id":id, "_change_type": "add","theme_name": name, "light": {}, "dark":{}};
    themes[id] = newTheme;
    ActiveTheme.value  = id;
    localStorage.setItem("themes", JSON.stringify(themes));
    let exisitng = themeNameAndIDSList.peek();
    exisitng.push(newTheme);
    themeNameAndIDSList.value = [...exisitng];
}

function LoadThemes() {
    let tempStr = localStorage.getItem("themes");
    let tempObj = JSON.parse(tempStr);
    themes = {...tempObj};
    let myarr = [];
    let firstkey = "";
    let firstKeyAdded = false;
    for(const key in themes) {
        if(!firstKeyAdded) {
            firstkey = key;
            firstKeyAdded = true;
        }
        if(themes[key] === undefined) {
            continue;
        }
        let temp = {"id":themes[key]["id"], "name": themes[key]["name"]}
        myarr.push(temp);
    }
    themeNameAndIDSList.value = [...myarr];
    if(themes[firstkey] === undefined) {
        return;
    }
    ActiveTheme.value = themes[firstkey]["id"];
    SetCurrentTheme();
}

function UpdateDefaultTheme() {
    let DefaultID = DefaultThemeID.value;
    if(DefaultID === undefined) {
        return;
    }
    console.log("myt theme  ID:",DefaultID);
    let mytheme = themes[DefaultID];
    if(mytheme === undefined) {
        return;
    }
    console.log("my theme:",mytheme);
    DefaultTheme.value = mytheme;
}

function SetCurrentTheme() {
    let currTheme = themes[ActiveTheme.peek()];
    let light = currTheme["light"];
    let dark = currTheme["dark"];
    currentThemes[0].value = JSON.stringify(dark);
    currentThemes[1].value = JSON.stringify(light);
}

LoadThemes();
export {themes, ActiveTheme, AddTheme, themeNameAndIDSList, currentThemes, SetCurrentTheme, UpdateDefaultTheme};