import { useState } from 'preact/hooks';
import { Code, Database, Palette, Play, X, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import StyleConfig from './config_form_components/styleConfig';
import DataQueryConfig from './config_form_components/dataConfig';
import { EventsConfigWrapper } from './config_form_components/event_panel2';

  let flexOptions = [
    { value: 'row', label: 'row' },
    { value: 'column', label: 'column' },
    { value: 'row-reverse', label: 'row-reverse' },
    { value: 'column-reverse', label: 'column-reverse' }
  ];

  let justify = [
    { value: 'center', label: 'center' },
    { value: 'flex-start', label: 'start' },
    { value: 'flex-end', label: 'end' },
    { value: 'space-between', label: 'space-between' },
    { value: 'space-around', label: 'space-between' },
  ];
  const styleConfig = {
    sections: [
      {
        "id": "Flex",
        "title": "layout",
        fields: [
          { 
            id: 'display', 
            label: 'Display', 
            type: 'text',
            cssProperty: 'display'
          },
          { 
            id: 'flexDirection', 
            label: 'flex Direction', 
            type: 'select',
            cssProperty: 'flexDirection',
            options: flexOptions,
          },
          { 
            id: 'justifyContent', 
            label: 'justify', 
            type: 'select',
            cssProperty: 'justifyContent',
            options: justify,
          },
          { 
            id: 'alignItems', 
            label: 'AlighItems', 
            type: 'select',
            cssProperty: 'alignItems',
            options: justify,
          },
        ],
      },
      {
        id: 'basics',
        title: 'Basic Properties',
        fields: [
          { 
            id: 'color', 
            label: 'Color', 
            type: 'color',
            cssProperty: 'color'
          },
          { 
            id: 'backgroundColor', 
            label: 'Background Color', 
            type: 'color',
            cssProperty: 'background-color'
          },
          { 
            id: 'borderRadius', 
            label: 'Border Radius', 
            type: 'text',
            cssProperty: 'border-radius'
          }
        ]
      },
      {
        id: 'typography',
        title: 'Typography',
        fields: [
          { 
            id: 'fontFamily', 
            label: 'Font Family', 
            type: 'select',
            cssProperty: 'font-family',
            options: [
              { value: 'Inter', label: 'Inter' },
              { value: 'Roboto', label: 'Roboto' },
              { value: 'Open Sans', label: 'Open Sans' }
            ]
          },
          { 
            id: 'fontSize', 
            label: 'Font Size', 
            type: 'text',
            cssProperty: 'font-size'
          },
          { 
            id: 'fontWeight', 
            label: 'Font Weight', 
            type: 'select',
            cssProperty: 'font-weight',
            options: [
              { value: '300', label: 'Light (300)' },
              { value: '400', label: 'Regular (400)' },
              { value: '700', label: 'Bold (700)' }
            ]
          }
        ]
      },
      {
        id: 'spacing',
        title: 'Spacing',
        fields: [
          { 
            id: 'padding', 
            label: 'Padding', 
            type: 'text',
            cssProperty: 'padding'
          },
          { 
            id: 'margin', 
            label: 'Margin', 
            type: 'text',
            cssProperty: 'margin'
          },
          { 
            id: 'height', 
            label: 'Height', 
            type: 'text',
            cssProperty: 'height'
          },
          { 
            id: 'width', 
            label: 'Width', 
            type: 'text',
            cssProperty: 'width'
          },
          { 
            id: 'z-index', 
            label: 'z-index', 
            type: 'text',
            cssProperty: 'z-index'
          }
        ]
      }
    ]
  };

// Main Config Form Component
export default function ConfigUpdater({initalData , updateCallBack, dataSourceConfig, dataSources, onDataSourceUpdate}) {
  const [activeTab, setActiveTab] = useState('style');  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
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
        {activeTab === 'style' && <StyleConfig styleConfig={styleConfig} 
        defaultValues={initalData} updateCallback={updateCallBack} />}
        {activeTab === 'data' && <DataQueryConfig initialData={dataSources} config={dataSourceConfig} onUpdate={dataSourceConfig} />}
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