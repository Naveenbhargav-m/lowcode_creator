const text_style = { color: "black", fontSize: "16px", padding:"8px" ,"backgroundColor":"grey" };
const number_style = { color: "black", fontSize: "16px" };
const textarea_style = { width: "100px", height: "50px", color: "black" };
const progress_bar_style =  {style: { secondary: "gray", primary: "blue", h: "20px" }};
const avatar_style = { size: "50px" };
const avatar_group_style = { wrapperStyle: { padding: "10px" }, avatarStyle: { size: "80px" } };
const dropdown_style = { padding: "5px" };
const button_style = { color: "white", backgroundColor: "black" ,display: 'flex'};
const image_style = { width: "100%", height: "100%",    display: 'flex',};
const badge_style = { class: { primary: "red", textColor: "white", padding: "5px" }};
const icon_style = { color: "black", fontSize: "24px", "IconSize":"30px" };
const icon_button_style = { primary: "black", textColor: "white", padding: "5px", IconSize:"30px"};



const container_style = {display: 'flex',flexDirection: 'column',justifyContent: 'flex-start',
    alignItems: 'stretch',padding: '10px',border: '1px solid #ccc',borderRadius: '5px',
    backgroundColor: 'white',height: '100%',width: '100%',};


let styles_mapper = {
    "Text":text_style,
    "Number":number_style,
    "Text Area":textarea_style,
    "Progress bar":progress_bar_style,
    "Avatar":avatar_style,
    "Avatar Group":avatar_group_style,
    "Dropdown":dropdown_style,
    "Image":image_style,
    "Button":button_style,
    "Badge":badge_style,
    "Icon":icon_style,
    "Icon Button":icon_button_style,
    "container":container_style,
};


export {styles_mapper};