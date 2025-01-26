import { useState, useEffect } from 'preact/hooks';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Drop } from './Drop';
import { Rnd } from "react-rnd";
// @ts-ignore
import CodeEditor from '@uiw/react-textarea-code-editor'
// Components (you can reuse the ones I shared earlier)
const TextInput = ({ config, value, onChange }) => {
  // @ts-ignore
  const {label, labelPosition  ,wrapperStyle, inputStyle, labelStyle , error , errorStyle } = config || {};

  return (
    <div style={{ marginBottom: '1rem', ...wrapperStyle }}>
      {(labelPosition === "left" || labelPosition === "top") && (
        <label style={{ display: 'block', marginBottom: '4px', ...labelStyle }}>{label}</label>
      )}
      <input
        type="text"
        value={value || ''}
        // @ts-ignore
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: '8px', width: '100%' ,...inputStyle,}}
      />
      {(error &&  <div className="error text-red-500 mt-1" style={{ pointerEvents: 'none' }}>
            {error}
          </div>)}
      {(labelPosition === "right" || labelPosition === "bottom") && (
        <label style={{ display: 'block', marginTop: '4px', ...labelStyle }}>{label}</label>
      )}
    </div>
  );
};


const TextArea = ({ config, value, onChange }) => {
  const {
    label,
    labelPosition,
    wrapperStyle,
    inputStyle,
    labelStyle,
    error,
    errorStyle
  } = config || {};

  return (
    <div style={{ marginBottom: '1rem', ...wrapperStyle }}>
      {(labelPosition === "left" || labelPosition === "top") && (
        <label style={{ display: 'block', marginBottom: '4px', ...labelStyle }}>{label}</label>
      )}
      <textarea
        value={value || ''}
        // @ts-ignore
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: '8px', width: '100%', height:"100px", ...inputStyle }}
      />
      {error && (
        <div
          className="error text-red-500 mt-1"
          style={{ pointerEvents: 'none', ...errorStyle }}
        >
          {error}
        </div>
      )}
      {(labelPosition === "right" || labelPosition === "bottom") && (
        <label style={{ display: 'block', marginTop: '4px', ...labelStyle }}>{label}</label>
      )}
    </div>
  );
};

export const MyCodeEditor = ({ config, value, onChange }) => {
  const {
    label,
    labelPosition,
    wrapperStyle,
    inputStyle,
    labelStyle,
    error,
    errorStyle,
    language = "js", // default language to JS, configurable
    placeholder = "Please enter code here.", // default placeholder
  } = config || {};

  return (
    <div style={{ marginBottom: '1rem', ...wrapperStyle }}>
      {(labelPosition === "left" || labelPosition === "top") && (
        <label style={{ display: 'block', marginBottom: '4px', ...labelStyle }}>{label}</label>
      )}
      <CodeEditor
        value={value || 'return value;'}
        language={language}
        prefixCls='wrap'
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        data-color-mode="dark"
        padding={15}
        style={{
          backgroundColor: "#f5f5f5",
          fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace',
          width: '100%',
          minHeight: '100px',
          maxHeight: '300px',
          ...inputStyle,
        }}
      />
      {error && (
        <div
          className="error text-red-500 mt-1"
          style={{ pointerEvents: 'none', ...errorStyle }}
        >
          {error}
        </div>
      )}
      {(labelPosition === "right" || labelPosition === "bottom") && (
        <label style={{ display: 'block', marginTop: '4px', ...labelStyle }}>{label}</label>
      )}
    </div>
  );
};


