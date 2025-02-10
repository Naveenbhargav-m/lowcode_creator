// @ts-nocheck
import { Drop } from "../../components/custom/Drop";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css"; // Choose your preferred theme



import { useState } from "preact/hooks";
import { DefaultStyles } from "../styles/default_styles";
// import { CheckBoxElement, ColorElement, FileUploadElement, MultiSelectElement, RadioGroupElement, RatingElement, SelectElement, SliderElement, SliderRangeElement, SwitchElement, TextAreaElement, TextField, UrlElement } from "./fields/chakra_fields";
// import { TextAreaWithPopup } from "./configs_view/advanced_form";
// import { Rating } from "../components/ui/rating";

// const FlatpickrWrapper = ({ label, value, onChange, options, enableTime = false, noCalendar = false, mode = "single" }) => (
//   <div className="flex flex-col w-full mb-4">
//     <label className="mb-2 font-semibold text-gray-700">{label}</label>
//     <Flatpickr
//       value={value}
//       onChange={(selectedDates) => onChange(mode === "multiple" || mode === "range" ? selectedDates : selectedDates[0])}
//       options={{ ...options, enableTime, noCalendar, mode }} // Ensure correct options are merged
//       className="p-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
//     />
//   </div>
// );

// const Field = ({ type, options, value, onChange, fieldStyle = {}, ...props }) => {
//     const renderField = () => {

//       function GetStyle(name) {
//         let base = DefaultStyles["name"];
//         return {...base, ...fieldStyle};
//       }
//       let  configObj = {"style": fieldStyle, "value": value, "onChange":onChange, "placeHolder":"chakra Field Here"};
//       switch (type) {
//         case 'textfield':
//           return (
//             <TextField config={configObj}/>
//           );
//         case "switch":
//           return (
//             <SwitchElement config={configObj}/>
//           );
//         case 'checkbox':
//           return (
//           <CheckBoxElement config={configObj} />
//           );
  
//         case 'radio':
//           return (
//             <RadioGroupElement
//               config={{
//                 value: "option1",
//                 onChange: (val) => console.log(val),
//                 options: [
//                   { value: "option1", label: "Option 1" },
//                   { value: "option2", label: "Option 2" },
//                   { value: "option3", label: "Option 3" }
//                 ],
//                 direction: "row",
//               }}
//             />
//           );
  
//         case 'dropdown':
//           return (
//             <SelectElement
//             config={{
//               value: "option2",
//               onChange: (e) => console.log(e.target.value),
//               options: [
//                 { value: "option1", label: "Option 1" },
//                 { value: "option2", label: "Option 2" },
//                 { value: "option3", label: "Option 3" }
//               ],
//               placeholder: "Choose an option",
//             }}
//           />
          
//           );
  
//         case 'multi_select':
//           return (
//             <MultiSelectElement
//             config={{
//               value: [
//                 { value: "option1", label: "Option 1" },
//                 { value: "option2", label: "Option 2" }
//               ],
//               onChange: (selected) => console.log(selected),
//               options: [
//                 { value: "option1", label: "Option 1" },
//                 { value: "option2", label: "Option 2" },
//                 { value: "option3", label: "Option 3" }
//               ],
//               placeholder: "Choose options",
//             }}
// />

//           );
  
//         case 'range_slider':
//           return (
//             <SliderElement />
//           );
  
//         case 'two_slider':
//           return (
//            <SliderRangeElement />
//           );
  
//         case 'url':
//           return (
//             <UrlElement />
//           );
  
//         case 'phone':
//           return (
//             <input
//               type="tel"
//               value={value}
//               onChange={onChange}
//               style={fieldStyle}
//               {...props}
//             />
//           );
  
//           case 'date':
//             return (
//               <FlatpickrWrapper
//                 label="Select Date"
//                 value={value}
//                 onChange={onChange}
//                 options={{ dateFormat: "Y-m-d" }}
//               />
//             );
        
//           case 'date_time':
//             return (
//               <FlatpickrWrapper
//                 label="Select Date & Time"
//                 value={value}
//                 onChange={onChange}
//                 options={{ dateFormat: "Y-m-d H:i" }}
//                 enableTime={true}
//               />
//             );
        
