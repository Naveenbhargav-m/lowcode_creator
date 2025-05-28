import { useEffect, useState } from "preact/hooks";

// Custom hook to handle conditional delete
const useConditionalDelete = () => {
    const [deleteKeyCode, setDeleteKeyCode] = useState(['Delete', 'Backspace']);
  
    useEffect(() => {
      const handleKeyDown = (event) => {
        // Check if the active element is an input, textarea, or contenteditable
        const activeElement = document.activeElement;
        const isInputFocused = activeElement && (
          activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.contentEditable === 'true' ||
          activeElement.getAttribute('role') === 'textbox'
        );
  
        if (isInputFocused && (event.key === 'Delete' || event.key === 'Backspace')) {
          // If input is focused, disable ReactFlow delete
          setDeleteKeyCode([]);
        } else {
          // If no input is focused, enable ReactFlow delete
          setDeleteKeyCode(['Delete', 'Backspace']);
        }
      };
  
      const handleFocusIn = () => handleKeyDown({ key: 'focus' });
      const handleFocusOut = () => setDeleteKeyCode(['Delete', 'Backspace']);
  
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('focusin', handleFocusIn);
      document.addEventListener('focusout', handleFocusOut);
  
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('focusin', handleFocusIn);
        document.removeEventListener('focusout', handleFocusOut);
      };
    }, []);
  
    return deleteKeyCode;
  };
  
export {useConditionalDelete};