const DualTextInput = ({ config, value, onChange }) => {
  const { wrapperStyle, inputStyle, labelStyle, containerStyle ,  label, labelPosition, inputNames  } = config;
  
  return (
    <div style={{marginBottom: '1rem',...wrapperStyle }}>
      {(labelPosition === "left" || labelPosition === "top") && (
        <label style={{ display: 'block', marginBottom: '4px',...labelStyle }}>{label}</label>
      )}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          ...containerStyle, // Apply container style for customization
        }}
      >
        {/* First Text Input */}
        <input
          type="text"
          value={value[inputNames[0]] || ''}
          // @ts-ignore
          onChange={(e) => onChange({ ...value, [inputNames[0]]: e.target.value })}
          style={{padding: '8px', width: '100%',...inputStyle }}
        />
        {/* Second Text Input */}
        <input
          type="text"
          value={value[inputNames[1]] || ''}
          // @ts-ignore
          onChange={(e) => onChange({ ...value, [inputNames[1]]: e.target.value })}
          style={ { padding: '8px', width: '100%' , ...inputStyle}}
        />
      </div>
      {(labelPosition === "right" || labelPosition === "bottom") && (
        <label style={{ display: 'block', marginTop: '4px', ...labelStyle }}>{label}</label>
      )}
    </div>
  );
};

const NumberInput = ({ config, value, onChange }) => {
  const { label, labelPosition,wrapperStyle, inputStyle, labelStyle } = config; 

  return (
    <div style={wrapperStyle || { marginBottom: '1rem' }}>
      {(labelPosition === "left" || labelPosition === "top") && (
        <label style={labelStyle || { display: 'block', marginBottom: '4px' }}>{label}</label>
      )}
      <input
        type="number"
        value={value || ''}
        // @ts-ignore
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle || { padding: '8px', width: '100%' }}
      />
      {(labelPosition === "right" || labelPosition === "bottom") && (
        <label style={labelStyle || { display: 'block', marginTop: '4px' }}>{label}</label>
      )}
    </div>
  );
};

const Dropdown = ({ config, value, onChange }) => {
  const { wrapperStyle, selectStyle, labelStyle ,  label, labelPosition, options } = config;

  return (
    <div style={wrapperStyle || { marginBottom: '1rem' }}>
      {(labelPosition === "left" || labelPosition === "top") && (
        <label style={labelStyle || { display: 'block', marginBottom: '4px' }}>{label}</label>
      )}
      <select
        value={value || ''}
        // @ts-ignore
        onChange={(e) => onChange(e.target.value)}
        style={selectStyle || { padding: '8px', width: '100%' }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(labelPosition === "right" || labelPosition === "bottom") && (
        <label style={labelStyle || { display: 'block', marginTop: '4px' }}>{label}</label>
      )}
    </div>
  );
};

const Checkbox = ({ config, value, onChange }) => {
  const { wrapperStyle, inputStyle, labelStyle , label, labelPosition} = config;

  return (
    <div style={wrapperStyle || { marginBottom: '1rem' }}>
      {(labelPosition === "left" || labelPosition === "top") && (
        <label style={labelStyle || { display: 'block', marginBottom: '4px' }}>{label}</label>
      )}
      <input
        type="checkbox"
        checked={value || false}
        // @ts-ignore
        onChange={(e) => onChange(e.target.checked)}
        style={inputStyle || { marginRight: '8px' }}
      />
      {(labelPosition === "right" || labelPosition === "bottom") && (
        <label style={labelStyle || { display: 'block', marginTop: '4px' }}>{label}</label>
      )}
    </div>
  );
};

