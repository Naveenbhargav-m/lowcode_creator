// App.jsx
import React, { useEffect, useState } from 'react';
import {ConfigForm} from '../configForm';
import { globalStyle } from '../../../../styles/globalStyle';

const WorkflowConfigForm = ({ formConfigint, initialValuesInp, changeCallBack }) => {
  const [initialValues, setFormValues] = useState(initialValuesInp || {});
  const [formConfig, setFormConfig] = useState(formConfigint || {});

  useEffect(() => {
    console.log("setting the form config");
    setFormConfig(formConfigint || {});
    setFormValues(initialValuesInp || {});
  }, [formConfigint, initialValuesInp]);    
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
      {
        formConfig !== undefined ? (
          <ConfigForm
            config={formConfig}
            initialValues={initialValues}
            onChange={handleFormChange}
            onSubmit={handleFormSubmit}
          />
        ) : (
          <div>Pick a block</div>
        )
      }
    </div>
  );
};

export default WorkflowConfigForm;