import { useSignal } from "@preact/signals";
// @ts-ignore
import { GlobalSignalsPopup } from "../state_components/global_popup";
import { CreateFormButton } from "../template_builder/template_builder_view";
import { ActiveQueryData, CreateQueryBlock, UpdateQueryPart } from "./query_signal";
import { Pipette } from "lucide-react";
// @ts-ignore
import { useEffect, useState } from "preact/hooks";
import { SelectComponent } from "../components/general/general_components";
import { fieldsGlobalSignals } from "../states/common_repo";
// @ts-ignore


let headerStyle = { display:"flex", "flexDirection":"row", "justifyContent":"flex-start", "padding":"10px" };
let iconStyle  = {"padding":"8px",backgroundColor:"black", "color":"white", borderRadius:"10px"};

let fields = fieldsGlobalSignals.value;  

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





// @ts-ignore
export function TablesView({prefilData}) {

    let activeQuery = ActiveQueryData.value;

    if(activeQuery["id"] === undefined) {
        return <div> Select a Query</div>
    }
    console.log("active Query:",activeQuery);
    return (
        <div style={{height:"100vh", width:"80vw", display:"flex", "flexDirection":"column", "justifyContent":"center", }}>
            <div className="scrollable-div" style={{backgroundColor:"white", width:"80%", height:"80%",borderRadius:"20px",boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)"}}>
                <SelectBlock select={activeQuery["select_fields"]}
                 Aggregations={activeQuery["select_aggregate_fields"]}
                 updateCallBack={UpdateQueryPart}
                  />
                <JoinBlock />
                <WhereBlock />
                <GroupByBlock />
                <OrderByBlock />
            </div>
        </div>
    );
}




function JoinBlock() {
    let isOpen = useSignal(false);
    let popupField = useSignal("");
    let popupInd = useSignal(-1);
    // @ts-ignore
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
                            // @ts-ignore
                            onChange={(e,data) => {UpdateJoinData({"join": data["value"]}, index);}}
                            selected={value["join"] || "left join"}
                            style={{"width": "120px", "marginRight":"10px"}}
                            />
                            <button style={{...buttonStyle, "padding": "8px 10px", "marginRight":"10px"}}
                            // @ts-ignore
                            onClick={(e) => {popupField.value = "first_field"; popupInd.value = index; isOpen.value = true}}
                            >
                                {value["first_field"] || "first_field"}</button>
                            <SelectComponent 
                            options={["equals", "less_than", "greater_than", "less_eq", "greater_eq"]}
                            // @ts-ignore
                            onChange={(e,data) => {UpdateJoinData({"operator": data["value"]}, index);}}
                            selected={value["operator"] || "equals"}
                            style={{"width": "120px", "marginRight":"10px"}}
                            />
                             <button style={{...buttonStyle, "padding": "8px 10px", "marginRight":"10px"}}
                             // @ts-ignore
                             onClick={(e) => {popupField.value = "second_field"; popupInd.value = index; isOpen.value = true}}
                             >{value["second_field"] || "Second_field"}</button>
                             </div>
                        );
                    })
                }
            <button style={{...buttonStyle, "padding": "8px 10px", "marginRight":"10px"}}
            // @ts-ignore
            onClick={(e)=> {let cur = joinsData.value; cur.push({}); joinsData.value = [...cur];}}
            >Add Join</button>
            <GlobalSignalsPopup 
                isOpen={isOpen} 
                fields={fields}
                closeCallback={handlePopupClose}
            />
        </div>
    );
}

// function WhereBlock() {
//     let isOpen = useSignal(false);

//     return (
//         <div class="section">
//         <BlocksHeader isOpen={isOpen} title={"Where Block"}/>
//         <textarea placeholder="Enter filter conditions (e.g., status = 'active' AND created_at > '2023-01-01')"></textarea>
//         <GlobalSignalsPopup isOpen={isOpen} 
//               onChangeCallback={(e) => {}}
//              closeCallback={(e,data) => {console.log("closed :",data); isOpen.value = false}}/>
//         </div>
//     );
// }



