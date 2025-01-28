import { renderPrimitiveElement } from "../primitives/primitiveMapper";
import { Card, GridView, Row, Column, Container, ListView, ScrollArea, Carousel } from "./container_components";
import { activeElement, screenElements } from "../../screen_builder/screen_state";
import { Drop } from "../custom/Drop";
import { handleDrop } from "../../screen_builder/screen_state";
import { Drawer, HoverModal, PopupModal } from "../model_containers/model_components";
import { variableKeys, variableMap } from '../../states/global_state';
import { ActionExecutor, FunctionExecutor } from '../../states/common_actions';
import { effect, signal } from '@preact/signals';
import { renderTemplate } from "../templates/template_mapper";


export function renderContainer(layoutItem) {
  layoutItem.configs["id"] = layoutItem.id;
  const { title, children } = layoutItem;
  let childrenSignal = signal(children);
  effect(() => {
    const keys = variableKeys.peek();
    let datamap = {};

    for (const key of keys) {
      const variableEntry = variableMap[key];
      if (variableEntry && variableEntry.value !== undefined) {
        datamap[key] = variableEntry.value;
      }
    }
    datamap["children"] = children;
    const newValue = FunctionExecutor(datamap, layoutItem.childrenCode);
    if(newValue !== undefined && newValue.children !== undefined && newValue.children !== null) {
      childrenSignal.value = newValue.children;
    }
  });
  let childElements = childrenSignal.value.map(childId => screenElements[childId]?.value);
  const renderChildren = (children) =>
    children.map((child, ind) => (
     
        <div style={{ display: "contents"}} onClick={() => { activeElement.value = child.id  }}>
          {(child.type === "container" || child.type === "modal") ? (
            <Drop onDrop={(data) => handleDrop(data, child.i)} dropElementData={{ element: child.id }}>
              {renderContainer(child)}
            </Drop>
          ) : child.type === "template"  ? (renderTemplate(child)) : (renderPrimitiveElement(child))}
        </div>
    ));

  switch (title) {
    case "Card":
      return <Card {...layoutItem}>{renderChildren(childElements)}</Card>;
    case "Grid View":
      return <GridView {...layoutItem}>{renderChildren(childElements)}</GridView>;
    case "Container":
      return <Container {...layoutItem}>{renderChildren(childElements)}</Container>;
    case "List View":
      return <ListView {...layoutItem}>{renderChildren(childElements)}</ListView>;
    case "Row":
      return <Row {...layoutItem}>{renderChildren(childElements)}</Row>;
    case "Column":
      return <Column {...layoutItem}>{renderChildren(childElements)}</Column>;
    case "Scroll Area":
      return <ScrollArea {...layoutItem}>{renderChildren(childElements)}</ScrollArea>;
    case "Carousel":
      return <Carousel {...layoutItem}>{renderChildren(childElements)}</Carousel>;
    case "Modal":
      console.log("layout item in modal",layoutItem);
      return <PopupModal {...layoutItem}>{renderChildren(childElements)}</PopupModal>;
    case "HovarCard":
      return <HoverModal {...layoutItem}>{renderChildren(childElements)}</HoverModal>;
    case "SideDrawer":
      return <Drawer {...layoutItem}>{renderChildren(childElements)}</Drawer>
    default:
      return <div>Unknown Container</div>;
  }
}