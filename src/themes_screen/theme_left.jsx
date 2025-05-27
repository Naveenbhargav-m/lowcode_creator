// themes_left_list.jsx
import { useState } from "preact/hooks";
import { 
  themeNameAndIDSList, 
  ActiveTheme,
  SetActiveTheme,
  CreateTheme,
  DeleteTheme,
  DuplicateTheme,
  SetDefaultTheme,
  HasUnsavedChanges,
  isLoading,
  themes
} from "./themes_state";

function ThemesList() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newThemeName, setNewThemeName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleCreateTheme = async (e) => {
    e.preventDefault();
    if (!newThemeName.trim()) return;

    try {
      await CreateTheme({ name: newThemeName.trim() });
      setNewThemeName("");
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create theme:", error);
    }
  };

  const handleDeleteTheme = async (themeId, themeName) => {
    if (showDeleteConfirm !== themeId) {
      setShowDeleteConfirm(themeId);
      return;
    }

    try {
      await DeleteTheme(themeId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete theme:", error);
    }
  };

  const handleDuplicateTheme = async (themeId) => {
    try {
      await DuplicateTheme(themeId);
    } catch (error) {
      console.error("Failed to duplicate theme:", error);
    }
  };

  const handleSetDefaultTheme = async (themeId) => {
    try {
      await SetDefaultTheme(themeId);
    } catch (error) {
      console.error("Failed to set default theme:", error);
    }
  };

  const filteredThemes = themeNameAndIDSList.value.filter(theme =>
    theme.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ 
      height: "100%", 
      display: "flex", 
      flexDirection: "column",
      padding: "16px"
    }}>
      {/* Header */}
      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ 
          fontSize: "18px", 
          fontWeight: "600", 
          margin: "0 0 12px 0",
          color: "#1f2937"
        }}>
          Themes
        </h3>
        
        {/* Search */}
        <input
          type="text"
          placeholder="Search themes..."
          value={searchTerm}
          // @ts-ignore
          onInput={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "14px",
            marginBottom: "12px"
          }}
        />

        {/* Create New Button */}
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          disabled={isLoading.value}
          style={{
            width: "100%",
            padding: "8px 16px",
            backgroundColor: "#8b5cf6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: isLoading.value ? "not-allowed" : "pointer",
            opacity: isLoading.value ? 0.6 : 1
          }}
        >
          + New Theme
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div style={{
          padding: "12px",
          backgroundColor: "#f9fafb",
          borderRadius: "6px",
          marginBottom: "16px",
          border: "1px solid #e5e7eb"
        }}>
          <form onSubmit={handleCreateTheme}>
            <input
              type="text"
              placeholder="Theme name..."
              value={newThemeName}
              // @ts-ignore
              onInput={(e) => setNewThemeName(e.target.value)}
              autoFocus
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                fontSize: "14px",
                marginBottom: "8px"
              }}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="submit"
                disabled={!newThemeName.trim() || isLoading.value}
                style={{
                  flex: 1,
                  padding: "6px 12px",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: (!newThemeName.trim() || isLoading.value) ? "not-allowed" : "pointer",
                  opacity: (!newThemeName.trim() || isLoading.value) ? 0.6 : 1
                }}
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewThemeName("");
                }}
                style={{
                  flex: 1,
                  padding: "6px 12px",
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Themes List */}
      <div style={{ 
        flex: 1, 
        overflow: "auto",
        border: "1px solid #e5e7eb",
        borderRadius: "6px"
      }}>
        {filteredThemes.length === 0 ? (
          <div style={{
            padding: "24px",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "14px"
          }}>
            {searchTerm ? "No themes match your search" : "No themes found"}
          </div>
        ) : (
          filteredThemes.map((theme) => (
            <ThemeListItem
              key={theme.id}
              theme={theme}
              isActive={ActiveTheme.value === theme.id}
              isDefault={themes[theme.id]?.is_default || false}
              hasUnsavedChanges={HasUnsavedChanges(theme.id)}
              showDeleteConfirm={showDeleteConfirm === theme.id}
              onSelect={() => SetActiveTheme(theme.id)}
              onDelete={() => handleDeleteTheme(theme.id, theme.name)}
              onDuplicate={() => handleDuplicateTheme(theme.id)}
              onSetDefault={() => handleSetDefaultTheme(theme.id)}
              onCancelDelete={() => setShowDeleteConfirm(null)}
              isLoading={isLoading.value}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ThemeListItem({ 
  theme, 
  isActive, 
  isDefault,
  hasUnsavedChanges,
  showDeleteConfirm,
  onSelect, 
  onDelete, 
  onDuplicate,
  onSetDefault,
  onCancelDelete,
  isLoading
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      style={{
        padding: "12px",
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: isActive ? "#f3e8ff" : "white",
        cursor: "pointer",
        position: "relative"
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={onSelect}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: "14px",
            fontWeight: isActive ? "600" : "500",
            color: isActive ? "#7c3aed" : "#1f2937",
            marginBottom: "2px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <span style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}>
              {theme.name}
            </span>
            {isDefault && (
              <span style={{
                fontSize: "10px",
                backgroundColor: "#10b981",
                color: "white",
                padding: "2px 6px",
                borderRadius: "4px",
                flexShrink: 0
              }}>
                DEFAULT
              </span>
            )}
            {hasUnsavedChanges && (
              <span style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#f59e0b",
                borderRadius: "50%",
                flexShrink: 0
              }} />
            )}
          </div>
          <div style={{
            fontSize: "12px",
            color: "#6b7280"
          }}>
            ID: {theme.id}
          </div>
        </div>

        {/* Actions */}
        {(showActions || showDeleteConfirm) && (
          <div style={{
            display: "flex",
            gap: "4px",
            marginLeft: "8px"
          }}>
            {showDeleteConfirm ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  disabled={isLoading}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "11px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.6 : 1
                  }}
                >
                  Confirm
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelDelete();
                  }}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#6b7280",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "11px",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetDefault();
                  }}
                  disabled={isLoading || isDefault}
                  title={isDefault ? "Already default" : "Set as default theme"}
                  style={{
                    padding: "4px 6px",
                    backgroundColor: isDefault ? "#6b7280" : "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "11px",
                    cursor: (isLoading || isDefault) ? "not-allowed" : "pointer",
                    opacity: (isLoading || isDefault) ? 0.6 : 1
                  }}
                >
                  ⭐
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate();
                  }}
                  disabled={isLoading}
                  title="Duplicate theme"
                  style={{
                    padding: "4px 6px",
                    backgroundColor: "#8b5cf6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "11px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.6 : 1
                  }}
                >
                  📋
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  disabled={isLoading}
                  title="Delete theme"
                  style={{
                    padding: "4px 6px",
                    backgroundColor: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "11px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.6 : 1
                  }}
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { ThemesList };