// form_state.js
import { signal } from "@preact/signals";
import { generateUID } from "../utils/helpers";
import { GetDataFromAPi, CreateDataToAPI, UpdateDataToAPI, DeleteDataFromAPI } from "../api/api_syncerv2";
import { AppID } from "../states/global_state";
import { fieldConfigs } from "./configs/form_configs";
import { AddChildren, AddFormField, DeleteFormField } from "./utilities";

// State Management
let forms = {};
const formLeftNamesList = signal([]);
const currentForm = signal("");
const currentFormConfig = signal({});
const formRenderSignal = signal("");

// UI State
const formBuilderView = signal("smartphone");
const formActiveElement = signal("");
const activeTab = signal('Basic');
const formActiveLeftTab = signal("forms");

// Track which forms have unsaved changes
const unsavedForms = signal(new Set());
const isLoading = signal(false);
const apiError = signal(null);

// Default form structure
const DEFAULT_FORM_STRUCTURE = {
  form_name: "",
  order: 0,
  mobile_style: {
    display: "flex",
    flexDirection: "column",
    minHeight: "200px",
    minWidth: "150px",
    height: "100%",
    width: "100%"
  },
  desktop_style: {
    display: "flex",
    flexDirection: "column",
    minHeight: "200px",
    minWidth: "150px",
    height: "100%",
    width: "100%"
  },
  mobile_children: {},
  desktop_children: {},
  fields: [],
  "submit_actions": {},
  "next_actions": {},
  "previous_actions": {},
};

/**
 * Load all forms from API
 */
async function LoadForms() {
  try {
    isLoading.value = true;
    apiError.value = null;
    let url = `${AppID.value}/public/_forms`;
    const response = await GetDataFromAPi(url);
    console.log("Loaded forms:", response);

    if (!response || response.length === 0) {
      console.log("No forms found");
      forms = {};
      formLeftNamesList.value = [];
      return;
    }

    const formNames = [];
    const formsMap = {};

    response.forEach(form => {
      const formData = {
        ...DEFAULT_FORM_STRUCTURE,
        ...form.configs,
        id: form.id
      };
      
      formsMap[form.id] = formData;
      formNames.push({
        name: formData.form_name,
        id: form.id,
        order: formData.order || 0
      });
    });

    // Sort by order
    formNames.sort((a, b) => a.order - b.order);
    
    formLeftNamesList.value = formNames;
    forms = formsMap;
    
    // Clear unsaved changes after successful load
    unsavedForms.value = new Set();
    
    // Set first form as active if none selected
    if (formNames.length > 0 && !currentForm.value) {
      setCurrentForm(formNames[0].id);
    }
    
  } catch (error) {
    console.error("Error loading forms:", error);
    apiError.value = "Failed to load forms";
  } finally {
    isLoading.value = false;
  }
}

/**
 * Create a new form via API
 */
async function CreateNewForm(formData) {
  try {
    isLoading.value = true;
    apiError.value = null;
    
    const newFormData = {
      configs: {
        ...DEFAULT_FORM_STRUCTURE,
        form_name: formData.name,
        order: Object.keys(forms).length + 1
      }
    };

    // Make API call to create form
    let url = `${AppID.value}/public/_forms`;
    const response = await CreateDataToAPI(url, newFormData);
    
    if (response && response.id) {
      // Add to local state with server-generated ID
      const newForm = {
        ...newFormData.configs,
        id: response.id
      };
      
      forms[response.id] = newForm;
      
      // Update form names list
      const existingList = formLeftNamesList.peek();
      formLeftNamesList.value = [
        ...existingList,
        { name: formData.name, id: response.id, order: newForm.order }
      ];
      
      // Set as active form
      setCurrentForm(response.id);
      
      console.log("Form created successfully:", response.id);
      return response.id;
    } else {
      throw new Error("Invalid response from server");
    }
    
  } catch (error) {
    console.error("Error creating form:", error);
    apiError.value = "Failed to create form";
    throw error;
  } finally {
    isLoading.value = false;
  }
}

/**
 * Update a specific form via API
 */
async function UpdateForm(formId) {
  try {
    isLoading.value = true;
    apiError.value = null;
    
    const form = forms[formId];
    if (!form) {
      throw new Error("Form not found");
    }

    const updateData = {
      configs: {
        ...form
      }
    };
    
    let url = `${AppID.value}/public/_forms?where=id=${formId}`;
    await UpdateDataToAPI(url, updateData);
    
    // Remove from unsaved changes
    const currentUnsaved = new Set(unsavedForms.value);
    currentUnsaved.delete(formId);
    unsavedForms.value = currentUnsaved;
    
    console.log("Form updated successfully:", formId);
    return true;
    
  } catch (error) {
    console.error("Error updating form:", error);
    apiError.value = "Failed to update form";
    throw error;
  } finally {
    isLoading.value = false;
  }
}

