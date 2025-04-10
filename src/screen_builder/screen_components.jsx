
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
        { name: 'Components', Icon: "component" },
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



const VariableCreator = () => {

  // Inline styles for layout
  const containerStyle = {
    padding: '20px',
    maxWidth: '300px',
    margin: 'auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9'
  };
  const inputStyle = {
    padding: '8px',
    width: '100%',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd'
  };
  const buttonStyle = {
    padding: '8px 12px',
    backgroundColor: '#000000',
    color: '#ffffff',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    width: '100%',
    fontWeight: 'bold'
  };
  const listStyle = {
    listStyleType: 'none',
    padding: 0,
    marginTop: '15px'
  };
  const listItemStyle = {
    padding: '8px',
    borderBottom: '1px solid #ddd',
    color:"#000000"
  };

  useEffect(()=> {
    LoadSignals();
  },[]);

  return (
    <div style={containerStyle}>
      <h3>Variable Creator</h3>
      <input
        type="text"
        value={newVariableKey.value}
        // @ts-ignore
        onInput={(e) => newVariableKey.value = e.target.value}
        placeholder="Enter variable key"
        style={inputStyle}
      />
      <button onClick={addVariable} style={buttonStyle}>Add Variable</button>
      <ul style={listStyle}>
        {variableKeys.value.map((key) => (
          <li key={key} style={listItemStyle}>
            {key}
          </li>
        ))}
      </ul>
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


export  {TabComponent, VariableCreator ,DesktopMockup};
