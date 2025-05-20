import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Folder, File, Check, X, Search } from 'lucide-react';

// Dummy data for testing
const dummyData = {
  "System Metrics": [
    { name: "CPU Usage", description: "Central Processing Unit utilization" },
    { name: "Memory Usage", description: "RAM utilization" },
    { name: "Disk I/O", description: "Disk input/output operations" },
    { name: "Network Traffic", description: "Network bandwidth utilization" }
  ],
  "Application Logs": [
    { name: "Error Rate", description: "Application error frequency" },
    { name: "Response Time", description: "API response timing" },
    { name: "Request Count", description: "Number of incoming requests" }
  ],
  "User Analytics": [
    { name: "Active Users", description: "Currently active users" },
    { name: "Session Duration", description: "Average user session length" },
    { name: "Conversion Rate", description: "User conversion percentage" },
    { name: "Bounce Rate", description: "Single page visit percentage" }
  ],
  "Infrastructure": [
    { name: "Server Health", description: "Overall server status" },
    { name: "Load Balancer Status", description: "Load distribution metrics" },
    { name: "Database Connections", description: "Active database connections" }
  ]
};

export default function GlobalSignalsPopup({ initialOpen = false, fields = dummyData, onClose = (e,data) => {} }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [pickedItems, setPickedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const [filteredSections, setFilteredSections] = useState(fields);


  useEffect((() => {
    setIsOpen(initialOpen);
  }),[initialOpen]);
  
  // Initialize expanded sections when component mounts
  useEffect(() => {
    const initialExpandedState = {};
    Object.keys(fields).forEach(key => {
      initialExpandedState[key] = false;
    });
    setExpandedSections(initialExpandedState);
    setFilteredSections(fields);
  }, [fields]);
  
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
      
      // Filter items that match search term
      const matchingItems = items.filter(item => 
        item.name.toLowerCase().includes(searchTermLower) ||
        (item.description && item.description.toLowerCase().includes(searchTermLower))
      );
      
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
    });
    
    setFilteredSections(filtered);
  }, [searchTerm, fields]);
  
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
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  // Toggle all items in a section
  const toggleSectionItems = (section, items) => {
    const sectionPaths = items.map(item => `${section}.${item.name}`);
    const allSelected = sectionPaths.every(path => pickedItems.includes(path));
    
    if (allSelected) {
      // Remove all items from this section
      setPickedItems(pickedItems.filter(item => !sectionPaths.includes(item)));
    } else {
      // Add all missing items from this section
      const newItems = sectionPaths.filter(path => !pickedItems.includes(path));
      setPickedItems([...pickedItems, ...newItems]);
    }
  };
  
  // Expand all sections
  const expandAll = () => {
    const newExpandedSections = {};
    Object.keys(fields).forEach(key => {
      newExpandedSections[key] = true;
    });
    setExpandedSections(newExpandedSections);
  };
  
  // Collapse all sections
  const collapseAll = () => {
    const newExpandedSections = {};
    Object.keys(fields).forEach(key => {
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
    onClose(null,pickedItems);
  };

  // Toggle the popup open/closed
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  
  // Highlight search matches
  const highlightMatches = (text, term) => {
    if (!term) return text;
    
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === term.toLowerCase() ? 
        <span key={i} className="bg-yellow-200">{part}</span> : part
    );
  };
  
  return (
    <div className="flex items-center justify-center p-4">
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col overflow-hidden" style={{ maxHeight: '90vh' }}>
            
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
            <div className="flex-1 overflow-y-auto" style={{ overflowY: 'auto' }}>
              <div className="p-4 space-y-3">
                {Object.keys(filteredSections).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No signals match your search
                  </div>
                ) : (
                  Object.entries(filteredSections).map(([section, items], index) => {
                    // Calculate how many items in this section are selected
                    const selectedCount = items.filter(item => 
                      pickedItems.includes(`${section}.${item.name}`)
                    ).length;
                    
                    // Check if all items in this section are selected
                    const allSelected = selectedCount === items.length && items.length > 0;
                    
                    // Check if some items in this section are selected
                    const someSelected = selectedCount > 0 && !allSelected;
                    
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
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
                            
                            {/* Selection indicator */}
                            {(someSelected || allSelected) && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                                {selectedCount}/{items.length}
                              </span>
                            )}
                          </div>
                          
                          {/* Select All button */}
                          {items.length > 0 && (
                            <button
                              className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSectionItems(section, items);
                              }}
                            >
                              {allSelected ? 'Deselect All' : 'Select All'}
                            </button>
                          )}
                        </div>
                        
                        {/* Section Items */}
                        {expandedSections[section] && (
                          <div className="max-h-64 overflow-y-auto">
                            {items.map((item, itemIndex) => {
                              const itemPath = `${section}.${item.name}`;
                              const isSelected = pickedItems.includes(itemPath);
                              
                              return (
                                <div
                                  key={itemIndex}
                                  className={`mx-2 my-1 px-3 py-2 rounded-md flex items-center cursor-pointer ${
                                    isSelected ? 'bg-blue-100' : 'hover:bg-gray-50'
                                  }`}
                                  onClick={() => toggleItem(itemPath)}
                                >
                                  <div className={`w-5 h-5 rounded flex items-center justify-center mr-2 border ${
                                    isSelected ? 'bg-blue-500 border-blue-600' : 'border-gray-300'
                                  }`}>
                                    {isSelected && <Check size={14} className="text-white" />}
                                  </div>
                                  <div className="flex flex-col">
                                    <div className="flex items-center">
                                      <File size={16} className="text-gray-400 mr-2" />
                                      <span className={isSelected ? 'text-blue-800' : 'text-gray-700'}>
                                        {searchTerm ? highlightMatches(item.name, searchTerm) : item.name}
                                      </span>
                                    </div>
                                    {item.description && (
                                      <span className="text-xs text-gray-500 ml-6">
                                        {searchTerm ? highlightMatches(item.description, searchTerm) : item.description}
                                      </span>
                                    )}
                                  </div>
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