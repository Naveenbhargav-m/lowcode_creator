// queries_left_list.jsx
import { useState } from "preact/hooks";
import { Copy, Plus, Search, Trash2 } from "lucide-react";

function QueriesList({ queries, activeQuery, onQuerySelect, onCreateQuery, onDeleteQuery, onDuplicateQuery, hasUnsavedChanges }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreate = () => {
    if (newName.trim()) {
      onCreateQuery(newName);
      setNewName('');
      setIsCreating(false);
    }
  };

  // Convert queries object to array
  const queriesArray = Object.values(queries || {});
  const filteredQueries = queriesArray.filter(query =>
    query.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Queries</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white p-1.5 rounded hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search queries..."
          value={searchTerm}
          // @ts-ignore
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {isCreating && (
        <div className="mb-4 space-y-2">
          <input
            type="text"
            value={newName}
            // @ts-ignore
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Query name"
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            autoFocus
            onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
          />
          <div className="flex gap-2">
            <button 
              onClick={handleCreate} 
              className="flex-1 bg-indigo-600 text-white py-1.5 rounded text-sm hover:bg-indigo-700 transition-colors"
            >
              Create
            </button>
            <button 
              onClick={() => setIsCreating(false)} 
              className="flex-1 bg-gray-200 text-gray-700 py-1.5 rounded text-sm hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1 max-h-64 overflow-y-auto">
        {filteredQueries.map(query => (
          <QueryItem
            key={query.id}
            query={query}
            isActive={activeQuery === query.id}
            hasUnsavedChanges={hasUnsavedChanges(query.id)}
            onSelect={() => onQuerySelect(query.id)}
            onDelete={() => onDeleteQuery(query.id)}
            onDuplicate={() => onDuplicateQuery(query.id)}
          />
        ))}
      </div>

      {filteredQueries.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <Search size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">
            {searchTerm ? "No queries match your search" : "No queries found"}
          </p>
          {!searchTerm && (
            <p className="text-xs mt-1">Create your first query to get started</p>
          )}
        </div>
      )}
    </div>
  );
}

// QueryItem Component - Individual query item with actions
function QueryItem({ query, isActive, hasUnsavedChanges, onSelect, onDelete, onDuplicate }) {
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete();
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <div 
      className={`flex items-center justify-between p-2.5 rounded-md cursor-pointer transition-colors ${
        isActive 
          ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
          : 'hover:bg-gray-100'
      }`}
      onClick={onSelect}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowDeleteConfirm(false);
      }}
    >
      <div className="flex items-center">
        <Search size={16} className="mr-2 flex-shrink-0" />
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-sm font-medium">{query.name}</span>
            {hasUnsavedChanges && (
              <div className="w-2 h-2 bg-amber-500 rounded-full ml-2"></div>
            )}
          </div>
          <span className="text-xs text-gray-500">ID: {query.id}</span>
        </div>
      </div>
      
      {(showActions || showDeleteConfirm) && (
        <div className="flex gap-1">
          {showDeleteConfirm ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(false);
                }}
                className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate();
                }}
                className="text-gray-400 hover:text-indigo-500 transition-colors p-1"
                title="Duplicate query"
              >
                <Copy size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                title="Delete query"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}



export { QueriesList };