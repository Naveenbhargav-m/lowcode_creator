import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { ChevronDown, X, Check, Code, Type, Database } from 'lucide-react';

// Template processor for {{data.key}} syntax
const processTemplate = (template, data) => {
  if (typeof template !== 'string') return template;
  return template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    const keys = key.trim().split('.');
    let value = data;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return match;
    }
    return value;
  });
};

// Right Drawer Component
const RightDrawer = ({ isOpen, onClose, title, children }) => (
  <>
    {/* Backdrop */}
    {isOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-20 z-40 transition-opacity duration-200"
        onClick={onClose}
      />
    )}
    
    {/* Drawer */}
    <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-200 z-50 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto scrollbar-hide">
          {children}
        </div>
      </div>
    </div>
  </>
);

// Input Mode Selector
const InputModeSelector = ({ mode, onModeChange }) => {
  const modes = [
    { id: 'list', label: 'Select from List', icon: Database },
    { id: 'hardcode', label: 'Enter Value', icon: Type },
    { id: 'logic', label: 'Use Template', icon: Code }
  ];

  return (
    <div className="p-4 space-y-2">
      {modes.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onModeChange(id)}
          className={`w-full p-3 rounded-lg border transition-all text-left ${
            mode === id 
              ? 'border-blue-500 bg-blue-50 text-blue-700' 
              : 'border-gray-200 hover:border-gray-300 text-gray-600'
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className={`w-4 h-4 ${mode === id ? 'text-blue-500' : 'text-gray-400'}`} />
            <span className="font-medium text-sm">{label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

// Hardcode Input
const HardcodeInput = ({ value, onChange, multiSelect, placeholder }) => (
  <div className="p-4">
    {multiSelect ? (
      <div className="space-y-2">
        <textarea
          value={Array.isArray(value) ? value.join('\n') : ''}
          onChange={(e) => onChange(e.target.value.split('\n').filter(Boolean))}
          placeholder="Enter each value on a new line..."
          className="w-full h-32 p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
        />
        <p className="text-xs text-gray-500">One value per line</p>
      </div>
    ) : (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Enter value..."}
        className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
      />
    )}
  </div>
);

// Logic/Template Input
const LogicInput = ({ value, onChange, multiSelect, templateData }) => {
  const [preview, setPreview] = useState('');

  useEffect(() => {
    try {
      if (multiSelect && Array.isArray(value)) {
        const processed = value.map(v => processTemplate(v, templateData));
        setPreview(processed.join(', '));
      } else {
        setPreview(processTemplate(value || '', templateData));
      }
    } catch (error) {
      setPreview('Invalid template');
    }
  }, [value, templateData, multiSelect]);

  const commonTemplates = [
    '{{data.user_id}}',
    '{{data.user.name}}',
    '{{data.user.email}}',
    '{{data.timestamp}}'
  ];

  return (
    <div className="p-4 space-y-4">
      <div>
        {multiSelect ? (
          <textarea
            value={Array.isArray(value) ? value.join('\n') : ''}
            onChange={(e) => onChange(e.target.value.split('\n').filter(Boolean))}
            placeholder="{{data.user_id}}\n{{data.user.name}}"
            className="w-full h-24 p-3 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-blue-500 resize-none"
          />
        ) : (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="{{data.user_id}}"
            className="w-full p-3 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-blue-500"
          />
        )}
      </div>

      {/* Preview */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <h5 className="text-xs font-medium text-gray-600 mb-1">Preview</h5>
        <div className="text-sm text-gray-700 font-mono break-all">
          {preview || <span className="text-gray-400">Enter template to see preview</span>}
        </div>
      </div>

      {/* Common Templates */}
      <div>
        <h5 className="text-xs font-medium text-gray-600 mb-2">Quick Templates</h5>
        <div className="space-y-1">
          {commonTemplates.map((template, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (multiSelect) {
                  const current = Array.isArray(value) ? value : [];
                  onChange([...current, template]);
                } else {
                  onChange(template);
                }
              }}
              className="block w-full text-left p-2 text-xs font-mono text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              {template}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// List Selection Component
const ListSelection = ({ options, value, onChange, displayKey, valueKey, templateData, multiSelect }) => {
  const processedOptions = useMemo(() => {
    return options.map(opt => {
      if (typeof opt === 'string') {
        return processTemplate(opt, templateData);
      }
      if (typeof opt === 'object' && opt !== null) {
        const processed = {};
        Object.keys(opt).forEach(key => {
          processed[key] = processTemplate(opt[key], templateData);
        });
        return processed;
      }
      return opt;
    });
  }, [options, templateData]);

  const handleSelect = useCallback((option) => {
    const optionValue = valueKey ? option[valueKey] : option;
    
    if (multiSelect) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
    }
  }, [multiSelect, value, onChange, valueKey]);

  const isSelected = useCallback((option) => {
    const optionValue = valueKey ? option[valueKey] : option;
    if (multiSelect) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  }, [multiSelect, value, valueKey]);

  return (
    <div className="p-4">
      <div className="space-y-1 max-h-96 overflow-auto scrollbar-hide">
        {processedOptions.map((option, idx) => (
          <div
            key={idx}
            className={`p-3 cursor-pointer rounded-lg transition-colors flex items-center justify-between ${
              isSelected(option) ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'
            }`}
            onClick={() => handleSelect(option)}
          >
            <span className={`text-sm ${isSelected(option) ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
              {displayKey ? option[displayKey] : option}
            </span>
            {isSelected(option) && (
              <Check className="w-4 h-4 text-blue-500" />
            )}
          </div>
        ))}
        {processedOptions.length === 0 && (
          <div className="py-8 text-center text-gray-400 text-sm">
            No options available
          </div>
        )}
      </div>
    </div>
  );
};

