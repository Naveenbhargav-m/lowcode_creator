import { Drop } from "../components/custom/Drop";
import { Rnd } from "react-rnd";
import { renderPrimitiveElement } from "../components/primitives/primitiveMapper";
import { renderContainer } from "../components/containers/containers_mapper";
import { screenElements, handleDrop, screenElementAdded  } from "./screen_state";
import { DesktopMockup } from "./screen_components";
import { renderTemplate } from "../components/templates/template_mapper";

function renderElement(item) {
  if (item.type === "container" || item.type === "modal") {
    return (
      <Drop onDrop={(data) => handleDrop(data, item.id)} dropElementData={{ element: item.id }}>
        {renderContainer(item)}
      </Drop>
    );
  } else if (item.type === "template") {
    return (
      <Drop onDrop={(data) => handleDrop(data, item.id)} dropElementData={{ element: item.id }}>
        {renderTemplate(item)}
      </Drop>
    );
  }
  return renderPrimitiveElement(item);
}



function ScreenBuilderArea() {
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
      {screenElementAdded.value && Object.values(screenElements).map((item, ind) => {
            if (!item.value.parent) {
              return renderElement(item.peek());
            }
      })}
    </Drop>
    </div>
    </DesktopMockup>
    );
}

export default ScreenBuilderArea;


