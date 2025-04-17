import { Draggable } from "../components/custom/Drag";
import DynamicIcon from "../components/custom/dynamic_icon";
import { globalStyle } from "../styles/globalStyle";



function OptionsMapper({ options }) {

    return (
      <div>
        {options.map((innerlist) => {
          return (
            <Draggable data={innerlist} onDragStart={(data) => {console.log("data:", data)}}>
              <div className="p-2 rounded-md my-2 border-2 border-highlight">
                <div className="flex flex-row items-center scroll-px-4" style={globalStyle}>
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
      ["text-cursor-input","password"],
      ["toggle-right","switch"],
      ["vote","checkbox"],
      ["circle-check","radio"],
      ["chevron-down","dropdown"],
      ["list-filter-plus","multi_select"],
      ["chart-no-axes-gantt","slider"],
      ["palette","color"],
      ["text","textarea"],
      ["upload","file_upload"],
      ["star","rating"],
      ["calendar","date"],


      ["link-2","url"],
      ["phone","phone"],
      ["calendar-clock","date_time"],
      ["clock-2","time"],
      ["calendar-range","date_range"],
      ["calendar-days","week"],
      ["calendar-fold","month"],
      ["letter-text","rich_text"],
      ["hash","markdown"],
      ["columns-3","column"],
      ["rows-3","row"],
      ["sliders-horizantal","two_slider"],
     
    ];
    return (
      
      <OptionsMapper options={elements}/>
  );
  }



export {FormBuilderLeftPanel};