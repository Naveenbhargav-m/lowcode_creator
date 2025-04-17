import { useState } from 'preact/hooks';
import { Code, Database, Palette, Play, X, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import StyleConfig from './config_form_components/styleConfig';

// Main Config Form Component
export default function ConfigUpdater() {
  const [activeTab, setActiveTab] = useState('style');
  const [expandedEvent, setExpandedEvent] = useState(null);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const toggleEventExpansion = (eventName) => {
    if (expandedEvent === eventName) {
      setExpandedEvent(null);
    } else {
      setExpandedEvent(eventName);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <h2 className="text-xl font-semibold text-gray-800">Element Configuration</h2>
        <p className="text-sm text-gray-500">Configure styles, data, and interactions</p>
      </div>
      
      <div className="flex border-b border-gray-200">
        <TabButton 
          active={activeTab === 'style'} 
          onClick={() => handleTabChange('style')}
          icon={<Palette size={16} />}
          label="Style"
        />
        <TabButton 
          active={activeTab === 'data'} 
          onClick={() => handleTabChange('data')}
          icon={<Database size={16} />}
          label="Data"
        />
        <TabButton 
          active={activeTab === 'events'} 
          onClick={() => handleTabChange('events')}
          icon={<Play size={16} />}
          label="Events"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'style' && <StyleConfig />}
        {activeTab === 'data' && <DataQueryConfig />}
        {activeTab === 'events' && (
          <EventsConfig 
            expandedEvent={expandedEvent} 
            toggleEventExpansion={toggleEventExpansion} 
          />
        )}
      </div>
    </div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
        active
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// Style Configuration Component

// Data Query Configuration Component
function DataQueryConfig() {
  const [queryMode, setQueryMode] = useState('visual');
  
  return (
    <div className="space-y-6 overflow-hidden">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">Data Query</h3>
        <div className="flex border rounded-md overflow-hidden">
          <button 
            className={`px-3 py-1.5 text-xs font-medium ${queryMode === 'visual' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
            onClick={() => setQueryMode('visual')}
          >
            Visual
          </button>
          <button 
            className={`px-3 py-1.5 text-xs font-medium ${queryMode === 'code' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
            onClick={() => setQueryMode('code')}
          >
            Code
          </button>
        </div>
      </div>
      
      {queryMode === 'visual' ? (
        <div className="space-y-4">
          <FormGroup label="Data Source">
            <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
              <option>API Endpoint</option>
              <option>Database</option>
              <option>Local State</option>
              <option>Global State</option>
            </select>
          </FormGroup>
          
          <FormGroup label="Endpoint URL">
            <input 
              type="text" 
              placeholder="https://api.example.com/data" 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </FormGroup>
          
          <FormGroup label="Request Method">
            <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
          </FormGroup>
          
          <FormGroup label="Request Headers">
            <div className="space-y-2">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Key" 
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <input 
                  type="text" 
                  placeholder="Value" 
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <X size={16} />
                </button>
              </div>
              <button className="flex items-center gap-1 text-sm text-blue-600 font-medium">
                <Plus size={16} />
                Add Header
              </button>
            </div>
          </FormGroup>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-md border border-gray-200 p-4 h-64">
          <pre className="text-sm text-gray-800">
{`// Define your data query
async function fetchData() {
  const response = await fetch('https://api.example.com/data', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
}`}
          </pre>
        </div>
      )}
    </div>
  );
}

// Events Configuration Component
function EventsConfig({ expandedEvent, toggleEventExpansion }) {
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
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-800">Events & Actions</h3>
      
      <div className="space-y-4">
        {events.map(event => (
          <EventPanel 
            key={event}
            eventName={event}
            isExpanded={expandedEvent === event}
            onToggle={() => toggleEventExpansion(event)}
          />
        ))}
      </div>
    </div>
  );
}

// Event Panel Component
function EventPanel({ eventName, isExpanded, onToggle }) {
  const [actionType, setActionType] = useState('visual');
  const [actions, setActions] = useState([{ type: 'call_query', params: {} }]);
  
  const addAction = () => {
    setActions([...actions, { type: 'call_query', params: {} }]);
  };
  
  const removeAction = (index) => {
    setActions(actions.filter((_, i) => i !== index));
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
                onClick={() => setActionType('visual')}
              >
                Visual
              </button>
              <button 
                className={`px-3 py-1.5 text-xs font-medium ${actionType === 'code' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
                onClick={() => setActionType('code')}
              >
                Code
              </button>
            </div>
          </div>
          
          {actionType === 'visual' ? (
            <div className="space-y-4">
              {actions.map((action, index) => (
                <div key={index} className="bg-gray-50 rounded-md p-3 border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium text-gray-700">Action {index + 1}</h4>
                    <button 
                      className="text-gray-500 hover:text-red-500"
                      onClick={() => removeAction(index)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Action Type</label>
                      <select 
                        value={action.type}
                        onChange={(e) => {
                          const newActions = [...actions];
                          // @ts-ignore
                          newActions[index].type = e.target.value;
                          setActions(newActions);
                        }}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="call_query">Call Query</option>
                        <option value="navigate_to_screen">Navigate To Screen</option>
                        <option value="update_global_state">Update Global State</option>
                        <option value="update_local_state">Update Local State</option>
                        <option value="trigger_workflow">Trigger Workflow</option>
                        <option value="show_toast">Show Toast</option>
                        <option value="open_modal">Open Modal</option>
                        <option value="run_code_block">Run Code Block</option>
                        <option value="refresh_data_self">Refresh Data Self</option>
                      </select>
                    </div>
                    
                    {action.type === 'call_query' && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Query Name</label>
                        <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                          <option>Get Users</option>
                          <option>Update Profile</option>
                          <option>Fetch Products</option>
                        </select>
                      </div>
                    )}
                    
                    {action.type === 'navigate_to_screen' && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Screen</label>
                        <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                          <option>Home</option>
                          <option>Profile</option>
                          <option>Settings</option>
                          <option>Dashboard</option>
                        </select>
                      </div>
                    )}
                    
                    {action.type === 'show_toast' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Message</label>
                          <input 
                            type="text" 
                            placeholder="Toast message" 
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Type</label>
                          <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                            <option>Success</option>
                            <option>Error</option>
                            <option>Info</option>
                            <option>Warning</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              <button 
                onClick={addAction}
                className="w-full flex items-center justify-center gap-1 text-sm font-medium text-blue-600 py-2 bg-blue-50 rounded-md hover:bg-blue-100"
              >
                <Plus size={16} />
                Add Action
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-md border border-gray-200 p-4 h-48">
              <pre className="text-sm text-gray-800">
{`// ${eventName} handler
function ${eventName}Handler(event) {
  // Call an API
  fetch('/api/data')
    .then(response => response.json())
    .then(data => {
      // Update state
      setState({ data });
      
      // Show toast notification
      showToast('Data loaded successfully', 'success');
    });
}`}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Form Group Component
function FormGroup({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {children}
    </div>
  );
}