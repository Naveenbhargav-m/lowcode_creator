import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Code, X } from 'lucide-react';


let textfieldStyle = {
    "borderRadius": "20px",
};

let colorPickerStyle = {
    "borderRadius": "20px",
    "padding": "8px"
};

let iconStyle = {
"color": "black"
};
// Reusable form components
const FormField = ({ label, children }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1" style={{"padding": "4px", "color": "grey"}}>{label}</label>
    {children}
  </div>
);

const TextField = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
    style={{ color: "black", width:"150px" }}
  />
);

const NumberField = ({ value, onChange, min, max }) => (
  <input
    type="number"
    value={value}
    onChange={onChange}
    min={min}
    max={max}
    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
    style={{ color: "black" }}
  />
);

const SelectField = ({ value, onChange, options }) => (
  <select 
    value={value} 
    onChange={onChange}
    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
    style={{ color: "black" }}
  >
    {options.map(option => (
      <option key={option.value} value={option.value}>{option.label}</option>
    ))}
  </select>
);

const ColorField = ({ color, onChange }) => (
  <div className="flex w-full">
    <input
      type="text"
      value={color}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-l-md border border-gray-300 px-3 py-2 text-sm flex-1"
      style={{ color: "black", width:"150px",...colorPickerStyle }}
    />
    <div className="flex items-center">
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded-r-md border border-l-0 border-gray-300 cursor-pointer"
        style={{...colorPickerStyle, padding:"0px", "backgroundColor":color, "border": "none"}}
      />
    </div>
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
      {isOpen ? <ChevronUp size={20} style={{...iconStyle}} /> : <ChevronDown size={20} style={{...iconStyle}} />}
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
            className="w-full h-96 font-mono text-sm p-4 border border-gray-300 rounded-md"
            style={{ color: "black" }}
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
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
        />
      );
    case 'number':
      return (
        <NumberField 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          min={field.min}
          max={field.max}
        />
      );
    case 'select':
      return (
        <SelectField 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          options={field.options}
        />
      );
    case 'color':
      return (
        <ColorField 
          color={value} 
          onChange={onChange}
        />
      );
    default:
      return (
        <TextField 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          placeholder={"NA"}
        />
      );
  }
};

// CSS parser helper
const parseCssText = (cssText) => {
  // Simple CSS parser for demonstration
  const styleData = {};
  
  // Extract property-value pairs
  const propertyRegex = /([a-zA-Z-]+)\s*:\s*([^;]+);/g;
  let match;
  
  while ((match = propertyRegex.exec(cssText)) !== null) {
    const property = match[1].trim();
    const value = match[2].trim();
    
    // Map CSS properties to our styleData structure
    // This is a simplified implementation - in a real app, you'd need more robust mapping
    if (property === 'background-color') {
      if (!styleData.background) styleData.background = {};
      styleData.background.color = value;
    } else if (property === 'color') {
      if (!styleData.typography) styleData.typography = {};
      styleData.typography.color = value;
    } else if (property === 'border-radius') {
      if (!styleData.borders) styleData.borders = {};
      styleData.borders.borderRadius = value;
    }
    // Add more mappings as needed
  }
  
  return styleData;
};

