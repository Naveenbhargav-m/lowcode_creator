import React, { useState } from 'react';
import FieldRenderer from './formRenderer';

const ConfigSection = ({ section, values, errors, onChange, readOnly }) => {
  const [isExpanded, setIsExpanded] = useState(!section.collapsed);
  
  return (
    <div className="config-section mb-4">
      <div 
        className="config-section-header p-3 bg-gray-100 rounded cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-medium">{section.title}</h3>
        <span className="text-gray-500">
          {isExpanded ? '▼' : '►'}
        </span>
      </div>
      
      {isExpanded && (
        <div className="config-section-content p-4 border border-gray-200 rounded-b">
          {section.description && (
            <p className="text-gray-600 mb-4">{section.description}</p>
          )}
          
          <div className="grid grid-cols-1 gap-4">
            {section.fields.map((field) => (
              <FieldRenderer
                key={field.id}
                field={field}
                value={values[field.id]}
                error={errors[field.id]}
                onChange={(value) => onChange(field.id, value)}
                readOnly={readOnly || field.readOnly}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigSection;
