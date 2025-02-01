import { activeTamplate, templateNamesList } from "./templates_state";

function TemplatesListPanel() {
    return (
    <div class="scrollable-div pt-4">
        {templateNamesList.value.map((item) => {
            console.log("item:",item);
            return (
                <TemplateTile name={item["name"]} id={item["id"]}/>
            );
        })}
    </div>);
}


function TemplateTile({ name, id }) {
    console.log("name:", name);

    const tileStyle = {
        padding: "10px",
        borderStyle: "solid",
        borderWidth: "1px",
        color:  activeTamplate.value == id ? "white":"black",
        backgroundColor :activeTamplate.value == id ? "black":"white",
        borderRadius: "20px",
        fontSize: "0.8em",
        margin: "8px 4px",
        borderColor: "#ccc", // Default border color
        transition: "border-color 0.3s ease-in-out", // Smooth transition
    };

    return (
        <div
            style={tileStyle}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#555")} // Darker on hover
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ccc")} // Back to default
            onClick={(e)=> {e.stopPropagation(); activeTamplate.value = id}}
        >
            <p>{name}</p>
        </div>
    );
}

export { TemplateTile, TemplatesListPanel };
