
  // New schema structure with centralized fields
  const schema = {
    title: 'Workflow Configuration',
    // Centralized field definitions
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Workflow Name',
        placeholder: 'Enter workflow name',
        required: true,
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        placeholder: 'Enter description',
      },
      {
        id: 'type',
        type: 'select',
        label: 'Workflow Type',
        options: [
          { value: 'sequential', label: 'Sequential' },
          { value: 'parallel', label: 'Parallel' },
          { value: 'conditional', label: 'Conditional' },
        ],
      },
      {
        id: 'maxRetries',
        type: 'number',
        label: 'Max Retries',
        min: 0,
        max: 10,
      },
      {
        id: 'timeout',
        type: 'number',
        label: 'Timeout (seconds)',
        min: 0,
      },
      {
        id: 'enableLogging',
        type: 'checkbox',
        checkboxLabel: 'Enable Logging',
      },
      {
        id: 'notification',
        type: 'checkbox',
        checkboxLabel: 'Enable Email Notifications',
      },
      {
        id: 'notificationEmail',
        type: 'text',
        label: 'Notification Email',
        placeholder: 'Enter email address',
        condition: {
          dependsOn: 'notification',
          operator: 'equals',
          value: true,
        },
      },
    ],
    // Section definitions
    sections: [
      {
        id: 'general',
        title: 'General Information',
        fieldIds: ['name', 'description', 'type'],
      },
      {
        id: 'execution',
        title: 'Execution Settings',
        fieldIds: ['maxRetries', 'timeout', 'enableLogging'],
      },
      {
        id: 'notifications',
        title: 'Notifications',
        fieldIds: ['notification', 'notificationEmail'],
      },
    ],
    // Tab definitions
    tabs: [
      {
        id: 'basic',
        title: 'Basic Settings',
        sectionIds: ['general', 'execution'],
      },
      {
        id: 'advanced',
        title: 'Advanced Settings',
        sectionIds: ['notifications'],
      },
    ],
    buttons: [
      {
        id: 'save',
        label: 'Save Configuration',
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

  // Simple flat schema example - no tabs or sections
  const simpleSchema = {
    title: 'Simple Configuration',
    // Direct list of fields
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Name',
        placeholder: 'Enter name',
        required: true,
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        placeholder: 'Enter description',
        condition: {
          dependsOn: 'enableFeature',
          operator: 'equals',
          value: true,
        },
      },
      {
        id: 'enableFeature',
        type: 'checkbox',
        checkboxLabel: 'Enable Feature',
      },
      {
        id: 'brandColor',
        type: 'color',
        label: 'Brand Color',
        placeholder: 'Select a color',
      },
      {
        id: 'tags',
        type: 'array',
        label: 'Tags',
        itemPlaceholder: 'Enter a tag',
        addButtonText: '+ Add Tag',
      },
      {
        id: 'contactInfo',
        type: 'static_key_value',
        label: 'Contact Information',
        keys: ['email', 'phone', 'address'],
        valuePlaceholder: 'Enter information',
      },
      {
        id: 'customFields',
        type: 'dynamic_key_value',
        label: 'Custom Fields',
        keyPlaceholder: 'Field Name',
        valuePlaceholder: 'Field Value',
        addButtonText: '+ Add Custom Field',
      },
      {
        id: 'startDate',
        type: 'date',
        label: 'Start Date',
        min: '2025-01-01',
        max: '2025-12-31',
        showCalendarIcon: true,
      },
      {
        id: 'meetingTime',
        type: 'time',
        label: 'Meeting Time',
        showSeconds: true,
        showClockIcon: true,
      },
    
    ],
    buttons: [
      {
        id: 'save',
        label: 'Save',
        type: 'submit',
        variant: 'primary',
      },
    ],
  };


export const elementConfig = {
    "title": "Customize",
    fields: [
        {
            id: 'style',
            type: 'dynamic_key_value',
            label: 'Custom Fields',
            keyPlaceholder: 'Property',
            valuePlaceholder: 'Value',
            addButtonText: 'Add',
        }
    ],
};