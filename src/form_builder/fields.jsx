// @ts-nocheck
import { Drop } from "../components/custom/Drop";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css"; // Choose your preferred theme



import { useState } from "preact/hooks";
import { DefaultStyles } from "./styles/default_styles";
import { Input, RadioGroup, Stack} from "@chakra-ui/react";
import { PasswordInput } from "../components/ui/password-input";
import { Switch } from "../components/ui/switch";
import { Checkbox } from "../components/ui/checkbox";
import { fieldStyle } from "./configs_view/constantConfigs";
import { Radio } from "../components/ui/radio";


function TextField({ config = {} }) {
  const { value = "", style = {}, placeholder = "", ...rest } = config;
  return <Input style={style} placeholder={placeholder} defaultValue={value} {...rest} />;
}

function PasswordField({ config = {} }) {
  const { value = "", style = {}, placeholder = "", ...rest } = config;
  return <PasswordInput style={style} placeholder={placeholder} defaultValue={value} {...rest} />;
}

function SwitchElement({ config = {} }) {
  const { value = false, style = {}, ...rest } = config;
  return <Switch style={style} variant="raised" checked={value} {...rest} />;
}


function CheckBoxElement({ config = {} }) {
  const { value = false, style = {}, onChange, label = "", ...rest } = config;

  return (
    <Checkbox 
      isChecked={value} 
      onChange={onChange} 
      colorScheme="blue" 
      style={{ ...style }} 
      {...rest}
    >
      {label}
    </Checkbox>
  );
}

function RadioGroupElement({ config = {} }) {
  const {
    value = "",
    onChange,
    options = [],
    direction = "column",
    defaultValue,
    style = {},
    ...rest
  } = config;

  return (
    <RadioGroup value={value} onChange={onChange} defaultValue={defaultValue} {...rest}>
      <Stack direction={direction} style={{ ...style }}>
        {options.map((option) => (
          <Radio key={option.value} value={option.value} colorScheme="blue">
            {option.label}
          </Radio>
        ))}
      </Stack>
    </RadioGroup>
  );
}


import Select from "react-select";

