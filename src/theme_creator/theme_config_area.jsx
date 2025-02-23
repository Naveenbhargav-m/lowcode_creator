
import { CreateFormButton } from "../template_builder/template_builder_view";
import { ActiveTheme, AddTheme, currentThemes, SetCurrentTheme, themeNameAndIDSList, themes } from "./theme_state";
import { TabComponent } from "../screen_builder/screen_components";
import { ScreensList } from "../screen_builder/screen_page";
import { TextAreaWithPopup } from "../form_builder/configs_view/advanced_form";
import { useComputed, useSignal } from "@preact/signals";

const ThemeCreator = () => {
    const devStyle = {
        "height":"inherit",
    };
  return (
    <div style={devStyle} >
        <CreateThemeRow />
        <MakeDefault isDefault={true} isdark={"light"}/>
        <ThemeEditArea />
    </div>
  )
}


function MakeDefault({isDefault , isdark}) {
    let rowstyle = {
        display:"flex",
        "flexDirection": "row-reverse",
        "justifyContent": "space-between",
        "padding":"10px 35px",
        "alignItems":"center"
    };
    return (
        <div style={{...rowstyle}}>
        <div style={{width:"150px"}}>
            <label>Default Theme:<input name="is_default" type="checkbox" role="switch" checked={isDefault} /></label>
            <select name="favorite-cuisine" aria-label="Select your favorite cuisine...">
                    <option selected={isdark === "dark"}>dark</option>
                    <option selected={isdark === "light"}>light</option>
            </select>
        </div>
        </div>
    );
}

function ThemeEditArea() {
    const devStyle = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "40px",
        "height":"100%"
    };

    const fieldStyle = {
        minHeight: "60%",
        minWidth: "40%",
    };

    function SetTheme(key, value) {
        let valObj = JSON.parse(value);
        console.log("themes:", themes);
        themes[ActiveTheme.value][key] = valObj;
        localStorage.setItem("themes", JSON.stringify(themes));
    }

    let activeTheme = themes[ActiveTheme.value];
    if (activeTheme === undefined) {
        return <p>Select a Theme to edit</p>;
    }

    console.log("active Theme ID:", activeTheme);

    return (
        <div style={devStyle}>
            <div style={fieldStyle}>
                <TextAreaWithPopup
                    label={"dark Theme"}
                    valueSignal={currentThemes[0]}
                    configKey={"dark"}
                    onChange={(key, value) => SetTheme(key, value)}
                    style={{"height":"100%"}}
                    wrapperStyle={{"display":"flex","flexDirection":"column","height":"500px"}}
                />
            </div>
            <div style={fieldStyle}>
                <TextAreaWithPopup
                    label={"light Theme"}
                    valueSignal={currentThemes[1]}
                    configKey={"light"}
                    onChange={(key, value) => SetTheme(key, value)}
                    style={{"height":"100%"}}
                    wrapperStyle={{"display":"flex","flexDirection":"column","height":"500px"}}
                />
            </div>
        </div>
    );
}

function CreateThemeRow() {
    const rowStyle = {
        display:"flex",
        "flexDirection": "row-reverse",
        "justifyContent": "space-between",
        "padding":"10px 20px",
        "alignItems":"center"
    };
    return (
        <div style={rowStyle}>
            <CreateFormButton 
            formLabel={"Create New Theme"} 
            buttonLabel={"Create Theme"} 
            placeHolder={"Theme Name:"}
            callback={(data) => {AddTheme(data)}}
            />
        </div>
    );
}


function ThemePage() {
    return (
    <div className="min-h-screen h-screen w-full bg-white flex">
      <div className="w-2/12 bg-white p-4 h-screen">
        <ScreensList elementsList={themeNameAndIDSList.value} signal={ActiveTheme} callBack={(id) => { ActiveTheme.value = id; SetCurrentTheme();}}/>
      </div>

      <div className="w-10/12 h-screen bg-background scrollable-div">
      <TabComponent />
      <ThemeCreator />
      </div>
    </div>
    );
}
export {ThemeCreator, ThemePage};