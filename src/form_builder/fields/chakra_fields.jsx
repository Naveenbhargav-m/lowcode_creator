import { HStack, Input, Stack, Textarea } from "@chakra-ui/react";
import { PasswordInput } from "../../components/ui/password-input";
import { Switch } from "../../components/ui/switch";
import { Checkbox } from "../../components/ui/checkbox";
import { Radio, RadioGroup } from "../../components/ui/radio";
import Select from "react-select";
import { Slider } from "../../components/ui/slider";
import { CloseButton } from "../../components/ui/close-button";
// @ts-ignore
import { ColorPickerRoot, ColorPickerLabel, ColorPickerControl, ColorPickerInput, ColorPickerTrigger, ColorPickerContent, ColorPickerArea, ColorPickerEyeDropper, ColorPickerSliders } from "../../components/ui/color-picker";
import { FileInput, FileUploadClearTrigger, FileUploadLabel, FileUploadRoot } from "../../components/ui/file-upload";
import { InputGroup } from "../../components/ui/input-group";
import DynamicIcon from "../../components/custom/dynamic_icon";
import { Rating } from "../../components/ui/rating";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { forwardRef, useEffect, useState } from "preact/compat";
import { FunctionExecutor } from "../../states/common_actions";
import React from "preact/compat";

let defaultConfig =  {"style": {}, "value": "test", "onChange":(data) => {console.log("cahnged");}, "placeHolder":"chakra Field Here"};

let configs ={
  "textfield": defaultConfig,
  "switch":{...defaultConfig, "colorPalette":"green"},
  "checkbox": {...defaultConfig, value:true},
};

const FieldWrapper = ({ children, config, onAction }) => {

  const handleEvent = (event, key) => {
    if (key === "onKeyDown") {
      key = "onChange";
    }
    let eventCode = config[key];
    if (!eventCode || eventCode.length === 0) {
      return;
    }
    var resp = FunctionExecutor({}, eventCode);
    const id = config["id"];
    var valuedata = { [id]: event.target.value };
    onAction({ config: resp, value: valuedata });
  };

  console.log("rerendering:", config);
  return (
    <div
      style={config.style || {}}
      onBlur={(e) => handleEvent(e, "onBlur")}
      onFocus={(e) => handleEvent(e, "onFocus")}
      onClick={(e) => handleEvent(e, "onClick")}
      onKeyDown={(e) => handleEvent(e, "onKeyDown")}
      onMouseEnter={(e) => handleEvent(e, "onHover")}
    >
      {children}

    </div>
  );
};

// Form Component
function TextField({ config = {}, onAction}) {
  return (
      <Input
        placeholder={config["placeholder"] || ""}
        value={config["value"] || ""}
        style={{ ...config["style"] }}
        onBlur={(e) => onAction(e, "onBlur", config["value"])}
        onFocus={(e) => onAction(e, "onFocus",config["value"])}
        onClick={(e) => onAction(e, "onClick",config["value"])}
        onKeyDown={(e) => onAction(e, "onKeyDown",config["value"])}
        onMouseEnter={(e) => onAction(e, "onMouseEnter",config["value"])}
      />
  );
}


// Password Field
function PasswordField({ config = {}, onAction }){
    return (
    <Input type="password" 
    placeholder={config["placeholder"] || ""}
    value={config["value"] || ""}
    style={{ ...config["style"] }}
    onBlur={(e) => onAction(e, "onBlur", config["value"])}
    onFocus={(e) => onAction(e, "onFocus",config["value"])}
    onClick={(e) => onAction(e, "onClick",config["value"])}
    onKeyDown={(e) => onAction(e, "onKeyDown",config["value"])}
    onMouseEnter={(e) => onAction(e, "onMouseEnter",config["value"])}
     />
    );
}



