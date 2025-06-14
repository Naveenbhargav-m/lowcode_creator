// templates_state.js
import { signal } from "@preact/signals";
import { generateUID } from "../utils/helpers";
import { PrimitivesStylesMap } from "../components/primitives/primitives_base_styles";
import { ContainersStylesMap } from "../components/containers/containers_bse_styles";
import { GetDataFromAPi, CreateDataToAPI, UpdateDataToAPI, DeleteDataFromAPI } from "../api/api_syncerv2";
import { AppID } from "../states/global_state";

// Constants
const CONTAINER_BOUNDS = { height: 0, width: 0 };
const DESIGN_VIEWS = {
  SMARTPHONE: "smartphone",
  DESKTOP: "desktop"
};

// State Management
let templates = {};
const templateNamesList = signal([]);
const templatesPagesSignal = signal("components");
const activeTamplate = signal("");
const templateDesignView = signal(DESIGN_VIEWS.SMARTPHONE);
let activeTemplateElements = {};
const activeTemplateElement = signal("");
const templateRightPanelActiveTab = signal("Basic");
const isTemplateChanged = signal("");
const TemplateSorted = signal("");

// Track which templates have unsaved changes
const unsavedTemplates = signal(new Set());
const isLoading = signal(false);
const apiError = signal(null);

/**
 * Load all templates from API
 */
async function LoadTemplates() {
  try {
    isLoading.value = true;
    apiError.value = null;
    let url = `${AppID}/public/_templates`;
    const response = await GetDataFromAPi(url);
    console.log("Loaded templates:", response);

    if (!response || response.length === 0) {
      console.log("No templates found");
      templates = {};
      templateNamesList.value = [];
      return;
    }

    const tempNames = [];
    const screensMap = {};

    response.forEach(template => {
      screensMap[template.id] = {
        ...template.configs,
        id: template.id,
        template_name: template.template_name
      };
      tempNames.push({
        name: template.template_name,
        id: template.id,
        order: template.configs?.order || 0
      });
    });

    // Sort by order
    tempNames.sort((a, b) => a.order - b.order);
    
    templateNamesList.value = tempNames;
    templates = screensMap;
    
    // Clear unsaved changes after successful load
    unsavedTemplates.value = new Set();
    
  } catch (error) {
    console.error("Error loading templates:", error);
    apiError.value = "Failed to load templates";
  } finally {
    isLoading.value = false;
  }
}

/**
 * Create a new template via API
 */
async function CreateTemplate(formData) {
  try {
    isLoading.value = true;
    apiError.value = null;
    
    const templateData = {
      template_name: formData.name,
      configs: {
        name: formData.name,
        order: Object.keys(templates).length + 1,
        mobile_children: {},
        desktop_children: {},
        data_source: {},
      }
    };

    // Make API call to create template
    let url = `${AppID}/public/_templates`;
    const response = await CreateDataToAPI(url, templateData);
    
    if (response && response.id) {
      // Add to local state with server-generated ID
      const newTemplate = {
        ...templateData.configs,
        id: response.id,
        template_name: formData.name
      };
      
      templates[response.id] = newTemplate;
      
      // Update template names list
      const existingList = templateNamesList.peek();
      templateNamesList.value = [
        ...existingList,
        { name: formData.name, id: response.id, order: newTemplate.order }
      ];
      
      // Set as active template
      activeTamplate.value = response.id;
      SetTemplateActiveElements();
      
      console.log("Template created successfully:", response.id);
      return response.id;
    } else {
      throw new Error("Invalid response from server");
    }
    
  } catch (error) {
    console.error("Error creating template:", error);
    apiError.value = "Failed to create template";
    throw error;
  } finally {
    isLoading.value = false;
  }
}

/**
 * Update a specific template via API
 */
