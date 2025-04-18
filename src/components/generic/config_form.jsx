import { useState } from 'preact/hooks';
import { Code, Database, Palette, Play, X, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import StyleConfig from './config_form_components/styleConfig';
import DataQueryConfig from './config_form_components/dataConfig';
import { EventsConfigWrapper } from './config_form_components/event_panel2';

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
          <EventsConfigWrapper />
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