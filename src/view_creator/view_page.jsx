import React, { useState, useEffect, useMemo } from 'react';
import { Code, Eye, Save, ChevronRight, X, Plus, Search, Settings, Trash2, Edit } from 'lucide-react';
import { TablesTab } from '../table_builder/tables_page';
import { dbViewSignal } from '../table_builder/table_builder_state';
import { mockViews, views_signal } from './views_state';
import { InitViews, SyncViews } from './view_api';

// Main App Component
export function DatabaseViewManager() {
  const [views, setViews] = useState([]);
  const [selectedView, setSelectedView] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  const [newViewDescription, setNewViewDescription] = useState('');

  useEffect((() => {
    InitViews();
  }),[]);
  
  // Fetch views on mount (simulated)
  useEffect(() => {
    // Make sure we're working with a deep copy of the views
    const viewsWithIds = JSON.parse(JSON.stringify(views_signal.value)).map(view => {
      return { ...view };
    });
    
    setViews(viewsWithIds);
    
    // Find the first non-deleted view or preserve current selection if it still exists
    const currentViewExists = selectedView && viewsWithIds.some(v => v.id === selectedView.id && !v._deleted);
    
    if (!currentViewExists) {
      const firstAvailableView = viewsWithIds.find(v => !v._deleted);
      setSelectedView(firstAvailableView || null);
    } else if (selectedView) {
      // Update the selected view with any changes from views_signal
      const updatedSelectedView = viewsWithIds.find(v => v.id === selectedView.id);
      setSelectedView(updatedSelectedView);
    }
  }, [views_signal.value]);

  // Update selectedView when its properties change in the views array
  useEffect(() => {
    if (selectedView && selectedView.id) {
      const updatedView = views.find(v => v.id === selectedView.id);
      if (updatedView && JSON.stringify(updatedView) !== JSON.stringify(selectedView)) {
        setSelectedView(updatedView);
      }
    }
  }, [views]);

  // Generate a random unique ID
  const generateUniqueId = () => {
    return 'view_' + Math.random().toString(36).substr(2, 9);
  };

  const handleCreateNewView = () => {
    const newView = {
      id: generateUniqueId(),
      name: 'New View',
      description: 'Description here',
      sqlCode: 'SELECT * FROM table',
      fields: ['field1'],
      "_change_type": "add",
      "status": "pending"
    };
    
    setViews(prevViews => [...prevViews, newView]);
    setSelectedView(newView);
    setNewViewName(newView.name);
    setNewViewDescription(newView.description);
    setIsRenaming(true);
    setIsEditMode(true);
  };

  const handleViewSelect = (view) => {
    setSelectedView(view);
    setIsEditMode(false);
    setIsRenaming(false);
  };

  const handleSqlCodeChange = (code) => {
    // Create a deep copy to avoid reference issues
    const updatedView = JSON.parse(JSON.stringify(selectedView));
    
    updatedView.sqlCode = code;
    
    // Keep "add" if it's a new view, otherwise set to "update"
    if (updatedView._change_type !== "add") {
      updatedView._change_type = "update";
    }
    
    // In a real app, we would parse the SQL to extract fields
    updatedView.fields = extractFieldsFromSql(code);
    
    // Update views array first
    setViews(prevViews => 
      prevViews.map(v => v.id === updatedView.id ? updatedView : v)
    );
    
    // Then update selected view
    setSelectedView(updatedView);
  };

  const handleSaveView = () => {
    // Create a deep copy of the selected view to avoid reference issues
    const updatedView = JSON.parse(JSON.stringify(selectedView));
    
    // If we're renaming, update the name and description
    if (isRenaming) {
      updatedView.name = newViewName;
      updatedView.description = newViewDescription;
      setIsRenaming(false);
    }
    
    // Ensure _change_type is set to "update" if it was previously "add"
    if (updatedView._change_type !== "add") {
      updatedView._change_type = "update";
    }
    
    // Update the view in the views array
    setViews(prevViews => 
      prevViews.map(v => v.id === updatedView.id ? updatedView : v)
    );
    
    // Update the selected view with the new copy
    setSelectedView(updatedView);
    setIsEditMode(false);
  };

  const handleStartRenaming = () => {
    setNewViewName(selectedView.name);
    setNewViewDescription(selectedView.description);
    setIsRenaming(true);
  };

  const handleDeleteView = () => {
    if (window.confirm(`Are you sure you want to delete "${selectedView.name}"?`)) {
      // Mark the view as deleted instead of removing it
      const updatedViews = views.map(v => {
        if (v.id === selectedView.id) {
          return { ...v, "_change_type": "delete", "_deleted": true };
        }
        return v;
      });
      
      // Find the first non-deleted view to select
      const firstAvailableView = updatedViews.find(v => !v._deleted);
      
      setViews(updatedViews);
      setSelectedView(firstAvailableView || null);
      setIsEditMode(false);
      setIsRenaming(false);
    }
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

  // Memoize filtered views to prevent unnecessary re-renders
  const filteredViews = useMemo(() => {
    return views.filter(view => 
      !view._deleted && view.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [views, searchTerm]);

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800" style={{color:"black"}}>
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
              isRenaming={isRenaming}
              onEditToggle={() => setIsEditMode(!isEditMode)}
              onRenameToggle={handleStartRenaming}
              onSave={handleSaveView}
              onDelete={handleDeleteView}
              style={{width:"100%"}}
              onSync={() => {SyncViews(views);}}
              newViewName={newViewName}
              setNewViewName={setNewViewName}
              newViewDescription={newViewDescription}
              setNewViewDescription={setNewViewDescription}
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
      <div className="mt-2 flex items-center rounded-md px-2">
        <div style={{width:"20vw"}}>
          <TablesTab onTableSelect={(tab) => dbViewSignal.value = tab} 
          style={{width:"260px", padding:"20px"}}
          buttonStyle={{fontSize:"0.8em"}}
          />
        </div>
      </div>
      
      <div className="p-2">
        <div className="flex items-center bg-gray-100 rounded-md p-2">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search views..."
            className="bg-transparent border-none focus:outline-none w-full text-sm"
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
  // Get the status once and handle empty/undefined
  const status = view.status ? view.status.toLowerCase().trim() : "";
  
  // Determine if failed status - check more explicitly
  const isFailed = status === "failed";
  
  // Apply more prominent styling for failed views
  const itemClassNames = [
    "p-3 border-b border-gray-100 cursor-pointer flex items-center",
    isSelected ? 'border-l-4 border-l-blue-600' : '',
    isFailed ? 'bg-red-100' : isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
  ].join(' ');

  // Also apply text styling for better visibility
  const textClassName = isFailed ? "text-red-700" : "font-medium";

  console.log(`View ${view.name} status: ${status}, isFailed: ${isFailed}`);

  return (
    <div 
      className={itemClassNames}
      onClick={onClick}
    >
      <Eye size={16} className={`mr-2 ${isSelected ? 'text-blue-600' : isFailed ? 'text-red-500' : 'text-gray-500'}`} />
      <div className="flex-1 overflow-hidden">
        <h3 className={textClassName + " truncate"}>{view.name}</h3>
        <p className="text-xs text-gray-500 truncate">{view.description}</p>
        {isFailed && (
          <div className="flex items-center mt-1">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
            <p className="text-xs text-red-600 font-medium">Failed</p>
          </div>
        )}
      </div>
      <ChevronRight size={16} className={isFailed ? "text-red-400" : "text-gray-400"} />
    </div>
  );
}

// Component for the header of the selected view
function ViewHeader({ 
  view, 
  isEditMode, 
  isRenaming,
  onEditToggle, 
  onRenameToggle,
  onSave, 
  onSync, 
  onDelete,
  style = {},
  newViewName,
  setNewViewName,
  newViewDescription,
  setNewViewDescription
}) {
  const status = (view.status || "").toLowerCase().trim();
  const isFailed = status === "failed";

  return (
    <div className="bg-white border-b border-gray-200 p-4 flex flex-col" style={{...style}}>
      <div className="flex justify-between items-center">
        <div>
          {isRenaming ? (
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
                className="text-xl font-semibold border rounded px-2 py-1"
                placeholder="View name"
                autoFocus
              />
              <input
                type="text"
                value={newViewDescription}
                onChange={(e) => setNewViewDescription(e.target.value)}
                className="text-sm text-gray-500 border rounded px-2 py-1"
                placeholder="Description"
              />
            </div>
          ) : (
            <>
              <div className="flex items-center">
                <h2 className="text-xl font-semibold">{view.name}</h2>
                {isFailed && <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Failed</span>}
              </div>
              <p className="text-sm text-gray-500">{view.description}</p>
            </>
          )}
        </div>
        <div className="flex space-x-2">
          {isRenaming || isEditMode ? (
            <button 
              onClick={onSave}
              className="p-2 bg-green-600 text-white rounded-md flex items-center hover:bg-green-700 transition-colors"
            >
              <Save size={16} className="mr-1" />
              Save
            </button>
          ) : (
            <>
              <button 
                onClick={onRenameToggle}
                className="p-2 bg-gray-100 text-gray-700 rounded-md flex items-center hover:bg-gray-200 transition-colors"
              >
                <Edit size={16} className="mr-1" />
                Rename
              </button>
              <button 
                onClick={onEditToggle}
                className="p-2 bg-blue-100 text-blue-700 rounded-md flex items-center hover:bg-blue-200 transition-colors"
              >
                <Code size={16} className="mr-1" />
                Edit SQL
              </button>
            </>
          )}
          <button 
            onClick={onDelete}
            className="p-2 bg-red-100 text-red-700 rounded-md flex items-center hover:bg-red-200 transition-colors"
            disabled={isRenaming}
          >
            <Trash2 size={16} className="mr-1" />
            Delete
          </button>
          <button 
            className="p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            style={{padding:"10px 30px", "color": "white", backgroundColor: "black"}}
            onClick={onSync}
          >
            Sync
          </button>
        </div>
      </div>
    </div>
  );
}

// Updated ViewDetails with proper centering and overflow handling
function ViewDetails({ view }) {
  // Handle potentially empty fields array
  const fields = view.fields || [];
  
  return (
    <div className="w-full overflow-y-auto p-4 flex justify-center">
      <div className="w-full">
        <h3 className="font-medium text-gray-700 mb-4 text-center">Selected Fields</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto pb-4">
          {fields.length > 0 ? (
            fields.map((field, index) => (
              <FieldItem key={index} field={field} />
            ))
          ) : (
            <div className="text-center text-gray-500">No fields selected</div>
          )}
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium text-gray-700 mb-2 text-center">SQL Preview</h3>
          <pre className="bg-gray-800 text-gray-200 p-4 rounded-md overflow-x-auto text-sm max-h-48">
            {view.sqlCode || 'No SQL code available'}
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
          value={code || ''}
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