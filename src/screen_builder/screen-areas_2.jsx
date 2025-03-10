import { Drop } from "../components/custom/Drop";
import { Rnd } from "react-rnd";
import { renderPrimitiveElement } from "../components/primitives/primitiveMapper";
import { renderContainer } from "../components/containers/containers_mapper";
import { screenElements, handleDrop, screenElementAdded, screenView, CreatenewScreen, activeElement, SetCurrentScreen, activeScreen, screens  } from "./screen_state";
import { DesktopMockup } from "./screen_components";
import { renderTemplate } from "../components/templates/template_mapper";
import { IconGroup } from "../components/primitives/general_components";
import { CreateFormButton } from "../template_builder/template_builder_view";
import MobileMockup from "../components/custom/mobile_mockup";

function RenderElement(item , dropCallBack, activeSignal) {
  if (item.type === "container" || item.type === "modal") {
    return (
      <Drop onDrop={(data) => dropCallBack(data, item.id)} dropElementData={{ element: item.id }}>
        {renderContainer(item, dropCallBack)}
      </Drop>
    );
  } else if (item.type === "template") {
    return (
      <Drop onDrop={(data) => dropCallBack(data, item.id)} dropElementData={{ element: item.id }}>
        {renderTemplate(item, dropCallBack, activeSignal)}
      </Drop>
    );
  }
  return renderPrimitiveElement(item, activeSignal);
}



function ScreenBuilderArea() {
  return (
  <div>
    <CreateAndbuttonbar 
    iconNames={["smartphone", "app-window-mac"]} 
    onIconChange={(name) => {screenView.value = name; SetCurrentScreen();}}
    formLabel={"Create New Screen"}
    placeHolder={"Screen Name:"}
    buttonLabel={"Create Screen"}
    buttonCallBack={(data) => {CreatenewScreen(data);}}
     />
  <div className="p-4 flex justify-center" style={{height:"94vh"}}>
      {screenView.value == "smartphone" ? <MobileView /> : <DesktopView />}
    </div>
    </div>
    );
}




function MobileView() {
  let curScreen = activeScreen.value;
  let style = {};
  if(curScreen !== "" && curScreen !== undefined) {
    console.log("screen styles:", curScreen);
    style = screens[curScreen]["mobile_style"];
  }
  return (
    <MobileMockup>
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#f9f9f9",
        border: "1px solid #e0e0e0",
        overflow: "auto",
        padding: "10px",
        scrollbarWidth: "none", // For Firefox
        msOverflowStyle: "none", // For Internet Explorer and Edge
      }}
      className="scrollbar-hide" // Additional class to target WebKit browsers
    >
      <Drop
        onDrop={(data) => {handleDrop(data);}}
        dropElementData={{ element: "screen" }}
        wrapParent={true}
      >
        <div style={{...style}} onClick={(e) => {activeElement.value = "screen"}}>
        {screenElementAdded.value && Object.values(screenElements).map((item, ind) => {
              if (!item.value.parent) {
                return RenderElement(item.peek(), handleDrop,activeElement);
              }
        })}
        </div>
      </Drop>
      </div>
      </MobileMockup>
  );
}


function DesktopView() {
  let curScreen = activeScreen.value;
  let style = {};
  if(curScreen !== "" && curScreen !== undefined) {
    console.log("screen styles:", curScreen);
    style = screens[curScreen]["desktop_style"];
  }
  return (
    <DesktopMockup>
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#f9f9f9",
        border: "1px solid #e0e0e0",
        overflow: "auto",
        padding: "10px",
        scrollbarWidth: "none", // For Firefox
        msOverflowStyle: "none", // For Internet Explorer and Edge
      }}
      className="scrollbar-hide" // Additional class to target WebKit browsers
    >
      <Drop
        onDrop={(data) => {handleDrop(data);}}
        dropElementData={{ element: "screen" }}
        wrapParent={true}
      >
        <div style={style}>
        {screenElementAdded.value && Object.values(screenElements).map((item, ind) => {
              if (!item.value.parent) {
                return RenderElement(item.peek(),handleDrop, activeElement);
              }
        })}
        </div>
      </Drop>
      </div>
      </DesktopMockup>
  );
}




function CreateAndbuttonbar({ iconNames = [], onIconChange, formLabel , placeHolder , buttonLabel, buttonCallBack }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between", // Ensures spacing
      width: "100%",
      padding: "10px"
    }}>
      {/* Centered IconGroup */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <IconGroup names={iconNames} onChange={onIconChange} />
      </div>
  
      {/* Right-Aligned Button Component */}
      <div style={{ marginLeft: "auto" }}>
      <CreateFormButton 
        formLabel={formLabel} 
        placeHolder={placeHolder} 
        buttonLabel={buttonLabel} 
        callback={buttonCallBack}/>
      </div>
    </div>
  );
}

export  {ScreenBuilderArea, CreateAndbuttonbar, RenderElement};
