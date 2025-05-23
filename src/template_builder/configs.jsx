
export const TemplateElementConfigFormSchema = {
  title: 'Configs',
  
  // Centralized field definitions with paths
  fields: [
    // Basic element settings
    {
      id: 'value',
      type: 'text',
      label: 'Default Value',
      placeholder: 'Enter default selected value',
      path: '', // Root level
    },
    {
      id: 'picker',
      type: 'data_picker',
      label: 'Default Value',
      placeholder: 'Enter default selected value',
      path: '', // Root level
    },
    
    // Style configuration fields
    {
      id: 'configs.style.display',
      type: 'select',
      label: 'Display',
      options: [
        { value: 'inline-block', label: 'Inline Block' },
        { value: 'block', label: 'Block' },
        { value: 'inline', label: 'Inline' },
        { value: 'flex', label: 'Flex' },
        { value: 'none', label: 'None' }
      ],
      path: 'configs.style',
      defaultValue: 'inline-block'
    },
    {
      id: 'configs.style.position',
      type: 'select',
      label: 'Position',
      options: [
        { value: 'static', label: 'Static' },
        { value: 'relative', label: 'Relative' },
        { value: 'absolute', label: 'Absolute' },
        { value: 'fixed', label: 'Fixed' },
        { value: 'sticky', label: 'Sticky' }
      ],
      path: 'configs.style',
      defaultValue: 'relative'
    },
    {
      id: 'configs.style.width',
      type: 'text',
      label: 'Width',
      placeholder: '200px',
      path: 'configs.style',
    },
    {
      id: 'configs.style.padding',
      type: 'text',
      label: 'Padding',
      placeholder: '8px',
      path: 'configs.style',
    },
    {
      id: 'configs.style.fontSize',
      type: 'text',
      label: 'Font Size',
      placeholder: '0.9em',
      path: 'configs.style',
    },
    {
      id: 'configs.style.border',
      type: 'text',
      label: 'Border',
      placeholder: '1px solid #ccc',
      path: 'configs.style',
    },
    {
      id: 'configs.style.borderRadius',
      type: 'text',
      label: 'Border Radius',
      placeholder: '4px',
      path: 'configs.style',
    },
    {
      id: 'configs.style.backgroundColor',
      type: 'color',
      label: 'Background Color',
      path: 'configs.style',
      defaultValue: '#ffffff'
    },
    
    // Options configuration
    {
      id: 'configs.options',
      type: 'option_mapper',
      label: 'Options',
      path: 'configs.options',
      required: true,
      optionsConfig: {
                valueKey: 'value',
                labelKey: 'label',
                valueLabel: 'Label',
                labelLabel: 'Value'
              }
    },
    
    // Event handlers - onClick
    {
      id: 'configs.onClick.actions',
      type: 'array',
      label: 'Click Actions',
      path: 'configs.onClick',
      itemTemplate: {
        type: { 
          type: 'select', 
          label: 'Action Type',
          options: [
            { value: 'navigate', label: 'Navigate' },
            { value: 'setState', label: 'Set State' },
            { value: 'apiCall', label: 'API Call' },
            { value: 'showModal', label: 'Show Modal' },
            { value: 'custom', label: 'Custom' }
          ]
        },
        target: { type: 'text', label: 'Target/Parameter' },
        value: { type: 'text', label: 'Value' }
      }
    },
    {
      id: 'configs.onClick.code',
      type: 'text',
      label: 'Click Custom Code',
      placeholder: 'console.log("clicked");',
      path: 'configs.onClick',
    },
    
    // Event handlers - onDoubleClick
    {
      id: 'configs.onDoubleClick.actions',
      type: 'array',
      label: 'Double Click Actions',
      path: 'configs.onDoubleClick',
      itemTemplate: {
        type: { 
          type: 'select', 
          label: 'Action Type',
          options: [
            { value: 'navigate', label: 'Navigate' },
            { value: 'setState', label: 'Set State' },
            { value: 'apiCall', label: 'API Call' },
            { value: 'showModal', label: 'Show Modal' },
            { value: 'custom', label: 'Custom' }
          ]
        },
        target: { type: 'text', label: 'Target/Parameter' },
        value: { type: 'text', label: 'Value' }
      }
    },
    {
      id: 'configs.onDoubleClick.code',
      type: 'text',
      label: 'Double Click Custom Code',
      path: 'configs.onDoubleClick',
    },
    
    // Event handlers - onHover
    {
      id: 'configs.onHover.actions',
      type: 'array',
      label: 'Hover Actions',
      path: 'configs.onHover',
      itemTemplate: {
        type: { 
          type: 'select', 
          label: 'Action Type',
          options: [
            { value: 'navigate', label: 'Navigate' },
            { value: 'setState', label: 'Set State' },
            { value: 'apiCall', label: 'API Call' },
            { value: 'showModal', label: 'Show Modal' },
            { value: 'custom', label: 'Custom' }
          ]
        },
        target: { type: 'text', label: 'Target/Parameter' },
        value: { type: 'text', label: 'Value' }
      }
    },
    {
      id: 'configs.onHover.code',
      type: 'text',
      label: 'Hover Custom Code',
      path: 'configs.onHover',
    },
    
    // Event handlers - onHoverEnter
    {
      id: 'configs.onHoverEnter.actions',
      type: 'array',
      label: 'Hover Enter Actions',
      path: 'configs.onHoverEnter',
      itemTemplate: {
        type: { 
          type: 'select', 
          label: 'Action Type',
          options: [
            { value: 'navigate', label: 'Navigate' },
            { value: 'setState', label: 'Set State' },
            { value: 'apiCall', label: 'API Call' },
            { value: 'showModal', label: 'Show Modal' },
            { value: 'custom', label: 'Custom' }
          ]
        },
        target: { type: 'text', label: 'Target/Parameter' },
        value: { type: 'text', label: 'Value' }
      }
    },
    {
      id: 'configs.onHoverEnter.code',
      type: 'text',
      label: 'Hover Enter Custom Code',
      path: 'configs.onHoverEnter',
    },
    
    // Event handlers - onHoverLeave
    {
      id: 'configs.onHoverLeave.actions',
      type: 'array',
      label: 'Hover Leave Actions',
      path: 'configs.onHoverLeave',
      itemTemplate: {
        type: { 
          type: 'select', 
          label: 'Action Type',
          options: [
            { value: 'navigate', label: 'Navigate' },
            { value: 'setState', label: 'Set State' },
            { value: 'apiCall', label: 'API Call' },
            { value: 'showModal', label: 'Show Modal' },
            { value: 'custom', label: 'Custom' }
          ]
        },
        target: { type: 'text', label: 'Target/Parameter' },
        value: { type: 'text', label: 'Value' }
      }
    },
    {
      id: 'configs.onHoverLeave.code',
      type: 'text',
      label: 'Hover Leave Custom Code',
      path: 'configs.onHoverLeave',
    },
    
    // Value and Children Code
    {
      id: 'configs.valueCode.actions',
      type: 'array',
      label: 'Value Code Actions',
      path: 'configs.valueCode',
      itemTemplate: {
        type: { 
          type: 'select', 
          label: 'Action Type',
          options: [
            { value: 'transform', label: 'Transform Value' },
            { value: 'validate', label: 'Validate' },
            { value: 'format', label: 'Format' },
            { value: 'custom', label: 'Custom' }
          ]
        },
        target: { type: 'text', label: 'Target/Parameter' },
        value: { type: 'text', label: 'Value' }
      }
    },
    {
      id: 'configs.valueCode.code',
      type: 'text',
      label: 'Value Custom Code',
      placeholder: 'return value;',
      path: 'configs.valueCode',
    },
    
    {
      id: 'configs.childrenCode.actions',
      type: 'array',
      label: 'Children Code Actions',
      path: 'configs.childrenCode',
      itemTemplate: {
        type: { 
          type: 'select', 
          label: 'Action Type',
          options: [
            { value: 'render', label: 'Render Children' },
            { value: 'transform', label: 'Transform' },
            { value: 'filter', label: 'Filter' },
            { value: 'custom', label: 'Custom' }
          ]
        },
        target: { type: 'text', label: 'Target/Parameter' },
        value: { type: 'text', label: 'Value' }
      }
    },
    {
      id: 'configs.childrenCode.code',
      type: 'text',
      label: 'Children Custom Code',
      placeholder: 'return children;',
      path: 'configs.childrenCode',
    }
  ],
  
  // Section definitions
  sections: [
    {
      id: "options",
      "fieldIds": ["configs.options"],
      title: "Options",
    },
    {
      id: 'basic',
      title: 'Basic Settings',
      fieldIds: ['value', "options", "picker"]
    },
    {
      id: 'style-section',
      title: 'Style Configuration',
      fieldIds: [
        'configs.style.display',
        'configs.style.position', 
        'configs.style.width',
        'configs.style.padding',
        'configs.style.fontSize',
        'configs.style.border',
        'configs.style.borderRadius',
        'configs.style.backgroundColor'
      ]
    },
    {
      id: 'click-events',
      title: 'Click Events',
      fieldIds: [
        'configs.onClick.actions',
        'configs.onClick.code',
        'configs.onDoubleClick.actions',
        'configs.onDoubleClick.code'
      ]
    },
    {
      id: 'hover-events',
      title: 'Hover Events',
      fieldIds: [
        'configs.onHover.actions',
        'configs.onHover.code',
        'configs.onHoverEnter.actions',
        'configs.onHoverEnter.code',
        'configs.onHoverLeave.actions',
        'configs.onHoverLeave.code'
      ]
    },
    {
      id: 'code-handlers',
      title: 'Code Handlers',
      fieldIds: [
        'configs.valueCode.actions',
        'configs.valueCode.code',
        'configs.childrenCode.actions',
        'configs.childrenCode.code'
      ]
    }
  ],
  
  // Tab definitions
  tabs: [
    {
      id: 'general',
      title: 'General',
      sectionIds: ['basic', "options",'style-section']
    },
    {
      id: 'events',
      title: 'Events',
      sectionIds: ['click-events', 'hover-events']
    },
    {
      id: 'advanced',
      title: 'Advanced',
      sectionIds: ['code-handlers']
    }
  ],
  
  // Buttons
  buttons: [
    {
      id: 'save',
      label: 'Save',
      type: 'submit',
      variant: 'primary',
    }
  ],
};


