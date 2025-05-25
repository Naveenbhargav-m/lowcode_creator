
import DynamicIcon from '../components/custom/dynamic_icon';
import { activeTab} from './screen_state';
import { variableKeys , newVariableKey , addVariable, LoadSignals } from '../states/global_state';
import { useEffect } from 'preact/hooks';

const TabComponent = () => {

  const setActiveTab = (tabName) => {
    activeTab.value = tabName;
  };

  // Inline styles for floating, rounded tabs
  const tabStyle = (isActive) => ({
    padding: '5px 8px',
    margin:'0px 5px',
    cursor: 'pointer',
    borderRadius: '20px',
    backgroundColor: isActive ? '#000000' : '#ffffff',
    color: isActive ? '#ffffff' : '#000000',
    boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 2px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      {/* Render each tab */}
      {[
        { name: 'Screen', Icon: "laptop-minimal" },
        { name: 'Template', Icon: "layout-template" },
        { name: 'GlobalVars', Icon: "braces" },
        {name:"Themes", Icon:"palette"}
      ].map(({ name, Icon }) => (
        <div
          key={name}
          style={tabStyle(activeTab.value === name)}
          onClick={() => setActiveTab(name)}
        >
          <DynamicIcon name={Icon} size={20}/>
          {name}
        </div>
      ))}
    </div>
  );
};



const DesktopMockup = ({ children }) => {
  return (
      <div
        className="flex flex-col justify-center items-center h-5/6 border border-4 border-black rounded-lg m-2 overflow-hidden"
        style={{"width":"100%"}}
      >
        <div className="h-full w-full overflow-auto scrollbar-hide">
          {children}
        </div>
        
      </div>
    );
};


export {TabComponent, DesktopMockup};