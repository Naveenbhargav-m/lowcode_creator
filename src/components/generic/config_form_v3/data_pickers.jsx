import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { ChevronDown, X, Check, Code, Type, Database } from 'lucide-react';

// Template processor for {{data.key}} syntax
const processTemplate = (template, data) => {
    if(typeof template === "object") {
      let value = template["id"] || "";
      return value;
    }
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

  // Helper function to compare values (handles objects and primitives)
  const compareValues = (value1, value2, valueKey = null) => {
    // If both are objects and we have a valueKey, compare by that key
    if (valueKey && typeof value1 === 'object' && typeof value2 === 'object' && value1 && value2) {
      return value1[valueKey] === value2[valueKey];
    }
    
    // If both are objects without valueKey, do deep comparison of key properties
    if (typeof value1 === 'object' && typeof value2 === 'object' && value1 && value2) {
      // Try common identifier keys
      const identifierKeys = ['id', 'value', 'key'];
      for (const key of identifierKeys) {
        if (value1[key] !== undefined && value2[key] !== undefined) {
          return value1[key] === value2[key];
        }
      }
      // Fallback to JSON comparison (not ideal but works for simple objects)
      return JSON.stringify(value1) === JSON.stringify(value2);
    }
    
    // For primitives, direct comparison
    return value1 === value2;
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
  
  // List Selection Component - FIXED VERSION
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
        
        // Check if option is already selected
        const isAlreadySelected = currentValues.some(v => compareValues(v, optionValue, valueKey));
        
        const newValues = isAlreadySelected
          ? currentValues.filter(v => !compareValues(v, optionValue, valueKey))
          : [...currentValues, optionValue];
        onChange(newValues);
      } else {
        onChange(optionValue);
      }
    }, [multiSelect, value, onChange, valueKey]);
  
    // FIXED: Proper object comparison for selection state
    const isSelected = useCallback((option) => {
      const optionValue = valueKey ? option[valueKey] : option;
      
      if (multiSelect) {
        if (!Array.isArray(value)) return false;
        return value.some(v => compareValues(v, optionValue, valueKey));
      }
      
      return compareValues(value, optionValue, valueKey);
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
                  {displayKey 
                    ? option[displayKey] 
                    : (typeof option === 'object' ? (option.label || option.name || option.value || option.id || 'No label') : option)
                  }
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
  
// Main Value Picker Component - SELF-MANAGED STATE
const ValuePicker = ({ 
    field = {},
    value: initialValue, 
    onChange,
    // Legacy props for backward compatibility
    options = [], 
    placeholder = "Select value", 
    multiSelect = false,
    displayKey = null,
    valueKey = null,
    templateData = {},
    className = ""
  }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [inputMode, setInputMode] = useState('list');
    
    // SELF-MANAGED STATE - Component maintains its own state
    const [internalValue, setInternalValue] = useState(initialValue);
    const [tempValue, setTempValue] = useState(initialValue);
  
    // Extract configuration from field object or use legacy props
    const config = {
      options: field.options || options,
      placeholder: field.placeholder || placeholder,
      multiSelect: field.multiSelect || multiSelect,
      displayKey: field.displayKey || displayKey,
      valueKey: field.valueKey || valueKey,
      templateData: field.templateData || templateData,
      className: field.className || className,
      // New field-specific props
      enableStaticValues: field.enableStaticValues || false,
      enableSourceFields: field.enableSourceFields || false,
      enableUserFields: field.enableUserFields || false,
      enableTargetFieldExtension: field.enableTargetFieldExtension || false,
      target_fields: field.target_fields || [],
      source_fields: field.source_fields || [],
      dynamicConfig: field.dynamicConfig || []
    };
  
    // Only update internal state if initialValue changes (for initial setup or external resets)
    useEffect(() => {
      console.log("initial value:", initialValue, "internal value:", internalValue);
      // Use deep comparison for objects
      if (!compareValues(initialValue, internalValue, config.valueKey)) {
        setInternalValue(initialValue);
        setTempValue(initialValue);
      }
    }, [initialValue, internalValue, config.valueKey]);

    function handleOnChange(value) {
      setInternalValue(value);
      setTempValue(value);
      onChange(field.id, value);
    }
  
    const handleApply = () => {
      // Update internal state
      setInternalValue(tempValue);
      
      // Notify parent via onChange callback
      if (onChange) {
        if (field.id) {
          onChange(field.id, tempValue);
        } else {
          onChange(tempValue);
        }
      }
      
      setIsDrawerOpen(false);
    };
  
    const handleCancel = () => {
      setTempValue(internalValue); // Reset to current internal value
      setIsDrawerOpen(false);
    };
  
    const getDisplayText = () => {
      const displayValue = internalValue; // Use internal state for display
      
      if (!displayValue) return config.placeholder;
      
      if (config.multiSelect && Array.isArray(displayValue)) {
        if (displayValue.length === 0) return config.placeholder;
        return `${displayValue.length} selected`;
      }
      
      // For single values, try to find display text from options
      if (config.options.length > 0) {
        const option = config.options.find(opt => {
          const optValue = config.valueKey ? opt[config.valueKey] : opt;
          return compareValues(optValue, displayValue, config.valueKey);
        });
        if (option) {
          return config.displayKey ? processTemplate(option[config.displayKey], config.templateData) : processTemplate(option, config.templateData);
        }
      }
      
      // Fallback display for objects
      if (typeof displayValue === 'object' && displayValue) {
        return displayValue.label || displayValue.name || displayValue.value || displayValue.id || 'Selected';
      }
      
      return processTemplate(String(displayValue), config.templateData);
    };
    
    const renderDrawerContent = () => {
      switch (inputMode) {
        case 'hardcode':
          return (
            <HardcodeInput
              value={tempValue}
              onChange={handleOnChange}
              multiSelect={config.multiSelect}
              placeholder={config.placeholder}
            />
          );
        case 'logic':
          return (
            <LogicInput
              value={tempValue}
              onChange={handleOnChange}
              multiSelect={config.multiSelect}
              templateData={config.templateData}
            />
          );
        default:
          return (
            <ListSelection
              options={config.options}
              value={tempValue}
              onChange={handleOnChange}
              displayKey={config.displayKey}
              valueKey={config.valueKey}
              templateData={config.templateData}
              multiSelect={config.multiSelect}
              // Pass additional field config for extended functionality
              enableStaticValues={config.enableStaticValues}
              enableSourceFields={config.enableSourceFields}
              enableUserFields={config.enableUserFields}
              enableTargetFieldExtension={config.enableTargetFieldExtension}
              target_fields={config.target_fields}
              source_fields={config.source_fields}
            />
          );
      }
    };

    console.log("rendering value picker:", config.options);
  
    return (
      <>
        {/* Trigger Field */}
        <div className={`relative ${config.className}`}>
          <div
            className="min-h-[40px] px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer transition-all hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200"
            onClick={() => setIsDrawerOpen(true)}
          >
            <div className="flex items-center justify-between">
              <span className={`text-sm ${internalValue ? 'text-gray-800' : 'text-gray-500'}`}>
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
          title={config.multiSelect ? "Select Multiple Values" : "Select Value"}
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
  
  // Single Value Picker - Self-managed state
  const SingleValuePicker = ({ field, value, onChange, ...legacyProps }) => (
    <ValuePicker 
      field={field} 
      value={value} 
      onChange={onChange} 
      {...legacyProps} 
      multiSelect={false} 
    />
  );
  
  // Multi Value Picker - Self-managed state
  const MultiValuePicker = ({ field, value, onChange, ...legacyProps }) => (
    <ValuePicker 
      field={field} 
      value={value} 
      onChange={onChange} 
      {...legacyProps} 
      multiSelect={true} 
    />
  );

  // Export all components
  export { ValuePicker, SingleValuePicker, MultiValuePicker };