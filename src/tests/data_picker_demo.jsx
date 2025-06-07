import React, { useState, useMemo } from 'react';
import { Search, X, Check, ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react';

// Extended mock data to demonstrate scrolling with large datasets
const mockData = {
  workflows: [
    { id: 'wf1', name: 'User Registration Workflow', type: 'workflows' },
    { id: 'wf2', name: 'Order Processing Workflow', type: 'workflows' },
    { id: 'wf3', name: 'Payment Processing Workflow', type: 'workflows' },
    { id: 'wf4', name: 'Email Notification Workflow', type: 'workflows' },
    { id: 'wf5', name: 'Data Validation Workflow', type: 'workflows' },
    { id: 'wf6', name: 'User Authentication Workflow', type: 'workflows' },
    { id: 'wf7', name: 'Report Generation Workflow', type: 'workflows' },
    { id: 'wf8', name: 'File Upload Workflow', type: 'workflows' },
    { id: 'wf9', name: 'Batch Processing Workflow', type: 'workflows' },
    { id: 'wf10', name: 'Integration Sync Workflow', type: 'workflows' }
  ],
  queries: [
    { id: 'q1', name: 'Get User Data Query', type: 'queries' },
    { id: 'q2', name: 'Fetch Orders Query', type: 'queries' },
    { id: 'q3', name: 'Search Products Query', type: 'queries' },
    { id: 'q4', name: 'Analytics Dashboard Query', type: 'queries' },
    { id: 'q5', name: 'Customer Reports Query', type: 'queries' },
    { id: 'q6', name: 'Inventory Status Query', type: 'queries' },
    { id: 'q7', name: 'Sales Performance Query', type: 'queries' },
    { id: 'q8', name: 'User Activity Query', type: 'queries' },
    { id: 'q9', name: 'System Health Query', type: 'queries' },
    { id: 'q10', name: 'Audit Log Query', type: 'queries' }
  ],
  tables: [
    { id: 't1', name: 'Users Table', type: 'tables' },
    { id: 't2', name: 'Orders Table', type: 'tables' },
    { id: 't3', name: 'Products Table', type: 'tables' },
    { id: 't4', name: 'Categories Table', type: 'tables' },
    { id: 't5', name: 'Customers Table', type: 'tables' },
    { id: 't6', name: 'Inventory Table', type: 'tables' },
    { id: 't7', name: 'Transactions Table', type: 'tables' },
    { id: 't8', name: 'Reviews Table', type: 'tables' },
    { id: 't9', name: 'Audit Logs Table', type: 'tables' },
    { id: 't10', name: 'Settings Table', type: 'tables' }
  ],
  forms: [
    { id: 'f1', name: 'Registration Form', type: 'forms' },
    { id: 'f2', name: 'Contact Form', type: 'forms' },
    { id: 'f3', name: 'Feedback Form', type: 'forms' },
    { id: 'f4', name: 'Survey Form', type: 'forms' },
    { id: 'f5', name: 'Application Form', type: 'forms' }
  ]
};

const mockFields = {
  wf1: [
    { id: 'username', name: 'Username', required: true },
    { id: 'email', name: 'Email Address', required: true },
    { id: 'password', name: 'Password', required: true },
    { id: 'first_name', name: 'First Name', required: false },
    { id: 'last_name', name: 'Last Name', required: false },
    { id: 'phone', name: 'Phone Number', required: false }
  ],
  q1: [
    { id: 'user_id', name: 'User ID', required: true },
    { id: 'include_profile', name: 'Include Profile', required: false },
    { id: 'include_orders', name: 'Include Orders', required: false },
    { id: 'date_range', name: 'Date Range', required: false }
  ],
  t1: [
    { id: 'id', name: 'ID' },
    { id: 'username', name: 'Username' },
    { id: 'email', name: 'Email' },
    { id: 'first_name', name: 'First Name' },
    { id: 'last_name', name: 'Last Name' },
    { id: 'phone', name: 'Phone' },
    { id: 'created_at', name: 'Created At' },
    { id: 'updated_at', name: 'Updated At' },
    { id: 'status', name: 'Status' },
    { id: 'role', name: 'Role' }
  ],
  wf2: [
    { id: 'order_id', name: 'Order ID', required: true },
    { id: 'customer_id', name: 'Customer ID', required: true },
    { id: 'total_amount', name: 'Total Amount', required: true }
  ],
  t2: [
    { id: 'id', name: 'Order ID' },
    { id: 'customer_id', name: 'Customer ID' },
    { id: 'status', name: 'Status' },
    { id: 'total', name: 'Total Amount' },
    { id: 'created_at', name: 'Created Date' },
    { id: 'shipped_at', name: 'Shipped Date' }
  ]
};


const UniversalPicker = ({
  isOpen,
  onClose,
  onSelect,
  mode = 'multiple',
  allowedTypes = ['workflows', 'queries', 'tables'],
  title = 'Select Items',
  preSelected = []
}) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(preSelected);
  const [expanded, setExpanded] = useState(new Set());
  const [view, setView] = useState('types');
  const [currentType, setCurrentType] = useState('');

  const types = allowedTypes.map(type => ({ 
    id: type, 
    name: type.charAt(0).toUpperCase() + type.slice(1) 
  }));

  const blocks = useMemo(() => {
    const allBlocks = currentType === 'all' ? 
      allowedTypes.flatMap(getBlocks) : 
      getBlocks(currentType);
    
    return search ? 
      allBlocks.filter(b => b.name.toLowerCase().includes(search.toLowerCase())) : 
      allBlocks;
  }, [currentType, search, allowedTypes]);

  const isSelected = (item) => selected.some(s => s.id === item.id && s.type === item.type);
  
  const toggleSelect = (item) => {
    if (mode === 'single') {
      setSelected([item]);
      onSelect([item]);
      onClose();
      return;
    }
    
    setSelected(prev => 
      isSelected(item) ? 
        prev.filter(s => !(s.id === item.id && s.type === item.type)) :
        [...prev, item]
    );
  };

  const toggleExpand = (blockId) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(blockId) ? next.delete(blockId) : next.add(blockId);
      return next;
    });
  };

  const TypeItem = ({ type, onClick }) => (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer group"
    >
      <span className="text-sm font-medium">{type.name}</span>
      <ChevronRight size={14} className="text-gray-400 group-hover:text-gray-600" />
    </div>
  );

  const BlockItem = ({ block }) => {
    const fields = getFields(block.id);
    const hasFields = fields.length > 0;
    const isExp = expanded.has(block.id);
    const isSel = isSelected(block);

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className={`flex items-center p-2 ${isSel ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
          {hasFields && (
            <button
              onClick={() => toggleExpand(block.id)}
              className="p-1 hover:bg-gray-200 rounded mr-2"
            >
              {isExp ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium truncate">{block.name}</span>
              <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                {block.type}
              </span>
            </div>
          </div>
          
          <button
            onClick={() => toggleSelect(block)}
            className={`p-1 rounded ${isSel ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Check size={14} />
          </button>
        </div>

        {isExp && hasFields && (
          <div className="border-t bg-gray-50 p-2">
            <div className="text-xs font-medium text-gray-600 mb-1">Fields</div>
            {fields.map(field => {
              const fieldItem = { ...field, type: 'field', parentBlock: block };
              const isFieldSel = isSelected(fieldItem);
              
              return (
                <div
                  key={field.id}
                  onClick={() => toggleSelect(fieldItem)}
                  className={`flex items-center justify-between p-1.5 rounded cursor-pointer text-xs ${
                    isFieldSel ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>{field.name}</span>
                    {field.required && <span className="text-red-500">*</span>}
                  </div>
                  <Check size={12} className={isFieldSel ? 'text-blue-600' : 'text-gray-400'} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg h-[500px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            {view !== 'types' && (
              <button
                onClick={() => setView('types')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <h2 className="font-semibold">{title}</h2>
            {selected.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {selected.length}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        {view === 'blocks' && (
          <div className="p-4 border-b">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {view === 'types' ? (
            <div className="space-y-1">
              <TypeItem 
                type={{ name: 'All Types' }}
                onClick={() => {
                  setCurrentType('all');
                  setView('blocks');
                }}
              />
              {types.map(type => (
                <TypeItem
                  key={type.id}
                  type={type}
                  onClick={() => {
                    setCurrentType(type.id);
                    setView('blocks');
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {blocks.map(block => (
                <BlockItem key={`${block.type}-${block.id}`} block={block} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {mode === 'multiple' && (
          <div className="border-t p-4 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {selected.length} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelected([])}
                className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800"
                disabled={!selected.length}
              >
                Clear
              </button>
              <button
                onClick={() => {
                  onSelect(selected);
                  onClose();
                }}
                className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={!selected.length}
              >
                Select ({selected.length})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Demo Component
const PickerDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [mode, setMode] = useState('multiple');
  const [allowedTypes, setAllowedTypes] = useState(['workflows', 'queries', 'tables', 'forms']);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Modern Universal Picker</h1>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-3">Configuration</h3>
        <div className="space-y-3">
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="single"
                checked={mode === 'single'}
                onChange={(e) => setMode(e.target.value)}
                className="mr-2"
              />
              Single Selection
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="multiple"
                checked={mode === 'multiple'}
                onChange={(e) => setMode(e.target.value)}
                className="mr-2"
              />
              Multiple Selection
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Data Types to Show:</label>
            <div className="flex flex-wrap gap-2">
              {['workflows', 'queries', 'tables', 'forms'].map(type => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={allowedTypes.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAllowedTypes(prev => [...prev, type]);
                      } else {
                        setAllowedTypes(prev => prev.filter(t => t !== type));
                      }
                    }}
                    className="mr-1"
                  />
                  <span className="text-sm capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-6"
      >
        Open Picker
      </button>

      {selectedItems.length > 0 && (
        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Selected ({selectedItems.length})</h3>
          <div className="space-y-2">
            {selectedItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <div>
                  <span className="font-medium">{item.name}</span>
                  {item.parentBlock && (
                    <span className="text-gray-500 ml-2">from {item.parentBlock.name}</span>
                  )}
                </div>
                <div className="flex gap-1">
                  {item.required && (
                    <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                      Required
                    </span>
                  )}
                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                    {item.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <UniversalPicker
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={setSelectedItems}
        mode={mode}
        allowedTypes={allowedTypes}
        title="Select Data Elements"
        preSelected={selectedItems}
      />
    </div>
  );
};

export default PickerDemo;