async function UpdateTemplate(templateId) {
  try {
    isLoading.value = true;
    apiError.value = null;
    
    const template = templates[templateId];
    if (!template) {
      throw new Error("Template not found");
    }

    const updateData = {
      template_name: template.template_name || template.name,
      configs: {
        ...template,
        // Ensure we're saving the current active elements if this is the active template
        ...(templateId === activeTamplate.value && {
          [templateDesignView.value === DESIGN_VIEWS.SMARTPHONE ? 'mobile_children' : 'desktop_children']: 
            SerializeActiveElements()
        })
      }
    };
    let url = `${AppID}/public/_templates?where=id=${templateId}`;
    await UpdateDataToAPI(url, updateData);
    
    // Remove from unsaved changes
    const currentUnsaved = new Set(unsavedTemplates.value);
    currentUnsaved.delete(templateId);
    unsavedTemplates.value = currentUnsaved;
    
    console.log("Template updated successfully:", templateId);
    return true;
    
  } catch (error) {
    console.error("Error updating template:", error);
    apiError.value = "Failed to update template";
    throw error;
  } finally {
    isLoading.value = false;
  }
}

/**
 * Delete a template via API
 */
async function DeleteTemplate(templateId) {
  try {
    isLoading.value = true;
    apiError.value = null;
    let url = `${AppID}/public/_templates?where=id=${templateId}`;
    await DeleteDataFromAPI(url);
    
    // Remove from local state
    delete templates[templateId];
    
    // Update template names list
    const updatedList = templateNamesList.value.filter(item => item.id !== templateId);
    templateNamesList.value = updatedList;
    
    // Remove from unsaved changes
    const currentUnsaved = new Set(unsavedTemplates.value);
    currentUnsaved.delete(templateId);
    unsavedTemplates.value = currentUnsaved;
    
    // If this was the active template, clear it
    if (activeTamplate.value === templateId) {
      activeTamplate.value = "";
      activeTemplateElements = {};
      activeTemplateElement.value = "";
    }
    
    console.log("Template deleted successfully:", templateId);
    return true;
    
  } catch (error) {
    console.error("Error deleting template:", error);
    apiError.value = "Failed to delete template";
    throw error;
  } finally {
    isLoading.value = false;
  }
}

/**
 * Update only the currently active template
 */
async function SyncActiveTemplate() {
  const activeId = activeTamplate.value;
  if (!activeId) {
    console.warn("No active template to sync");
    return;
  }
  
  try {
    await UpdateTemplate(activeId);
    console.log("Active template synced successfully");
  } catch (error) {
    console.error("Failed to sync active template:", error);
    throw error;
  }
}

/**
 * Sync all templates that have unsaved changes
 */
async function SyncAllUnsavedTemplates() {
  const unsavedIds = Array.from(unsavedTemplates.value);
  if (unsavedIds.length === 0) {
    console.log("No unsaved templates to sync");
    return;
  }
  
  try {
    const promises = unsavedIds.map(id => UpdateTemplate(id));
    await Promise.all(promises);
    console.log("All unsaved templates synced successfully");
  } catch (error) {
    console.error("Failed to sync some templates:", error);
    throw error;
  }
}

/**
 * Set active template elements based on current template and design view
 */
function SetTemplateActiveElements() {
  const templateID = activeTamplate.peek();
  const curTemplate = templates[templateID];
  const designView = templateDesignView.peek();
  
  if (!curTemplate) {
    activeTemplateElements = {};
    return;
  }

  let elements = {};
  const mobileKey = 'mobile_children';
  const desktopKey = 'desktop_children';
  
  if (designView === DESIGN_VIEWS.SMARTPHONE) {
    elements = JSON.parse(JSON.stringify(curTemplate[mobileKey] || {}));
    // Fallback to desktop if mobile is empty
    if (IsObjectEmpty(elements) && !IsObjectEmpty(curTemplate[desktopKey])) {
      elements = JSON.parse(JSON.stringify(curTemplate[desktopKey]));
      curTemplate[mobileKey] = JSON.parse(JSON.stringify(elements));
      MarkTemplateAsChanged(templateID);
    }
  } else {
    elements = JSON.parse(JSON.stringify(curTemplate[desktopKey] || {}));
    // Fallback to mobile if desktop is empty
    if (IsObjectEmpty(elements) && !IsObjectEmpty(curTemplate[mobileKey])) {
      elements = JSON.parse(JSON.stringify(curTemplate[mobileKey]));
      curTemplate[desktopKey] = JSON.parse(JSON.stringify(elements));
      MarkTemplateAsChanged(templateID);
    }
  }

  // Convert to signals
  activeTemplateElements = {};
  Object.entries(elements).forEach(([key, value]) => {
    activeTemplateElements[key] = signal({ ...value });
  });

  isTemplateChanged.value = templateID;
  TemplateSorted.value = generateUID();
}

