

import { Text, Number, TextArea, ProgressBar, Avatar, AvatarGroup, Dropdown, Button, Image, Badge, Icon, IconButton } from "./primitivies";
import { activeElement, CallbackExecutor } from "../../screen_builder/screen_state";

let url = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
// Function to map drop data to the correct primitive component


function ActiveWrapper({children, data}) {
  return (
        <div style={{display:"contents"}} onClick={(e) => {
          activeElement.value = data["id"];
          console.log("active element in primitive:",activeElement.value);
        }}>
          {children}
        </div>);
}
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
        <ActiveWrapper data={data}>
        <Text
          value={"Sample Text " + data.id}
          config={{...configObj}}
        />
        </ActiveWrapper>
      );
      
    case "number":
      return (
        <ActiveWrapper data={data}>
        <Number
          value={42}
          config={{...configObj}}
        />
        </ActiveWrapper>
      );

    case "text_area":
      return (
        <ActiveWrapper data={data}>
        <TextArea
          value="Sample Text Area"
          config={{...configObj}}

        />
        </ActiveWrapper>
      );

    case "progress_bar":
      return (
        <ActiveWrapper data={data}>
        <ProgressBar
          progress={50}
          config={{...configObj}}

        />
        </ActiveWrapper>
      );

    case "avatar":
      return (
        <ActiveWrapper data={data}>
        <Avatar
          src={url}
          config={{...configObj}}

        />
        </ActiveWrapper>
      );

    case "avatar_group":
      return (
        <ActiveWrapper data={data}>
        <AvatarGroup
          avatars={[
            { src: url, alt: "User1" },
            { src: url, alt: "User2" },
          ]}
          config={{...configObj, "value": [
            { src: url, alt: "User1" },
            { src: url, alt: "User2" },
          ]}}
        />
        </ActiveWrapper>
      );

    case "drop_down":
      return (
        <ActiveWrapper data={data}>
        <Dropdown
          value=""
          options={[
            { value: "1", label: "Option 1" },
            { value: "2", label: "Option 2" },
          ]}
          config={{...configObj}}
        />
        </ActiveWrapper>
      );

    case "button":
      return (
        <ActiveWrapper data={data}>
        <Button
          value="Click Me"
          config={{...configObj}}

        />
        </ActiveWrapper>
      );

    case "image":
      return (
        <ActiveWrapper data={data}>
        <Image
          src={url}
          config={{...configObj}}

        />
        </ActiveWrapper>
      );

    case "badge":
      return (
        <ActiveWrapper data={data}>
        <Badge
          value="Badge"
          config={{...configObj}}

        />
        </ActiveWrapper>
      );

    case "icon":
      return (
        <ActiveWrapper data={data}>
        <Icon
          name="menu"
          config={{...configObj}}

        />
        </ActiveWrapper>
      );

    case "icon_button":
      return (
        <ActiveWrapper data={data}>
        <IconButton
          icon="mouse-pointer"
          config={{...configObj}}

        />
        </ActiveWrapper>
      );

    default:
      return null;
  }
};