function SwitchElement({ config = {}, onAction }) {

  // console.log("new switch value:", config["value"]);
  return (
    <Switch
      // @ts-ignore
      checked={config["value"]}
      onCheckedChange={(e) => {onAction(e,"onChange",config["value"])}}
      style={config["style"]}
      colorPalette={config["color"]}
    />
  );
}



function CheckBoxElement({ config = {}, onAction }) {
  console.log("called checkbox:",config);
  return (
    <div>
    <Checkbox 
    // @ts-ignore
    style={{"display":"flex","flexDirection":"row"}}
    colorPalette={"green"}
// @ts-ignore
    checked={config["value"]} 
    onCheckedChange={(e) => {onAction(e, "onChange",config["value"])}}>
      {config["label"]}
      </Checkbox>
      </div>
      );
}

// Radio Group
function RadioGroupElement({ config = {}, onAction }){
  console.log("radio group options:",config["options"]);
  return (
    <RadioGroup defaultValue="1" 
    colorPalette={"green"}
     onValueChange={(e) => {onAction(e, "onChange", e.value);}}>
        {config.
// @ts-ignore
        options?.map((option) => (
          <div style={{display:"flex", "flexDirection":"row"}}>
          <Radio 
// @ts-ignore
          style={{"display":"flex","flexDirection":"row"}} key={option.value} value={option.value} orientation="horizontal">
            {option.label}
          </Radio>
          </div>
        ))}
      </RadioGroup>
  );
}

// Select Element
const SelectElement = ({ config = {}, onAction }) => (
  <FieldWrapper config={config} onAction={onAction}>
    <Select options={config.options} placeholder={config.placeholder} />
  </FieldWrapper>
);

// Multi-Select Element
const MultiSelectElement = ({ config = {}, onAction }) => (
  <FieldWrapper config={config} onAction={onAction}>
    <Select isMulti options={config.options} placeholder={config.placeholder} />
  </FieldWrapper>
);

// Slider Element
const SliderElement = ({ config = {}, onAction }) => (
  <FieldWrapper config={config} onAction={onAction}>
    <Slider defaultValue={config.value || 40} />
  </FieldWrapper>
);

// Color Picker
const ColorElement = ({ config = {}, onAction }) => (
  <FieldWrapper config={config} onAction={onAction}>
    <ColorPickerRoot defaultValue={config.value || "#eb5e41"}>
      <ColorPickerLabel>Color</ColorPickerLabel>
      <ColorPickerControl>
        <ColorPickerInput />
        <ColorPickerTrigger />
      </ColorPickerControl>
      <ColorPickerContent>
        <ColorPickerArea />
        <ColorPickerSliders />
      </ColorPickerContent>
    </ColorPickerRoot>
  </FieldWrapper>
);

// Text Area
const TextAreaElement = forwardRef(({ config = {}, onAction }, ref) => (
  <FieldWrapper config={config} onAction={onAction}>
    <Textarea ref={ref} placeholder={config.placeholder || ""} defaultValue={config.value || ""} />
  </FieldWrapper>
));

// File Upload
const FileUploadElement = ({ onAction }) => (
  <FieldWrapper onAction={onAction}>
    <FileUploadRoot>
      <FileUploadLabel>Upload file</FileUploadLabel>
      <InputGroup
        startElement={<DynamicIcon name="upload" size={20} />}
        endElement={
          <FileUploadClearTrigger asChild>
            <CloseButton size="xs" />
          </FileUploadClearTrigger>
        }
      >
        <FileUploadInput />
      </InputGroup>
    </FileUploadRoot>
  </FieldWrapper>
);

// Rating Element
const RatingElement = ({ config = {} }) => <Rating colorPalette={config.color || "green"} />;

// Date Picker (Flatpickr)
const FlatpickrWrapper = ({ config = {}, onAction }) => (
  <FieldWrapper config={config} onAction={onAction}>
    <Flatpickr options={config.options} value={config.value} className="p-2 border rounded" />
  </FieldWrapper>
);

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
