import { templateNamesList } from "./templates_state";

function TemplatesListPanel() {
    return (
    <div class="scrollable-div">
        {templateNamesList.value.map((item) => {
            console.log("item:",item);
            return (
                <TemplateTile name={item["name"]} id={item["id"]}/>
            );
        })}
    </div>);
}


function TemplateTile({name, id}) {
    // let nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);
    console.log("name:",name);
    return (<div>
                <p>{name}</p>
            </div>);
}

export {TemplatesListPanel};