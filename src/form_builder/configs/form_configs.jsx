

// Extended sidebar options with all field types
let elements = [
    ["text-cursor-input", "textfield"],
    ["chevron-down", "dropdown"],
    ["vote", "checkbox"],
    ["text", "textarea"],
    ["text-cursor-input", "password"],
    ["hash", "markdown"],
    ["chart-no-axes-gantt", "slider"],
    ["sliders-horizontal", "dual_slider"],
    ["mail", "email"],
    ["calendar", "date"],
    ["calendar-clock", "date_time"],
    ["clock-2", "time"],
    ["calendar-fold", "month"],
    ["calendar-days", "week"],
    ["list-filter-plus", "multi_select"],
    ["search", "lookup"],
    ["upload", "file_upload"],
    ["image", "image_upload_grid"],
    ["grid-3x3", "image_select_grid"],
    ["columns-3", "column"],
    ["rows-3", "row"],
    ["layout-panel-top", "panel"],
    ["list-ordered", "form_steps"]
  ];
  
  
  // Extended fieldConfigs
  const fieldConfigs = {
    "textfield": {
      type: 'text',
      label: 'Text Field',
      defaultValue: '',
      validation: [],
      validateOn: [],
      actions: [],
      style: {},
      props: { placeholder: "Enter text..." },
      hidden: {},
      options: [],
      children: []
    },
    "dropdown": {
      type: 'select',
      label: 'Dropdown',
      defaultValue: '',
      validation: [],
      validateOn: [],
      actions: [],
      style: {},
      props: { placeholder: "Select an option..." },
      hidden: {},
      options: [
        { "label": "Option 1", "value": "option1" },
        { "label": "Option 2", "value": "option2" }
      ],
      children: []
    },
    "checkbox": {
      id: 'checkbox',
      type: 'checkbox',
      label: 'Checkbox',
      defaultValue: false,
      validation: [],
      validateOn: [],
      actions: {},
      style: {},
      props: {},
      hidden: {},
      options: [],
      children: []
    },
    "textarea": {
      type: 'textarea',
      label: 'Text Area',
      defaultValue: '',
      validation: [],
      validateOn: [],
      actions: [],
      style: {},
      props: { 
        placeholder: "Enter multi-line text...",
        rows: 4
      },
      hidden: {},
      options: [],
      children: []
    },
    "password": {
      type: 'password',
      label: 'Password',
      defaultValue: '',
      validation: [],
      validateOn: [],
      actions: [],
      style: {},
      props: { placeholder: "Enter password..." },
      hidden: {},
      options: [],
      children: []
    },
    "markdown": {
      type: 'markdown',
      label: 'Markdown Editor',
      defaultValue: '',
      validation: [],
      validateOn: [],
      actions: [],
      style: {},
      props: { placeholder: "Enter markdown text..." },
      hidden: {},
      options: [],
      children: []
    },
    "slider": {
      type: 'slider',
      label: 'Range Slider',
      defaultValue: 50,
      validation: [],
      validateOn: [],
      actions: [],
      style: {},
      props: {
        min: 0,
        max: 100,
        step: 1
      },
      hidden: {},
      options: [],
      children: []
    },
    "dual_slider": {
      type: 'dual_slider',
      label: 'Dual Range Slider',
      defaultValue: [25, 75],
      validation: [],
      validateOn: [],
      actions: [],
      style: {},
      props: {
        min: 0,
        max: 100,
        step: 1
      },
      hidden: {},
      options: [],
      children: []
    },
    "email": {
      type: 'email',
      label: 'Email',
      defaultValue: '',
      validation: [],
      validateOn: [],
      actions: [],
      style: {},
      props: { placeholder: "Enter email address..." },
      hidden: {},
      options: [],
      children: []
    },
    "date": {
      id: 'date',
      type: 'date',
      label: 'Date',
      defaultValue: '',
      validation: [],
      validateOn: [],
      actions: {},
      style: {},
      props: { placeholder: "Select date..." },
      hidden: {},
      options: [],
      children: []
    },
    "date_time": {
      type: 'date_time',
      label: 'Date & Time',
      defaultValue: '',
      validation: [],
      validateOn: [],
      actions: [],
      style: {},
      props: { placeholder: "Select date and time..." },
      hidden: {},
      options: [],
      children: []
    },
    "time": {
      type: 'time',
      label: 'Time',
      defaultValue: '',
      validation: [],
      validateOn: [],
      actions: [],
      style: {},
      props: { placeholder: "Select time..." },
      hidden: {},
      options: [],
      children: []
    },
    "month": {
      type: 'month',
      label: 'Month',
      defaultValue: '',
      validation: [],
      validateOn: [],
      actions: [],
      style: {},
      props: { placeholder: "Select month..." },
      hidden: {},
      options: [],
      children: []
    },
    "week": {
      type: 'week',
      label: 'Week',
      defaultValue: '',
      validation: [],
      validateOn: [],
      actions: [],
      style: {},
      props: { placeholder: "Select week..." },
      hidden: {},
      options: [],
      children: []
    },
    "multi_select": {
      type: 'multi_select',
      label: 'Multi Select',
      defaultValue: [],
      validation: [],
      validateOn: [],
      actions: [],
      style: {},
      props: { placeholder: "Select multiple options..." },
      hidden: {},
      options: [
        { "label": "Option 1", "value": "option1" },
        { "label": "Option 2", "value": "option2" },
        { "label": "Option 3", "value": "option3" }
      ],
      children: []
    },
    "lookup": {
      type: 'lookup',
      label: 'Lookup',
      defaultValue: '',
      validation: [],
      validateOn: [],
      actions: [],
      style: {},
      props: { placeholder: "Search and select..." },
      hidden: {},
      options: [
        { "label": "Item 1", "value": "item1" },
        { "label": "Item 2", "value": "item2" },
        { "label": "Item 3", "value": "item3" }
      ],
      children: []
    },
    "file_upload": {
      type: 'file_upload',
      label: 'File Upload',
      defaultValue: null,
      validation: [],
      validateOn: [],
      actions: [],
      style: {},
      props: {
        accept: '*/*',
        multiple: false
      },
      hidden: {},
      options: [],
      children: []
    },
    "image_upload_grid": {
      type: 'image_upload_grid',
      label: 'Image Upload Grid',
      defaultValue: [],
      validation: [],
      validateOn: [],
      actions: [],
      style: {},
      props: {
        maxFiles: 5,
        accept: 'image/*'
      },
      hidden: {},
      options: [],
      children: []
    },
    "image_select_grid": {
      type: 'image_select_grid',
      label: 'Image Select Grid',
      defaultValue: '',
      validation: [],
      validateOn: [],
      actions: [],
      style: {},
      props: { multiple: false },
      hidden: {},
      options: [
        { "label": "Image 1", "value": "img1", "src": "/api/placeholder/100/100" },
        { "label": "Image 2", "value": "img2", "src": "/api/placeholder/100/100" },
        { "label": "Image 3", "value": "img3", "src": "/api/placeholder/100/100" }
      ],
      children: []
    },
    "row": {
      type: 'row',
      label: 'Row Layout',
      defaultValue: null,
      validation: [],
      validateOn: [],
      actions: [],
      style: {},
      props: {},
      hidden: {},
      options: [],
      children: []
    },
    "column": {
      type: 'column',
      label: 'Column Layout',
      defaultValue: null,
      validation: [],
      validateOn: [],
      actions: [],
      style: {},
      props: {},
      hidden: {},
      options: [],
      children: []
    },
    "panel": {
      type: 'panel',
      label: 'Panel',
      defaultValue: null,
      validation: [],
      validateOn: [],
      actions: [],
      style: {},
      props: { title: 'Panel Title' },
      hidden: {},
      options: [],
      children: []
    },
    "form_steps": {
      type: 'form_steps',
      label: 'Form Steps',
      defaultValue: null,
      validation: [],
      validateOn: [],
      actions: [],
      style: {},
      props: {
        steps: ['Step 1', 'Step 2', 'Step 3'],
        currentStep: 0
      },
      hidden: {},
      options: [],
      children: []
    }
  };




export {fieldConfigs}