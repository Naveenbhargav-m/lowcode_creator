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
                <div className="flex flex-row items-center scroll-px-4 w-full" style={globalStyle}>
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
    ["text-cursor-input", "textfield"],
    ["chevron-down", "dropdown"],
    ["vote", "checkbox"],
    ["text", "textarea"],
    ["text-cursor-input", "password"],
    ["hash", "markdown"],
    ["chart-no-axes-gantt", "slider"],
    ["sliders-horizontal", "dual_slider"],
    ["mail", "email"],
    ["calendar", "date"],
    ["calendar-clock", "date_time"],
    ["clock-2", "time"],
    ["calendar-fold", "month"],
    ["calendar-days", "week"],
    ["list-filter-plus", "multi_select"],
    ["search", "lookup"],
    ["upload", "file_upload"],
    ["image", "image_upload_grid"],
    ["grid-3x3", "image_select_grid"],
    ["columns-3", "column"],
    ["rows-3", "row"],
    ["layout-panel-top", "panel"],
    ["list-ordered", "form_steps"]
  ];
  
    return (
      
      <OptionsMapper options={elements}/>
  );
  }



export {FormBuilderLeftPanel};