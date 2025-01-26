import { DragAndResizableChild, DragAndResizableParent } from "../components/custom/drag_and_resize";
import { Drop } from "../components/custom/Drop";
import { FormElementsList } from "../form_builder/form_left_page";
import { FormRightPanel } from "../form_builder/form_page_right";
import { AddtoForm, formChanged } from "../form_builder/form_state2";
import { CreateFormButton } from "../form_builder/formBuilder3";
import { DesktopMockup } from "../screen_builder/screen_components";


// Example Page
export default function ExamplePage() {
  const handleChildUpdate = (childData) => {
    console.log('Child updated:', childData);
  };

  return (
    <div className="min-h-screen h-screen w-full flex">
    <div className="w-1/6 bg-white p-4 min-h-screen">
      <FormElementsList />
    </div>

    {/* Main content area */}
    <div className="w-4/6 h-screen bg-background scrollable-div">
        <CreateFormButton />
        <DesktopMockup>
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#f9f9f9",
          minHeight: "80vh",
          border: "1px solid #e0e0e0",
          overflow: "hidden",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <Drop
          onDrop={(data) => AddtoForm(data)}
          dropElementData={{ element: "form", name: formChanged.value }}
        >
    <DragAndResizableParent gridSize={10}>
      <DragAndResizableChild initialPosition={{ x: 50, y: 50 }} initialSize={{ width: 300, height: 300 }} onChildUpdate={handleChildUpdate}>
            <Child/>
      </DragAndResizableChild>
      <DragAndResizableChild initialPosition={{ x: 200, y: 100 }} initialSize={{ width: 150, height: 150 }} onChildUpdate={handleChildUpdate} >
        <Child />
      </DragAndResizableChild>
    </DragAndResizableParent>
    </Drop>
    </div>
    </DesktopMockup>
    </div>

    {/* Right panel */}
    <div className="w-1/6 bg-white h-screen scrollable-div">
      <FormRightPanel />
    </div>
  </div>
    
  );
}


// function Child() {
//     return <div style={{height:"100px",width:"100px", backgroundColor:"black"}}>

//     </div>
// }


// export default function ExamplePage() {
//     const handleChildUpdate = (childData) => {
//       console.log('Child updated:', childData);
//     };
  
//     return (
//       <div className="min-h-screen h-screen w-full flex">
//         <div className="w-1/6 bg-white p-4 min-h-screen">
//           <FormElementsList />
//         </div>
  
//         <div className="w-4/6 h-screen bg-background">
//           <DragAndResizableParent gridSize={10}>
//             <DragAndResizableChild
//               initialPosition={{ x: 50, y: 50 }}
//               initialSize={{ width: 300, height: 300 }}
//               onChildUpdate={handleChildUpdate}
//             >
//               <Child />
//             </DragAndResizableChild>
//             <DragAndResizableChild
//               initialPosition={{ x: 200, y: 100 }}
//               initialSize={{ width: 150, height: 150 }}
//               onChildUpdate={handleChildUpdate}
//             >
//               <Child />
//             </DragAndResizableChild>
//           </DragAndResizableParent>
//         </div>
  
//         <div className="w-1/6 bg-white h-screen">
//           <FormRightPanel />
//         </div>
//       </div>
//     );
//   }


  
  function Child() {
    return <div style={{ height: '100px', width: '100px', backgroundColor: 'black' }} />;
  }