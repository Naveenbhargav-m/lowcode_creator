import { renderPrimitiveElement } from "../components/primitives/primitiveMapper";
import { Card, GridView, Row, Column, Container, ListView, ScrollArea, Carousel } from "../components/containers/container_components";
import { Rnd } from "react-rnd";
import { sideBarEnable } from "../states/global_state";
import { useWindowSize } from '@custom-react-hooks/all';



function ScaleElements(elements, width, height, basewidth , baseheight) {
  console.log("called scale elements",width,height);
  const scalefactorx = width / basewidth;
  const scalefactory = height / baseheight;

  return elements.map(element => {
    const scaledElement = { ...element };
    scaledElement.position.x *= scalefactorx;
    scaledElement.position.y *= scalefactory;
    
    if (scaledElement.size.height !== "auto") {
      scaledElement.size.height *= scalefactory;
    }
    if (scaledElement.size.width !== "auto") {
      scaledElement.size.width *= scalefactorx;
    }

    return scaledElement;
  });
}

function transformLayout(elements) {
  return elements.map(element => {
    const newElement = { ...element };
    
    if (element.parent === null) {
      newElement.configs.style = {
        ...newElement.configs.style,
        flexGrow: 1,
        flexShrink: 0,
        flexBasis: `100%`,
        height: `100%`,
      };
    } else {
      const parentElement = elements.find(e => e.i === element.parent);
      const parentWidth = parentElement.size.width;
      const parentHeight = parentElement.size.height;

      const flexX = ((element.position.x) / parentWidth) * 100;
      const flexY = ((element.position.y) / parentHeight) * 100;
      const flexWidth = element.size.width === 'auto' ? 'auto' : `${((element.size.width) / parentWidth) * 100}%`;
      const flexHeight = element.size.height === 'auto' ? 'auto' : `${((element.size.height) / parentHeight) * 100}%`;

      newElement.configs.style = {
        ...newElement.configs.style,
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: flexWidth,
        height: flexHeight,
        position: 'relative',
        left: `${flexX}%`,
        top: `${flexY}%`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch'
      };
    }

    return newElement;
  });
}

export function renderContainer(layoutItem, elements) {
  const { title, children: childs } = layoutItem;
  const children = childs.map(childId => elements.find(el => el.i === childId));

  const renderChildren = (children) =>
    children.map((child) => (
      <Rnd
        // @ts-ignore
        default={{
          x: child.position.x,
          y: child.position.y,
          width: child.size.width,
          height: child.size.height,
        }}
        scale={1}
        className={`${child.i}`}
        disableDragging={true}
        enableResizing={false}
        bounds="parent"
        key={child.i}
      >
        {child.type === "container" ? renderContainer(child, elements) : renderPrimitiveElement(child)}
      </Rnd>
    ));

  switch (title) {
    case "Card": return <Card {...layoutItem}>{renderChildren(children)}</Card>;
    case "Grid View": return <GridView {...layoutItem}>{renderChildren(children)}</GridView>;
    case "Container": return <Container {...layoutItem}>{renderChildren(children)}</Container>;
    case "List View": return <ListView {...layoutItem}>{renderChildren(children)}</ListView>;
    case "Row": return <Row {...layoutItem}>{renderChildren(children)}</Row>;
    case "Column": return <Column {...layoutItem}>{renderChildren(children)}</Column>;
    case "Scroll Area": return <ScrollArea {...layoutItem}>{renderChildren(children)}</ScrollArea>;
    case "Carousel": return <Carousel {...layoutItem}>{renderChildren(children)}</Carousel>;
    default: return <div>Unknown Container</div>;
  }
}

function renderElement(item, elements) {
  return item.type === "container" ? renderContainer(item, elements) : renderPrimitiveElement(item);
}

export function PreviewArea() {
  const { width, height } = useWindowSize();
  sideBarEnable.value = false;

  let screenConfigJson = localStorage.getItem("screen_config");
  let screenConfig = JSON.parse(screenConfigJson);
  let baseWidth = screenConfig[0].size.width;
  let baseHeight = screenConfig[0].size.height;
  const scaledElements = ScaleElements(screenConfig, width, height, baseWidth, baseHeight);


  // const transformedConfig = transformLayout(scaledElements);

  return (
    <div className="h-screen w-screen">
      {scaledElements.map(value => {
        if (value.parent === undefined || value.parent === null) { 
          return (
            <Rnd
              // @ts-ignore
              default={{
                x: value.position.x,
                y: value.position.y,
                width: value.size.width,
                height: value.size.height,
              }}
              scale={1}
              className={`${value.i}`}
              disableDragging={true}
              enableResizing={false}
              bounds="parent"
              key={value.i}
      >
         {renderElement(value, screenConfig)}
      </Rnd>);
        }})}
    </div>
  );
}
