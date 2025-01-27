// const updateElementPosition = (i, position) => {
//     console.log("bounds:",containerBounds);
//     let activeItem = screenElements[i];
//     activeItem.value.position = position;
//     activeItem.value["parent_container"] = {...containerBounds};
//     activeItem.value = {...activeItem.value};
//     localStorage.setItem("screen_config", JSON.stringify(screenElements));
//     let screenData = {
//       "configs":JSON.stringify(screenElements)
//     };
//     SetScreenToAPI(screenData,1);
  
//   };
  
//   const updateElementSize = (i, size) => {
//     console.log("bounds:",containerBounds);
  
//     let activeItem = screenElements[i];
//     activeItem.value.size = size;
//     activeItem.value["parent_container"] = {...containerBounds};
//     activeItem.value = {...activeItem.value};
//     localStorage.setItem("screen_config", JSON.stringify(screenElements));
//     let screenData = {
//       "configs":JSON.stringify(screenElements)
//     };
//     SetScreenToAPI(screenData,1);
//   };
  
  
//   function setContainerBounds(inp) {
//     console.log("height and width:",inp);
//     containerBounds.height = inp["height"];
//     containerBounds.width = inp["width"];
//     console.log("containe Bounds:",containerBounds);
//   }
  