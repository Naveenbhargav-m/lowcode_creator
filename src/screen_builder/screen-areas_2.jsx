import { Drop } from "../components/custom/Drop";
import { renderPrimitiveElement } from "../components/primitives/primitiveMapper";
import { renderContainer } from "../components/containers/containers_mapper";
import { screenElements, handleDrop, screenElementAdded, screenView, CreatenewScreen, activeElement, SetCurrentScreen, activeScreen, screens, screenViewKey, DeleteScreenElement, screenElementsSorted  } from "./screen_state";
import { DesktopMockup } from "./screen_components";
import { renderTemplate } from "../components/templates/template_mapper";
import { IconGroup } from "../components/primitives/general_components";
import { CreateFormButton } from "../template_builder/template_builder_view";
import MobileMockup from "../components/custom/mobile_mockup";
import { ReactSortable } from "react-sortablejs";
import { useSignal, useComputed } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { SelectableComponent } from "../components/custom/selectAble";
import { generateUID } from "../utils/helpers";





function RenderElement(item , dropCallBack, activeSignal, viewType, ElementsMap) {
  // let style = {"padding": "10px","margin": "10px" ,"backgroundColor": "blue", height:"50px", width:"100px"};
  // return <div style={{...style}}> </div>;
  console.log("element map", ElementsMap);
  if (item.type === "container" || item.type === "modal") {
    return (
      <Drop onDrop={(data) => dropCallBack(data, item.id)} dropElementData={{ element: item.id }}>
        {renderContainer(item, dropCallBack,activeSignal,viewType, ElementsMap)}
      </Drop>
    );
  } else if (item.type === "template") {
    return (
      <Drop onDrop={(data) => dropCallBack(data, item.id)} dropElementData={{ element: item.id }}>
        {renderTemplate(item, dropCallBack, activeSignal)}
      </Drop>
    );
  } else if(item.type === "user_template") {
    console.log("RenderElement user_template", item);
    return (
      <Drop onDrop={(data) => dropCallBack(data, item.id)} dropElementData={{ element: item.id }}>
        {renderContainer(item, dropCallBack,activeSignal,viewType, ElementsMap)}
      </Drop>
    );
  }
  return renderPrimitiveElement(item, activeSignal);
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
    console.log("rerendering:");
    const elementsArray = Object.values(screenElements);
    const filteredItems = elementsArray.filter((item) => !item.value.parent);
    const sortedItems = filteredItems.sort((a, b) => {
                          const orderA = a.value.order ?? Infinity;
                          const orderB = b.value.order ?? Infinity;
                          return orderA - orderB;});
    console.log("sorted Items before rendering:",sortedItems);
    items.value = sortedItems;
    screenElementAdded.value = generateUID();
 }, [screenElements, screenElementsSorted.value]);


 let sortableItems = useComputed(() => items.value.map((item) => ({
  id: item.value.id,
  name: item.value.title,
  style: item.value.style || {},
})));


  function SortItems(items, newItems) {
    const itemMap = new Map(items.map((item) => [item.value.id, item]));
    let sortedItems = newItems.map(({ id }) => itemMap.get(id)).filter(Boolean);
    console.log("sorted Items after first sort:",sortedItems);
    return sortedItems;
  }

  function SetSortedItems(sortedItems) {
    console.log("set sorted Items:", sortedItems);
    let updatedItems = [];
    for(var i=0;i<sortedItems.length;i++) {
      let cur = sortedItems[i];
      let id = cur.value["id"]
      cur.value["order"] = i;
      screenElements[id].value = {...cur.value};
      screens[curScreen][screenViewKey] = screenElements;
      screens[curScreen]["_change_type"] = screens[curScreen]["_change_type"] || "update";;
      updatedItems.push(cur);
    }
    console.log("set sorted items before updation:", updatedItems);
    items.value = [...updatedItems];
    
  }

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
                let temp = [...SortItems(items.value, newList)];
                SetSortedItems(temp);
              }}
              group="elements"
              animation={150}
              ghostClass="element-ghost"
            >
              {screenElementAdded.value.length > 0 &&
                items.value.map((item) => {
                  if (!item.value.parent) {
                   console.log("rendering after removal:",screenElementAdded.value); 
                    return (<div>
                      <SelectableComponent 
                          onChick={(e,id) => {
                          console.log("chicked me:", id);}}
                          onRemove={(e,id) => {DeleteScreenElement(id)}}
                          id={item.value["id"]}
                          isSelected={activeElement.value === item.value.id}
                          >
                      {RenderElement(item.peek(), handleDrop, activeElement, "screen", screenElements)}
                      </SelectableComponent>
                      </div>);
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

  if (curScreen !== "" && curScreen !== undefined) {
    console.log("screen styles:", curScreen);
    style = screens[curScreen]["desktop_style"];
  }

  // Reactive: Compute items from `screenElements` - Same as MobileView
  const items = useSignal([]);
  useEffect(() => {
    console.log("Desktop rerendering:");
    const elementsArray = Object.values(screenElements);
    const filteredItems = elementsArray.filter((item) => !item.value.parent);
    const sortedItems = filteredItems.sort((a, b) => {
                          const orderA = a.value.order ?? Infinity;
                          const orderB = b.value.order ?? Infinity;
                          return orderA - orderB;});
    console.log("Desktop sorted Items before rendering:", sortedItems);
    items.value = sortedItems;
    screenElementAdded.value = generateUID();
  }, [screenElements, screenElementsSorted.value]);

  let sortableItems = useComputed(() => items.value.map((item) => ({
    id: item.value.id,
    name: item.value.title,
    style: item.value.style || {},
  })));

  function SortItems(items, newItems) {
    const itemMap = new Map(items.map((item) => [item.value.id, item]));
    let sortedItems = newItems.map(({ id }) => itemMap.get(id)).filter(Boolean);
    console.log("Desktop sorted Items after first sort:", sortedItems);
    return sortedItems;
  }

  function SetSortedItems(sortedItems) {
    console.log("Desktop set sorted Items:", sortedItems);
    let updatedItems = [];
    for(var i=0;i<sortedItems.length;i++) {
      let cur = sortedItems[i];
      let id = cur.value["id"]
      cur.value["order"] = i;
      screenElements[id].value = {...cur.value};
      screens[curScreen][screenViewKey] = screenElements;
      screens[curScreen]["_change_type"] = screens[curScreen]["_change_type"] || "update";
      updatedItems.push(cur);
    }
    console.log("Desktop set sorted items before updation:", updatedItems);
    items.value = [...updatedItems];
  }

  return (
    <DesktopMockup>
      <div style={{ ...outerDivStyle }} className="scrollbar-hide">
        <Drop
          onDrop={(data) => {handleDrop(data);}}
          dropElementData={{ element: "screen" }}
          wrapParent={true}
        >
          <div style={{...style}} onClick={() => (activeElement.value = "screen")}>
            <ReactSortable
              list={sortableItems.value}
              setList={(newList) => {
                let temp = [...SortItems(items.value, newList)];
                SetSortedItems(temp);
              }}
              group="elements"
              animation={150}
              ghostClass="element-ghost"
            >
              {screenElementAdded.value.length > 0 &&
                items.value.map((item) => {
                  if (!item.value.parent) {
                    console.log("Desktop rendering after removal:", screenElementAdded.value); 
                    return (<div key={item.value.id}>
                      <SelectableComponent 
                          onChick={(e,id) => {
                          console.log("Desktop clicked me:", id);}}
                          onRemove={(e,id) => {DeleteScreenElement(id)}}
                          id={item.value["id"]}
                          isSelected={activeElement.value === item.value.id}
                          >
                      {RenderElement(item.peek(), handleDrop, activeElement, "screen", screenElements)}
                      </SelectableComponent>
                      </div>);
                  }
                })}
            </ReactSortable>
          </div>
        </Drop>
      </div>
    </DesktopMockup>
  );
}

export  {ScreenBuilderArea, CreateAndbuttonbar, RenderElement};
