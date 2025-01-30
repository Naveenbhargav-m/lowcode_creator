
// import { Draggable } from "../components/custom/Drag";
// import DynamicIcon from "../components/custom/dynamic_icon";
// import { useState } from "preact/hooks";
// import { activeTabForms, ChangeActiveForm, forms, FormtableFields } from "./form_state2";
// import { IconAndFieldMapping } from "./form_state";

// export function FormElementsList() {


//   let form_elements = [];

//   let fields = FormtableFields.value;
//   for(var i=0;i<fields.length;i++) {
//     let key = fields[i]["type"];
//     let label = fields[i]["name"];
//     form_elements.push([IconAndFieldMapping[key],label,key]);
//   }

//   console.log("new form elements:",form_elements);


//   return (
//     <div
//       className="fixed-grid pb-10 scrollable-div bg-white"
//       style={{ height: "90vh" }}
//     >
//       {/* Tabs */}
//       <div className="flex justify-between border-b">
//         <button
//           onClick={() => activeTabForms.value = "fields"}
//           className={`px-4 py-2 ${
//             activeTabForms.value === "fields" ? "border-b-2 border-black text-black" : ""
//           }`}
//         >
//           Fields
//         </button>
//         <button
//           onClick={() => activeTabForms.value = "forms"}
//           className={`px-4 py-2 ${
//             activeTabForms.value === "forms" ? "border-b-2 border-black text-black" : ""
//           }`}
//         >
//           Forms
//         </button>
//       </div>

//       {/* Tab Content */}
//       <div className="px-2 py-2">
//         {activeTabForms.value === "fields" && (
//           <div>
//             <OptionsMapper options={form_elements} />
//           </div>
//         )}
//         {activeTabForms.value === "forms" && (
//           <div>
//             <ul>
//             {Object.keys(forms).map((name, index) => (
//   <li 
//     key={index} 
//     className="py-1"
//     style={{
//       listStyleType: "none", // Removes default bullet points
//     }}
//     onClick={() => ChangeActiveForm(name)}
//   >
//     <p
//       style={{
//         padding: "10px", // Adds padding inside the item
//         border: "1px solid black", // Black border
//         color: "black", // Black text
//         borderRadius: "4px", // Optional: Makes the corners rounded
//         margin: "5px 0", // Adds spacing between list items
//         cursor: "pointer", // Optional: Makes it interactive
//       }}
//     >
//       {forms[name]["form_name"]}
//     </p>
//   </li>
// ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function OptionsMapper({ options }) {
//   return (
//     <div className="block">
//       {options.map((innerlist) => {
//         return (
//           <Draggable data={innerlist} onDragStart={(data) => {console.log("data:", data)}}>
//             <div className="cell p-2 bg-white rounded-md my-2 border-2 border-highlight">
//               <div className="flex flex-row items-center scroll-px-4">
//                 <div className="px-2">
//                   <DynamicIcon name={innerlist[0]} size={30} />
//                 </div>
//                 <p className="text-sm">{innerlist[1]}</p>
//               </div>
//             </div>
//           </Draggable>
//         );
//       })}
//     </div>
//   );
// }

