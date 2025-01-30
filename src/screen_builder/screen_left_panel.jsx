import { useEffect, useState } from "preact/hooks";
import { Draggable } from "../components/custom/Drag";
import DynamicIcon from "../components/custom/dynamic_icon";
import { tabSignal , tabDataSignal, isHoveredSignal } from "./screen_state";
import { useSignal } from "@preact/signals";

export function ScreenLeftPanel({ config, value, actions }) {
  let tabspath = config["tabs_path"];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="scrollable-div" style={{ flex: "0 0 auto" }}>
        <Tabs
          config={{ paths: tabspath, elementStyle: { "font-size": "16px" } }}
          actions={{ onChange: (tab, index) => { tabSignal.value = tab; } }}
        />
      </div>
      <div style={{ flex: "1 1 auto", overflow: "hidden" }}>
        <GridView
          config={{
            path: tabSignal.value,
            columns: "2",
            gap: 0,
            style: { paddingTop: "20px", minHeight: "120px" },
          }}
          actions={{ onChange: () => console.log("dragged") }}
        />
      </div>
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
    <div className="w-full border-b border-grey-700" style={wrapperStyle}>
      <ul className="flex" style={tabs}>
        {tabDataSignal.value[paths[1]].map((tab, index) => (
          <li
            key={index}
            className={`cursor-pointer py-2 px-4 border-b-2 ${
              tabSignal.value == tab ? "border-highlight text-black" : "border-transparent text-gray-600"
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
  style["borderRadius"] = "20px";
  const gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  const gapStyle = `${gap}px`;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: gridTemplateColumns,
        gap: gapStyle,
        ...style,
        overflowY: "auto", // Enables scrolling for overflow.
      }}
      className="scrollable-div"
    >
      {tabDataSignal.value[path].map((value, index) => (
        <div key={index} style={{display:"contents"}}>
          <IconBox
            config={{
              ...value,
              "index": index,
              wrapperStyle: {
                padding: "10px",
                borderStyle: "solid",
                borderWidth: "1px",
                color: "black",
                "borderRadius":"20px",
                fontSize:"8px",
                "margin":"4px 4px",
                height: "100px", // Ensures all boxes have at least this height
              },
            }}
            value={value}
            actions={{ onDrag: (data) => console.log("drag data:", data) }}
          />
        </div>
      ))}
    </div>
  );
}



function IconBox({ config, value, actions }) {
  // let [ishover, setIsHover] = useState(isHoveredSignal.value);
  const mystyle = {
    ...config.wrapperStyle,
    backgroundColor: isHoveredSignal.value === config["index"]
      ? config.hoverStyle?.backgroundColor || "#d8f3dc" 
      : config.wrapperStyle?.backgroundColor || "white"
  };

  return (
    <Draggable data={value} onDragStart={(data) => actions?.onDrag?.(data)}>
      <div
        className="flex flex-col items-center justify-center p-2"
        style={mystyle}
        onMouseEnter={() => {
          isHoveredSignal.value = config["index"];
          // setIsHover(true);
        }}
        onMouseLeave={() => {
          isHoveredSignal.value = undefined;
          // setIsHover(false);
        }}
      >
        <div className="px-2">
          <DynamicIcon name={value.icon} size={24} />
        </div>
        <p className="text-sm" style={{fontSize:"2em"}}>{value.title}</p>
      </div>
    </Draggable>
  );
}
