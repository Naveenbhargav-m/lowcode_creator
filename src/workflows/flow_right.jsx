import { useState } from "preact/hooks";
import DynamicIcon from "../components/custom/dynamic_icon";
import { RecordsetList } from "../components/general/recordset_list";
import { generateUID } from "../utils/helpers";
import { activeWorkFlow, activeworkFlowBlock, workflow_datas } from "./workflow_state";
import { blocksRequirements } from "./blocks_requirements";
import { globalConfigs } from "../states/global_state";
import { TextAreaWithPopup } from "../form_builder/configs_view/advanced_form";
import { signal } from "@preact/signals";

export function MappingComponent() {
    const data = [{"id":generateUID(),"data":{"name":"Name", "value": "customers"}}, {"id":generateUID(),"data":{"name":"age", "value":24}}];
    function Onchange(data) {
        console.log("Onchange by recordsetlist data:",data);
    }
    return (
        <div>
            <RecordsetList initialRecords={data} onRecordsChange={Onchange} addButtonText="Add Field">
                <MapRowDynamic data={{}} recordId={""} onChange={(data) => {console.log("here is the onchild child:",data)} }/>
            </RecordsetList>
        </div>
    );
}

export function MapRow({ fieldName, value = "" }) {
    const [popup, setpopUp] = useState(false);
    function CloseCallBack() {
        setpopUp(false);
    }
    const rowStyle = { 
        display: "flex", 
        backgroundColor:"black",
        borderRadius:"20px",
        "margin":"10px 0px",
        flexDirection: "row", 
        alignItems: "center", // Centers everything vertically
        justifyContent: "center", // Centers everything horizontally
        gap: "10px" // Adds spacing between elements
    };

    const commonStyle = {
        borderRadius: "20px", 
        "marginTop":"10px",
        height: "40px", 
        width: "140px", 
        display: "flex", 
        alignItems: "center", // Centers vertically
        justifyContent: "center", // Centers horizontally
        textAlign: "center"
    };

    return (
        <div style={rowStyle}>
            <p style={{ ...commonStyle, width: "80px" }}>{fieldName}</p>
            <input 
                style={{ ...commonStyle, width: "140px" }} 
                type="text" 
                name="text" 
                placeholder="Text" 
                aria-label="Text"
            />
            <span style={{ display: "flex", "marginBottom":"10px",alignItems: "center", justifyContent: "center" , "padding":"0px 10px" }}
             onClick={(e) => {setpopUp(true);}}>
                <DynamicIcon name={"pipette"} size={20} />
            </span>
            <PopupFieldPicker isOpen={popup} closeCallBack={CloseCallBack}/>
        </div>
    );
}


export function FieldsDataAccordian() {
    const [isopen, setOpen] = useState(0);
    const tables = ["customers", "employees", "carts",];
    const fields = [["name", "age", "role", "salary"], ["capacity", "isBooked", "id"], ["check_in_time", "floor", "in_cart", "is_recuring"]];
    return (
        <div>
            {tables.map((table, ind) => {
                return (
                    <details open={isopen === ind}>
                        <summary>{table}</summary>
                        <div style={{padding:"20px"}}>
                        {fields[ind].map((field) => {
                            return (
                                <p>{field}</p>
                            );
                        })} 
                        </div>
                    </details>
                );
            })}
        </div>
    );
}
export function PopupFieldPicker({isOpen, closeCallBack}) {
    return (
        <dialog open={isOpen}>
        <article>
        <header>
            <button aria-label="Close" 
// @ts-ignore
            rel="prev" onClick={(e) => closeCallBack()}></button>
        </header>
          <FieldsDataAccordian />
        </article>
    </dialog>
    );
}

export function TablesDropDown() {
    return (
        <select name="favorite-cuisine" aria-label="Table" required>
            <option selected disabled value="">
                Select a table...
            </option>
            <option>Customers</option>
            <option>Employees</option>
            <option>Managers</option>
            <option>Carts</option>
            <option>orders</option>
            </select>
    );
}


