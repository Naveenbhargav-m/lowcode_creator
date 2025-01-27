

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
    case "text":
      return (
        <Text
          value={"Sample Text " + data.i}
          config={{...configObj}}
        />
      );
      
    case "number":
      return (
        <Number
          value={42}
          config={{...configObj}}
        />
      );

    case "text_area":
      return (
        <TextArea
          value="Sample Text Area"
          config={{...configObj}}

        />
      );

    case "progress_bar":
      return (
        <ProgressBar
          progress={50}
          config={{...configObj}}

        />
      );

    case "avatar":
      return (
        <Avatar
          src={url}
          config={{...configObj}}

        />
      );

    case "avatar_group":
      return (
        <AvatarGroup
          avatars={[
            { src: url, alt: "User1" },
            { src: url, alt: "User2" },
          ]}
          config={{...configObj}}
        />
      );

    case "drop_down":
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

    case "button":
      return (
        <Button
          value="Click Me"
          config={{...configObj}}

        />
      );

    case "image":
      return (
        <Image
          src={url}
          config={{...configObj}}

        />
      );

    case "badge":
      return (
        <Badge
          value="Badge"
          config={{...configObj}}

        />
      );

    case "icon":
      return (
        <Icon
          name="menu"
          config={{...configObj}}

        />
      );

    case "icon_button":
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
