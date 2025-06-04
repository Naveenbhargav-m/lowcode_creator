const formFieldSchema = {
    title: 'Form Field Configuration',
    // Centralized field definitions with paths
    fields: [
      // General field settings
      {
        id: 'type',
        type: 'select',
        label: 'Field Type',
        required: true,
        options: [
          { value: 'text', label: 'Text' },
          { value: 'number', label: 'Number' },
          { value: 'select', label: 'Select' },
          { value: 'checkbox', label: 'Checkbox' },
          { value: 'array', label: 'Array' },
          { value: 'color', label: 'Color' },
          { value: 'static_key_value', label: 'Static Key-Value' },
          { value: 'dynamic_key_value', label: 'Dynamic Key-Value' },
          { value: 'date', label: 'Date' },
          { value: 'time', label: 'Time' }
        ]
      },
      {
        id: 'label',
        type: 'text',
        label: 'Field Label',
        placeholder: 'Enter field label',
        required: true,
      },
      {
        id: 'defaultValue',
        type: 'text',
        label: 'Default Value',
        placeholder: 'Enter default value',
      },
      {
        id: 'required',
        type: 'checkbox',
        checkboxLabel: 'Required Field',
      },
      
      // Options for select/choice fields
      {
        id: 'options',
        type: 'array',
        label: 'Options',
        path: 'options',
        condition: {
          dependsOn: 'type',
          operator: 'in',
          value: ['select', 'radio', 'checkbox']
        },
        itemTemplate: {
          label: { type: 'text', label: 'Label' },
          value: { type: 'text', label: 'Value' }
        }
      },
      
      // Props settings
      {
        id: 'props.placeholder',
        type: 'text',
        label: 'Placeholder',
        path: 'props',
        condition: {
          dependsOn: 'type',
          operator: 'in',
          value: ['text', 'number', 'date', 'time', 'select']
        }
      },
      {
        id: 'props.disabled',
        type: 'checkbox',
        checkboxLabel: 'Disabled',
        path: 'props',
      },
      {
        id: 'props.readOnly',
        type: 'checkbox',
        checkboxLabel: 'Read Only',
        path: 'props',
      },
      
      // Validation settings
      {
        id: 'validation',
        type: 'array',
        label: 'Validation Rules',
        path: 'validation',
        itemTemplate: {
          type: { 
            type: 'select', 
            label: 'Rule Type',
            options: [
              { value: 'required', label: 'Required' },
              { value: 'min', label: 'Minimum Value' },
              { value: 'max', label: 'Maximum Value' },
              { value: 'minLength', label: 'Minimum Length' },
              { value: 'maxLength', label: 'Maximum Length' },
              { value: 'pattern', label: 'Regex Pattern' },
              { value: 'equals', label: 'Equals Field' },
              { value: 'custom', label: 'Custom Function' }
            ]
          },
          value: { type: 'text', label: 'Value' },
          message: { type: 'text', label: 'Error Message' }
        }
      },
      
      // ValidateOn settings
      {
        id: 'validateOn',
        type: 'array',
        label: 'Validate On Events',
        path: 'validateOn',
        itemTemplate: {
          event: { 
            type: 'select', 
            label: 'Event',
            options: [
              { value: 'change', label: 'Change' },
              { value: 'blur', label: 'Blur' },
              { value: 'submit', label: 'Submit' },
              { value: 'click', label: 'Click' }
            ]
          }
        }
      },
      
      // Actions settings
      {
        id: 'actions',
        type: 'array',
        label: 'Field Actions',
        path: 'actions',
        itemTemplate: {
          event: { 
            type: 'select', 
            label: 'Event',
            options: [
              { value: 'change', label: 'Change' },
              { value: 'blur', label: 'Blur' },
              { value: 'focus', label: 'Focus' },
              { value: 'click', label: 'Click' }
            ]
          },
          action: { type: 'text', label: 'Action Name' },
          params: { type: 'text', label: 'Parameters' }
        }
      },
      
      // Hidden condition
      {
        id: 'hidden.dependsOn',
        type: 'text',
        label: 'Depends On Field',
        path: 'hidden',
      },
      {
        id: 'hidden.operator',
        type: 'select',
        label: 'Comparison Operator',
        options: [
          { value: 'equals', label: 'Equals' },
          { value: 'notEquals', label: 'Not Equals' },
          { value: 'in', label: 'In' },
          { value: 'notIn', label: 'Not In' },
          { value: 'greaterThan', label: 'Greater Than' },
          { value: 'lessThan', label: 'Less Than' }
        ],
        path: 'hidden',
        condition: {
          dependsOn: 'hidden.dependsOn',
          operator: 'exists',
        }
      },
      {
        id: 'hidden.value',
        type: 'text',
        label: 'Comparison Value',
        path: 'hidden',
        condition: {
          dependsOn: 'hidden.dependsOn',
          operator: 'exists',
        }
      },
      
      // Container style fields
      {
        id: 'style.container.padding',
        type: 'text',
        label: 'Padding',
        placeholder: '0px',
        path: 'style.container',
      },
      {
        id: 'style.container.margin',
        type: 'text',
        label: 'Margin',
        placeholder: '0px',
        path: 'style.container',
      },
      {
        id: 'style.container.borderRadius',
        type: 'text',
        label: 'Border Radius',
        placeholder: '0px',
        path: 'style.container',
      },
      {
        id: 'style.container.backgroundColor',
        type: 'color',
        label: 'Background Color',
        path: 'style.container',
      },
      {
        id: 'style.container.border',
        type: 'text',
        label: 'Border',
        placeholder: '1px solid #ccc',
        path: 'style.container',
      },
      
      // Label style fields
      {
        id: 'style.label.padding',
        type: 'text',
        label: 'Padding',
        placeholder: '0px',
        path: 'style.label',
      },
      {
        id: 'style.label.margin',
        type: 'text',
        label: 'Margin',
        placeholder: '0px 0 5px 0',
        path: 'style.label',
      },
      {
        id: 'style.label.fontSize',
        type: 'text',
        label: 'Font Size',
        placeholder: '14px',
        path: 'style.label',
      },
      {
        id: 'style.label.fontWeight',
        type: 'select',
        label: 'Font Weight',
        options: [
          { value: 'normal', label: 'Normal' },
          { value: 'bold', label: 'Bold' },
          { value: 'lighter', label: 'Lighter' },
          { value: 'bolder', label: 'Bolder' },
        ],
        path: 'style.label',
      },
      {
        id: 'style.label.color',
        type: 'color',
        label: 'Text Color',
        path: 'style.label',
      },
      
      // Input style fields
      {
        id: 'style.input.padding',
        type: 'text',
        label: 'Padding',
        placeholder: '8px 12px',
        path: 'style.input',
      },
      {
        id: 'style.input.borderRadius',
        type: 'text',
        label: 'Border Radius',
        placeholder: '4px',
        path: 'style.input',
      },
      {
        id: 'style.input.border',
        type: 'text',
        label: 'Border',
        placeholder: '1px solid #ccc',
        path: 'style.input',
      },
      {
        id: 'style.input.fontSize',
        type: 'text',
        label: 'Font Size',
        placeholder: '14px',
        path: 'style.input',
      },
      {
        id: 'style.input.backgroundColor',
        type: 'color',
        label: 'Background Color',
        path: 'style.input',
      },
      {
        id: 'style.input.color',
        type: 'color',
        label: 'Text Color',
        path: 'style.input',
      },
      {
        id: 'style.input.focusBorder',
        type: 'text',
        label: 'Focus Border',
        placeholder: '1px solid #007bff',
        path: 'style.input',
      },
      {
        id: 'style.input.focusBoxShadow',
        type: 'text',
        label: 'Focus Box Shadow',
        placeholder: '0 0 0 3px rgba(0,123,255,.25)',
        path: 'style.input',
      },
      
      // Error style fields
      {
        id: 'style.error.padding',
        type: 'text',
        label: 'Padding',
        placeholder: '4px 0',
        path: 'style.error',
      },
      {
        id: 'style.error.margin',
        type: 'text',
        label: 'Margin',
        placeholder: '4px 0 0 0',
        path: 'style.error',
      },
      {
        id: 'style.error.fontSize',
        type: 'text',
        label: 'Font Size',
        placeholder: '12px',
        path: 'style.error',
      },
      {
        id: 'style.error.color',
        type: 'color',
        label: 'Text Color',
        placeholder: '#dc3545',
        path: 'style.error',
      },
      {
        id: 'style.error.fontWeight',
        type: 'select',
        label: 'Font Weight',
        options: [
          { value: 'normal', label: 'Normal' },
          { value: 'bold', label: 'Bold' },
        ],
        path: 'style.error',
      },
      
      // Children fields for nested components
      {
        id: 'children',
        type: 'array',
        label: 'Child Fields',
        path: 'children',
        condition: {
          dependsOn: 'type',
          operator: 'in',
          value: ['fieldset', 'section', 'group']
        }
      }
    ],
    
    // Section definitions
    sections: [
      {
        id: 'general',
        title: 'General Settings',
        fieldIds: ['type', 'label', 'defaultValue', 'required']
      },
      {
        id: 'options-section',
        title: 'Field Options',
        fieldIds: ['options']
      },
      {
        id: 'props-section',
        title: 'Field Properties',
        fieldIds: ['props.placeholder', 'props.disabled', 'props.readOnly']
      },
      {
        id: 'validation-section',
        title: 'Validation',
        fieldIds: ['validation', 'validateOn']
      },
      {
        id: 'actions-section',
        title: 'Actions',
        fieldIds: ['actions']
      },
      {
        id: 'visibility-section',
        title: 'Visibility Conditions',
        fieldIds: ['hidden.dependsOn', 'hidden.operator', 'hidden.value']
      },
      {
        id: 'container-style',
        title: 'Container Style',
        fieldIds: [
          'style.container.padding', 
          'style.container.margin',
          'style.container.borderRadius',
          'style.container.backgroundColor',
          'style.container.border'
        ]
      },
      {
        id: 'label-style',
        title: 'Label Style',
        fieldIds: [
          'style.label.padding',
          'style.label.margin',
          'style.label.fontSize',
          'style.label.fontWeight',
          'style.label.color'
        ]
      },
      {
        id: 'input-style',
        title: 'Input Style',
        fieldIds: [
          'style.input.padding',
          'style.input.borderRadius',
          'style.input.border',
          'style.input.fontSize',
          'style.input.backgroundColor',
          'style.input.color',
          'style.input.focusBorder',
          'style.input.focusBoxShadow'
        ]
      },
      {
        id: 'error-style',
        title: 'Error Style',
        fieldIds: [
          'style.error.padding',
          'style.error.margin',
          'style.error.fontSize',
          'style.error.color',
          'style.error.fontWeight'
        ]
      },
      {
        id: 'children-section',
        title: 'Child Fields',
        fieldIds: ['children']
      }
    ],
    
    // Tab definitions
    tabs: [
      {
        id: 'basic',
        title: 'Basic Settings',
        sectionIds: ['general', 'options-section', 'props-section']
      },
      {
        id: 'validation-tab',
        title: 'Validation',
        sectionIds: ['validation-section', 'actions-section', 'visibility-section']
      },
      {
        id: 'styles',
        title: 'Styles',
        sectionIds: ['container-style', 'label-style', 'input-style', 'error-style']
      },
      {
        id: 'advanced',
        title: 'Advanced',
        sectionIds: ['children-section']
      }
    ],
    
    // Buttons
    buttons: [
      {
        id: 'save',
        label: 'save',
        type: 'submit',
        variant: 'primary',
      },
    ],
  };



  const FormButtonSchema = {
    "fields": [
      {
        "id":"submit_actions.action",
        "path": "submit_actions.action",
        "label": "Action",
        "type": "dropdown",
        "options": [
          {"label": "trigger_workflow", "value": "workflow"},
          {"label": "write to global", "value": "global"},
        ]
      },
      {
        "id": "submit_actions.worflow_id",
        "path": "submit_actions.worflow_id",
        "labal": "pick a workflow",
        "type": "dropdown",
        "options": [],
        "dynamicConfig": [
          {
            "condition": {"field": "submit_actions.action", "operator": "equals", "value": "workflow"},
            "callback": "get_workflow_names",
            "assignTo": "options"
          }
        ],
      },
      {
        "id": "submit_actions.field_mapping",
        "type": "data_mapper",
        "path": "submit_actions.field_mapping",
        "label": "Data Mapping",
        enableStaticValues: true,
        enableSourceFields: true,
        enableUserFields: false,
        "target_fields": [],
        "source_fields": [],
        "dynamicConfig": [
          {
            "condition": {"field": "submit_actions.worflow_id", "operator": "not_empty"},
            "callback": "get_workflow_fields",
            "assignTo": [
              {"key": "source_fields", "transform": (data) => data.inputs},
              {"key": "target_fields", "transform": (data) => data.workflow_fields},
            ],
          }
        ],
      }
    ],

    "sections": [
      {"id": "triggers", "title": "triggers", 
      "fieldIds": ["submit_actions.action", "submit_actions.worflow_id", "submit_actions.field_mapping"],
      }
    ],
    "tabs": [
      {
        "id": "form_actions",
        "title": "Form Actions",
        "sectionIds": ["triggers"],
      }
    ]
  };

  export { formFieldSchema , FormButtonSchema};