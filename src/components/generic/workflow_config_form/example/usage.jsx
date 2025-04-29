// App.jsx
import React, { useState } from 'react';
import {ConfigForm} from '../configForm';
import { globalStyle } from '../../../../styles/globalStyle';

const WorkflowConfigForm = ({formConfig, initialValues, changeCallBack}) => {
  const [formValues, setFormValues] = useState({});
    
  const handleFormChange = (values) => {
    setFormValues(values);
    console.log('Form values changed:', values);
    changeCallBack(values);
  };
  
  const handleFormSubmit = (values) => {
    console.log('Form submitted with values:', values);
  };
  
  return (
<div style={{...globalStyle, width: "100%"}}>
  <ConfigForm
    config={formConfig}
    initialValues={initialValues}
    onChange={handleFormChange}
    onSubmit={handleFormSubmit}
  />
  
  {/* <div className="mt-8">
    <h2 className="text-xl font-semibold mb-2">Current Configuration:</h2>
    <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
      {JSON.stringify(formValues, null, 2)}
    </pre>
  </div> */}
</div>
  );
};

export default WorkflowConfigForm;