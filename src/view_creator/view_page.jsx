import React, { useState, useEffect } from 'react';
import { Code, Eye, Save, ChevronRight, X, Plus, Search, Settings } from 'lucide-react';
import { TablesTab } from '../table_builder/tables_page';
import { dbViewSignal } from '../table_builder/table_builder_state';

// Main App Component
export function DatabaseViewManager() {
  const [views, setViews] = useState([]);
  const [selectedView, setSelectedView] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch views on mount (simulated)
  useEffect(() => {
    // Mock data
    const mockViews = [
      { 
        id: 1, 
        name: 'Customer Orders', 
        description: 'Shows all customer orders with details',
        sqlCode: 'SELECT o.order_id, c.customer_name, o.order_date, o.total_amount\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nWHERE o.status = "active"',
        fields: ['order_id', 'customer_name', 'order_date', 'total_amount']
      },
      { 
        id: 2, 
        name: 'Product Inventory', 
        description: 'Current inventory levels',
        sqlCode: 'SELECT p.product_id, p.name, p.category, i.quantity, i.last_updated\nFROM products p\nJOIN inventory i ON p.product_id = i.product_id',
        fields: ['product_id', 'name', 'category', 'quantity', 'last_updated']
      },
      { 
        id: 3, 
        name: 'Monthly Sales', 
        description: 'Aggregated sales by month',
        sqlCode: 'SELECT DATE_FORMAT(order_date, "%Y-%m") as month, SUM(total_amount) as total_sales\nFROM orders\nGROUP BY DATE_FORMAT(order_date, "%Y-%m")\nORDER BY month DESC',
        fields: ['month', 'total_sales']
      },
    ];
    
    setViews(mockViews);
    setSelectedView(mockViews[0]);
  }, []);

  const handleCreateNewView = () => {
    const newView = {
      id: views.length + 1,
      name: 'New View',
      description: 'Description here',
      sqlCode: 'SELECT * FROM table',
      fields: ['field1']
    };
    
    setViews([...views, newView]);
    setSelectedView(newView);
    setIsEditMode(true);
  };

  const handleViewSelect = (view) => {
    setSelectedView(view);
    setIsEditMode(false);
  };

  const handleSqlCodeChange = (code) => {
    setSelectedView({
      ...selectedView,
      sqlCode: code,
      // In a real app, we would parse the SQL to extract fields
      fields: extractFieldsFromSql(code)
    });
  };

  const handleSaveView = () => {
    setViews(views.map(v => v.id === selectedView.id ? selectedView : v));
    setIsEditMode(false);
  };

  // Simple SQL parser to extract SELECT fields (in a real app, use a proper SQL parser)
  const extractFieldsFromSql = (sql) => {
    try {
      const selectPart = sql.toUpperCase().split('FROM')[0].replace('SELECT', '').trim();
      const fields = selectPart.split(',').map(field => {
        // Handle "as" aliases and trim whitespace
        let fieldName = field.trim();
        if (fieldName.toUpperCase().includes(' AS ')) {
          fieldName = fieldName.split(/\s+[aA][sS]\s+/)[1];
        } else if (fieldName.includes('.')) {
          fieldName = fieldName.split('.')[1];
        }
        // Remove any remaining SQL functions, brackets, quotes
        return fieldName.replace(/[\(\)\[\]'"]/g, '').trim();
      });
      return fields;
    } catch (error) {
      console.error("Error parsing SQL:", error);
      return [];
    }
  };

  const filteredViews = views.filter(view => 
    view.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Left Panel - View List */}
      <ViewSidebar 
        views={filteredViews}
        selectedView={selectedView} 
        onSelectView={handleViewSelect}
        onCreateNew={handleCreateNewView}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      {/* Right Panel - View Details */}
      <div className="flex-1 flex flex-col overflow-hidden align-center" style={{alignItems:"center"}}>
        {selectedView ? (
          <>
            <ViewHeader 
              view={selectedView} 
              isEditMode={isEditMode}
              onEditToggle={() => setIsEditMode(!isEditMode)}
              onSave={handleSaveView}
              style={{width:"100%"}}
            />
            
            <div className="w-2/5 flex flex-col items-center overflow-hidden">
            {isEditMode ? (
                <SqlEditor 
                code={selectedView.sqlCode} 
                onChange={handleSqlCodeChange} 
                />
            ) : (
                <ViewDetails view={selectedView} />
            )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Select a view or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Component for the left sidebar containing view list
function ViewSidebar({ views, selectedView, onSelectView, onCreateNew, searchTerm, onSearchChange }) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Database Views</h2>
        <div className="mt-2 flex items-center bg-gray-100 rounded-md px-2">
          <TablesTab onTableSelect={(tab) => dbViewSignal.value = tab} />
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search views..."
            className="bg-transparent border-none outline-none p-2 w-full"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {views.map(view => (
          <ViewListItem 
            key={view.id}
            view={view}
            isSelected={selectedView && view.id === selectedView.id}
            onClick={() => onSelectView(view)}
          />
        ))}
      </div>
      
      <button 
        onClick={onCreateNew}
        className="m-4 p-2 bg-blue-600 text-white rounded-md flex items-center justify-center hover:bg-blue-700 transition-colors"
      >
        <Plus size={16} className="mr-2" />
        Create New View
      </button>
    </div>
  );
}

// Component for a single view item in the sidebar
function ViewListItem({ view, isSelected, onClick }) {
  return (
    <div 
      className={`p-3 border-b border-gray-100 cursor-pointer flex items-center ${
        isSelected ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <Eye size={16} className={`mr-2 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
      <div className="flex-1 overflow-hidden">
        <h3 className="font-medium truncate">{view.name}</h3>
        <p className="text-xs text-gray-500 truncate">{view.description}</p>
      </div>
      <ChevronRight size={16} className="text-gray-400" />
    </div>
  );
}

// Component for the header of the selected view
function ViewHeader({ view, isEditMode, onEditToggle, onSave , style ={} }) {
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center" style={{...style}}>
      <div>
        <h2 className="text-xl font-semibold">{view.name}</h2>
        <p className="text-sm text-gray-500">{view.description}</p>
      </div>
      <div className="flex space-x-2">
        {isEditMode ? (
          <button 
            onClick={onSave}
            className="p-2 bg-green-600 text-white rounded-md flex items-center hover:bg-green-700 transition-colors"
          >
            <Save size={16} className="mr-1" />
            Save
          </button>
        ) : (
          <button 
            onClick={onEditToggle}
            className="p-2 bg-blue-100 text-blue-700 rounded-md flex items-center hover:bg-blue-200 transition-colors"
          >
            <Code size={16} className="mr-1" />
            Edit SQL
          </button>
        )}
        <button className="p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}


// Updated ViewDetails with proper centering and overflow handling
function ViewDetails({ view }) {
    return (
      <div className="w-full overflow-y-auto p-4 flex justify-center">
        <div className="w-full">
          <h3 className="font-medium text-gray-700 mb-4 text-center">Selected Fields</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto pb-4">
            {view.fields.map((field, index) => (
              <FieldItem key={index} field={field} />
            ))}
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-2 text-center">SQL Preview</h3>
            <pre className="bg-gray-800 text-gray-200 p-4 rounded-md overflow-x-auto text-sm max-h-48">
              {view.sqlCode}
            </pre>
          </div>
        </div>
      </div>
    );
  }
  
  // Updated FieldItem component to be more compact
  function FieldItem({ field }) {
    return (
      <div className="bg-white shadow-sm rounded-md p-2 border border-gray-200 flex items-center">
        <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
        <span className="font-mono text-sm truncate">{field}</span>
      </div>
    );
  }
  
  // Updated SqlEditor component to match the layout
  function SqlEditor({ code, onChange }) {
    return (
      <div className="w-full p-4 flex flex-col">
        <div className="mb-2 flex items-center justify-center">
          <Code size={16} className="mr-1 text-blue-600" />
          <h3 className="font-medium">SQL Editor</h3>
        </div>
        <div className="flex-1 border border-gray-300 rounded-md overflow-hidden">
          <textarea
            className="w-full h-64 p-4 font-mono text-sm focus:outline-none resize-none"
            value={code}
            onChange={(e) => onChange(e.target.value)}
            spellCheck="false"
          />
        </div>
        <div className="mt-2 text-sm text-gray-500 text-center">
          <p>Changes to SQL will automatically update the fields.</p>
        </div>
      </div>
    );
  }
  