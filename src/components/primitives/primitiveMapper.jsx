

import { Text, Number, TextArea, ProgressBar, Avatar, AvatarGroup, Dropdown, Button, Image, Badge, Icon, IconButton } from "./primitivies";
import { CallbackExecutor } from "../../screen_builder/screen_state";

let url = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
// Function to map drop data to the correct primitive component

export const renderPrimitiveElement = (data) => {
  let configs = { ...data.configs };
  let configObj = {};
  for (let key of Object.keys(data)) {
    if (key === "configs") {
      continue;
    }
    configObj[key] = data[key];
  }
  configObj = { ...configObj, ...configs };
  
  if (!data || !data.title) {
    // Return a fallback UI or null if data is missing
    return <div>No element selected</div>;
  }

  switch (data.title) {
    case "Text":
      return (
        <Text
          value={"Sample Text " + data.i}
          config={{...configObj}}
        />
      );
      
    case "Number":
      return (
        <Number
          value={42}
          config={{...configObj}}
        />
      );

    case "Text Area":
      return (
        <TextArea
          value="Sample Text Area"
          config={{...configObj}}

        />
      );

    case "Progress Bar":
      return (
        <ProgressBar
          progress={50}
          config={{...configObj}}

        />
      );

    case "Avatar":
      return (
        <Avatar
          src={url}
          config={{...configObj}}

        />
      );

    case "Avatar Group":
      return (
        <AvatarGroup
          avatars={[
            { src: url, alt: "User1" },
            { src: url, alt: "User2" },
          ]}
          config={{...configObj}}
        />
      );

    case "Dropdown":
      return (
        <Dropdown
          value=""
          options={[
            { value: "1", label: "Option 1" },
            { value: "2", label: "Option 2" },
          ]}
          config={{...configObj}}
        />
      );

    case "Button":
      return (
        <Button
          value="Click Me"
          config={{...configObj}}

        />
      );

    case "Image":
      return (
        <Image
          src={url}
          config={{...configObj}}

        />
      );

    case "Badge":
      return (
        <Badge
          value="Badge"
          config={{...configObj}}

        />
      );

    case "Icon":
      return (
        <Icon
          name="menu"
          config={{...configObj}}

        />
      );

    case "Icon Button":
      return (
        <IconButton
          icon="mouse-pointer"
          config={{...configObj}}

        />
      );

    default:
      return null;
  }
};
