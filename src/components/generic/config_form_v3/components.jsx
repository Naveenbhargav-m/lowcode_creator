import { Calendar, ChevronDown, ChevronUp, Clock, Palette, Plus, X , Edit2, Trash2, Check} from "lucide-react";
import { useEffect, useState } from "preact/hooks";
import GlobalSignalsPopup from "../../../state_components/global_popup";
import { data_map } from "../../../states/global_repo";

export const styles = {
    container: "w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md",
    header: "flex justify-between items-center p-4 border-b border-gray-200",
    title: "text-xl font-semibold text-gray-800",
    formContainer: "p-2",
    tabsContainer: "flex mb-6 border-b border-gray-200",
    tab: "px-4 py-2 mr-2 font-medium cursor-pointer transition-all",
    activeTab: "border-b-2 border-blue-500 text-blue-600",
    inactiveTab: "text-gray-600 hover:text-gray-800",
    accordion: "mb-4 border border-gray-200 rounded-md overflow-hidden",
    accordionHeader: "flex justify-between items-center p-4 bg-gray-50 cursor-pointer",
    accordionTitle: "font-medium text-gray-700",
    accordionContent: "p-2 border-t border-gray-200 bg-white",
    fieldGroup: "mb-4",
    fieldLabel: "block mb-2 text-sm font-medium text-gray-700",
    textInput: "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
    numberInput: "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
    selectInput: "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
    checkboxContainer: "flex items-center",
    checkbox: "w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2",
    buttonGroup: "flex justify-end mt-6 space-x-2",
    button: "px-4 py-2 rounded-md font-medium transition-colors",
    primaryButton: "bg-blue-600 text-white hover:bg-blue-700",
    secondaryButton: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    jsonEditor: "w-full h-64 p-2 font-mono text-sm border border-gray-300 rounded-md",
    jsonEditorHeader: "flex justify-between items-center mb-2",
    modeSwitcher: "flex items-center text-sm text-blue-600 cursor-pointer",
    error: "mt-1 text-sm text-red-600",
    fieldContainer: "mb-5 w-full",
    fieldInput: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200",
    colorFieldContainer: "flex items-center gap-3",
  colorInput: "h-10 w-14 cursor-pointer rounded-md border border-gray-300 p-1 shadow-sm",
  colorTextInput: "flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
  
  // Array field
  arrayFieldContainer: "space-y-2 w-full",
  arrayItemContainer: "flex items-center gap-2",
  arrayItemInput: "flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
  arrayItemRemoveButton: "flex items-center justify-center h-9 w-9 bg-gray-100 hover:bg-red-100 rounded-md text-gray-600 hover:text-red-600 transition-colors duration-200 border border-gray-300",
  arrayAddButton: "px-4 py-2 mt-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-200 transition-colors duration-200 flex items-center gap-1",
  
  // Static Key-Value field
  staticKeyValueContainer: "space-y-2 w-full",
  keyValueRow: "flex items-center gap-4",
  keyColumn: "w-1/3 font-medium text-gray-700",
  valueColumn: "w-2/3",
  keyValueInput: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
  
  // Dynamic Key-Value field
  dynamicKeyValueContainer: "space-y-2 w-full",
  dynamicKeyValueRow: "flex items-center gap-2",
  dynamicKeyInput: "w-2/5 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
  dynamicValueInput: "w-3/5 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
  dynamicPairRemoveButton: "flex items-center justify-center h-9 w-9 bg-gray-100 hover:bg-red-100 rounded-md text-gray-600 hover:text-red-600 transition-colors duration-200 border border-gray-300",
  dynamicPairAddButton: "px-4 py-2 mt-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-200 transition-colors duration-200 flex items-center gap-1",
  
  // Date field
  dateFieldContainer: "relative",
  dateInput: "w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
  calendarIcon: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none",
  
  // Time field
  timeFieldContainer: "relative",
  timeInput: "w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
  clockIcon: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none",
  
  // SubForm field
  subFormContainer: "border border-gray-200 rounded-lg p-4 bg-gray-50",
  subFormLabel: "font-medium text-gray-800 mb-3 pb-2 border-b border-gray-200",
  subFormContent: "space-y-4",

    
  };



  // @ts-ignore
  // @ts-ignore
  var stylesobj = {
    container: {
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      backgroundColor: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    title: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#111827',
      margin: 0
    },
    addButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      backgroundColor: '#6366f1',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
    },
    addButtonHover: {
      backgroundColor: '#4f46e5',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    optionsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxHeight: '400px',
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingRight: '4px'
    },
    optionItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '10px',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
    },
    optionItemHover: {
      borderColor: '#d1d5db',
      boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)'
    },
    optionItemEditing: {
      backgroundColor: '#f8faff',
      borderColor: '#6366f1',
      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transform: 'scale(1.01)'
    },
    input: {
      flex: 1,
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.2s ease',
      backgroundColor: '#ffffff'
    },
    inputFocus: {
      borderColor: '#6366f1',
      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)'
    },
    optionDisplay: {
      flex: 1,
      padding: '8px 12px',
      fontSize: '14px',
      color: '#374151',
      backgroundColor: 'transparent',
      border: 'none',
      textAlign: 'left'
    },
    buttonGroup: {
      display: 'flex',
      gap: '6px'
    },
    iconButton: {
      padding: '8px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      width: '32px',
      height: '32px'
    },
    editButton: {
      backgroundColor: '#f3f4f6',
      color: '#6b7280'
    },
    editButtonHover: {
      backgroundColor: '#e5e7eb',
      color: '#374151',
      transform: 'scale(1.05)'
    },
    deleteButton: {
      backgroundColor: '#fef2f2',
      color: '#dc2626'
    },
    deleteButtonHover: {
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
      transform: 'scale(1.05)'
    },
    saveButton: {
      backgroundColor: '#ecfdf5',
      color: '#059669'
    },
    saveButtonHover: {
      backgroundColor: '#d1fae5',
      color: '#047857',
      transform: 'scale(1.05)'
    },
    cancelButton: {
      backgroundColor: '#f3f4f6',
      color: '#6b7280'
    },
    cancelButtonHover: {
      backgroundColor: '#e5e7eb',
      color: '#374151',
      transform: 'scale(1.05)'
    },
    emptyState: {
      textAlign: 'center',
      padding: '32px',
      color: '#9ca3af',
      fontSize: '14px',
      fontStyle: 'italic'
    },
    fieldLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#6b7280',
      marginBottom: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.025em'
    }
  };
  
  // Field components - same as original
  export const TextField = ({ field, value, onChange }) => (
    <input
      type="text"
      id={field.id}
      value={value || ''}
      onChange={(e) => onChange(field.id, e.target["value"])}
      placeholder={field.placeholder}
      className={styles.textInput}
      disabled={field.disabled}
    />
  );
  
  export const NumberField = ({ field, value, onChange }) => (
    <input
      type="number"
      id={field.id}
      value={value || ''}
      onChange={(e) => onChange(field.id, e.target["value"])}
      min={field.min}
      max={field.max}
      step={field.step || 1}
      placeholder={field.placeholder}
      className={styles.numberInput}
      disabled={field.disabled}
    />
  );
  
  export const SelectField = ({ field, value, onChange }) => (
    <select
      id={field.id}
      value={value || ''}
      onChange={(e) => onChange(field.id, e.target["value"])}
      className={styles.selectInput}
      disabled={field.disabled}
    >
      {field.placeholder && (
        <option value="" disabled>
          {field.placeholder}
        </option>
      )}
      {field.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
  
  export const CheckboxField = ({ field, value, onChange }) => (
    <div className={styles.checkboxContainer}>
      <input
        type="checkbox"
        id={field.id}
        checked={!!value}
        // @ts-ignore
        onChange={(e) => onChange(field.id, e.target.checked)}
        className={styles.checkbox}
        disabled={field.disabled}
      />
      <label htmlFor={field.id} className="text-sm text-gray-700">
        {field.checkboxLabel}
      </label>
    </div>
  );
  
  // Accordion component - same as original
  export const Accordion = ({ title, children, isOpen, toggle }) => (
    <div className={styles.accordion}>
      <div className={styles.accordionHeader} onClick={toggle}>
        <h3 className={styles.accordionTitle}>{title}</h3>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      {isOpen && <div className={styles.accordionContent}>{children}</div>}
    </div>
  );
  
// 1. Color Picker
// 1. Color Field - Modernized
export const ColorField = ({ field, value, onChange }) => (
    <div className={styles.colorFieldContainer}>
      <div className="relative">
        <input
          type="color"
          id={field.id}
          value={value || '#000000'}
          onChange={(e) => onChange(field.id, e.target["value"])}
          className={styles.colorInput}
          disabled={field.disabled}
        />
        <div className="absolute -right-1 -top-1">
          <Palette size={16} className="text-gray-500" />
        </div>
      </div>
      <input
        type="text"
        value={value || '#000000'}
        onChange={(e) => {
          // Validate hex color format
          const colorRegex = /^#([0-9A-F]{3}){1,2}$/i;
          if (colorRegex.test(e.target["value"]) || e.target["value"] === '#') {
            onChange(field.id, e.target["value"]);
          }
        }}
        className={styles.colorTextInput}
        disabled={field.disabled}
        placeholder={field.placeholder || 'Enter color hex'}
      />
    </div>
  );

  // Modern ArrayField Component
export const ArrayField = ({ field, value, onChange }) => {
  const items = value || [];

  const handleAddItem = () => {
    onChange(field.id, [...items, '']);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(field.id, newItems);
  };

  const handleItemChange = (index, newValue) => {
    const newItems = [...items];
    newItems[index] = newValue;
    onChange(field.id, newItems);
  };

  return (
    <div className="w-full space-y-3 overflow-hidden">
      {items.length === 0 && (
        <div className="text-sm text-gray-500 italic py-2 px-2">No items added yet</div>
      )}
      
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 min-w-0">
            <input
              type="text"
              value={item}
              // @ts-ignore
              onChange={(e) => handleItemChange(index, e.target.value)}
              placeholder={field.itemPlaceholder || 'Enter value'}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-0"
              disabled={field.disabled}
            />
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors flex-shrink-0"
              disabled={field.disabled}
              aria-label="Remove item"
              title="Remove item"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      
      <button
        type="button"
        onClick={handleAddItem}
        className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors min-w-0"
        disabled={field.disabled}
      >
        <Plus size={16} className="flex-shrink-0" />
        <span className="truncate">{field.addButtonText || 'Add Item'}</span>
      </button>
    </div>
  );
};


  // 3. Static Key-Value Pair Field - Modernized
  export const StaticKeyValueField = ({ field, value, onChange }) => {
    const [pairs, setPairs] = useState({});
    const [keys, setKeys] = useState([]);    
    
    useEffect(() => {
      const data = value || {};
      const myKeys = field?.keys || [];
      
      // Debug logs
      console.log("StaticKeyValueField - Field:", field);
      console.log("StaticKeyValueField - Value:", value);
      console.log("StaticKeyValueField - Keys:", myKeys);
      console.log("StaticKeyValueField - Data:", data);
      
      setPairs({...data});
      setKeys([...myKeys]);
      
      // Ensure parent state is initialized if empty
      if (Object.keys(data).length === 0 && myKeys.length > 0) {
        const initialPairs = {};
        myKeys.forEach(key => {
          initialPairs[key] = '';
        });
        onChange?.(field.id, initialPairs);
      }
    }, [field, value]);
  
    const handleValueChange = (key, newValue) => {
      const updatedPairs = { ...pairs, [key]: newValue };
      setPairs(updatedPairs);
      onChange?.(field.id, updatedPairs);
    };
  
    // Debug render
    console.log("Rendering StaticKeyValueField - Keys:", keys, "Pairs:", pairs);
  
    // Early return if no keys
    if (!keys || keys.length === 0) {
      return (
        <div className={styles.staticKeyValueContainer}>
          <div>No keys defined for this field</div>
        </div>
      );
    }
  
    return (
      <div className={styles.staticKeyValueContainer}>
        {keys.map((key) => (
          <div key={key} className={styles.keyValueRow}>
            <div className={styles.keyColumn}>{key}</div>
            <div className={styles.valueColumn}>
              <input
                type="text"
                value={pairs[key] || ''}
                // @ts-ignore
                onChange={(e) => handleValueChange(key, e.target.value)}
                placeholder={field.valuePlaceholder || 'Enter value'}
                className={styles.keyValueInput}
                disabled={field.disabled}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };
  // 4. Dynamic Key-Value Pairs Field - Modernized
  export const DynamicKeyValueField = ({ field, value, onChange }) => {
    const pairs = value || {};
    const pairsArray = Object.entries(pairs);
  
    const handleAddPair = () => {
      // Create a unique key name
      const newKey = `key${Object.keys(pairs).length + 1}`;
      const newValue = '';
      onChange(field.id, { ...pairs, [newKey]: newValue });
    };
  
    const handleRemovePair = (key) => {
      const newPairs = { ...pairs };
      delete newPairs[key];
      onChange(field.id, newPairs);
    };
  
    const handleKeyChange = (oldKey, newKey) => {
      if (oldKey === newKey) return;
      
      const newPairs = {};
      Object.entries(pairs).forEach(([k, v]) => {
        if (k === oldKey) {
          newPairs[newKey] = v;
        } else {
          newPairs[k] = v;
        }
      });
      
      onChange(field.id, newPairs);
    };
  
    const handleValueChange = (key, newValue) => {
      onChange(field.id, { ...pairs, [key]: newValue });
    };
  
    return (
      <div className={styles.dynamicKeyValueContainer}>
        {pairsArray.length === 0 && (
          <div className="text-sm text-gray-500 italic mb-2">No key-value pairs added yet</div>
        )}
        
        {pairsArray.map(([key, value], index) => (
          <div key={index} className={styles.dynamicKeyValueRow}>
            <input
              type="text"
              value={key}
              onChange={(e) => handleKeyChange(key, e.target["value"])}
              placeholder={field.keyPlaceholder || 'Key'}
              className={styles.dynamicKeyInput}
              disabled={field.disabled}
            />
            <input
              type="text"
              value={value}
              onChange={(e) => handleValueChange(key, e.target["value"])}
              placeholder={field.valuePlaceholder || 'Value'}
              className={styles.dynamicValueInput}
              disabled={field.disabled}
            />
            <button
              type="button"
              onClick={() => handleRemovePair(key)}
              className={styles.dynamicPairRemoveButton}
              disabled={field.disabled}
              aria-label="Remove pair"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddPair}
          className={styles.dynamicPairAddButton}
          disabled={field.disabled}
        >
          <Plus size={16} />
          <span>{field.addButtonText || 'Add Key-Value Pair'}</span>
        </button>
      </div>
    );
  };
  
  // 5. Date Picker Field - Modernized
  export const DateField2 = ({ field, value, onChange }) => {
    // Split date into day, month, year for separate inputs
    const [date, setDate] = useState({
      day: '',
      month: '',
      year: ''
    });
    
    // Format the incoming date value
    useEffect(() => {
      if (value) {
        try {
          const dateObj = value instanceof Date ? value : new Date(value);
          if (!isNaN(dateObj.getTime())) {
            setDate({
              day: String(dateObj.getDate()).padStart(2, '0'),
              month: String(dateObj.getMonth() + 1).padStart(2, '0'),
              year: String(dateObj.getFullYear())
            });
          }
        } catch (e) {
          console.error("Error parsing date:", e);
        }
      } else {
        setDate({ day: '', month: '', year: '' });
      }
    }, [value]);
    
    // Update the date when any part changes
    const handlePartChange = (part, newValue) => {
      // Create a new date object
      const newDate = { ...date, [part]: newValue };
      setDate(newDate);
      
      // Only call onChange if we have all three parts
      if (newDate.day && newDate.month && newDate.year) {
        // Create a real Date object (note: months are 0-indexed in JS)
        const dateObj = new Date(
          parseInt(newDate.year), 
          parseInt(newDate.month) - 1, 
          parseInt(newDate.day)
        );
        onChange(field.id, dateObj);
      }
    };
    
    return (
      <div className="flex items-center space-x-1">
        <input
          type="text"
          placeholder="DD"
          value={date.day}
          // @ts-ignore
          onChange={(e) => handlePartChange('day', e.target.value)}
          className="w-12 p-2 border rounded text-center"
          maxLength={2}
        />
        <span>/</span>
        <input
          type="text"
          placeholder="MM"
          value={date.month}
          // @ts-ignore
          onChange={(e) => handlePartChange('month', e.target.value)}
          className="w-12 p-2 border rounded text-center"
          maxLength={2}
        />
        <span>/</span>
        <input
          type="text"
          placeholder="YYYY"
          value={date.year}
          // @ts-ignore
          onChange={(e) => handlePartChange('year', e.target.value)}
          className="w-16 p-2 border rounded text-center"
          maxLength={4}
        />
        {field.showCalendarIcon && (
          <div className="ml-2">
            <Calendar size={18} className="text-gray-500" />
          </div>
        )}
      </div>
    );
  };
  
  export const TimeField2 = ({ field, value, onChange }) => {
    // Split time into hours and minutes
    const [time, setTime] = useState({
      hours: '',
      minutes: '',
      seconds: ''
    });
    
    // Format the incoming time value
    useEffect(() => {
      if (value) {
        try {
          // Handle time in HH:MM or HH:MM:SS format
          const parts = value.split(':');
          setTime({
            hours: parts[0] || '',
            minutes: parts[1] || '',
            seconds: parts[2] || ''
          });
        } catch (e) {
          console.error("Error parsing time:", e);
        }
      } else {
        setTime({ hours: '', minutes: '', seconds: '' });
      }
    }, [value]);
    
    // Update the time when any part changes
    const handlePartChange = (part, newValue) => {
      // Create a new time object
      const newTime = { ...time, [part]: newValue };
      setTime(newTime);
      
      // Format as HH:MM:SS or HH:MM depending on seconds
      let timeString = `${newTime.hours.padStart(2, '0')}:${newTime.minutes.padStart(2, '0')}`;
      if (field.showSeconds && newTime.seconds) {
        timeString += `:${newTime.seconds.padStart(2, '0')}`;
      }
      
      onChange(field.id, timeString);
    };
    
    return (
      <div className="flex items-center space-x-1">
        <input
          type="text"
          placeholder="HH"
          value={time.hours}
          // @ts-ignore
          onChange={(e) => handlePartChange('hours', e.target.value)}
          className="w-12 p-2 border rounded text-center"
          maxLength={2}
        />
        <span>:</span>
        <input
          type="text"
          placeholder="MM"
          value={time.minutes}
          // @ts-ignore
          onChange={(e) => handlePartChange('minutes', e.target.value)}
          className="w-12 p-2 border rounded text-center"
          maxLength={2}
        />
        {field.showSeconds && (
          <>
            <span>:</span>
            <input
              type="text"
              placeholder="SS"
              value={time.seconds}
              // @ts-ignore
              onChange={(e) => handlePartChange('seconds', e.target.value)}
              className="w-12 p-2 border rounded text-center"
              maxLength={2}
            />
          </>
        )}
        {field.showClockIcon && (
          <div className="ml-2">
            <Clock size={18} className="text-gray-500" />
          </div>
        )}
      </div>
    );
  };
  
  export const DateField = ({ field, value, onChange }) => {
    // Initialize with a valid date string or empty string
    const [dateValue, setDateValue] = useState('');
    
    // Initialize component
    useEffect(() => {
      // If we have a value, format it, otherwise use empty string
      if (value) {
        try {
          // Handle both Date objects and ISO strings
          const date = value instanceof Date ? value : new Date(value);
          
          // Check if valid date
          if (!isNaN(date.getTime())) {
            // Format as YYYY-MM-DD for input[type="date"]
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            setDateValue(`${year}-${month}-${day}`);
          } else {
            setDateValue('');
          }
        } catch (e) {
          console.error("Error formatting date:", e);
          setDateValue('');
        }
      } else {
        setDateValue('');
      }
    }, [value]);
    
    // Handle date change
    const handleDateChange = (e) => {
      const newValue = e.target.value;
      setDateValue(newValue);
      
      // Only create a Date object if we have a value
      if (newValue) {
        const [year, month, day] = newValue.split('-');
        // Note: JS months are 0-indexed, so subtract 1 from month
        const dateObject = new Date(year, parseInt(month) - 1, day);
        onChange(field.id, dateObject);
      } else {
        onChange(field.id, null);
      }
    };
    
    return (
      <div className="relative flex items-center">
        <input
          type="date"
          id={field.id}
          value={dateValue}
          onChange={handleDateChange}
          // @ts-ignore
          onClick={(e) => e.target.showPicker && e.target.showPicker()}
          className="w-full p-2 pr-8 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          min={field.min}
          max={field.max}
          disabled={field.disabled}
        />
        {field.showCalendarIcon && (
          <div 
            className="absolute right-2 cursor-pointer"
            onClick={() => {
              const input = document.getElementById(field.id);
              // @ts-ignore
              if (input && input.showPicker) {
                // @ts-ignore
                input.showPicker();
              }
            }}
          >
            <Calendar size={18} className="text-gray-500" />
          </div>
        )}
      </div>
    );
  };
  
  export const TimeField = ({ field, value, onChange }) => {
    // Internal state to handle the time
    const [timeValue, setTimeValue] = useState('');
    
    // Initialize component
    useEffect(() => {
      if (value) {
        // Handle time string in HH:MM or HH:MM:SS format
        setTimeValue(value);
      } else {
        setTimeValue('');
      }
    }, [value]);
    
    // Handle time change
    const handleTimeChange = (e) => {
      const newValue = e.target.value;
      setTimeValue(newValue);
      onChange(field.id, newValue);
    };
    
    return (
      <div className="relative flex items-center">
        <input
          type="time"
          id={field.id}
          value={timeValue}
          onChange={handleTimeChange}
          // @ts-ignore
          onClick={(e) => e.target.showPicker && e.target.showPicker()}
          className="w-full p-2 pr-8 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={field.disabled}
          step={field.showSeconds ? 1 : 60} // Show seconds if specified
        />
        {field.showClockIcon && (
          <div 
            className="absolute right-2 cursor-pointer"
            onClick={() => {
              const input = document.getElementById(field.id);
              // @ts-ignore
              if (input && input.showPicker) {
                // @ts-ignore
                input.showPicker();
              }
            }}
          >
            <Clock size={18} className="text-gray-500" />
          </div>
        )}
      </div>
    );
  };
  
  // 7. SubForm Field - New component
  export const SubFormField = ({ field, value, onChange }) => {
    const subFormData = value || {};
    const subFields = field.fields || [];
    
    const handleFieldChange = (fieldId, fieldValue) => {
      onChange(field.id, { ...subFormData, [fieldId]: fieldValue });
    };
    
    // Render appropriate field component based on type
    const renderField = (subField) => {
      const subFieldValue = subFormData[subField.id];
      
      switch (subField.type) {
        case 'text':
          return (
            <input
              type="text"
              value={subFieldValue || ''}
              onChange={(e) => handleFieldChange(subField.id, e.target["value"])}
              placeholder={subField.placeholder || ''}
              className={styles.fieldInput}
              disabled={subField.disabled || field.disabled}
            />
          );
        case 'number':
          return (
            <input
              type="number"
              value={subFieldValue || ''}
              onChange={(e) => handleFieldChange(subField.id, e.target["value"])}
              placeholder={subField.placeholder || ''}
              className={styles.fieldInput}
              min={subField.min}
              max={subField.max}
              disabled={subField.disabled || field.disabled}
            />
          );
        case 'color':
          return (
            <ColorField
              field={subField}
              value={subFieldValue}
              onChange={handleFieldChange}
            />
          );
        case 'date':
          return (
            <DateField
              field={subField}
              value={subFieldValue}
              onChange={handleFieldChange}
            />
          );
        case 'time':
          return (
            <TimeField
              field={subField}
              value={subFieldValue}
              onChange={handleFieldChange}
            />
          );
        // Add other field types as needed
        default:
          return (
            <input
              type="text"
              value={subFieldValue || ''}
              onChange={(e) => handleFieldChange(subField.id, e.target["value"])}
              placeholder={subField.placeholder || ''}
              className={styles.fieldInput}
              disabled={subField.disabled || field.disabled}
            />
          );
      }
    };
    
    return (
      <div className={styles.subFormContainer}>
        {field.label && (
          <div className={styles.subFormLabel}>{field.label}</div>
        )}
        <div className={styles.subFormContent}>
          {subFields.map((subField) => (
            <div key={subField.id} className={styles.fieldContainer}>
              {subField.label && (
                <label htmlFor={subField.id} className={styles.fieldLabel}>
                  {subField.label}
                  {subField.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              )}
              {renderField(subField)}
              {subField.helperText && (
                <div className="mt-1 text-xs text-gray-500">{subField.helperText}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  

// Modern OptionsListField Component
export const OptionsListField = ({ field, value, onChange }) => {
  const [options, setOptions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingValues, setEditingValues] = useState({});

  const config = field.optionsConfig || {
    valueKey: 'value',
    labelKey: 'label',
    valueLabel: 'Value',
    labelLabel: 'Label'
  };

  const { valueKey, labelKey, valueLabel, labelLabel } = config;

  useEffect(() => {
    if (Array.isArray(value)) {
      setOptions(value);
    } else if (value) {
      try {
        const parsed = JSON.parse(value);
        setOptions(Array.isArray(parsed) ? parsed : []);
      } catch {
        setOptions([]);
      }
    } else {
      setOptions([]);
    }
  }, [value]);

  const updateParent = (newOptions) => {
    setOptions(newOptions);
    onChange(field.id, newOptions);
  };

  const addNewOption = () => {
    const newOption = { [valueKey]: '', [labelKey]: '' };
    const newOptions = [...options, newOption];
    updateParent(newOptions);
    setEditingId(newOptions.length - 1);
    setEditingValues({ [valueKey]: '', [labelKey]: '' });
  };

  const startEditing = (index) => {
    setEditingId(index);
    setEditingValues({ ...options[index] });
  };

  const saveEditing = () => {
    if (editingId !== null) {
      const newOptions = [...options];
      newOptions[editingId] = { ...editingValues };
      updateParent(newOptions);
    }
    setEditingId(null);
    setEditingValues({});
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingValues({});
  };

  const deleteOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    updateParent(newOptions);
    if (editingId === index) {
      setEditingId(null);
      setEditingValues({});
    }
  };

  const updateEditingValue = (key, newValue) => {
    setEditingValues(prev => ({ ...prev, [key]: newValue }));
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-3 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-3 gap-3 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 truncate flex-shrink-0">{field.label || 'Options'}</h4>
        <button 
          className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors whitespace-nowrap flex-shrink-0"
          onClick={addNewOption}
        >
          <Plus size={12} />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {options.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-sm bg-gray-50 rounded border-2 border-dashed border-gray-200">
          <div className="px-2">No options configured. Click "Add" to get started.</div>
        </div>
      ) : (
        <div className="space-y-2 overflow-x-auto">
          {options.map((option, index) => (
            <div 
              key={index} 
              className={`bg-white border rounded-md p-2.5 transition-all hover:shadow-sm min-w-0 ${
                editingId === index ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-2 min-w-0">
                <div className="flex-1 min-w-0 overflow-hidden">
                  {editingId === index ? (
                    <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-gray-600 mb-1">{valueLabel}</div>
                        <input
                          type="text"
                          value={editingValues[valueKey] || ''}
                          // @ts-ignore
                          onChange={(e) => updateEditingValue(valueKey, e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-0"
                          placeholder={`Enter ${valueLabel.toLowerCase()}`}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-gray-600 mb-1">{labelLabel}</div>
                        <input
                          type="text"
                          value={editingValues[labelKey] || ''}
                          // @ts-ignore
                          onChange={(e) => updateEditingValue(labelKey, e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-0"
                          placeholder={`Enter ${labelLabel.toLowerCase()}`}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-gray-600 mb-0.5">{valueLabel}</div>
                        <div className="text-sm text-gray-900 break-words">{option[valueKey] || '<empty>'}</div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-gray-600 mb-0.5">{labelLabel}</div>
                        <div className="text-sm text-gray-900 break-words">{option[labelKey] || '<empty>'}</div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1 flex-shrink-0">
                  {editingId === index ? (
                    <>
                      <button
                        className="flex items-center justify-center w-6 h-6 rounded text-gray-500 hover:bg-green-100 hover:text-green-600 transition-colors"
                        onClick={saveEditing}
                        title="Save"
                      >
                        <Check size={12} />
                      </button>
                      <button
                        className="flex items-center justify-center w-6 h-6 rounded text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                        onClick={cancelEditing}
                        title="Cancel"
                      >
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="flex items-center justify-center w-6 h-6 rounded text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        onClick={() => startEditing(index)}
                        title="Edit"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        className="flex items-center justify-center w-6 h-6 rounded text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                        onClick={() => deleteOption(index)}
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



export const GlobalSelectField = ({ field, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // Initialize and sync selectedItems with value prop
  useEffect(() => {
    console.log("Valur to be set:",value);
    if (Array.isArray(value)) {
      setSelectedItems(value);
    } else if (value === null || value === undefined) {
      setSelectedItems([]);
    } else {
      // Handle case where value might be a single item
      setSelectedItems([value]);
    }
  }, [value, field]);

  const handleSelectionComplete = (selectedData) => {
    console.log("Selected fields:", selectedData);
    const newSelection = Array.isArray(selectedData) ? selectedData : [];
    setSelectedItems(newSelection);
    onChange?.(field.id, newSelection);
    setIsOpen(false);
  };

  const removeItem = (itemToRemove) => {
    // Fix: Use a more robust comparison - create a unique identifier
    const getItemKey = (item) => {
      if (item.id) return `id_${item.id}`;
      if (item.value) return `value_${item.value}`;
      if (typeof item === 'string') return `string_${item}`;
      return `index_${JSON.stringify(item)}`;
    };

    const itemKey = getItemKey(itemToRemove);
    const newSelection = selectedItems.filter(item => getItemKey(item) !== itemKey);
    
    setSelectedItems(newSelection);
    onChange?.(field.id, newSelection);
  };

  // @ts-ignore
  const clearAll = () => {
    setSelectedItems([]);
    onChange?.(field.id, []);
  };

  const getItemDisplayName = (item) => {
    if (typeof item === 'string') return item;
    return item?.name || item?.label || item?.title || item?.value || 'Unknown';
  };

  const hasSelectedItems = selectedItems && selectedItems.length > 0;

  const containerStyle = {
    position: 'relative',
    width: '100%',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '12px 16px',
    border: hasSelectedItems ? '2px solid #3b82f6' : '2px solid #e5e7eb',
    borderRadius: '12px',
    background: field?.disabled ? '#f9fafb' : 'white',
    cursor: field?.disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: field?.disabled ? 0.6 : 1,
    boxShadow: hasSelectedItems 
      ? '0 0 0 3px rgba(59, 130, 246, 0.1)' 
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    fontSize: '14px',
    fontWeight: '500'
  };

  const buttonTextStyle = {
    flex: 1,
    textAlign: 'left',
    color: hasSelectedItems ? '#1f2937' : '#6b7280',
    fontWeight: hasSelectedItems ? '600' : '500'
  };

  const dropdownIconStyle = {
    color: '#6b7280',
    fontSize: '16px',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
  };

  const chipsContainerStyle = {
    marginTop: '12px',
    padding: '16px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
  };

  const chipsWrapperStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: selectedItems.length > 1 ? '12px' : '0'
  };

  const chipStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    color: '#1f2937',
    padding: '8px 4px 8px 14px',
    borderRadius: '24px',
    fontSize: '13px',
    fontWeight: '500',
    maxWidth: '220px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden'
  };

  const chipTextStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginRight: '8px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151'
  };

  const chipRemoveStyle = {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    border: 'none',
    color: 'white',
    cursor: field?.disabled ? 'not-allowed' : 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    padding: '0',
    marginLeft: '8px',
    width: '22px',
    height: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: field?.disabled ? 0.5 : 1,
    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
    flexShrink: 0
  };

  // @ts-ignore
  const clearAllButtonStyle = {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: field?.disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
    opacity: field?.disabled ? 0.5 : 1
  };

  return (
    <div style={containerStyle}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!field?.disabled) {
            setIsOpen(!isOpen);
          }
        }}
        style={buttonStyle}
        disabled={field?.disabled}
        onMouseEnter={(e) => {
          if (!field?.disabled) {
            // @ts-ignore
            e.target.style.borderColor = hasSelectedItems ? '#2563eb' : '#9ca3af';
            // @ts-ignore
            e.target.style.boxShadow = hasSelectedItems 
              ? '0 0 0 3px rgba(37, 99, 235, 0.15)' 
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!field?.disabled) {
            // @ts-ignore
            e.target.style.borderColor = hasSelectedItems ? '#3b82f6' : '#e5e7eb';
            // @ts-ignore
            e.target.style.boxShadow = hasSelectedItems 
              ? '0 0 0 3px rgba(59, 130, 246, 0.1)' 
              : '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
          }
        }}
      >
        <span style={buttonTextStyle}>
          {hasSelectedItems 
            ? `${selectedItems.length} item${selectedItems.length !== 1 ? 's' : ''} selected`
            : field?.placeholder || 'Select items...'
          }
        </span>
        <span style={dropdownIconStyle}>▼</span>
      </button>

      {hasSelectedItems && (
        <div style={chipsContainerStyle}>
          <div style={chipsWrapperStyle}>
            {selectedItems.map((item, index) => {
              // Create a unique key for each item
              const itemKey = item.id || item.value || `${getItemDisplayName(item)}_${index}`;
              
              return (
                <div 
                  key={itemKey} 
                  style={chipStyle}
                  onMouseEnter={(e) => {
                    if (!field?.disabled) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!field?.disabled) {
                      e.currentTarget.style.transform = 'translateY(0px)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                    }
                  }}
                >
                  <span style={chipTextStyle}>
                    {getItemDisplayName(item)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!field?.disabled) {
                        removeItem(item);
                      }
                    }}
                    style={chipRemoveStyle}
                    disabled={field?.disabled}
                    aria-label={`Remove ${getItemDisplayName(item)}`}
                    onMouseEnter={(e) => {
                      if (!field?.disabled) {
                        // @ts-ignore
                        e.target.style.background = 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)';
                        // @ts-ignore
                        e.target.style.transform = 'scale(1.1)';
                        // @ts-ignore
                        e.target.style.boxShadow = '0 3px 6px rgba(239, 68, 68, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!field?.disabled) {
                        // @ts-ignore
                        e.target.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                        // @ts-ignore
                        e.target.style.transform = 'scale(1)';
                        // @ts-ignore
                        e.target.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.3)';
                      }
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {isOpen && (
        <GlobalSignalsPopup
          initialOpen={isOpen}
          // @ts-ignore
          fields={data_map}
          selectedItems={selectedItems}
          // @ts-ignore
          onClose={(e, newdata) => {
            console.log("new data:", newdata);
            setIsOpen(false);
            if (newdata !== undefined) {
              handleSelectionComplete(newdata);
            }
          }}
        />
      )}
    </div>
  );
};



import { ChevronRight, Copy, Move, Code, Eye } from 'lucide-react';

// Action configurations - easily extensible
const ACTION_CONFIGS = {
  trigger_workflow: {
    label: 'Trigger Workflow',
    fields: [
      { key: 'workflowId', label: 'Workflow ID', type: 'text', placeholder: 'workflow-123' },
      { key: 'parameters', label: 'Parameters', type: 'json', placeholder: '{"key": "value"}' }
    ]
  },
  update_state: {
    label: 'Update State',
    fields: [
      { key: 'stateKey', label: 'State Key', type: 'text', placeholder: 'user.name' },
      { key: 'value', label: 'Value', type: 'text', placeholder: 'New value' }
    ]
  },
  show_form: {
    label: 'Show Form',
    fields: [
      { key: 'formId', label: 'Form ID', type: 'global_map', placeholder: 'user-form' },
      { key: 'modal', label: 'Modal', type: 'select', options: [
        { value: false, label: 'Inline' },
        { value: true, label: 'Modal' }
      ]}
    ]
  },
  navigate: {
    label: 'Navigate',
    fields: [
      { key: 'url', label: 'URL', type: 'text', placeholder: '/dashboard' },
      { key: 'target', label: 'Target', type: 'select', options: [
        { value: '_self', label: 'Same Window' },
        { value: '_blank', label: 'New Window' }
      ]}
    ]
  },
  api_call: {
    label: 'API Call',
    fields: [
      { key: 'endpoint', label: 'Endpoint', type: 'text', placeholder: '/api/users' },
      { key: 'method', label: 'Method', type: 'select', options: [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'DELETE', label: 'DELETE' }
      ]},
      { key: 'body', label: 'Body', type: 'json', placeholder: '{"data": "value"}' }
    ]
  }
};

// Utility function to safely get nested values
// @ts-ignore
const safeGet = (obj, path, defaultValue = null) => {
  try {
    return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? defaultValue;
  } catch {
    return defaultValue;
  }
};

// Compact field components
const CompactTextField = ({ field, value, onChange }) => (
  <div className="mb-2">
    <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}</label>
    <input
      type="text"
      value={value || ''}
      // @ts-ignore
      onChange={(e) => onChange(field.key, e.target.value)}
      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
      placeholder={field.placeholder}
    />
  </div>
);

const CompactSelectField = ({ field, value, onChange }) => (
  <div className="mb-2">
    <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}</label>
    <select
      value={value || ''}
      // @ts-ignore
      onChange={(e) => onChange(field.key, e.target.value === 'true' ? true : e.target.value === 'false' ? false : e.target.value)}
      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
    >
      {field.options?.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const CompactJsonField = ({ field, value, onChange }) => (
  <div className="mb-2">
    <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}</label>
    <textarea
      value={value || ''}
      // @ts-ignore
      onChange={(e) => onChange(field.key, e.target.value)}
      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 font-mono"
      rows={2}
      placeholder={field.placeholder}
    />
  </div>
);

// Ultra-compact collapsible section
const CompactSection = ({ title, isOpen, onToggle, children, actions, className = "" }) => (
  <div className={`border border-gray-200 rounded mb-1 bg-white ${className}`}>
    <div 
      className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-50 min-h-[32px]"
      onClick={onToggle}
    >
      <div className="flex items-center space-x-1 flex-1 min-w-0">
        {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <span className="text-xs font-medium text-gray-800 truncate">{title}</span>
      </div>
      {actions && (
        <div className="flex items-center space-x-1 ml-1" onClick={(e) => e.stopPropagation()}>
          {actions}
        </div>
      )}
    </div>
    {isOpen && (
      <div className="px-2 pb-2 border-t border-gray-100 bg-gray-50">
        {children}
      </div>
    )}
  </div>
);

// Compact action item
// @ts-ignore
const CompactActionItem = ({ item = {}, index, onUpdate, onRemove, onDuplicate, onMove, canMoveUp, canMoveDown }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // @ts-ignore
  const actionConfig = ACTION_CONFIGS[item.type];

  // @ts-ignore
  const handleTypeChange = (key, newType) => {
    // @ts-ignore
    const newItem = { type: newType, description: item.description || '' };
    
    if (ACTION_CONFIGS[newType]) {
      ACTION_CONFIGS[newType].fields.forEach(field => {
        if (field.options && field.options.length > 0) {
          newItem[field.key] = field.options[0].value;
        } else {
          newItem[field.key] = '';
        }
      });
    }
    
    onUpdate(newItem);
  };

  const handleFieldChange = (key, value) => {
    onUpdate({ [key]: value });
  };

  const renderField = (fieldConfig) => {
    const fieldValue = item[fieldConfig.key];
    
    switch (fieldConfig.type) {
      case 'select':
        return <CompactSelectField field={fieldConfig} value={fieldValue} onChange={handleFieldChange} />;
      case 'json':
        return <CompactJsonField field={fieldConfig} value={fieldValue} onChange={handleFieldChange} />;
      case 'global_map':
        let val1 = item["value"] || [];
        // @ts-ignore
        return <GlobalSelectField field={fieldConfig} value={val1} onChange={(id, val) => {
          handleFieldChange("value",val);
        }}/>
      default:
        return <CompactTextField field={fieldConfig} value={fieldValue} onChange={handleFieldChange} />;
    }
  };

  return (
    <CompactSection
      // @ts-ignore
      title={`${index + 1}. ${actionConfig?.label || item.type || 'New Action'}`}
      isOpen={isExpanded}
      onToggle={() => setIsExpanded(!isExpanded)}
      actions={
        <div className="flex space-x-1">
          <button
            onClick={() => onMove(index, 'up')}
            disabled={!canMoveUp}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-1"
            title="Move Up"
          >
            <Move size={10} />
          </button>
          <button
            onClick={() => onDuplicate()}
            className="text-gray-500 hover:text-gray-700 p-1"
            title="Duplicate"
          >
            <Copy size={10} />
          </button>
          <button
            onClick={() => onRemove()}
            className="text-red-500 hover:text-red-700 p-1"
            title="Remove"
          >
            <Trash2 size={10} />
          </button>
        </div>
      }
    >
      <div className="space-y-2">
        <CompactSelectField
          field={{
            key: 'type',
            label: 'Type',
            options: [
              { value: '', label: 'Select Type' },
              ...Object.entries(ACTION_CONFIGS).map(([value, config]) => ({
                value,
                label: config.label
              }))
            ]
          }}
          // @ts-ignore
          value={item.type}
          onChange={handleTypeChange}
        />
        
        {actionConfig?.fields?.map(fieldConfig => (
          <div key={fieldConfig.key}>
            {renderField(fieldConfig)}
          </div>
        ))}
        
        <CompactTextField
          field={{ key: 'description', label: 'Description', placeholder: 'Action description' }}
          // @ts-ignore
          value={item.description}
          onChange={handleFieldChange}
        />
      </div>
    </CompactSection>
  );
};

// Compact actions list
const CompactActionsList = ({ actions = [], onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const addItem = () => {
    const newItem = { type: '', description: '' };
    onChange([...actions, newItem]);
  };

  const updateItem = (index, updates) => {
    const newActions = [...actions];
    newActions[index] = { ...newActions[index], ...updates };
    onChange(newActions);
  };

  const removeItem = (index) => {
    onChange(actions.filter((_, i) => i !== index));
  };

  const duplicateItem = (index) => {
    const newActions = [...actions];
    newActions.splice(index + 1, 0, { ...actions[index] });
    onChange(newActions);
  };

  const moveItem = (index, direction) => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === actions.length - 1)) return;
    
    const newActions = [...actions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newActions[index], newActions[targetIndex]] = [newActions[targetIndex], newActions[index]];
    onChange(newActions);
  };

  return (
    <CompactSection
      title={`Actions (${actions.length})`}
      isOpen={isExpanded}
      onToggle={() => setIsExpanded(!isExpanded)}
      actions={
        <button
          onClick={addItem}
          className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Plus size={10} />
          <span>Add</span>
        </button>
      }
    >
      {actions.length === 0 ? (
        <div className="text-center py-2 text-xs text-gray-500">
          No actions. Click "Add" to create one.
        </div>
      ) : (
        <div className="space-y-1">
          {actions.map((item, index) => (
            <CompactActionItem
              key={index}
              item={item}
              index={index}
              onUpdate={(updates) => updateItem(index, updates)}
              onRemove={() => removeItem(index)}
              onDuplicate={() => duplicateItem(index)}
              onMove={moveItem}
              canMoveUp={index > 0}
              canMoveDown={index < actions.length - 1}
            />
          ))}
        </div>
      )}
    </CompactSection>
  );
};

// Compact event config
const CompactEventConfig = ({ eventName, config = {}, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateActions = (actions) => {
    onChange(eventName, { ...config, actions });
  };

  const updateCode = (code) => {
    onChange(eventName, { ...config, code });
  };

  // @ts-ignore
  const actions = config.actions || [];
  // @ts-ignore
  const code = config.code || '';

  return (
    <
// @ts-ignore
    CompactSection
      title={`${eventName.replace(/([A-Z])/g, ' $1').trim()} (${actions.length})`}
      isOpen={isExpanded}
      onToggle={() => setIsExpanded(!isExpanded)}
    >
      <div className="space-y-2">
        <CompactActionsList
          actions={actions}
          onChange={updateActions}
        />
        
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Custom Code</label>
          <textarea
            value={code}
            // @ts-ignore
            onChange={(e) => updateCode(e.target.value)}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 font-mono"
            rows={3}
            placeholder="// Custom JavaScript code"
          />
        </div>
      </div>
    </CompactSection>
  );
};

// Main compact component
export const ActionsConfig = ({ configs = {}, onChange }) => {
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [jsonValue, setJsonValue] = useState('');
  const [internalConfigs, setInternalConfigs] = useState({});

  // Initialize internal state from props
  useEffect(() => {
    const initialConfigs = configs && Object.keys(configs).length > 0 
      ? configs 
      : {
          onClick: { actions: [], code: '' },
          onHover: { actions: [], code: '' },
          onDoubleClick: { actions: [], code: '' },
          valueCode: { actions: [], code: '' }
        };
    setInternalConfigs(initialConfigs);
  }, [configs]);

  // Sync JSON view with internal state
  useEffect(() => {
    try {
      setJsonValue(JSON.stringify(internalConfigs, null, 2));
    } catch (error) {
      setJsonValue('{}');
    }
  }, [internalConfigs]);

  const handleConfigChange = (eventName, eventConfig) => {
    const newConfigs = { ...internalConfigs, [eventName]: eventConfig };
    setInternalConfigs(newConfigs);
    onChange?.(newConfigs);
  };

  const handleJsonChange = (value) => {
    setJsonValue(value);
    try {
      const parsed = JSON.parse(value);
      const newConfigs = parsed || {};
      setInternalConfigs(newConfigs);
      onChange?.(newConfigs);
    } catch (error) {
      // Invalid JSON, don't update
    }
  };

  const currentEvents = Object.keys(internalConfigs);

  return (
    <div className="w-full max-w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-semibold text-gray-800">Actions</h3>
        <button
          onClick={() => setIsJsonMode(!isJsonMode)}
          className="flex items-center space-x-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-600"
        >
          {isJsonMode ? <Eye size={12} /> : <Code size={12} />}
          <span>{isJsonMode ? 'Form' : 'JSON'}</span>
        </button>
      </div>

      {isJsonMode ? (
        <textarea
          value={jsonValue}
          // @ts-ignore
          onChange={(e) => handleJsonChange(e.target.value)}
          className="w-full h-64 px-2 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 font-mono"
          placeholder="{}"
        />
      ) : (
        <div className="space-y-1">
          {currentEvents.map((eventName) => {
            const eventConfig = internalConfigs[eventName] || { actions: [], code: '' };
            return (
              <CompactEventConfig
                key={eventName}
                eventName={eventName}
                config={eventConfig}
                onChange={handleConfigChange}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// Simple demo - testing with just console.log callback
export default function Demo() {
  return (
    <div className="p-4 max-w-md mx-auto">
      <ActionsConfig 
        configs={{}} 
        onChange={(newConfigs) => {
          console.log('Actions updated:', newConfigs);
        }} 
      />
    </div>
  );
}