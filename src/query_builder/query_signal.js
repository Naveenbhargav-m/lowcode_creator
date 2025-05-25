// query_state.js
import { signal } from "@preact/signals";
import { generateUID } from "../utils/helpers";
import { GetDataFromAPi, CreateDataToAPI, UpdateDataToAPI, DeleteDataFromAPI } from "../api/api_syncerv2";
import { AppID } from "../states/global_state";

// State Management
let queries = {};
const queryNamesList = signal([]);
const activeQuery = signal("");
const activeQueryData = signal({});
const isQueryChanged = signal("");

// Track which queries have unsaved changes
const unsavedQueries = signal(new Set());
const isLoading = signal(false);
const apiError = signal(null);

// Default query structure
const DEFAULT_QUERY_STRUCTURE = {
  name: "",
  order: 0,
  query_string: "",
  sql_string: "",
  inputs: [],
  outputs: [],
  input_function: "",
  output_function: "",
  select_fields: [],
  where_fields: [],
  where_groups: [],
  join_fields: [],
  group_fields: [],
  order_fields: [],
  select_aggregate_fields: [],
  order_aggregate_fields: [],
  input_params: [],
  input_js: [],
  output_js: [],
  output_params: []
};

/**
 * Load all queries from API
 */
async function LoadQueries() {
  try {
    isLoading.value = true;
    apiError.value = null;
    let url = `${AppID.value}/public/_queries`;
    const response = await GetDataFromAPi(url);
    console.log("Loaded queries:", response);

    if (!response || response.length === 0) {
      console.log("No queries found");
      queries = {};
      queryNamesList.value = [];
      return;
    }

    const queryNames = [];
    const queriesMap = {};

    response.forEach(query => {
      const queryData = {
        ...DEFAULT_QUERY_STRUCTURE,
        ...query.query_data,
        id: query.id
      };
      
      queriesMap[query.id] = queryData;
      queryNames.push({
        name: queryData.name,
        id: query.id,
        order: queryData.order || 0
      });
    });

    // Sort by order
    queryNames.sort((a, b) => a.order - b.order);
    
    queryNamesList.value = queryNames;
    queries = queriesMap;
    
    // Clear unsaved changes after successful load
    unsavedQueries.value = new Set();
    
    // Set first query as active if none selected
    if (queryNames.length > 0 && !activeQuery.value) {
      SetActiveQuery(queryNames[0].id);
    }
    
  } catch (error) {
    console.error("Error loading queries:", error);
    apiError.value = "Failed to load queries";
  } finally {
    isLoading.value = false;
  }
}

/**
 * Create a new query via API
 */
async function CreateQuery(formData) {
  try {
    isLoading.value = true;
    apiError.value = null;
    
    const queryData = {
      query_data: {
        ...DEFAULT_QUERY_STRUCTURE,
        name: formData.name,
        order: Object.keys(queries).length + 1
      }
    };

    // Make API call to create query
    let url = `${AppID.value}/public/_queries`;
    const response = await CreateDataToAPI(url, queryData);
    
    if (response && response.id) {
      // Add to local state with server-generated ID
      const newQuery = {
        ...queryData.query_data,
        id: response.id
      };
      
      queries[response.id] = newQuery;
      
      // Update query names list
      const existingList = queryNamesList.peek();
      queryNamesList.value = [
        ...existingList,
        { name: formData.name, id: response.id, order: newQuery.order }
      ];
      
      // Set as active query
      SetActiveQuery(response.id);
      
      console.log("Query created successfully:", response.id);
      return response.id;
    } else {
      throw new Error("Invalid response from server");
    }
    
  } catch (error) {
    console.error("Error creating query:", error);
    apiError.value = "Failed to create query";
    throw error;
  } finally {
    isLoading.value = false;
  }
}

/**
 * Update a specific query via API
 */
async function UpdateQuery(queryId) {
  try {
    isLoading.value = true;
    apiError.value = null;
    
    const query = queries[queryId];
    if (!query) {
      throw new Error("Query not found");
    }

    const updateData = {
      query_data: {
        ...query
      }
    };
    
    let url = `${AppID.value}/public/_queries?where=id=${queryId}`;
    await UpdateDataToAPI(url, updateData);
    
    // Remove from unsaved changes
    const currentUnsaved = new Set(unsavedQueries.value);
    currentUnsaved.delete(queryId);
    unsavedQueries.value = currentUnsaved;
    
    console.log("Query updated successfully:", queryId);
    return true;
    
  } catch (error) {
    console.error("Error updating query:", error);
    apiError.value = "Failed to update query";
    throw error;
  } finally {
    isLoading.value = false;
  }
}

/**
 * Delete a query via API
 */
