import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

// Single Value Picker Component
const SingleValuePicker = ({ data = [], value, onChange, placeholder = "Select value..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Normalize data to consistent format
  const normalizedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    
    return data.map((item, index) => {
      if (typeof item === 'string') {
        return { name: item, value: item, id: index };
      }
      return { 
        name: item.name || item.label || item.value || '', 
        value: item.value || item.name || item.label || '', 
        id: index 
      };
    });
  }, [data]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return normalizedData;
    return normalizedData.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [normalizedData, searchTerm]);

  // Get display name for selected value
  const selectedItem = useMemo(() => {
    return normalizedData.find(item => item.value === value);
  }, [normalizedData, value]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle selection
  const handleSelect = useCallback((item) => {
    onChange?.(item.value);
    setIsOpen(false);
    setSearchTerm('');
  }, [onChange]);

  // Handle input click
  const handleInputClick = useCallback(() => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Input Trigger */}
      <div
        onClick={handleInputClick}
        className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200 shadow-sm"
      >
        <span className={`truncate ${selectedItem ? 'text-gray-900' : 'text-gray-500'}`}>
          {selectedItem ? selectedItem.name : placeholder}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`px-4 py-3 cursor-pointer transition-colors duration-150 hover:bg-blue-50 border-b border-gray-50 last:border-b-0 ${
                    item.value === value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{item.name}</span>
                    {item.value === value && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Multi Value Picker Component
const MultiValuePicker = ({ data = [], value = [], onChange, placeholder = "Select values..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Normalize data to consistent format
  const normalizedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    
    return data.map((item, index) => {
      if (typeof item === 'string') {
        return { name: item, value: item, id: index };
      }
      return { 
        name: item.name || item.label || item.value || '', 
        value: item.value || item.name || item.label || '', 
        id: index 
      };
    });
  }, [data]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return normalizedData;
    return normalizedData.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [normalizedData, searchTerm]);

  // Get selected items for display
  const selectedItems = useMemo(() => {
    return normalizedData.filter(item => value.includes(item.value));
  }, [normalizedData, value]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle selection toggle
  const handleToggle = useCallback((item) => {
    const newValue = value.includes(item.value)
      ? value.filter(v => v !== item.value)
      : [...value, item.value];
    onChange?.(newValue);
  }, [value, onChange]);

  // Handle remove tag
  const handleRemove = useCallback((itemValue) => {
    const newValue = value.filter(v => v !== itemValue);
    onChange?.(newValue);
  }, [value, onChange]);

  // Handle input click
  const handleInputClick = useCallback(() => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Input Trigger */}
      <div
        onClick={handleInputClick}
        className="flex items-center justify-between w-full min-h-[48px] px-4 py-2 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200 shadow-sm"
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {selectedItems.length > 0 ? (
            selectedItems.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
              >
                <span className="truncate max-w-32">{item.name}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.value);
                  }}
                />
              </span>
            ))
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ml-2 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredData.length > 0 ? (
              filteredData.map((item) => {
                const isSelected = value.includes(item.value);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggle(item)}
                    className={`px-4 py-3 cursor-pointer transition-colors duration-150 hover:bg-blue-50 border-b border-gray-50 last:border-b-0 ${
                      isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{item.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Demo Component
const Demo = () => {
  // Sample data
  const stringData = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];
  const objectData = [
    { name: 'New York', value: 'ny' },
    { name: 'Los Angeles', value: 'la' },
    { name: 'Chicago', value: 'chi' },
    { name: 'Houston', value: 'hou' },
    { name: 'Phoenix', value: 'phx' },
    { name: 'Philadelphia', value: 'phi' }
  ];

  // State for demo
  const [singleValue1, setSingleValue1] = useState('');
  const [singleValue2, setSingleValue2] = useState('');
  const [multiValue1, setMultiValue1] = useState([]);
  const [multiValue2, setMultiValue2] = useState([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Value Picker Components</h1>
          <p className="text-gray-600 mb-8">Performant single and multi-value pickers with search functionality</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Single Value Pickers */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Single Value Pickers</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fruits (String Array)
                  </label>
                  <SingleValuePicker
                    data={stringData}
                    value={singleValue1}
                    onChange={setSingleValue1}
                    placeholder="Choose a fruit..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Selected: {singleValue1 || 'None'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cities (Object Array)
                  </label>
                  <SingleValuePicker
                    data={objectData}
                    value={singleValue2}
                    onChange={setSingleValue2}
                    placeholder="Choose a city..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Selected: {singleValue2 || 'None'}</p>
                </div>
              </div>
            </div>

            {/* Multi Value Pickers */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Multi Value Pickers</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fruits (String Array)
                  </label>
                  <MultiValuePicker
                    data={stringData}
                    value={multiValue1}
                    onChange={setMultiValue1}
                    placeholder="Choose fruits..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {multiValue1.length > 0 ? multiValue1.join(', ') : 'None'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cities (Object Array)
                  </label>
                  <MultiValuePicker
                    data={objectData}
                    value={multiValue2}
                    onChange={setMultiValue2}
                    placeholder="Choose cities..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {multiValue2.length > 0 ? multiValue2.join(', ') : 'None'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Handles string arrays and object arrays</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Real-time search functionality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Optimized for large datasets</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Click outside to close</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Minimal re-renders with useMemo & useCallback</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Perfect for dynamic forms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;