/**
 * Handle dropping elements into template
 */
function HandleTemplateDrop(data, parentId = null) {
  console.log("Handle drop:", data, parentId);
  
  const elementId = generateUID();
  const { type, value: title } = data.data;
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

  // Add to parent or root level
  if (parentId !== null) {
    const parentElement = activeTemplateElements[parentId];
    if (parentElement) {
      parentElement.value.children.push(elementId);
      newItem.parent = parentId;
      activeTemplateElements[elementId] = signal(newItem);
      // Trigger reactivity
      activeTemplateElements[parentId].value = { ...parentElement.value };
    }
  } else {
    const curLength = Object.keys(activeTemplateElements).length + 1;
    // @ts-ignore
    newItem.order = curLength;
    activeTemplateElements[elementId] = signal(newItem);
  }

  // Update template and mark as changed
  const templateId = activeTamplate.value;
  if (templateId && templates[templateId]) {
    const key = templateDesignView.peek() === DESIGN_VIEWS.SMARTPHONE ? 'mobile_children' : 'desktop_children';
    templates[templateId][key] = SerializeActiveElements();
    MarkTemplateAsChanged(templateId);
  }

  isTemplateChanged.value = elementId;
  TemplateSorted.value = elementId;
  
  console.log("Element added to template");
}

/**
 * Delete template elements
 */
function DeleteTemplateElements(elementId) {
  console.log("Deleting element:", elementId);
  
  if (!activeTemplateElements[elementId]) {
    console.warn("Element not found:", elementId);
    return;
  }

  // Remove element
  delete activeTemplateElements[elementId];

  // Remove from parent's children arrays
  Object.values(activeTemplateElements).forEach(elementSignal => {
    const element = elementSignal.value;
    if (element.children && element.children.includes(elementId)) {
      element.children = element.children.filter(childId => childId !== elementId);
      elementSignal.value = { ...element };
    }
  });

  // Update template and mark as changed
  const templateId = activeTamplate.value;
  if (templateId && templates[templateId]) {
    const key = templateDesignView.value === DESIGN_VIEWS.SMARTPHONE ? 'mobile_children' : 'desktop_children';
    templates[templateId][key] = SerializeActiveElements();
    MarkTemplateAsChanged(templateId);
  }

  isTemplateChanged.value = generateUID();
  TemplateSorted.value = generateUID();
}

/**
 * Mark template as having unsaved changes
 */
function MarkTemplateAsChanged(templateId) {
  const currentUnsaved = new Set(unsavedTemplates.value);
  currentUnsaved.add(templateId);
  unsavedTemplates.value = currentUnsaved;
}

/**
 * Check if template has unsaved changes
 */
function HasUnsavedChanges(templateId) {
  return unsavedTemplates.value.has(templateId);
}

/**
 * Serialize active elements to plain objects
 */
function SerializeActiveElements() {
  const serialized = {};
  Object.entries(activeTemplateElements).forEach(([key, signal]) => {
    serialized[key] = signal.value;
  });
  return serialized;
}

/**
 * Get template by ID for screen builder
 */
function GetScreenTamplateByID(templateID) {
  const template = JSON.parse(JSON.stringify(templates[templateID] || {}));
  template.is_template = true;
  return template;
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
  templates,
  templateNamesList,
  templatesPagesSignal,
  templateRightPanelActiveTab,
  activeTamplate,
  templateDesignView,
  activeTemplateElements,
  isTemplateChanged,
  activeTemplateElement,
  TemplateSorted,
  unsavedTemplates,
  isLoading,
  apiError,
  
  // CRUD Operations
  LoadTemplates,
  CreateTemplate,
  UpdateTemplate,
  DeleteTemplate,
  SyncActiveTemplate,
  SyncAllUnsavedTemplates,
  
  // Template Management
  SetTemplateActiveElements,
  HandleTemplateDrop,
  DeleteTemplateElements,
  GetScreenTamplateByID,
  MarkTemplateAsChanged,
  HasUnsavedChanges,
  
  // Constants
  DESIGN_VIEWS
};