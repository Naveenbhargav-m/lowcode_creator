import { useState } from "preact/hooks";
import { activeScreen, apiError, DeleteScreen, HasUnsavedChanges, isLoading, SetCurrentScreen } from "./screen_state";

function ScreensListPanels({ elementsList }) {
  const [deletingId, setDeletingId] = useState(null);

  return (
    <div class="scrollable-div pt-4">
      {isLoading.value && (
        <div class="flex items-center justify-center p-4">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span class="ml-2 text-sm text-gray-600">Loading...</span>
        </div>
      )}
      
      {apiError.value && (
        <div class="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-600">{apiError.value}</p>
        </div>
      )}
      
      {elementsList.map((item) => (
        <ScreenTile 
          key={item.id}
          name={item.name} 
          id={item.id}
          isDeleting={deletingId === item.id}
          onDelete={async (id) => {
            setDeletingId(id);
            try {
              await DeleteScreen(id);
            } catch (error) {
              console.error("Failed to delete template:", error);
            } finally {
              setDeletingId(null);
            }
          }}
        />
      ))}
      
      {elementsList.length === 0 && !isLoading.value && (
        <div class="text-center text-gray-500 p-8">
          <p>No templates found</p>
          <p class="text-sm mt-2">Create your first template to get started</p>
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
