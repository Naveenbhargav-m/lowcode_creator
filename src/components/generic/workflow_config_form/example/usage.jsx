// App.jsx
import React, { useState } from 'react';
import ConfigForm from '../configForm';
import { globalStyle } from '../../../../styles/globalStyle';

const WorkflowConfigForm = () => {
  const [formValues, setFormValues] = useState({});
  
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
  
  const handleFormChange = (values) => {
    setFormValues(values);
    console.log('Form values changed:', values);
  };
  
  const handleFormSubmit = (values) => {
    console.log('Form submitted with values:', values);
    // alert('Configuration saved successfully!');
  };
  
  return (
    <div className="p-6" style={{...globalStyle}}>
      <h1 className="text-2xl font-bold mb-6">Workflow Configuration</h1>
      <ConfigForm
        config={formConfig}
        initialValues={initialValues}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
      />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Current Configuration:</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
          {JSON.stringify(formValues, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default WorkflowConfigForm;