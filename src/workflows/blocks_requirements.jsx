
/*

 // Example configuration
  const formConfig = {
    sections: [
      {
        id: 'basic',
        title: 'basic',
        groups: [
          {
            id: 'general',
            title: 'General Settings',
            fields: [
              {
                id: 'workflowName',
                type: 'text',
                label: 'Workflow Name',
                description: 'Enter a name for this workflow',
                placeholder: 'My Workflow',
                required: true
              },
              {
                id: 'workflowType',
                type: 'select',
                label: 'Workflow Type',
                description: 'Select the type of workflow',
                options: [
                  { value: 'sequential', label: 'Sequential' },
                  { value: 'parallel', label: 'Parallel' },
                  { value: 'conditional', label: 'Conditional' }
                ],
                required: true
              }
            ]
          },
          {
            id: 'timeout',
            title: 'Timeout Settings',
            fields: [
              {
                id: 'timeoutEnabled',
                type: 'select',
                label: 'Enable Timeout',
                options: [
                  { value: 'true', label: 'Yes' },
                  { value: 'false', label: 'No' }
                ]
              },
              {
                id: 'timeoutDuration',
                type: 'text',
                label: 'Timeout Duration (seconds)',
                dependencies: [
                  { field: 'timeoutEnabled', value: 'true', show: true }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'advanced',
        title: 'Advanced',
        groups: [
          {
            id: 'variables',
            title: 'Environment Variables',
            fields: [
              {
                id: 'environmentVariables',
                type: 'keyValue',
                label: 'Environment Variables',
                description: 'Define environment variables for this workflow',
                keyLabel: 'Variable Name',
                valueLabel: 'Variable Value'
              }
            ]
          },
          {
            id: 'steps',
            title: 'Workflow Steps',
            fields: [
              {
                id: 'workflowSteps',
                type: 'array',
                label: 'Workflow Steps',
                description: 'Define the steps in this workflow'
              }
            ]
          }
        ]
      }
    ]
  };
  
  // Initial values for the form
  const initialValues = {
    workflowName: 'Data Processing Workflow',
    workflowType: 'sequential',
    timeoutEnabled: 'true',
    timeoutDuration: '300',
    environmentVariables: {
      'API_KEY': '12345',
      'BASE_URL': 'https://api.example.com'
    },
    workflowSteps: [
      'Fetch Data',
      'Process Data',
      'Store Results'
    ]
  };

*/
let blocksRequirements = {
   "start": {
    "label": "start",
    "description": "This is the start of workflow, that also take global state for workflow",
    "inputs": {
      "workflow_state": "mapping",
      "is_background": "toggle",
      "name": "text"
    },
   },
   "end": {
    "label": "End",
    "description": "This is the end of the workflow",
    "outputs": {
      "output_mapping": "mapping",
      "call_flow": "dropdown",
      "name": "text"
    },
   }
};

let blockFormRequirements = {
  "start": {
    "sections": [{
       "id": "workflow Config",
       "title": "Workflow Config",
       "groups": [
          {
            "id": "global_data",
            "title": "global_data",
            "fields": [
              {
                "id": "workflow_state",
                "label": "workflow_state",
                "type": "mapping",
                "description": "global state for the workflow, all the subsequent blocks will have access."
              },
            ],
          },
       ],
    }],
  },
  "end": {
    "sections": [
      {
       "id": "output Config",
       "title": "output Config",
       "groups": [
          {
            "id": "output_data",
            "title": "output_data",
            "fields": [
              {
                "id": "output_mapping",
                "label": "output_mapping",
                "type": "mapping",
                "description": "output mapping from the workflow."
              },
            ],
          },
       ],
      }
      ],
  },
};
export {blocksRequirements, blockFormRequirements};