// @ts-ignore
const Toggle = ({ config, value, onChange }) => {
  // @ts-ignore
  const {label, labelPosition,  wrapperStyle, inputStyle, labelStyle, toggleStyle } = config;

  return (
    <div style={wrapperStyle || { marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
      {/* Label on the Left or Top */}
      {(labelPosition === "left" || labelPosition === "top") && (
        <label style={labelStyle || { marginRight: '8px' }}>{label}</label>
      )}

      {/* Toggle Switch */}
      <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px', ...toggleStyle }}>
        <input
          type="checkbox"
          checked={value || false}
          // @ts-ignore
          onChange={(e) => onChange(e.target.checked)}
          style={{ opacity: 0, width: 0, height: 0 }}
        />
        <span
          style={{
            position: 'absolute',
            cursor: 'pointer',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: value ? '#4CAF50' : '#ccc',
            transition: '0.4s',
            borderRadius: '20px',
          }}
        ></span>
        <span
          style={{
            position: 'absolute',
            content: '',
            height: '16px',
            width: '16px',
            left: value ? '22px' : '4px',
            bottom: '2px',
            backgroundColor: 'white',
            transition: '0.4s',
            borderRadius: '50%',
          }}
        ></span>
      </label>

      {/* Label on the Right or Bottom */}
      {(labelPosition === "right" || labelPosition === "bottom") && (
        <label style={labelStyle || { marginLeft: '8px' }}>{label}</label>
      )}
    </div>
  );
};

const InlineTextField = ({ config, value, onChange }) => {
  const { } = config;
  const { label, labelPosition = 'left' ,wrapperStyle, inputStyle, labelStyle } = config;

  return (
    <div style={{ display: 'flex', alignItems: 'center', ...wrapperStyle }}>
      {/* Label on the Left */}
      {labelPosition === 'left' && (
        <label style={{ marginRight: '8px', ...labelStyle }}>{label}</label>
      )}

      {/* Input Field */}
      <input
        type="text"
        value={value || ''}
        // @ts-ignore
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '50px', textAlign: 'center', ...inputStyle }}
      />

      {/* Label on the Right */}
      {labelPosition === 'right' && (
        <label style={{ marginLeft: '8px', ...labelStyle }}>{label}</label>
      )}
    </div>
  );
};



const ButtonGroup = ({ config, value, onChange }) => {
  const { label, labelPosition = 'top', buttons,wrapperStyle, labelStyle, buttonStyle, selectedButtonStyle } = config || {};

  return (
    <div style={{ ...wrapperStyle }}>
      {/* Label on Top */}
      {labelPosition === 'top' && (
        <label style={{ marginBottom: '8px', ...labelStyle }}>{label}</label>
      )}

      {/* Button Group */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {buttons.map((button, index) => (
          <button
            key={index}
            style={
              value === button.value
                ? { ...buttonStyle, ...selectedButtonStyle }
                : buttonStyle
            }
            onClick={() => onChange(button.value)}
          >
            {button.label}
          </button>
        ))}
      </div>

      {/* Label on Left */}
      {labelPosition === 'left' && (
        <label style={{ marginRight: '8px', ...labelStyle }}>{label}</label>
      )}
    </div>
  );
};

const InlineTextWithField = ({ config, value, onChange }) => {
  // @ts-ignore
  const { textBefore, textAfter, fieldName,wrapperStyle, inputStyle, textStyle } = config || {};

  return (
    <div style={{ display: 'flex', alignItems: 'center', ...wrapperStyle }}>
      <span style={{ marginRight: '8px', ...textStyle }}>{textBefore}</span>
      
      {/* Input Field */}
      <input
        type="text"
        value={value || ''}
        // @ts-ignore
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '40px', textAlign: 'center', ...inputStyle }}
      />
      
      <span style={{ marginLeft: '8px', ...textStyle }}>{textAfter}</span>
    </div>
  );
};



