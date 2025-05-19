
export const elementConfig = {
        title: 'CSS Style Editor',
        fields: [
          // Typography
          {
            id: 'fontFamily',
            type: 'text',
            label: 'Font Family',
            placeholder: 'e.g. Arial, sans-serif',
          },
          {
            id: 'fontSize',
            type: 'text',
            label: 'Font Size',
            placeholder: 'e.g. 16px, 1rem',
          },
          {
            id: 'fontWeight',
            type: 'select',
            label: 'Font Weight',
            options: [
              { value: 'normal', label: 'Normal' },
              { value: 'bold', label: 'Bold' },
              { value: 'lighter', label: 'Lighter' },
              { value: 'bolder', label: 'Bolder' },
              { value: '100', label: '100' },
              { value: '900', label: '900' },
            ],
          },
          {
            id: 'textAlign',
            type: 'select',
            label: 'Text Align',
            options: [
              { value: 'left', label: 'Left' },
              { value: 'center', label: 'Center' },
              { value: 'right', label: 'Right' },
              { value: 'justify', label: 'Justify' },
            ],
          },
      
          // Spacing
          {
            id: 'margin',
            type: 'text',
            label: 'Margin',
            placeholder: 'e.g. 10px 20px',
          },
          {
            id: 'padding',
            type: 'text',
            label: 'Padding',
            placeholder: 'e.g. 10px 15px',
          },

          {
            id: 'height',
            type: 'text',
            label: 'Height',
            placeholder: 'e.g. 100vh',
          },
          {
            id: 'width',
            type: 'text',
            label: 'Widfth',
            placeholder: 'e.g. 100vw',
          },
      
          // Layout
          {
            id: 'display',
            type: 'select',
            label: 'Display',
            options: [
              { value: 'block', label: 'Block' },
              { value: 'inline-block', label: 'Inline Block' },
              { value: 'flex', label: 'Flex' },
              { value: 'grid', label: 'Grid' },
              { value: 'none', label: 'None' },
            ],
          },
          {
            id: 'position',
            type: 'select',
            label: 'Position',
            options: [
              { value: 'static', label: 'Static' },
              { value: 'relative', label: 'Relative' },
              { value: 'absolute', label: 'Absolute' },
              { value: 'fixed', label: 'Fixed' },
              { value: 'sticky', label: 'Sticky' },
            ],
          },
          {
            id: 'zIndex',
            type: 'number',
            label: 'Z-Index',
            min: 0,
          },
      
          // Border
          {
            id: 'border',
            type: 'text',
            label: 'Border',
            placeholder: 'e.g. 1px solid #000',
          },
          {
            id: 'borderRadius',
            type: 'text',
            label: 'Border Radius',
            placeholder: 'e.g. 4px or 50%',
          },
      
          // Background
          {
            id: 'backgroundColor',
            type: 'color',
            label: 'Background Color',
          },
          {
            id: 'backgroundImage',
            type: 'text',
            label: 'Background Image URL',
          },
      
          // Effects
          {
            id: 'boxShadow',
            type: 'text',
            label: 'Box Shadow',
            placeholder: 'e.g. 0px 4px 10px rgba(0,0,0,0.2)',
          },
          {
            id: 'opacity',
            type: 'number',
            label: 'Opacity',
            min: 0,
            max: 1,
          },
        ],
        sections: [
          {
            id: 'typography',
            title: 'Typography',
            fieldIds: ['fontFamily', 'fontSize', 'fontWeight', 'textAlign'],
          },
          {
            id: 'spacing',
            title: 'Spacing',
            fieldIds: ['margin', 'padding', 'height', 'width'],
          },
          {
            id: 'layout',
            title: 'Layout',
            fieldIds: ['display', 'position', 'zIndex'],
          },
          {
            id: 'border',
            title: 'Border',
            fieldIds: ['border', 'borderRadius'],
          },
          {
            id: 'background',
            title: 'Background',
            fieldIds: ['backgroundColor', 'backgroundImage'],
          },
          {
            id: 'effects',
            title: 'Effects',
            fieldIds: ['boxShadow', 'opacity'],
          },
        ],
        tabs: [
          {
            id: 'style',
            title: 'Style Properties',
            sectionIds: ['typography', 'spacing', 'layout'],
          },
          {
            id: 'visual',
            title: 'Visual Properties',
            sectionIds: ['border', 'background', 'effects'],
          },
        ],
        buttons: [
          {
            id: 'apply',
            label: 'Apply Styles',
            type: 'submit',
            variant: 'primary',
          },
          {
            id: 'reset',
            label: 'Reset',
            type: 'button',
            variant: 'secondary',
          },
        ],      
};

export const groupings = {
    "style": [
        'fontFamily', 'fontSize', 'fontWeight', 'border', 'borderRadius',
        'backgroundColor', 'backgroundImage','boxShadow', 'opacity','typography', 'spacing', 'layout',
        'border', 'background', 'effects',
        'textAlign','margin', 'padding', 'height', 'width', 'display', 'position', 'zIndex']
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
  
//   // Example usage for grouping:
//   const values = {
//     "color": "black",
//     "backgroundColor": "green",
//     "onClick": "run_query",
//     "data_source": "query1"
//   };
  
//   const grouping = {
//     "style": ["color", "backgroundColor"],
//     "data": ["data_source"],
//     "actions": ["onClick", "onDouble", "click"]
//   };
  
//   const groupedResult = groupObjectValues(values, grouping);
//   console.log("Grouped Result:", groupedResult);
//   /* Output:
//   {
//     style: { color: 'black', backgroundColor: 'green' },
//     data: { data_source: 'query1' },
//     actions: { onClick: 'run_query' }
//   }
//   */
  
//   // Example usage for ungrouping:
//   const ungroupedResult = ungroupObjectValues(groupedResult);
//   console.log("Flattened Values:", ungroupedResult.values);
//   console.log("Extracted Grouping Schema:", ungroupedResult.grouping);
//   /* Output:
//   Flattened Values: {
//     color: 'black',
//     backgroundColor: 'green',
//     data_source: 'query1',
//     onClick: 'run_query'
//   }
//   Extracted Grouping Schema: {
//     style: ['color', 'backgroundColor'],
//     data: ['data_source'],
//     actions: ['onClick']
//   }
//   */