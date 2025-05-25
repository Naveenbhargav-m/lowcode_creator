import { useEffect } from "preact/hooks";
import { addVariable, LoadSignals, newVariableKey, variableKeys } from "../states/global_state";

const VariableCreator = () => {

    // Inline styles for layout
    const containerStyle = {
      padding: '20px',
      maxWidth: '300px',
      margin: 'auto',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    };
    const inputStyle = {
      padding: '8px',
      width: '100%',
      marginBottom: '10px',
      borderRadius: '4px',
      border: '1px solid #ddd'
    };
    const buttonStyle = {
      padding: '8px 12px',
      backgroundColor: '#000000',
      color: '#ffffff',
      border: 'none',
      borderRadius: '16px',
      cursor: 'pointer',
      width: '100%',
      fontWeight: 'bold'
    };
    const listStyle = {
      listStyleType: 'none',
      padding: 0,
      marginTop: '15px'
    };
    const listItemStyle = {
      padding: '8px',
      borderBottom: '1px solid #ddd',
      color:"#000000"
    };
  
    useEffect(()=> {
      LoadSignals();
    },[]);
  
    return (
      <div style={containerStyle}>
        <h3>Variable Creator</h3>
        <input
          type="text"
          value={newVariableKey.value}
          // @ts-ignore
          onInput={(e) => newVariableKey.value = e.target.value}
          placeholder="Enter variable key"
          style={inputStyle}
        />
        <button onClick={addVariable} style={buttonStyle}>Add Variable</button>
        <ul style={listStyle}>
          {variableKeys.value.map((key) => (
            <li key={key} style={listItemStyle}>
              {key}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  
  
  export  { VariableCreator};
  