import { Input, Stack, Textarea } from "@chakra-ui/react";
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
import { forwardRef } from "preact/compat";

let defaultConfig =  {"style": {}, "value": "test", "onChange":(data) => {console.log("cahnged");}, "placeHolder":"chakra Field Here"};

let configs ={
  "textfield": defaultConfig,
  "switch":{...defaultConfig, "colorPalette":"green"},
  "checkbox": {...defaultConfig, value:true},
};
// Common field wrapper
// Common Field Wrapper
const FieldWrapper = ({ children, config, onAction }) => {
  console.log("In Field Wrapper : children , config, onAction:", children, config, onAction);
  const handleEvent = (event) => {
    console.log("event :",event.type, event);
  };

  return (
    <div
      style={config.style || {}}
      onChange={handleEvent}
      onBlur={handleEvent}
      onFocus={handleEvent}
      onClick={handleEvent}
      onKeyDown={handleEvent}
    >
      {children}
    </div>
  );
};


// Form Components
const TextField = forwardRef(({ config = {}, onAction }, ref) => {
  return (
    <FieldWrapper config={config} onAction={onAction}>
      <Input
        ref={ref}
        placeholder={config.placeholder || ""}
        defaultValue={config.value || ""}
        style={{ ...config.style }}
      />
    </FieldWrapper>
  );
});

// Text Field
// Password Field
const PasswordField = forwardRef(({ config = {}, onAction }, ref) => (
  <FieldWrapper config={config} onAction={onAction}>
    <Input ref={ref} type="password" placeholder={config.placeholder || ""} defaultValue={config.value || ""} />
  </FieldWrapper>
));

// Switch Element
const SwitchElement = forwardRef(({ config = {}, onAction }, ref) => (
  <FieldWrapper config={config} onAction={onAction}>
    <Switch isChecked={config.value || false} style={config.style} colorPalette={config.color} />
  </FieldWrapper>
));

// Checkbox Element
const CheckBoxElement = ({ config = {}, onAction }) => (
  <FieldWrapper config={config} onAction={onAction}>
    <Checkbox isChecked={config.value || false}>{config.label}</Checkbox>
  </FieldWrapper>
);

// Radio Group
const RadioGroupElement = ({ config = {}, onAction }) => (
  <FieldWrapper config={config} onAction={onAction}>
    <Stack direction={config.direction || "column"}>
      {config.options?.map((option) => (
        <Radio key={option.value} value={option.value}>
          {option.label}
        </Radio>
      ))}
    </Stack>
  </FieldWrapper>
);

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

const Field = ({ type, config }) => {
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

  console.log("field Data:", config, type);

  const Component = fieldComponents[type] || (() => null);
  return <Component config={config} />;
};


export { Field, TextField, PasswordField, SwitchElement, CheckBoxElement, RadioGroupElement, SelectElement, MultiSelectElement, SliderElement, ColorElement, TextAreaElement, FileUploadElement, RatingElement, FlatpickrWrapper };
