
const templates = {};


function CreateTemplate(Name) {
    templates[Name] = {"name":Name, "elements":[]};
}

export {templates, CreateTemplate};