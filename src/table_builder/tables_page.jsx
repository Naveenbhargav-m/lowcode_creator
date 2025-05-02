import React, { useState } from "react";

import { dbViewSignal } from "./table_builder_state";
import { DatabaseViewManager} from "../view_creator/view_page";
import { DatabaseQueryRunner } from "../view_creator/advnaced_views";
import { globalStyle } from "../styles/globalStyle";
import TableBuilderV6 from "./table_builder";
import { TriggerManagementUI } from "../triggers/triggers_page";
import { useAuthCheck } from "../hooks/hooks";


function TablesTab({ onTableSelect , style={} , buttonStyle ={}}) {
  const [selectedTable, setSelectedTable] = useState(dbViewSignal.value);
  const tables = ["Tables", "Views", "Triggers", "Advanced"];

  const handleTableClick = (table) => {
    setSelectedTable(table);
    if (onTableSelect) {
      onTableSelect(table);
    }
  };

  return (
    <div style={{display:"flex", backgroundColor:"white", padding:"20px", fontSize:"0.8em", flexDirection:"row",...style}}>
        {tables.map((table) => (
          <div
            key={table}
            className={`p-2 cursor-pointer rounded-md ${selectedTable === table ? "bg-black text-white" : "bg-white text-black"}`}
            onClick={() => handleTableClick(table)}
            style={{...buttonStyle}}
          >
            {table}
            </div>
        ))}
    </div>
  );
}


function TablesPage() {
  useAuthCheck();
  return (
    <>
      {
      dbViewSignal.value == "Tables" ? <TableBuilderV6 /> : 
      dbViewSignal.value == "Views" ? <DatabaseViewManager /> :
      dbViewSignal.value == "Triggers" ? <TriggerManagementUI/> :
      <DatabaseQueryRunner />
      }
    </>
  );
}



export {TablesPage, TablesTab};
