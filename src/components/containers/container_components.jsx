import { h } from 'preact';
import { signal , effect} from "@preact/signals";
import { ActionExecutor, FunctionExecutor } from '../../states/common_actions';
import { variableKeys, variableMap } from '../../states/global_state';
// Reactive Container Component
const ContainerTemplate = ({ config, value, action, children }) => {
  if(config == undefined) {
    return <></>;
  }
  const containerConfig = signal(config);

  // containerConfig.value.style = {
  //   display: 'flex',
  //   flexDirection: containerConfig.value.direction || 'column',
  //   justifyContent: containerConfig.value.justify || 'flex-start',
  //   alignItems: containerConfig.value.align || 'stretch',
  //   padding: containerConfig.value.padding || '0px',
  //   border: containerConfig.value.border || '1px solid #ccc',
  //   borderRadius: containerConfig.value.borderRadius || '5px',
  //   backgroundColor: containerConfig.value.backgroundColor || 'white',
  //   height: "100%",
  //   width: "100%",
  //   ...containerConfig.value.customStyles
  // };

  effect(() => {
    const keys = variableKeys.peek();
    let datamap = {};

    for (const key of keys) {
      const variableEntry = variableMap[key];
      if (variableEntry && variableEntry.value !== undefined) {
        datamap[key] = variableEntry.value;
      }
    }

    const newStyles = FunctionExecutor(datamap, containerConfig.value.styleCode);
    containerConfig.value.style = { ...containerConfig.value.style, ...newStyles };
  });

  return (
    <div
      style={containerConfig.value.style}
      onClick={(e) => { e.stopPropagation(); ActionExecutor(containerConfig.value.id, "onClick"); }}
      onDblClick={(e) => { e.stopPropagation(); ActionExecutor(containerConfig.value.id, "onDoubleClick"); }}
      onMouseEnter={(e) => { e.stopPropagation(); ActionExecutor(containerConfig.value.id, "onHoverEnter"); }}
      onMouseLeave={(e) => { e.stopPropagation(); ActionExecutor(containerConfig.value.id, "onHoverLeave"); }}
    >
      {children || value}
    </div>
  );
};


// Card Container
export const Card = ({ configs, value, action, children }) => (
  <ContainerTemplate config={configs} value={value} action={action}>
    {children}
  </ContainerTemplate>
);

// Generic Container
export const Container = ({ config, value, action, children }) => (
  <ContainerTemplate config={config} value={value} action={action}>
    {children}
  </ContainerTemplate>
);

// Grid View Container
export const GridView = ({ config, value, action, children }) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: config.columns || 'repeat(3, 1fr)',
    gridGap: config.gap || '10px',
    ...config.customStyles
  };

  return (
    <div style={gridStyle} onClick={action}>
      {children || value}
    </div>
  );
};

// List View Container
export const ListView = ({ config, value, action, children }) => (
  <ContainerTemplate config={{ "direction":"column",...config}} value={value} action={action}>
    {children}
  </ContainerTemplate>
);

// Row Container
export const Row = ({ configs, value, action, children }) => (
  <ContainerTemplate config={{"direction":"row", ...configs}} value={value} action={action}>
    {children}
  </ContainerTemplate>
);

// Column Container
export const Column = ({ configs, value, action, children }) => (
  <ContainerTemplate config={{ "direction":"column",...configs}} value={value} action={action}>
    {children}
  </ContainerTemplate>
);

// Scroll Area Container
export const ScrollArea = ({ config, value, action, children }) => {
  const scrollStyle = {
    overflowY: 'auto',
    maxHeight: config.maxHeight || '300px',
    ...config.customStyles
  };

  return (
    <div style={scrollStyle} onClick={action}>
      {children}
    </div>
  );
};

// Carousel Container (Simple Example)
export const Carousel = ({ config, value, action, children }) => {
  const carouselStyle = {
    display: 'flex',
    overflowX: 'scroll',
    scrollSnapType: 'x mandatory',
    ...config.customStyles
  };

  return (
    <div style={carouselStyle} onClick={action}>
      {children}
    </div>
  );
};