function SelectElement({ config = {} }) {
  const {
    value = "",
    onChange,
    options = [],
    placeholder = "Select an option",
    defaultValue,
    style = {},
    ...rest
  } = config;

  return (
    <Select 
      value={value} 
      onChange={onChange} 
      defaultValue={defaultValue} 
      placeholder={placeholder} 
      style={{ ...style }} 
      {...rest}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}



function MultiSelectElement({ config = {} }) {
  const {
    value = [],
    onChange,
    options = [],
    placeholder = "Select options",
    style = {},
    ...rest
  } = config;

  return (
    <Select
      isMulti
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      styles={{
        control: (base) => ({
          ...base,
          ...style,
        }),
      }}
      {...rest}
    />
  );
}

const FlatpickrWrapper = ({ label, value, onChange, options }) => (
  <div className="flex flex-col w-full mb-4">
    <label className="mb-2 font-semibold text-gray-700">{label}</label>
    <Flatpickr
      value={value}
      onChange={(selectedDates) => onChange(selectedDates[0])}
      options={options}
      className="p-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
    />
  </div>
);

function CheckBox({ type, options, value, onChange, fieldStyle = {}, ...props }) {
  const [checked, setChecked] = useState(value || false);
  
  const handleChecked = () => {
    const newValue = !checked;
    setChecked(newValue);
    onChange(newValue);
  };

  return (
    <label style={{ display: "inline-block", cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChecked}
        style={{ display: "none" }} // Hide default checkbox
        {...props}
      />
      <span
        style={{
          width: "20px",
          height: "20px",
          display: "inline-block",
          border: "2px solid black",
          borderRadius:"8px",
          backgroundColor: checked ? "black" : "white",
          transition: "background-color 0.2s ease",
        }}
      ></span>
    </label>
  );
}


const Toggle = ({ label, onToggle }) => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    const newState = !isToggled;
    setIsToggled(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div className="toggle-container">
      <div
        className={`toggle-switch ${isToggled ? 'toggled' : ''}`}
        onClick={handleToggle}
      >
        <div className="toggle-slider" />
      </div>
    </div>
  );
};




const Field = ({ type, options, value, onChange, fieldStyle = {}, ...props }) => {
    const renderField = () => {

      function GetStyle(name) {
        let base = DefaultStyles["name"];
        return {...base, ...fieldStyle};
      }
      let  configObj = {"style": fieldStyle, "value": value, "onChange":onChange, "placeHolder":"chakra Field Here"};
      switch (type) {
        case 'textfield':
          return (
            <TextField config={configObj}/>
          );
        case "switch":
          return (
            <SwitchElement config={configObj}/>
          );
        case 'checkbox':
          return (
          <CheckBoxElement config={configObj} />
          );
  
        case 'radio':
          return (
            <RadioGroupElement
              config={{
                value: "option1",
                onChange: (val) => console.log(val),
                options: [
                  { value: "option1", label: "Option 1" },
                  { value: "option2", label: "Option 2" },
                  { value: "option3", label: "Option 3" }
                ],
                direction: "row",
              }}
            />
          );
  
        case 'dropdown':
          return (
            <SelectElement
            config={{
              value: "option2",
              onChange: (e) => console.log(e.target.value),
              options: [
                { value: "option1", label: "Option 1" },
                { value: "option2", label: "Option 2" },
                { value: "option3", label: "Option 3" }
              ],
              placeholder: "Choose an option",
            }}
          />
          
          );
  
        case 'multi_select':
          return (
            <MultiSelectElement
            config={{
              value: [
                { value: "option1", label: "Option 1" },
                { value: "option2", label: "Option 2" }
              ],
              onChange: (selected) => console.log(selected),
              options: [
                { value: "option1", label: "Option 1" },
                { value: "option2", label: "Option 2" },
                { value: "option3", label: "Option 3" }
              ],
              placeholder: "Choose options",
            }}
/>

          );
  
        case 'range_slider':
          return (
            <input
              type="range"
              value={value}
              onChange={onChange}
              style={fieldStyle}
              {...props}
            />
          );
  
        case 'two_slider':
          return (
            <div style={fieldStyle}>
              <input
                type="range"
                value={value[0]}
                onChange={(e) => onChange([e.target["value"], value[1]])}
                {...props}
              />
              <input
                type="range"
                value={value[1]}
                onChange={(e) => onChange([value[0], e.target["value"]])}
                {...props}
              />
            </div>
          );
  
        case 'url':
          return (
            <input
              type="url"
              value={value}
              onChange={onChange}
              style={fieldStyle}
              {...props}
            />
          );
  
        case 'phone':
          return (
            <input
              type="tel"
              value={value}
              onChange={onChange}
              style={fieldStyle}
              {...props}
            />
          );
  
        case 'date':
          return (
            <FlatpickrWrapper
            label="Select Date"
            value={value}
            onChange={onChange}
            options={{ dateFormat: "Y-m-d" }}
          />
          );
  
        case 'date-time':
          return (
            <input
              type="datetime-local"
              value={value}
              onChange={onChange}
              style={fieldStyle}
              {...props}
            />
          );
  
        case 'time':
          return (
            <input
              type="time"
              value={value}
              onChange={onChange}
              style={fieldStyle}
              {...props}
            />
          );
  
        case 'date-range':
          return (
            <div style={fieldStyle}>
              <input
                type="date"
                value={value[0]}
                onChange={(e) => onChange([e.target["value"], value[1]])}
                {...props}
              />
              <input
                type="date"
                value={value[1]}
                onChange={(e) => onChange([value[0], e.target["value"]])}
                {...props}
              />
            </div>
          );
  
        case 'week':
          return (
            <input
              type="week"
              value={value}
              onChange={onChange}
              style={fieldStyle}
              {...props}
            />
          );
  
        case 'month':
          return (
            <input
              type="month"
              value={value}
              onChange={onChange}
              style={fieldStyle}
              {...props}
            />
          );
  
        case 'color':
          return (
            <input
              type="color"
              value={value}
              onChange={onChange}
              style={fieldStyle}
              {...props}
            />
          );
  
        case 'textarea':
          return (
            <textarea
              value={value}
              onChange={onChange}
              style={fieldStyle}
              {...props}
            />
          );
  
        case 'file-upload':
          return (
            <input
              type="file"
              onChange={onChange}
              style={fieldStyle}
              {...props}
            />
          );
  
        case 'rich-text':
          return (
            <div
              contentEditable
              dangerouslySetInnerHTML={{ __html: value }}
              onBlur={(e) => onChange(e.target.innerHTML)}
              style={fieldStyle}
              {...props}
            ></div>
          );
  
        case 'markdown':
          return (
            <textarea
              value={value}
              onChange={onChange}
              style={fieldStyle}
              {...props}
            />
          );
  
        case 'rating':
          return (
            <div style={fieldStyle}>
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => onChange(option.value)}
                  style={{
                    background: value === option.value ? 'yellow' : 'transparent',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          );
  
        default:
          return null;
      }
    };
  
    return <div>{renderField()}</div>;
  };


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
  

const DatesTest = () => {
  const [date, setDate] = useState(new Date());
  const [dateTime, setDateTime] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [range, setRange] = useState([null, null]);

  return (
    <div className="p-6">
      <FlatpickrWrapper
        label="Select Date & Time"
        value={dateTime}
        onChange={setDateTime}
        options={{ enableTime: true, dateFormat: "Y-m-d H:i" }}
      />

      <FlatpickrWrapper
        label="Select Time"
        value={time}
        onChange={setTime}
        options={{ enableTime: true, noCalendar: true, dateFormat: "H:i" }}
      />
      <FlatpickrWrapper
        label="Select Date Range"
        value={range["startDate"] && range["endDate"] ? [range["startDate"], range["endDate"]] : []}
        onChange={(selectedDates) => {
          if (selectedDates.length === 2) {
            // @ts-ignore
            setRange({ startDate: selectedDates[0], endDate: selectedDates[1] });
          } else {
            // @ts-ignore
            setRange({ startDate: selectedDates[0], endDate: null });
          }
        }}
        options={{ mode: "range", dateFormat: "Y-m-d" }}
      />
    </div>
  );
};

export default DatesTest;



  export {Field , PanelField , Row , Column, DatesTest};