/**
 * Delete a form via API
 */
async function DeleteForm(formId) {
  try {
    isLoading.value = true;
    apiError.value = null;
    let url = `${AppID.value}/public/_forms?where=id=${formId}`;
    await DeleteDataFromAPI(url);
    
    // Remove from local state
    delete forms[formId];
    
    // Update form names list
    const updatedList = formLeftNamesList.value.filter(item => item.id !== formId);
    formLeftNamesList.value = updatedList;
    
    // Remove from unsaved changes
    const currentUnsaved = new Set(unsavedForms.value);
    currentUnsaved.delete(formId);
    unsavedForms.value = currentUnsaved;
    
    // If this was the active form, set new active or clear
    if (currentForm.value === formId) {
      const remainingForms = formLeftNamesList.value;
      if (remainingForms.length > 0) {
        setCurrentForm(remainingForms[0].id);
      } else {
        currentForm.value = "";
        currentFormConfig.value = {};
      }
    }
    
    console.log("Form deleted successfully:", formId);
    return true;
    
  } catch (error) {
    console.error("Error deleting form:", error);
    apiError.value = "Failed to delete form";
    throw error;
  } finally {
    isLoading.value = false;
  }
}

/**
 * Update only the currently active form
 */
async function SyncActiveForm() {
  const activeId = currentForm.value;
  if (!activeId) {
    console.warn("No active form to sync");
    return;
  }
  
  try {
    await UpdateForm(activeId);
    console.log("Active form synced successfully");
  } catch (error) {
    console.error("Failed to sync active form:", error);
    throw error;
  }
}

/**
 * Sync all forms that have unsaved changes
 */
async function SyncAllUnsavedForms() {
  const unsavedIds = Array.from(unsavedForms.value);
  if (unsavedIds.length === 0) {
    console.log("No unsaved forms to sync");
    return;
  }
  
  try {
    const promises = unsavedIds.map(id => UpdateForm(id));
    await Promise.all(promises);
    console.log("All unsaved forms synced successfully");
  } catch (error) {
    console.error("Failed to sync some forms:", error);
    throw error;
  }
}

/**
 * Set current form and load its data based on view
 */
function setCurrentForm(formId) {
  if (!formId || !forms[formId]) {
    console.warn("Form not found:", formId);
    return;
  }
  
  const myform = forms[formId];
  currentForm.value = formId;
  
  // Set children based on current view
  SwapChildrenBasedonView(formBuilderView.value);
  
  formRenderSignal.value = formId;
  console.log("Active form set:", formId);
}

/**
 * Swap children based on view (smartphone/desktop)
 */
function SwapChildrenBasedonView(formView) {
  const curForm = forms[currentForm.peek()];
  console.log("currentform:", curForm, formView);
  
  if (curForm === undefined) {
    return;
  }
  
  let finalElements = {};
  let viewName = "";
  
  if (formView === "smartphone") {
    let mobileChildren = curForm["mobile_children"];
    if (!mobileChildren || Object.keys(mobileChildren).length === 0) {
      let deskchildren = curForm["desktop_children"];
      if (deskchildren && Object.keys(deskchildren).length > 0) {
        mobileChildren = deskchildren;
      } else {
        mobileChildren = {};
      }
    }
    finalElements = JSON.parse(JSON.stringify(mobileChildren));
    viewName = "mobile_children";
  } else {
    let deskChildren = curForm["desktop_children"];
    if (!deskChildren || Object.keys(deskChildren).length === 0) {
      let mobileChildren = curForm["mobile_children"];
      if (mobileChildren && Object.keys(mobileChildren).length > 0) {
        deskChildren = mobileChildren;
      } else {
        deskChildren = {};
      }
    }
    finalElements = JSON.parse(JSON.stringify(deskChildren));
    viewName = "desktop_children";
  }
  
  // Update form data and mark as changed
  curForm[viewName] = finalElements;
  MarkFormAsChanged(currentForm.value);
  forms[currentForm.value] = curForm;
  
  currentFormConfig.value = { ...finalElements };
}

/**
 * Add element to form
 */
