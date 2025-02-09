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

let defaultConfig =  {"style": {}, "value": "test", "onChange":(data) => {console.log("cahnged");}, "placeHolder":"chakra Field Here"};

let configs ={
  "textfield": defaultConfig,
  "switch":{...defaultConfig, "colorPalette":"green"},
  "checkbox": {...defaultConfig, value:true},
};
// Common field wrapper
const FieldWrapper = ({ children, config }) => {
  return <div style={config.style || {}}>{children}</div>;
};

// Form Components
const TextField = ({ config = {} }) => (
  <FieldWrapper config={config}>
    <Input placeholder={config.
// @ts-ignore
    placeholder || ""} defaultValue={config.value || ""} {...config} />
  </FieldWrapper>
);

const PasswordField = ({ config = {} }) => (
  <FieldWrapper config={config}>
    <PasswordInput 
// @ts-ignore
    placeholder={config.placeholder || ""} defaultValue={config.value || ""} {...config} />
  </FieldWrapper>
);

const SwitchElement = ({ config = {} }) => {
  console.log("config:",config);
  return (
    <FieldWrapper config={config}>
    <Switch 
// @ts-ignore
    checked={config.value || false} {...config} colorPalette={config["colorPalette"]} />
  </FieldWrapper>
  );
};

const CheckBoxElement = ({ config = {} }) => (
  <FieldWrapper config={config}>
    <Checkbox 
// @ts-ignore
    isChecked={config.value || false} onChange={config.onChange} {...config}>
      {config.
// @ts-ignore
      label}
    </Checkbox>
  </FieldWrapper>
);

const RadioGroupElement = ({ config = {} }) => (
  <FieldWrapper config={config}>
    <RadioGroup value={config.
// @ts-ignore
    value} onChange={config.onChange} {...config}>
      <Stack direction={config.
// @ts-ignore
      direction || "column"}>
        {config.
// @ts-ignore
        options?.map((option) => (
          <Radio key={option.value} 
// @ts-ignore
          value={option.value}>
            {option.label}
          </Radio>
        ))}
      </Stack>
    </RadioGroup>
  </FieldWrapper>
);

const SelectElement = ({ config = {} }) => (
  <FieldWrapper config={config}>
    <Select options={config.
// @ts-ignore
    options} placeholder={config.placeholder} {...config} />
  </FieldWrapper>
);

const MultiSelectElement = ({ config = {} }) => (
  <FieldWrapper config={config}>
    <Select isMulti options={config.
// @ts-ignore
    options} placeholder={config.placeholder} {...config} />
  </FieldWrapper>
);

const SliderElement = ({ config = {} }) => (
  <FieldWrapper config={config}>
    <Slider 
// @ts-ignore
    defaultValue={config.value || [40]} {...config} />
  </FieldWrapper>
);

const ColorElement = ({ config = {} }) => (
  <FieldWrapper config={config}>
    <ColorPickerRoot 
// @ts-ignore
    defaultValue={config.value || "#eb5e41"}>
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

const TextAreaElement = ({ config = {} }) => (
  <FieldWrapper config={config}>
    <Textarea placeholder={config.
// @ts-ignore
    placeholder || ""} defaultValue={config.value || ""} {...config} />
  </FieldWrapper>
);

const FileUploadElement = () => (
  <FileUploadRoot>
    <FileUploadLabel>Upload file</FileUploadLabel>
    <InputGroup 
// @ts-ignore
    startElement={<DynamicIcon name="upload" size={20} />} endElement={<FileUploadClearTrigger asChild><CloseButton size="xs" /></FileUploadClearTrigger>}>
      <FileInput />
    </InputGroup>
  </FileUploadRoot>
);

// @ts-ignore
const RatingElement = () => <Rating colorPalette="green" />;

const FlatpickrWrapper = ({ config = {} }) => (
  <FieldWrapper config={config}>
    <Flatpickr options={config.
// @ts-ignore
    options} value={config.value} onChange={config.onChange} className="p-2 border rounded" />
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

  const Component = fieldComponents[type] || (() => null);
  return <Component config={configs[type]} />;
};


export { Field, TextField, PasswordField, SwitchElement, CheckBoxElement, RadioGroupElement, SelectElement, MultiSelectElement, SliderElement, ColorElement, TextAreaElement, FileUploadElement, RatingElement, FlatpickrWrapper };
