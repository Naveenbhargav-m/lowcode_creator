import { signal } from "@preact/signals";
import { generateUID } from "../utils/helpers";

const templates = {};
let templateNamesList = signal([]);

function LoadTemplates( ) {
    let templatesStr = localStorage.getItem("templates");
    let templatesmap = JSON.parse(templatesStr);
    let names = [];
    console.log("templatesmap:",templatesmap);
    if(templatesmap === undefined || templatesmap === null) {
        return;
    }
    Object.keys(templatesmap).map((key) => {
        templates[key] = signal({...templatesmap[key]});
        let name = templatesmap[key]["name"];
        let id = templatesmap[key]["id"];
        let order = templatesmap[key]["order"]
        names.push({"name":name, "id": id, "order":order})
    });
    templateNamesList.value = names;

}

function CreateTemplate(formdata) {
    console.log("create_template_name:",formdata);
    let name = formdata["name"]
    let currentLen = Object.keys(templates).length;
    let order = currentLen + 1;
    let uID = generateUID();
    templates[uID] = signal({"name":name, "id": uID, "order":order,"elements":[]});
    let existingList = templateNamesList.peek();
    templateNamesList.value = [...existingList, { "name": name, "id": uID }];
    localStorage.setItem("templates", JSON.stringify(templates));
}

LoadTemplates();
export {templates, CreateTemplate, templateNamesList};