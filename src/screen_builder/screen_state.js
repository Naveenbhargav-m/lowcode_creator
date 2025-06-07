// screen_state.js
import { effect, signal } from "@preact/signals";
import { generateUID, sortObjectByOrder } from "../utils/helpers";
import { PrimitivesStylesMap } from "../components/primitives/primitives_base_styles";
import { ContainersStylesMap } from "../components/containers/containers_bse_styles";
import { GetDataFromAPi, CreateDataToAPI, UpdateDataToAPI, DeleteDataFromAPI } from "../api/api_syncerv2";
import { AppID } from "../states/global_state";
import { global_templates } from "../states/global_repo";

// Constants
const DEFAULT_SCREEN_STYLE = { 
  display: "flex", 
  flexDirection: "column", 
  minHeight: "200px", 
  minWidth: "150px", 
  height: "100%", 
  width: "100%" 
};

const DESIGN_VIEWS = {
  SMARTPHONE: "smartphone",
  DESKTOP: "desktop"
};

const CONTAINER_BOUNDS = { height: 0, width: 0 };

// Tab Data for Left Panel
const tabDataSignal = signal({
  tabs: ["primitives", "containers", "templates", "my_templates"],
  tab: "primitives",
  primitives: [
    { icon: "text-cursor", title: "Text", value: "text", type: "primitive" },
    { icon: "hash", title: "Number", value: "number", type: "primitive" },
    { icon: "align-left", title: "Text Area", value: "text_area", type: "primitive" },
    { icon: "bar-chart-2", title: "Progress Bar", value: "progress_bar", type: "primitive" },
    { icon: "user", title: "Avatar", value: "avatar", type: "primitive" },
    { icon: "users", title: "Avatar Group", value: "avatar_group", type: "primitive" },
    { icon: "chevron-down", title: "Dropdown", value: "drop_down", type: "primitive" },
    { icon: "square", title: "Button", value: "button", type: "primitive" },
    { icon: "image", title: "Image", value: "image", type: "primitive" },
    { icon: "badge-check", title: "Badge", value: "badge", type: "primitive" },
    { icon: "smile", title: "Icon", value: "icon", type: "primitive" },
    { icon: "mouse-pointer", title: "Icon Button", value: "icon_button", type: "primitive" },
  ],
  containers: [
    { icon: "square", title: "Card", value: "card", type: "container" },
    { icon: "layout", title: "Container", value: "container", type: "container" },
    { icon: "grid", title: "Grid View", value: "grid_view", type: "container" },
    { icon: "list", title: "List View", value: "list_view", type: "container" },
    { icon: "align-justify", title: "Row", value: "row", type: "container" },
    { icon: "columns", title: "Column", value: "column", type: "container" },
    { icon: "scroll", title: "Scroll Area", value: "scroll_area", type: "container" },
    { icon: "chevrons-right", title: "Carousel", value: "carousel", type: "container" },
  ],
  templates: [
    { icon: "table", title: "Table", value: "table", type: "template" },
    { icon: "bar-chart", title: "Charts", value: "charts", type: "template" },
    { icon: "grid", title: "Grid", value: "grid", type: "template" },
    { icon: "list", title: "List", value: "list", type: "template" },
    { icon: "file-text", title: "Form", value: "form", type: "template" },
    { icon: "monitor", title: "Screen", value: "screen", type: "template" },
    { icon: "menu", title: "Navbar", value: "navbar", type: "template" },
    { icon: "panel-left", title: "SideBar", value: "sidebar", type: "template" },
    { icon: "columns-2", title: "SideDrawer", value: "side_drawer", type: "modal" },
    { icon: "picture-in-picture-2", title: "Modal", value: "modal", type: "modal" },
    { icon: "picture-in-picture-2", title: "HoverCard", value: "hover_card", type: "modal" },
  ],
  my_templates: [],
});

// State Management
let screens = {};
const screenNamesList = signal([]);
const tabSignal = signal("primitives");
const activeTab = signal('Screen');
const activeConfigTab = signal("Basic");
const isHoveredSignal = signal(false);
const activeElement = signal("");
const activeScreen = signal("");
const screenViewKey = signal(DESIGN_VIEWS.SMARTPHONE);
const screenLeftTabSignal = signal("");
let activeScreenElements = {};
const screenElementAdded = signal("");
const screenElementsSorted = signal("");
const isScreenChanged = signal("");

// Track which screens have unsaved changes
const unsavedScreens = signal(new Set());
const isLoading = signal(false);
const apiError = signal(null);

/**
 * Load all screens from API
 */
