import { fieldsGlobalSignals, formsGlobalSignals, screensGlobalSignals, tablesGlobalSignals, userGlobalData } from "../states/common_repo";
import { Plus, Check } from 'lucide-react';
import { useState } from "preact/hooks";
export function GlobalSignalsPopup({ isOpen, onChangeCallback, closeCallback }) {
  let tables = tablesGlobalSignals.value;
  let fields = fieldsGlobalSignals.value;
  let userData = userGlobalData.value;
  let forms = formsGlobalSignals.value;
  let screens = screensGlobalSignals.value;
  
  const [pickedItems, setPickedItems] = useState([]);
  
  const togglePickItem = (path) => {
    setPickedItems(prev => {
      if (prev.includes(path)) {
        // Remove if already in list
        return prev.filter(item => item !== path);
      } else {
        // Add if not in list
        return [...prev, path];
      }
    });
  };
  
  return (
    <dialog open={isOpen}>
      <div className="bg-white flex flex-col justify-between items-center" style={{height:"60vh", width:"80vw"}}>
        <div className="scrollable-div flex flex-col items-center">
          <div className="p-5 flex flex-col items-center">
            <PickableAccordion 
              title="tables" 
              data={tables}
              pickedItems={pickedItems} 
              togglePickItem={togglePickItem}
            />
            
            {Object.keys(fields).map((key, ind) => {
              let innerfields = fields[key];
              let fieldList = [];
              innerfields.map((val) => {
                fieldList.push(val["name"]);
              });
              return (
                <PickableAccordion 
                  key={ind}
                  title={key} 
                  data={fieldList}
                  pickedItems={pickedItems} 
                  togglePickItem={togglePickItem}
                />
              );
            })}
          </div>
        </div>
        
        <div className="w-full flex flex-row-reverse px-6 mb-8">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" 
            onClick={(e) => {closeCallback(e, pickedItems)}}
          >
            Ok
          </button>
        </div>
      </div>
    </dialog>
  );
}

function PickableAccordion({ title, data, pickedItems, togglePickItem, previousPath = "" }) {
  const type = Array.isArray(data) ? "array" : typeof data;
  const currentPath = previousPath ? `${previousPath}.${title}` : title;
  const isPicked = pickedItems.includes(currentPath);
  
  return (
    <div className="mb-2 w-full max-w-md">
      <details className="group">
        <summary className="bg-black text-white text-base p-4 rounded-lg cursor-pointer flex justify-between items-center">
          <span>{title}</span>
          <button 
            className={`ml-2 p-1 rounded-full ${isPicked ? 'bg-green-500' : 'bg-gray-200'}`}
            onClick={(e) => {
              e.preventDefault(); // Prevent toggling the accordion
              togglePickItem(currentPath);
            }}
          >
            {isPicked ? 
              <Check size={16} className="text-white" /> : 
              <Plus size={16} className="text-gray-700" />
            }
          </button>
        </summary>
        
        <div className="ml-4 mt-2">
          {type === "object" ? (
            Object.keys(data).map((key, index) => (
              <PickableAccordion 
                key={index}
                title={key} 
                data={data[key]} 
                pickedItems={pickedItems}
                togglePickItem={togglePickItem}
                previousPath={currentPath}
              />
            ))
          ) : type === "array" ? (
            data.map((value, index) => {
              const itemPath = `${currentPath}.${value}`;
              const isItemPicked = pickedItems.includes(itemPath);
              
              return (
                <div key={index} className="flex items-center my-2">
                  <p className="bg-gray-500 text-white text-base p-3 rounded-lg flex-grow">
                    {value}
                  </p>
                  <button 
                    className={`ml-2 p-1 rounded-full ${isItemPicked ? 'bg-green-500' : 'bg-gray-200'}`}
                    onClick={() => togglePickItem(itemPath)}
                  >
                    {isItemPicked ? 
                      <Check size={16} className="text-white" /> : 
                      <Plus size={16} className="text-gray-700" />
                    }
                  </button>
                </div>
              );
            })
          ) : (
            <div className="flex items-center my-2">
              <p className="bg-gray-500 text-white text-base p-3 rounded-lg flex-grow">
                {String(data)}
              </p>
              <button 
                className={`ml-2 p-1 rounded-full ${pickedItems.includes(currentPath) ? 'bg-green-500' : 'bg-gray-200'}`}
                onClick={() => togglePickItem(currentPath)}
              >
                {pickedItems.includes(currentPath) ? 
                  <Check size={16} className="text-white" /> : 
                  <Plus size={16} className="text-gray-700" />
                }
              </button>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}