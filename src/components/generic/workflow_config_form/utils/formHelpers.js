export const processFormValues = (values, tabs) => {
    // Process values before saving (e.g., format dates, etc.)
    const processedValues = { ...values };
    
    // Process each field according to its type
    tabs.forEach(tab => {
      tab.sections.forEach(section => {
        section.fields.forEach(field => {
          const value = processedValues[field.id];
          
          if (value !== undefined) {
            switch (field.type) {
              case 'date':
                // Ensure consistent date format
                if (field.saveFormat && value) {
                  // Implement date formatting logic here
                }
                break;
                
              case 'time':
                // Ensure consistent time format
                if (field.saveFormat && value) {
                  // Implement time formatting logic here
                }
                break;
                
              // Add more type-specific processing as needed
            }
          }
        });
      });
    });
    
    return processedValues;
  };
  
  export const validateConfig = (values, tabs) => {
    const errors = {};
    
    tabs.forEach(tab => {
      tab.sections.forEach(section => {
        section.fields.forEach(field => {
          const value = values[field.id];
          
          // Check required fields
          if (field.required && (value === undefined || value === null || value === '')) {
            errors[field.id] = `${field.label || field.id} is required`;
          }
          
          // Check field-specific validation
          if (field.validate && value !== undefined) {
            const error = field.validate(value, values);
            if (error) {
              errors[field.id] = error;
            }
          }
          
          // Type-specific validation
          if (value !== undefined && value !== null && value !== '') {
            switch (field.type) {
              case 'email':
                if (!/\S+@\S+\.\S+/.test(value)) {
                  errors[field.id] = 'Please enter a valid email address';
                }
                break;
                
              case 'number':
                if (isNaN(Number(value))) {
                  errors[field.id] = 'Please enter a valid number';
                }
                if (field.min !== undefined && value < field.min) {
                  errors[field.id] = `Value must be at least ${field.min}`;
                }
                if (field.max !== undefined && value > field.max) {
                  errors[field.id] = `Value must be at most ${field.max}`;
                }
                break;
                
              // Add more type-specific validation as needed
            }
          }
        });
      });
    });
    
    return errors;
  };