export function MapRowDynamic({ data, onChange, recordId, showPicker = false }) {
    const [popup, setpopUp] = useState(false);
    function CloseCallBack() {
        setpopUp(false);
    }
    const rowStyle = { 
        display: "flex", 
        backgroundColor:"black",
        borderRadius:"20px",
        "margin":"4px 0px",
        flexDirection: "row", 
        alignItems: "center", // Centers everything vertically
        justifyContent: "center", // Centers everything horizontally
        gap: "10px" // Adds spacing between elements
    };

    const commonStyle = {
        borderRadius: "20px", 
        "marginTop":"10px",
        height: "40px", 
        width: "140px", 
        display: "flex", 
        alignItems: "center", // Centers vertically
        justifyContent: "center", // Centers horizontally
        textAlign: "center"
    };

    return (
        <div style={rowStyle}>
            <input 
            style={{ ...commonStyle, width: "130px", "color":"black","fontSize":'0.8em' }} 
            type="text" 
            name="key" 
            placeholder="Key:" 
            aria-label="Text"
            value={data["name"]} 
            onChange={(e) => {data["name"] = e.target.value; onChange( data)}}
            />
            <input 
                style={{ ...commonStyle, width: "130px", "color": "black", "fontSize":'0.8em' }} 
                type="text" 
                name="value" 
                value={data["value"]}
                onChange={(e) => {data["value"] = e.target.value; console.log("on change value:",data);onChange(data)}}
                placeholder="value:" 
                aria-label="Text"
            />
            {showPicker ?  
            <div>
                <span style={{ display: "flex", "marginBottom":"10px",alignItems: "center", justifyContent: "center" , "padding":"0px 10px" }}
                    onClick={(e) => {setpopUp(true);}}>
                        <DynamicIcon name={"pipette"} size={20} />
                </span>
                <PopupFieldPicker isOpen={popup} closeCallBack={CloseCallBack}/>
            </div> : <></>}
           
        </div>
    );
}
export function InsertRowComp() {
    return (
        <div >
            {/* <TablesDropDown />
            <MappingComponent  /> */}
            <WorkflowConfigBlock />
        </div>
    );
}


export function WorkflowConfigBlock() {
    let curblock = activeworkFlowBlock.value;
    console.log("current active workflow block:", curblock);
    if(curblock === undefined) {
        return <></>;
    }
    let id  = curblock["id"];
    let type = curblock["type"];
    if(id === undefined || type === undefined) {
        return <></>;
    }

    let config = blocksRequirements[type];
    if(config === undefined) {
        return <></>;
    }
    let temp = workflow_datas.value[activeWorkFlow.value["id"]] || {};
    let workflowdata = temp[id];
    let eleStyle ={"padding": "8px 0px"};
    let codeSig = signal("");


    function UpdateworkflowData(label , value) {
        workflowdata[label] = value;
        let existing = temp;
        existing[id] = workflowdata;
        workflow_datas.value[activeWorkFlow.value["id"]] = {...existing};
        localStorage.setItem("workflow_data", JSON.stringify(workflow_datas));
    }
    return (
        <div style={{"padding": "8px 0px"}}>
            {config["dependency"].map((value, ind) => {
                switch(value) {
                    case "code":
                        return (
                            <TextAreaWithPopup
                            key={id}
                            label={"code"}
                            configKey={"code"}
                            valueSignal={codeSig}
                            onChange={(data) => {
                                UpdateworkflowData(config["labels"][ind], codeSig.value);
                            }
                            }
                          />
                        );
                    case "dynamic_mapping":
                        return (
                            <div style={eleStyle}>
                            <RecordsetList onRecordsChange={(data) => 
                                {UpdateworkflowData(config["labels"][ind], data);
                                }}>
                                <MapRowDynamic data={{}} onChange={() => {}} recordId={""}/>
                            </RecordsetList>
                            </div>
                        );
                    case "table":
                        return (
                            <div style={eleStyle}>
                            <select
                                name="tables"
                                aria-label="Select your favorite cuisine..."
                                required
                                onChange={(e) => UpdateworkflowData(config["labels"][ind], e.target.value)}
                                >
                                <option selected disabled value="">
                                    Select a table...
                                </option>
                                {globalConfigs.value["tables"].map((table) => (
                                    <option key={table} value={table}>
                                    {table}
                                    </option>
                                ))}
                            </select>
                            </div>
                        )
                    case "base_url":
                        return (
                            <div style={eleStyle}>
                            <input type="url" name="url" placeholder="Url" aria-label="Base url" 
                            onChange={(e) => UpdateworkflowData(config["labels"][ind], e.target.value)}
                            />
                            </div>
                            );
                    case "http_method":
                        let methods = ["get", "post", "patch", "put", "delete"];
                        return(
                            <div style={eleStyle}>
                            <select name="http_method" aria-label="http_method..." required 
                            onChange={(e) => UpdateworkflowData(config["labels"][ind], e.target.value)}>
                        <option selected disabled value="">
                            Select a method
                        </option>
                        {methods.map((table) => {
                            return (
                                <option>
                                    {table}
                                </option>
                            );
                        })}
                    </select>
                    </div>
                        );
                    case "is_background":
                        return (
                            <div style={eleStyle}>
                            <fieldset>
                            <input type="checkbox" name="is_background" id={ind} aria-invalid="false"
                            onChange={(e) => UpdateworkflowData(config["labels"][ind], e.target.checked)}/>
                            <label htmlFor="is_background">is_background</label>
                            </fieldset>
                            </div>
                        );
                    default:
                        <>wrong dependency</>
                }
            })}
        </div>
    );
}


function FormCompMapper({type, onchange, params}) {

}