function AddtoElements(data) {
  console.log("add to element called:", data);
  
  const fieldData = data["data"];
  const formName = data["dropElementData"]["id"];
  const newid = generateUID();
  const existing = currentFormConfig.value;
  const fields = existing["fields"] || [];
  const length = fields.length;
  const commonConfig = JSON.parse(JSON.stringify(fieldConfigs[fieldData[1]]));
  
  const elementData = {
    "type": fieldData[1],
    "id": newid,
    "parent": formName,
    "children": [],
    "order": length,
    ...commonConfig,
  };
  
  let newfields = AddFormField(fields, elementData);
  if (formName !== "screen") {
    newfields = AddChildren(newfields, formName, [newid]);
  }
  
  existing["fields"] = newfields;
  currentFormConfig.value = { ...existing };
  formRenderSignal.value = generateUID();
  
  // Update the form in memory and mark as changed
  const currForm = forms[currentForm.peek()];
  if (formBuilderView.peek() === "smartphone") {
    const copy = JSON.parse(JSON.stringify(existing));
    currForm["mobile_children"] = { ...copy };
  } else {
    const copy = JSON.parse(JSON.stringify(existing));
    currForm["desktop_children"] = { ...copy };
  }
  
  MarkFormAsChanged(currentForm.peek());
  forms[currentForm.peek()] = currForm;
}

/**
 * Delete form element
 */
function DeleteFormElement(id) {
  console.log("called delete from element:", id);
  
  const fields = currentFormConfig.value["fields"];
  if (fields === undefined) {
    return;
  }
  
  const temp = currentFormConfig.value;
  const newfields = DeleteFormField(fields, id);
  const obj = { "fields": newfields };

  currentFormConfig.value = { ...temp, ...obj };
  formRenderSignal.value = generateUID();
  
  // Update form and mark as changed
  MarkFormAsChanged(currentForm.value);
  const key = formBuilderView.value === "smartphone" ? "mobile_children" : "desktop_children";
  forms[currentForm.value][key] = JSON.parse(JSON.stringify(currentFormConfig.value));
}

/**
 * Set current form config
 */
function setCurrentElements(newElements) {
  currentFormConfig.value = { ...newElements };
  
  // Update form and mark as changed
  const currForm = forms[currentForm.value];
  if (currForm) {
    const key = formBuilderView.value === "smartphone" ? "mobile_children" : "desktop_children";
    currForm[key] = JSON.parse(JSON.stringify(newElements));
    MarkFormAsChanged(currentForm.value);
    forms[currentForm.value] = currForm;
  }
}

/**
 * Mark form as having unsaved changes
 */
function MarkFormAsChanged(formId) {
  const currentUnsaved = new Set(unsavedForms.value);
  currentUnsaved.add(formId);
  unsavedForms.value = currentUnsaved;
}

/**
 * Check if form has unsaved changes
 */
function HasUnsavedChanges(formId) {
  return unsavedForms.value.has(formId);
}

/**
 * Get form by ID
 */
function GetFormByID(formId) {
  return forms[formId] ? { ...forms[formId] } : null;
}

/**
 * Duplicate an existing form
 */
async function DuplicateForm(sourceFormId) {
  const sourceForm = forms[sourceFormId];
  if (!sourceForm) {
    throw new Error("Source form not found");
  }
  
  const duplicateData = {
    name: `${sourceForm.form_name} (Copy)`,
    ...sourceForm,
    id: undefined // Will be generated by server
  };
  
  return CreateNewForm(duplicateData);
}

/**
 * Reorder forms
 */
async function ReorderForms(newOrder) {
  try {
    // Update local order
    newOrder.forEach((item, index) => {
      if (forms[item.id]) {
        forms[item.id].order = index;
        MarkFormAsChanged(item.id);
      }
    });
    
    // Update the names list
    formLeftNamesList.value = newOrder.map((item, index) => ({
      ...item,
      order: index
    }));
    
    console.log("Forms reordered");
  } catch (error) {
    console.error("Error reordering forms:", error);
    throw error;
  }
}

// Export all functions and signals
export {
  // State
  forms,
  formLeftNamesList,
  currentForm,
  currentFormConfig,
  formRenderSignal,
  unsavedForms,
  isLoading,
  apiError,
  
  // UI State
  formBuilderView,
  formActiveElement,
  activeTab,
  formActiveLeftTab,
  
  // CRUD Operations
  LoadForms,
  CreateNewForm,
  UpdateForm,
  DeleteForm,
  SyncActiveForm,
  SyncAllUnsavedForms,
  
  // Form Management
  setCurrentForm,
  SwapChildrenBasedonView,
  AddtoElements,
  DeleteFormElement,
  setCurrentElements,
  MarkFormAsChanged,
  HasUnsavedChanges,
  GetFormByID,
  DuplicateForm,
  ReorderForms
};