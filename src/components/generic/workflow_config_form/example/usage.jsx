// App.jsx - Example of how to use the ConfigForm component

import React, { useState } from 'react';
import ConfigForm from '../configForm';
import workflowBlockConfig from './config';

const WorkflowFormusage = () => {
  const [formValues, setFormValues] = useState({
    blockName: "Data Processor",
    enabled: true,
    executionMode: "async",
    scheduleType: "interval",
    interval: "1h"
  });
  
  const handleChange = (values) => {
    console.log("Form values changed:", values);
    setFormValues(values);
  };
  
  const handleSave = (values) => {
    console.log("Form saved with values:", values);
    // Here you would typically save the configuration to your backend
    alert("Configuration saved successfully!");
  };
  
  const handleCancel = () => {
    console.log("Form editing cancelled");
    // Reset form or navigate away
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Workflow Block Configuration</h1>
      
      <ConfigForm
        config={workflowBlockConfig}
        initialValues={formValues}
        onChange={handleChange}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default WorkflowFormusage;