function WhereBlock() {
    let isOpen = useSignal(false);
    let popupField = useSignal("");
    let popupInd = useSignal(-1);
    let popupGroupId = useSignal(null);
    let buttonStyle = {backgroundColor:"black", "color": "white"};
    
    // @ts-ignore
    const handlePopupClose = (e, data) => {
        if(data === undefined) {
            isOpen.value = false;
            return;
        }
        let last = data.pop();
        let key = popupField.value;
        let obj = {};
        obj[key] = last;
        
        if (popupGroupId.value !== null) {
            // Update within a group
            updateGroupCondition(obj, popupInd.value, popupGroupId.value);
        } else {
            // Update main conditions
            updateWhereData(obj, popupInd.value);
        }
        
        isOpen.value = false;
    };
    
    function updateWhereData(obj, index) {
        console.log("object:", obj, index);
        var existing = whereData.value;
        let cur = existing[index];
        cur = {...cur, ...obj};
        existing[index] = cur;
        whereData.value = [...existing];
    }
    
    function updateGroupCondition(obj, conditionIndex, groupId) {
        console.log("updating group condition:", obj, conditionIndex, groupId);
        let currentGroups = groups.value;
        const groupIndex = currentGroups.findIndex(g => g.id === groupId);
        
        if (groupIndex !== -1) {
            let groupConditions = currentGroups[groupIndex].conditions;
            groupConditions[conditionIndex] = {...groupConditions[conditionIndex], ...obj};
            currentGroups[groupIndex].conditions = [...groupConditions];
            groups.value = [...currentGroups];
        }
    }
    
    let whereData = useSignal([]);
    let groups = useSignal([]);
    let nextGroupId = useSignal(0);
    
    // Creates a new group of conditions
    function addGroup() {
        let currentGroups = groups.value;
        const groupId = nextGroupId.value;
        nextGroupId.value += 1;
        
        currentGroups.push({
            id: groupId,
            logical: "AND", // Default logical operator for the group
            conditions: [{}] // Start with one empty condition
        });
        
        groups.value = [...currentGroups];
    }
    
    // Adds a condition to a specific group or to the main conditions
    function addCondition(groupId = null) {
        if (groupId !== null) {
            // Add to a specific group
            let currentGroups = [...groups.value];
            const groupIndex = currentGroups.findIndex(g => g.id === groupId);
            
            if (groupIndex !== -1) {
                currentGroups[groupIndex].conditions.push({});
                groups.value = currentGroups;
            }
        } else {
            // Add to main conditions
            let current = whereData.value;
            current.push({});
            whereData.value = [...current];
        }
    }
    
    // Renders a condition with field, operator, and value inputs
    function renderCondition(condition, index, groupId = null) {
        return (
            <div key={groupId ? `group-${groupId}-condition-${index}` : `condition-${index}`} 
                 style={{"display":"flex", "flexDirection":"row", "justifyContent": "flex-start", "marginBottom":"8px", "alignItems": "center"}}>
                
                {index > 0 && (
                    <SelectComponent 
                        options={["AND", "OR"]}
                        // @ts-ignore
                        onChange={(e,data) => {
                            if (groupId !== null) {
                                updateGroupCondition({"logical": data["value"]}, index, groupId);
                            } else {
                                updateWhereData({"logical": data["value"]}, index);
                            }
                        }}
                        selected={condition["logical"] || "AND"}
                        style={{"width": "80px", "marginRight":"10px"}}
                    />
                )}
                
                <button style={{...buttonStyle, "padding": "8px 10px", "marginRight":"10px"}}
                        // @ts-ignore
                        onClick={(e) => {
                            popupField.value = "field";
                            popupInd.value = index;
                            popupGroupId.value = groupId;
                            isOpen.value = true;
                        }}>
                    {condition["field"] || "field"}
                </button>
                
                <SelectComponent 
                    options={["equals", "not_equals", "less_than", "greater_than", "less_eq", "greater_eq", "like", "in", "not_in"]}
                    // @ts-ignore
                    onChange={(e,data) => {
                        if (groupId !== null) {
                            updateGroupCondition({"operator": data["value"]}, index, groupId);
                        } else {
                            updateWhereData({"operator": data["value"]}, index);
                        }
                    }}
                    selected={condition["operator"] || "equals"}
                    style={{"width": "120px", "marginRight":"10px"}}
                />
                
                <button style={{...buttonStyle, "padding": "8px 10px"}}
                        // @ts-ignore
                        onClick={(e) => {
                            popupField.value = "value";
                            popupInd.value = index;
                            popupGroupId.value = groupId;
                            isOpen.value = true;
                        }}>
                    {condition["value"] || "value"}
                </button>
            </div>
        );
    }
    
    // Renders a group of conditions
    function renderGroup(group) {
        return (
            <div key={`group-${group.id}`} 
                 style={{"border": "1px solid #ccc", "padding": "10px", "marginBottom": "10px", "borderRadius": "5px"}}>
                
                <div style={{"display":"flex", "justifyContent": "space-between", "marginBottom": "10px", "alignItems": "center"}}>
                    <span style={{"fontWeight": "bold"}}>Condition Group</span>
                    <SelectComponent 
                        options={["AND", "OR"]}
                        // @ts-ignore
                        onChange={(e,data) => {
                            let currentGroups = [...groups.value];
                            const groupIndex = currentGroups.findIndex(g => g.id === group.id);
                            if (groupIndex !== -1) {
                                currentGroups[groupIndex].logical = data["value"];
                                groups.value = currentGroups;
                            }
                        }}
                        selected={group.logical || "AND"}
                        style={{"width": "80px"}}
                    />
                </div>
                
                {group.conditions.map((condition, index) => 
                    renderCondition(condition, index, group.id)
                )}
                
                <button style={{...buttonStyle, "padding": "8px 10px", "marginTop": "10px"}}
                        onClick={() => addCondition(group.id)}>
                    Add Condition to Group
                </button>
            </div>
        );
    }

    return (
        <div className="section">
            <BlocksHeader isOpen={isOpen} title={"Where Block"}/>
            
            {/* Main conditions */}
            {whereData.value.length > 0 && whereData.value.map((condition, index) => 
                renderCondition(condition, index)
            )}
            
            {/* Condition groups */}
            {groups.value.length > 0 && groups.value.map(group => 
                renderGroup(group)
            )}
            
            <div style={{"display":"flex", "marginTop": "10px"}}>
                <button style={{...buttonStyle, "padding": "8px 10px", "marginRight":"10px"}}
                        onClick={() => {
                            if (whereData.value.length === 0) {
                                // If no conditions yet, add an empty one
                                whereData.value = [{}];
                            } else {
                                // Otherwise add another one
                                addCondition();
                            }
                        }}>
                    Add Condition
                </button>
                
                <button style={{...buttonStyle, "padding": "8px 10px"}}
                        onClick={addGroup}>
                    Add Group
                </button>
            </div>
            
            <GlobalSignalsPopup 
                isOpen={isOpen} 
                fields={fields}
                closeCallback={handlePopupClose}
            />
        </div>
    );
}

