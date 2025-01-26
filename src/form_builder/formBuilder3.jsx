// @ts-nocheck
import { signal } from "@preact/signals";
import { primitives } from "./form_primitives";
import { DesktopMockup } from "../screen_builder/screen_components";
import { useEffect, useRef, useState } from "preact/hooks";
import { AddNewForm, AddtoForm, formChanged, forms, SetFormParentSize, UpdateDrag , UpdateSize } from "./form_state2";
import { Drop } from "../components/custom/Drop";
import { Rnd } from "react-rnd";
import { tableNames } from "../table_builder/table_builder_state";
import { InitBuilderData } from "../states/data_containers";
import BoundsTracker from "../components/custom/BoundsTracker";
import { DragAndResizableChild, DragAndResizableParent } from "../components/custom/drag_and_resize";
// Reactive Signals
let configs = {};
let values = {};

// Execute Function Strings
const executeFunction = (fnString, inputs) => {
  try {
    const fn = new Function("configs", "values", fnString);
    return fn(inputs.configs, inputs.values);
  } catch (error) {
    console.error("Error executing function string:", error);
  }
};

// Dynamic Field Component
const Field = ({ configSignal , valueSignal }) => {
  console.log("in the field configSignal:",configSignal, valueSignal);
  const config = configSignal.value;
  const value = valueSignal?.value;


  if (!config) return null;

  const Primitive = primitives[config.type];
  if (!Primitive) return <div>Unknown field type: {config.type}</div>;

  const handleInput = (newValue) => {
    console.log("called on input:",newValue);
    // valueSignal.value = newValue;
    console.log("config onchange:",config.styleCode);
    if (config.styleCode) {
      const response = executeFunction(config.styleCode, { configs, values });
      if (response) {
        console.log("got the updated response:", response);
        Object.entries(response.configs || {}).forEach(([key, updatedConfig]) => {
          console.log("configs in function:",configs);
          if (configs[key]) configs[key].value = { ...configs[key].value, ...updatedConfig };
        });

        Object.entries(response.values || {}).forEach(([key, updatedValue]) => {
          if (values[key]) values[key].value = updatedValue;
        });
      }
    }
  };

  return <Primitive config={{ ...config, onInput: handleInput }} value={value} />;
};

// Panel Component
function Panel({ config }) {
  return (
    <div className="panel">
      <h3>{config.title}</h3>
      {config.fieldKeys.map((key) => (
        <Field key={key} configKey={key} />
      ))}
    </div>
  );
}

// Main DynamicForm Component
export const DynamicForm = ({ initialConfigs, initialValues }) => {
  configs = initialConfigs;
  values = initialValues;

  return (
    <div className="dynamic-form">
      {Object.entries(initialConfigs.panels).map(([panelKey, panel]) => (
        <Panel key={panelKey} config={panel} />
      ))}
    </div>
  );
};

const initialConfigs = {
  panels: {
    userDetails: {
      title: "User Details",
      fieldKeys: ["name", "age", "bio"],
    },
    settings: {
      title: "Settings",
      fieldKeys: ["theme", "notifications"],
    },
  },
  name: {
    type: "TextField",
    label: "Name",
    onChange:
      `
      let temp =  {
            "inputStyle": { borderRadius: "8px", "margin":"0px 10px" },
            "labelPosition": "top",
            "labelStyle":{"margin":"0px 15px","color":"black"}
            };
      return {
        values: { "age": 24 },
        configs: {
          "bio": { "label": "my bio", ...temp },
          "theme":{...temp},
        },
      };`
  },
  age: { type: "Slider", label: "Age", min: 0, max: 100, step: 1 },
  bio: { type: "TextArea", label: "Bio" },
  theme: {
    type: "SelectBox",
    label: "Theme",
    options: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
    ],
  },
  notifications: { type: "CheckBox", label: "Enable Notifications" },
};

// Initial Values
const initialValues = {
  name: "",
  age: 25,
  bio: "",
  theme: "light",
  notifications: false,
};

// New Form Builder
export function NewFormBuilder() {
  const newConfigs = {};
  const newValues = {};

  Object.keys(initialConfigs).forEach((key) => {
    if (key === "panels") {
      // Panels remain as plain objects
      newConfigs[key] = initialConfigs[key];
    } else {
      // Wrap each field config in a signal
      newConfigs[key] = signal(initialConfigs[key]);
    }
  });

  Object.keys(initialValues).forEach((key) => {
    // Wrap each field value in a signal
    newValues[key] = signal(initialValues[key]);
  });

  return <DynamicForm initialConfigs={newConfigs} initialValues={newValues} />;
}


