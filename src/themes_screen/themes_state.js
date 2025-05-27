// theme_state.js
import { signal } from "@preact/signals";
import { generateUID } from "../utils/helpers";
import { GetDataFromAPi, CreateDataToAPI, UpdateDataToAPI, DeleteDataFromAPI } from "../api/api_syncerv2";
import { AppID, DefaultTheme, DefaultThemeID } from "../states/global_state";

// State Management
let themes = {};
const themeNameAndIDSList = signal([]);
const ActiveTheme = signal("");
const currentThemes = [signal(""), signal("")];

// Track which themes have unsaved changes
const unsavedThemes = signal(new Set());
const isLoading = signal(false);
const apiError = signal(null);

// Default theme structure
const DEFAULT_THEME_STRUCTURE = {
  theme_name: "",
  dark_theme: {},
  light_theme: {},
  is_default: false
};

/**
 * Load all themes from API
 */
async function LoadThemes() {
  try {
    isLoading.value = true;
    apiError.value = null;
    let url = `${AppID.value}/public/_themes`;
    const response = await GetDataFromAPi(url);
    console.log("Loaded themes:", response);

    if (!response || response.length === 0) {
      console.log("No themes found");
      themes = {};
      themeNameAndIDSList.value = [];
      return;
    }

    const themeList = [];
    const themesMap = {};

    response.forEach(theme => {
      const themeData = {
        ...DEFAULT_THEME_STRUCTURE,
        ...theme,
        // Map API fields to local structure
        light: theme.light_theme || {},
        dark: theme.dark_theme || {}
      };
      
      themesMap[theme.id] = themeData;
      themeList.push({
        name: themeData.theme_name,
        id: theme.id
      });
    });

    themeNameAndIDSList.value = themeList;
    themes = themesMap;
    
    // Clear unsaved changes after successful load
    unsavedThemes.value = new Set();
    
    // Set first theme as active if none selected, or find default theme
    const defaultTheme = response.find(theme => theme.is_default);
    if (defaultTheme) {
      SetActiveTheme(defaultTheme.id);
      DefaultThemeID.value = defaultTheme.id;
      UpdateDefaultTheme();
    } else if (themeList.length > 0 && !ActiveTheme.value) {
      SetActiveTheme(themeList[0].id);
    }
    
  } catch (error) {
    console.error("Error loading themes:", error);
    apiError.value = "Failed to load themes";
    
    // Fallback to localStorage if API fails
    await LoadThemesFromLocalStorage();
  } finally {
    isLoading.value = false;
  }
}

/**
 * Fallback: Load themes from localStorage
 */
async function LoadThemesFromLocalStorage() {
  try {
    let tempStr = localStorage.getItem("themes");
    if (!tempStr) return;
    
    let tempObj = JSON.parse(tempStr);
    themes = { ...tempObj };
    
    let myarr = [];
    let firstkey = "";
    let firstKeyAdded = false;
    
    for (const key in themes) {
      if (!firstKeyAdded) {
        firstkey = key;
        firstKeyAdded = true;
      }
      if (themes[key] === undefined) {
        continue;
      }
      let temp = { "id": themes[key]["id"], "name": themes[key]["theme_name"] || themes[key]["name"] };
      myarr.push(temp);
    }
    
    themeNameAndIDSList.value = [...myarr];
    
    if (themes[firstkey] !== undefined) {
      ActiveTheme.value = themes[firstkey]["id"];
      SetCurrentTheme();
    }
  } catch (error) {
    console.error("Error loading themes from localStorage:", error);
  }
}

/**
 * Create a new theme via API
 */
async function CreateTheme(formData) {
  try {
    isLoading.value = true;
    apiError.value = null;
    
    const themeData = {
      theme_name: formData.name || formData.theme_name,
      dark_theme: formData.dark || {},
      light_theme: formData.light || {},
      is_default: formData.is_default || false
    };

    // Make API call to create theme
    let url = `${AppID.value}/public/_themes`;
    const response = await CreateDataToAPI(url, themeData);
    
    if (response && response.id) {
      // Add to local state with server-generated ID
      const newTheme = {
        ...themeData,
        id: response.id,
        light: themeData.light_theme,
        dark: themeData.dark_theme,
        _change_type: "add"
      };
      
      themes[response.id] = newTheme;
      
      // Update theme names list
      const existingList = themeNameAndIDSList.peek();
      themeNameAndIDSList.value = [
        ...existingList,
        { name: themeData.theme_name, id: response.id }
      ];
      
      // Set as active theme
      SetActiveTheme(response.id);
      
      // Update localStorage as backup
      localStorage.setItem("themes", JSON.stringify(themes));
      
      console.log("Theme created successfully:", response.id);
      return response.id;
    } else {
      throw new Error("Invalid response from server");
    }
    
  } catch (error) {
    console.error("Error creating theme:", error);
    apiError.value = "Failed to create theme";
    
    // Fallback to localStorage creation
    return CreateThemeLocalStorage(formData);
  } finally {
    isLoading.value = false;
  }
}

