import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Code, X } from 'lucide-react';


let styles = {
  "text_field": {"color": "black", "width": "200px"},
  "color_field": {"color": "black", "width": "200px"},
  "select_field": {"color": "black", "width": "200px"},
  "number_field": {"color": "black", "width": "200px"},
  "label_style": {"padding": "5px 0px"}
};

// Form components with simplified styling
const FormField = ({ label, children }) => (
  <div className="">
    <label className="block text-xs text-gray-500 mb-1" style={{...styles["label_style"]}}>{label}</label>
    {children}
  </div>
);

const TextField = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full rounded-md border border-gray-300 text-sm text-black"
    style={{...styles["text_field"]}}
  />
);

const NumberField = ({ value, onChange, min, max }) => (
  <input
    type="number"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    min={min}
    max={max}
    className="w-full rounded-md border border-gray-300 px-3 text-sm text-black"
    style={{...styles["number_field"]}}
  />
);

const SelectField = ({ value, onChange, options }) => (
  <select 
    value={value} 
    onChange={(e) => onChange(e.target.value)}
    className="w-full rounded-md border border-gray-300 text-sm text-black"
    style={{...styles["select_field"]}}
  >
    {options.map(option => (
      <option key={option.value} value={option.value}>{option.label}</option>
    ))}
  </select>
);

const ColorField = ({ value, onChange }) => (
  <div className="flex w-full"
  style={{...styles["color_field"]}}
  >
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-l-md border border-gray-300 text-sm flex-1 text-black"
      style={{...styles["text_field"]}}
    />
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-12 h-10 rounded-r-md border border-gray-300 cursor-pointer"
      style={{ backgroundColor: value, padding: "15px"}}
    />
  </div>
);

// Accordion section component
const AccordionSection = ({ title, children, isOpen, toggle }) => (
  <div className="border border-gray-200 rounded-md overflow-hidden mb-3">
    <button
      className="flex items-center justify-between w-full bg-gray-50 px-4 py-2 text-left"
      onClick={toggle}
    >
      <span className="font-medium text-gray-700">{title}</span>
      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
    {isOpen && <div className="p-4 space-y-4">{children}</div>}
  </div>
);

// Advanced Editor Modal Component
const AdvancedEditorModal = ({ isOpen, onClose, cssText, onChange, onApply }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-4/5 max-w-4xl max-h-5/6 flex flex-col">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-lg font-medium">Advanced CSS Editor</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 flex-grow overflow-auto">
          <textarea
            value={cssText}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-96 font-mono text-sm p-4 border border-gray-300 rounded-md text-black"
            placeholder="Enter your CSS here..."
          />
        </div>
        
        <div className="border-t px-6 py-4 flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700"
          >
            Cancel
          </button>
          <button 
            onClick={onApply}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// Dynamic field renderer based on field type
const DynamicField = ({ field, value, onChange }) => {
  switch (field.type) {
    case 'text':
      return (
        <TextField 
          value={value} 
          onChange={onChange}
          placeholder={field.placeholder}
        />
      );
    case 'number':
      return (
        <NumberField 
          value={value} 
          onChange={onChange}
          min={field.min}
          max={field.max}
        />
      );
    case 'select':
      return (
        <SelectField 
          value={value} 
          onChange={onChange}
          options={field.options}
        />
      );
    case 'color':
      return (
        <ColorField 
          value={value} 
          onChange={onChange}
        />
      );
    default:
      return (
        <TextField 
          value={value} 
          onChange={onChange}
          placeholder="Enter value"
        />
      );
  }
};

// Main component
export default function StyleConfig({styleConfig, defaultValues, updateCallback}) {

  // State for open sections
  const [openSections, setOpenSections] = useState(() => {
    const initialState = {};
    styleConfig.sections.forEach((section, index) => {
      initialState[section.id] = index === 0; // Open first section by default
    });
    return initialState;
  });



  // State for style values - separate from config
  const [styleValues, setStyleValues] = useState({...defaultValues});
  console.log("called with style values:",styleValues, defaultValues);
  // Add this useEffect to update styleValues when defaultValues changes
useEffect(() => {
  setStyleValues(prevValues => {
    // If you want to completely replace values with defaultValues
    return {...defaultValues};
    
    // Or if you want to merge, but prioritize defaultValues
    // return {...prevValues, ...defaultValues};
  });
}, [defaultValues]);
  // State for CSS text
  const [cssText, setCssText] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Function to update style values and notify parent component
  function updateStyleValues(sectionId, fieldId, value) {
    setStyleValues(prev => {
      const newValues = {
        ...prev,
        [fieldId]: value
      };
      
      // Notify parent about the update
      notifyParentOfUpdate(newValues);
      return newValues;
    });
  }

  // Function to notify parent component of style updates
  function notifyParentOfUpdate(styles) {
    updateCallback(styles);
  }

  // Toggle function for accordion sections
  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Generate CSS text from styleValues
  const generateCssText = () => {
    let css = '';
    
    styleConfig.sections.forEach(section => {
      css += `/* ${section.title} */\n`;
      section.fields.forEach(field => {
        const value = styleValues[field.id];
        css += `${field.cssProperty}: ${value};\n`;
      });
      css += '\n';
    });
    
    return css;
  };

  // Parse CSS text and update styleValues
  const parseCssText = (cssText) => {
    const newValues = { ...styleValues };
    
    // Simple regex to extract property-value pairs
    const propertyRegex = /([a-zA-Z-]+)\s*:\s*([^;]+);/g;
    let match;
    
    while ((match = propertyRegex.exec(cssText)) !== null) {
      const property = match[1].trim();
      const value = match[2].trim();
      
      // Find the section and field for this CSS property
      styleConfig.sections.forEach(section => {
        section.fields.forEach(field => {
          if (field.cssProperty === property) {
            newValues[field.id] = value;
          }
        });
      });
    }
    
    return newValues;
  };

  // Update CSS text when styleValues changes
  useEffect(() => {
    setCssText(generateCssText());
  }, [styleValues]);

  // Open advanced editor
  const openAdvancedEditor = () => {
    setCssText(generateCssText());
    setIsEditorOpen(true);
  };

  // Apply changes from advanced editor
  const applyAdvancedChanges = () => {
    const newValues = parseCssText(cssText);
    setStyleValues(newValues);
    notifyParentOfUpdate(newValues);
    setIsEditorOpen(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">Style Properties</h3>
        <button 
          className="flex items-center gap-1 text-sm text-blue-600 font-medium"
          onClick={openAdvancedEditor}
        >
          <Code size={16} />
          Advanced
        </button>
      </div>

      {/* Dynamic sections */}
      {styleConfig.sections.map(section => (
        <AccordionSection 
          key={section.id}
          title={section.title} 
          isOpen={openSections[section.id]} 
          toggle={() => toggleSection(section.id)}
        >
          <div className="grid grid-cols-1 gap-4">
            {section.fields.map(field => (
              <FormField key={field.id} label={field.label}>
                <DynamicField 
                  field={field}
                  value={styleValues[field.id]} 
                  onChange={(value) => updateStyleValues(section.id, field.id, value)}
                />
              </FormField>
            ))}
          </div>
        </AccordionSection>
      ))}

      {/* Advanced Editor Modal */}
      <AdvancedEditorModal 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        cssText={cssText}
        onChange={setCssText}
        onApply={applyAdvancedChanges}
      />
    </div>
  );
}