const RadioGroup = ({ config, value, onChange }) => {
  const { label, options,wrapperStyle, labelStyle, radioStyle } =  config || {};

  return (
    <div style={wrapperStyle || { marginBottom: '1rem' }}>
      {label && <label style={labelStyle || { display: 'block', marginBottom: '4px' }}>{label}</label>}
      {options.map((option) => (
        <label key={option.value} style={labelStyle || { display: 'block', marginBottom: '4px' }}>
          <input
            type="radio"
            name={config.fieldName}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            style={radioStyle || { marginRight: '8px' }}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

const RadioButtons = ({ config, value, onChange }) => {
  const { label, options, labelPosition = 'right', direction = 'row',wrapperStyle, labelStyle } = config || {};

  return (
    <div style={wrapperStyle || { marginBottom: '1rem' }}>
      {/* Main Label at the Top */}
      {labelPosition === 'top' && label && (
        <label style={labelStyle || { display: 'block', marginBottom: '4px' }}>
          {label}
        </label>
      )}

      {/* Radio Buttons Group */}
      <div class={`mb-6 flex gap-y-2 gap-x-4 ${direction === 'row' ? 'lg:flex-row' : 'flex-col'}`}>
        {options.map((option, index) => (
          <div
            key={index}
            class={`flex items-center rounded-xl px-4 py-3 font-medium text-gray-700 cursor-pointer ${
              value === option.value ? 'bg-black text-white' : 'bg-gray-50'
            }`}
            onClick={() => {
              onChange(option.value); 
              console.log("clicked me");
              console.log(option.value);
            }}
          >
            {option.position === 'left' && (
              <span class="mr-2">{option.label}</span>
            )}

            {/* Radio Button */}
            <input
              class=""
              type="radio"
              name={config.fieldName}
              id={`radio${index}`}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)} // Trigger state change on selection
            />       

            {/* Conditionally render the label on the right side if option.position is 'right' */}
            {option.position === 'right' && (
              <span class="ml-2">{option.label}</span>
            )}
          </div>
        ))}
      </div>

      {/* Main Label at the Bottom */}
      {labelPosition === 'bottom' && label && (
        <label style={labelStyle || { display: 'block', marginTop: '4px' }}>
          {label}
        </label>
      )}
    </div>
  );
};



import * as Icons from 'lucide-react'; // Import Lucide icons

// @ts-ignore
const IconButtons = ({ config, styles, value, onChange }) => {
  const { icons, layout = 'row', gridConfig = { rowLength: 3 } , wrapperStyle, buttonStyle, iconStyle } = config;

  const renderIcons = () => {
    return icons.map((iconName, index) => {
      const IconComponent = Icons[iconName];
      return (
        <button 
          key={index} 
          onClick={() => onChange(iconName)}
          style={buttonStyle || { padding: '8px' }}
        >
          <IconComponent style={iconStyle || {}} size={24} />
        </button>
      );
    });
  };

  const getLayoutStyle = () => {
    switch (layout) {
      case 'grid':
        return { 
          display: 'grid', 
          gridTemplateColumns: `repeat(${gridConfig.columnCount}, 1fr)` 
        };
      case 'column':
        return { display: 'flex', flexDirection: 'column' };
      default:
        return { display: 'flex', flexDirection: 'row' };
    }
  };

  return (
    <div style={{ ...wrapperStyle, ...getLayoutStyle() }}>
      {renderIcons()}
    </div>
  );
};

// @ts-ignore
const ImageButtons = ({ config, styles, value, onChange }) => {
  const { images, layout = 'row', gridConfig = { columnCount: 3 } , wrapperStyle, buttonStyle, imageStyle} = config;

  const renderImages = () => {
    return images.map((imgSrc, index) => (
      <button 
        key={index} 
        onClick={() => onChange(imgSrc)} 
        style={buttonStyle || { padding: '8px' }}
      >
        <img src={imgSrc} alt={`img-${index}`} style={imageStyle || { width: '50px', height: '50px' }} />
      </button>
    ));
  };

  const getLayoutStyle = () => {
    switch (layout) {
      case 'grid':
        return { display: 'grid', gridTemplateColumns: `repeat(${gridConfig.columnCount}, 1fr)` };
      case 'column':
        return { display: 'flex', flexDirection: 'column' };
      default:
        return { display: 'flex', flexDirection: 'row' };
    }
  };

  return (
    <div style={{ ...wrapperStyle, ...getLayoutStyle() }}>
      {renderImages()}
    </div>
  );
};

// @ts-ignore
const CardButtons = ({ config, value, onChange }) => {
  const { cards, wrapperStyle, cardStyle } = config || {};

  return (
    <div style={wrapperStyle || { display: 'flex', gap: '1rem' }}>
      {cards.map((card, index) => (
        <div
          key={index}
          style={cardStyle || { padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}
          onClick={() => onChange(card)}
        >
          <h3>{card.title}</h3>
          <p>{card.description}</p>
        </div>
      ))}
    </div>
  );
};

// @ts-ignore
const CustomOptionComponent = ({ config, value, onChange }) => {
  const { options,wrapperStyle, optionStyle } = config || {};

  return (
    <div style={wrapperStyle || { display: 'flex', gap: '1rem' }}>
      {options.map((option, index) => (
        <div
          key={index}
          style={optionStyle || { padding: '1rem', border: '1px solid #ccc' }}
          onClick={() => onChange(option.value)}
        >
          {option.customComponent || option.label}
        </div>
      ))}
    </div>
  );
};

// @ts-ignore
const ImagePicker = ({ config, value, onChange }) => {
  const { label, uploadButtonText,wrapperStyle, labelStyle, inputStyle, buttonStyle } = config || {};

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange(URL.createObjectURL(file));
    }
  };

  return (
    <div style={wrapperStyle || { marginBottom: '1rem' }}>
      {label && <label style={labelStyle || { display: 'block', marginBottom: '4px' }}>{label}</label>}
      <input type="file" accept="image/*" onChange={handleImageChange} style={inputStyle || { marginBottom: '8px' }} />
      <button style={buttonStyle || { padding: '8px 16px' }}>
        {uploadButtonText || 'Upload Image'}
      </button>
      {value && <img src={value} alt="Selected" style={{ marginTop: '8px', maxWidth: '100%' }} />}
    </div>
  );
};


// @ts-ignore
const DateTimePicker = ({ config, value, onChange }) => {
  const { label, type = 'datetime-local' ,wrapperStyle, labelStyle, inputStyle } = config || {};

  return (
    <div style={wrapperStyle || { marginBottom: '1rem' }}>
      {label && <label style={labelStyle || { display: 'block', marginBottom: '4px' }}>{label}</label>}
      <input 
        type={type} 
        value={value || ''} 
        // @ts-ignore
        onChange={(e) => onChange(e.target.value)} 
        style={inputStyle || { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
      />
    </div>
  );
};

// @ts-ignore
const MonthPicker = ({ config, value, onChange }) => {
  const { label,wrapperStyle, labelStyle, inputStyle } = config || {};

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div style={wrapperStyle || { marginBottom: '1rem' }}>
      {label && <label style={labelStyle || { display: 'block', marginBottom: '4px' }}>{label}</label>}
      <select 
        value={value || ''} 
        // @ts-ignore
        onChange={(e) => onChange(e.target.value)} 
        style={inputStyle || { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      >
        <option value="">Select Month</option>
        {months.map((month, index) => (
          <option key={index} value={index + 1}>{month}</option>
        ))}
      </select>
    </div>
  );
};

// @ts-ignore
const WeekPicker = ({ config, value, onChange }) => {
  const { label,wrapperStyle, labelStyle, inputStyle } = config || {};

  return (
    <div style={wrapperStyle || { marginBottom: '1rem' }}>
      {label && <label style={labelStyle || { display: 'block', marginBottom: '4px' }}>{label}</label>}
      <input 
        type="week" 
        value={value || ''} 
        // @ts-ignore
        onChange={(e) => onChange(e.target.value)} 
        style={inputStyle || { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
      />
    </div>
  );
};

// @ts-ignore
const TimePicker = ({ config, value, onChange }) => {
  const { label,wrapperStyle, labelStyle, inputStyle } = config || {};

  return (
    <div style={wrapperStyle || { marginBottom: '1rem' }}>
      {label && <label style={labelStyle || { display: 'block', marginBottom: '4px' }}>{label}</label>}
      <input 
        type="time" 
        value={value || ''} 
        // @ts-ignore
        onChange={(e) => onChange(e.target.value)} 
        style={inputStyle || { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
      />
    </div>
  );
};


import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Custom styling for calendar
// @ts-ignore
import { checkCollision, form_elements_data, handleFormElementDrop, user_form_layouts, user_forms_data } from '../../form_builder/form_state';

// @ts-ignore
const CalendarComponent = ({ config, styles, value, onChange }) => {
  const { label } = config;
  // @ts-ignore
  const { wrapperStyle, labelStyle, calendarStyle } = styles || {};

  return (
    <div style={wrapperStyle || { marginBottom: '1rem' }}>
      {label && <label style={labelStyle || { display: 'block', marginBottom: '4px' }}>{label}</label>}
      <Calendar
        onChange={onChange}
        value={value || new Date()}
      />
    </div>
  );
};




const ResponsiveGridLayout = WidthProvider(Responsive);
// @ts-ignore
const FormRenderer = ({ formConfig, formData, styles, onFormChange, onSubmit }) => {
  const [formValues, setFormValues] = useState(formData || {});
  const [errors, setErrors] = useState({});

  const handleChange = (fieldName, value) => {
    const updatedValues = { ...formValues, [fieldName]: value };

    // Apply dependencies logic
    formConfig.forEach((field) => {
      console.log("field:",field);
      if (field.dependencies) {
        field.dependencies.forEach((dep) => {
          if (dep.field === fieldName && dep.condition(value)) {
            switch (dep.action) {
              case 'setValue':
                updatedValues[field.fieldName] = dep.value;
                break;
              default:
                break;
            }
          }
        });
      }
    });

    setFormValues(updatedValues);
    if (onFormChange) onFormChange(updatedValues);
  };

  const renderField = (field) => {
    const commonProps = {
      config: field,
      value: formValues[field.fieldName] || '',
      onChange: (value) => handleChange(field.fieldName, value),
    };

    // Handle visibility logic based on `showIf`
    if (field.showIf && !field.showIf(formValues)) {
      console.log("in the show if,", formValues);
      return null;
    }

    return (
      <div className="field-container">
        {/* Render the input field */}
        {(() => {
          switch (field.type) {
            case 'text':
              return <TextInput {...commonProps} />;
            case 'dualText':
              return <DualTextInput {...commonProps} />;
            case 'number':
              return <NumberInput {...commonProps} />;
            case 'dropdown':
              return <Dropdown {...commonProps} />;
            case 'checkbox':
              return <Checkbox {...commonProps} />;
            case 'radio':
              return <RadioGroup {...commonProps} />;
            case 'radio-buttons':
              return <RadioButtons {...commonProps} />;
            case 'inline-text-with-field':
              return <InlineTextWithField {...commonProps} />;
            case 'button-group':
              return <ButtonGroup {...commonProps} />;
            case 'inline-text':
              return <InlineTextField {...commonProps} />;
            case 'textarea':
              return <TextArea {...commonProps} />;
            default:
              return null;
          }
        })()}

        {errors[field.fieldName] && (
          <div className="error text-red-500 mt-1" style={{ pointerEvents: 'none' }}>
            {errors[field.fieldName]}
          </div>
        )}
      </div>
    );
  };

  const handleValidation = () => {
    let newErrors = {};

    formConfig.forEach((field) => {
      const value = formValues[field.fieldName];
      if (field.configs.validation && !field.configs.validation(value)) {
        newErrors[field.fieldName] = field.errorMessage || 'Invalid value';
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (handleValidation()) {
      onSubmit(formValues);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <form onSubmit={handleSubmit}>
        <Drop onDrop={(data) => handleFormElementDrop(data)} dropElementData={{ element: "screen" }}>
          {user_forms_data.value.length === 0 ? (
            <div className="min-h-screen"></div>
          ) : (
            formConfig.map((field, index) => {
              return (
                <Rnd
                  key={field.i}
                  style={{ zIndex: 10 }}
                  position={{ x: field.position.x, y: field.position.y }}
                  size={{ width: field.size.width, height: field.size.height }}
                  // @ts-ignore
                  onDragStop={(e, d) => {
                    const newPosition = { x: d.x, y: d.y };
                    if (!checkCollision(newPosition, index)) {
                      field.position = newPosition;
                      user_forms_data.value = [...user_forms_data.value];
                    } else {
                      console.log("Collision detected!"); // Optionally notify the user
                    }
                  }}
                  // @ts-ignore
                  onResizeStop={(e, direction, ref, delta, position) => {
                    field.size = { width: ref.offsetWidth, height: ref.offsetHeight };
                    field.position = position;
                    user_forms_data.value = [...user_forms_data.value]; // Trigger reactivity
                  }}
                  className="border-2 border-gray-300"
                >
                  {renderField(field.configs)}
                </Rnd>
              );
            })
          )}
        </Drop>
      </form>
    </div>
  );
};



 {/* <button
        type="submit"
        className={styles.submit || 'bg-black px-4 py-2 mt-4 text-white rounded-lg'}
      >
        Submit
      </button> */}





export const FormRendererStatic = ({ formConfig, formData, styles, onFormChange, onSubmit }) => {
  const [formValues, setFormValues] = useState({...formData});
  const [errors, setErrors] = useState({});
  const [layout, setLayout] = useState([]);
  console.log("prefill data:",formData);
  // Sync formValues with formData when formData changes
  useEffect(() => {
    setFormValues({ ...formData });
  }, [formData]);

  useEffect(() => {
    const initialLayout = formConfig.map((field) => field.layout);
    setLayout(initialLayout);
  }, [formConfig]);

  const handleChange = (fieldName, value) => {
    const updatedValues = { ...formValues, [fieldName]: value };

    // Apply dependencies logic
    formConfig.forEach((field) => {
      if (field.dependencies) {
        field.dependencies.forEach((dep) => {
          if (dep.field === fieldName && dep.condition(value)) {
            switch (dep.action) {
              case 'setValue':
                updatedValues[field.fieldName] = dep.value;
                break;
              default:
                break;
            }
          }
        });
      }
    });

    setFormValues(updatedValues);
    if (onFormChange) onFormChange(updatedValues);
  };

  const renderField = (field) => {
    const commonProps = {
      config: field,
      value: formValues[field.fieldName] || '',
      onChange: (value) => handleChange(field.fieldName, value),
    };

    // Handle visibility logic based on `showIf`
    if (field.showIf && !field.showIf(formValues)) {
      return null;
    }

    return (
      <div className="field-container">
        {/* Render the input field */}
        {(() => {
          switch (field.type) {
            case 'text':
              return <TextInput {...commonProps} />;
            case 'dualText':
              return <DualTextInput {...commonProps} />;
            case 'number':
              return <NumberInput {...commonProps} />;
            case 'dropdown':
              return <Dropdown {...commonProps} />;
            case 'checkbox':
              return <Checkbox {...commonProps} />;
            case 'radio':
              return <RadioGroup {...commonProps} />;
            case 'radio-buttons':
              return <RadioButtons {...commonProps} />;
            case 'inline-text-with-field':
              return <InlineTextWithField {...commonProps} />;
            case 'button-group':
              return <ButtonGroup {...commonProps} />;
            case 'inline-text':
              return <InlineTextField {...commonProps} />;
            case 'textarea':
             return <TextArea {...commonProps}/>
            case 'code_editor':
              return <MyCodeEditor {...commonProps}/>
            default:
              return null;
          }
        })()}

        {errors[field.fieldName] && (
          <div className="error text-red-500 mt-1" style={{ pointerEvents: 'none' }}>
            {errors[field.fieldName]}
          </div>
        )}
      </div>
    );
  };

  const handleValidation = () => {
    let newErrors = {};

    formConfig.forEach((field) => {
      const value = formValues[field.fieldName];
      if (field.validation && !field.validation(value)) {
        newErrors[field.fieldName] = field.errorMessage || 'Invalid value';
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (handleValidation()) {
      onSubmit(formValues);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 300 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={15}
        onLayoutChange={setLayout}
        margin={[1, 1]}
        compactType={null}
        style={{ pointerEvents: 'none', ...styles.form }} // Make entire layout click-through
      >
        {formConfig.map((field, index) => (
          <div
            key={field.fieldName}
            data-grid={layout[index]}
            style={{ pointerEvents: 'auto' }} // Re-enable click on specific form fields
          >
            {renderField(field)}
          </div>
        ))}
      </ResponsiveGridLayout>
      <button
        type="submit"
        className='bg-black px-4 py-2 mt-4 text-white rounded-lg'
        style={{...styles.submit}}
      >
        {(styles!== undefined && styles.submit !== undefined) ? styles.submit.text ||"Submit": "Submit"}
      </button>
    </form>
  );
};


export default FormRenderer;




