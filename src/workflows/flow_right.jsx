import { useState } from "preact/hooks";
import DynamicIcon from "../components/custom/dynamic_icon";

function MappingComponent() {
    const data = ["name", "Age", "Role"];
    return (
        <div>
            {
                data.map((item) => {
                    return <MapRow fieldName={item}/>
                })
            }
        </div>
    );
}

function MapRow({ fieldName, value = "" }) {
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


function FieldsDataAccordian() {
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
function PopupFieldPicker({isOpen, closeCallBack}) {
    return (
        <dialog open={isOpen}>
        <article>
        <header>
            <button aria-label="Close" rel="prev" onClick={(e) => closeCallBack()}></button>
        </header>
          <FieldsDataAccordian />
        </article>
    </dialog>
    );
}

function TablesDropDown() {
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
function InsertRowComp() {
    return (
        <div >
            <TablesDropDown />
            <MappingComponent />
        </div>
    );
}
function FlowBuilderDrawer(props) {
    console.log("props:", props);
    return (
        <div style={{padding:"4px"}}><InsertRowComp /></div>
    );
}


export {FlowBuilderDrawer};