/**
 * Fallback: Create theme in localStorage
 */
function CreateThemeLocalStorage(data) {
  let name = data["name"] || data["theme_name"];
  let id = generateUID();
  let newTheme = {
    "id": id,
    "_change_type": "add",
    "theme_name": name,
    "light": data.light || {},
    "dark": data.dark || {},
    "is_default": data.is_default || false
  };
  
  themes[id] = newTheme;
  ActiveTheme.value = id;
  localStorage.setItem("themes", JSON.stringify(themes));
  
  let existing = themeNameAndIDSList.peek();
  existing.push({ id: id, name: name });
  themeNameAndIDSList.value = [...existing];
  
  return id;
}

/**
 * Update a specific theme via API
 */
async function UpdateTheme(themeId) {
  try {
    isLoading.value = true;
    apiError.value = null;
    
    const theme = themes[themeId];
    if (!theme) {
      throw new Error("Theme not found");
    }

    const updateData = {
      theme_name: theme.theme_name,
      dark_theme: theme.dark || theme.dark_theme || {},
      light_theme: theme.light || theme.light_theme || {},
      is_default: theme.is_default || false
    };
    
    let url = `${AppID.value}/public/_themes?where=id=${themeId}`;
    await UpdateDataToAPI(url, updateData);
    
    // Remove from unsaved changes
    const currentUnsaved = new Set(unsavedThemes.value);
    currentUnsaved.delete(themeId);
    unsavedThemes.value = currentUnsaved;
    
    // Update localStorage as backup
    localStorage.setItem("themes", JSON.stringify(themes));
    
    console.log("Theme updated successfully:", themeId);
    return true;
    
  } catch (error) {
    console.error("Error updating theme:", error);
    apiError.value = "Failed to update theme";
    
    // Fallback to localStorage update
    localStorage.setItem("themes", JSON.stringify(themes));
    throw error;
  } finally {
    isLoading.value = false;
  }
}

/**
 * Delete a theme via API
 */
async function DeleteTheme(themeId) {
  try {
    isLoading.value = true;
    apiError.value = null;
    
    let url = `${AppID.value}/public/_themes?where=id=${themeId}`;
    await DeleteDataFromAPI(url);
    
    // Remove from local state
    delete themes[themeId];
    
    // Update theme names list
    const updatedList = themeNameAndIDSList.value.filter(item => item.id !== themeId);
    themeNameAndIDSList.value = updatedList;
    
    // Remove from unsaved changes
    const currentUnsaved = new Set(unsavedThemes.value);
    currentUnsaved.delete(themeId);
    unsavedThemes.value = currentUnsaved;
    
    // If this was the active theme, set new active or clear
    if (ActiveTheme.value === themeId) {
      const remainingThemes = themeNameAndIDSList.value;
      if (remainingThemes.length > 0) {
        SetActiveTheme(remainingThemes[0].id);
      } else {
        ActiveTheme.value = "";
        currentThemes[0].value = "";
        currentThemes[1].value = "";
      }
    }
    
    // Update localStorage as backup
    localStorage.setItem("themes", JSON.stringify(themes));
    
    console.log("Theme deleted successfully:", themeId);
    return true;
    
  } catch (error) {
    console.error("Error deleting theme:", error);
    apiError.value = "Failed to delete theme";
    throw error;
  } finally {
    isLoading.value = false;
  }
}

/**
 * Set a theme as default
 */
async function SetDefaultTheme(themeId) {
  try {
    // First, unset all other themes as default
    Object.keys(themes).forEach(id => {
      themes[id].is_default = (id === themeId);
      if (id !== themeId) {
        MarkThemeAsChanged(id);
      }
    });
    
    // Set the selected theme as default
    if (themes[themeId]) {
      themes[themeId].is_default = true;
      MarkThemeAsChanged(themeId);
      DefaultThemeID.value = themeId;
      UpdateDefaultTheme();
    }
    
    console.log("Default theme set:", themeId);
  } catch (error) {
    console.error("Error setting default theme:", error);
    throw error;
  }
}

/**
 * Update only the currently active theme
 */
