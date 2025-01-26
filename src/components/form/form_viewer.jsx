// @ts-nocheck
import { signal } from "@preact/signals";
import { primitives } from "./form_primitivies";
import { useState } from "preact/hooks";
import { forms } from "../../form_builder/form_state2";
import { Rnd } from "react-rnd";
import { showFormPopup } from "../../states/global_state";
import { Scale } from "lucide-react";
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


export function FormViewer({form_name}) {
    let currForm = {};
  Object.keys(forms).filter((key, ind) => {
    let temp = forms[key];
    if(temp["form_name"] === form_name) {
        currForm = temp;
        return;
    }
  });
  return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          backgroundColor: "#f9f9f9",
          minHeight: "80vh",
          border: "1px solid #e0e0e0",
          overflow: "auto",
          padding: "10px",
          scrollbarWidth: "none", // For Firefox
          msOverflowStyle: "none", // For Internet Explorer and Edge
        }}
        className="scrollbar-hide">
          <div style={{ minHeight: "80vh" }}>
            {currForm && currForm["fields"] &&
              Object.keys(currForm["fields"]).map((key) => {
                const item = currForm["fields"][key];
                return (
                  <Rnd
                    key={key}
                    default={{
                      x: item.value.position.x,
                      y: item.value.position.y,
                      width: item.value.size.width,
                      height: item.value.size.height,
                    }}
                    bounds="parent"
                    style={{
                      border: "2px dashed #007BFF", // Add a visible border
                      borderRadius: "4px",
                    "scale":"0.7",
                      backgroundColor: "#f0f0f0",
                      "padding":"10px", // Slight background color for better visibility
                    }}
                    className="draggable-resizable-field" // Add a class for custom styles
                    disableDragging={true}
                    enableResizing={false}
                  >
                    <Field configSignal={item} valueSignal={values[key]} />
                  </Rnd>
                );
              })}
          </div>
      </div>
  );
}



export function ShowPopFormPopup({ form_name }) {
    const [isOpen , setIsOpen] = useState(true);
    console.log("called show form popup",form_name , isOpen);

    const closePopup = () => {showFormPopup.value = ""; setIsOpen(false)};
  
    const styles = {
      overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      },
      content: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        position: "relative",
        height: "50%",
        width: "50%",
        overflow: "auto",
      },
      closeButton: {
        position: "absolute",
        top: "10px",
        right: "10px",
        backgroundColor: "transparent",
        border: "none",
        fontSize: "20px",
        cursor: "pointer",
      },
    };
  
    return (
      <div>

  
        {isOpen && (
          <div style={styles.overlay} onClick={closePopup}>
            <div style={styles.content} onClick={(e) => e.stopPropagation()}>
              <button style={styles.closeButton} onClick={closePopup}>
                X
              </button>
              <FormViewer form_name={form_name} />
            </div>
          </div>
        )}
      </div>
    );
  }
  