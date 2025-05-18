import { ChevronUpIcon } from "lucide-react";
import { useState } from "preact/hooks";
import { useRef, useEffect } from 'react';

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



// This is for the case statement in your form renderer
// case 'code':
//   return (
//     <CodeEditorField
//       key={id}
//       id={id}
//       label={label}
//       description={description}
//       value={values[id] || ''}
//       onChange={(value) => handleChange(id, value)}
//       {...props}
//     />
//   );

export const CodeEditorField = ({ id, label, description, value, onChange, required, disabled, language = "javascript" }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [codeContent, setCodeContent] = useState(value);
  const textareaRef = useRef(null);
  const popupRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target) && 
          textareaRef.current && !textareaRef.current.contains(event.target)) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle ESC key to close popup
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsPopupOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSave = () => {
    onChange(codeContent);
    setIsPopupOpen(false);
  };

  const handleCancel = () => {
    setCodeContent(value);
    setIsPopupOpen(false);
  };

  const getPreviewContent = () => {
    if (!codeContent) return 'Click to add code';
    // Limit the preview to 3 lines
    const lines = codeContent.split('\n');
    const previewLines = lines.slice(0, 3);
    return previewLines.join('\n') + (lines.length > 3 ? '...' : '');
  };

  return (
    <div className="mb-4 relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {description && <p className="text-sm text-gray-500 mb-2">{description}</p>}
      
      {/* Small textarea preview */}
      <div 
        ref={textareaRef}
        onClick={() => !disabled && setIsPopupOpen(true)}
        className={`
          min-h-20 w-full px-3 py-2 border border-gray-300 rounded-md 
          font-mono text-sm bg-gray-50 cursor-pointer whitespace-pre overflow-hidden
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        `}
      >
        {getPreviewContent()}
      </div>

      {/* Popup code editor */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            ref={popupRef}
            className="bg-white rounded-lg shadow-xl w-4/5 max-w-4xl max-h-4/5 flex flex-col"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Edit Code</h3>
              <div>
                <span className="text-sm text-gray-500 mr-2">Language: {language}</span>
              </div>
            </div>
            
            <div className="p-4 flex-1 overflow-auto">
              <textarea
                autoFocus
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                className="w-full h-96 font-mono text-sm p-2 border border-gray-300 rounded"
                spellCheck="false"
              />
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


import { PlusCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export function KeyValueMapper({ id, label, description, value = {}, onChange, keyLabel = 'Key', valueLabel = 'Value' }) {
  const [expanded, setExpanded] = useState(true);

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
    <div className="mb-6">
      {/* Header section with toggle */}
      <div 
        className="flex items-center justify-between cursor-pointer mb-2" 
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h3 className="font-medium text-gray-800 text-lg">{label}</h3>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      {expanded && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header row */}
          <div className="flex bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="w-1/2 font-medium text-sm text-gray-600">{keyLabel}</div>
            <div className="w-1/2 font-medium text-sm text-gray-600 pl-4">{valueLabel}</div>
          </div>
          
          {/* Key-value pairs */}
          <div className="p-2">
            {Object.entries(value).length > 0 ? (
              Object.entries(value).map(([key, val], index) => (
                <div 
                  key={index} 
                  className={`flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors ${
                    index !== Object.entries(value).length - 1 ? 'mb-1' : ''
                  }`}
                >
                  <div className="w-1/2 pr-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => handleKeyChange(key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                      placeholder="Enter key"
                    />
                  </div>
                  <div className="w-1/2 pl-2 flex">
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleValueChange(key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                      placeholder="Enter value"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePair(key)}
                      className="ml-2 p-2 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                      title="Remove pair"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 text-sm">
                No mapping.
              </div>
            )}
          </div>
          
          {/* Add button */}
          <div className="border-t border-gray-200 p-3 bg-gray-50">
            <button
              type="button"
              onClick={handleAddPair}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors"
            >
              <PlusCircle size={16} className="mr-2" />
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
    <div className="border border-gray-200 rounded-lg shadow-sm mb-4 overflow-hidden transition-all duration-300 hover:shadow-md">
      <button
        type="button"
        className="w-full flex justify-between items-center p-5 text-left font-medium bg-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-gray-800 font-semibold">{title}</span>
        <span className={`transform transition-transform duration-300 text-gray-500 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronUpIcon />
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="p-1 bg-white border-t border-gray-100">
          {children}
        </div>
      </div>
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