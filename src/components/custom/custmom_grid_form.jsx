import { user_form_layouts, user_forms_data } from "../../form_builder/form_state";
import FormRenderer from "./formComponents";


// Validation and Conditions Example Functions
const startsWithN = (value) => value.startsWith('N');
const isPositive = (value) => Number(value) > 0;

const formConfig = [
  { type: 'text', fieldName: 'name', 
      label: 'Full Name',
      inputStyle:{"border-radius":"15px", "color":"black", width:"100%"},  
      wrapperStyle:{"background-color":"white", "marginBottom":"0px", padding:"40px"},
      labelStyle:{"color":"black"},
     labelPosition: "top" ,
     validation: startsWithN, 
     errorMessage: 'Name must start with N' 
    },
  { type: 'number', fieldName: 'age', label: 'Age',    
    inputStyle:{"border-radius":"15px", "color":"black", width:"100%"},  
      wrapperStyle:{"background-color":"white", "marginBottom":"0px", padding:"40px"},
      labelStyle:{"color":"black"},
     labelPosition: "top", 
     validation: isPositive, 
     errorMessage: 'Age must be positive' },
  {
    type: 'dropdown',
    fieldName: 'gender',
    label: 'Gender',
    labelPosition: "top",
    inputStyle:{"border-radius":"15px", "color":"black", width:"100%"},  
      wrapperStyle:{"background-color":"white", "marginBottom":"0px", padding:"40px"},
      labelStyle:{"color":"black"},
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' }
    ],
      dependencies: [
        {
          field: 'age', // Field to watch
          condition: (value) => value > 18, // Condition based on the field value
          action: 'setValue', // Can be 'show', 'hide', 'setValue'
          value: 'Adult', // Value to set if condition matches
        },
      ],
  },
  {
    type: 'checkbox',
    fieldName: 'terms',
    label: 'Agree to terms',
    inputStyle:{"border-radius":"15px", "color":"black", width:"40px"},  
      wrapperStyle:{"background-color":"white", "marginBottom":"0px", padding:"40px"},
      labelStyle:{"color":"black"},
    labelPosition: "top",
    showIf: (values) => values['age'] > 18, // Show the checkbox only if age > 18
  },
  {
    type: 'dualText',
    fieldName: 'DualText',
    label: "Name",
    inputStyle:{"border-radius":"15px", "color":"black", width:"100%"},  
      wrapperStyle:{"background-color":"white", "marginBottom":"0px", padding:"40px"},
      labelStyle:{"color":"black"},
    labelPosition: "top",
    inputNames: ["firstName", "lastName"],

  
  },
  {
    type: 'radio-buttons',
    fieldName: 'jobType',
    label: 'JobType',
    labelPosition: 'top', 
    direction: 'column',
    options: [
      { value: 'employed', label: 'Employed', position: 'right' },
      { value: 'unemployed', label: 'Unemployed', position: 'right' }
    ],
    inputStyle:{"border-radius":"15px", "color":"black", width:"100%"},  
      wrapperStyle:{"background-color":"white", "marginBottom":"0px", padding:"40px"},
      labelStyle:{"color":"black"},
  },
  {
    type: 'inline-text',
    fieldName: 'xMargin',
    label: 'X Margin',
    labelPosition: 'left', // Label on the left
    inputStyle:{"border-radius":"15px", "color":"black", width:"100%"},  
    wrapperStyle:{"background-color":"white", "marginBottom":"0px", padding:"40px"},
    labelStyle:{"color":"black"},

  },
  {
    type: 'inline-text',
    fieldName: 'yMargin',
    label: 'Y Margin',
    labelPosition: 'left', // Label on the right
    inputStyle:{"border-radius":"15px", "color":"black", width:"100%"},  
      wrapperStyle:{"background-color":"white", "marginBottom":"0px", padding:"40px"},
      labelStyle:{"color":"black"},
  },
  {
    type: 'button-group',
    fieldName: 'textAlign',
    label: 'Text Alignment',
    labelPosition: 'top',
    buttons: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' }
    ],
    inputStyle:{"border-radius":"15px", "color":"black", width:"100%"},  
      wrapperStyle:{"background-color":"white", "marginBottom":"0px", padding:"40px"},
      buttonStyle:{"background-color":"white","border-color":"black", "border-style":"solid", "border-width":"1px" ,"padding":"10px 20px", "margin":"1px", "border-radius":"10px", "color":"black"},
      selectedButtonStyle:{"background-color":"black", "padding":"10px 20px","color":"white"},
      labelStyle:{"color":"black"},
  },
  {
    type: 'inline-text-with-field',
    fieldName: 'padding',
    textBefore: 'Set padding to',
    textAfter: 'px',
    inputStyle:{"border-radius":"15px", "color":"black", width:"100%"},  
      wrapperStyle:{"background-color":"white", "marginBottom":"0px", padding:"40px"},
      labelStyle:{"color":"black"},
  }
   
];



const formData = {
  name: 'John Doe',
  age: 30,
  gender: 'male',
  agree: true,
  status: 'single'
};

const handleFormChange = (updatedValues) => {
  console.log('Updated Form Values:', updatedValues);
};


export function CallTheForm() {

  return (
    <div className="container">
    <FormRenderer
      formConfig={user_forms_data.value}
      formData={formData}
      onFormChange={handleFormChange}
      styles={{"form":{"background-color":"white"}}}
      onSubmit={handleFormChange}
    />
  </div>
  );
}

