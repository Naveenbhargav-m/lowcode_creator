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

// @ts-ignore
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
             // @ts-ignore
             onClick={(e) => {setpopUp(true);}}>
                <DynamicIcon name={"pipette"} size={20} />
            </span>
            <PopupFieldPicker isOpen={popup} closeCallBack={CloseCallBack}/>
        </div>
    );
}


export function FieldsDataAccordian() {
    // @ts-ignore
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


// @ts-ignore
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
        justifyContent: "space-between", // Centers everything horizontally
    };

    const commonStyle = {
        borderRadius: "20px", 
        height: "100%", 
        width: "140px", 
        display: "flex", 
        // alignItems: "center", // Centers vertically
        // justifyContent: "center", // Centers horizontally
        textAlign: "center"
    };

    return (
        <div style={rowStyle}>
            <input 
            style={{ ...commonStyle, width: "120px", "color":"black","fontSize":'0.8em', "marginBottom":"0px" }} 
            type="text" 
            name="key" 
            placeholder="Key:" 
            aria-label="Text"
            value={data["name"]} 
            // @ts-ignore
            onChange={(e) => {data["name"] = e.target.value; onChange( data)}}
            />
            <input 
                style={{ ...commonStyle, width: "160px", "color": "black", "fontSize":'0.8em',"marginBottom":"0px" }} 
                type="text" 
                name="value" 
                value={data["value"]}
                // @ts-ignore
                onChange={(e) => {data["value"] = e.target.value; console.log("on change value:",data);onChange(data)}}
                placeholder="value:" 
                aria-label="Text"
            />
            {showPicker ?  
            <div>
                <span style={{ display: "flex", "marginBottom":"10px",alignItems: "center", justifyContent: "center" , "padding":"0px 10px" }}
                    // @ts-ignore
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
    let activeWorkflowID = activeWorkFlow.value["id"];
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
    let temp = workflow_datas.value[activeWorkflowID] || {};
    console.log("workflows data:", workflow_datas.value);
    let workflowdata = temp[id] || {};
    console.log("workflowdata:", workflowdata);
    let eleStyle ={"padding": "8px 10px"};


    function UpdateworkflowData(label , value, type) {
        workflowdata[label] = {"value": value, "type": type};
        let existing = temp;
        existing[id] = workflowdata;
        let copy = workflow_datas.peek();
        existing["_change_type"] = "update";
        copy[activeWorkflowID] = {...existing}
        workflow_datas.value = {...copy};
        localStorage.setItem("workflow_data", JSON.stringify(workflow_datas));
    }
    return (
        <div style={{"padding": "8px 0px"}}>
            {config["inputs"].map((value, ind) => {
                let label = value["title"];
                let type = value["type"];
                let key = value["key"];
                let valuemap = workflowdata[key] || {};
                let value_data = valuemap["value"];
                switch(type) {
                    case "code":
                        let codeSig = signal(value_data);
                        return (
                            <div>
                            <div>
                            <label htmlFor={label}>{label}</label>
                            </div>
                            <TextAreaWithPopup
                            key={id}
                            label={label}
                            configKey={label}
                            valueSignal={codeSig}
                            // @ts-ignore
                            onChange={(data) => {
                                UpdateworkflowData(key, codeSig.value, "hardcoded");
                            }
                            }
                          />
                          </div>
                        );
                    case "map":
                        return (
                            <div style={eleStyle}>
                            <label htmlFor={label}>{label}</label>
                            <RecordsetList
                                initialRecords={value_data}
                                onRecordsChange={(data) => 
                                    {UpdateworkflowData(key, data, "hardcoded");
                                    }}>
                                <MapRowDynamic data={{}} onChange={() => {}} recordId={""} showPicker={true}/>
                            </RecordsetList>
                            </div>
                        );
                    case "select":
                        return (
                            <div style={eleStyle}>
                                  <div style={{"display": "flex", "flexDirection": "row","justifyContent": "space-between", "alignItems": "center", "width":"300px"}}>
                                    <label htmlFor={label}>{label}</label>
                                    <div style={{"display": "flex", "flexDirection": "row",width:"50px", "justifyContent": "space-between", "alignItems": "center"}}>
                                    <div style={{backgroundColor:"black", color:"white",margin:"5px", padding:"5px", borderRadius:"10px"}}>
                                    <DynamicIcon name={"pipette"} size={20}/>
                                    </div>
                                    <div style={{backgroundColor:"black", color:"white", padding:"5px",borderRadius:"10px"}}>
                                    <DynamicIcon name={"braces"} size={20}/>
                                    </div>
                                    </div>
                            </div>
                            <select
                                name="tables"
                                aria-label="Select your favorite cuisine..."
                                required
                                onChange={(e) => UpdateworkflowData(key, e.target.value, "hardcoded")}
                                >
                                <option selected={!value_data} disabled value="">
                                    Select a table...
                                </option>
                                {globalConfigs.value["tables"].map((table) => (
                                    <option selected={table === value_data} key={table} value={table}>
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
                            // @ts-ignore
                            onChange={(e) => UpdateworkflowData(label, e.target.value, "hardcoded")}
                            />
                            </div>
                            );
                    case "http_method":
                        let methods = ["get", "post", "patch", "put", "delete"];
                        return(
                            <div style={eleStyle}>
                            <select name="http_method" aria-label="http_method..." required 
                            // @ts-ignore
                            onChange={(e) => UpdateworkflowData(label, e.target.value)}>
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
                    case "toggle":
                        return (
                            <div style={eleStyle}>
                            <fieldset>
                            <div style={{"display": "flex", "flexDirection": "row","justifyContent": "space-between", "alignItems": "center", "width":"300px"}}>
                                    <label htmlFor={label}>{label}</label>
                                    <div style={{"display": "flex", "flexDirection": "row",width:"50px", "justifyContent": "space-between", "alignItems": "center"}}>
                                    <div style={{backgroundColor:"black", color:"white",margin:"5px", padding:"5px", borderRadius:"10px"}}>
                                    <DynamicIcon name={"pipette"} size={20}/>
                                    </div>
                                    <div style={{backgroundColor:"black", color:"white", padding:"5px",borderRadius:"10px"}}>
                                    <DynamicIcon name={"braces"} size={20}/>
                                    </div>
                                    </div>
                            </div>
                            <input checked={value_data === true} 
                            className="mr-2"
                            type="checkbox"
                             name={label} id={ind} aria-invalid="false"
                            // @ts-ignore
                            onChange={(e) => {UpdateworkflowData(key, e.target.checked, "hardcoded")}}/>
                            <label htmlFor={label}>{label}</label>
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