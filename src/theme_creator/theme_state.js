import { signal } from "@preact/signals";
import { generateUID } from "../utils/helpers";

let themes = {};
const themeNameAndIDSList = signal([]);
const ActiveTheme = signal("");
function AddTheme(data) {
    let name = data["name"];
    let id = generateUID();
    let newTheme = {"id":id, "name": name, "light": {}, "dark":{}};
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
}

LoadThemes();
export {themes, ActiveTheme, AddTheme, themeNameAndIDSList};