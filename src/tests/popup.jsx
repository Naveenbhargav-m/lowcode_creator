import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Check, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Folder,
  File,
  FileJson,
  FileText,
  List,
  Settings
} from 'lucide-react';

// Type definitions
const ConfigItemType = {
  OBJECT: 'object',
  STRING: 'string',
  ARRAY: 'array'
};

// Badge component for showing item types
const TypeBadge = ({ type }) => {
  const getBadgeColor = () => {
    switch (type) {
      case ConfigItemType.OBJECT:
        return 'bg-indigo-100 text-indigo-800';
      case ConfigItemType.ARRAY:
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-emerald-100 text-emerald-800';
    }
  };

  const getLabel = () => {
    switch (type) {
      case ConfigItemType.OBJECT:
        return 'Object';
      case ConfigItemType.ARRAY:
        return 'Array';
      default:
        return 'String';
    }
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getBadgeColor()}`}>
      {getLabel()}
    </span>
  );
};

// ConfigItem Component - Renders a single config item with folder-like structure
const ConfigItem = ({ item, level = 0, isSelected, onSelect, path = [], allSelectedItems }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const isObject = typeof item === 'object' && item !== null && !Array.isArray(item);
  const isArray = Array.isArray(item);
  const type = isArray ? ConfigItemType.ARRAY : (isObject ? ConfigItemType.OBJECT : ConfigItemType.STRING);
  
  // Check if this item is inside the selected path
  const isInSelectedPath = () => {
    if (!allSelectedItems || allSelectedItems.length === 0) return false;
    
    // Check if this item is part of the path for any selected item
    return allSelectedItems.some(selectedItem => {
      if (!selectedItem.path || selectedItem.path.length === 0) return false;
      
      // If our path is longer than the selected path, it can't be a parent
      if (path.length > selectedItem.path.length) return false;
      
      // Check if our path matches the beginning of the selected path
      for (let i = 0; i < path.length; i++) {
        if (path[i] !== selectedItem.path[i]) return false;
      }
      
      return true;
    });
  };
  
  // Auto expand if this item is in a selected path
  useEffect(() => {
    if (isInSelectedPath()) {
      setIsExpanded(true);
    }
  }, [allSelectedItems]);
  
  const handleToggle = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };
  
  const handleSelect = (e) => {
    e.stopPropagation();
    onSelect({ item, path, type });
  };
  
  const getItemName = () => {
    if (type === ConfigItemType.STRING) return String(item);
    return item.name || path[path.length - 1] || "Unnamed Item";
  };

  const getIcon = () => {
    if (type === ConfigItemType.OBJECT) {
      return <Folder size={16} className="text-indigo-500" />;
    } else if (type === ConfigItemType.ARRAY) {
      return <List size={16} className="text-amber-500" />;
    } else if (typeof item === 'boolean') {
      return <Settings size={16} className="text-emerald-500" />;
    } else if (typeof item === 'number') {
      return <FileText size={16} className="text-emerald-500" />;
    } else {
      return <FileText size={16} className="text-emerald-500" />;
    }
  };
  
  const hasChildren = type === ConfigItemType.OBJECT || type === ConfigItemType.ARRAY;
  const isParentOfSelected = isInSelectedPath() && !isSelected;
  
  return (
    <div className="w-full">
      <div 
        className={`flex items-center py-2 px-2 rounded-md cursor-pointer transition-all duration-200
          ${isSelected ? 'bg-blue-100 border-l-4 border-blue-500 font-semibold shadow-sm' : ''}
          ${isParentOfSelected ? 'bg-blue-50' : ''}
          ${isHovered && !isSelected ? 'bg-gray-50' : ''}
        `}
        onClick={handleSelect}
        style={{ paddingLeft: `${(level * 1) + 0.5}rem` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {hasChildren && (
          <button 
            className="mr-1 focus:outline-none text-gray-500 hover:bg-gray-100 rounded p-1"
            onClick={handleToggle}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
        
        {!hasChildren && <div className="w-6"></div>}
        
        <div className="ml-1 mr-2">
          {getIcon()}
        </div>
        
        <div className={`flex-grow truncate ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
          {getItemName()}
        </div>
        
        <div className="ml-2 flex items-center space-x-2">
          {!isSelected && (
            <div className="opacity-60">
              <TypeBadge type={type} />
            </div>
          )}
          
          {isSelected && (
            <div className="flex items-center justify-center text-blue-500">
              <Check size={16} />
            </div>
          )}
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div className={`border-l-2 ${isInSelectedPath() ? 'border-blue-200' : 'border-gray-200'} ml-4`}>
          {type === ConfigItemType.OBJECT ? (
            Object.entries(item).map(([key, value], index) => {
              if (key === 'name' || key === 'id') return null;
              return (
                <ConfigItem 
                  key={index}
                  item={value} 
                  level={level + 1} 
                  isSelected={allSelectedItems?.some(selected => 
                    selected.item === value || 
                    (selected.item.id && value.id && selected.item.id === value.id)
                  )}
                  onSelect={onSelect}
                  // @ts-ignore
                  path={[...path, key]}
                  allSelectedItems={allSelectedItems}
                />
              );
            })
          ) : (
            item.map((value, index) => (
              <ConfigItem 
                key={index}
                item={value} 
                level={level + 1} 
                isSelected={allSelectedItems?.some(selected => 
                  selected.item === value || 
                  (selected.item.id && value.id && selected.item.id === value.id)
                )}
                onSelect={onSelect}
                // @ts-ignore
                path={[...path, index]}
                allSelectedItems={allSelectedItems}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

// SearchBar Component
const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };
  
  return (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={16} className="text-gray-400" />
      </div>
      <input
        type="text"
        className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
        placeholder="Search configuration..."
        value={query}
        onChange={handleChange}
      />
      {query && (
        <button
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={handleClear}
        >
          <X size={16} className="text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
};

// SelectedItems Component - Shows the currently selected items with a modern design
const SelectedItems = ({ selectedItems, onRemove }) => {
  if (selectedItems.length === 0) return null;
  
  return (
    <div className="mb-4">
      <div className="text-sm font-medium text-gray-500 mb-2 flex items-center">
        <Check size={14} className="mr-1" /> Selected Items ({selectedItems.length})
      </div>
      <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 bg-blue-50 rounded-lg border border-blue-100">
        {selectedItems.map((item, index) => {
          const itemName = typeof item.item === 'object' 
            ? (item.item.name || 'Object') 
            : String(item.item);
          
          return (
            <div 
              key={index} 
              className="flex items-center bg-white border border-blue-200 text-blue-800 px-2 py-1 rounded-md shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="mr-1 truncate max-w-xs text-sm">
                {itemName}
              </span>
              <button 
                className="focus:outline-none hover:bg-blue-100 rounded-full p-1" 
                onClick={() => onRemove(index)}
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// PathInfo - Shows the path breadcrumb for selected item
const PathInfo = ({ path }) => {
  if (!path || path.length === 0) return null;
  
  return (
    <div className="flex items-center text-xs text-gray-500 mb-1 ml-2">
      <span>Path: </span>
      {path.map((segment, index) => (
        <div key={index} className="flex items-center">
          <span className="mx-1 font-medium">{String(segment)}</span>
          {index < path.length - 1 && <ChevronRight size={12} />}
        </div>
      ))}
    </div>
  );
};

// Main ConfigSelectorPopup Component
const ConfigSelectorPopup = ({ 
  config, 
  isOpen, 
  onClose, 
  onConfirm, 
  preselectedItems = [] 
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConfig, setFilteredConfig] = useState(config);
  const [hoveredItem, setHoveredItem] = useState(null);
  const popupRef = useRef(null);

  useEffect(() => {
    if (preselectedItems.length > 0) {
      setSelectedItems(preselectedItems);
    }
  }, [preselectedItems]);

  useEffect(() => {
    if (searchQuery) {
      // Enhanced search implementation with deeper object search
      const filterConfig = (obj) => {
        if (typeof obj !== 'object' || obj === null) {
          return String(obj).toLowerCase().includes(searchQuery.toLowerCase());
        }
        
        if (Array.isArray(obj)) {
          return obj.some(item => filterConfig(item));
        }
        
        // For objects, check if name contains the search query
        if (obj.name && String(obj.name).toLowerCase().includes(searchQuery.toLowerCase())) {
          return true;
        }
        
        // Also check all other properties
        return Object.values(obj).some(val => filterConfig(val));
      };
      
      setFilteredConfig(filterConfig(config) ? config : null);
    } else {
      setFilteredConfig(config);
    }
  }, [searchQuery, config]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSelect = (itemData) => {
    const isAlreadySelected = selectedItems.some(
      selected => 
        (selected.item === itemData.item) || 
        (selected.item.id && itemData.item.id && selected.item.id === itemData.item.id)
    );
    
    if (isAlreadySelected) {
      setSelectedItems(selectedItems.filter(
        item => 
          item.item !== itemData.item && 
          (!item.item.id || !itemData.item.id || item.item.id !== itemData.item.id)
      ));
    } else {
      setSelectedItems([...selectedItems, itemData]);
    }
  };

  const handleRemove = (index) => {
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    setSelectedItems(newItems);
  };

  const handleConfirm = () => {
    onConfirm(selectedItems.map(item => ({
      value: item.item,
      id: item.item.id || null,
      path: item.path,
      type: item.type
    })));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div 
        ref={popupRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-screen flex flex-col overflow-hidden border border-gray-200"
      >
        <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Data Selector</h2>
            <p className="text-xs text-gray-500">Select configuration items to use in your app</p>
          </div>
          <button 
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 flex-grow overflow-hidden flex flex-col">
          <SearchBar onSearch={setSearchQuery} />
          
          <SelectedItems 
            selectedItems={selectedItems} 
            onRemove={handleRemove} 
          />
          
          <div className="overflow-y-auto flex-grow rounded-lg border border-gray-200">
            {filteredConfig ? (
              <div className="p-1">
                <ConfigItem 
                  item={filteredConfig} 
                  isSelected={selectedItems.some(item => item.item === filteredConfig)}
                  onSelect={handleSelect}
                  allSelectedItems={selectedItems}
                />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50">
                <FileJson size={36} className="mx-auto mb-2 text-gray-300" />
                <p>No matching items found</p>
                <p className="text-sm text-gray-400">Try adjusting your search</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
          </div>
          <div className="flex gap-2">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg font-medium ${
                selectedItems.length > 0 
                  ? 'hover:bg-blue-600' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={handleConfirm}
              disabled={selectedItems.length === 0}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo App to demonstrate usage
export default function ConfigPanelTest() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState([]);
  
  // Example config object
  const sampleConfig = {
    name: "Main Configuration",
    id: "main-config-001",
    settings: {
      name: "Application Settings",
      id: "app-settings-002",
      display: {
        name: "Display Settings",
        id: "display-003",
        theme: "dark",
        fontSize: "medium",
        animations: true
      },
      notifications: {
        name: "Notification Settings",
        id: "notifications-004",
        email: true,
        push: false,
        frequency: "daily"
      }
    },
    users: [
      {
        name: "Admin User",
        id: "user-001",
        role: "admin",
        permissions: ["read", "write", "delete"]
      },
      {
        name: "Regular User",
        id: "user-002",
        role: "user",
        permissions: ["read"]
      }
    ],
    features: {
      name: "Feature Flags",
      id: "features-005",
      newDashboard: true,
      betaFeatures: false,
      experimentalApi: true
    }
  };
  
  // Pre-selected items example
  const preselectedItems = [
    {
      item: sampleConfig.settings.display,
      path: ["settings", "display"],
      type: "object"
    }
  ];
  
  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };
  
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };
  
  const handleConfirm = (items) => {
    setSelectedConfig(items);
    console.log("Selected items:", items);
  };
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Low-Code Config Selector</h1>
        <p className="text-gray-500 mb-6">Select configuration items to use in your application</p>
        
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center"
          onClick={handleOpenPopup}
        >
          <Settings size={16} className="mr-2" />
          Open Config Selector
        </button>
        
        {selectedConfig.length > 0 && (
          <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">Selected Configuration:</h2>
            <pre className="bg-white p-4 rounded-md overflow-auto max-h-60 border border-gray-200 text-sm">
              {JSON.stringify(selectedConfig, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <ConfigSelectorPopup 
        config={sampleConfig}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onConfirm={handleConfirm}
        preselectedItems={preselectedItems}
      />
    </div>
  );
}