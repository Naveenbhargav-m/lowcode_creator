import { renderPrimitiveElement } from "../primitives/primitiveMapper";
import { Card, GridView, Row, Column, Container, ListView, ScrollArea, Carousel } from "./container_components";
import { activeElement, activeScreen, DeleteScreenElement, screenElements, screens, screenViewKey } from "../../screen_builder/screen_state";
import { Drop } from "../custom/Drop";
import { Drawer, HoverModal, PopupModal } from "../model_containers/model_components";
import { variableKeys, variableMap } from '../../states/global_state';
import { ActionExecutor, FunctionExecutor } from '../../states/common_actions';
import { effect, signal } from '@preact/signals';
import { renderTemplate } from "../templates/template_mapper";
import { ReactSortable } from "react-sortablejs";
import { activeTamplate, activeTemplateElements, DeleteTemplateElements, templateDesignView, templates } from "../../template_builder/templates_state";
import { SelectableComponent } from "../custom/selectAble";


function UpdateScreenElementChildren(newchildren, elementID) {
  let element = screenElements[elementID];
  if(element === undefined) {
    return;
  }
  let elementVal = element.value;
  if(elementVal === undefined) {
    return;
  }
  let children = elementVal["children"];
  let childrenSorted = [];
  for(var i=0;i<newchildren.length;i++) {
    let cur = newchildren[i];
    let id = cur["id"];
    for(var j=0;j<children.length;j++) {
      if(children[j] === id) {
        childrenSorted.push(children[j]);
        break;
      }
    }
  }

  let curScreen = activeScreen.value;
  elementVal["children"] = childrenSorted;
  element.value = {...elementVal};
  screenElements[elementID] = element;
  screens[curScreen][screenViewKey] = screenElements;
  screens[curScreen]["_change_type"] = "update";
}

function UpdateTemplateElementChildren(newchildren , elementID) {
  let element = activeTemplateElements[elementID];
  if(element === undefined) {
    return;
  }
  let elementVal = element.value;
  if(elementVal === undefined) {
    return;
  }
  let children = elementVal["children"];
  let childrenSorted = [];
  for(var i=0;i<newchildren.length;i++) {
    let cur = newchildren[i];
    let id = cur["id"];
    for(var j=0;j<children.length;j++) {
      if(children[j] === id) {
        childrenSorted.push(children[j]);
        break;
      }
    }
  }

  let curScreen = activeTamplate.value;
  elementVal["children"] = childrenSorted;
  element.value = {...elementVal};
  activeTemplateElements[elementID] = element;
  let key = templateDesignView.value === "smartphone" ? "mobile_children" : "desktop_children";
  templates[curScreen][key] = activeTemplateElements;
  templates[curScreen]["_change_type"] = "update";
}

function RenderChildren({ dropCallBack , activeSignal,childrenElements, elementID, viewType }) {
  
  return (
    <ReactSortable
      list={childrenElements}
      setList={(childs) => {viewType === "template" ? UpdateTemplateElementChildren(childs,elementID) : UpdateScreenElementChildren(childs, elementID);}}
      group="elements"
      animation={150}
      ghostClass="element-ghost"
    >
     {
      childrenElements.map((child, ind) => {
        return(
          <SelectableComponent
            id={child.id}
            onRemove={(id)=> {viewType === "template" ? DeleteTemplateElements(child["id"]) : DeleteScreenElement(child["id"])}}
            onChick={(e,id)=> {}}
            isSelected={activeElement.value === child.id}
          >
          <div onClick={() => { activeElement.value = child.id  }}>
          {(child.type === "container" || child.type === "modal") ? (
            <Drop onDrop={(data) => dropCallBack(data, child.id)} dropElementData={{ element: child.id }}>
              {renderContainer(child,dropCallBack, activeSignal, viewType)}
            </Drop>
          ) : child.type === "template"  ? (renderTemplate(child, dropCallBack, activeSignal)) : 
          renderPrimitiveElement(child, activeSignal)}
        </div>
        </SelectableComponent>
        );
      })
     }
    </ReactSortable>
  );
}



export function renderContainer(layoutItem , dropCallBack , activeSignal, viewType) {
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
  switch (title) {
    case "card":
      return <Card {...layoutItem}>
              <RenderChildren 
              dropCallBack={dropCallBack} 
              activeSignal={activeSignal} 
              childrenElements={childElements}
              elementID={layoutItem["id"]}
              viewType={viewType}
              />
            </Card>;
    case "grid_view":
      return <GridView {...layoutItem}>
              <RenderChildren 
                    dropCallBack={dropCallBack} 
                    activeSignal={activeSignal} 
                    childrenElements={childElements}
                    elementID={layoutItem["id"]}
                    viewType={viewType}
                    />
            </GridView>;
    case "container":
      return <Container {...layoutItem}>
           <RenderChildren 
              dropCallBack={dropCallBack} 
              activeSignal={activeSignal} 
              childrenElements={childElements}
              elementID={layoutItem["id"]}
              viewType={viewType}
              />
          </Container>;
    case "list_view":
      return <ListView {...layoutItem}>
         <RenderChildren 
              dropCallBack={dropCallBack} 
              activeSignal={activeSignal} 
              childrenElements={childElements}
              elementID={layoutItem["id"]}
              viewType={viewType}
              />
      </ListView>;
    case "row":
      return <Row {...layoutItem}>
         <RenderChildren 
              dropCallBack={dropCallBack} 
              activeSignal={activeSignal} 
              childrenElements={childElements}
              elementID={layoutItem["id"]}
              viewType={viewType}
              />
      </Row>;
    case "column":
      return <Column {...layoutItem}>
         <RenderChildren 
              dropCallBack={dropCallBack} 
              activeSignal={activeSignal} 
              childrenElements={childElements}
              elementID={layoutItem["id"]}
              viewType={viewType}
              />
      </Column>;
    case "scroll_area":
      return <ScrollArea {...layoutItem}>
         <RenderChildren 
              dropCallBack={dropCallBack} 
              activeSignal={activeSignal} 
              childrenElements={childElements}
              elementID={layoutItem["id"]}
              viewType={viewType}
              />
      </ScrollArea>;
    case "carousel":
      return <Carousel {...layoutItem}>
         <RenderChildren 
              dropCallBack={dropCallBack} 
              activeSignal={activeSignal} 
              childrenElements={childElements}
              elementID={layoutItem["id"]}
              viewType={viewType}
              />
      </Carousel>;
    case "model":
      return <PopupModal {...layoutItem}>
         <RenderChildren 
              dropCallBack={dropCallBack} 
              activeSignal={activeSignal} 
              childrenElements={childElements}
              elementID={layoutItem["id"]}
              viewType={viewType}
              />
      </PopupModal>;
    case "hover_card":
      return <HoverModal {...layoutItem}>
         <RenderChildren 
              dropCallBack={dropCallBack} 
              activeSignal={activeSignal} 
              childrenElements={childElements}
              elementID={layoutItem["id"]}
              viewType={viewType}
              />
      </HoverModal>;
    case "side_drawer":
      return <Drawer {...layoutItem}>
         <RenderChildren 
              dropCallBack={dropCallBack} 
              activeSignal={activeSignal} 
              childrenElements={childElements}
              elementID={layoutItem["id"]}
              viewType={viewType}
              />
      </Drawer>
    default:
      return <div>Unknown Container</div>;
  }
}