async function LoadScreens() {
  try {
    isLoading.value = true;
    apiError.value = null;
    
    let url = `${AppID}/public/_screens`;
    const response = await GetDataFromAPi(url);
    console.log("Loaded screens:", response);

    if (!response || response.length === 0) {
      console.log("No screens found");
      screens = {};
      screenNamesList.value = [];
      return;
    }

    const tempNames = [];
    const screensMap = {};

    response.forEach(screen => {
      screensMap[screen.id] = {
        ...screen.configs,
        id: screen.id,
        screen_name: screen.screen_name
      };
      tempNames.push({
        name: screen.screen_name,
        id: screen.id,
        order: screen.configs?.order || 0
      });
    });

    // Sort by order
    tempNames.sort((a, b) => a.order - b.order);
    
    screenNamesList.value = tempNames;
    screens = screensMap;
    
    // Clear unsaved changes after successful load
    unsavedScreens.value = new Set();
    
  } catch (error) {
    console.error("Error loading screens:", error);
    apiError.value = "Failed to load screens";
  } finally {
    isLoading.value = false;
  }
}

/**
 * Create a new screen via API
 */
async function CreatenewScreen(formData) {
  try {
    isLoading.value = true;
    apiError.value = null;
    
    const screenData = {
      screen_name: formData.name,
      configs: {
        screen_name: formData.name,
        order: Object.keys(screens).length + 1,
        mobile_style: { ...DEFAULT_SCREEN_STYLE },
        desktop_style: { ...DEFAULT_SCREEN_STYLE },
        mobile_children: {},
        desktop_children: {}
      }
    };

    // Make API call to create screen
    let url = `${AppID}/public/_screens`;
    const response = await CreateDataToAPI(url, screenData);
    
    if (response && response.id) {
      // Add to local state with server-generated ID
      const newScreen = {
        ...screenData.configs,
        id: response.id,
        screen_name: formData.name
      };
      
      screens[response.id] = newScreen;
      
      // Update screen names list
      const existingList = screenNamesList.peek();
      screenNamesList.value = [
        ...existingList,
        { name: formData.name, id: response.id, order: newScreen.order }
      ];
      
      // Set as active screen
      activeScreen.value = response.id;
      SetCurrentScreen();
      
      console.log("Screen created successfully:", response.id);
      return response.id;
    } else {
      throw new Error("Invalid response from server");
    }
    
  } catch (error) {
    console.error("Error creating screen:", error);
    apiError.value = "Failed to create screen";
    throw error;
  } finally {
    isLoading.value = false;
  }
}

/**
 * Update a specific screen via API
 */
async function UpdateScreen(screenId) {
  try {
    isLoading.value = true;
    apiError.value = null;
    
    const screen = screens[screenId];
    if (!screen) {
      throw new Error("Screen not found");
    }

    const updateData = {
      screen_name: screen.screen_name,
      configs: {
        ...screen,
        // Ensure we're saving the current active elements if this is the active screen
        ...(screenId === activeScreen.value && {
          [screenViewKey.value === DESIGN_VIEWS.SMARTPHONE ? 'mobile_children' : 'desktop_children']: 
            SerializeActiveElements()
        })
      }
    };

    let url = `${AppID}/public/_screens?where=id=${screenId}`;
    await UpdateDataToAPI(url, updateData);
    
    // Remove from unsaved changes
    const currentUnsaved = new Set(unsavedScreens.value);
    currentUnsaved.delete(screenId);
    unsavedScreens.value = currentUnsaved;
    
    console.log("Screen updated successfully:", screenId);
    return true;
    
  } catch (error) {
    console.error("Error updating screen:", error);
    apiError.value = "Failed to update screen";
    throw error;
  } finally {
    isLoading.value = false;
  }
}

/**
 * Delete a screen via API
 */
async function DeleteScreen(screenId) {
  try {
    isLoading.value = true;
    apiError.value = null;
    
    let url = `${AppID}/public/_screens?where=id=${screenId}`;
    await DeleteDataFromAPI(url);
    
    // Remove from local state
    delete screens[screenId];
    
    // Update screen names list
    const updatedList = screenNamesList.value.filter(item => item.id !== screenId);
    screenNamesList.value = updatedList;
    
    // Remove from unsaved changes
    const currentUnsaved = new Set(unsavedScreens.value);
    currentUnsaved.delete(screenId);
    unsavedScreens.value = currentUnsaved;
    
    // If this was the active screen, clear it
    if (activeScreen.value === screenId) {
      activeScreen.value = "";
      activeScreenElements = {};
      activeElement.value = "";
    }
    
    console.log("Screen deleted successfully:", screenId);
    return true;
    
  } catch (error) {
    console.error("Error deleting screen:", error);
    apiError.value = "Failed to delete screen";
    throw error;
  } finally {
    isLoading.value = false;
  }
}

