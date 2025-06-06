import { useState } from "preact/hooks";
import { activeScreen, apiError, DeleteScreen, HasUnsavedChanges, isLoading, SetCurrentScreen } from "./screen_state";
import { Monitor, Plus, Trash2 } from "lucide-react";


function ScreensListPanels({ screens, activeScreen, onScreenSelect, onCreateScreen, onDeleteScreen, hasUnsavedChanges }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    if (newName.trim()) {
      onCreateScreen(newName);
      setNewName('');
      setIsCreating(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Screens</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white p-1.5 rounded hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {isCreating && (
        <div className="mb-4 space-y-2">
          <input
            type="text"
            value={newName}
            // @ts-ignore
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Screen name"
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
        {screens.map(screen => (
          <div 
            key={screen.id}
            className={`flex items-center justify-between p-2.5 rounded-md cursor-pointer transition-colors ${
              activeScreen === screen.id 
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                : 'hover:bg-gray-100'
            }`}
            onClick={() => onScreenSelect(screen.id)}
          >
            <div className="flex items-center">
              <Monitor size={16} className="mr-2 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{screen.name}</span>
                {hasUnsavedChanges(screen.id) && (
                  <span className="text-xs text-amber-600">Unsaved changes</span>
                )}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteScreen(screen.id);
              }}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {screens.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <Monitor size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No templates found</p>
          <p className="text-xs mt-1">Create your first template to get started</p>
        </div>
      )}
    </div>
  );
}

function ScreenTile({ name, id, isDeleting, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const isActive = activeScreen.value === id;
  const hasChanges = HasUnsavedChanges(id);

  const handleSelect = (e) => {
    e.stopPropagation();
    if (activeScreen.value !== id) {
      activeScreen.value = id;
      SetCurrentScreen();
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
    await onDelete(id);
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  const tileStyle = {
    padding: "12px",
    borderStyle: "solid",
    borderWidth: "1px",
    color: isActive ? "white" : "black",
    backgroundColor: isActive ? "#2563eb" : "white",
    borderRadius: "8px",
    fontSize: "0.875rem",
    margin: "8px 4px",
    borderColor: isActive ? "#2563eb" : (isHovered ? "#6b7280" : "#d1d5db"),
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
    position: "relative",
    boxShadow: isActive ? "0 2px 4px rgba(37, 99, 235, 0.2)" : "none"
  };

  const deleteButtonStyle = {
    position: "absolute",
    top: "4px",
    right: "4px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: isActive ? "rgba(255, 255, 255, 0.2)" : "rgba(239, 68, 68, 0.1)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    color: isActive ? "white" : "#ef4444",
    opacity: isHovered ? "1" : "0.7",
    transition: "all 0.2s ease-in-out"
  };

  const confirmDialogStyle = {
    position: "absolute",
    top: "100%",
    left: "0",
    right: "0",
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: "10",
    marginTop: "4px"
  };

  if (showDeleteConfirm) {
    return (
      <div style={{ ...tileStyle, position: "relative" }}>
        <p style={{ marginBottom: "8px", fontSize: "0.8rem" }}>{name}</p>
        <div style={confirmDialogStyle}>
          <p style={{ fontSize: "0.75rem", marginBottom: "8px", color: "#374151" }}>
            Delete "{name}"?
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "0.75rem",
                cursor: isDeleting ? "not-allowed" : "pointer",
                opacity: isDeleting ? "0.5" : "1"
              }}
            >
              {isDeleting ? "..." : "Delete"}
            </button>
            <button
              onClick={cancelDelete}
              style={{
                backgroundColor: "#f3f4f6",
                color: "#374151",
                border: "none",
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "0.75rem",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={tileStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleSelect}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ flex: "1", paddingRight: "8px" }}>
          <p style={{ margin: "0", fontWeight: isActive ? "600" : "400" }}>
            {name}
            {hasChanges && (
              <span style={{ 
                marginLeft: "6px", 
                fontSize: "0.75rem", 
                color: isActive ? "rgba(255, 255, 255, 0.8)" : "#f59e0b",
                fontWeight: "500"
              }}>
                •
              </span>
            )}
          </p>
          {hasChanges && (
            <p style={{ 
              margin: "2px 0 0 0", 
              fontSize: "0.7rem", 
              color: isActive ? "rgba(255, 255, 255, 0.7)" : "#6b7280" 
            }}>
              Unsaved changes
            </p>
          )}
        </div>
        
        {(isHovered || isActive) && (
          <button
            onClick={handleDeleteClick}
            style={deleteButtonStyle}
            title="Delete template"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isActive ? "rgba(255, 255, 255, 0.3)" : "rgba(239, 68, 68, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isActive ? "rgba(255, 255, 255, 0.2)" : "rgba(239, 68, 68, 0.1)";
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export { ScreenTile, ScreensListPanels };
