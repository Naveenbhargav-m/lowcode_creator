import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Database, 
  Braces, 
  BookText, 
  Frame, 
  Squircle, 
  Signal, 
  Palette, 
  Workflow, 
  User, 
  Settings, 
  BookTemplate, 
  KeySquare 
} from 'lucide-react';
import { useLocation } from 'preact-iso';

const AppLogo = () => (
  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
  </div>
);

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState('home');
  const sidebarRef = useRef(null);
  const router = useLocation();

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

  // Update selected state based on current route
  useEffect(() => {
    const currentPath = router.path.replace('/', '') || 'home';
    setSelected(currentPath);
  }, [router.path]);

  const handleItemClick = (item) => {
    setSelected(item);
    setExpanded(false);
    router.route(item);
  };

  // Menu items configuration
  const menuItems = [
    { name: "Home", value: "home", icon: <Home size={20} /> },
    { name: "Containers", value: "containers", icon: <Database size={20} /> },
    { name: "Queries", value: "queries", icon: <Braces size={20} /> },
    { name: "Forms", value: "forms", icon: <BookText size={20} /> },
    { name: "Screens", value: "screens", icon: <Frame size={20} /> },
    { name: "UITemplates", value: "view_templates", icon: <Squircle size={20} /> },
    { name: "UIStates", value: "ui_states", icon: <Signal size={20} /> },
    { name: "Themes", value: "themes", icon: <Palette size={20} /> },
    { name: "Workflows", value: "workflows", icon: <Workflow size={20} /> },
    { name: "Users", value: "users", icon: <User size={20} /> },
    { name: "Settings", value: "settings", icon: <Settings size={20} /> },
    { name: "Templates", value: "templates", icon: <BookTemplate size={20} /> },
    { name: "Secrets", value: "secrets", icon: <KeySquare size={20} /> }
  ];

  return (
    <div className="flex min-h-screen h-full">
      <div
        ref={sidebarRef}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className={`bg-white h-screen flex flex-col items-center py-4 px-2 shadow-lg overflow-hidden
          transition-[width] duration-300 ease-in-out ${
            expanded ? 'w-52' : 'w-16'
          }`}
        
      >
        {/* Logo */}
        <div className="mt-6 mb-8 flex justify-center">
          <div className="h-8 w-8 bg-emerald-500 rounded-full flex justify-center items-center">
            <AppLogo />
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="w-full flex flex-col pt-2 gap-2">
          {menuItems.map((item) => {
            const isSelected = selected === item.value;
            
            return (
              <div
                key={item.value}
                className={`cursor-pointer rounded-md transition-all duration-300 ease-out transform ${
                  isSelected 
                    ? 'bg-emerald-500 scale-105' 
                    : 'hover:bg-emerald-50 hover:scale-102'
                }`}
                onClick={() => handleItemClick(item.value)}
              >
                <div 
                  className={`flex items-center h-8 ${
                    expanded ? 'justify-start' : 'justify-center'
                  }`}
                >
                  <div className={`flex items-center justify-center transition-all duration-300 ease-out ${
                    isSelected ? 'text-white transform scale-110' : 'text-gray-700'
                  }`}>
                    {item.icon}
                  </div>
                  {expanded && (
                    <span 
                      className={`ml-3 font-medium whitespace-nowrap transition-all duration-400 ease-out ${
                        isSelected ? 'text-white' : 'text-gray-700'
                      } ${expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
                      style={{
                        transitionDelay: expanded ? '150ms' : '0ms'
                      }}
                    >
                      {item.name}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;