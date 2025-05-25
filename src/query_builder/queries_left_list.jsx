// queries_left_list.jsx
import { useState } from "preact/hooks";
import { 
  queryNamesList, 
  activeQuery,
  SetActiveQuery,
  CreateQuery,
  DeleteQuery,
  DuplicateQuery,
  HasUnsavedChanges,
  isLoading
} from "./query_signal";

function QueriesList() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newQueryName, setNewQueryName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleCreateQuery = async (e) => {
    e.preventDefault();
    if (!newQueryName.trim()) return;

    try {
      await CreateQuery({ name: newQueryName.trim() });
      setNewQueryName("");
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create query:", error);
    }
  };

  const handleDeleteQuery = async (queryId, queryName) => {
    if (showDeleteConfirm !== queryId) {
      setShowDeleteConfirm(queryId);
      return;
    }

    try {
      await DeleteQuery(queryId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete query:", error);
    }
  };

  const handleDuplicateQuery = async (queryId) => {
    try {
      await DuplicateQuery(queryId);
    } catch (error) {
      console.error("Failed to duplicate query:", error);
    }
  };

  const filteredQueries = queryNamesList.value.filter(query =>
    query.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          Queries
        </h3>
        
        {/* Search */}
        <input
          type="text"
          placeholder="Search queries..."
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
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: isLoading.value ? "not-allowed" : "pointer",
            opacity: isLoading.value ? 0.6 : 1
          }}
        >
          + New Query
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
          <form onSubmit={handleCreateQuery}>
            <input
              type="text"
              placeholder="Query name..."
              value={newQueryName}
              // @ts-ignore
              onInput={(e) => setNewQueryName(e.target.value)}
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
                disabled={!newQueryName.trim() || isLoading.value}
                style={{
                  flex: 1,
                  padding: "6px 12px",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: (!newQueryName.trim() || isLoading.value) ? "not-allowed" : "pointer",
                  opacity: (!newQueryName.trim() || isLoading.value) ? 0.6 : 1
                }}
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewQueryName("");
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

      {/* Queries List */}
      <div style={{ 
        flex: 1, 
        overflow: "auto",
        border: "1px solid #e5e7eb",
        borderRadius: "6px"
      }}>
        {filteredQueries.length === 0 ? (
          <div style={{
            padding: "24px",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "14px"
          }}>
            {searchTerm ? "No queries match your search" : "No queries found"}
          </div>
        ) : (
          filteredQueries.map((query) => (
            <QueryListItem
              key={query.id}
              query={query}
              isActive={activeQuery.value === query.id}
              hasUnsavedChanges={HasUnsavedChanges(query.id)}
              showDeleteConfirm={showDeleteConfirm === query.id}
              onSelect={() => SetActiveQuery(query.id)}
              onDelete={() => handleDeleteQuery(query.id, query.name)}
              onDuplicate={() => handleDuplicateQuery(query.id)}
              onCancelDelete={() => setShowDeleteConfirm(null)}
              isLoading={isLoading.value}
            />
          ))
        )}
      </div>
    </div>
  );
}

function QueryListItem({ 
  query, 
  isActive, 
  hasUnsavedChanges,
  showDeleteConfirm,
  onSelect, 
  onDelete, 
  onDuplicate,
  onCancelDelete,
  isLoading
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      style={{
        padding: "12px",
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: isActive ? "#eff6ff" : "white",
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
            color: isActive ? "#1d4ed8" : "#1f2937",
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
              {query.name}
            </span>
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
            ID: {query.id}
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
                    onDuplicate();
                  }}
                  disabled={isLoading}
                  title="Duplicate query"
                  style={{
                    padding: "4px 6px",
                    backgroundColor: "#3b82f6",
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
                  title="Delete query"
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

export { QueriesList };