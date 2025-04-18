// Types and Configuration
import { createContext, useContext, useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Trash2, Plus, Edit, Code, Settings, X } from 'lucide-react';

// Define the schema for action types and their parameters
const ACTION_SCHEMA = {
  call_query: {
    label: "Call Query",
    params: {
      queryName: {
        type: "select",
        label: "Query Name",
        options: ["users_query", "products_query", "stats", "my_user", "monthly_report"]
      }
    }
  },
  navigate_to_screen: {
    label: "Navigate To Screen",
    params: {
      screenName: {
        type: "select",
        label: "Screen",
        options: ["home", "users", "others"]
      }
    }
  },
  update_global_state: {
    label: "Update Global State",
    params: {
      key: {
        type: "text",
        label: "Key"
      },
      value: {
        type: "text",
        label: "Value"
      }
    }
  },
  update_local_state: {
    label: "Update Local State",
    params: {
      key: {
        type: "text",
        label: "Key"
      },
      value: {
        type: "text",
        label: "Value"
      }
    }
  },
  trigger_workflow: {
    label: "Trigger Workflow",
    params: {
      workflowId: {
        type: "text",
        label: "Workflow ID"
      }
    }
  },
  show_toast: {
    label: "Show Toast",
    params: {
      message: {
        type: "text",
        label: "Message"
      },
      type: {
        type: "select",
        label: "Type",
        options: ["success", "failure", "info", "warning"]
      }
    }
  },
  open_modal: {
    label: "Open Modal",
    params: {
      modalId: {
        type: "text",
        label: "Modal ID"
      }
    }
  },
  run_code_block: {
    label: "Run Code Block",
    params: {
      code: {
        type: "code",
        label: "Code"
      }
    }
  },
  refresh_data_self: {
    label: "Refresh Data Self",
    params: {} // No parameters needed
  }
};

// Default styles for form elements
const styles = {
  "text": {"color": "black", "width": "200px"}, 
  "select": {"color": "black"},
  "code": {"fontFamily": "monospace"}, 
  "edit_button": { "backgroundColor": "black", "color": "white", 
    "borderRadius":"8px", "marginLeft": "4px"},
    "button": {"backgroundColor": "black", "color": "white"}
};

// Context for Event Configuration
const EventConfigContext = createContext({});

export const EventConfigProvider = ({ children, initialConfig = {}, onChange }) => {
  const [config, setConfig] = useState(initialConfig);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [activeEditor, setActiveEditor] = useState(null);
  
  useEffect(() => {
    if (onChange) {
      onChange(config);
    }
  }, [config, onChange]);

  // Simple direct state update functions
  const updateConfig = (newConfig) => {
    setConfig(newConfig);
  };
  
  const toggleEventExpansion = (eventName) => {
    setExpandedEvent(expandedEvent === eventName ? null : eventName);
  };

  const openAdvancedEditor = (eventName, actionIndex, fieldName) => {
    setActiveEditor({ eventName, actionIndex, fieldName });
  };

  const closeAdvancedEditor = () => {
    setActiveEditor(null);
  };

  const value = {
    config,
    updateConfig,
    expandedEvent,
    toggleEventExpansion,
    activeEditor,
    openAdvancedEditor,
    closeAdvancedEditor
  };

  return (
    <EventConfigContext.Provider value={value}>
      {children}
    </EventConfigContext.Provider>
  );
};

export const useEventConfig = () => {
  const context = useContext(EventConfigContext);
  if (!context) {
    throw new Error('useEventConfig must be used within an EventConfigProvider');
  }
  return context;
};

