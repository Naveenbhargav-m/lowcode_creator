import { useState } from "preact/hooks";
import { CreateTemplate } from "./templates_state";
import MobileMockup from "../components/custom/mobile_mockup";


export function TemplateView() {
    return (
        <div>
          <CreateFormButton />
          <div className="p-4 flex justify-center">
            <MobileMockup>
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
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                }}
                className="scrollbar-hide"
            >
        </div>
            </MobileMockup>
          </div>
      </div>
    );
}





export function CreateFormPopup({ isOpen, onClose, onSubmit }) {
    const [formName, setFormName] = useState("");
  
    const handleSubmit = () => {
      if (formName.trim() ) {
        onSubmit({ formName});
        setFormName("");
        onClose();
      } else {
        alert("Please Enter a name.");
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
          <h2 style={{ marginBottom: "10px" }}>Create New Template</h2>
  
          {/* Form Name Input */}
          <input
            type="text"
            value={formName}
            // @ts-ignore
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Template Name:"
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />

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
     CreateTemplate(data);
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
            Create Template
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
  