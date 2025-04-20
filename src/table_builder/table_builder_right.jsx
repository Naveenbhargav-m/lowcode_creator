import { activeField, activeTable, setTableField, tables } from "./table_builder_state";
import { containerConfigmaps } from "../components/configs/container_config_provider";
import { tablesConfigs } from "../components/configs/tables_configs_provider";
import DataQueryConfig from "../components/generic/config_form_components/dataConfig";

let tableConfig = {
  fields: [
    {
        id: 'label', 
        label: 'Table Name', 
        type: 'text',
        placeholder: 'select a table',
        dependsOn: null,
      },
  ],
};


let fieldConfig = {
  fields: [
    {
        id: 'name', 
        label: 'Field Name', 
        type: 'text',
        placeholder: 'Give a name',
        dependsOn: null,
      },
      {
        id: 'required', 
        label: 'Is Required', 
        type: 'check',
        placeholder: '',
        dependsOn: null,
      },
      {
        id: 'default', 
        label: 'Default Value', 
        type: 'text',
        placeholder: 'give a default value',
        dependsOn: null,
      },
  ],
};




function TableBuilderRight() {
      let activetable = activeTable.value;
      let activefield = activeField.value;
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

      function UpdateConfigBack(data) {
          setTableField(activeTable, activeField, data);
      }
      return (
        <div>
          <DataQueryConfig config={fieldConfig} initalData={{}} onUpdate={(data) => {UpdateConfigBack(data);}}/>
        </div>
      );
}

export default TableBuilderRight;