async function SyncActiveTheme() {
  const activeId = ActiveTheme.value;
  if (!activeId) {
    console.warn("No active theme to sync");
    return;
  }
  
  try {
    await UpdateTheme(activeId);
    console.log("Active theme synced successfully");
  } catch (error) {
    console.error("Failed to sync active theme:", error);
    throw error;
  }
}

/**
 * Sync all themes that have unsaved changes
 */
async function SyncAllUnsavedThemes() {
  const unsavedIds = Array.from(unsavedThemes.value);
  if (unsavedIds.length === 0) {
    console.log("No unsaved themes to sync");
    return;
  }
  
  try {
    const promises = unsavedIds.map(id => UpdateTheme(id));
    await Promise.all(promises);
    console.log("All unsaved themes synced successfully");
  } catch (error) {
    console.error("Failed to sync some themes:", error);
    throw error;
  }
}

/**
 * Set active theme and load its data
 */
function SetActiveTheme(themeId) {
  if (!themeId || !themes[themeId]) {
    console.warn("Theme not found:", themeId);
    return;
  }
  
  ActiveTheme.value = themeId;
  SetCurrentTheme();
  
  console.log("Active theme set:", themeId);
}

/**
 * Update current theme signals for UI
 */
function SetCurrentTheme() {
  let currTheme = themes[ActiveTheme.peek()];
  if (!currTheme) return;
  
  let light = currTheme["light"] || currTheme["light_theme"] || {};
  let dark = currTheme["dark"] || currTheme["dark_theme"] || {};
  
  currentThemes[0].value = JSON.stringify(dark);
  currentThemes[1].value = JSON.stringify(light);
}

/**
 * Update default theme reference
 */
function UpdateDefaultTheme() {
  let DefaultID = DefaultThemeID.value;
  if (DefaultID === undefined) {
    return;
  }
  
  console.log("Default theme ID:", DefaultID);
  let mytheme = themes[DefaultID];
  if (mytheme === undefined) {
    return;
  }
  
  console.log("Default theme:", mytheme);
  DefaultTheme.value = mytheme;
}

/**
 * Update a part of the active theme
 */
function UpdateThemePart(part, data) {
  console.log("Updating theme part:", part, data);
  
  const activeId = ActiveTheme.value;
  if (!activeId || !themes[activeId]) {
    console.warn("No active theme to update");
    return;
  }
  
  // Update local theme data
  themes[activeId][part] = data;
  
  // Mark as changed
  MarkThemeAsChanged(activeId);
  
  // Update current theme if it's light/dark
  if (part === 'light' || part === 'dark' || part === 'light_theme' || part === 'dark_theme') {
    SetCurrentTheme();
  }
  
  console.log("Theme part updated:", part, data);
}

/**
 * Mark theme as having unsaved changes
 */
function MarkThemeAsChanged(themeId) {
  const currentUnsaved = new Set(unsavedThemes.value);
  currentUnsaved.add(themeId);
  unsavedThemes.value = currentUnsaved;
}

/**
 * Check if theme has unsaved changes
 */
function HasUnsavedChanges(themeId) {
  return unsavedThemes.value.has(themeId);
}

/**
 * Get theme by ID
 */
function GetThemeByID(themeId) {
  return themes[themeId] ? { ...themes[themeId] } : null;
}

/**
 * Duplicate an existing theme
 */
async function DuplicateTheme(sourceThemeId) {
  const sourceTheme = themes[sourceThemeId];
  if (!sourceTheme) {
    throw new Error("Source theme not found");
  }
  
  const duplicateData = {
    name: `${sourceTheme.theme_name} (Copy)`,
    theme_name: `${sourceTheme.theme_name} (Copy)`,
    light: sourceTheme.light || sourceTheme.light_theme || {},
    dark: sourceTheme.dark || sourceTheme.dark_theme || {},
    is_default: false // Never duplicate as default
  };
  
  return CreateTheme(duplicateData);
}

// Legacy compatibility - keep original AddTheme function
function AddTheme(data) {
  return CreateTheme(data);
}

// Export all functions and signals
export {
  // State
  themes,
  themeNameAndIDSList,
  ActiveTheme,
  currentThemes,
  unsavedThemes,
  isLoading,
  apiError,
  
  // CRUD Operations
  LoadThemes,
  CreateTheme,
  UpdateTheme,
  DeleteTheme,
  SyncActiveTheme,
  SyncAllUnsavedThemes,
  
  // Theme Management
  SetActiveTheme,
  SetCurrentTheme,
  UpdateDefaultTheme,
  SetDefaultTheme,
  UpdateThemePart,
  GetThemeByID,
  DuplicateTheme,
  MarkThemeAsChanged,
  HasUnsavedChanges,
  
  // Legacy compatibility
  AddTheme
};