import { Draggable } from "../components/custom/Drag";
import DynamicIcon from "../components/custom/dynamic_icon";



function OptionsMapper({ options }) {
    return (
      <div>
        {options.map((innerlist) => {
          return (
            <Draggable data={innerlist} onDragStart={(data) => {console.log("data:", data)}}>
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

function FormBuilderLeftPanel() {
    let elements = [
      ["text-cursor-input","textfield"],
      ["toggle-right","switch"],
      ["vote","checkbox"],
      ["circle-check","radio"],
      ["chevron-down","dropdown"],
      ["list-filter-plus","multi_select"],
      ["chart-no-axes-gantt","range_slider"],
      ["sliders-horizantal","two_slider"],
      ["link-2","url"],
      ["phone","phone"],
      ["calendar","date"],
      ["calendar-clock","date_time"],
      ["clock-2","time"],
      ["calendar-range","date_range"],
      ["calendar-days","week"],
      ["calendar-fold","month"],
      ["palette","color"],
      ["text","textarea"],
      ["letter-text","rich_text"],
      ["hash","markdown"],
      ["star","rating"],
      ["columns-3","column"],
      ["rows-3","row"],
     
    ];
    return (
      
      <OptionsMapper options={elements}/>
  );
  }



export {FormBuilderLeftPanel};