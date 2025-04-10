import { useSignal } from "@preact/signals";
import { ScreensList } from "../screen_builder/screen_page";
import { GlobalSignalsPopup } from "../state_components/global_popup";
import { CreateFormButton } from "../template_builder/template_builder_view";
import QueryCreator from "./query_builder";
import { CreateQueryBlock } from "./query_functions";
import { ActiveQuery, QueryNames } from "./query_signal";
import { Pipette } from "lucide-react";
import { useState } from "preact/hooks";
import { SelectComponent } from "../components/general/general_components";

let headerStyle = { display:"flex", "flexDirection":"row", "justifyContent":"flex-start", "padding":"10px" };
let iconStyle  = {"padding":"8px",backgroundColor:"black", "color":"white", borderRadius:"10px"};

export function CreateQueryBar() {

  
    return (
        <div
        >
              <CreateFormButton
             formLabel={"New Query"} 
             placeHolder={"Query Name:"} 
             buttonLabel={"New +"} 
             callback={(data) => { CreateQueryBlock(data)}}/>
        </div>
    );
}


export function QueriesList() {
    return (
        <div>
        <CreateQueryBar />
        <ScreensList elementsList={QueryNames.value} signal={ActiveQuery} callBack={(newquery) => { console.log("new query:",newquery);}}/>
        </div>
    );
}


