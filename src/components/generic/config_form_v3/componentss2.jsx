import React, { useState } from 'react';
import { Code, Edit3, X, Check } from 'lucide-react';

// Generic JavaScript Code Editor Component
const JavaScriptEditor = ({ field, value = '', onChange, placeholder = 'Enter JavaScript code...' }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [tempValue, setTempValue] = useState('');

  const handleOpenPopup = () => {
    setTempValue(value || '');
    setIsPopupOpen(true);
  };

  const handleSave = () => {
    onChange(field.id, tempValue);
    setIsPopupOpen(false);
  };

  const handleCancel = () => {
    setTempValue('');
    setIsPopupOpen(false);
  };

  const getPreviewText = () => {
    if (!value) return placeholder;
    const lines = value.split('\n');
    if (lines.length === 1) {
      return value.length > 40 ? `${value.substring(0, 40)}...` : value;
    }
    return `${lines[0].substring(0, 30)}... (${lines.length} lines)`;
  };

  return (
    <>
      {/* Compact Preview Box */}
      <div className="relative">
        <div
          onClick={handleOpenPopup}
          className="w-full min-h-[40px] p-3 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <Code className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="text-sm text-gray-700 truncate font-mono">
              {getPreviewText()}
            </div>
          </div>
          <Edit3 className="w-4 h-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
        </div>
        {field.required && !value && (
          <div className="text-xs text-red-500 mt-1">This field is required</div>
        )}
      </div>

      {/* Popup Editor */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {field.label || 'JavaScript Editor'}
                </h3>
              </div>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Editor */}
            <div className="flex-1 p-4">
              <textarea
                value={tempValue}
                // @ts-ignore
                onChange={(e) => setTempValue(e.target.value)}
                placeholder={placeholder}
                className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ minHeight: '400px' }}
                spellcheck={false}
              />
              {field.description && (
                <p className="text-sm text-gray-600 mt-2">{field.description}</p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-4 border-t bg-gray-50">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Save Code</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Global JavaScript Field Component (following your pattern)
const GlobalJavaScriptField = ({ field, value, onChange }) => {
  return (
    <div className="space-y-2">
      {field.label && (
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <JavaScriptEditor
        field={field}
        value={value}
        onChange={onChange}
        placeholder={field.placeholder || 'Enter JavaScript code...'}
      />
    </div>
  );
};

export {GlobalJavaScriptField, JavaScriptEditor};