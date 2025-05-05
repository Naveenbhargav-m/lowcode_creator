import { useState, useEffect, useRef } from 'react';
import { Home, Database, Braces, BookText, Frame, Workflow, User, Settings, BookTemplate, KeySquare } from 'lucide-react';
import { AppLogo } from '../branding/logo';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState('home');
  const sidebarRef = useRef(null);

  // Handle outside clicks to collapse sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleItemClick = (item) => {
    setSelected(item);
    setExpanded(false);
  };

  // Menu items configuration
  const menuItems = [
    { name: "Home", value: "home", icon: <Home size={20} /> },
    { name: "Containers", value: "containers", icon: <Database size={20} /> },
    { name: "Queries", value: "queries", icon: <Braces size={20} /> },
    { name: "Forms", value: "forms", icon: <BookText size={20} /> },
    { name: "Screens", value: "screens", icon: <Frame size={20} /> },
    { name: "Workflows", value: "workflows", icon: <Workflow size={20} /> },
    { name: "Users", value: "users", icon: <User size={20} /> },
    { name: "Settings", value: "settings", icon: <Settings size={20} /> },
    {name: "Templates", value: "templates", icon: <BookTemplate size={20} />},
    {name: "Secrets", value: "secrets", icon: <KeySquare size={20} />}

  ];

  // CSS styles as objects
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      height: '100%'
    },
    sidebar: {
      backgroundColor: 'white',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      width: expanded ? '200px' : '64px',
      transition: 'width 0.3s ease-in-out',
      overflow: 'hidden'
    },
    logoContainer: {
      marginTop: '24px',
      marginBottom: '32px',
      display: 'flex',
      justifyContent: 'center'
    },
    logo: {
      height: '32px',
      width: '32px',
      backgroundColor: '#10b981', // Green color
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    menuList: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: "100px",
      gap: '8px'
    },
    menuItem: (isSelected) => ({
      cursor: 'pointer',
      borderRadius: '6px',
      backgroundColor: isSelected ? '#10b981' : 'transparent',
      transition: 'background-color 0.2s ease',
      ':hover': {
        backgroundColor: isSelected ? '#10b981' : '#e6f7f1' // Light green on hover
      }
    }),
    menuLink: (isSelected, isExpanded) => ({
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      textDecoration: 'none',
      justifyContent: isExpanded ? 'flex-start' : 'center',
      height: '40px'
    }),
    iconContainer: (isSelected) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: isSelected ? 'white' : '#374151'
    }),
    menuText: (isSelected) => ({
      marginLeft: '12px',
      transition: 'opacity 0.2s ease',
      fontWeight: 500,
      color: isSelected ? 'white' : '#374151',
      whiteSpace: 'nowrap'
    })
  };

  return (
    <div style={styles.container}>
      <div
        ref={sidebarRef}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        style={styles.sidebar}
      >
        <div style={styles.logoContainer}>
          <div style={styles.logo}>
            <AppLogo />
           </div>
        </div>
        
        <div style={styles.menuList}>
          {menuItems.map((item) => {
            const isSelected = selected === item.value;
            
            return (
              <div
                key={item.value}
                style={{
                  ...styles.menuItem(isSelected),
                  backgroundColor: isSelected ? '#10b981' : 'transparent',
                  ':hover': undefined // Can't use pseudo-classes in inline styles
                }}
                onMouseOver={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#e6f7f1';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <a
                  href={`/${item.value}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(item.value);
                  }}
                  style={styles.menuLink(isSelected, expanded)}
                >
                  <div style={styles.iconContainer(isSelected)}>
                    {item.icon}
                  </div>
                  {expanded && (
                    <span style={styles.menuText(isSelected)}>
                      {item.name}
                    </span>
                  )}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;