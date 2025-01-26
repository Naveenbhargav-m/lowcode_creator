
function ApplyEditOperations(config , orignalField) {
    if(config["name"] !== undefined || config["name"] !== "") {
      if(config["name"] !== orignalField["name"]) {
        config["old_name"] = orignalField["name"];
        config["operation"] = "edit";
      }
    }
    if(config["required"] !== true) {
      let originalRequired = orignalField["required"];
      console.log("originalRequired:", originalRequired);
      if(originalRequired !== undefined && originalRequired === true && (config["required"] === false ||config["required"] === undefined)) {
        console.log("adding drop required operation:",originalRequired);
        config["drop_required"] = true;
        config["operation"] = "edit";
      }
    }
    if(config["default"] === undefined) {
      let originalRequired = orignalField["default"];
      if(originalRequired !== undefined && originalRequired !== null && (config["required"] === undefined)) {
        config["drop_default"] = true;
        config["operation"] = "edit";
      }
    }
    console.log("config before returing:",config, orignalField);
    return config;

  }

  export {ApplyEditOperations};