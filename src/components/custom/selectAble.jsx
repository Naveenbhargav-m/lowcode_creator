import { useState } from "preact/hooks";
import { formActiveElement } from "../../form_builder/form_builder_state";

// The withSelectable HOC
export function SelectableComponent({ onRemove, onChick, id, isSelected ,children }) {
      const handleClick = (e) => {
        onChick(e, id);
      };
      
      const handleRemove = (e) => {
        if (onRemove) {
          onRemove(e, id);
        }
      };
      
      return (
        <div 
          className="relative" 
          onClick={handleClick}
          style={{ 
            display: 'inline-block',
            cursor: 'pointer',
          }}
        >
          <div 
            style={{ 
              border: isSelected ? '2px solid #2563eb' : '2px solid transparent',
              borderRadius: '4px',
              padding: '2px',
              transition: 'border-color 0.15s ease-in-out',
            }}
          >
            {children}
          </div>
          
          {isSelected && (
            <div 
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white cursor-pointer"
              onClick={handleRemove}
              title="Remove"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
          )}
        </div>
      );
    }