//           case 'time':
//             return (
//               <FlatpickrWrapper
//                 label="Select Time"
//                 value={value}
//                 onChange={onChange}
//                 options={{ dateFormat: "H:i" }}
//                 enableTime={true}
//                 noCalendar={true}
//               />
//             );
        
//           case 'date_range':
//             return (
//               <FlatpickrWrapper
//                 label="Select Date Range"
//                 value={value}
//                 onChange={onChange}
//                 options={{ dateFormat: "Y-m-d" }}
//                 mode="range"
//               />
//             );
        
//           case 'multi_date':
//             return (
//               <FlatpickrWrapper
//                 label="Select Multiple Dates"
//                 value={value}
//                 onChange={onChange}
//                 options={{ dateFormat: "Y-m-d" }}
//                 mode="multiple"
//               />
//             );
        
//           case 'week':
//             return (
//               <FlatpickrWrapper
//                 label="Select Week"
//                 value={value}
//                 onChange={onChange}
//                 options={{
//                   dateFormat: "Y-m-d",
//                   weekNumbers: true, // Shows week numbers
//                 }}
//               />
//             );
        
//           case 'month':
//             return (
//               <FlatpickrWrapper
//                 label="Select Month"
//                 value={value}
//                 onChange={onChange}
//                 options={{
//                   dateFormat: "Y-m", // Year & Month only
//                   noCalendar: false,
//                 }}
//               />);
          
//         case 'color':
//           return (
//             <ColorElement />
//           );
  
//         case 'textarea':
//           return (
//             <TextAreaElement />
//           );
//         case 'file_upload':
//           return (
//             <FileUploadElement />
//           );
  
//         case 'rich_text':
//           return (
//             <div
//               contentEditable
//               dangerouslySetInnerHTML={{ __html: value }}
//               onBlur={(e) => onChange(e.target.innerHTML)}
//               style={fieldStyle}
//               {...props}
//             ></div>
//           );
  
//         case 'markdown':
//           return (
//             <textarea
//               value={value}
//               onChange={onChange}
//               style={fieldStyle}
//               {...props}
//             />
//           );
  
//         case 'rating':
//           return (
//            <RatingElement />
//           );
  
//         default:
//           return null;
//       }
//     };
  
//     return <div>{renderField()}</div>;
//   };


  const PanelField = ({ label, labelPosition, errorMessage, showError, panelStyle, labelStyle , children}) => {
    const getLabelContainerStyle = () => {
      const baseStyle = { display: 'flex', alignItems: 'center', margin: '5px 0' };
      switch (labelPosition) {
        case 'top':
          return { ...baseStyle, flexDirection: 'column', alignItems: 'flex-start' };
        case 'right':
          return { ...baseStyle, flexDirection: 'row-reverse', justifyContent: 'space-between' };
        case 'left':
          return { ...baseStyle, flexDirection: 'row', justifyContent: 'space-between' };
        case 'bottom':
          return { ...baseStyle, flexDirection: 'column-reverse', alignItems: 'flex-start' };
        case 'center':
          return { ...baseStyle, flexDirection: 'column', alignItems: 'center', textAlign: 'center' };
        default:
          return baseStyle;
      }
    };
  
    return (
      <div style={{...panelStyle}}>
        <div style={getLabelContainerStyle()}>
          {label && <div style={{ ...labelStyle }}>{label}</div>}
          <div>{children}</div>
        </div>
        {showError && errorMessage && (
          <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>
        )}
      </div>
    );
  };


  function Column({children, config , onDrop}) {
    console.log("column config:",config, children);
    return (
      <Drop wrapParent={false} dropElementData={{"id": config["id"]}} onDrop={(data) => {onDrop(data)}}>
      <div class="column" style={config["style"]}>
      {children}
      </div>
    </Drop>
    );
  }
  
  function Row({children, config , onDrop}) {
    return (
      <Drop wrapParent={false} dropElementData={{"id": config["id"]}} onDrop={(data) => {onDrop(data)}}>
      <div class="row" style={config["style"]}>
        {children}
      </div>
    </Drop>
  
    );
  }
  
  export { PanelField , Row , Column};