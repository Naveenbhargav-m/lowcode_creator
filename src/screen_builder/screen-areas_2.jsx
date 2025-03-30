import { Drop } from "../components/custom/Drop";
import { renderPrimitiveElement } from "../components/primitives/primitiveMapper";
import { renderContainer } from "../components/containers/containers_mapper";
import { screenElements, handleDrop, screenElementAdded, screenView, CreatenewScreen, activeElement, SetCurrentScreen, activeScreen, screens  } from "./screen_state";
import { DesktopMockup } from "./screen_components";
import { renderTemplate } from "../components/templates/template_mapper";
import { IconGroup } from "../components/primitives/general_components";
import { CreateFormButton } from "../template_builder/template_builder_view";
import MobileMockup from "../components/custom/mobile_mockup";
import { ReactSortable } from "react-sortablejs";
import { useSignal, useComputed } from "@preact/signals";
import { useEffect } from "preact/hooks";





function RenderElement(item , dropCallBack, activeSignal) {
  // let style = {"padding": "10px","margin": "10px" ,"backgroundColor": "blue", height:"50px", width:"100px"};
  // return <div style={{...style}}> </div>;
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
  let outerDivStyle = {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: "#f9f9f9",
    border: "1px solid #e0e0e0",
    overflow: "auto",
    padding: "10px",
    scrollbarWidth: "none", // For Firefox
    msOverflowStyle: "none", // For Internet Explorer and Edge
  };

  if (curScreen) {
    console.log("screen styles:", curScreen);
    style = screens[curScreen]["mobile_style"];
  }

 // Reactive: Compute items from `screenElements`
 const items = useSignal([]);
  
 useEffect(() => {
   // Update `items.value` when `screenElements` changes
   items.value = Object.values(screenElements).filter((item) => !item.value.parent);
   console.log("Updated items:", items.value);
 }, [screenElements]);

 const sortableItems = useComputed(() =>
   items.value.map((item) => ({
     id: item.value.id,
     name: item.value.title,
     style: item.value.style || {},
   }))
 );
  function SortItems(items, newItems) {
    const itemMap = new Map(items.map((item) => [item.value.id, item]));
    // console.log("item map:", itemMap);
    let sortedItems = newItems.map(({ id }) => itemMap.get(id)).filter(Boolean);
    // console.log("orignal items:", items);
    // console.log("new items:", newItems);
    // console.log("sorted items:", sortedItems);
    return sortedItems;
  }

  console.log("sorted items:", sortableItems.value);

  return (
    <MobileMockup>
      <div style={{ ...outerDivStyle }} className="scrollbar-hide">
        <Drop
          onDrop={(data) => {
            handleDrop(data);
          }}
          dropElementData={{ element: "screen" }}
          wrapParent={true}
        >
          <div style={{ ...style }} onClick={() => (activeElement.value = "screen")}>
            <ReactSortable
              list={sortableItems.value}
              setList={(newList) => {
                items.value = [...SortItems(items.value, newList)];
                console.log("new list:",newList);
                console.log("new items:", items.value);
              }}
              group="elements"
              animation={150}
              ghostClass="element-ghost"
            >
              {screenElementAdded.value &&
                items.value.map((item) => {
                  if (!item.value.parent) {
                    // return <div key={item.value.id}>{item.value.title}</div>
                    return RenderElement(item.peek(), handleDrop, activeElement);
                  }
                })}
            </ReactSortable>
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
        <div style={{...style}}>
        {screenElementAdded.value && Object.values(screenElements).map((item, ind) => {
              if (!item.value.parent) {
                return <div>{RenderElement(item.peek(),handleDrop, activeElement)}</div>;
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