function GroupByBlock() {
    let isOpen = useSignal(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [aggregations, setAggregations] = useState([]);
    
    // Handle removing a specific tag
    const removeTag = (itemToRemove) => {
        setSelectedItems(prev => prev.filter(item => item !== itemToRemove));
        // Also remove any aggregation settings for this item
        setAggregations(prev => prev.filter(agg => agg.original_name !== itemToRemove));
    };
    return (
        <div className="section">
            <BlocksHeader isOpen={isOpen} title={"Group By"}/>
            <SelectList selectedItems={selectedItems} removeTag={removeTag} aggregations={aggregations} setAggregations={setAggregations}/>
            <GlobalSignalsPopup 
                isOpen={isOpen} 
                fields={fields}
                // @ts-ignore
                closeCallback={(e, data) => {
                    console.log("closed :", data);
                    setSelectedItems(data);
                    isOpen.value = false;
                }}
            />
        </div>
    );
}
function OrderByBlock() {
    let isOpen = useSignal(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [aggregations, setAggregations] = useState([]);
    
    // Handle removing a specific tag
    const removeTag = (itemToRemove) => {
        setSelectedItems(prev => prev.filter(item => item !== itemToRemove));
        // Also remove any aggregation settings for this item
        setAggregations(prev => prev.filter(agg => agg.original_name !== itemToRemove));
    };
    
    return (
        <div className="section">
            <BlocksHeader isOpen={isOpen} title={"Order By"}/>
            <SelectList selectedItems={selectedItems} removeTag={removeTag} aggregations={aggregations} setAggregations={setAggregations}/>
            <GlobalSignalsPopup 
                isOpen={isOpen} 
                fields={fields}
                // @ts-ignore
                closeCallback={(e, data) => {
                    console.log("closed :", data);
                    setSelectedItems(data);
                    isOpen.value = false;
                }}
            />
        </div>
    );
}

function BlocksHeader({isOpen, title}) {
    return (
        <div style={headerStyle}>
        <p style={{width:"200px",marginRight:"50px"}}>{title}</p>
        <Pipette onClick={(
// @ts-ignore
        e) => {isOpen.value = true}} 
        height={14} width={14} 
        style={iconStyle}
        />
    </div>
    );
}


function SelectBlock({select, Aggregations, updateCallBack}) {
    let keys = ["select_fields", "select_aggregate_fields"];
    let isOpen = useSignal(false);
    const [selectedItems, setSelectedItems] = useState([...select]);
    // Store aggregation settings in an array of objects
    const [aggregations, setAggregations] = useState([...Aggregations]);
    console.log("select and aggrs:",selectedItems, aggregations);
    // Handle removing a specific tag
    const removeTag = (itemToRemove) => {
        setSelectedItems(prev => prev.filter(item => item !== itemToRemove));
        // Also remove any aggregation settings for this item
        setAggregations(prev => prev.filter(agg => agg.original_name !== itemToRemove));
        updateCallBack(keys[0], selectedItems);
        updateCallBack(keys[1], aggregations);
    };
    
    function setAggrs(updatedAggrs) {
        setAggregations(updatedAggrs);
        updateCallBack(keys[1], updatedAggrs);
    }
    return (
        <div className="section">
            <BlocksHeader isOpen={isOpen} title={"Select Block"}/>
            <SelectList 
                selectedItems={selectedItems} 
                removeTag={removeTag}
                aggregations={aggregations}
                setAggregations={setAggrs}
            />
            <GlobalSignalsPopup 
                isOpen={isOpen} 
                fields={fields}
                // @ts-ignore
                closeCallback={(e, data) => {
                    console.log("closed :", data);
                    setSelectedItems(data);
                    updateCallBack(keys[0], data);
                    isOpen.value = false;
                }}
            />
        </div>
    );
}

// SelectList component - main container
function SelectList({ selectedItems, removeTag, aggregations, setAggregations }) {
    const [popupState, setPopupState] = useState({
        isOpen: false,
        item: null,
        position: { top: 0, left: 0 }
    });
    
    // Handler for closing the popup when clicking outside
    useClickOutside(() => {
        if (popupState.isOpen) {
            setPopupState(prev => ({ ...prev, isOpen: false }));
        }
    }, 'aggregation-popup');
    
    const handleItemClick = (item, event) => {
        // Get position of the clicked element
        const rect = event.currentTarget.getBoundingClientRect();
        
        setPopupState({
            isOpen: true,
            item: item,
            position: { top: rect.bottom + window.scrollY, left: rect.left + window.scrollX }
        });
    };
    
    return (
        <div className="p-3 border rounded min-h-12 flex flex-wrap gap-2">
            {selectedItems.length === 0 ? (
                <EmptyState />
            ) : (
                <>
                    <TagList 
                        selectedItems={selectedItems}
                        removeTag={removeTag}
                        aggregations={aggregations}
                        handleItemClick={handleItemClick}
                    />
                    
                    {popupState.isOpen && (
                        <AggregationPopup 
                            position={popupState.position}
                            item={popupState.item}
                            aggregations={aggregations} 
                            setAggregations={setAggregations}
                            onClose={() => setPopupState(prev => ({ ...prev, isOpen: false }))}
                        />
                    )}
                </>
            )}
        </div>            
    );
}

// Empty state component
function EmptyState() {
    return (
        <div className="text-gray-400">Click to select columns (e.g., id, name, email)</div>
    );
}

// Tags list component
function TagList({ selectedItems, removeTag, aggregations, handleItemClick }) {
    return selectedItems.map((item, index) => (
        <TagItem 
            key={index}
            item={item}
            aggregation={getAggregationForItem(item, aggregations)}
            removeTag={removeTag}
            onClick={handleItemClick}
        />
    ));
}

// Single tag item component
function TagItem({ item, aggregation, removeTag, onClick }) {
    const displayText = formatDisplayText(item, aggregation);
    
    return (
        <div 
            className="px-2 py-1 rounded-md flex items-center text-sm cursor-pointer" 
            style={{
                backgroundColor: "black", 
                color: "white",
                padding: "4px", 
                borderRadius: "10px", 
                fontSize: "0.6em"
            }}
            onClick={(e) => onClick(item, e)}
        >
            <span>{displayText}</span>
            <RemoveButton onClick={(e) => {
                e.stopPropagation();
                removeTag(item);
            }} />
        </div>
    );
}

// Remove button component
function RemoveButton({ onClick }) {
    return (
        <button 
            className="ml-1"
            style={{ backgroundColor: "black", padding: "4px 8px" }} 
            onClick={onClick}
        >
            ×
        </button>
    );
}

// The popup component
function AggregationPopup({ position, item, aggregations, setAggregations, onClose }) {
    const existingAgg = getAggregationForItem(item, aggregations);
    
    const [aggFunction, setAggFunction] = useState(existingAgg.function);
    const [alias, setAlias] = useState(existingAgg.alias);
    
    const aggregationFunctions = ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'DISTINCT'];
    
    const handleSave = () => {
        saveAggregation(item, aggFunction, alias, aggregations, setAggregations);
        onClose();
    };
    
    const handleClear = () => {
        clearAggregation(item, aggregations, setAggregations);
        onClose();
    };
    
    return (
        <div 
            id="aggregation-popup"
            className="absolute bg-white border shadow-lg rounded p-3 w-64 z-50"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`
            }}
        >
            <PopupHeader item={item} />
            <FunctionSelector 
                value={aggFunction}
                onChange={setAggFunction}
                options={aggregationFunctions}
            />
            <AliasInput 
                value={alias}
                onChange={setAlias}
            />
            <PopupFooter 
                onClear={handleClear}
                onSave={handleSave}
            />
        </div>
    );
}

// Popup header component
function PopupHeader({ item }) {
    return <div className="font-medium mb-2">Configure {item}</div>;
}

// Function selector component
function FunctionSelector({ value, onChange, options }) {
    return (
        <div className="mb-2">
            <label className="block text-sm text-gray-600 mb-1">Aggregation Function</label>
            <select 
                className="w-full border rounded p-1 text-sm"
                value={value}
                // @ts-ignore
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">None</option>
                {options.map(func => (
                    <option key={func} value={func}>{func}</option>
                ))}
            </select>
        </div>
    );
}

// Alias input component
function AliasInput({ value, onChange }) {
    return (
        <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1">Alias</label>
            <input 
                type="text" 
                className="w-full border rounded p-1 text-sm"
                value={value}
                // @ts-ignore
                onChange={(e) => onChange(e.target.value)}
                placeholder="Custom name (optional)"
            />
        </div>
    );
}

// Popup footer with action buttons
function PopupFooter({ onClear, onSave }) {
    return (
        <div className="flex justify-between">
            <button 
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm"
                onClick={onClear}
            >
                Clear
            </button>
            <button 
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                onClick={onSave}
            >
                Apply
            </button>
        </div>
    );
}

// Utility functions
function useClickOutside(callback, excludeId) {
    useEffect(() => {
        function handleClickOutside(event) {
            // Skip if clicked element is our exclude target
            if (excludeId && (
                event.target.id === excludeId || 
                event.target.closest(`#${excludeId}`)
            )) {
                return;
            }
            callback(event);
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [callback, excludeId]);
}

function getAggregationForItem(item, aggregations) {
    return aggregations.find(agg => agg.original_name === item) || {
        function: '',
        original_name: item,
        alias: ''
    };
}

function formatDisplayText(item, aggregation) {
    return aggregation.function ? 
        `${aggregation.function}(${item})${aggregation.alias ? ` AS ${aggregation.alias}` : ''}` : 
        item;
}

function saveAggregation(item, aggFunction, alias, aggregations, setAggregations) {
    const index = aggregations.findIndex(agg => agg.original_name === item);
    
    if (index >= 0) {
        // Update existing entry
        const updatedAggregations = [...aggregations];
        updatedAggregations[index] = {
            function: aggFunction,
            original_name: item,
            alias: alias
        };
        setAggregations(updatedAggregations);
    } else {
        // Add new entry
        setAggregations([...aggregations, {
            function: aggFunction,
            original_name: item,
            alias: alias
        }]);
    }
}

function clearAggregation(item, aggregations, setAggregations) {
    setAggregations(aggregations.filter(agg => agg.original_name !== item));
}
