import { useSignal } from "@preact/signals";
import GlobalSignalsPopup  from "../state_components/global_popup";
import { CreateFormButton } from "../template_builder/template_builder_view";
import { ActiveQueryData, CreateQueryBlock, SyncQueries, UpdateQueryPart } from "./query_signal";
import { Pipette, X, ChevronRight, Code, Settings, Database, Filter, SortDesc, Group, Table, Eye, ArrowUp, ArrowDown, Code2Icon, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "preact/hooks";
import { SelectComponent } from "../components/general/general_components";
import { fieldsGlobalSignals } from "../states/common_repo";
import { JSEditorWithInputFields } from "./components_2";

// Theme colors
const THEME = {
  primary: "#3B82F6", // Blue
  secondary: "#10B981", // Green
  dark: "black",
  light: "white",
  gray: "#6B7280",
  lightGray: "#E5E7EB",
  danger: "#EF4444",
  warning: "#F59E0B",
  white: "#ffffff",
  shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
};

export function CreateQueryBar() {
  return (
    <div className="mb-4">
      <CreateFormButton
        formLabel={"New Query"} 
        placeHolder={"Query Name:"} 
        buttonLabel={"Create Query"} 
        callback={(data) => { CreateQueryBlock(data) }}
      />
    </div>
  );
}

export function TablesView({ prefilData }) {
  let style = {
    "paddingTop": "50px"
  };
  const activeQuery = ActiveQueryData.value;
  const [activeTab, setActiveTab] = useState("select");
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };
  
  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  const handleSync = () => {
    // Add your sync functionality here
    SyncQueries();
    console.log("Sync button clicked");
  };
  
  // If no query selected, show placeholder with sync button
  if (activeQuery["id"] === undefined) {
    return (
      <div className="relative h-full">
        {/* Sync Button */}
        <div className="fixed top-4 right-8">
          <button 
            className="flex items-center text-sm px-3 py-1 rounded bg-green-100 text-green-700 shadow-sm hover:bg-green-200 transition-colors"
            onClick={handleSync}
          >
            <RefreshCcw size={14} className="mr-1" />
            Sync
          </button>
        </div>
        
        <div className="flex items-center justify-center h-96 text-lg text-gray-500">
          <Database className="mr-2" /> Select a Query to Begin
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative">
      {/* Sync Button */}
      <div className="fixed top-4 right-8">
        <button 
          className="flex items-center text-sm px-3 py-1 rounded bg-green-100 text-green-700 shadow-sm hover:bg-green-200 transition-colors"
          onClick={handleSync}
        >
          <RefreshCcw size={14} className="mr-1" />
          Sync
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex h-screen max-h-[calc(100vh-100px)] overflow-hidden" 
      style={{ maxWidth: "95vw", ...style }}>
        {/* Vertical Tab Navigation */}
        <div 
          className="w-48 flex-shrink-0 bg-gray-50 border-r border-gray-200"
          style={{ boxShadow: "2px 0 5px rgba(0,0,0,0.05)", borderRadius: "20px" }}
        >
          <QueryTabs activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 bg-white">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeQuery.
  // @ts-ignore
              name || "Untitled Query"}
            </h2>
            <div className="flex items-center">
              <button 
                className={`flex items-center text-sm px-3 py-1 rounded ${showAdvanced ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                onClick={toggleAdvanced}
              >
                <Code size={14} className="mr-1" />
                {showAdvanced ? "Hide JSON" : "Advanced JSON"}
              </button>
            </div>
          </div>
          
          {showAdvanced && <AdvancedJsonView queryData={activeQuery} />}
          
          <div className="mt-4">
            {activeTab === "select" && (
              <SelectBlock 
                select={activeQuery["select_fields"] || []} 
                Aggregations={activeQuery["select_aggregate_fields"] || []}
                updateCallBack={UpdateQueryPart}
              />
            )}
            {activeTab === "join" && <JoinBlock initalData={activeQuery["join_fields"]} updateCallBack={(data) => {
              UpdateQueryPart("join_fields", data);
            }}  />}
            {activeTab === "where" && <WhereBlock whereInp={activeQuery["where_fields"]} 
            updateCallback={(key, data) => {UpdateQueryPart(key, data)}} />}
            {activeTab === "groupby" && <GroupByBlock 
            initalgroups={activeQuery["group_fields"]}
            updateCallBack={(data) => UpdateQueryPart("group_fields", data)}
            />}
            {activeTab === "orderby" && <OrderByBlock 
            selectInput={activeQuery["order_fields"]}
            aggregationInput={activeQuery["order_aggregate_fields"]}
            updateCallback={(key,data) => {UpdateQueryPart(key,data)}}
             />}
            {activeTab === "preview" && <PreviewBlock queryData={activeQuery} />}
            {activeTab === "input" && <JSEditorWithInputFields 
            initialCode={activeQuery["input_js"]}
            initialFields={activeQuery["input_params"]}
            isInput={true}
            onParamsChange={(obj) => {
              UpdateQueryPart("input_js", obj["code"]);
              UpdateQueryPart("input_params", obj["fields"]);

            }}
            />}

            {activeTab === "output" && <JSEditorWithInputFields 
            initialCode={activeQuery["output_js"]}
            initialFields={activeQuery["output_params"]}
            isInput={false}
            onParamsChange={(obj) => {
              UpdateQueryPart("output_js", obj["code"]);
              UpdateQueryPart("output_params", obj["fields"]);

            }}
            />}
          </div>
        </div>
      </div>
    </div>
  );
}

function QueryTabs({ activeTab, onTabChange }) {
  const tabs = [
    {id:"input", label: "Input", icon: <Code2Icon size={16}/>},
    { id: "select", label: "Select", icon: <Eye size={16} /> },
    { id: "join", label: "Join", icon: <Table size={16} /> },
    { id: "where", label: "Where", icon: <Filter size={16} /> },
    { id: "groupby", label: "Group By", icon: <Group size={16} /> },
    { id: "orderby", label: "Order By", icon: <SortDesc size={16} /> },
    { id: "preview", label: "Preview", icon: <Database size={16} /> },
    {id:"output", label: "Output", icon: <Code2Icon size={16}/>}

  ];
  
  return (
    <div className="py-4" style={{borderRadius:"20px"}}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`w-full text-left flex items-center px-4 py-3 mb-1 text-sm ${
            activeTab === tab.id 
              ? `bg-${THEME.dark} bg-opacity-10 text-${THEME.white} border-l-4 border-${THEME.dark}` 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span className="mr-3">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function AdvancedJsonView({ queryData }) {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 overflow-auto max-h-60">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Query JSON</h3>
        <span className="text-xs text-gray-500">Advanced Mode</span>
      </div>
      <pre className="text-xs text-gray-800 overflow-auto">
        {JSON.stringify(queryData, null, 2)}
      </pre>
    </div>
  );
}

function JoinBlock( {initalData, updateCallBack}) {
  let isOpen = useSignal(false);
  let popupField = useSignal("");
  let popupInd = useSignal(-1);
  let joinsData = useSignal([]);
  
  useEffect((() => {
    joinsData.value = [...initalData];
  }),[initalData]);
  // Handle popup close
  const handlePopupClose = (e, data) => {
    if(data === undefined) {
      isOpen.value = false;
      return;
    }
    let last = data.pop();
    let key = popupField.value;
    let obj = {};
    obj[key] = last;
    updateJoinData(obj, popupInd.value, updateCallBack);
    isOpen.value = false;
  };
  
  function DeleteJoinData(index) {
    let newjoins = joinsData.value.filter((_, i) => i !== index);
    joinsData.value = [...newjoins];
    updateCallBack(joinsData.value);
  }
  // Update join data
  function updateJoinData(obj, index, updateJoinCallback) {
    var existing = joinsData.value;
    let cur = existing[index];
    cur = {...cur, ...obj};
    existing[index] = cur;
    joinsData.value = [...existing];
    updateCallBack(joinsData.value);
  }
  
  return (
    <div className="join-block">
      <SectionHeader title="Table Joins" />
      
      <div className="join-list space-y-3 mt-4">
        {joinsData.value.length === 0 ? (
          <EmptyState message="No joins configured. Add a join to start building your query's table relationships." />
        ) : (
          joinsData.value.map((join, index) => (
            <JoinTile 
              key={index} 
              join={join} 
              index={index} 
              updateData={updateJoinData}
              onFieldSelect={(field) => {
                popupField.value = field;
                popupInd.value = index;
                isOpen.value = true;
              }}
              deleteCallBack={DeleteJoinData}
            />
          ))
        )}
      </div>
      
      <button 
        className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        onClick={() => {
          let cur = joinsData.value;
          cur.push({join: "left join"});
          joinsData.value = [...cur];
        }}
      >
        <Table size={16} className="mr-2" />
        Add Join
      </button>
      
      <GlobalSignalsPopup 
        initialOpen={isOpen.value}
        // @ts-ignore
        fields={fieldsGlobalSignals.value}
        onClose={handlePopupClose}
      />
    </div>
  );
}

function JoinTile({ join, index, updateData, onFieldSelect, deleteCallBack }) {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-center gap-3">
        <SelectComponent 
          options={["left join", "right join", "join", "inner join", "cross join"]}
          onChange={(e, data) => {updateData({"join": data["value"]}, index)}}
          selected={join["join"] || "left join"}
          style={{width: "140px"}}
        />
        
        <FieldButton 
          label={join["first_field"] || "Select Field"} 
          onClick={() => onFieldSelect("first_field")}
        />
        
        <SelectComponent 
          options={["equals", "less_than", "greater_than", "less_eq", "greater_eq"]}
          onChange={(e, data) => {updateData({"operator": data["value"]}, index)}}
          selected={join["operator"] || "equals"}
          style={{width: "120px"}}
        />
        
        <FieldButton 
          label={join["second_field"] || "Select Field"} 
          onClick={() => onFieldSelect("second_field")}
        />
        
        <button 
          className="ml-auto text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
          onClick={() => {
            deleteCallBack(index);
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}


function ConditionTile({ condition, index, isFirst, onFieldSelect, updateData, onRemove }) {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-center gap-3">
        {!isFirst && (
          <SelectComponent 
            options={["AND", "OR"]}
            onChange={(e, data) => updateData({"logical": data["value"]})}
            selected={condition["logical"] || "AND"}
            style={{width: "80px"}}
          />
        )}
        
        <FieldButton 
          label={condition["field"] || "Select Field"} 
          onClick={() => onFieldSelect("field")}
        />
        
        <SelectComponent 
          options={["equals", "not_equals", "less_than", "greater_than", "less_eq", "greater_eq", "like", "in", "not_in"]}
          onChange={(e, data) => updateData({"operator": data["value"]})}
          selected={condition["operator"] || "equals"}
          style={{width: "120px"}}
        />
        
        <FieldButton 
          label={condition["value"] || "Select Value"} 
          onClick={() => onFieldSelect("value")}
        />
        
        <button 
          className="ml-auto text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
          onClick={onRemove}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

function ConditionGroupTile({ 
  group, 
  onFieldSelect, 
  updateGroupLogical, 
  updateCondition, 
  addCondition, 
  removeGroup,
  removeCondition
}) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700 mr-2">Group Logic:</span>
          <SelectComponent 
            options={["AND", "OR"]}
            onChange={(e, data) => updateGroupLogical(data["value"])}
            selected={group.logical || "AND"}
            style={{width: "80px"}}
          />
        </div>
        
        <button 
          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
          onClick={removeGroup}
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="space-y-2 pl-3 border-l-2 border-blue-200">
        {group.conditions.map((condition, index) => (
          <div key={`group-${group.id}-cond-${index}`} className="flex flex-wrap items-center gap-2 py-2">
            {/* Removed individual logical operators for conditions after the first within a group */}
            
            <FieldButton 
              label={condition["field"] || "Select Field"} 
              onClick={() => onFieldSelect("field", index)}
              small
            />
            
            <SelectComponent 
              options={["equals", "not_equals", "less_than", "greater_than", "less_eq", "greater_eq", "like", "in", "not_in"]}
              onChange={(e, data) => updateCondition({"operator": data["value"]}, index)}
              selected={condition["operator"] || "equals"}
              style={{width: "110px"}}
            />
            
            <FieldButton 
              label={condition["value"] || "Select Value"} 
              onClick={() => onFieldSelect("value", index)}
              small
            />
            
            {group.conditions.length > 1 && (
              <button 
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                onClick={() => removeCondition(index)}
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
      
      <button 
        className="mt-3 flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        onClick={addCondition}
      >
        <span className="mr-1">+</span> Add Condition
      </button>
    </div>
  );
}

// Placeholder components that would be defined elsewhere in your actual code
// function SectionHeader({ title }) {
//   return <h2 className="text-lg font-medium text-gray-800">{title}</h2>;
// }

// function EmptyState({ message }) {
//   return (
//     <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
//       {message}
//     </div>
//   );
// }

// function FieldButton({ label, onClick, small }) {
//   return (
//     <button 
//       className={`flex items-center ${small ? 'px-3 py-1.5 text-sm' : 'px-4 py-2'} bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 border border-blue-200`}
//       onClick={onClick}
//     >
//       <span className="mr-1">📋</span> {label}
//     </button>
//   );
// }
function GroupByBlock({initalgroups, updateCallBack}) {
  let keys = [];
  let isOpen = useSignal(false);
  const [selectedItems, setSelectedItems] = useState([]);
  
  useEffect((() => {
    setSelectedItems(initalgroups);
  }), [initalgroups]);
  const removeTag = (itemToRemove) => {
    setSelectedItems(prev => {
      const updatedItems = prev.filter(item => item !== itemToRemove);
      // Call updateCallBack with the new filtered array, not the old selectedItems
      updateCallBack(updatedItems);
      return updatedItems;
    });
  };
  
  return (
    <div className="group-by-block">
      <SectionHeader title="Group By Fields" />
      
      <div className="mt-4">
        <FieldTileList 
          selectedItems={selectedItems} 
          aggregations={[]}
          removeTag={removeTag}
          setAggregations={() => {}}
          isAggregationsAllowed={false}
        />
        
        <button 
          className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => isOpen.value = true}
        >
          <Group size={16} className="mr-2" />
          Select Group By Fields
        </button>
      </div>
      
      <GlobalSignalsPopup 
        initialOpen={isOpen.value}
        // @ts-ignore
        fields={fieldsGlobalSignals.value}
        onClose={(e, data) => {
          console.log("Group By selection:", data);
          if (data) setSelectedItems(data);
          isOpen.value = false;
          updateCallBack(selectedItems);
        }}
      />
    </div>
  );
}

function OrderByBlock( {selectInput, aggregationInput , updateCallback}) {
  let keys = ["order_fields", "order_aggregate_fields"];
  let isOpen = useSignal(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [aggregations, setAggregations] = useState([]);
  
  useEffect((() => {
    setSelectedItems(selectInput);
    setAggregations(aggregationInput);
  }),[selectInput, aggregationInput]);
  const removeTag = (itemToRemove) => {
    const updatedItems = selectedItems.filter(item => item !== itemToRemove);
    setSelectedItems(updatedItems);
    
    const updatedAggregations = aggregations.filter(agg => agg.original_name !== itemToRemove);
    setAggregations(updatedAggregations);
    
    updateCallback(keys[0], updatedItems);
    updateCallback(keys[1], updatedAggregations);
  };
  
  function updateAggregations(updatedAggrs) {
    setAggregations(updatedAggrs);
    updateCallback(keys[1], updatedAggrs);
  }
  
  
  return (
    <div className="order-by-block">
      <SectionHeader title="Order By Fields" />
      
      <div className="mt-4">
        <FieldTileList 
          selectedItems={selectedItems} 
          aggregations={aggregations}
          removeTag={removeTag}
          setAggregations={updateAggregations}
        />
        
        <button 
          className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => isOpen.value = true}
        >
          <SortDesc size={16} className="mr-2" />
          Select Order By Fields
        </button>
      </div>
      
      <GlobalSignalsPopup 
        initialOpen={isOpen.value}
        // @ts-ignore
        fields={fieldsGlobalSignals.value}
        onClose={(e, data) => {
          console.log("Order By selection:", data);
          if (data) setSelectedItems(data);
          isOpen.value = false;
          updateCallback(keys[0], data);
        }}
      />
    </div>
  );
}

function SelectBlock({ select, Aggregations, updateCallBack }) {
  let keys = ["select_fields", "select_aggregate_fields"];
  let isOpen = useSignal(false);
  const [selectedItems, setSelectedItems] = useState([...select]);
  const [aggregations, setAggregations] = useState([...Aggregations]);
  
  const removeTag = (itemToRemove) => {
    const updatedItems = selectedItems.filter(item => item !== itemToRemove);
    setSelectedItems(updatedItems);
    
    const updatedAggregations = aggregations.filter(agg => agg.original_name !== itemToRemove);
    setAggregations(updatedAggregations);
    
    updateCallBack(keys[0], updatedItems);
    updateCallBack(keys[1], updatedAggregations);
  };
  
  function updateAggregations(updatedAggrs) {
    setAggregations(updatedAggrs);
    updateCallBack(keys[1], updatedAggrs);
  }
  
  return (
    <div className="select-block">
      <SectionHeader title="Select Fields" />
      
      <div className="mt-4">
        <FieldTileList 
          selectedItems={selectedItems} 
          aggregations={aggregations}
          removeTag={removeTag}
          setAggregations={updateAggregations}
        />
        
        <button 
          className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => isOpen.value = true}
        >
          <Eye size={16} className="mr-2" />
          Select Fields
        </button>
      </div>
      
      <GlobalSignalsPopup 
        initialOpen={isOpen.value}
        // @ts-ignore
        fields={fieldsGlobalSignals.value}
        onClose={(e, data) => {
          console.log("Selected fields:", data);
          if (data) {
            setSelectedItems(data);
            updateCallBack(keys[0], data);
          }
          isOpen.value = false;
        }}
      />
    </div>
  );
}

function PreviewBlock({ queryData }) {
  return (
    <div className="preview-block">
      <SectionHeader title="Query Preview" />
      
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Generated SQL Query</h3>
          <pre className="p-3 bg-gray-900 text-gray-100 rounded-md overflow-x-auto text-sm">
            {generateSqlPreview(queryData)}
          </pre>
        </div>
        
        <div className="flex justify-end mt-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Run Query
          </button>
        </div>
      </div>
    </div>
  );
}

function generateSqlPreview(queryData) {
  // This is a placeholder function that would generate SQL based on the query structure
  // In a real implementation, this would create actual SQL based on all the selected fields, joins, conditions, etc.
  
  const select = (queryData.select_fields || []).map(field => {
    const agg = (queryData.select_aggregate_fields || [])
      .find(a => a.original_name === field);
      
    if (agg && agg.function) {
      return `${agg.function}(${field})${agg.alias ? ` AS ${agg.alias}` : ''}`;
    }
    return field;
  }).join(', ') || '*';
  
  return `SELECT ${select}\nFROM table_name\n-- Query preview would show full SQL here`;
}

// Reusable Components

function SectionHeader({ title }) {
  return (
    <div className="flex items-center border-b pb-2">
      <h3 className="text-lg font-medium text-gray-800">{title}</h3>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
      <p className="text-gray-500">{message}</p>
    </div>
  );
}

function FieldButton({ label, onClick, small = false }) {
  return (
    <button 
      className={`px-3 ${small ? 'py-1 text-xs' : 'py-2 text-sm'} bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-100 flex items-center`}
      onClick={onClick}
    >
      <Database size={small ? 12 : 14} className={small ? "mr-1" : "mr-2"} />
      {label}
    </button>
  );
}

function FieldTileList({ selectedItems, aggregations, removeTag, setAggregations, isAggregationsAllowed = true }) {
  const [popupState, setPopupState] = useState({
    isOpen: false,
    item: null,
    position: { top: 0, left: 0 }
  });
  
  // Handle click outside the popup
  useClickOutside(() => {
    if (popupState.isOpen) {
      setPopupState(prev => ({ ...prev, isOpen: false }));
    }
  }, 'aggregation-popup');
  
  // Handle field click to open aggregation popup - only if aggregations are allowed
  const handleItemClick = (item, event) => {
    // Only open the popup if aggregations are allowed
    if (!isAggregationsAllowed) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    
    setPopupState({
      isOpen: true,
      item: item,
      position: { top: rect.bottom + window.scrollY, left: rect.left + window.scrollX }
    });
  };
  
  if (selectedItems.length === 0) {
    return (
      <EmptyState message="No fields selected. Click the button below to select fields." />
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {selectedItems.map((item, index) => {
        // Only get aggregation if they're allowed
        const aggregation = isAggregationsAllowed ? getAggregationForItem(item, aggregations) : { function: '', alias: '' };
        return (
          <FieldTile 
            key={index}
            field={item}
            aggregation={aggregation}
            onClick={(e) => handleItemClick(item, e)}
            onRemove={() => removeTag(item)}
            isAggregationsAllowed={isAggregationsAllowed}
          />
        );
      })}
      
      {isAggregationsAllowed && popupState.isOpen && (
        <AggregationPopup 
          position={popupState.position}
          item={popupState.item}
          aggregations={aggregations}
          setAggregations={setAggregations}
          onClose={() => setPopupState(prev => ({ ...prev, isOpen: false }))}
        />
      )}
    </div>
  );
}

function FieldTile({ field, aggregation, onClick, onRemove, isAggregationsAllowed = true }) {
  // Format display text based on aggregation status
  const hasAggregation = isAggregationsAllowed && aggregation.function && aggregation.function !== '';
  const displayText = hasAggregation 
    ? `${aggregation.function}(${field})${aggregation.alias ? ` AS ${aggregation.alias}` : ''}` 
    : field;
    
  // Add special styling for aggregated fields
  const bgColor = hasAggregation ? 'bg-blue-50' : 'bg-white';
  const borderColor = hasAggregation ? 'border-blue-200' : 'border-gray-200';
  
  return (
    <div 
      className={`${bgColor} ${borderColor} rounded-lg border shadow-sm hover:shadow transition-shadow p-3 ${isAggregationsAllowed ? 'cursor-pointer' : ''}`}
      onClick={isAggregationsAllowed ? onClick : undefined}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Database size={16} className="text-gray-500 mr-2" />
          <div>
            <div className="font-medium text-sm">{field}</div>
            {hasAggregation && (
              <div className="text-xs text-blue-600 mt-1">
                {aggregation.function}{aggregation.alias ? ` → ${aggregation.alias}` : ''}
              </div>
            )}
          </div>
        </div>
        
        <button 
          className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X size={16} />
        </button>
      </div>
      
      {hasAggregation && (
        <div className="mt-2 pt-2 border-t border-blue-100 text-xs text-gray-500 flex items-center">
          <Settings size={12} className="mr-1" /> Aggregation configured
        </div>
      )}
    </div>
  );
}
  
 // Updated AggregationPopup function with better positioning
function AggregationPopup({ position, item, aggregations, setAggregations, onClose }) {
    const existingAgg = getAggregationForItem(item, aggregations);
    
    const [aggFunction, setAggFunction] = useState(existingAgg.function || '');
    const [alias, setAlias] = useState(existingAgg.alias || '');
    
    // Calculate better positioning to avoid going off-screen
    const adjustedPosition = {
      top: position.top,
      left: position.left
    };
    
    // Check if popup would go off the right edge of the screen
    const rightEdgeDistance = window.innerWidth - position.left;
    if (rightEdgeDistance < 300) { // popup width + some padding
      adjustedPosition.left = window.innerWidth - 300;
    }
    
    // Ensure popup doesn't go below viewport
    const bottomDistance = window.innerHeight - position.top;
    if (bottomDistance < 250) { // approximate popup height
      adjustedPosition.top = position.top - 250;
    }
    
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
        className="fixed bg-white border border-gray-200 shadow-lg rounded-md p-4 w-64 z-50"
        style={{
          top: `${adjustedPosition.top}px`,
          left: `${adjustedPosition.left}px`
        }}
      >
        <div className="font-medium text-gray-700 mb-3 pb-2 border-b">
          Configure {item}
        </div>
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">Aggregation Function</label>
          <select 
            className="w-full border border-gray-300 rounded p-2 text-sm"
            value={aggFunction}
            // @ts-ignore
            onChange={(e) => setAggFunction(e.target.value)}
          >
            <option value="">None</option>
            {aggregationFunctions.map(func => (
              <option key={func} value={func}>{func}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Alias (Optional)</label>
          <input 
            type="text" 
            className="w-full border border-gray-300 rounded p-2 text-sm"
            value={alias}
            // @ts-ignore
            onChange={(e) => setAlias(e.target.value)}
            placeholder="Custom field name"
          />
        </div>
        
        <div className="flex justify-between">
          <button 
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
            onClick={handleClear}
          >
            Clear
          </button>
          <button 
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            onClick={handleSave}
          >
            Apply
          </button>
        </div>
      </div>
    );
  }
  
  // Utility Functions
  
  function useClickOutside(callback, excludeId) {
    useEffect(() => {
      function handleClickOutside(event) {
        // Skip if clicked element is our excluded target
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
  
  function saveAggregation(item, aggFunction, alias, aggregations, setAggregations) {
    const index = aggregations.findIndex(agg => agg.original_name === item);
    
    if (index >= 0) {
      // Update existing aggregation
      const updatedAggregations = [...aggregations];
      updatedAggregations[index] = {
        function: aggFunction,
        original_name: item,
        alias: alias
      };
      setAggregations(updatedAggregations);
    } else if (aggFunction || alias) {
      // Only add new entry if there's a function or alias
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


  function WhereBlock({whereInp, updateCallback}) {
    let isOpen = useSignal(false);
    let popupField = useSignal("");
    let popupInd = useSignal(-1);
    let popupItemId = useSignal(null);
    // Unified data structure for both conditions and groups
    let items = useSignal([]);
    let nextItemId = useSignal(0);
    
    // Initialize from props
    useEffect(() => {
      if (whereInp && whereInp.length > 0) {
        // Make a deep copy to avoid reference issues
        const existingItems = whereInp.map((item, index) => ({
          ...item,
          id: item.id !== undefined ? item.id : index,
          type: item.type || 'condition',
          data: item.data || {...item},
          logical: index > 0 ? (item.logical || 'AND') : null // First item has no logical operator
        }));
        
        items.value = existingItems;
        // Find the highest ID to ensure we don't duplicate IDs
        nextItemId.value = Math.max(...existingItems.map(item => item.id), 0) + 1;
      } else {
        items.value = [];
        nextItemId.value = 0;
      }
    }, [whereInp]);
    
    // Update the parent component
    const updateParent = () => {
      updateCallback('where_fields', items.value);
    };
    
    // Handle popup close
    const handlePopupClose = (e, data) => {
      if (data === undefined) {
        isOpen.value = false;
        return;
      }
      
      let last = data.pop();
      let key = popupField.value;
      let obj = {};
      obj[key] = last;
      
      const index = popupInd.value;
      const itemId = popupItemId.value;
      
      if (itemId !== null) {
        const itemIndex = items.value.findIndex(item => item.id === itemId);
        
        if (itemIndex !== -1) {
          const item = items.value[itemIndex];
          
          if (item.type === 'condition') {
            // Update regular condition
            items.value[itemIndex].data = {...item.data, ...obj};
          } else if (item.type === 'group') {
            // Update group condition
            const updatedConditions = [...item.data.conditions];
            updatedConditions[index] = {...updatedConditions[index], ...obj};
            items.value[itemIndex].data.conditions = updatedConditions;
          }
          
          items.value = [...items.value];
          updateParent();
        }
      }
      
      isOpen.value = false;
    };
    
    // Add a new regular condition
    const addCondition = () => {
      const newItem = {
        id: nextItemId.value++,
        type: 'condition',
        data: {},
        logical: items.value.length > 0 ? 'AND' : null
      };
      
      items.value = [...items.value, newItem];
      updateParent();
    };
    
    // Add a new condition to a group
    const addGroupCondition = (groupItemId) => {
      const updatedItems = [...items.value];
      const groupIndex = updatedItems.findIndex(item => item.id === groupItemId);
      
      if (groupIndex !== -1 && updatedItems[groupIndex].type === 'group') {
        updatedItems[groupIndex].data.conditions.push({});
        items.value = updatedItems;
        updateParent();
      }
    };
    
    // Add a new group
    const addGroup = () => {
      const groupId = nextItemId.value++;
      
      const newGroup = {
        id: nextItemId.value++,
        type: 'group',
        data: {
          id: groupId,
          logical: 'AND',
          conditions: [{}]
        },
        logical: items.value.length > 0 ? 'AND' : null
      };
      
      items.value = [...items.value, newGroup];
      updateParent();
    };
    
    // Remove an item (condition or group)
    const removeItem = (itemId) => {
      items.value = items.value.filter(item => item.id !== itemId);
      updateParent();
    };
    
    // Remove a condition from a group
    const removeGroupCondition = (groupItemId, condIndex) => {
      const updatedItems = [...items.value];
      const groupIndex = updatedItems.findIndex(item => item.id === groupItemId);
      
      if (groupIndex !== -1 && updatedItems[groupIndex].type === 'group') {
        if (updatedItems[groupIndex].data.conditions.length > 1) {
          updatedItems[groupIndex].data.conditions = updatedItems[groupIndex].data.conditions.filter((_, i) => i !== condIndex);
          items.value = updatedItems;
          updateParent();
        } else {
          // If it's the last condition, remove the entire group
          removeItem(groupItemId);
        }
      }
    };
    
    // Update logical operator between items
    const updateItemLogical = (itemId, logical) => {
      const updatedItems = [...items.value];
      const index = updatedItems.findIndex(item => item.id === itemId);
      
      if (index !== -1) {
        updatedItems[index].logical = logical;
        items.value = updatedItems;
        updateParent();
      }
    };
    
    // Update group's internal logical operator
    const updateGroupLogical = (groupItemId, logical) => {
      const updatedItems = [...items.value];
      const index = updatedItems.findIndex(item => item.id === groupItemId);
      
      if (index !== -1 && updatedItems[index].type === 'group') {
        updatedItems[index].data.logical = logical;
        items.value = updatedItems;
        updateParent();
      }
    };
    
    // Handle reordering items
    const moveItem = (itemId, direction) => {
      const currentItems = [...items.value];
      const itemIndex = currentItems.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) return;
      
      if (direction === 'up' && itemIndex > 0) {
        // Move up
        const temp = currentItems[itemIndex];
        currentItems[itemIndex] = currentItems[itemIndex - 1];
        currentItems[itemIndex - 1] = temp;
        
        // Adjust logical operators
        if (itemIndex === 1) {
          // Item becoming first should have no logical
          currentItems[0].logical = null;
          if (currentItems.length > 1) {
            currentItems[1].logical = currentItems[1].logical || 'AND';
          }
        }
      } else if (direction === 'down' && itemIndex < currentItems.length - 1) {
        // Move down
        const temp = currentItems[itemIndex];
        currentItems[itemIndex] = currentItems[itemIndex + 1];
        currentItems[itemIndex + 1] = temp;
        
        // Adjust logical operators
        if (itemIndex === 0) {
          // First item losing its position should gain logical
          currentItems[1].logical = null;
          currentItems[0].logical = currentItems[0].logical || 'AND';
        }
      }
      
      items.value = currentItems;
      updateParent();
    };
    
    return (
      <div className="where-block">
        <SectionHeader title="Filter Conditions" />
        
        {/* Items (Conditions and Groups) */}
        <div className="mt-4 space-y-4">
          {items.value.length === 0 ? (
            <EmptyState message="No conditions defined. Add conditions to filter your query results." />
          ) : (
            items.value.map((item, index) => (
              <div key={`item-${item.id}`} className="flex flex-col">
                {/* Show logical operator for items after the first one */}
                {index > 0 && (
                  <div className="mb-2 ml-2">
                    <SelectComponent 
                      options={["AND", "OR"]}
                      onChange={(e, data) => updateItemLogical(item.id, data.value)}
                      selected={item.logical || "AND"}
                      style={{width: "80px"}}
                    />
                  </div>
                )}
                
                {/* Regular Condition */}
                {item.type === 'condition' && (
                  <div className="flex items-center">
                    <div className="flex-grow">
                      <ConditionTile 
                        condition={item.data || {}}
                        index={0}
                        isFirst={index === 0}
                        onFieldSelect={(field) => {
                          popupField.value = field;
                          popupInd.value = 0;
                          popupItemId.value = item.id;
                          isOpen.value = true;
                        }}
                        updateData={(obj) => {
                          const updatedItems = [...items.value];
                          const idx = updatedItems.findIndex(i => i.id === item.id);
                          if (idx !== -1) {
                            updatedItems[idx].data = {...updatedItems[idx].data, ...obj};
                            items.value = updatedItems;
                            updateParent();
                          }
                        }}
                        onRemove={() => removeItem(item.id)}
                      />
                    </div>
                    
                    {/* Reordering buttons */}
                    <div className="flex flex-col ml-2">
                      <button 
                        disabled={index === 0}
                        className={`p-1 ${index === 0 ? 'text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => moveItem(item.id, 'up')}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button 
                        disabled={index === items.value.length - 1}
                        className={`p-1 ${index === items.value.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => moveItem(item.id, 'down')}
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Group */}
                {item.type === 'group' && (
                  <div className="flex items-center">
                    <div className="flex-grow">
                      <ConditionGroupTile 
                        group={{
                          id: item.data.id,
                          logical: item.data.logical,
                          conditions: item.data.conditions
                        }}
                        onFieldSelect={(field, condIndex) => {
                          popupField.value = field;
                          popupInd.value = condIndex;
                          popupItemId.value = item.id;
                          isOpen.value = true;
                        }}
                        updateGroupLogical={(logical) => updateGroupLogical(item.id, logical)}
                        updateCondition={(obj, condIndex) => {
                          const updatedItems = [...items.value];
                          const idx = updatedItems.findIndex(i => i.id === item.id);
                          if (idx !== -1) {
                            const updatedConditions = [...updatedItems[idx].data.conditions];
                            updatedConditions[condIndex] = {...updatedConditions[condIndex], ...obj};
                            updatedItems[idx].data.conditions = updatedConditions;
                            items.value = updatedItems;
                            updateParent();
                          }
                        }}
                        addCondition={() => addGroupCondition(item.id)}
                        removeGroup={() => removeItem(item.id)}
                        removeCondition={(condIndex) => removeGroupCondition(item.id, condIndex)}
                      />
                    </div>
                    
                    {/* Reordering buttons */}
                    <div className="flex flex-col ml-2">
                      <button 
                        disabled={index === 0}
                        className={`p-1 ${index === 0 ? 'text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => moveItem(item.id, 'up')}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button 
                        disabled={index === items.value.length - 1}
                        className={`p-1 ${index === items.value.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => moveItem(item.id, 'down')}
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="mt-4 flex space-x-3">
          <button 
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={addCondition}
          >
            <Filter size={16} className="mr-2" />
            Add Condition
          </button>
          
          <button 
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            onClick={addGroup}
          >
            <Group size={16} className="mr-2" />
            Add Group
          </button>
        </div>
        
        <GlobalSignalsPopup 
          initialOpen={isOpen.value}
          // @ts-ignore
          fields={fieldsGlobalSignals.value}
          onClose={handlePopupClose}
        />
      </div>
    );
  }


  // Add this for better styling of components
  const styles = {
    sectionContainer: {
      padding: '16px',
      marginBottom: '24px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 16px',
      backgroundColor: THEME.primary,
      color: 'white',
      borderRadius: '6px',
      fontSize: '14px',
      cursor: 'pointer',
      border: 'none',
      transition: 'background-color 0.2s ease',
      marginRight: '8px'
    }
  };
  
  // Add CSS for better UX
  const css = `
    .section {
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      padding-bottom: 20px;
    }
    
    .scrollable-div {
      overflow-y: auto;
      padding: 20px;
    }
    
    /* Custom scrollbars for modern browsers */
    .scrollable-div::-webkit-scrollbar {
      width: 8px;
    }
    
    .scrollable-div::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    
    .scrollable-div::-webkit-scrollbar-thumb {
      background: #ddd;
      border-radius: 4px;
    }
    
    .scrollable-div::-webkit-scrollbar-thumb:hover {
      background: #ccc;
    }
  `;
  
  // Create a style element and append the CSS
  (() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
  })();