// Main Value Picker Component
const ValuePicker = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select value", 
  multiSelect = false,
  displayKey = null,
  valueKey = null,
  templateData = {},
  className = ""
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [inputMode, setInputMode] = useState('list');
  const [tempValue, setTempValue] = useState(value);

  // Update temp value when external value changes
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleApply = () => {
    onChange(tempValue);
    setIsDrawerOpen(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsDrawerOpen(false);
  };

  const getDisplayText = () => {
    if (!value) return placeholder;
    
    if (multiSelect && Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      return `${value.length} selected`;
    }
    
    // For single values, try to find display text from options
    if (options.length > 0) {
      const option = options.find(opt => {
        const optValue = valueKey ? opt[valueKey] : opt;
        return optValue === value;
      });
      if (option) {
        return displayKey ? processTemplate(option[displayKey], templateData) : processTemplate(option, templateData);
      }
    }
    
    return processTemplate(String(value), templateData);
  };

  const renderDrawerContent = () => {
    switch (inputMode) {
      case 'hardcode':
        return (
          <HardcodeInput
            value={tempValue}
            onChange={setTempValue}
            multiSelect={multiSelect}
            placeholder={placeholder}
          />
        );
      case 'logic':
        return (
          <LogicInput
            value={tempValue}
            onChange={setTempValue}
            multiSelect={multiSelect}
            templateData={templateData}
          />
        );
      default:
        return (
          <ListSelection
            options={options}
            value={tempValue}
            onChange={setTempValue}
            displayKey={displayKey}
            valueKey={valueKey}
            templateData={templateData}
            multiSelect={multiSelect}
          />
        );
    }
  };

  return (
    <>
      {/* Trigger Field */}
      <div className={`relative ${className}`}>
        <div
          className="min-h-[40px] px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer transition-all hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200"
          onClick={() => setIsDrawerOpen(true)}
        >
          <div className="flex items-center justify-between">
            <span className={`text-sm ${value ? 'text-gray-800' : 'text-gray-500'}`}>
              {getDisplayText()}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Right Drawer */}
      <RightDrawer
        isOpen={isDrawerOpen}
        onClose={handleCancel}
        title={multiSelect ? "Select Multiple Values" : "Select Value"}
      >
        <div className="flex flex-col h-full">
          {/* Mode Selector */}
          <InputModeSelector mode={inputMode} onModeChange={setInputMode} />
          
          <div className="border-t border-gray-200" />
          
          {/* Content */}
          <div className="flex-1 overflow-auto scrollbar-hide">
            {renderDrawerContent()}
          </div>
          
          {/* Actions */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </RightDrawer>
    </>
  );
};

