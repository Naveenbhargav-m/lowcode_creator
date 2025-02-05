import { useState } from "preact/hooks";
import { activeTemplateElements, CreateTemplate, HandleTemplateDrop, isTemplateChanged, templateDesignView } from "./templates_state";
import MobileMockup from "../components/custom/mobile_mockup";
import { IconGroup } from "../components/primitives/general_components";
import { DesktopMockup } from "../screen_builder/screen_components";
import { RenderElement } from "../screen_builder/screen-areas_2";
import { Drop } from "../components/custom/Drop";


export function TemplateView() {
    return (
        <div>
          <TemplateCreatorButtons />
          <div className="p-4 flex justify-center"
          style={{height:"100vh", width:"90%", padding:"20px"}}
          >
            {
            templateDesignView.value == "smartphone" ? 
              <TemplateMobileView /> : <TemplateDesktopView />
            }
          </div>
      </div>
    );
}





export function CreateFormPopup({ isOpen, onClose, onSubmit, FormLabel, placeHolder }) {
    const [formName, setFormName] = useState("");
  
    const handleSubmit = () => {
      if (formName.trim() ) {
        onSubmit({ "name":formName});
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
          <h2 style={{ marginBottom: "10px" }}>{FormLabel}</h2>
  
          {/* Form Name Input */}
          <input
            type="text"
            value={formName}
            // @ts-ignore
            onChange={(e) => setFormName(e.target.value)}
            placeholder={placeHolder}
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
  
  export function CreateFormButton({buttonLabel , formLabel, placeHolder , callback}) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
  
    const handleCreateForm = (data) => {
      console.log("handle create form data:",data);
     callback(data);
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
          {buttonLabel}
          </button>
        </div>
  
        <CreateFormPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onSubmit={handleCreateForm}
          FormLabel={formLabel}
          placeHolder={placeHolder}
        />
      </div>
    );
  }
  

  function TemplateCreatorButtons() {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",  // Ensures spacing
        width: "100%", 
        padding: "10px"
    }}>
        {/* Centered IconGroup */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <IconGroup names={["smartphone", "app-window-mac"]} onChange={(data) => { templateDesignView.value = data; console.log("template view:",templateDesignView.value); }} />
        </div>
    
        {/* Right-Aligned CreateFormButton */}
        <div style={{ marginLeft: "auto" }}>
            <CreateFormButton
             formLabel={"Create a Template"} 
             placeHolder={"Template Name:"} 
             buttonLabel={"CreateTemplate"} 
             callback={(data) => { CreateTemplate(data)}}/>
        </div>
    </div>
    );
  }


  function TemplateMobileView() {
    return (
      <MobileMockup>
            <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #e0e0e0",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
                className="scrollbar-hide"
            >
             <Drop
                onDrop={(data) => {HandleTemplateDrop(data);}}
                dropElementData={{ element: "screen" }}
                wrapParent={true}
              >
              {isTemplateChanged.value && Object.keys(activeTemplateElements).map((key) => {
                let myitem = activeTemplateElements[key].value;
                console.log("my item",myitem);
                RenderElement(myitem, HandleTemplateDrop);
              })}
                </Drop>
        </div>
      </MobileMockup>
    );
  }


  function TemplateDesktopView() {
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
          className="scrollbar-hide"
      >
          <Drop
                onDrop={(data) => {HandleTemplateDrop(data);}}
                dropElementData={{ element: "screen" }}
                wrapParent={true}
              >
              {isTemplateChanged.value && Object.keys(activeTemplateElements).map((key) => {
                let myitem = activeTemplateElements[key].value;
                RenderElement(myitem, HandleTemplateDrop);
              })}
                </Drop>
                </div>
      </DesktopMockup>
    );
  }