// export function FormBuilderArea() {
//   useEffect(()=>{
//     InitBuilderData();
//   },[]);
//   return (
//     <DesktopMockup>
//       <div
//         style={{
//           position: "relative",
//           width: "100%",
//           height: "100%",
//           backgroundColor: "#f9f9f9",
//           minHeight: "80vh",
//           border: "1px solid #e0e0e0",
//           overflow: "auto",
//           scrollbarWidth: "none", // For Firefox
//           msOverflowStyle: "none", // For Internet Explorer and Edge
//         }}
//         className="scrollbar-hide" // Additional class to target WebKit browsers
//       >
//         <Drop
//           onDrop={(data) => AddtoForm(data)}
//           dropElementData={{ element: "form", name: formChanged.value }}
//         >
//           <BoundsTracker callback={SetFormParentSize}>
//         <div
//       style={{
//         minHeight: "80vh",
//         width: "500px",
//         minWidth: "500px",
//         backgroundColor: "grey",
//       }}
//     >
//       {forms[formChanged.value] &&
//         forms[formChanged.value]["fields"] &&
//         Object.keys(forms[formChanged.value]["fields"]).map((key) => {
//           const item = forms[formChanged.value]["fields"][key];
//           console.log("item here ", item);
//           return (
//             <Rnd
//               key={key}
//               default={{
//                 x: item.value.position.x,
//                 y: item.value.position.y,
//                 width: item.value.size.width,
//                 height: item.value.size.height,
//               }}
//               onDragStop={(e, data) => {
//                 console.log("item:", item);
//                 UpdateDrag(formChanged.value, key, {
//                   x: data.x,
//                   y: data.y,
//                 });
//               }}
//               onDrag={(e, data) => {
//                 console.log("on drag data:",data);
//                 UpdateDrag(formChanged.value, key, {
//                   x: data.x,
//                   y: data.y,
//                 });
//               }}

//               onResizeStop={(e, direction, ref, delta, position) => {
//                 UpdateSize(formChanged.value, key, {
//                   width: ref.style.width,
//                   height: ref.style.height,
//                 });
//                 UpdateDrag(formChanged.value, key, position);
//               }}
//               enableResizing={{
//                 top: true,
//                 right: true,
//                 bottom: true,
//                 left: true,
//                 topRight: true,
//                 bottomRight: true,
//                 bottomLeft: true,
//                 topLeft: true,
//               }}
//               style={{
//                 border: "2px dashed #007BFF",
//                 borderRadius: "4px",
//                 backgroundColor: "#f0f0f0",
//                 scale: "0.7",
//               }}
//               className="draggable-resizable-field"
//             >
//               <Field configSignal={item} valueSignal={values[key]} />
//             </Rnd>
//           );
//         })}
//     </div>
//     </BoundsTracker>
//         </Drop>
//       </div>
//     </DesktopMockup>
//   );
// }



export function CreateFormPopup({ isOpen, onClose, onSubmit }) {
  const [formName, setFormName] = useState("");
  const [selectedTable, setSelectedTable] = useState("");

  const handleSubmit = () => {
    if (formName.trim() && selectedTable) {
      onSubmit({ formName, selectedTable });
      setFormName("");
      setSelectedTable("");
      onClose();
    } else {
      alert("Please enter a form name and select a table.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Popup */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          zIndex: 1000,
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>Create New Form</h2>

        {/* Form Name Input */}
        <input
          type="text"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="Form Name"
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />

        {/* Table Dropdown */}
        <label style={{ marginBottom: "5px", display: "block" }}>Table</label>
        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          {Object.keys(tableNames).map((key,ind) => {
            return <option value={tableNames[key]}>{tableNames[key]}</option>
          })}
        </select>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: "black",
              color: "white",
              padding: "10px 20px",
              fontSize: "16px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "gray",
              color: "white",
              padding: "10px 20px",
              fontSize: "16px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Background Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
        }}
      ></div>
    </>
  );
}

export function CreateFormButton() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleCreateForm = (data) => {
    console.log("handle create form data:",data);
   AddNewForm(data["formName"],data["selectedTable"]);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: "30px",
          paddingTop: "10px",
        }}
      >
        <button
          onClick={() => setIsPopupOpen(true)}
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "10px 20px",
            fontSize: "16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Create Form
        </button>
      </div>

      <CreateFormPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handleCreateForm}
      />
    </div>
  );
}






export function FormBuilderArea() {
  useEffect(()=>{
    InitBuilderData();
  },[]);

  console.log("form Data",forms, formChanged.value);
  return (
    <DesktopMockup>
     <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#f9f9f9",
          border: "1px solid #e0e0e0",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="scrollable-div"
      >
        <Drop
          onDrop={(data) => AddtoForm(data)}
          dropElementData={{ element: "form", name: formChanged.value }}
        >
        <div style={{height:"2000px"}}>
      <DragAndResizableParent gridSize={10}>
      {forms[formChanged.value] && forms[formChanged.value]["fields"] && Object.keys(forms[formChanged.value]["fields"]).map((key) => {
          const item = forms[formChanged.value]["fields"][key];
          return (
            <DragAndResizableChild
             initialPosition={{x: item.value.position.x,y: item.value.position.y}}
             initialSize={{ width: item.value.size.width,height: item.value.size.height}}
             onChildUpdate={(newdata)=> {
              let position = newdata["position"];
              let size = newdata["size"];
              UpdateDrag(formChanged.value, key, position);
              UpdateSize(formChanged.value, key, size);
             }}>
              <Field configSignal={item} valueSignal={values[key]} />
              </DragAndResizableChild>);
        })}
    </DragAndResizableParent>
    </div>
        </Drop>
      </div>
    </DesktopMockup>
  );
}


function Child() {
  return <div style={{ height: '100px', width: '100px', backgroundColor: 'black' }} />;
}