// Single Value Picker
const SingleValuePicker = (props) => (
  <ValuePicker {...props} multiSelect={false} />
);

// Multi Value Picker
const MultiValuePicker = (props) => (
  <ValuePicker {...props} multiSelect={true} />
);

// Demo Component
const SideDrawerPickersDemo = () => {
  const [singleValue, setSingleValue] = useState('');
  const [multiValues, setMultiValues] = useState([]);
  const [objSingleValue, setObjSingleValue] = useState('');
  const [objMultiValues, setObjMultiValues] = useState([]);

  // Sample data
  const stringOptions = [
    'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Kiwi'
  ];

  const objectOptions = [
    { name: 'John Doe {{data.suffix}}', value: 'john_doe', id: 1 },
    { name: 'Jane Smith {{data.suffix}}', value: 'jane_smith', id: 2 },
    { name: 'Bob Johnson', value: 'bob_johnson', id: 3 },
    { name: 'Alice Brown', value: 'alice_brown', id: 4 },
    { name: 'Charlie Wilson', value: 'charlie_wilson', id: 5 }
  ];

  const templateData = {
    data: {
      user_id: 123,
      suffix: '(Admin)',
      user: {
        name: 'Current User',
        email: 'user@example.com'
      },
      timestamp: new Date().toISOString()
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Value Picker Components</h1>
        <p className="text-gray-600">Click any field to select values from list, enter custom values, or use templates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* String Options */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Simple Options</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Single Selection
              </label>
              <SingleValuePicker
                options={stringOptions}
                value={singleValue}
                onChange={setSingleValue}
                placeholder="Choose a fruit"
                templateData={templateData}
              />
              <p className="text-xs text-gray-500 mt-1">Selected: {singleValue || 'None'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Multiple Selection
              </label>
              <MultiValuePicker
                options={stringOptions}
                value={multiValues}
                onChange={setMultiValues}
                placeholder="Choose multiple fruits"
                templateData={templateData}
              />
              <p className="text-xs text-gray-500 mt-1">
                Selected: {Array.isArray(multiValues) && multiValues.length ? multiValues.join(', ') : 'None'}
              </p>
            </div>
          </div>
        </div>

        {/* Object Options */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Advanced Options</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Single User Selection
              </label>
              <SingleValuePicker
                options={objectOptions}
                value={objSingleValue}
                onChange={setObjSingleValue}
                placeholder="Choose a user"
                displayKey="name"
                valueKey="value"
                templateData={templateData}
              />
              <p className="text-xs text-gray-500 mt-1">Selected: {objSingleValue || 'None'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Multiple User Selection
              </label>
              <MultiValuePicker
                options={objectOptions}
                value={objMultiValues}
                onChange={setObjMultiValues}
                placeholder="Choose multiple users"
                displayKey="name"
                valueKey="value"
                templateData={templateData}
              />
              <p className="text-xs text-gray-500 mt-1">
                Selected: {Array.isArray(objMultiValues) && objMultiValues.length ? objMultiValues.join(', ') : 'None'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Template Data Display */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Template Data</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <pre className="text-sm text-gray-700 overflow-x-auto">
            {JSON.stringify(templateData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SideDrawerPickersDemo;