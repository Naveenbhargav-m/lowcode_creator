import { ArrayList, DatePicker, GridField, TimePicker } from "./fields_v2";

// Form Component
function TextField({ config = {}, onAction}) {
  return (
      <input type="text"
       name="text" 
       placeholder={config["placeholder"] || ""} 
       aria-label={config["label"]}
       style={{ ...config["fieldStyle"] }}
       onBlur={(e) => onAction(e, "onBlur", config["value"])}
       onFocus={(e) => onAction(e, "onFocus",config["value"])}
       onClick={(e) => onAction(e, "onClick",config["value"])}
       onKeyDown={(e) => onAction(e, "onKeyDown",config["value"])}
       onMouseEnter={(e) => onAction(e, "onMouseEnter",config["value"])}
       ></input>
  );
}


// Password Field
function PasswordField({ config = {}, onAction }){
    return (
      <input type="password"
      name="text" 
      placeholder={config["placeholder"] || ""} 
      aria-label={config["label"]}
      style={{ ...config["fieldStyle"] }}
      onBlur={(e) => onAction(e, "onBlur", config["value"])}
      onFocus={(e) => onAction(e, "onFocus",config["value"])}
      onClick={(e) => onAction(e, "onClick",config["value"])}
      onKeyDown={(e) => onAction(e, "onKeyDown",config["value"])}
      onMouseEnter={(e) => onAction(e, "onMouseEnter",config["value"])}
      ></input>
    );
}



function SwitchElement({ config = {}, onAction }) {
  return (
    <label>
    <input name="terms" 
    type="checkbox" 
    role="switch" 
    checked={config["value"]}
    style={{...config["fieldStyle"]}}
    onChange={(e) => {onAction(e,"onChange",config["value"])}}

    />
    {config["label"]}
  </label>
  );
}



function CheckBoxElement({ config = {}, onAction }) {
  console.log("called checkbox:",config);
  let fieldStyle = {"display":"flex", "flexDirection":"row"};

  return (
    <fieldset class="pico">      
        {config["options"].map((entity) => {
          return (
            <label style={fieldStyle}>
            <input 
            type="radio"
              name="language"
              id={entity["value"]}
              checked={config["value"] === entity["value"]} 
              onChange={(e) => onAction(e,"onChange",entity["value"])}
              />
            {entity["label"]}
            </label>
          );
        })}
    </fieldset>
      );
}

// Radio Group
function RadioGroupElement({ config = {}, onAction }){
  console.log("radio group options:",config["options"]);
  let fieldStyle = {"display":"flex", "flexDirection":"row"};
  return (
      <fieldset>      
        {config["options"].map((entity) => {
          return (
            <label style={fieldStyle}>
            <input 
            type="radio"
             name="language"
             id={entity["value"]}
              checked />
            {entity["label"]}
            </label>
          );
        })}
    </fieldset>
  );
}

// Select Element
function SelectElement({ config = {}, onAction }) {
  return (
    <select name={config["name"]} aria-label={config["name"]} required>
      {config["options"].map((inner_option) => {
        return (
          <option 
          selected={inner_option["value"] === config["value"]} 
          onChange={(e) => onAction(e, "onChange", inner_option["value"])}>
            {inner_option["label"]}
          </option>
        );
      })}
    </select>
  );

}

// Multi-Select Element
function MultiSelectElement({ config = {}, onAction }) {
  return (
    <select name={config["name"]} aria-label={config["name"]} required>
      {config["options"].map((inner_option) => {
        return (
          <option 
          selected={inner_option["value"] === config["value"]} 
          onChange={(e) => onAction(e, "onChange", inner_option["value"])}>
            {inner_option["label"]}
          </option>
        );
      })}
    </select>);
}
// Slider Element
function SliderElement({ config = {}, onAction }) {
  return (
  <input type="range" value={config["value"]} onChange={(e) => {onAction(e, "onChange", config["value"]);}}/>
  );
}

// Color Picker
function ColorElement({ config = {}, onAction }){
  return (
    <input
  type="color"
  value={config["value"]}
  aria-label={config["label"]}
  onChange={(e) => onAction(e, "onChange", config["value"])}
></input>
  );
}

// Text Area
function TextAreaElement({config = {}, onAction}) {
  return(
    <textarea
    name="bio"
  placeholder={config["placeholder"]}
  aria-label={config["label"]}
>
</textarea>
  );
}

// File Upload
function FileUploadElement({ onAction }) {
  return (
    <input type="file"></input>
  );
}

// Rating Element
function RatingElement({config, onAction}) {
  return (
  <input type="range" />
  );
}

function DatePickerElement({config, onAction}) {
  return (
    <input type="date" 
    name="date" 
    aria-label={config["label"]}
    value={config["value"]}
    onChange={(e) => {onAction(e,"onChange",config["value"]);}}
    >

    </input>
  );
}

const Field = ({ type, config , Action}) => {
  console.log("called field element:",config, type);
  const fieldComponents = {
    textfield: TextField,
    password: PasswordField,
    switch: SwitchElement,
    checkbox: CheckBoxElement,
    radio: RadioGroupElement,
    dropdown: SelectElement,
    multi_select: MultiSelectElement,
    slider: SliderElement,
    color: ColorElement,
    textarea: TextAreaElement,
    file_upload: FileUploadElement,
    rating: RatingElement,
    date: DatePicker,
    "time": TimePicker,
    "grid": GridField,
    "list": ArrayList
  };

  const handleEvent = (event, key , value) => {
    if (key === "onKeyDown") {
      key = "onChange";
    }
    Action({ "config": config, "key":key, "value": value });
  };



  const Component = fieldComponents[type] || (() => null);
  return <form class="pico"> <Component config={config} onAction={handleEvent} /></form>;
};


export { Field, TextField, PasswordField, SwitchElement, CheckBoxElement, RadioGroupElement, SelectElement, MultiSelectElement, SliderElement, ColorElement, TextAreaElement, FileUploadElement, RatingElement, DatePickerElement };
