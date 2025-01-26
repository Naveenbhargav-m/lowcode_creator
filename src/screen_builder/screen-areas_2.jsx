import { Drop } from "../components/custom/Drop";
import { Rnd } from "react-rnd";
import { renderPrimitiveElement } from "../components/primitives/primitiveMapper";
import { renderContainer } from "../components/containers/containers_mapper";
import { screenElements, handleDrop, updateElementPosition, updateElementSize, activeDrag, activeDragID, screenElementAdded, setContainerBounds } from "./screen_state";
import { DesktopMockup } from "./screen_components";
import { useEffect, useRef, useState } from "preact/hooks";
import { renderTemplate } from "../components/templates/template_mapper";
import { showFormPopup } from "../states/global_state";
import { ShowPopFormPopup } from "../components/form/form_viewer";




function renderElement(item) {
  if (item.type === "container" || item.type === "modal") {
    return (
      <Drop onDrop={(data) => handleDrop(data, item.i)} dropElementData={{ element: item.i }}>
        {renderContainer(item)}
      </Drop>
    );
  } else if (item.type === "template") {
    return (
      <Drop onDrop={(data) => handleDrop(data, item.i)} dropElementData={{ element: item.i }}>
        {renderTemplate(item)}
      </Drop>
    );
  }
  return renderPrimitiveElement(item);
}


function ScreenContainerArea2() {
  const parentRef = useRef(null);

  useEffect(() => {
    if (parentRef.current) {
      const { width, height } = parentRef.current.getBoundingClientRect();
      setContainerBounds({ height, width });
    }
  }, []);

  return (
    <DesktopMockup>
      <div
        ref={parentRef}
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
          onDrop={(data) => {
            if (parentRef.current) {
              const { width, height } = parentRef.current.getBoundingClientRect();
              setContainerBounds({ height, width });
            } else {
              console.log("parent ref currne is null");
            }
            handleDrop(data);
          }}
          dropElementData={{ element: "screen" }}
        >
          {Object.values(screenElements).map((item, ind) => {
            if (!item.value.parent) {
              return (
                <Rnd
                  key={item.value.i}
                  default={{
                    x: item.value.position.x,
                    y: item.value.position.y,
                    width: item.value.size.width,
                    height: item.value.size.height,
                  }}
                  onDragStart={() => {
                    activeDrag.value = true;
                    activeDragID.value = item.value.i;
                  }}
                  onDragStop={(e, data) => {
                    activeDrag.value = false;
                    activeDragID.value = "";
                    if (parentRef.current) {
                      const { width, height } = parentRef.current.getBoundingClientRect();
                      setContainerBounds({ height, width });
                    } else {
                      console.log("parent ref currne is null");
                    }
                    updateElementPosition(item.value.i, { x: data.x, y: data.y });
                  }}
                  onResize={(e, direction, ref, delta, position) => {
                    const newWidth = ref.offsetWidth;
                    const newHeight = ref.offsetHeight;
                    const newPosition = { x: position.x, y: position.y };
                    if (parentRef.current) {
                      const { width, height } = parentRef.current.getBoundingClientRect();
                      setContainerBounds({ height, width });
                    } else {
                      console.log("parent ref currne is null");
                    }
                    updateElementSize(item.value.i, { width: newWidth, height: newHeight });
                    updateElementPosition(item.value.i, newPosition);
                  }}
                  bounds="parent"
                  enableResizing={{
                    top: true,
                    right: true,
                    bottom: true,
                    left: true,
                    topRight: true,
                    bottomRight: true,
                    bottomLeft: true,
                    topLeft: true,
                  }}
                >
                  {renderElement(item.peek())}
                </Rnd>
              );
            }
            return null;
          })}
        </Drop>
      </div>
      {showFormPopup.value !=  "" ? <ShowPopFormPopup form_name={showFormPopup.peek()}/> : null}
    </DesktopMockup>
  );
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
      {Object.values(screenElements).map((item, ind) => {
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


