import { 
    data_map_v2, 
    fieldsMap, 
    global_queries, 
    global_workflows, 
    global_forms, 
    global_screens, 
    global_templates, 
    global_tables, 
    global_views 
} from './global_repo';

// =====================================================
// HELPER FUNCTIONS FOR DATA MANAGEMENT
// =====================================================

/**
 * Get block names only for a specific type
 * @param {string} type - Type of block (queries, workflows, forms, screens, templates, tables, views)
 * @returns {Array} Array of objects with standardized structure
 */
export function getBlockNames(type) {
    try {
        if (!data_map_v2 || !data_map_v2[type]) {
            console.warn(`Type '${type}' not found in data_map_v2`);
            return [];
        }

        return data_map_v2[type].list.map(item => ({
            id: item.id,
            name: item.name,
            value: item.id,
            label: item.name,
            required: false,
            type: type
        }));
    } catch (error) {
        console.error(`Error getting block names for type '${type}':`, error);
        return [];
    }
}

/**
 * Get block details with input fields for a specific type and id
 * @param {string} type - Type of block
 * @param {string} id - ID of the specific block
 * @returns {Object} Object with block info and input fields
 */
export function getBlockWithInputs(type, id) {
    try {
        if (!data_map_v2 || !data_map_v2[type] || !data_map_v2[type].map[id]) {
            console.warn(`Block '${id}' of type '${type}' not found`);
            return null;
        }

        const blockInfo = data_map_v2[type].map[id];
        let inputFields = [];

        // Get input fields based on type
        switch (type) {
            case 'queries':
                inputFields = getQueryInputs(id);
                break;
            case 'workflows':
                inputFields = getWorkflowInputs(id);
                break;
            case 'forms':
                inputFields = getFormFields(id);
                break;
            case 'tables':
                inputFields = getTableFields(id);
                break;
            case 'screens':
                inputFields = getScreenFields(id);
                break;
            case 'templates':
                inputFields = getTemplateFields(id);
                break;
            case 'views':
                inputFields = getViewFields(id);
                break;
            default:
                inputFields = [];
        }

        return {
            id: blockInfo.id,
            name: blockInfo.name,
            value: blockInfo.id,
            label: blockInfo.name,
            required: false,
            type: type,
            inputs: inputFields,
            raw_data: blockInfo.raw_data
        };
    } catch (error) {
        console.error(`Error getting block with inputs for '${type}' - '${id}':`, error);
        return null;
    }
}

/**
 * Get all available types
 * @returns {Array} Array of available data types
 */
export function getAvailableTypes() {
    return ['queries', 'workflows', 'forms', 'tables', 'screens', 'templates', 'views'];
}

/**
 * Get summary of all data
 * @returns {Object} Summary object with counts for each type
 */
export function getDataSummary() {
    const summary = {};
    getAvailableTypes().forEach(type => {
        summary[type] = {
            count: data_map_v2[type]?.count || 0,
            items: getBlockNames(type)
        };
    });
    return summary;
}

/**
 * Search blocks across all types or specific type
 * @param {string} searchTerm - Term to search for
 * @param {string} type - Optional: specific type to search in
 * @returns {Array} Array of matching blocks
 */
