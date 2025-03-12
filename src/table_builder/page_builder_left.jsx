import { setDragData } from "./table_builder_state";
import { Draggable } from "../components/custom/Drag";
import DynamicIcon from "../components/custom/dynamic_icon";

export function PageBuilderLeftGrid() {
  let form_elements = [
    ["text-cursor-input", "Text", "TEXT"],
    ["text-cursor", "Integer","INTEGER"],
    ["phone-incoming", "Float","DECIMAL"],
    ["list", "Text[]","TEXT[]"],
    ["sliders-horizontal", "Integer[]","INTEGER[]"],
    ["list-filter", "Boolean","BOOLEAN"],
    ["square-check", "DateTime","TIMESTAMPTZ"],
    ["component", "Date","DATE"],
    ["toggle-right", "Time","TIME"],
    ["link-2", "Location"],
    ["trending-up-down","Relation","INTEGER"],
    ["mail", "K/Y pairs", "JSON"],
    ["key-round", "Json","JSONB"],
    ["calendar-range", "Interval","INTERVAL"],
    ["calendar-clock", "Enum","ENUM"],
    ["key-round","point (x,y)","JSONB"],
  ];

  return (
    <div
      className="fixed-grid has-2-cols pb-10 scrollable-div bg-white"
      style={{ height: "90vh" }}
    >
      <div className="px-2 py-2">
        <h2>Fields:</h2>
        <OptionsMapper options={form_elements} />
      </div>
    </div>
  );
}

function OptionsMapper({ options }) {
  return (
    <div>
      {options.map((innerlist) => {
        return (
          <Draggable data={innerlist} onDragStart={(data) => setDragData(data)}>
            <div className="cell p-2 bg-white rounded-md my-2 border-2 border-highlight">
              <div className="flex flex-row items-center scroll-px-4">
                <div className="px-2">
                  <DynamicIcon name={innerlist[0]} size={30} />
                </div>
                <p className="text-sm">{innerlist[1]}</p>
              </div>
            </div>
          </Draggable>
        );
      })}
    </div>
  );
}

