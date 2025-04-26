import React, { useState } from 'react';
import { ToggleField, TextField, ScheduleField, ArrayField, ButtonGroupField, DateField, TimeField, SelectField } from './fields';
import { KeyValueListField } from '../../config_form_components/dataConfig';

const FieldRenderer = ({ field, value, error, onChange, readOnly }) => {
    const [fieldValue, setFieldValue] = useState(value);
  // Common field props
  const commonProps = {
    id: field.id,
    label: field.label,
    description: field.description,
    value: value,
    error: error,
    onChange: onChange,
    required: field.required,
    readOnly: readOnly || field.readOnly,
    placeholder: field.placeholder,
    validation: field.validation
  };
  
  // Determine which field component to render based on type
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'number':
      case 'email':
      case 'password':
        return <TextField {...commonProps} type={field.type} />;
        
      case 'toggle':
      case 'checkbox':
        return <ToggleField {...commonProps} />;
        
      case 'select':
      case 'dropdown':
        return <SelectField 
          {...commonProps} 
          options={field.options} 
          isMulti={field.isMulti}
          isSearchable={field.isSearchable} 
        />;
        
      case 'date':
        return <DateField {...commonProps} format={field.format} />;
        
      case 'time':
        return <TimeField {...commonProps} format={field.format} />;
        
      case 'array':
        return <ArrayField 
          {...commonProps} 
          itemType={field.itemType} 
          itemConfig={field.itemConfig}
          addLabel={field.addLabel || "Add Item"} 
        />;
      case 'mapping':
        return <KeyValueListField value={[...value]} onChange={(newdata) => {setFieldValue(newdata);}}/>
      case 'buttonGroup':
        return <ButtonGroupField {...commonProps} options={field.options} />;
        
      case 'schedule':
        return <ScheduleField {...commonProps} intervals={field.intervals} />;
        
      default:
        return <div className="text-red-500">Unknown field type: {field.type}</div>;
    }
  };
  
  return (
    <div className="field-container mb-4">
      {renderField()}
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};

export default FieldRenderer;
