
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
    {
      "id":"configs.events",
      "type": "actions_config",
      "path": "configs.events",
      "label": "Actions"
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
      "id": "actions",
      "title": "actions configs",
      "fieldIds": ["configs.events"],
    },
    {
      "id": "datasource",
      "title": "data_source",
      "fieldIds": [],
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
      id: 'advanced',
      title: 'Advanced',
      sectionIds: ['actions']
    },
    {
      id: 'Data',
      title: 'Data',
      sectionIds: ['datasource']
    },
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

export const GeneralElementSchema = {
  ...TemplateElementConfigFormSchema
};

let  RootElementSchema = {
  ...TemplateElementConfigFormSchema,

};

let extrafields = [
  {
    "id": "configs.data_source.date_key",
    "type": "text",
    "path": "configs.data_source.date_key",
    "label": "Data key"
  },
  {
    "id": "configs.data_source.data_query",
    "type": "dropdown",
    "path": "configs.data_source.data_query",
    "options": [
      {"label": "option1", "value": "option1"},
      {"label": "option2","value": "option2"}
    ],
    "dynamicConfig": [
      {
        "condition": {"field": "configs.data_source.date_key", "operator": "non_empty"},
        "callback": "get_query_names",
        "assignTo": "options"
      }
    ],
    "label": "Pick a Query"
  },
  {
    "id": "configs.data_source.field_mapping",
    "type": "extended_data_mapper",
    "path": "configs.data_source.field_mapping",
    "label": "Data Mapping",
    enableStaticValues: true,
    enableSourceFields: true,
    enableUserFields: false,
    "target_fields": [],
    "source_fields": [],
    "dynamicConfig": [
      {
        "condition": {"field": "configs.data_source.data_query", "operator": "not_empty"},
        "callback": "get_query_field_map",
        "assignTo": [
          {"key": "source_fields", "transform": (data) => data.inputs},
          {"key": "target_fields", "transform": (data) => data.query_fields},
        ],
      }
    ],
  }
];

RootElementSchema.fields = [...RootElementSchema.fields, ...extrafields];
RootElementSchema.sections[4]["fieldIds"] = [...RootElementSchema.sections[4]["fieldIds"],
 "configs.data_source.data_query", "configs.data_source.field_mapping"];



 export {RootElementSchema};