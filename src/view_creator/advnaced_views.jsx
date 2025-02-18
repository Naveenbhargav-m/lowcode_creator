
import { signal } from "@preact/signals";
import { dbViewSignal } from "../table_builder/table_builder_state";
import { TablesTab } from "../table_builder/tables_page";
import { TablesButtonsBar } from "./buttonBar";


const command = signal("");
const RoundedTextarea = () => {

  return (
    <div style={{ display: "flex", height:"30%",flexDirection:"row",justifyContent:"space-between", padding:"30px",  gap: "8px" }}>
      <textarea
        value={command.value}
        onInput={(e) => {command.value = e.currentTarget.value}}
        placeholder="Type here..."
        style={{
          width: "80%",
          height: "100%",
          padding: "8px",
          borderRadius: "12px",
          border: "1px solid #ccc",

          resize: "none",
          fontSize: "14px",
        }}
      />
      <RunButton
        submitTitle={"Run"} ClearTitle={"clear"} 
      onSubmit={() => {console.log("command:",command.peek());}} 
      onClear={() => {command.value = "" }} />
    </div>
  );
};

export default RoundedTextarea;


function RunButton({submitTitle, ClearTitle , onSubmit, onClear}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <button
          onClick={() => onSubmit()}
          style={{
            padding: "10px 60px",
            borderRadius: "8px",
            border: "none",
            marginBottom:"20px",
            backgroundColor: "black",
            color: "white",
            cursor: "pointer",
          }}
        >
          {submitTitle}
        </button>
        <button
          onClick={() => onClear()}
          style={{
            padding: "6px 12px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#dc3545",
            color: "white",
            cursor: "pointer",
          }}
        >
          {ClearTitle}
        </button>
      </div>
    );
}

function AdvancedResult() {
    return (
        <div style={{
            backgroundColor: "white",
            border: "2px solid black", // Added black border
            borderRadius: "20px",
            height: "65%",
            width: "98%",
            margin: "20px 10px",
            color: "black", // Ensures text is visible on a black background
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            Result Area
        </div>
    );
}


function AdvancedView() {
    return (
            <div className="w-4/6 h-screen bg-background min-h-screen mx-4"
     style={{"display":"flex", "flexDirection":"column", "alignItems":"center"}}>
        <div style={{display:"flex", width:"90%", flexDirection:"row", paddingTop:"20px", justifyContent:"space-between", alignItems:"center", "alignSelf":"center"}}>
            <TablesTab onTableSelect={(tab) => dbViewSignal.value = tab}/>
        </div>
        <div style={{"backgroundColor":"white", borderRadius:"20px",height:"80%", width:"90%" ,marginTop:"30px" }}>
        <RoundedTextarea />
        <AdvancedResult />
       </div>
        </div>
    );
}

export {AdvancedView};