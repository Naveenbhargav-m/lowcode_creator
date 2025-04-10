import { useSignal } from "@preact/signals";
import { ScreensList } from "../screen_builder/screen_page";
import { GlobalSignalsPopup } from "../state_components/global_popup";
import { CreateFormButton } from "../template_builder/template_builder_view";
import QueryCreator from "./query_builder";
import { CreateQueryBlock } from "./query_functions";
import { ActiveQuery, QueryNames } from "./query_signal";
import { Pipette } from "lucide-react";

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
    return (
        <div class="section">
        <BlocksHeader isOpen={isOpen} title={"Select Block"}/>
        <textarea placeholder="Enter columns to select (e.g., id, name, email)"></textarea>
        <GlobalSignalsPopup isOpen={isOpen} 
              onChangeCallback={(e) => {}}
             closeCallback={(e,data) => {console.log("closed :",data); isOpen.value = false}}/>
        </div>
    );
}

function JoinBlock() {
    let isOpen = useSignal(false);
    return (
        <div class="section">
        <BlocksHeader isOpen={isOpen} title={"From-join Block"}/>
        <textarea placeholder="Enter table(s) and join conditions (e.g., users LEFT JOIN orders ON users.id = orders.user_id)"></textarea>
        <GlobalSignalsPopup isOpen={isOpen} 
              onChangeCallback={(e) => {}}
             closeCallback={(e,data) => {console.log("closed :",data); isOpen.value = false}}/>
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