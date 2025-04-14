import { useSignal } from "@preact/signals";
import { ScreensList } from "../screen_builder/screen_page";
import { GlobalSignalsPopup } from "../state_components/global_popup";
import { CreateFormButton } from "../template_builder/template_builder_view";
import { CreateQueryBlock } from "./query_functions";
import { ActiveQuery, QueryNames } from "./query_signal";
import { Pipette } from "lucide-react";
import { useState } from "preact/hooks";
import { SelectComponent } from "../components/general/general_components";
import { fieldsGlobalSignals } from "../states/common_repo";

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



// function SelectBlock() {
//     let isOpen = useSignal(false);
//     const [selectedItems, setSelectedItems] = useState([]);
    
//     // Handle removing a specific tag
//     const removeTag = (itemToRemove) => {
//         setSelectedItems(prev => prev.filter(item => item !== itemToRemove));
//     };
    
//     return (
//         <div className="section">
//             <BlocksHeader isOpen={isOpen} title={"Select Block"}/>
//             <SelecList selectedItems={selectedItems} removeTag={removeTag}/>
//             <GlobalSignalsPopup 
//                 isOpen={isOpen} 
//                 fields={fields}
//                 closeCallback={(e, data) => {
//                     console.log("closed :", data);
//                     setSelectedItems(data);
//                     isOpen.value = false;
//                 }}
//             />
//         </div>
//     );
// }

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
    
    // Handle removing a specific tag
    const removeTag = (itemToRemove) => {
        setSelectedItems(prev => prev.filter(item => item !== itemToRemove));
    };
    
    return (
        <div className="section">
            <BlocksHeader isOpen={isOpen} title={"Group By"}/>
            <SelecList selectedItems={selectedItems} removeTag={removeTag}/>
            <GlobalSignalsPopup 
                isOpen={isOpen} 
                fields={fields}
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
    
    // Handle removing a specific tag
    const removeTag = (itemToRemove) => {
        setSelectedItems(prev => prev.filter(item => item !== itemToRemove));
    };
    
    return (
        <div className="section">
            <BlocksHeader isOpen={isOpen} title={"Order By"}/>
            <SelecList selectedItems={selectedItems} removeTag={removeTag}/>
            <GlobalSignalsPopup 
                isOpen={isOpen} 
                fields={fields}
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


function SelectBlock() {
    let isOpen = useSignal(false);
    const [selectedItems, setSelectedItems] = useState([]);
    
    // Remove a selected item
    const removeTag = (itemToRemove) => {
      setSelectedItems(prev => prev.filter(item => item.fieldName !== itemToRemove.fieldName));
    };
    
    // Handle changing the aggregation function
    const changeAggregation = (fieldName, newAggregation) => {
      setSelectedItems(prev => prev.map(item => 
        item.fieldName === fieldName ? {...item, aggregation: newAggregation} : item
      ));
    };
    
    // Handle changing the alias
    const changeAlias = (fieldName, newAlias) => {
      setSelectedItems(prev => prev.map(item => 
        item.fieldName === fieldName ? {...item, alias: newAlias} : item
      ));
    };
    
    return (
      <div className="section">
        <BlocksHeader isOpen={isOpen} title={"Select Block"}/>
        <SelectList 
          selectedItems={selectedItems} 
          removeTag={removeTag}
          changeAggregation={changeAggregation}
          changeAlias={changeAlias}
        />
        <GlobalSignalsPopup 
          isOpen={isOpen} 
          fields={fields}
          closeCallback={(e, data) => {
            console.log("closed :", data);
            
            // Convert raw field selections to objects with default aggregation and alias
            const itemsWithAggregationAndAlias = data.map(field => ({
              fieldName: field,
              aggregation: "none", // Default aggregation
              alias: field
            }));
            
            setSelectedItems(itemsWithAggregationAndAlias);
            isOpen.value = false;
          }}
        />
      </div>
    );
  }
  
  function SelectList({selectedItems, removeTag, changeAggregation, changeAlias}) {
    // Available aggregation functions
    const aggregationOptions = ["none", "sum", "avg", "count", "min", "max"];
    
    return (
      <div className="p-3 border rounded min-h-12 flex flex-wrap gap-2">
        {selectedItems.length === 0 ? (
          <div className="text-gray-400">Click to select columns (e.g., id, name, email)</div>
        ) : (
          selectedItems.map((item, index) => (
            <div key={index} className="px-2 py-1 rounded-md flex items-center text-sm bg-black text-white" 
              style={{borderRadius: "10px", fontSize: "0.6em"}}
            >
              <span className="mr-1">{item.fieldName}</span>
              <select 
                className="bg-gray-800 text-white text-xs rounded px-1 mr-1"
                value={item.aggregation}
                // @ts-ignore
                onChange={(e) => changeAggregation(item.fieldName, e.target.value)}
              >
                {aggregationOptions.map(agg => (
                  <option key={agg} value={agg}>{agg}</option>
                ))}
              </select>
              {/* <input
                type="text"
                className="bg-gray-800 text-white text-xs rounded px-1 w-16 mr-1"
                style={{height:"10px"}}
                placeholder="Alias"
                value={item.alias}
                onChange={(e) => changeAlias(item.fieldName, e.target.value)}
              /> */}
              <button 
                className="bg-black px-2"
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
  
  // Example usage component that shows the results with aliases
  function ResultsPreview({selectedItems}) {
    return (
      <div className="mt-4">
        <h3 className="font-medium text-sm mb-2">Preview:</h3>
        <div className="p-2 bg-gray-100 rounded text-sm">
          {selectedItems.map((item, index) => {
            const displayName = item.aggregation !== "none" 
              ? `${item.aggregation}(${item.fieldName})` 
              : item.fieldName;
              
            return (
              <div key={index} className="mb-1">
                <span className="font-mono">{displayName}</span>
                {item.alias !== item.fieldName && item.alias.trim() !== "" && (
                  <span className="text-gray-500 ml-2">AS "{item.alias}"</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }