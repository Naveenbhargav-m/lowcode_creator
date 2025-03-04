// @ts-nocheck
import { Drop } from "../../components/custom/Drop";


import { useState } from "preact/hooks";
import { DefaultStyles } from "../styles/default_styles";


  const PanelField = ({ label, labelPosition, errorMessage, showError, panelStyle, labelStyle , children}) => {
    const getLabelContainerStyle = () => {
      const baseStyle = { display: 'flex', alignItems: 'center', margin: '5px 0' };
      switch (labelPosition) {
        case 'top':
          return { ...baseStyle, flexDirection: 'column', alignItems: 'flex-start' };
        case 'right':
          return { ...baseStyle, flexDirection: 'row-reverse', justifyContent: 'space-between' };
        case 'left':
          return { ...baseStyle, flexDirection: 'row', justifyContent: 'space-between' };
        case 'bottom':
          return { ...baseStyle, flexDirection: 'column-reverse', alignItems: 'flex-start' };
        case 'center':
          return { ...baseStyle, flexDirection: 'column', alignItems: 'center', textAlign: 'center' };
        default:
          return baseStyle;
      }
    };
  
    return (
      <div style={{...panelStyle}}>
        <div style={getLabelContainerStyle()}>
          {label && <div style={{ ...labelStyle }}>{label}</div>}
          <div>{children}</div>
        </div>
        {showError && errorMessage && (
          <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>
        )}
      </div>
    );
  };


  function Column({children, config , onDrop}) {
    console.log("column config:",config, children);
    return (
      <Drop wrapParent={false} dropElementData={{"id": config["id"]}} onDrop={(data) => {onDrop(data)}}>
      <div class="column" style={config["style"]}>
      {children}
      </div>
    </Drop>
    );
  }
  
  function Row({children, config , onDrop}) {
    return (
      <Drop wrapParent={false} dropElementData={{"id": config["id"]}} onDrop={(data) => {onDrop(data)}}>
      <div class="row" style={config["style"]}>
        {children}
      </div>
    </Drop>
  
    );
  }
  
  export { PanelField , Row , Column};