import React, { useState } from "react";

import { dbViewSignal } from "./table_builder_state";
import { DatabaseViewManager} from "../view_creator/view_page";
import { DatabaseQueryRunner } from "../view_creator/advnaced_views";
import { globalStyle } from "../styles/globalStyle";
import TableBuilderV6 from "./table_builder";
import { TriggerManagementUI } from "../triggers/triggers_page";
import { useAuthCheck } from "../hooks/hooks";


function TablesButtonsBar({AddCallBack, SaveCallback}) {
  return (
    <div className="flex bg-white justify-end p-4" style={{fontSize:"0.8em", ...globalStyle}}>
    <button
    style={{fontSize:"0.9em",...globalStyle, "color":"white","backgroundColor":"black"}}
    onClick={AddCallBack}
    className="bg-secondary text-white px-4 py-2 rounded-md shadow-md hover:bg-primary"
  >
    <p>Add Table</p>
  </button>

  <button
  style={{fontSize:"0.9em",...globalStyle, "color":"white","backgroundColor":"black"}}
    onClick={(e) => SaveCallback()}
    className="bg-secondary text-white px-4 py-2 rounded-md shadow-md hover:bg-primary ml-4"
  >
    Save Changes
  </button>
  </div>
  );
} 

function TablesTab({ onTableSelect }) {
  const [selectedTable, setSelectedTable] = useState(dbViewSignal.value);
  const tables = ["Tables", "Views", "Triggers", "Advanced"];

  const handleTableClick = (table) => {
    setSelectedTable(table);
    if (onTableSelect) {
      onTableSelect(table);
    }
  };

  return (
    <div style={{display:"flex", backgroundColor:"white", padding:"20px", fontSize:"0.8em", flexDirection:"row", }}>
        {tables.map((table) => (
          <div
            key={table}
            className={`p-2 cursor-pointer rounded-md ${selectedTable === table ? "bg-black text-white" : "bg-white text-black"}`}
            onClick={() => handleTableClick(table)}
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