export function searchBlocks(searchTerm, type = null) {
    const results = [];
    const searchTypes = type ? [type] : getAvailableTypes();
    
    searchTypes.forEach(searchType => {
        const blocks = getBlockNames(searchType);
        const matches = blocks.filter(block => 
            block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            block.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        results.push(...matches);
    });
    
    return results;
}

// =====================================================
// SPECIFIC INPUT FIELD EXTRACTORS
// =====================================================

function getQueryInputs(queryId) {
    try {
        if (fieldsMap.queries && fieldsMap.queries[queryId]) {
            return fieldsMap.queries[queryId];
        }
        
        // Fallback to global_queries
        const query = global_queries[queryId];
        if (query && query.input_params) {
            return query.input_params.map(param => ({
                id: param,
                name: param,
                value: param,
                label: param,
                required: false
            }));
        }
        return [];
    } catch (error) {
        console.error(`Error getting query inputs for '${queryId}':`, error);
        return [];
    }
}

function getWorkflowInputs(workflowId) {
    try {
        if (fieldsMap.workflows && fieldsMap.workflows[workflowId]) {
            return fieldsMap.workflows[workflowId];
        }
        
        // Fallback to global_workflows
        const workflow = global_workflows[workflowId];
        if (workflow && workflow.inputs) {
            return workflow.inputs.map(input => ({
                id: input,
                name: input,
                value: input,
                label: input,
                required: false
            }));
        }
        return [];
    } catch (error) {
        console.error(`Error getting workflow inputs for '${workflowId}':`, error);
        return [];
    }
}

function getFormFields(formId) {
    try {
        if (fieldsMap.forms && fieldsMap.forms[formId]) {
            return fieldsMap.forms[formId];
        }
        
        // Fallback to global_forms
        const form = global_forms[formId];
        if (form && form.mobile_children) {
            return form.mobile_children.map(field => ({
                id: field.id || field.name || field,
                name: field.name || field,
                value: field.id || field.name || field,
                label: field.label || field.name || field,
                required: field.required || false
            }));
        }
        return [];
    } catch (error) {
        console.error(`Error getting form fields for '${formId}':`, error);
        return [];
    }
}

function getTableFields(tableName) {
    try {
        if (fieldsMap.tables && fieldsMap.tables[tableName]) {
            return fieldsMap.tables[tableName];
        }
        
        // Fallback to global_tables
        const table = global_tables[tableName];
        if (table && table.fields) {
            return table.fields.map(field => ({
                id: field.name || field,
                name: field.name || field,
                value: field.name || field,
                label: field.label || field.name || field,
                required: false
            }));
        }
        return [];
    } catch (error) {
        console.error(`Error getting table fields for '${tableName}':`, error);
        return [];
    }
}

function getScreenFields(screenId) {
    try {
        const screen = global_screens[screenId];
        if (screen && screen.components) {
            return screen.components.map(component => ({
                id: component.id || component.name,
                name: component.name || component.id,
                value: component.id || component.name,
                label: component.label || component.name || component.id,
                required: false
            }));
        }
        return [];
    } catch (error) {
        console.error(`Error getting screen fields for '${screenId}':`, error);
        return [];
    }
}

function getTemplateFields(templateId) {
    try {
        const template = global_templates[templateId];
        if (template && template.fields) {
            return template.fields.map(field => ({
                id: field.id || field.name,
                name: field.name || field.id,
                value: field.id || field.name,
                label: field.label || field.name || field.id,
                required: field.required || false
            }));
        }
        return [];
    } catch (error) {
        console.error(`Error getting template fields for '${templateId}':`, error);
        return [];
    }
}

function getViewFields(viewId) {
    try {
        const view = global_views[viewId];
        if (view && view.fields) {
            return view.fields.map(field => ({
                id: field.id || field.name,
                name: field.name || field.id,
                value: field.id || field.name,
                label: field.label || field.name || field.id,
                required: false
            }));
        }
        return [];
    } catch (error) {
        console.error(`Error getting view fields for '${viewId}':`, error);
        return [];
    }
}

// =====================================================
// ADVANCED HELPER FUNCTIONS
// =====================================================

/**
 * Get field mapping for cross-references
 * @param {string} sourceType - Source type
 * @param {string} sourceId - Source ID
 * @param {string} targetType - Target type
 * @param {string} targetId - Target ID
 * @returns {Object} Mapping possibilities
 */
export function getFieldMapping(sourceType, sourceId, targetType, targetId) {
    const sourceBlock = getBlockWithInputs(sourceType, sourceId);
    const targetBlock = getBlockWithInputs(targetType, targetId);
    
    if (!sourceBlock || !targetBlock) {
        return { mapping: [], suggestions: [] };
    }
    
    const suggestions = [];
    sourceBlock.inputs.forEach(sourceField => {
        const matches = targetBlock.inputs.filter(targetField => 
            targetField.name.toLowerCase() === sourceField.name.toLowerCase() ||
            targetField.id.toLowerCase() === sourceField.id.toLowerCase()
        );
        
        if (matches.length > 0) {
            suggestions.push({
                source: sourceField,
                targets: matches
            });
        }
    });
    
    return {
        mapping: {
            source: sourceBlock,
            target: targetBlock
        },
        suggestions
    };
}

/**
 * Validate field requirements
 * @param {string} type - Block type
 * @param {string} id - Block ID
 * @param {Object} values - Values to validate
 * @returns {Object} Validation result
 */
export function validateFieldRequirements(type, id, values) {
    const block = getBlockWithInputs(type, id);
    if (!block) {
        return { valid: false, errors: ['Block not found'] };
    }
    
    const errors = [];
    const requiredFields = block.inputs.filter(field => field.required);
    
    requiredFields.forEach(field => {
        if (!values[field.id] && !values[field.name]) {
            errors.push(`Required field '${field.label}' is missing`);
        }
    });
    
    return {
        valid: errors.length === 0,
        errors,
        requiredFields: requiredFields.map(f => f.id)
    };
}

// =====================================================
// USAGE EXAMPLES
// =====================================================

/*
// Example Usage:

// 1. Get all workflow names
const workflowNames = getBlockNames('workflows');
console.log('Workflows:', workflowNames);

// 2. Get specific workflow with inputs
const workflowDetails = getBlockWithInputs('workflows', 'workflow_123');
console.log('Workflow Details:', workflowDetails);

// 3. Search across all types
const searchResults = searchBlocks('user');
console.log('Search Results:', searchResults);

// 4. Get data summary
const summary = getDataSummary();
console.log('Data Summary:', summary);

// 5. Get field mapping suggestions
const mapping = getFieldMapping('workflows', 'wf1', 'queries', 'q1');
console.log('Mapping:', mapping);

// 6. Validate requirements
const validation = validateFieldRequirements('workflows', 'wf1', { param1: 'value1' });
console.log('Validation:', validation);
*/