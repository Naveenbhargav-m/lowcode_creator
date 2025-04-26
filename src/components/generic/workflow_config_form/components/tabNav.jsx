import { useState, useEffect } from "preact/hooks";

const TabNav = ({ tabs, defaultActiveTab = 0, onChange }) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  useEffect(() => {
    // Call onChange when activeTab changes
    if (onChange) {
      onChange(activeTab);
    }
  }, [activeTab, onChange]);

  const navStyle = {
    width: '100%',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    display: 'flex',
    padding: '0',
    margin: '0',
    boxSizing: 'border-box'
  };

  const tabsContainerStyle = {
    display: 'flex',
    listStyle: 'none',
    padding: '0',
    margin: '0'
  };

  const tabStyle = (index) => ({
    padding: '10px 20px',
    cursor: 'pointer',
    textAlign: 'center',
    backgroundColor: activeTab === index ? '#e0e0e0' : 'transparent',
    borderBottom: activeTab === index ? '2px solid #007bff' : 'none',
    transition: 'all 0.3s ease'
  });

  // Debug the click handler to ensure it's working for all indexes
  const handleTabClick = (index) => {
    console.log(`Tab clicked: ${index}`);
    setActiveTab(index);
  };

  return (
    <div style={navStyle}>
        {tabs.map((tab, index) => (
          <li 
            key={index}
            style={tabStyle(index)}
            onClick={() => handleTabClick(index)}
            data-index={index} // Add a data attribute for debugging
          >
            {tab}
          </li>
        ))}
    </div>
  );
};

export default TabNav;