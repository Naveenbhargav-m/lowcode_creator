import { useState } from "preact/hooks";
import { IconGroup } from "../components/primitives/general_components";
import { componentPagesSignal, ComponentView } from "./screen_components";
import { DesktopMockup } from "../screen_builder/screen_components";
import { Drop } from "../components/custom/Drop";
import { RenderElement } from "../screen_builder/screen-areas_2";



export function ScreenComponentView() {
    return (
        <div>
            Hey need to implement this.
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
            "color": "black",
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
            <IconGroup names={["smartphone", "app-window-mac"]} onChange={(data) => { 
              ComponentView.value = data;
               console.log("template view:",ComponentView.value); 
            //    SetTemplateActiveElements();
               }} />
        </div>
    
        {/* Right-Aligned CreateFormButton */}
        <div style={{ marginLeft: "auto" }}>
            <CreateFormButton
             formLabel={"Create a Component"} 
             placeHolder={"Component Name:"} 
             buttonLabel={"CreateCreateComponent"} 
             callback={(data) => { CreateTemplate(data)}}/>
        </div>
    </div>
    );
  }


  // function TemplateMobileView() {
  //   return (
  //     <MobileMockup>
  //           <div
  //               style={{
  //                 width: "100%",
  //                 height: "100%",
  //                 backgroundColor: "#f9f9f9",
  //                 border: "1px solid #e0e0e0",
  //                 scrollbarWidth: "none",
  //                 msOverflowStyle: "none",
  //               }}
  //               className="scrollbar-hide"
  //           >
  //            <Drop
  //               onDrop={(data) => {HandleTemplateDrop(data);}}
  //               dropElementData={{ element: "screen" }}
  //               wrapParent={true}
  //             >
  //             <List 
  //             values={}
  //             onChange={}
  //             {isTemplateChanged.value && Object.keys(activeTemplateElements).map((key) => {
  //               let myitem = activeTemplateElements[key].value;
  //               return RenderElement(myitem, HandleTemplateDrop, activeTemplateElement);
  //             })}
  //             />
  //               </Drop>
  //       </div>
  //     </MobileMockup>
  //   );
  // }



function TemplateMobileView() {
    let curScreen = activeTamplate.value;
    let style = {};
    let outerDivStyle = {
      position: "relative",
      height: "100%",
      width: "800px",
      backgroundColor: "#f9f9f9",
      border: "1px solid #e0e0e0",
      overflow: "auto",
      padding: "10px",
      scrollbarWidth: "none", // For Firefox
      msOverflowStyle: "none", // For Internet Explorer and Edge
    };
  
    if (curScreen) {
      console.log("screen styles:", curScreen);
      style = templates[curScreen]["mobile_style"];
    }
  
   // Reactive: Compute items from `screenElements`
   const items = useSignal([]);
   useEffect(() => {
      console.log("rerendering:");
      const elementsArray = Object.values(activeTemplateElements);
      const filteredItems = elementsArray.filter((item) => !item.value.parent);
      const sortedItems = filteredItems.sort((a, b) => {
                            const orderA = a.value.order ?? Infinity;
                            const orderB = b.value.order ?? Infinity;
                            return orderA - orderB;});
      console.log("sorted Items before rendering:",sortedItems);
      items.value = sortedItems;
      TemplateSorted.value = generateUID();
   }, [isTemplateChanged.value, activeTemplateElements]);
  
  
   let sortableItems = useComputed(() => items.value.map((item) => ({
    id: item.value.id,
    name: item.value.title,
    style: item.value.style || {},
  })));
  
  
    function SortItems(items, newItems) {
      const itemMap = new Map(items.map((item) => [item.value.id, item]));
      let sortedItems = newItems.map(({ id }) => itemMap.get(id)).filter(Boolean);
      console.log("sorted Items after first sort:",sortedItems);
      return sortedItems;
    }
  
    function SetSortedItems(sortedItems) {
      console.log("set sorted Items:", sortedItems);
      let updatedItems = [];
      for(var i=0;i<sortedItems.length;i++) {
        let cur = sortedItems[i];
        let id = cur.value["id"]
        cur.value["order"] = i;
        activeTemplateElements[id].value = {...cur.value};
        templates[curScreen][templateDesignView.value] = activeTemplateElements;
        templates[curScreen]["_change_type"] = templates[curScreen]["_change_type"] || "update";;
        updatedItems.push(cur);
      }
      console.log("set sorted items before updation:", updatedItems);
      items.value = [...updatedItems];
      
    }
  
    return (
      <MobileMockup>
        <div style={{ ...outerDivStyle }} className="scrollbar-hide">
          <Drop
            onDrop={(data) => {
              HandleTemplateDrop(data);
            }}
            dropElementData={{ element: "screen" }}
            wrapParent={true}
          >
            <div style={{ ...style }} onClick={() => (activeTemplateElement.value = "screen")}>
              <ReactSortable
                list={sortableItems.value}
                setList={(newList) => {
                  let temp = [...SortItems(items.value, newList)];
                  SetSortedItems(temp);
                }}
                group="elements"
                animation={150}
                ghostClass="element-ghost"
              >
                {TemplateSorted.value.length > 0 &&
                  items.value.map((item) => {
                    if (!item.value.parent) {
                     console.log("rendering after removal:",isTemplateChanged.value); 
                      return (<div>
                        <SelectableComponent 
                            onChick={(e,id) => {
                              e.stopPropagation();
                              console.log("--------------------- Clicked on me -------------:",item.value.id);
                              activeTemplateElement.value = item.value["id"];}}
                            onRemove={(e,id) => {DeleteTemplateElements(id)}}
                            id={item.value["id"]}
                            isSelected={activeTemplateElement.value === item.value.id}
                            >
                        {RenderElement(item.peek(), HandleTemplateDrop, activeTemplateElement, "template", activeTemplateElements)}
                        </SelectableComponent>
                        </div>);
                    }
                  })}
              </ReactSortable>
            </div>
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
                let myitem = activeTemplateElements[key];
                return RenderElement(myitem.peek(), HandleTemplateDrop , activeTemplateElement, "template");
              })}
                </Drop>
                </div>
      </DesktopMockup>
    );
  }