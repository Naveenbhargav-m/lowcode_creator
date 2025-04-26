import React from 'react';
import FieldRenderer from './formRenderer';

export const TextField = ({ 
  id, 
  label, 
  description, 
  value = '', 
  onChange, 
  type = 'text',
  required, 
  readOnly,
  placeholder,
  error 
}) => {
  return (
    <div className="field text-field">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-xs text-gray-500 mb-1">{description}</p>
      )}
      
      <input
        id={id}
        type={type}
        value={value || ''}
        // @ts-ignore
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        className={`w-full px-3 py-2 border ${
          error ? 'border-red-300' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        disabled={readOnly}
      />
    </div>
  );
};


// File: components/fields/ToggleField.jsx


export const ToggleField = ({ 
  id, 
  label, 
  description, 
  value = false, 
  onChange, 
  required, 
  readOnly 
}) => {
  return (
    <div className="field toggle-field flex items-center">
      <div className="flex h-5 items-center">
        <input
          id={id}
          type="checkbox"
          checked={value || false}
          // @ts-ignore
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          required={required}
          disabled={readOnly}
        />
      </div>
      <div className="ml-3 text-sm">
        {label && (
          <label 
            htmlFor={id} 
            className="font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {description && (
          <p className="text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
};


// File: components/fields/SelectField.jsx


export const SelectField = ({ 
  id, 
  label, 
  description, 
  value, 
  onChange, 
  options = [], 
  isMulti = false,
  isSearchable = false,
  required, 
  readOnly,
  placeholder = "Select..."
}) => {
  const handleChange = (e) => {
    if (isMulti) {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      onChange(selectedOptions);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div className="field select-field">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-xs text-gray-500 mb-1">{description}</p>
      )}
      
      <select
        id={id}
        value={value || (isMulti ? [] : '')}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        required={required}
        disabled={readOnly}
        multiple={isMulti}
      >
        <option value="" disabled={required}>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};


// File: components/fields/DateField.jsx


export const DateField = ({ 
  id, 
  label, 
  description, 
  value = '', 
  onChange, 
  format = 'YYYY-MM-DD', 
  required, 
  readOnly,
  error
}) => {
  return (
    <div className="field date-field">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-xs text-gray-500 mb-1">{description}</p>
      )}
      
      <input
        id={id}
        type="date"
        value={value || ''}
        // @ts-ignore
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border ${
          error ? 'border-red-300' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
        required={required}
        readOnly={readOnly}
        disabled={readOnly}
      />
    </div>
  );
};


// File: components/fields/TimeField.jsx



export const TimeField = ({ 
  id, 
  label, 
  description, 
  value = '', 
  onChange, 
  format = 'HH:mm', 
  required, 
  readOnly,
  error
}) => {
  return (
    <div className="field time-field">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-xs text-gray-500 mb-1">{description}</p>
      )}
      
      <input
        id={id}
        type="time"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border ${
          error ? 'border-red-300' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
        required={required}
        readOnly={readOnly}
        disabled={readOnly}
      />
    </div>
  );
};


export const ArrayField = ({ 
  id, 
  label, 
  description, 
  value = [], 
  onChange, 
  itemType = 'text', 
  itemConfig = {},
  addLabel = "Add Item",
  required, 
  readOnly
}) => {
  const handleAddItem = () => {
    onChange([...value, itemConfig.defaultValue || '']);
  };

  const handleRemoveItem = (index) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const handleItemChange = (index, itemValue) => {
    const newValue = [...value];
    newValue[index] = itemValue;
    onChange(newValue);
  };

  return (
    <div className="field array-field">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-xs text-gray-500 mb-1">{description}</p>
      )}
      
      <div className="space-y-2">
        {value && value.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-grow">
              {itemType === 'object' ? (
                // Handle complex item types with their own configuration
                Object.entries(itemConfig.fields || {}).map(([fieldKey, fieldConfig]) => (
                  <FieldRenderer
                    key={`${id}-${index}-${fieldKey}`}
                    error={""}
                    field={{
                      id: `${id}-${index}-${fieldKey}`,
                      ...fieldConfig
                    }}
                    value={item[fieldKey]}
                    onChange={(fieldValue) => {
                      const updatedItem = { ...item, [fieldKey]: fieldValue };
                      handleItemChange(index, updatedItem);
                    }}
                    readOnly={readOnly}
                  />
                ))
              ) : (
                // Handle simple item types
                <input
                  type={itemType}
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={readOnly}
                />
              )}
            </div>
            {!readOnly && (
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="p-1 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
      
      {!readOnly && (
        <button
          type="button"
          onClick={handleAddItem}
          className="mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {addLabel}
        </button>
      )}
    </div>
  );
};


// File: components/fields/ButtonGroupField.jsx


export const ButtonGroupField = ({ 
  id, 
  label, 
  description, 
  value, 
  onChange, 
  options = [], 
  required, 
  readOnly
}) => {
  return (
    <div className="field button-group-field">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-xs text-gray-500 mb-1">{description}</p>
      )}
      
      <div className="inline-flex rounded-md shadow-sm" role="group">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 text-sm font-medium ${
              value === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-300 ${
              options.indexOf(option) === 0 ? 'rounded-l-md' : ''
            } ${
              options.indexOf(option) === options.length - 1 ? 'rounded-r-md' : ''
            }`}
            disabled={readOnly}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export const ScheduleField = ({ 
  id, 
  label, 
  description, 
  value = {}, 
  onChange, 
  intervals = 30, // in minutes
  required, 
  readOnly
}) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Initialize schedule if empty
  const schedule = value || {};
  
  const toggleTimeSlot = (day, hour, minute) => {
    if (readOnly) return;
    
    const newSchedule = { ...schedule };
    
    if (!newSchedule[day]) {
      newSchedule[day] = {};
    }
    
    const timeKey = `${hour}:${minute === 0 ? '00' : minute}`;
    
    if (newSchedule[day][timeKey]) {
      delete newSchedule[day][timeKey];
      
      // Remove day if empty
      if (Object.keys(newSchedule[day]).length === 0) {
        delete newSchedule[day];
      }
    } else {
      newSchedule[day][timeKey] = true;
    }
    
    onChange(newSchedule);
  };
  
  return (
    <div className="field schedule-field">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-xs text-gray-500 mb-2">{description}</p>
      )}
      
      <div className="overflow-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-3 border border-gray-300">Time/Day</th>
              {days.map(day => (
                <th key={day} className="py-2 px-3 border border-gray-300">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map(hour => {
              const minutesInHour = 60;
              const intervalsInHour = minutesInHour / intervals;
              
              return Array.from({ length: intervalsInHour }, (_, i) => {
                const minute = i * intervals;
                const timeLabel = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                
                return (
                  <tr key={`${hour}-${minute}`}>
                    <td className="py-1 px-3 border border-gray-300 text-sm">{timeLabel}</td>
                    {days.map(day => {
                      const isSelected = schedule[day] && schedule[day][`${hour}:${minute === 0 ? '00' : minute}`];
                      
                      return (
                        <td 
                          key={`${day}-${hour}-${minute}`} 
                          className={`py-1 px-1 border border-gray-300 ${
                            isSelected ? 'bg-blue-500' : ''
                          } ${readOnly ? '' : 'cursor-pointer hover:bg-gray-100'}`}
                          onClick={() => toggleTimeSlot(day, hour, minute)}
                        >
                          {isSelected && <div className="w-full h-4 bg-blue-500"></div>}
                        </td>
                      );
                    })}
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// File: utils/formHelpers.js

export const processFormValues = (values, tabs) => {
  // Process values before saving (e.g., format dates, etc.)
  const processedValues = { ...values };
  
  // Process each field according to its type
  tabs.forEach(tab => {
    tab.sections.forEach(section => {
      section.fields.forEach(field => {
        const value = processedValues[field.id];
        
        if (value !== undefined) {
          switch (field.type) {
            case 'date':
              // Ensure consistent date format
              if (field.saveFormat && value) {
                // Implement date formatting logic here
              }
              break;
              
            case 'time':
              // Ensure consistent time format
              if (field.saveFormat && value) {
                // Implement time formatting logic here
              }
              break;
              
            // Add more type-specific processing as needed
          }
        }
      });
    });
  });
  
  return processedValues;
};

export const validateConfig = (values, tabs) => {
  const errors = {};
  
  tabs.forEach(tab => {
    tab.sections.forEach(section => {
      section.fields.forEach(field => {
        const value = values[field.id];
        
        // Check required fields
        if (field.required && (value === undefined || value === null || value === '')) {
          errors[field.id] = `${field.label || field.id} is required`;
        }
        
        // Check field-specific validation
        if (field.validate && value !== undefined) {
          const error = field.validate(value, values);
          if (error) {
            errors[field.id] = error;
          }
        }
        
        // Type-specific validation
        if (value !== undefined && value !== null && value !== '') {
          switch (field.type) {
            case 'email':
              if (!/\S+@\S+\.\S+/.test(value)) {
                errors[field.id] = 'Please enter a valid email address';
              }
              break;
              
            case 'number':
              if (isNaN(Number(value))) {
                errors[field.id] = 'Please enter a valid number';
              }
              if (field.min !== undefined && value < field.min) {
                errors[field.id] = `Value must be at least ${field.min}`;
              }
              if (field.max !== undefined && value > field.max) {
                errors[field.id] = `Value must be at most ${field.max}`;
              }
              break;
              
            // Add more type-specific validation as needed
          }
        }
      });
    });
  });
  
  return errors;
};