// Create helpers for common operations
export const useEventActions = () => {
  const { config, updateConfig } = useEventConfig();
  
  // Helper to create a default action based on type
  const createDefaultAction = (type) => {
    const schema = ACTION_SCHEMA[type];
    if (!schema) return { type, params: {} };
    
    const params = {};
    Object.keys(schema.params).forEach(paramKey => {
      const paramSchema = schema.params[paramKey];
      // Set default values based on type
      switch (paramSchema.type) {
        case 'select':
          params[paramKey] = paramSchema.options && paramSchema.options.length > 0 ? paramSchema.options[0] : '';
          break;
        case 'code':
          params[paramKey] = '';
          break;
        default:
          params[paramKey] = '';
      }
    });
    
    return { type, params };
  };
  
  // Set action type (visual or code)
  const setActionType = (eventName, actionType) => {
    const newConfig = { ...config };
    if (!newConfig[eventName]) {
      newConfig[eventName] = { actionType, actions: [] };
    } else {
      newConfig[eventName] = {
        ...newConfig[eventName],
        actionType
      };
    }
    updateConfig(newConfig);
  };
  
  // Add a new action to an event
  const addAction = (eventName, actionType) => {
    const newConfig = { ...config };
    const firstActionType = actionType || Object.keys(ACTION_SCHEMA)[0] || 'call_query';
    
    if (!newConfig[eventName]) {
      newConfig[eventName] = { actionType: 'visual', actions: [createDefaultAction(firstActionType)] };
    } else {
      newConfig[eventName] = {
        ...newConfig[eventName],
        actions: [...(newConfig[eventName].actions || []), createDefaultAction(firstActionType)]
      };
    }
    updateConfig(newConfig);
  };
  
  // Remove an action from an event
  const removeAction = (eventName, index) => {
    const newConfig = { ...config };
    if (newConfig[eventName] && newConfig[eventName].actions) {
      newConfig[eventName] = {
        ...newConfig[eventName],
        actions: newConfig[eventName].actions.filter((_, i) => i !== index)
      };
      updateConfig(newConfig);
    }
  };
  
  // Change the type of an action
  const changeActionType = (eventName, index, actionType) => {
    const newConfig = { ...config };
    if (newConfig[eventName] && newConfig[eventName].actions && newConfig[eventName].actions[index]) {
      const newActions = [...newConfig[eventName].actions];
      newActions[index] = createDefaultAction(actionType);
      
      newConfig[eventName] = {
        ...newConfig[eventName],
        actions: newActions
      };
      updateConfig(newConfig);
    }
  };
  
  // Update a parameter value for an action
  const updateActionParam = (eventName, actionIndex, paramName, value) => {
    const newConfig = { ...config };
    if (newConfig[eventName]?.actions?.[actionIndex]) {
      const newActions = [...newConfig[eventName].actions];
      newActions[actionIndex] = {
        ...newActions[actionIndex],
        params: {
          ...newActions[actionIndex].params,
          [paramName]: value
        }
      };
      
      newConfig[eventName] = {
        ...newConfig[eventName],
        actions: newActions
      };
      updateConfig(newConfig);
    }
  };
  
  // Set code block for an event (code mode)
  const setCodeBlock = (eventName, code) => {
    const newConfig = { ...config };
    if (!newConfig[eventName]) {
      newConfig[eventName] = { actionType: 'code', codeBlock: code, actions: [] };
    } else {
      newConfig[eventName] = {
        ...newConfig[eventName],
        codeBlock: code
      };
    }
    updateConfig(newConfig);
  };
  
  return {
    createDefaultAction,
    setActionType,
    addAction,
    removeAction,
    changeActionType,
    updateActionParam,
    setCodeBlock
  };
};

