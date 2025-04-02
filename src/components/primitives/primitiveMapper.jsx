

import { Text, Number, TextArea, ProgressBar, Avatar, AvatarGroup, Dropdown, Button, Image, Badge, Icon, IconButton } from "./primitivies";


// Function to map drop data to the correct primitive component


function ActiveWrapper({data,activeSignal ,children }) {
  return (
        <div style={{display:"contents"}} onClick={(e) => {
          e.stopPropagation();
          activeSignal.value = data["id"];
        }}>
          {children}
        </div>);
}
export const renderPrimitiveElement = (data, activeSignal) => {
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
       <ActiveWrapper data={data} activeSignal={activeSignal}>
        <Text
          value={"Sample Text " + data.id}
          config={{...configObj}}
        />
      </ActiveWrapper>
      );
      
    case "number":
      return (
        <ActiveWrapper data={data} activeSignal={activeSignal}>
        <Number
          value={42}
          config={{...configObj}}
        />
        </ActiveWrapper>
      );

    case "text_area":
      return (
        <ActiveWrapper data={data} activeSignal={activeSignal}>
        <TextArea
          value="Sample Text Area"
          config={{...configObj}}

        />
        </ActiveWrapper>
      );

    case "progress_bar":
      return (
        <ActiveWrapper data={data} activeSignal={activeSignal}>
        <ProgressBar
          value={50}
          config={{...configObj}}

        />
        </ActiveWrapper>
      );

    case "avatar":
      return (
        <ActiveWrapper data={data} activeSignal={activeSignal}>
        <Avatar
          src={data}
          config={{...configObj}}

        />
        </ActiveWrapper>
      );

    case "avatar_group":
      return (
        <ActiveWrapper data={data} activeSignal={activeSignal}>
        <AvatarGroup
          avatars={[]}
          config={{...configObj}}
        />
        </ActiveWrapper>
      );

    case "drop_down":
      return (
        <ActiveWrapper data={data} activeSignal={activeSignal}>
        <Dropdown
          value=""
          config={{...configObj, "options":[
            { value: "1", label: "Option 1" },
            { value: "2", label: "Option 2" },
          ]}}
        />
        </ActiveWrapper>
      );

    case "button":
      return (
        <ActiveWrapper data={data} activeSignal={activeSignal}>
       <Button
          value="Click Me"
          config={{...configObj}}

        />
        </ActiveWrapper>
      );

    case "image":
      return (
        <ActiveWrapper data={data} activeSignal={activeSignal}>
        <Image
          src={data}
          config={{...configObj}}

        />
        </ActiveWrapper>
      );

    case "badge":
      return (
        <ActiveWrapper data={data} activeSignal={activeSignal}>
        <Badge
          value="Badge"
          config={{...configObj}}

        />
        </ActiveWrapper>
      );

    case "icon":
      return (
        <ActiveWrapper data={data} activeSignal={activeSignal}>
        <Icon
          name="menu"
          config={{...configObj}}

        />
        </ActiveWrapper>
      );

    case "icon_button":
      return (
        <ActiveWrapper data={data} activeSignal={activeSignal}>
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