/**
 * Groups object values according to a specified grouping schema
 * @param {Object} values - The object containing key-value pairs to be grouped
 * @param {Object} grouping - Schema defining which keys belong to which groups
 * @returns {Object} - A new object with values organized into groups
 */
export function groupObjectValues(values, grouping) {
    // Initialize result object
    const result = {};
    
    // Process each group in the grouping schema
    for (const groupName in grouping) {
      // Initialize group in result object
      result[groupName] = {};
      
      // Get the list of keys for this group
      const groupKeys = grouping[groupName];
      
      // Add each key-value pair to the group if it exists in values
      groupKeys.forEach(key => {
        if (values.hasOwnProperty(key)) {
          result[groupName][key] = values[key];
        }
      });
    }
    
    return result;
  }
/**
 * Flattens a grouped object back to a single level and extracts the grouping schema
 * @param {Object} groupedValues - The object with values organized into groups
 * @returns {Object} - An object containing the flattened values and the extracted grouping schema
 */
export function ungroupObjectValues(groupedValues) {
  // Initialize result objects
  const flattenedValues = {};
  const extractedGrouping = {};
  
  // Process each group in the grouped values
  for (const groupName in groupedValues) {
    // Get the group object
    const groupObj = groupedValues[groupName];
    
    // Check if this is a leaf value (not an object or null/array)
    if (groupObj === null || 
        typeof groupObj !== 'object' || 
        Array.isArray(groupObj)) {
      // Keep leaf values at the top level
      flattenedValues[groupName] = groupObj;
      continue;
    }
    
    // Initialize the group in the extracted grouping schema
    extractedGrouping[groupName] = [];
    
    // Process each key-value pair in the group
    for (const key in groupObj) {
      // Add the key-value pair to the flattened values
      flattenedValues[key] = groupObj[key];
      
      // Add the key to the extracted grouping schema
      extractedGrouping[groupName].push(key);
    }
  }
  
  return {
    values: flattenedValues,
    grouping: extractedGrouping
  };
}