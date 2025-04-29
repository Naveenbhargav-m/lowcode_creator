// App.jsx
import React, { useState } from 'react';
import ConfigForm from '../configForm';
import { globalStyle } from '../../../../styles/globalStyle';

const WorkflowConfigForm = ({formConfig, initialValues}) => {
  const [formValues, setFormValues] = useState({});
    
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