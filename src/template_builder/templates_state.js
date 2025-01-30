
const templates = {};


function CreateTemplate(Name) {
    console.log("create_template_name:",Name);
    templates[Name["name"]] = {"name":Name, "elements":[]};
    localStorage.setItem("templates", JSON.stringify(templates));
}

export {templates, CreateTemplate};