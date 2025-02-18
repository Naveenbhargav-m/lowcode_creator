
// Form Component
function TextField({ config = {}, onAction}) {
  return (
      <input type="text"
       name="text" 
       placeholder={config["placeholder"] || ""} 
       aria-label="Text"
       style={{ ...config["style"] }}
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
      aria-label="Text"
      style={{ ...config["style"] }}
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
    style={config["style"]}
    onChange={(e) => {onAction(e,"onChange",config["value"])}}

    />
    I agree to the Terms
  </label>
  );
}



function CheckBoxElement({ config = {}, onAction }) {
  console.log("called checkbox:",config);
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
    <select name={config["name"]} aria-label="Select your favorite cuisine..." required>
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
    <select name={config["name"]} aria-label="Select your favorite cuisine..." required>
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
    <label>
  {config["label"]}
  <input type="range" value={config["value"]} onChange={(e) => {onAction(e, "onChange", config["value"]);}}/>
</label>
  );
}

// Color Picker
function ColorElement({ config = {}, onAction }){
  return (
    <input
  type="color"
  value={config["value"]}
  aria-label="Color picker"
  onChange={(e) => onAction(e, "onChange", config["value"])}
></input>
  );
}

// Text Area
function TextAreaElement() {
  return(
    <textarea
    name="bio"
  placeholder="Write a professional short bio..."
  aria-label="Professional short bio"
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
    <label>
  Brightness
  <input type="range" />
</label>

  );
}

// Date Picker (Flatpickr)
const FlatpickrWrapper = ({ config = {}, onAction }) => (
  <FieldWrapper config={config} onAction={onAction}>
    <Flatpickr options={config.options} value={config.value} className="p-2 border rounded" />
  </FieldWrapper>
);

/* This the fields using Daisi ui and pico css*/

const Field = ({ type, config , Action}) => {
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
    date: FlatpickrWrapper,
  };

  const handleEvent = (event, key , value) => {
    if (key === "onKeyDown") {
      key = "onChange";
    }
    Action({ "config": config, "key":key, "value": value });
  };



  const Component = fieldComponents[type] || (() => null);
  return <Component config={config} onAction={handleEvent} />;
};


export { Field, TextField, PasswordField, SwitchElement, CheckBoxElement, RadioGroupElement, SelectElement, MultiSelectElement, SliderElement, ColorElement, TextAreaElement, FileUploadElement, RatingElement, FlatpickrWrapper };