// Form Field Components
const FormField = ({ type, value, onChange, label, options, onOpenEditor, canEdit = true }) => {
  switch (type) {
    case 'text':
      return (
        <div>
          <label className="block text-xs text-gray-500 mb-1">{label}</label>
          <div className="flex">
            <input 
              type="text" 
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={label} 
              className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm"
              style={{...styles.text}}
            />
          </div>
        </div>
      );
      
    case 'select':
      return (
        <div>
          <label className="block text-xs text-gray-500 mb-1">{label}</label>
          <div className="flex">
            <select 
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm"
              style={{...styles.select}}
            >
              {options && options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      );
      
    case 'code':
      return (
        <div>
          <label className="block text-xs text-gray-500 mb-1">{label}</label>
          <div className="flex flex-col">
            <div className="bg-gray-100 p-2 rounded-md text-sm text-gray-500 border border-gray-300 h-24 overflow-auto">
              {value ? (
                <pre>{value.substring(0, 150)}
                  {value.length > 150 ? '...' : ''}
                </pre>
              ) : (
                <span className="italic">Click "Edit" to write code</span>
              )}
            </div>
            <button 
              onClick={onOpenEditor}
              className="self-end mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm flex items-center gap-1"
              style={{...styles["edit_button"]}}
            >
              <Edit size={14} />
              Edit Code
            </button>
          </div>
        </div>
      );
      
    default:
      return (
        <div className="text-sm text-gray-500 italic">
          Unknown field type: {type}
        </div>
      );
  }
};

// Main Component
export function EventsConfig({ events = [], actionSchema = ACTION_SCHEMA }) {
  const { expandedEvent, toggleEventExpansion } = useEventConfig();

  return (
    <div className="">
      <h3 className="text-lg font-medium text-gray-800">Events & Actions</h3>
      
      <div className="space-y-4">
        {events.map(eventName => (
          <EventPanel 
            key={eventName}
            eventName={eventName}
            isExpanded={expandedEvent === eventName}
            onToggle={() => toggleEventExpansion(eventName)}
            actionSchema={actionSchema}
          />
        ))}
      </div>
      <AdvancedEditorModal actionSchema={actionSchema} />
    </div>
  );
}

// Event Panel Component
function EventPanel({ eventName, isExpanded, onToggle, actionSchema }) {
  const { config } = useEventConfig();
  const { setActionType, addAction, removeAction, setCodeBlock } = useEventActions();
  
  const eventConfig = config[eventName] || { actionType: 'visual', actions: [] };
  const { actionType = 'visual', actions = [] } = eventConfig;
  
  const handleActionTypeChange = (type) => {
    setActionType(eventName, type);
  };
  
  const handleAddAction = () => {
    addAction(eventName);
  };
  
  const handleRemoveAction = (index) => {
    removeAction(eventName, index);
  };
  
  const handleCodeChange = (code) => {
    setCodeBlock(eventName, code);
  };
  
  return (
    <div className="border rounded-md overflow-hidden">
      <div 
        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
        onClick={onToggle}
      >
        <div className="font-medium text-gray-700">{eventName}</div>
        <div className="flex items-center gap-2">
          {actions.length > 0 && (
            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
              {actions.length} {actions.length === 1 ? 'action' : 'actions'}
            </span>
          )}
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-medium text-gray-700">Configure Actions</div>
          </div>
            <VisualEditor 
              eventName={eventName}
              actions={actions}
              onRemoveAction={handleRemoveAction}
              onAddAction={handleAddAction}
              actionSchema={actionSchema}
            />
        </div>
      )}
    </div>
  );
}

// Visual Editor Component
function VisualEditor({ eventName, actions = [], onRemoveAction, onAddAction, actionSchema }) {
  const { changeActionType, updateActionParam } = useEventActions();
  const { openAdvancedEditor } = useEventConfig();
  
  // Get all available action types from schema
  const actionTypes = Object.keys(actionSchema);
  
  return (
    <div className="space-y-4">
      {actions.map((action, index) => (
        <div key={index} className="bg-gray-50 rounded-md p-3 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium text-gray-700">Action {index + 1}</h4>
            <button 
              className="text-gray-500 hover:text-red-500"
              onClick={() => onRemoveAction(index)}
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Action Type</label>
              <select 
                value={action.type}
                onChange={(e) => changeActionType(eventName, index, e.target.value)}
                style={{...styles.select}}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" 
              >
                {actionTypes.map((type) => (
                  <option key={type} value={type}>
                    {actionSchema[type].label || type}
                  </option>
                ))}
              </select>
            </div>
            
            <ActionParamsForm 
              action={action} 
              actionIndex={index}
              eventName={eventName}
              onParamChange={(paramName, value) => updateActionParam(eventName, index, paramName, value)}
              onOpenEditor={(paramName) => openAdvancedEditor(eventName, index, paramName)}
              actionSchema={actionSchema}
            />
          </div>
        </div>
      ))}
      
      <button 
        onClick={onAddAction}
        className="w-full flex items-center justify-center gap-1 text-sm font-medium text-blue-600 py-2 bg-blue-50 rounded-md hover:bg-blue-100"
      >
        <Plus size={16} />
        Add Action
      </button>
    </div>
  );
}