/**
 * Update only the currently active screen
 */
async function SyncActiveScreen() {
  const activeId = activeScreen.value;
  if (!activeId) {
    console.warn("No active screen to sync");
    return;
  }
  
  try {
    await UpdateScreen(activeId);
    console.log("Active screen synced successfully");
  } catch (error) {
    console.error("Failed to sync active screen:", error);
    throw error;
  }
}

/**
 * Sync all screens that have unsaved changes
 */
async function SyncAllUnsavedScreens() {
  const unsavedIds = Array.from(unsavedScreens.value);
  if (unsavedIds.length === 0) {
    console.log("No unsaved screens to sync");
    return;
  }
  
  try {
    const promises = unsavedIds.map(id => UpdateScreen(id));
    await Promise.all(promises);
    console.log("All unsaved screens synced successfully");
  } catch (error) {
    console.error("Failed to sync some screens:", error);
    throw error;
  }
}

/**
 * Set active screen elements based on current screen and design view
 */
function SetCurrentScreen(id) {
  const screenId = id
  activeScreen.value = screenId;
  const curScreen = screens[screenId];
  const designView = screenViewKey.peek();
  
  if (!curScreen) {
    activeScreenElements = {};
    return;
  }

  let elements = {};
  const mobileKey = 'mobile_children';
  const desktopKey = 'desktop_children';
  
  if (designView === DESIGN_VIEWS.SMARTPHONE) {
    elements = JSON.parse(JSON.stringify(curScreen[mobileKey] || {}));
    // Fallback to desktop if mobile is empty
    if (IsObjectEmpty(elements) && !IsObjectEmpty(curScreen[desktopKey])) {
      elements = JSON.parse(JSON.stringify(curScreen[desktopKey]));
      curScreen[mobileKey] = JSON.parse(JSON.stringify(elements));
      MarkScreenAsChanged(screenId);
    }
  } else {
    elements = JSON.parse(JSON.stringify(curScreen[desktopKey] || {}));
    // Fallback to mobile if desktop is empty
    if (IsObjectEmpty(elements) && !IsObjectEmpty(curScreen[mobileKey])) {
      elements = JSON.parse(JSON.stringify(curScreen[mobileKey]));
      curScreen[desktopKey] = JSON.parse(JSON.stringify(elements));
      MarkScreenAsChanged(screenId);
    }
  }

  // Convert to signals
  activeScreenElements = {};
  Object.entries(elements).forEach(([key, value]) => {
    activeScreenElements[key] = signal({ ...value });
  });

  screenElementAdded.value = screenId;
  screenElementsSorted.value = generateUID();
}

/**
 * Handle dropping elements into screen
 */
function handleDrop(data, parentId = null) {
  console.log("Called handle drop:", data, parentId);
  
  const elementId = generateUID();
  const { type, value: title } = data.data;
  
  if (type === "user_template") {
    HandleUserTemplateDrop(data);
    return;
  }
  
  let config = {};
  
  // Get element configuration
  if (type === "primitive") {
    config = JSON.parse(JSON.stringify(PrimitivesStylesMap[title] || {}));
  } else if (type === "container") {
    config = JSON.parse(JSON.stringify(ContainersStylesMap[title] || {}));
  }

  const newItem = {
    id: elementId,
    type: type,
    template: "element",
    title: title,
    parent_container: { ...CONTAINER_BOUNDS },
    parent: parentId,
    children: [],
    ...config,
  };

  AddChildrenToScreenElements([newItem], parentId);
}

/**
 * Handle user template drop
 */
function HandleUserTemplateDrop(data) {
  console.log("Called handle User Template Drop:", data);
  
  const innerData = data.data;
  const tempID = innerData.id;
  const myTemplate = JSON.parse(JSON.stringify(global_templates[tempID]));
  const myElement = data.dropElementData?.element;
  const currentView = screenViewKey.value;
  const key = currentView === DESIGN_VIEWS.SMARTPHONE ? "mobile_children" : "desktop_children";
  const elements = myTemplate[key] || {};
  const myElementArray = sortObjectByOrder(elements);
  const newElements = [];
  const idList = [];
  const newTempID = generateUID();
  
  myElementArray.forEach(curElement => {
    const newId = generateUID();
    curElement.id = newId;
    
    if (!curElement.parent || curElement.parent === "screen" || curElement.parent === "") {
      curElement.parent = newTempID;
    }
    
    idList.push(newId);
    newElements.push(curElement);
  });
  
  const parent = myElement !== "screen" ? myElement : null;
  
  const newTemplateObj = {
    id: newTempID,
    type: "user_template",
    template: "user_template",
    title: "user_template",
    parent_container: { ...CONTAINER_BOUNDS },
    parent: parent,
    children: [...idList],
    configs: {
      style: {},
      data_source: {},
      onClick: { actions: [], code: "" },
      onDoubleClick: { actions: [], code: "" },
      onHover: { actions: [], code: "" },
      onHoverEnter: { actions: [], code: "" },
      onHoverLeave: { actions: [], code: "" },
      valueCode: { actions: [], code: "" },
      childrenCode: { actions: [], code: "" },
    },
  };

  const newArray = [newTemplateObj, ...newElements];
  console.log("New array:", newArray);
  AddChildrenToScreenElements(newArray, myElement);
}

