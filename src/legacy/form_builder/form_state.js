// import { signal } from "@preact/signals";


// let form_elements_data = signal({
//   "TextField": { 
//     type: 'text', 
//     fieldName: 'name', 
//     label: 'Your Label:',
//     inputStyle: { "border-radius": "15px", "color": "black", width: "100%" },
//     wrapperStyle: { "background-color": "white", "marginBottom": "0px", padding: "10px" },
//     labelStyle: { "color": "black" },
//     labelPosition: "top"
//   },
//   "Number": { 
//     type: 'number', 
//     fieldName: 'age', 
//     label: 'Age', 
//     inputStyle: { "border-radius": "15px", "color": "black", width: "100%" },
//     wrapperStyle: { "background-color": "white", "marginBottom": "0px", padding: "40px" },
//     labelStyle: { "color": "black" },
//     labelPosition: "top" 
//   },
//   "Phone": { 
//     type: 'text', 
//     fieldName: 'phone', 
//     label: 'Phone', 
//     inputStyle: { "border-radius": "15px", "color": "black", width: "100%" },
//     wrapperStyle: { "background-color": "white", "marginBottom": "0px", padding: "40px" },
//     labelStyle: { "color": "black" },
//     labelPosition: "top"
//   },
//   "Dual Text": { 
//     type: 'dualText', 
//     fieldName: 'DualText', 
//     label: 'Name', 
//     inputStyle: { "border-radius": "15px", "color": "black", width: "100%" },
//     wrapperStyle: { "background-color": "white", "marginBottom": "0px", padding: "40px" },
//     labelStyle: { "color": "black" },
//     labelPosition: "top",
//     inputNames: ["firstName", "lastName"]
//   },
//   "DropDown": { 
//     type: 'dropdown', 
//     fieldName: 'gender', 
//     label: 'Gender', 
//     labelPosition: "top",
//     inputStyle: { "border-radius": "15px", "color": "black", width: "100%" },
//     wrapperStyle: { "background-color": "white", "marginBottom": "0px", padding: "40px" },
//     labelStyle: { "color": "black" },
//     options: [
//       { value: 'male', label: 'Male' },
//       { value: 'female', label: 'Female' }
//     ]
//   },
//   "Checkbox": { 
//     type: 'checkbox', 
//     fieldName: 'terms', 
//     label: 'Agree to terms', 
//     inputStyle: { "border-radius": "15px", "color": "black", width: "40px" },
//     wrapperStyle: { "background-color": "white", "marginBottom": "0px", padding: "40px" },
//     labelStyle: { "color": "black" },
//     labelPosition: "top"
//   },
//   "ButtonGroup": { 
//     type: 'button-group', 
//     fieldName: 'textAlign', 
//     label: 'Text Alignment', 
//     labelPosition: 'top',
//     buttons: [
//       { value: 'left', label: 'Left' },
//       { value: 'center', label: 'Center' },
//       { value: 'right', label: 'Right' }
//     ],
//     inputStyle: { "border-radius": "15px", "color": "black", width: "100%" },
//     wrapperStyle: { "background-color": "white", "marginBottom": "0px", padding: "40px" },
//     buttonStyle: { "background-color": "white", "border-color": "black", "border-style": "solid", "border-width": "1px", "padding": "10px 20px", "margin": "1px", "border-radius": "10px", "color": "black" },
//     selectedButtonStyle: { "background-color": "black", "padding": "10px 20px", "color": "white" },
//     labelStyle: { "color": "black" }
//   },
//   "Text Group": { 
//     type: 'inline-text-with-field', 
//     fieldName: 'padding', 
//     textBefore: 'Set padding to', 
//     textAfter: 'px',
//     inputStyle: { "border-radius": "15px", "color": "black", width: "100%" },
//     wrapperStyle: { "background-color": "white", "marginBottom": "0px", padding: "40px" },
//     labelStyle: { "color": "black" }
//   },
//   "TextArea": { type: 'textarea', fieldName: 'Css', 
//     label: 'Css:',
//     inputStyle:{"border-radius":"15px", "color":"black", width:"100%", height:"180px"},  
//     wrapperStyle:{"background-color":"white", "marginBottom":"0px", padding:"40px"},
//     labelStyle:{"color":"black"},
//    labelPosition: "top" ,
//    errorMessage: 'Name must start with N' 
//   },
// });



// let IconAndFieldMapping = {
//     "Text": "text-cursor-input",
//     "Integer": "text-cursor",
//     "Float": "phone-incoming",
//     "Text[]": "list",
//     "Integer[]": "sliders-horizontal",
//     "Bolean": "list-filter",
//     "DateTime": "square-check",
//     "Date": "component",
//     "Time": "toggle-right",
//     "Location": "link-2",
//     "Relation": "trending-up-down",
//     "K/Y pairs": "mail",
//     "Json": "key-round",
//     "Interval": "calendar-range",
//     "Enum": "calendar-clock",
//     "point (x,y)": "key-round",
//     "TextField": "text-cursor-input",
//     "Number": "text-cursor",
//     "Phone": "phone-incoming",
//     "Dual Text": "list",
//     "DropDown": "sliders-horizontal",
//     "Checkbox": "list-filter",
//     "TextArea": "text",
//     "Email": "mail",
//     "ButtonGroup": "key-round",
//     "Others": "calendar-clock",
//     "Text Group": "key-round"
// };

// const tableToRelatedFieldTypes = {
//   "Text":["TextField","DropDown","TextArea","Email"],
  
// };
// let user_forms_data = signal([]);
// let user_form_layouts = signal([]);

// function checkCollision(newPosition, currentIndex) {
//   for (let i = 0; i < user_forms_data.value.length; i++) {
//     if (i !== currentIndex) {
//       const field = user_forms_data.value[i];
//       const isColliding = (
//         newPosition.x < field.position.x + field.size.width &&
//         newPosition.x + field.size.width > field.position.x &&
//         newPosition.y < field.position.y + field.size.height &&
//         newPosition.y + field.size.height > field.position.y
//       );
//       if (isColliding) return true;
//     }
//   }
//   return false;
// }


// function handleFormElementDrop(data) {
//   let values = user_forms_data.peek();
//   let y = 0;
//   if(values.length > 0) {
//     let last = values.pop();
//     y = last.position.y;
//     y = y + last.size.height + 5;
//     values.push(last);
//   } 
//   const newItem = {
//     i: data.i || `element-${values.length}`,
//     type: data.data[1],
//     position: { x: 0, y: y },
//     size:{ width: 120, height: 60 },
//     configs: form_elements_data.value[data.data[1]],
//     actions: {"click": () => { console.log("clicked"); }}
//   };
//   user_forms_data.value.push(newItem);
//   user_forms_data.value = [...user_forms_data.value];
//   console.log(user_forms_data.value);
// }

// export {form_elements_data , user_forms_data, user_form_layouts,
//    handleFormElementDrop ,checkCollision, IconAndFieldMapping};