// Dynamic Action Params Form based on schema
function ActionParamsForm({ action, eventName, actionIndex, onParamChange, onOpenEditor, actionSchema }) {
  if (!action || !action.params) return null;
  
  // Get the schema for this action type
  const schema = actionSchema[action.type];
  if (!schema || !schema.params) {
    return (
      <div className="text-sm text-gray-500 italic">
        No parameters needed for this action type
      </div>
    );
  }
  
  // Render form fields based on schema
  return (
    <div className="space-y-3">
      {Object.keys(schema.params).map(paramName => {
        const paramSchema = schema.params[paramName];
        return (
          <FormField
            key={paramName}
            type={paramSchema.type}
            label={paramSchema.label || paramName}
            value={action.params[paramName]}
            options={paramSchema.options}
            onChange={(value) => onParamChange(paramName, value)}
            onOpenEditor={() => onOpenEditor(paramName)}
          />
        );
      })}
    </div>
  );
}

// Code Editor Component
function CodeEditor({ eventName, codeBlock, onChange }) {
  return (
    <div className="bg-gray-50 rounded-md border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs text-gray-500">Custom Code for {eventName}</label>
      </div>
      <textarea 
        value={codeBlock || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-48 p-2 font-mono text-sm border border-gray-300 rounded-md"
      />
    </div>
  );
}

// Advanced Editor Modal
function AdvancedEditorModal({ actionSchema }) {
  const { activeEditor, closeAdvancedEditor, config } = useEventConfig();
  const { updateActionParam } = useEventActions();
  
  if (!activeEditor) return null;
  
  const { eventName, actionIndex, fieldName } = activeEditor;
  const eventConfig = config[eventName] || { actionType: 'visual', actions: [] };
  const action = eventConfig.actions[actionIndex];
  const fieldValue = action?.params?.[fieldName] || '';
  
  const handleSave = (value) => {
    updateActionParam(eventName, actionIndex, fieldName, value);
    // closeAdvancedEditor();
  };
  
  // Get field type based on the schema
  const getFieldType = () => {
    if (!action) return 'text';
    const schema = actionSchema[action.type];
    if (!schema || !schema.params || !schema.params[fieldName]) return 'text';
    return schema.params[fieldName].type || 'text';
  };
  
  const fieldType = getFieldType();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl shadow-xl">
        <div className="flex justify-between items-center border-b px-4 py-3">
          <h3 className="font-medium">
            Edit {fieldName} for {eventName}
          </h3>
          <button 
            onClick={closeAdvancedEditor}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          {fieldType === 'code' ? (
            <textarea 
              value={fieldValue}
              onChange={(e) => handleSave(e.target.value)}
              className="w-full h-64 p-2 font-mono text-sm border border-gray-300 rounded-md"
            />
          ) : (
            <textarea 
              value={fieldValue}
              onChange={(e) => handleSave(e.target.value)}
              className="w-full h-32 p-2 text-sm border border-gray-300 rounded-md"
            />
          )}
        </div>
        
        <div className="border-t px-4 py-3 flex justify-end gap-2">
          <button 
            onClick={closeAdvancedEditor}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md"
            style={{...styles["button"]}}
          >
            ok
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate default code
function generateDefaultCode(eventName) {
  return `// ${eventName} handler
function ${eventName}Handler(event) {
  // Your custom code here
  console.log('${eventName} triggered', event);
  
  // Example: Call an API
  fetch('/api/data')
    .then(response => response.json())
    .then(data => {
      // Handle response
      console.log('Data received:', data);
    });
}`;
}

// Usage Example Component
export function EventsConfigWrapper() {
  const events = [
    'onClick', 
    'onDoubleClick', 
    'onHover', 
    'onChange', 
    'onSubmit', 
    'onMount', 
    'onScroll',
    'onDrag'
  ];
  
  // This could be fetched from an API or provided as props
  const customActionSchema = ACTION_SCHEMA;
  
  const [config, setConfig] = useState({});
  
  const handleConfigChange = (newConfig) => {
    setConfig(newConfig);
    console.log('Configuration updated:', newConfig);
  };
  
  return (
    <EventConfigProvider initialConfig={config} onChange={handleConfigChange}>
      <div className="">
        <EventsConfig events={events} actionSchema={customActionSchema} />
      </div>
    </EventConfigProvider>
  );
}