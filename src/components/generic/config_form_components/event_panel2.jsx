// Types and Configuration
const DEFAULT_EVENT_CONFIG = {
    actionType: 'visual',
    actions: []
  };
  
  const ACTION_TYPES = {
    CALL_QUERY: 'call_query',
    NAVIGATE_TO_SCREEN: 'navigate_to_screen',
    UPDATE_GLOBAL_STATE: 'update_global_state',
    UPDATE_LOCAL_STATE: 'update_local_state',
    TRIGGER_WORKFLOW: 'trigger_workflow',
    SHOW_TOAST: 'show_toast',
    OPEN_MODAL: 'open_modal',
    RUN_CODE_BLOCK: 'run_code_block',
    REFRESH_DATA_SELF: 'refresh_data_self'
  };
  
  const DEFAULT_ACTIONS = {
    [ACTION_TYPES.CALL_QUERY]: { type: ACTION_TYPES.CALL_QUERY, params: { queryName: '' } },
    [ACTION_TYPES.NAVIGATE_TO_SCREEN]: { type: ACTION_TYPES.NAVIGATE_TO_SCREEN, params: { screenName: '' } },
    [ACTION_TYPES.UPDATE_GLOBAL_STATE]: { type: ACTION_TYPES.UPDATE_GLOBAL_STATE, params: { key: '', value: '' } },
    [ACTION_TYPES.UPDATE_LOCAL_STATE]: { type: ACTION_TYPES.UPDATE_LOCAL_STATE, params: { key: '', value: '' } },
    [ACTION_TYPES.TRIGGER_WORKFLOW]: { type: ACTION_TYPES.TRIGGER_WORKFLOW, params: { workflowId: '' } },
    [ACTION_TYPES.SHOW_TOAST]: { type: ACTION_TYPES.SHOW_TOAST, params: { message: '', type: 'success' } },
    [ACTION_TYPES.OPEN_MODAL]: { type: ACTION_TYPES.OPEN_MODAL, params: { modalId: '' } },
    [ACTION_TYPES.RUN_CODE_BLOCK]: { type: ACTION_TYPES.RUN_CODE_BLOCK, params: { code: '' } },
    [ACTION_TYPES.REFRESH_DATA_SELF]: { type: ACTION_TYPES.REFRESH_DATA_SELF, params: {} }
  };
  
  // Context for Event Configuration
  import { createContext, useContext, useState, useReducer, useEffect } from 'react';
  import { ChevronDown, ChevronUp, Trash2, Plus, Edit, Code, Settings, X } from 'lucide-react';
  
  const EventConfigContext = createContext();
  
  export const EventConfigProvider = ({ children, initialConfig = {}, onChange }) => {
    const [config, dispatch] = useReducer(configReducer, initialConfig);
    const [expandedEvent, setExpandedEvent] = useState(null);
    const [activeEditor, setActiveEditor] = useState(null);
  
    useEffect(() => {
      if (onChange) {
        onChange(config);
      }
    }, [config, onChange]);
  
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
      dispatch,
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
  
  // Reducer for config management
  function configReducer(state, action) {
    switch (action.type) {
      case 'SET_ACTION_TYPE': {
        const { eventName, actionType } = action.payload;
        return {
          ...state,
          [eventName]: {
            ...state[eventName] || DEFAULT_EVENT_CONFIG,
            actionType
          }
        };
      }
      case 'ADD_ACTION': {
        const { eventName, actionType = ACTION_TYPES.CALL_QUERY } = action.payload;
        const eventConfig = state[eventName] || DEFAULT_EVENT_CONFIG;
        return {
          ...state,
          [eventName]: {
            ...eventConfig,
            actions: [...eventConfig.actions, { ...DEFAULT_ACTIONS[actionType] }]
          }
        };
      }
      case 'REMOVE_ACTION': {
        const { eventName, index } = action.payload;
        const eventConfig = state[eventName] || DEFAULT_EVENT_CONFIG;
        return {
          ...state,
          [eventName]: {
            ...eventConfig,
            actions: eventConfig.actions.filter((_, i) => i !== index)
          }
        };
      }
      case 'UPDATE_ACTION': {
        const { eventName, index, actionData } = action.payload;
        const eventConfig = state[eventName] || DEFAULT_EVENT_CONFIG;
        const newActions = [...eventConfig.actions];
        newActions[index] = { ...newActions[index], ...actionData };
        return {
          ...state,
          [eventName]: {
            ...eventConfig,
            actions: newActions
          }
        };
      }
      case 'UPDATE_ACTION_PARAM': {
        const { eventName, actionIndex, paramName, value } = action.payload;
        const eventConfig = state[eventName] || DEFAULT_EVENT_CONFIG;
        const newActions = [...eventConfig.actions];
        newActions[actionIndex] = { 
          ...newActions[actionIndex], 
          params: { 
            ...newActions[actionIndex].params, 
            [paramName]: value 
          } 
        };
        return {
          ...state,
          [eventName]: {
            ...eventConfig,
            actions: newActions
          }
        };
      }
      case 'SET_CODE_BLOCK': {
        const { eventName, code } = action.payload;
        return {
          ...state,
          [eventName]: {
            ...state[eventName] || DEFAULT_EVENT_CONFIG,
            codeBlock: code
          }
        };
      }
      default:
        return state;
    }
  }
  
  // Main Component
  export function EventsConfig({ events = [] }) {
    const { expandedEvent, toggleEventExpansion } = useEventConfig();
  
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-800">Events & Actions</h3>
        
        <div className="space-y-4">
          {events.map(eventName => (
            <EventPanel 
              key={eventName}
              eventName={eventName}
              isExpanded={expandedEvent === eventName}
              onToggle={() => toggleEventExpansion(eventName)}
            />
          ))}
        </div>
        <AdvancedEditorModal />
      </div>
    );
  }
  
  // Event Panel Component
  function EventPanel({ eventName, isExpanded, onToggle }) {
    const { config, dispatch } = useEventConfig();
    
    const eventConfig = config[eventName] || DEFAULT_EVENT_CONFIG;
    const { actionType = 'visual', actions = [] } = eventConfig;
    
    const handleActionTypeChange = (type) => {
      dispatch({
        type: 'SET_ACTION_TYPE',
        payload: { eventName, actionType: type }
      });
    };
    
    const addAction = () => {
      dispatch({
        type: 'ADD_ACTION',
        payload: { eventName }
      });
    };
    
    const removeAction = (index) => {
      dispatch({
        type: 'REMOVE_ACTION',
        payload: { eventName, index }
      });
    };
    
    const handleCodeChange = (code) => {
      dispatch({
        type: 'SET_CODE_BLOCK',
        payload: { eventName, code }
      });
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
              <div className="flex border rounded-md overflow-hidden">
                <button 
                  className={`px-3 py-1.5 text-xs font-medium ${actionType === 'visual' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
                  onClick={() => handleActionTypeChange('visual')}
                >
                  <span className="flex items-center gap-1">
                    <Settings size={14} />
                    Visual
                  </span>
                </button>
                <button 
                  className={`px-3 py-1.5 text-xs font-medium ${actionType === 'code' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
                  onClick={() => handleActionTypeChange('code')}
                >
                  <span className="flex items-center gap-1">
                    <Code size={14} />
                    Code
                  </span>
                </button>
              </div>
            </div>
            
            {actionType === 'visual' ? (
              <VisualEditor 
                eventName={eventName}
                actions={actions}
                onRemoveAction={removeAction}
                onAddAction={addAction}
              />
            ) : (
              <CodeEditor 
                eventName={eventName}
                codeBlock={eventConfig.codeBlock || generateDefaultCode(eventName)}
                onChange={handleCodeChange}
              />
            )}
          </div>
        )}
      </div>
    );
  }
  
  // Visual Editor Component
  function VisualEditor({ eventName, actions = [], onRemoveAction, onAddAction }) {
    const { dispatch, openAdvancedEditor } = useEventConfig();
    
    const handleActionTypeChange = (index, type) => {
      dispatch({
        type: 'UPDATE_ACTION',
        payload: { 
          eventName, 
          index, 
          actionData: { ...DEFAULT_ACTIONS[type] }
        }
      });
    };
    
    const handleParamChange = (actionIndex, paramName, value) => {
      dispatch({
        type: 'UPDATE_ACTION_PARAM',
        payload: { eventName, actionIndex, paramName, value }
      });
    };
    
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
                  onChange={(e) => handleActionTypeChange(index, e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value={ACTION_TYPES.CALL_QUERY}>Call Query</option>
                  <option value={ACTION_TYPES.NAVIGATE_TO_SCREEN}>Navigate To Screen</option>
                  <option value={ACTION_TYPES.UPDATE_GLOBAL_STATE}>Update Global State</option>
                  <option value={ACTION_TYPES.UPDATE_LOCAL_STATE}>Update Local State</option>
                  <option value={ACTION_TYPES.TRIGGER_WORKFLOW}>Trigger Workflow</option>
                  <option value={ACTION_TYPES.SHOW_TOAST}>Show Toast</option>
                  <option value={ACTION_TYPES.OPEN_MODAL}>Open Modal</option>
                  <option value={ACTION_TYPES.RUN_CODE_BLOCK}>Run Code Block</option>
                  <option value={ACTION_TYPES.REFRESH_DATA_SELF}>Refresh Data Self</option>
                </select>
              </div>
              
              <ActionParamsForm 
                action={action} 
                actionIndex={index}
                eventName={eventName}
                onParamChange={handleParamChange}
                onOpenEditor={openAdvancedEditor}
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
  
  // Dynamic Action Params Form
  function ActionParamsForm({ action, actionIndex, eventName, onParamChange, onOpenEditor }) {
    if (!action || !action.params) return null;
    
    switch (action.type) {
      case ACTION_TYPES.CALL_QUERY:
        return (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Query Name</label>
            <div className="flex">
              <select 
                value={action.params.queryName || ''}
                onChange={(e) => onParamChange(actionIndex, 'queryName', e.target.value)}
                className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Select a query</option>
                <option value="getUsers">Get Users</option>
                <option value="updateProfile">Update Profile</option>
                <option value="fetchProducts">Fetch Products</option>
              </select>
              <button 
                onClick={() => onOpenEditor(eventName, actionIndex, 'queryName')}
                className="bg-gray-100 border border-l-0 border-gray-300 px-2 rounded-r-md"
              >
                <Edit size={16} />
              </button>
            </div>
          </div>
        );
        
      case ACTION_TYPES.NAVIGATE_TO_SCREEN:
        return (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Screen</label>
            <div className="flex">
              <select 
                value={action.params.screenName || ''}
                onChange={(e) => onParamChange(actionIndex, 'screenName', e.target.value)}
                className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Select a screen</option>
                <option value="home">Home</option>
                <option value="profile">Profile</option>
                <option value="settings">Settings</option>
                <option value="dashboard">Dashboard</option>
              </select>
              <button 
                onClick={() => onOpenEditor(eventName, actionIndex, 'screenName')}
                className="bg-gray-100 border border-l-0 border-gray-300 px-2 rounded-r-md"
              >
                <Edit size={16} />
              </button>
            </div>
          </div>
        );
        
      case ACTION_TYPES.SHOW_TOAST:
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Message</label>
              <div className="flex">
                <input 
                  type="text" 
                  value={action.params.message || ''}
                  onChange={(e) => onParamChange(actionIndex, 'message', e.target.value)}
                  placeholder="Toast message" 
                  className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm"
                />
                <button 
                  onClick={() => onOpenEditor(eventName, actionIndex, 'message')}
                  className="bg-gray-100 border border-l-0 border-gray-300 px-2 rounded-r-md"
                >
                  <Edit size={16} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Type</label>
              <select 
                value={action.params.type || 'success'}
                onChange={(e) => onParamChange(actionIndex, 'type', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="success">Success</option>
                <option value="error">Error</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
              </select>
            </div>
          </div>
        );
        
      case ACTION_TYPES.RUN_CODE_BLOCK:
        return (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Code</label>
            <div className="flex flex-col">
              <div className="bg-gray-100 p-2 rounded-md text-sm text-gray-500 border border-gray-300 h-24 overflow-auto">
                {action.params.code ? (
                  <pre>{action.params.code.substring(0, 150)}
                    {action.params.code.length > 150 ? '...' : ''}
                  </pre>
                ) : (
                  <span className="italic">Click "Edit" to write code</span>
                )}
              </div>
              <button 
                onClick={() => onOpenEditor(eventName, actionIndex, 'code')}
                className="self-end mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm flex items-center gap-1"
              >
                <Edit size={14} />
                Edit Code
              </button>
            </div>
          </div>
        );
        
      case ACTION_TYPES.UPDATE_GLOBAL_STATE:
      case ACTION_TYPES.UPDATE_LOCAL_STATE:
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Key</label>
              <div className="flex">
                <input 
                  type="text" 
                  value={action.params.key || ''}
                  onChange={(e) => onParamChange(actionIndex, 'key', e.target.value)}
                  placeholder="State key" 
                  className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm"
                />
                <button 
                  onClick={() => onOpenEditor(eventName, actionIndex, 'key')}
                  className="bg-gray-100 border border-l-0 border-gray-300 px-2 rounded-r-md"
                >
                  <Edit size={16} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Value</label>
              <div className="flex">
                <input 
                  type="text" 
                  value={action.params.value || ''}
                  onChange={(e) => onParamChange(actionIndex, 'value', e.target.value)}
                  placeholder="State value" 
                  className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm"
                />
                <button 
                  onClick={() => onOpenEditor(eventName, actionIndex, 'value')}
                  className="bg-gray-100 border border-l-0 border-gray-300 px-2 rounded-r-md"
                >
                  <Edit size={16} />
                </button>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-sm text-gray-500 italic">
            No parameters needed for this action type
          </div>
        );
    }
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
  function AdvancedEditorModal() {
    const { activeEditor, closeAdvancedEditor, config, dispatch } = useEventConfig();
    
    if (!activeEditor) return null;
    
    const { eventName, actionIndex, fieldName } = activeEditor;
    const eventConfig = config[eventName] || DEFAULT_EVENT_CONFIG;
    const action = eventConfig.actions[actionIndex];
    const fieldValue = action?.params?.[fieldName] || '';
    
    const handleSave = (value) => {
      dispatch({
        type: 'UPDATE_ACTION_PARAM',
        payload: { eventName, actionIndex, paramName: fieldName, value }
      });
      closeAdvancedEditor();
    };
    
    // Get field type based on field name and action type
    const getFieldType = () => {
      if (fieldName === 'code') return 'code';
      return 'text';
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
            >
              Cancel
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
    
    const [config, setConfig] = useState({});
    
    const handleConfigChange = (newConfig) => {
      setConfig(newConfig);
      console.log('Configuration updated:', newConfig);
    };
    
    return (
      <EventConfigProvider initialConfig={config} onChange={handleConfigChange}>
        <div className="p-6">
          <EventsConfig events={events} />
        </div>
      </EventConfigProvider>
    );
  }