async function DeleteQuery(queryId) {
  try {
    isLoading.value = true;
    apiError.value = null;
    let url = `${AppID.value}/public/_queries?where=id=${queryId}`;
    await DeleteDataFromAPI(url);
    
    // Remove from local state
    delete queries[queryId];
    
    // Update query names list
    const updatedList = queryNamesList.value.filter(item => item.id !== queryId);
    queryNamesList.value = updatedList;
    
    // Remove from unsaved changes
    const currentUnsaved = new Set(unsavedQueries.value);
    currentUnsaved.delete(queryId);
    unsavedQueries.value = currentUnsaved;
    
    // If this was the active query, set new active or clear
    if (activeQuery.value === queryId) {
      const remainingQueries = queryNamesList.value;
      if (remainingQueries.length > 0) {
        SetActiveQuery(remainingQueries[0].id);
      } else {
        activeQuery.value = "";
        activeQueryData.value = {};
      }
    }
    
    console.log("Query deleted successfully:", queryId);
    return true;
    
  } catch (error) {
    console.error("Error deleting query:", error);
    apiError.value = "Failed to delete query";
    throw error;
  } finally {
    isLoading.value = false;
  }
}

/**
 * Update only the currently active query
 */
async function SyncActiveQuery() {
  const activeId = activeQuery.value;
  if (!activeId) {
    console.warn("No active query to sync");
    return;
  }
  
  try {
    await UpdateQuery(activeId);
    console.log("Active query synced successfully");
  } catch (error) {
    console.error("Failed to sync active query:", error);
    throw error;
  }
}

/**
 * Sync all queries that have unsaved changes
 */
async function SyncAllUnsavedQueries() {
  const unsavedIds = Array.from(unsavedQueries.value);
  if (unsavedIds.length === 0) {
    console.log("No unsaved queries to sync");
    return;
  }
  
  try {
    const promises = unsavedIds.map(id => UpdateQuery(id));
    await Promise.all(promises);
    console.log("All unsaved queries synced successfully");
  } catch (error) {
    console.error("Failed to sync some queries:", error);
    throw error;
  }
}

/**
 * Set active query and load its data
 */
function SetActiveQuery(queryId) {
  if (!queryId || !queries[queryId]) {
    console.warn("Query not found:", queryId);
    return;
  }
  
  activeQuery.value = queryId;
  activeQueryData.value = { ...queries[queryId] };
  isQueryChanged.value = queryId;
  
  console.log("Active query set:", queryId);
}

/**
 * Update a part of the active query
 */
function UpdateQueryPart(part, data) {
  console.log("Updating query part:", part, data);
  
  const activeId = activeQuery.value;
  if (!activeId || !queries[activeId]) {
    console.warn("No active query to update");
    return;
  }
  
  // Update local query data
  queries[activeId][part] = data;
  
  // Update active query data signal
  activeQueryData.value = { ...queries[activeId] };
  
  // Mark as changed
  MarkQueryAsChanged(activeId);
  
  isQueryChanged.value = generateUID();
  
  console.log("Query part updated:", part, data);
}

/**
 * Create a new query block (legacy compatibility)
 */
function CreateQueryBlock(data) {
  return CreateQuery(data);
}

/**
 * Mark query as having unsaved changes
 */
function MarkQueryAsChanged(queryId) {
  const currentUnsaved = new Set(unsavedQueries.value);
  currentUnsaved.add(queryId);
  unsavedQueries.value = currentUnsaved;
}

/**
 * Check if query has unsaved changes
 */
function HasUnsavedChanges(queryId) {
  return unsavedQueries.value.has(queryId);
}

/**
 * Get query by ID
 */
function GetQueryByID(queryId) {
  return queries[queryId] ? { ...queries[queryId] } : null;
}

/**
 * Duplicate an existing query
 */
async function DuplicateQuery(sourceQueryId) {
  const sourceQuery = queries[sourceQueryId];
  if (!sourceQuery) {
    throw new Error("Source query not found");
  }
  
  const duplicateData = {
    name: `${sourceQuery.name} (Copy)`,
    ...sourceQuery,
    id: undefined // Will be generated by server
  };
  
  return CreateQuery(duplicateData);
}

/**
 * Reorder queries
 */
async function ReorderQueries(newOrder) {
  try {
    // Update local order
    newOrder.forEach((item, index) => {
      if (queries[item.id]) {
        queries[item.id].order = index;
        MarkQueryAsChanged(item.id);
      }
    });
    
    // Update the names list
    queryNamesList.value = newOrder.map((item, index) => ({
      ...item,
      order: index
    }));
    
    console.log("Queries reordered");
  } catch (error) {
    console.error("Error reordering queries:", error);
    throw error;
  }
}

// Export all functions and signals
export {
  // State
  queries,
  queryNamesList,
  activeQuery,
  activeQueryData,
  isQueryChanged,
  unsavedQueries,
  isLoading,
  apiError,
  
  // CRUD Operations
  LoadQueries,
  CreateQuery,
  UpdateQuery,
  DeleteQuery,
  SyncActiveQuery,  
  // Query Management
  SetActiveQuery,
  UpdateQueryPart,
  CreateQueryBlock, // Legacy compatibility
  GetQueryByID,
  DuplicateQuery,
  ReorderQueries,
  MarkQueryAsChanged,
  HasUnsavedChanges,
  SyncAllUnsavedQueries
};