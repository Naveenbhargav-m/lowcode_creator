import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  X, 
  Check, 
  Folder, 
  Database, 
  Table, 
  File 
} from 'lucide-react';

// Dummy data for testing
const dummyData = {
  "User Data": [
    {
      id: "user_table_1",
      name: "Users",
      fields: [
        { name: "email", type: "string", fid: "user_email" },
        { name: "age", type: "number", fid: "user_age" },
        { name: "name", type: "string", fid: "user_name" }
      ]
    },
    {
      id: "profile_table_1", 
      name: "User Profiles",
      fields: [
        { name: "bio", type: "text", fid: "profile_bio" },
        { name: "avatar", type: "string", fid: "profile_avatar" }
      ]
    }
  ],
  "System Metrics": [
    {
      id: "cpu_usage",
      name: "CPU Usage"
    },
    {
      id: "memory_usage", 
      name: "Memory Usage"
    }
  ],
  "Analytics": [
    {
      id: "events_table",
      name: "Events",
      fields: [
        { name: "event_type", type: "string", fid: "evt_type" },
        { name: "timestamp", type: "datetime", fid: "evt_time" },
        { name: "user_id", type: "string", fid: "evt_user" }
      ]
    }
  ]
};

export default function GlobalSignalsPopup({ initialOpen = true, fields = dummyData, selectedItems = [], onClose = (e, data) => {} }) {
 console.log("selected items:",selectedItems); 
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [pickedItems, setPickedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const [filteredSections, setFilteredSections] = useState(fields);
  useEffect(() => {
    setIsOpen(initialOpen);
  }, [initialOpen]);

  useEffect((
    ()=> {
      setPickedItems(selectedItems);
    }
  ),[selectedItems]);
  
  // Initialize expanded sections when component mounts
  useEffect(() => {
    const initialExpandedState = {};
    
    const initializeExpanded = (obj, prefix = '') => {
      Object.keys(obj).forEach(key => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        initialExpandedState[fullKey] = false;
        
        if (Array.isArray(obj[key])) {
          obj[key].forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              Object.keys(item).forEach(subKey => {
                if (Array.isArray(item[subKey])) {
                  const subFullKey = `${fullKey}[${index}].${subKey}`;
                  initialExpandedState[subFullKey] = false;
                }
              });
            }
          });
        }
      });
    };
    
    initializeExpanded(fields);
    setExpandedSections(initialExpandedState);
    setFilteredSections(fields);
  }, [fields]);
  
  // Helper function to check if an item matches search term
  const itemMatchesSearch = (item, searchTerm) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    
    if (typeof item === 'string') {
      return item.toLowerCase().includes(term);
    }
    
    if (typeof item === 'object' && item !== null) {
      return Object.values(item).some(value => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term);
        }
        return false;
      });
    }
    
    return false;
  };
  
  // Filter sections and items based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSections(fields);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = {};
    
    Object.entries(fields).forEach(([section, items]) => {
      // Check if section name matches
      const sectionMatches = section.toLowerCase().includes(searchTermLower);
      
      if (Array.isArray(items)) {
        // Filter items that match search term
        const matchingItems = items.filter(item => itemMatchesSearch(item, searchTerm));
        
        // Include section if section name matches or if it has matching items
        if (sectionMatches || matchingItems.length > 0) {
          filtered[section] = matchingItems.length > 0 ? matchingItems : items;
          
          // Auto-expand sections with matching items when searching
          if (searchTerm) {
            setExpandedSections(prev => ({
              ...prev,
              [section]: true
            }));
          }
        }
      }
    });
    
    // @ts-ignore
    setFilteredSections(filtered);
  }, [searchTerm, fields]);
  
  // FIXED: Generate path for nested items - use field identifier instead of index
  const generatePath = (section, itemIndex, subField = null, subItemIndex = null, fieldData = null) => {
    if (subField && subItemIndex !== null && fieldData) {
      // For nested fields, use the field's fid or name as identifier
      const fieldId = fieldData.fid || fieldData.name || `field_${subItemIndex}`;
      return `${section}.${fieldId}`;
    }
    if (subField) {
      return `${section}[${itemIndex}].${subField}`;
    }
    // For top-level items, use the item's id or name
    const item = fields[section]?.[itemIndex];
    const itemId = item?.id || item?.name || `item_${itemIndex}`;
    return `${section}.${itemId}`;
  };
  
  // Toggle an item selection
  const toggleItem = (path) => {
    const newPickedItems = [...pickedItems];
    const index = newPickedItems.indexOf(path);
    
    if (index === -1) {
      newPickedItems.push(path);
    } else {
      newPickedItems.splice(index, 1);
    }
    
    setPickedItems(newPickedItems);
  };
  
  // Toggle a section's expanded state
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Toggle all items in a section or subsection
  const toggleSectionItems = (paths) => {
    const allSelected = paths.every(path => pickedItems.includes(path));
    
    if (allSelected) {
      // Remove all items from this section
      setPickedItems(pickedItems.filter(item => !paths.includes(item)));
    } else {
      // Add all missing items from this section
      const newItems = paths.filter(path => !pickedItems.includes(path));
      setPickedItems([...pickedItems, ...newItems]);
    }
  };
  
  // Expand all sections
  const expandAll = () => {
    const newExpandedSections = {};
    Object.keys(expandedSections).forEach(key => {
      newExpandedSections[key] = true;
    });
    setExpandedSections(newExpandedSections);
  };
  
  // Collapse all sections
  const collapseAll = () => {
    const newExpandedSections = {};
    Object.keys(expandedSections).forEach(key => {
      newExpandedSections[key] = false;
    });
    setExpandedSections(newExpandedSections);
  };
  
  // Clear all selections
  const clearAll = () => {
    setPickedItems([]);
  };
  
  // Handle the apply button
  const handleApply = () => {
    console.log("Selected items:", pickedItems);
    setIsOpen(false);
    onClose(null, pickedItems);
  };

  // Toggle the popup open/closed
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  
  // Highlight search matches
  const highlightMatches = (text, term) => {
    if (!term || typeof text !== 'string') return text;
    
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === term.toLowerCase() ? 
        <span key={i} className="bg-yellow-200">{part}</span> : part
    );
  };
  
  // FIXED: Render nested fields with proper path generation
  const renderNestedFields = (item, itemIndex, section) => {
    if (!item.fields || !Array.isArray(item.fields)) return null;
    
    const fieldsKey = `${section}[${itemIndex}].fields`;
    const fieldsExpanded = expandedSections[fieldsKey];
    
    // Calculate selected fields count with proper paths
    const fieldPaths = item.fields.map((field, fieldIndex) => 
      generatePath(section, itemIndex, 'fields', fieldIndex, field)
    );
    const selectedFieldsCount = fieldPaths.filter(path => pickedItems.includes(path)).length;
    const allFieldsSelected = selectedFieldsCount === item.fields.length;
    const someFieldsSelected = selectedFieldsCount > 0 && !allFieldsSelected;
    
    return (
      <div className="ml-8 mt-2 border-l-2 border-gray-200 pl-4">
        {/* Fields header */}
        <div 
          className="bg-gray-50 hover:bg-gray-100 p-2 flex items-center justify-between cursor-pointer rounded"
          onClick={() => toggleSection(fieldsKey)}
        >
          <div className="flex items-center">
            {fieldsExpanded ? (
              <ChevronDown size={16} className="text-gray-500 mr-2" />
            ) : (
              <ChevronRight size={16} className="text-gray-500 mr-2" />
            )}
            <Table size={16} className="text-green-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Fields ({item.fields.length})
            </span>
            
            {/* Selection indicator */}
            {(someFieldsSelected || allFieldsSelected) && (
              <span className="ml-2 text-xs bg-green-100 text-green-800 rounded-full px-2 py-0.5">
                {selectedFieldsCount}/{item.fields.length}
              </span>
            )}
          </div>
          
          {/* Select All Fields button */}
          <button
            className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              toggleSectionItems(fieldPaths);
            }}
          >
            {allFieldsSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        
        {/* Fields list */}
        {fieldsExpanded && (
          <div className="mt-2 space-y-1">
            {item.fields.map((field, fieldIndex) => {
              const fieldPath = generatePath(section, itemIndex, 'fields', fieldIndex, field);
              const isSelected = pickedItems.includes(fieldPath);
              
              return (
                <div
                  key={fieldIndex}
                  className={`p-2 rounded flex items-center cursor-pointer ${
                    isSelected ? 'bg-green-100' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleItem(fieldPath)}
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center mr-2 border ${
                    isSelected ? 'bg-green-500 border-green-600' : 'border-gray-300'
                  }`}>
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center">
                      <File size={14} className="text-gray-400 mr-2" />
                      <span className={`text-sm ${isSelected ? 'text-green-800' : 'text-gray-700'}`}>
                        {searchTerm ? highlightMatches(field.name, searchTerm) : field.name}
                      </span>
                      <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-1 rounded">
                        {field.type}
                      </span>
                    </div>
                    {field.fid && (
                      <span className="text-xs text-gray-400 ml-6">
                        ID: {field.fid}
                      </span>
                    )}
                    {/* Show the generated path for debugging */}
                    <span className="text-xs text-blue-500 ml-6 font-mono">
                      Path: {fieldPath}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="flex items-center justify-center p-4">      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl flex flex-col overflow-hidden" style={{ maxHeight: '90vh' }}>
            
            {/* Search box */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search signals..."
                  value={searchTerm}
                  // @ts-ignore
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setSearchTerm("")}
                  >
                    <X size={16} className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Selected items summary */}
            {pickedItems.length > 0 && (
              <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">{pickedItems.length}</span> signal{pickedItems.length !== 1 ? 's' : ''} selected
                </p>
                <button 
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  onClick={clearAll}
                >
                  Clear all
                </button>
              </div>
            )}
            
            {/* Selected items display for debugging */}
            {pickedItems.length > 0 && (
              <div className="px-4 py-2 bg-green-50 border-b border-green-100">
                <p className="text-xs text-green-800 font-medium mb-1">Selected Paths:</p>
                <div className="text-xs text-green-700 font-mono space-y-1">
                  {pickedItems.map((path, index) => (
                    <div key={index}>{path}</div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Expand/collapse controls */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <span className="text-sm text-gray-600 font-medium">Categories</span>
              <div className="space-x-4">
                <button 
                  className="text-xs text-blue-600 hover:text-blue-800"
                  onClick={expandAll}
                >
                  Expand all
                </button>
                <button 
                  className="text-xs text-blue-600 hover:text-blue-800"
                  onClick={collapseAll}
                >
                  Collapse all
                </button>
              </div>
            </div>
            
            {/* Content - Scrollable area */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-3">
                {Object.keys(filteredSections).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No signals match your search
                  </div>
                ) : (
                  Object.entries(filteredSections).map(([section, items], sectionIndex) => {
                    if (!Array.isArray(items)) return null;
                    
                    // Calculate how many items in this section are selected (including nested items)
                    const allPaths = [];
                    items.forEach((item, itemIndex) => {
                      allPaths.push(generatePath(section, itemIndex));
                      if (item.fields && Array.isArray(item.fields)) {
                        item.fields.forEach((field, fieldIndex) => {
                          allPaths.push(generatePath(section, itemIndex, 'fields', fieldIndex, field));
                        });
                      }
                    });
                    
                    const selectedCount = allPaths.filter(path => pickedItems.includes(path)).length;
                    const allSelected = selectedCount === allPaths.length && allPaths.length > 0;
                    const someSelected = selectedCount > 0 && !allSelected;
                    
                    return (
                      <div key={sectionIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                        {/* Section Header */}
                        <div 
                          className="bg-gray-50 hover:bg-gray-100 p-3 flex items-center justify-between cursor-pointer"
                          onClick={() => toggleSection(section)}
                        >
                          <div className="flex items-center">
                            {expandedSections[section] ? (
                              <ChevronDown size={18} className="text-gray-500 mr-2" />
                            ) : (
                              <ChevronRight size={18} className="text-gray-500 mr-2" />
                            )}
                            <Folder size={18} className="text-blue-500 mr-2" />
                            <span className="font-medium text-gray-800">
                              {searchTerm ? highlightMatches(section, searchTerm) : section}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">({items.length})</span>
                            
                            {/* Selection indicator */}
                            {(someSelected || allSelected) && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                                {selectedCount}/{allPaths.length}
                              </span>
                            )}
                          </div>
                          
                          {/* Select All button */}
                          {items.length > 0 && (
                            <button
                              className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSectionItems(allPaths);
                              }}
                            >
                              {allSelected ? 'Deselect All' : 'Select All'}
                            </button>
                          )}
                        </div>
                        
                        {/* Section Items */}
                        {expandedSections[section] && (
                          <div className="max-h-96 overflow-y-auto">
                            {items.map((item, itemIndex) => {
                              const itemPath = generatePath(section, itemIndex);
                              const isSelected = pickedItems.includes(itemPath);
                              
                              return (
                                <div key={itemIndex} className="mx-2 my-1">
                                  {/* Main item */}
                                  <div
                                    className={`px-3 py-2 rounded-md flex items-center cursor-pointer ${
                                      isSelected ? 'bg-blue-100' : 'hover:bg-gray-50'
                                    }`}
                                    onClick={() => toggleItem(itemPath)}
                                  >
                                    <div className={`w-5 h-5 rounded flex items-center justify-center mr-2 border ${
                                      isSelected ? 'bg-blue-500 border-blue-600' : 'border-gray-300'
                                    }`}>
                                      {isSelected && <Check size={14} className="text-white" />}
                                    </div>
                                    <div className="flex flex-col flex-1">
                                      <div className="flex items-center">
                                        <Database size={16} className="text-gray-400 mr-2" />
                                        <span className={isSelected ? 'text-blue-800' : 'text-gray-700'}>
                                          {searchTerm ? highlightMatches(item.name || item.id, searchTerm) : (item.name || item.id)}
                                        </span>
                                        {item.id && item.name && (
                                          <span className="ml-2 text-xs text-gray-500">
                                            (ID: {item.id})
                                          </span>
                                        )}
                                      </div>
                                      {/* Show the generated path for debugging */}
                                      <span className="text-xs text-blue-500 font-mono">
                                        Path: {itemPath}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* Nested fields if they exist */}
                                  {renderNestedFields(item, itemIndex, section)}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-gray-200 flex justify-end bg-gray-50">
              <button 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-3 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleApply}
                disabled={pickedItems.length === 0}
              >
                Apply ({pickedItems.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}