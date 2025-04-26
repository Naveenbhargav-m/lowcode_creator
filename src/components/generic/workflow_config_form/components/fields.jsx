import { useState } from "preact/hooks";
export const TextField = ({ id, label, description, value, onChange, placeholder, required, disabled }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {description && <p className="text-sm text-gray-500 mb-2">{description}</p>}
      <input
        type="text"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};



export const SelectField = ({ id, label, description, value, onChange, options, required, disabled }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {description && <p className="text-sm text-gray-500 mb-2">{description}</p>}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};



export const KeyValueMapper = ({ id, label, description, value, onChange, keyLabel, valueLabel }) => {
  const handleAddPair = () => {
    onChange({ ...value, '': '' });
  };

  const handleRemovePair = (keyToRemove) => {
    const newValue = { ...value };
    delete newValue[keyToRemove];
    onChange(newValue);
  };

  const handleKeyChange = (oldKey, newKey) => {
    const newValue = { ...value };
    
    if (oldKey === newKey) return;
    
    // If key already exists, don't overwrite
    if (newValue[newKey] !== undefined) return;
    
    const val = newValue[oldKey];
    delete newValue[oldKey];
    newValue[newKey] = val;
    
    onChange(newValue);
  };

  const handleValueChange = (key, newValue) => {
    onChange({ ...value, [key]: newValue });
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {description && <p className="text-sm text-gray-500 mb-2">{description}</p>}
      
      <div className="border border-gray-300 rounded-md p-4">
        <div className="mb-4 flex font-medium text-sm">
          <div className="w-1/2 pr-2">{keyLabel || 'Key'}</div>
          <div className="w-1/2 pl-2">{valueLabel || 'Value'}</div>
        </div>
        
        {Object.entries(value).map(([key, val], index) => (
          <div key={index} className="flex mb-2 items-center">
            <div className="w-1/2 pr-2">
              <input
                type="text"
                value={key}
                onChange={(e) => handleKeyChange(key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="w-1/2 pl-2 flex">
              <input
                type="text"
                value={val}
                onChange={(e) => handleValueChange(key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={() => handleRemovePair(key)}
                className="ml-2 px-2 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                -
              </button>
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={handleAddPair}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Pair
        </button>
      </div>
    </div>
  );
};

export const ArrayField = ({ id, label, description, value, onChange, itemComponent: ItemComponent, itemProps }) => {
  const handleAddItem = () => {
    onChange([...value, '']);
  };

  const handleRemoveItem = (index) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const handleItemChange = (index, newValue) => {
    const newArray = [...value];
    newArray[index] = newValue;
    onChange(newArray);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {description && <p className="text-sm text-gray-500 mb-2">{description}</p>}
      
      <div className="border border-gray-300 rounded-md p-4">
        {value.map((item, index) => (
          <div key={index} className="flex mb-2 items-center">
            <div className="flex-grow">
              {ItemComponent ? (
                <ItemComponent
                  value={item}
                  onChange={(newValue) => handleItemChange(index, newValue)}
                  index={index}
                  {...itemProps}
                />
              ) : (
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="ml-2 px-2 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              -
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={handleAddItem}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Item
        </button>
      </div>
    </div>
  );
};

export const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-300 rounded-md mb-4">
      <button
        type="button"
        className="w-full flex justify-between items-center p-4 text-left font-medium bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="border-t border-gray-300">
          {children}
        </div>
      )}
    </div>
  );
};




// components/TabView.jsx

const TabView = ({ tabs, activeTab, onTabChange, className }) => {
  // Handle tab selection
  const handleTabClick = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className={`w-full ${className || ''}`}>
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-300 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-4 py-2 mr-2 focus:outline-none ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                : 'text-gray-600 hover:text-blue-500'
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabView;