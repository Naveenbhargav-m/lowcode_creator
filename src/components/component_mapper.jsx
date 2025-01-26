import {
  GridBlock,
  GridImage,
  LinkElement,
  LinksBlock,
  ShoppingBlock,
  ShoppingElement,
} from "./userComponents/link_components";

function ComponentElementMapper({ component, props }) {
  const componentMap = {
    "new Link": LinkElement,
    "new Post": GridImage,
    "store item": ShoppingElement,
  };

  const Component = componentMap[component];
  return Component ? <Component {...props} /> : null;
}

function ComponentMapper({ dataMap, index }) {
  const childComps = dataMap["children"].map((child, i) => (
    <ComponentElementMapper
      component={child["component"]}
      props={child["props"]}
      key={i}
    />
  ));

  // Map the parent component name to actual components
  const parentComponentMap = {
    Links: LinksBlock,
    Grid: GridBlock,
    Store: ShoppingBlock,

    // Add more mappings as needed
  };

  const ParentComponent = parentComponentMap[dataMap["component"]] || "div";

  return <ParentComponent index={index}>{childComps}</ParentComponent>;
}

export { ComponentElementMapper, ComponentMapper };
