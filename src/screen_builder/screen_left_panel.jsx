import { useEffect, useState } from "preact/hooks";
import { Draggable } from "../components/custom/Drag";
import DynamicIcon from "../components/custom/dynamic_icon";
import { tabSignal , tabDataSignal, isHoveredSignal } from "./screen_state";
import { useSignal } from "@preact/signals";

export function ScreenLeftPanel({ config, value, actions }) {
  let tabspath = config["tabs_path"];

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{paddingBottom:"80px"}}>
      <div className="flex-shrink-0">
        <Tabs
          config={{ paths: tabspath, elementStyle: { fontSize: "16px" } }}
          actions={{ onChange: (tab, index) => { tabSignal.value = tab; } }}
        />
      </div>
      {/* Make this container flex-grow with overflow-hidden */}
      <div className="flex-grow overflow-hidden">
        {/* This is the scrollable container that stays within bounds */}
        <GridView
          config={{
            path: tabSignal.value,
            columns: "2",
            gap: 8,
            style: { padding: "20px 4px", minHeight: "120px" },
          }}
          actions={{ onChange: () => console.log("dragged") }}
        />
      </div>
      {/* Add style to hide WebKit scrollbars (Chrome, Safari, etc.) */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export function Tabs({ config, actions }) {
  let paths = config["paths"];

  useEffect(() => {
    return () => {
      // Cleanup effect (if necessary) can be placed here
    };
  }, []);

  const handleTabClick = (tab, index) => {
    if (actions && actions.onChange) {
      actions.onChange(tab, index);
    }
  };

  let wrapperStyle = config["wrapperStyle"] || {};
  let tabs = config["tabsStyle"] || {};
  let element = config["elementStyle"] || {};
  
  return (
    <div className="w-full border-b border-gray-300" style={wrapperStyle}>
      <ul className="flex flex-nowrap overflow-x-auto" style={tabs}>
        {tabDataSignal.value[paths[1]].map((tab, index) => (
          <li
            key={index}
            className={`cursor-pointer py-2 px-4 border-b-2 whitespace-nowrap ${
              tabSignal.value === tab ? "border-blue-500 text-black font-medium" : "border-transparent text-gray-600"
            }`}
            onClick={() => handleTabClick(tab, index)}
            style={element}
          >
            {tab}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GridView({ config, actions }) {
  let cols = config["columns"] || 2;
  let gap = config["gap"] || 0;
  let style = config["style"] || {};
  let path = config["path"];
  
  const gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;

  return (
    // Make this a fully-height flex container
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* This is the scrollable container with hidden scrollbars */}
      <div 
        className="flex-grow overflow-y-auto w-full"
        style={{
          scrollbarWidth: 'none',  // Hide scrollbar in Firefox
          msOverflowStyle: 'none',  // Hide scrollbar in IE/Edge
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: gridTemplateColumns,
            gap: `${gap}px`,
            paddingBottom: "16px",
            ...style,
          }}
          className="px-2"
        >
          {tabDataSignal.value[path]?.map((value, index) => (
            <div key={index} className="flex-shrink-0">
              <IconBox
                config={{
                  ...value,
                  "index": index,
                  wrapperStyle: {
                    padding: "8px",
                    borderStyle: "solid",
                    borderWidth: "1px",
                    color: "black",
                    borderRadius: "16px",
                    fontSize: "0.6em",
                    margin: "2px",
                    height: "90px",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    backgroundColor: "white",
                  },
                }}
                value={value}
                actions={{ onDrag: (data) => console.log("drag data:", data) }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function IconBox({ config, value, actions }) {
  const mystyle = {
    ...config.wrapperStyle,
    backgroundColor: isHoveredSignal.value === config["index"]
      ? config.hoverStyle?.backgroundColor || "#d8f3dc" 
      : config.wrapperStyle?.backgroundColor || "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  };

  return (
    <Draggable 
      data={value} 
      onDragStart={(data) => {
        console.log("calling actions onDrag", data, actions);
        actions?.onDrag?.(data);
      }}
    >
      <div
        className="w-full h-full"
        style={mystyle}
        onMouseEnter={() => {
          isHoveredSignal.value = config["index"];
        }}
        onMouseLeave={() => {
          isHoveredSignal.value = undefined;
        }}
      >
        <div className="flex items-center justify-center mb-2">
          <DynamicIcon name={value.icon} size={24} />
        </div>
        <p className="text-xs text-center truncate w-full px-1">{value.title}</p>
      </div>
    </Draggable>
  );
}

export function TabElement({ config, actions }) {
  const mytabs = config["tabs"];
  const initTab = config["init"];
  const [activeTab, setActiveTab] = useState(mytabs[initTab]);

  useEffect(() => {
    return () => {
      // Cleanup effect (if necessary) can be placed here
    };
  }, []);

  const handleTabClick = (tab, index) => {
    setActiveTab(tab);
    if (actions && actions.onChange) {
      actions.onChange(tab, index);
    }
  };

  let wrapperStyle = config["wrapperStyle"] || {};
  let tabs = config["tabsStyle"] || {};
  let element = config["elementStyle"] || {};
  
  return (
    <div className="w-full border-b border-gray-300" style={wrapperStyle}>
      <ul className="flex flex-nowrap overflow-x-auto" style={tabs}>
        {mytabs.map((tab, index) => (
          <li
            key={index}
            className={`cursor-pointer py-2 px-4 text-sm border-b-2 whitespace-nowrap text-center ${
              activeTab === tab ? "border-blue-500 text-black font-medium" : "border-transparent text-gray-600"
            }`}
            onClick={() => handleTabClick(tab, index)}
            style={element}
          >
            {tab}
          </li>
        ))}
      </ul>
    </div>
  );
}