// Main component
export default function StyleConfig() {
  // Define configuration for sections and fields
  const styleConfig = {
    sections: [
      {
        id: 'basics',
        title: 'Basic Properties',
        fields: [
          { 
            id: 'color', 
            label: 'Color', 
            type: 'color',
            cssProperty: 'color',
            defaultValue: '#000000'
          },
          { 
            id: 'backgroundColor', 
            label: 'Background Color', 
            type: 'color',
            cssProperty: 'background-color',
            defaultValue: '#ffffff'
          },
          { 
            id: 'borderRadius', 
            label: 'Border Radius', 
            type: 'text',
            cssProperty: 'border-radius',
            defaultValue: '0'
          }
        ]
      },
      {
        id: 'typography',
        title: 'Typography',
        fields: [
          { 
            id: 'fontFamily', 
            label: 'Font Family', 
            type: 'select',
            cssProperty: 'font-family',
            defaultValue: 'Inter',
            options: [
              { value: 'Inter', label: 'Inter' },
              { value: 'Roboto', label: 'Roboto' },
              { value: 'Open Sans', label: 'Open Sans' }
            ]
          },
          { 
            id: 'fontSize', 
            label: 'Font Size', 
            type: 'text',
            cssProperty: 'font-size',
            defaultValue: '14px'
          },
          { 
            id: 'fontWeight', 
            label: 'Font Weight', 
            type: 'select',
            cssProperty: 'font-weight',
            defaultValue: '400',
            options: [
              { value: '300', label: 'Light (300)' },
              { value: '400', label: 'Regular (400)' },
              { value: '700', label: 'Bold (700)' }
            ]
          }
        ]
      },
      {
        id: 'spacing',
        title: 'Spacing',
        fields: [
          { 
            id: 'padding', 
            label: 'Padding', 
            type: 'text',
            cssProperty: 'padding',
            defaultValue: '0'
          },
          { 
            id: 'margin', 
            label: 'Margin', 
            type: 'text',
            cssProperty: 'margin',
            defaultValue: '0'
          }
        ]
      }
    ]
  };

  // Initialize state for open sections
  const [openSections, setOpenSections] = useState(() => {
    const initialState = {};
    styleConfig.sections.forEach((section, index) => {
      initialState[section.id] = index === 0; // Open first section by default
    });
    return initialState;
  });

  // Initialize styleData from config
  const initStyleData = () => {
    const data = {};
    styleConfig.sections.forEach(section => {
      data[section.id] = {};
      section.fields.forEach(field => {
        data[section.id][field.id] = field.defaultValue;
      });
    });
    return data;
  };

  // State for style data
  const [styleData, setStyleData] = useState(initStyleData);

  // State for CSS text
  const [cssText, setCssText] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Generate CSS text from styleData
  const generateCssText = () => {
    let css = '';
    
    styleConfig.sections.forEach(section => {
      css += `/* ${section.title} */\n`;
      section.fields.forEach(field => {
        const value = styleData[section.id][field.id];
        css += `${field.cssProperty}: ${value};\n`;
      });
      css += '\n';
    });
    
    return css;
  };

  // Update styleData when CSS text changes
  const updateStyleFromCss = (newCssText) => {
    const parsedStyles = parseCssText(newCssText);
    
    // Merge parsed styles into styleData
    // This is a simplified implementation - in a real app, you'd need more robust merging
    setStyleData(prevData => {
      const newData = { ...prevData };
      
      // Merge parsed styles into newData
      Object.keys(parsedStyles).forEach(sectionId => {
        if (newData[sectionId]) {
          newData[sectionId] = {
            ...newData[sectionId],
            ...parsedStyles[sectionId]
          };
        }
      });
      
      return newData;
    });
  };

  // Update CSS text when styleData changes
  useEffect(() => {
    setCssText(generateCssText());
  }, [styleData]);

  // Toggle function for accordion sections
  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Helper function to update style data
  const updateStyle = (sectionId, fieldId, value) => {
    setStyleData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [fieldId]: value
      }
    }));
  };

  // Open advanced editor
  const openAdvancedEditor = () => {
    setCssText(generateCssText());
    setIsEditorOpen(true);
  };

  // Apply changes from advanced editor
  const applyAdvancedChanges = () => {
    updateStyleFromCss(cssText);
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
          <div className="">
            {section.fields.map(field => (
              <FormField key={field.id} label={field.label}>
                <DynamicField 
                  field={field}
                  value={styleData[section.id][field.id]} 
                  onChange={(value) => updateStyle(section.id, field.id, value)}
                />
              </FormField>
            ))}
          </div>
        </AccordionSection>
      ))}

      {/* Preview area for the stylesheet */}
      <div className="border border-gray-200 rounded-md p-4">
        <h4 className="font-medium text-sm mb-2 text-gray-700">Style Preview</h4>
        <div className="bg-gray-50 p-3 rounded-md">
          <pre className="font-mono text-xs overflow-auto max-h-32 text-gray-700">
            {cssText}
          </pre>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-3">
        <button 
          className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700"
          onClick={() => setStyleData(initStyleData())}
        >
          Reset
        </button>
        <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md">
          Apply Changes
        </button>
      </div>

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