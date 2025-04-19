import { activeField, activeTable, setTableField, tables } from "./table_builder_state";
import { containerConfigmaps } from "../components/configs/container_config_provider";
import { tablesConfigs } from "../components/configs/tables_configs_provider";

function TableBuilderRight() {
      let activetable = activeTable.value;
      let activefield = activeField.value;
      console.log("in right panel",activetable, activefield);
      let formData = {};
      let formConfigs = [...tablesConfigs.tables_field];
      if(activefield["type"] !== "Relation") {
        formConfigs.pop();
      } else {
        let tableids = Object.keys(tables);
        let labelsmap = tableids.map((id, ind) => {
          let tableField = tables[id].peek();
          return {"label":tableField["label"],"value":tableField["label"]}
        });
        formConfigs[formConfigs.length - 1]["options"] = labelsmap;
      }
      if(activefield["id"] === undefined) {
        
        let tableData = tables[activeTable.value];
        console.log("table Data:",tableData, tables, activeTable.value);
        if(tableData !== undefined) {
          let tableLabel = tableData.value["label"];
          formData["label"] = tableLabel;
        }

        formConfigs = [...tablesConfigs.table_config];
      } else {
          let fieldID = activeField.value["id"];
          let tableData = tables[activeTable.value];
          let fieldData = tableData.value["fields"][fieldID];
          console.log("right panel 2:", fieldID, fieldData, tableData, activeTable.value);
          if(fieldData === undefined || fieldData === null) {
          } else {
            formData["name"] = fieldData["name"];
            formData["required"] = fieldData["required"];
            formData["default"] = fieldData["default"];
          }

      }
      return (
        <div></div>
      );
}

export default TableBuilderRight;