import { useState, useEffect } from 'react';
import { X, Plus, Check, ChevronDown } from 'lucide-react';

// Main ConfigurableForm component
export default function ConfigurableForm({ config, initialData = {}, onSubmit, onChange }) {
  const [formData, setFormData] = useState(initialData);
  
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (key, value) => {
    const newData = { ...formData, [key]: value };
    setFormData(newData);
    if (onChange) onChange(newData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      {Array.isArray(config) && config.map((item, index) => {
        const fieldConfig = Object.values(item)[0];
        const fieldName = Object.keys(item)[0];
        
        if (!fieldConfig || !fieldConfig.key) return null;
        
        return (
          <FormField
            key={index}
            name={fieldName}
            config={fieldConfig}
            value={formData[fieldConfig.key]}
            onChange={(value) => handleChange(fieldConfig.key, value)}
          />
        );
      })}
      
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={() => setFormData(initialData)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

// Individual field component that renders different field types
function FormField({ name, config, value, onChange }) {
  const { type, label, placeholder, options, disabled, required, helperText, validation, className = '' } = config;

  const renderField = () => {
    switch (type) {
      case 'textfield':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || ''}
            disabled={disabled}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={placeholder || ''}
            disabled={disabled}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || ''}
            disabled={disabled}
            required={required}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'select':
        return (
          <div className="relative">
            <select
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              required={required}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">Select an option</option>
              {options && options.map((option, idx) => (
                <option key={idx} value={typeof option === 'object' ? option.value : option}>
                  {typeof option === 'object' ? option.label : option}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {options && options.map((option, idx) => {
              const optionValue = typeof option === 'object' ? option.value : option;
              const optionLabel = typeof option === 'object' ? option.label : option;
              
              return (
                <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={value === optionValue}
                    onChange={() => onChange(optionValue)}
                    disabled={disabled}
                    required={required}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{optionLabel}</span>
                </label>
              );
            })}
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled}
              required={required}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
            />
            <span>{placeholder || ''}</span>
          </label>
        );

      case 'checkboxGroup':
        return (
          <div className="space-y-2">
            {options && options.map((option, idx) => {
              const optionValue = typeof option === 'object' ? option.value : option;
              const optionLabel = typeof option === 'object' ? option.label : option;
              const isChecked = Array.isArray(value) && value.includes(optionValue);
              
              const handleCheckboxChange = (checked) => {
                if (!Array.isArray(value)) {
                  onChange(checked ? [optionValue] : []);
                  return;
                }
                
                if (checked) {
                  onChange([...value, optionValue]);
                } else {
                  onChange(value.filter(v => v !== optionValue));
                }
              };
              
              return (
                <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => handleCheckboxChange(e.target.checked)}
                    disabled={disabled}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span>{optionLabel}</span>
                </label>
              );
            })}
          </div>
        );

      case 'toggle':
        return (
          <label className="inline-flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                required={required}
                className="sr-only"
              />
              <div className={`block w-10 h-6 rounded-full ${value ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${value ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className="ml-2">{placeholder || ''}</span>
          </label>
        );

      case 'textList':
        const listItems = Array.isArray(value) ? value : [];
        
        return (
          <div className="space-y-2">
            {listItems.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item || ''}
                  onChange={(e) => {
                    const newList = [...listItems];
                    newList[idx] = e.target.value;
                    onChange(newList);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newList = [...listItems];
                    newList.splice(idx, 1);
                    onChange(newList);
                  }}
                  className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onChange([...listItems, ''])}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
            >
              <Plus size={16} />
              <span>Add Item</span>
            </button>
          </div>
        );

      case 'dynamic':
        const dynamicItems = Array.isArray(value) ? value : [];
        const { fields = [] } = config;
        
        return (
          <div className="space-y-4 border p-4 rounded-md bg-gray-50">
            {dynamicItems.map((item, idx) => (
              <div key={idx} className="p-3 bg-white rounded-md shadow-sm relative">
                <button
                  type="button"
                  onClick={() => {
                    const newItems = [...dynamicItems];
                    newItems.splice(idx, 1);
                    onChange(newItems);
                  }}
                  className="absolute right-2 top-2 p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100"
                >
                  <X size={16} />
                </button>
                
                <div className="space-y-4 mt-6">
                  {fields.map((field, fieldIdx) => {
                    const fieldConfig = field.config;
                    return (
                      <div key={fieldIdx} className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">{field.label || fieldConfig.label}</label>
                        <FormField
                          config={fieldConfig}
                          value={item[fieldConfig.key]}
                          onChange={(fieldValue) => {
                            const newItems = [...dynamicItems];
                            newItems[idx] = { ...newItems[idx], [fieldConfig.key]: fieldValue };
                            onChange(newItems);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => {
                const newItem = {};
                fields.forEach(field => {
                  newItem[field.config.key] = field.config.defaultValue || '';
                });
                onChange([...dynamicItems, newItem]);
              }}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
            >
              <Plus size={16} />
              <span>Add Item</span>
            </button>
          </div>
        );

      case 'buttonGroup':
        return (
          <div className="flex flex-wrap gap-2">
            {options && options.map((option, idx) => {
              const optionValue = typeof option === 'object' ? option.value : option;
              const optionLabel = typeof option === 'object' ? option.label : option;
              const isSelected = value === optionValue;
              
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange(optionValue)}
                  disabled={disabled}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isSelected 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {optionLabel}
                </button>
              );
            })}
          </div>
        );

      case 'mapping':
        const mappingData = value || {};
        const keys = Object.keys(mappingData);
        
        return (
          <div className="space-y-3">
            {keys.map((key, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={key}
                  onChange={(e) => {
                    const newMapping = { ...mappingData };
                    const oldValue = newMapping[key];
                    delete newMapping[key];
                    newMapping[e.target.value] = oldValue;
                    onChange(newMapping);
                  }}
                  placeholder="Key"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={mappingData[key] || ''}
                    onChange={(e) => {
                      const newMapping = { ...mappingData };
                      newMapping[key] = e.target.value;
                      onChange(newMapping);
                    }}
                    placeholder="Value"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newMapping = { ...mappingData };
                      delete newMapping[key];
                      onChange(newMapping);
                    }}
                    className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newKey = '';
                const newMapping = { ...mappingData, [newKey]: '' };
                onChange(newMapping);
              }}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
            >
              <Plus size={16} />
              <span>Add Key-Value Pair</span>
            </button>
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'time':
        return (
          <input
            type="time"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              onChange(file);
            }}
            disabled={disabled}
            required={required}
            className="block w-full text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'color':
        return (
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            required={required}
            className="w-12 h-8 rounded-md border border-gray-300"
          />
        );

      case 'range':
        const { min = 0, max = 100, step = 1 } = config;
        return (
          <div className="flex items-center space-x-3">
            <input
              type="range"
              value={value ?? min}
              min={min}
              max={max}
              step={step}
              onChange={(e) => onChange(Number(e.target.value))}
              disabled={disabled}
              required={required}
              className="flex-1"
            />
            <span className="text-gray-700 w-10 text-center">{value ?? min}</span>
          </div>
        );

      default:
        return <div className="text-red-500">Unknown field type: {type}</div>;
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {renderField()}
      
      {helperText && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}

// Usage Example Component
export function FormExample() {
  const formConfig = [
    { "Name": {"type": "textfield", "key": "name", "label": "Product Name", "required": true} },
    { "Age": {"type": "number", "key": "age", "label": "Stock Age", "helperText": "Age in days"} },
    { "Description": {"type": "textarea", "key": "description", "label": "Product Description"} },
    { "Category": {"type": "select", "key": "category", "label": "Category", 
      "options": [
        {"label": "Electronics", "value": "electronics"},
        {"label": "Clothing", "value": "clothing"},
        {"label": "Food", "value": "food"}
      ]
    }},
    { "Status": {"type": "radio", "key": "status", "label": "Status", 
      "options": [
        {"label": "In Stock", "value": "in_stock"},
        {"label": "Out of Stock", "value": "out_of_stock"},
        {"label": "Discontinued", "value": "discontinued"}
      ]
    }},
    { "Featured": {"type": "toggle", "key": "featured", "label": "Featured Product"} },
    { "Tags": {"type": "textList", "key": "tags", "label": "Product Tags"} },
    { "Color": {"type": "color", "key": "color", "label": "Product Color"} },
    { "Price Range": {"type": "range", "key": "priceRange", "label": "Price Range", "min": 0, "max": 1000, "step": 10} }
  ];

  const initialData = {
    "name": "Apples",
    "age": 20,
    "description": "Fresh red apples",
    "featured": true,
    "tags": ["fruit", "fresh", "organic"]
  };

  const handleSubmit = (data) => {
    console.log("Form submitted:", data);
    alert("Form submitted! Check console for data.");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Configurable Form Example</h1>
      <ConfigurableForm 
        config={formConfig}
        initialData={initialData}
        onSubmit={handleSubmit}
        onChange={handleSubmit}
      />
    </div>
  );
}