export function TablesView({prefilData}) {
    return (
        <div style={{height:"100vh", width:"80vw", display:"flex", "flexDirection":"column", "justifyContent":"center", }}>
            <div className="scrollable-div" style={{backgroundColor:"white", width:"80%", height:"80%",borderRadius:"20px",boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)"}}>
                <SelectBlock />
                <JoinBlock />
                <WhereBlock />
                <GroupByBlock />
                <OrderByBlock />
            </div>
        </div>
    );
}



function SelectBlock() {
    let isOpen = useSignal(false);
    const [selectedItems, setSelectedItems] = useState([]);
    
    // Handle removing a specific tag
    const removeTag = (itemToRemove) => {
        setSelectedItems(prev => prev.filter(item => item !== itemToRemove));
    };
    
    return (
        <div className="section">
            <BlocksHeader isOpen={isOpen} title={"Select Block"}/>
            <SelecList selectedItems={selectedItems} removeTag={removeTag}/>
            <GlobalSignalsPopup 
                isOpen={isOpen} 
                onChangeCallback={(e) => {}}
                closeCallback={(e, data) => {
                    console.log("closed :", data);
                    setSelectedItems(data);
                    isOpen.value = false;
                }}
            />
        </div>
    );
}

function JoinBlock() {
    let isOpen = useSignal(false);
    let popupField = useSignal("");
    let popupInd = useSignal(-1);
    const handlePopupClose = (e, data) => {
        if(data === undefined) {
            isOpen.value = false;
            return;
        }
        let last = data.pop();
        let key = popupField.value;
        let obj = {};
        obj[key] = last;
        UpdateJoinData(obj, popupInd.value);
        isOpen.value = false;
    };
    let buttonStyle = {backgroundColor:"black", "color": "white"};  
    function UpdateJoinData(obj, index) {
        console.log("object:",obj, index);
        var exisitng = joinsData.value;
        let cur = exisitng[index];
        cur = {...cur, ...obj};
        exisitng[index] = cur;
        joinsData.value = [...exisitng];
    }
    let joinsData = useSignal([]);
    return (
        <div className="section">
            <BlocksHeader isOpen={isOpen} title={"From-join Block"}/>
                {
                    joinsData.value.map((value, index) => {
                        return (
                            <div style={{"display":"flex", "flexDirection":"row", "justifyContent": "flex-start", "marginBottom":"8px"}}>
                            <SelectComponent 
                            options={["left join", "right join", "join", "inner join", "cross join"]}
                            onChange={(e,data) => {UpdateJoinData({"join": data["value"]}, index);}}
                            selected={value["join"] || "left join"}
                            style={{"width": "120px", "marginRight":"10px"}}
                            />
                            <button style={{...buttonStyle, "padding": "8px 10px", "marginRight":"10px"}}
                            onClick={(e) => {popupField.value = "first_field"; popupInd.value = index; isOpen.value = true}}
                            >
                                {value["first_field"] || "first_field"}</button>
                            <SelectComponent 
                            options={["equals", "less_than", "greater_than", "less_eq", "greater_eq"]}
                            onChange={(e,data) => {UpdateJoinData({"operator": data["value"]}, index);}}
                            selected={value["operator"] || "equals"}
                            style={{"width": "120px", "marginRight":"10px"}}
                            />
                             <button style={{...buttonStyle, "padding": "8px 10px", "marginRight":"10px"}}
                             onClick={(e) => {popupField.value = "second_field"; popupInd.value = index; isOpen.value = true}}
                             >{value["second_field"] || "Second_field"}</button>
                             </div>
                        );
                    })
                }
            <button style={{...buttonStyle, "padding": "8px 10px", "marginRight":"10px"}}
            onClick={(e)=> {let cur = joinsData.value; cur.push({}); joinsData.value = [...cur];}}
            >Add Join</button>
            <GlobalSignalsPopup 
                isOpen={isOpen} 
                onChangeCallback={(e) => {}}
                closeCallback={handlePopupClose}
            />
        </div>
    );
}

function WhereBlock() {
    let isOpen = useSignal(false);

    return (
        <div class="section">
        <BlocksHeader isOpen={isOpen} title={"Where Block"}/>
        <textarea placeholder="Enter filter conditions (e.g., status = 'active' AND created_at > '2023-01-01')"></textarea>
        <GlobalSignalsPopup isOpen={isOpen} 
              onChangeCallback={(e) => {}}
             closeCallback={(e,data) => {console.log("closed :",data); isOpen.value = false}}/>
        </div>
    );
}
function GroupByBlock() {
    let isOpen = useSignal(false);

    return (
        <div class="section">
        <BlocksHeader isOpen={isOpen} title={"Group By Block"}/>
        <textarea placeholder="Enter grouping columns (e.g., department, status)"></textarea>
        <GlobalSignalsPopup isOpen={isOpen} 
              onChangeCallback={(e) => {}}
             closeCallback={(e,data) => {console.log("closed :",data); isOpen.value = false}}/>
        </div>
    );
}
function OrderByBlock() {
    let isOpen = useSignal(false);
    return (
        <div className="section">
            <BlocksHeader isOpen={isOpen} title={"Order By block"}/>
            <textarea placeholder="Enter sorting columns (e.g., created_at DESC, name ASC)"></textarea>
            <GlobalSignalsPopup isOpen={isOpen} 
              onChangeCallback={(e) => {}}
             closeCallback={(e,data) => {console.log("closed :",data); isOpen.value = false}}/>
        </div>
    );
}

function BlocksHeader({isOpen, title}) {
    return (
        <div style={headerStyle}>
        <p style={{width:"200px",marginRight:"50px"}}>{title}</p>
        <Pipette onClick={(e) => {isOpen.value = true}} 
        height={14} width={14} 
        style={iconStyle}
        />
    </div>
    );
}


function SelecList({selectedItems, removeTag}) {
    return (
        <div className="p-3 border rounded min-h-12 flex flex-wrap gap-2">
        {selectedItems.length === 0 ? (
            <div className="text-gray-400">Click to select columns (e.g., id, name, email)</div>
        ) : (
            selectedItems.map((item, index) => (
                <div key={index} className="px-2 py-1 rounded-md flex items-center text-sm" 
                style={{backgroundColor:"black", "color":"white","padding":"4px", borderRadius:"10px", "fontSize":"0.6em"}}
                >
                    <span >{item}</span>
                    <button 
                        className=""
                        style={{"backgroundColor": "black" , "padding":"4px 8px"}} 
                        onClick={() => removeTag(item)}
                    >
                        ×
                    </button>
                </div>
            ))
        )}
    </div>            
    );
}