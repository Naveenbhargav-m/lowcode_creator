import { Group, Input, InputAddon, Stack, HStack, parseColor , Textarea } from "@chakra-ui/react";
import { PasswordInput } from "../../components/ui/password-input";
import { Switch } from "../../components/ui/switch";
import { Checkbox } from "../../components/ui/checkbox";
import { Radio , RadioGroup} from "../../components/ui/radio";
import Select from "react-select";
import { Slider } from "../../components/ui/slider";
import { CloseButton } from "../../components/ui/close-button";

import {  ColorPickerArea,
  ColorPickerContent,
  ColorPickerControl,
  ColorPickerEyeDropper,
  ColorPickerInput,
  ColorPickerLabel,
  ColorPickerRoot,
  ColorPickerSliders,
  ColorPickerTrigger} from "../../components/ui/color-picker" ;
  import {
    FileInput,
    FileUploadClearTrigger,
    FileUploadLabel,
    FileUploadRoot,
  } from "../../components/ui/file-upload"
  import { InputGroup } from "../../components/ui/input-group"
import DynamicIcon from "../../components/custom/dynamic_icon";
import { Rating } from "../../components/ui/rating";
// @ts-ignore
export function TextField({ config = {}}) {
  // @ts-ignore
  const { value = "", style = {}, placeholder = "", ...rest } = config || {};
  return <Input style={style} placeholder={placeholder} defaultValue={value} {...rest} />;
}

// @ts-ignore
export function PasswordField({ config = {} }) {
  // @ts-ignore
  const { value = "", style = {}, placeholder = "", ...rest } = config || {};
  // @ts-ignore
  return <PasswordInput style={style} placeholder={placeholder} defaultValue={value} {...rest} />;
}

// @ts-ignore
export function SwitchElement({ config = {} }) {
  // @ts-ignore
  const { value = false, style = {}, ...rest } = config || {};
  // @ts-ignore
  return <Switch style={style} variant="raised" checked={value} {...rest} />;
}



// @ts-ignore
export function CheckBoxElement({ config = {} }) {
  // @ts-ignore
  const { value = false, style = {}, onChange, label = "", ...rest } = config || {};

  return (
    <Checkbox 
      // @ts-ignore
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

// @ts-ignore
export function RadioGroupElement({ config = {} }) {
  const {
    // @ts-ignore
    value = "",
    // @ts-ignore
    onChange,
    // @ts-ignore
    options = [],
    // @ts-ignore
    direction = "column",
    // @ts-ignore
    defaultValue,
    // @ts-ignore
    style = {},
    ...rest
  } = config || {};

  return (

    <RadioGroup value={value} onChange={onChange} defaultValue={defaultValue} {...rest}>
      <Stack direction={direction} style={{ ...style }}>
        {options.map((option) => (
          <Radio key={option.value} 
// @ts-ignore
          value={option.value} colorScheme="blue">
            {option.label}
          </Radio>
        ))}
      </Stack>
    </RadioGroup>
  );
}



// @ts-ignore
export function SelectElement({ config = {} }) {
  const {
    // @ts-ignore
    value = "",
    // @ts-ignore
    onChange,
    // @ts-ignore
    options = [],
    // @ts-ignore
    placeholder = "Select an option",
    // @ts-ignore
    defaultValue,
    // @ts-ignore
    style = {},
    ...rest
  } = config;

  return (
    <
// @ts-ignore
    Select 
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



// @ts-ignore
export function MultiSelectElement({ config = {} }) {
  const {
    // @ts-ignore
    value = [],
    // @ts-ignore
    onChange,
    // @ts-ignore
    options = [],
    // @ts-ignore
    placeholder = "Select options",
    // @ts-ignore
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



export function SliderElement({config = {value:false, style:{},onChange: () =>{}, label:""}}) {
  const { value = false, style = {}, onChange, label = "", ...rest } = config || {};
  return (
      // @ts-ignore
    <Slider label="Quantity" width="200px" colorPalette="green" defaultValue={[40]} />
  );

}


export function SliderRangeElement({config = {value:false, style:{},onChange: () =>{}, label:""}}) {
  const { value = false, style = {}, onChange, label = "", ...rest } = config || {};
  return (
      // @ts-ignore
    <Slider colorPalette="green" width="200px" defaultValue={[40, 80]} />
  );

}

export function UrlElement({config = {value:false, style:{},onChange: () =>{}, label:""}}) {
  const { value = false, style = {}, onChange, label = "", ...rest } = config || {};
  return (
      // @ts-ignore
      <Group attached>
      <InputAddon colorPalette="white" style={{backgroundColor:"white"}}>https://</InputAddon>
      <Input placeholder="Url..." />
    </Group>

  );

}


export function ColorElement({config = {value:false, style:{},onChange: () =>{}, label:""}}) {
  const { value = false, style = {}, onChange, label = "", ...rest } = config || {};
  return (
    <ColorPickerRoot 
// @ts-ignore
    defaultValue={parseColor("#eb5e41")} maxW="200px">
    <ColorPickerLabel>Color</ColorPickerLabel>
    <ColorPickerControl>
      <ColorPickerInput />
      <ColorPickerTrigger />
    </ColorPickerControl>
    <ColorPickerContent>
      <ColorPickerArea />
      <HStack>
        <ColorPickerEyeDropper />
        <ColorPickerSliders />
      </HStack>
    </ColorPickerContent>
  </ColorPickerRoot>
  );
}



export function TextAreaElement({config = {value:false, style:{},onChange: () =>{}, label:""}}) {
  const { value = false, style = {}, onChange, label = "", ...rest } = config || {};
  return (
    <Textarea placeholder={"textArea....."}/>
  );
}


export function FileUploadElement({}) {
  return (
    <FileUploadRoot gap="1" maxWidth="300px">
      <FileUploadLabel>Upload file</FileUploadLabel>
      <InputGroup
        w="full"
        startElement={<DynamicIcon name={"upload"} size={20}/>}
        endElement={
          <FileUploadClearTrigger asChild>
            <CloseButton
              me="-1"
              size="xs"
              variant="plain"
              focusVisibleRing="inside"
              focusRingWidth="2px"
              pointerEvents="auto"
              color="fg.subtle"
            />
          </FileUploadClearTrigger>
        }
      >
        <FileInput />
      </InputGroup>
    </FileUploadRoot>
  )

}


export function RatingElement() {
  return (
    <Rating colorPalette="green"/>
  );
}