/**
 * Add children to screen elements
 */
function AddChildrenToScreenElements(newItems, parentId) {
  if (!newItems) return;
  
  newItems.forEach(newItem => {
    if (parentId !== null && parentId !== "screen") {
      const parentElement = activeScreenElements[parentId];
      if (parentElement) {
        parentElement.value.children.push(newItem.id);
        newItem.parent = parentId;
        activeScreenElements[newItem.id] = signal(newItem);
        // Trigger reactivity
        activeScreenElements[parentId].value = { ...parentElement.value };
      }
    } else {
      const curLength = Object.keys(activeScreenElements).length + 1;
      newItem.order = curLength;
      activeScreenElements[newItem.id] = signal(newItem);
    }
  });

  // Update screen and mark as changed
  const screenId = activeScreen.value;
  if (screenId && screens[screenId]) {
    const key = screenViewKey.peek() === DESIGN_VIEWS.SMARTPHONE ? 'mobile_children' : 'desktop_children';
    screens[screenId][key] = SerializeActiveElements();
    MarkScreenAsChanged(screenId);
  }

  screenElementAdded.value = generateUID();
  screenElementsSorted.value = generateUID();
  
  console.log("Elements added to screen");
}

/**
 * Delete screen element
 */
function DeleteScreenElement(elementId) {
  console.log("Deleting element:", elementId);
  
  if (!activeScreenElements[elementId]) {
    console.warn("Element not found:", elementId);
    return;
  }

  // Remove element
  delete activeScreenElements[elementId];

  // Remove from parent's children arrays
  Object.values(activeScreenElements).forEach(elementSignal => {
    const element = elementSignal.value;
    if (element.children && element.children.includes(elementId)) {
      element.children = element.children.filter(childId => childId !== elementId);
      elementSignal.value = { ...element };
    }
  });

  // Update screen and mark as changed
  const screenId = activeScreen.value;
  if (screenId && screens[screenId]) {
    const key = screenViewKey.value === DESIGN_VIEWS.SMARTPHONE ? 'mobile_children' : 'desktop_children';
    screens[screenId][key] = SerializeActiveElements();
    MarkScreenAsChanged(screenId);
  }

  screenElementAdded.value = generateUID();
  screenElementsSorted.value = generateUID();
}

/**
 * Mark screen as having unsaved changes
 */
function MarkScreenAsChanged(screenId) {
  const currentUnsaved = new Set(unsavedScreens.value);
  currentUnsaved.add(screenId);
  unsavedScreens.value = currentUnsaved;
}

/**
 * Check if screen has unsaved changes
 */
function HasUnsavedChanges(screenId) {
  return unsavedScreens.value.has(screenId);
}

/**
 * Serialize active elements to plain objects
 */
function SerializeActiveElements() {
  const serialized = {};
  Object.entries(activeScreenElements).forEach(([key, signal]) => {
    serialized[key] = signal.value;
  });
  return serialized;
}

/**
 * Utility function to check if object is empty
 */
function IsObjectEmpty(object) {
  return !object || Object.keys(object).length === 0;
}

// Export all functions and signals
export {
  // State
  screens,
  screenNamesList,
  tabDataSignal,
  tabSignal,
  activeTab,
  activeConfigTab,
  isHoveredSignal,
  activeElement,
  activeScreen,
  screenViewKey,
  screenLeftTabSignal,
  activeScreenElements,
  screenElementAdded,
  screenElementsSorted,
  isScreenChanged,
  unsavedScreens,
  isLoading,
  apiError,
  
  // CRUD Operations
  LoadScreens,
  UpdateScreen,
  DeleteScreen,
  SyncActiveScreen,
  SyncAllUnsavedScreens,
  
  // Screen Management
  SetCurrentScreen,
  HandleUserTemplateDrop,
  AddChildrenToScreenElements,
  DeleteScreenElement,
  MarkScreenAsChanged,
  HasUnsavedChanges,
  handleDrop,
  CreatenewScreen,

  // Constants
  DESIGN_VIEWS
};