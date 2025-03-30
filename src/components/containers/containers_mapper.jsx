import { renderPrimitiveElement } from "../primitives/primitiveMapper";
import { Card, GridView, Row, Column, Container, ListView, ScrollArea, Carousel } from "./container_components";
import { activeElement, activeScreen, screenElements, screens, screenViewKey } from "../../screen_builder/screen_state";
import { Drop } from "../custom/Drop";
import { Drawer, HoverModal, PopupModal } from "../model_containers/model_components";
import { variableKeys, variableMap } from '../../states/global_state';
import { ActionExecutor, FunctionExecutor } from '../../states/common_actions';
import { effect, signal } from '@preact/signals';
import { renderTemplate } from "../templates/template_mapper";
import { ReactSortable } from "react-sortablejs";



function RenderChildren({ dropCallBack , activeSignal,childrenElements, elementID }) {
  function UpdateScreenElementChildren(newchildren, elementID) {
    console.log(":new sorted Children 1: ",newchildren);
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

      console.log(":new sorted Children 2: ",childrenSorted);
      let curScreen = activeScreen.value;
      elementVal["children"] = childrenSorted;
      element.value = {...elementVal};
      screenElements[elementID] = element;
      screens[curScreen][screenViewKey] = screenElements;
      screens[curScreen]["_change_type"] = "update";
  }
  return (
    <ReactSortable
      list={childrenElements}
      setList={(childs) => {UpdateScreenElementChildren(childs, elementID);}}
      group="elements"
      animation={150}
      ghostClass="element-ghost"
    >
     {
      childrenElements.map((child, ind) => {
        return(
          <div onClick={() => { activeElement.value = child.id  }}>
          {(child.type === "container" || child.type === "modal") ? (
            <Drop onDrop={(data) => dropCallBack(data, child.id)} dropElementData={{ element: child.id }}>
              {renderContainer(child,dropCallBack, activeSignal)}
            </Drop>
          ) : child.type === "template"  ? (renderTemplate(child, dropCallBack, activeSignal)) : 
          renderPrimitiveElement(child, activeSignal)}
        </div>
        );
      })
     }
    </ReactSortable>
  );
}



export function renderContainer(layoutItem , dropCallBack , activeSignal) {
  console.log("temp:",layoutItem);
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
  console.log("title:", title, layoutItem);
  switch (title) {
    case "card":
      return <Card {...layoutItem}>
              <RenderChildren 
              dropCallBack={dropCallBack} 
              activeSignal={activeSignal} 
              childrenElements={childElements}
              elementID={layoutItem["id"]}
              />
            </Card>;
    case "grid_view":
      return <GridView {...layoutItem}>
              <RenderChildren 
                    dropCallBack={dropCallBack} 
                    activeSignal={activeSignal} 
                    childrenElements={childElements}
                    elementID={layoutItem["id"]}

                    />
            </GridView>;
    case "container":
      return <Container {...layoutItem}>
           <RenderChildren 
              dropCallBack={dropCallBack} 
              activeSignal={activeSignal} 
              childrenElements={childElements}
              elementID={layoutItem["id"]}
              />
          </Container>;
    case "list_view":
      return <ListView {...layoutItem}>
         <RenderChildren 
              dropCallBack={dropCallBack} 
              activeSignal={activeSignal} 
              childrenElements={childElements}
              elementID={layoutItem["id"]}

              />
      </ListView>;
    case "row":
      return <Row {...layoutItem}>
         <RenderChildren 
              dropCallBack={dropCallBack} 
              activeSignal={activeSignal} 
              childrenElements={childElements}
              elementID={layoutItem["id"]}

              />
      </Row>;
    case "column":
      return <Column {...layoutItem}>
         <RenderChildren 
              dropCallBack={dropCallBack} 
              activeSignal={activeSignal} 
              childrenElements={childElements}
              elementID={layoutItem["id"]}

              />
      </Column>;
    case "scroll_area":
      return <ScrollArea {...layoutItem}>
         <RenderChildren 
              dropCallBack={dropCallBack} 
              activeSignal={activeSignal} 
              childrenElements={childElements}
              elementID={layoutItem["id"]}

              />
      </ScrollArea>;
    case "carousel":
      return <Carousel {...layoutItem}>
         <RenderChildren 
              dropCallBack={dropCallBack} 
              activeSignal={activeSignal} 
              childrenElements={childElements}
              elementID={layoutItem["id"]}
              />
      </Carousel>;
    case "model":
      console.log("layout item in modal",layoutItem);
      return <PopupModal {...layoutItem}>
         <RenderChildren 
              dropCallBack={dropCallBack} 
              activeSignal={activeSignal} 
              childrenElements={childElements}
              elementID={layoutItem["id"]}
              />
      </PopupModal>;
    case "hover_card":
      return <HoverModal {...layoutItem}>
         <RenderChildren 
              dropCallBack={dropCallBack} 
              activeSignal={activeSignal} 
              childrenElements={childElements}
              elementID={layoutItem["id"]}
              />
      </HoverModal>;
    case "side_drawer":
      return <Drawer {...layoutItem}>
         <RenderChildren 
              dropCallBack={dropCallBack} 
              activeSignal={activeSignal} 
              childrenElements={childElements}
              elementID={layoutItem["id"]}
              />
      </Drawer>
    default:
      return <div>Unknown Container</div>;
  }
}