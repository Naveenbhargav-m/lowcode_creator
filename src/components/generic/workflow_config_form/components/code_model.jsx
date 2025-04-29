// CodeEditorModal.js
import { useState, useEffect, useRef } from "react";

const CodeEditorModal = ({ isOpen, initialValue, onClose, onSave }) => {
  const [jsonValue, setJsonValue] = useState("");
  const [jsonError, setJsonError] = useState("");
  const textareaRef = useRef(null);
  
  // Initialize and focus when opened
  useEffect(() => {
    if (isOpen) {
      setJsonValue(initialValue);
      setJsonError("");
      
      // Focus the textarea after render
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
    }
  }, [isOpen, initialValue]);

  // Handle save
  const handleSave = () => {
    try {
      const parsedJson = JSON.parse(jsonValue);
      setJsonError("");
      onSave(parsedJson);
    } catch (error) {
      setJsonError("Invalid JSON: " + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-screen flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium">Edit Configuration JSON</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="p-4 flex-grow overflow-auto">
          {jsonError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {jsonError}
            </div>
          )}
          <textarea
            ref={textareaRef}
            className="w-full h-96 font-mono p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={jsonValue}
            // @ts-ignore
            onChange={(e) => setJsonValue(e.target.value)}
          />
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorModal;