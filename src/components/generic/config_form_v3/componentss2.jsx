import React, { useCallback, useEffect, useState } from 'react';
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



import {useMemo } from 'react';
import { Plus, ArrowRight, Settings, Type, Database, User, Search, ChevronDown, ChevronRight } from 'lucide-react';
export function Toggle() {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    setIsOn(!isOn);
  };
  let label = "auto map remaining";

  return (
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-medium text-gray-700">
           {label}
          </span>
          
          {/* Toggle Switch */}
          <button
            onClick={toggleSwitch}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isOn ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                isOn ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
  );
}



// export const DataMapperField = ({ field, value = [], onChange }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [expandedRows, setExpandedRows] = useState(new Set());
//   const [searchQuery, setSearchQuery] = useState('');
  
//   // Internal state for mappings - this is the key fix
//   const [internalMappings, setInternalMappings] = useState(() => 
//     Array.isArray(value) ? value : []
//   );

//   // Sync internal state when value prop changes
//   useEffect(() => {
//     setInternalMappings(Array.isArray(value) ? value : []);
//   }, [value]);

//   // Force re-render when field configuration changes
//   useEffect(() => {
//     // This effect ensures the component re-renders when field options change
//     // The dependency on field will trigger re-evaluation of all derived values
//   }, [field]);

//   // Extract configuration from field object with memoization for performance
//   const {
//     target_fields = [],
//     source_fields = [],
//     userFields = [],
//     enableStaticValues = true,
//     enableUserFields = true,
//     enableSourceFields = true,
//     className = "",
//     label = "Field Mapping",
//     placeholder = "Configure field mappings"
//   } = field;

//   // Memoize field arrays to prevent unnecessary re-renders
//   const memoizedTargetFields = useMemo(() => target_fields, [target_fields]);
//   const memoizedSourceFields = useMemo(() => source_fields, [source_fields]);
//   const memoizedUserFields = useMemo(() => userFields, [userFields]);

//   // Use internal mappings instead of value prop
//   const mappings = internalMappings;
  
//   // Debug logging
//   console.log('DataMapperField render:', {
//     internalMappingsLength: internalMappings.length,
//     valueLength: Array.isArray(value) ? value.length : 0,
//     mappingsLength: mappings.length
//   });

//   const mappingTypes = [
//     { 
//       id: 'static', 
//       label: 'Static', 
//       icon: Type, 
//       enabled: enableStaticValues,
//     },
//     { 
//       id: 'source', 
//       label: 'Source', 
//       icon: Database, 
//       enabled: enableSourceFields,
//     },
//     { 
//       id: 'user', 
//       label: 'User', 
//       icon: User, 
//       enabled: enableUserFields,
//     }
//   ];

//   // Calculate mapped count
//   const mappedCount = useMemo(() => {
//     return mappings.filter(m => m.targetField && 
//       ((m.type === 'static' && m.value) || 
//        (m.type === 'source' && m.sourceField) || 
//        (m.type === 'user' && m.userField))
//     ).length;
//   }, [mappings]);

//   const addMapping = () => {
//     console.log('addMapping called - current mappings:', mappings);
//     const newMapping = {
//       id: Date.now().toString(),
//       targetField: '',
//       type: 'static',
//       value: '',
//       sourceField: '',
//       userField: ''
//     };
    
//     // Use functional update to ensure we get the latest state
//     setInternalMappings(prevMappings => {
//       const updatedMappings = [...prevMappings, newMapping];
//       console.log('addMapping - new mappings:', updatedMappings);
//       return updatedMappings;
//     });
    
//     setExpandedRows(prev => {
//       const newExpanded = new Set([...prev, newMapping.id]);
//       console.log('addMapping - expanded rows:', newExpanded);
//       return newExpanded;
//     });
//   };

//   const updateMapping = (id, updates) => {
//     console.log('updateMapping called:', id, updates);
//     setInternalMappings(prevMappings => {
//       const updated = prevMappings.map(mapping => 
//         mapping.id === id ? { ...mapping, ...updates } : mapping
//       );
//       console.log('updateMapping - updated mappings:', updated);
//       return updated;
//     });
//   };

//   const removeMapping = (id) => {
//     const newExpanded = new Set(expandedRows);
//     newExpanded.delete(id);
//     setExpandedRows(newExpanded);
//     const updatedMappings = mappings.filter(mapping => mapping.id !== id);
//     setInternalMappings(updatedMappings); // Update internal state
//   };

//   // Save function to call onChange
//   const handleSave = () => {
//     onChange(internalMappings);
//     setIsOpen(false);
//   };

//   // Check if there are unsaved changes
//   const hasUnsavedChanges = useMemo(() => {
//     return JSON.stringify(internalMappings) !== JSON.stringify(value);
//   }, [internalMappings, value]);

//   const toggleExpanded = (id) => {
//     const newExpanded = new Set(expandedRows);
//     if (newExpanded.has(id)) {
//       newExpanded.delete(id);
//     } else {
//       newExpanded.add(id);
//     }
//     setExpandedRows(newExpanded);
//   };

//   const getMappingPreview = (mapping) => {
//     if (!mapping.targetField) return 'No target selected';
    
//     switch (mapping.type) {
//       case 'static':
//         return mapping.value ? `"${mapping.value}"` : 'No value';
//       case 'source':
//         if (mapping.sourceField) {
//           const field = memoizedSourceFields.find(f => f.value === mapping.sourceField);
//           return field ? field.label : mapping.sourceField;
//         }
//         return 'No source selected';
//       case 'user':
//         if (mapping.userField) {
//           const field = memoizedUserFields.find(f => f.value === mapping.userField);
//           return field ? field.label : mapping.userField;
//         }
//         return 'No user field selected';
//       default:
//         return 'Not configured';
//     }
//   };

//   const isValidMapping = (mapping) => {
//     return mapping.targetField && 
//       ((mapping.type === 'static' && mapping.value) || 
//        (mapping.type === 'source' && mapping.sourceField) || 
//        (mapping.type === 'user' && mapping.userField));
//   };

//   const filteredMappings = mappings.filter(mapping => {
//     if (!searchQuery) return true;
//     const query = searchQuery.toLowerCase();
//     const targetField = memoizedTargetFields.find(f => f.value === mapping.targetField);
//     return (targetField?.label?.toLowerCase().includes(query)) ||
//            (mapping.value?.toLowerCase().includes(query)) ||
//            (mapping.sourceField?.toLowerCase().includes(query)) ||
//            (mapping.userField?.toLowerCase().includes(query));
//   });

//   return (
//     <div className={className}>
//       {/* Label */}
//       {field.label && (
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           {field.label}
//           {field.required && <span className="text-red-500 ml-1">*</span>}
//         </label>
//       )}

//       {/* Config Button */}
//       <button
//         onClick={() => setIsOpen(true)}
//         className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors w-full justify-between"
//       >
//         <div className="flex items-center gap-2">
//           <Settings className="w-4 h-4" />
//           <span>{mappedCount > 0 ? `${mappedCount} mapping(s) configured` : placeholder}</span>
//         </div>
//         <div className="flex items-center gap-2">
//           {mappedCount > 0 && (
//             <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
//               {mappedCount}
//             </span>
//           )}
//           {hasUnsavedChanges && (
//             <span className="w-2 h-2 bg-orange-500 rounded-full" title="Unsaved changes"></span>
//           )}
//         </div>
//       </button>

//       {/* Help text */}
//       {field.helpText && (
//         <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
//       )}

//       {/* Side Drawer Overlay */}
//       {isOpen && (
//         <div className="fixed inset-0 z-50 overflow-hidden">
//           <div className="absolute inset-0 bg-black bg-opacity-25" onClick={() => setIsOpen(false)} />
          
//           {/* Drawer */}
//           <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl flex flex-col">
//             {/* Header */}
//             <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
//               <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={addMapping}
//                   className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
//                 >
//                   Add Mapping
//                 </button>
//                 <button
//                   onClick={() => setIsOpen(false)}
//                   className="p-2 hover:bg-gray-200 rounded-md transition-colors"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>

//             {/* Search */}
//             <div className="p-4 border-b border-gray-200">
//               <div className="relative">
//                 <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search mappings..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                 />
//               </div>
//             </div>

//             {/* Mappings List */}
//             <div className="flex-1 overflow-y-auto">
//               {/* Debug info */}
//               {process.env.NODE_ENV === 'development' && (
//                 <div className="p-2 bg-yellow-50 text-xs">
//                   <div>Internal mappings: {internalMappings.length}</div>
//                   <div>Filtered mappings: {filteredMappings.length}</div>
//                   <div>Search query: "{searchQuery}"</div>
//                 </div>
//               )}
              
//               {filteredMappings.length === 0 ? (
//                 <div className="p-8 text-center">
//                   <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
//                     <Database className="w-6 h-6 text-gray-400" />
//                   </div>
//                   <p className="text-sm text-gray-500 mb-3">No mappings configured</p>
//                   <button
//                     onClick={addMapping}
//                     className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
//                   >
//                     <Plus className="w-4 h-4" />
//                     Add Mapping
//                   </button>
//                 </div>
//               ) : (
//                 <div className="p-4 space-y-3">
//                   {filteredMappings.map((mapping) => {
//                     const isExpanded = expandedRows.has(mapping.id);
//                     const isValid = isValidMapping(mapping);
//                     const targetField = memoizedTargetFields.find(f => f.value === mapping.targetField);
                    
//                     return (
//                       <div key={mapping.id} className={`border rounded-lg overflow-hidden ${
//                         isValid ? 'border-green-200 bg-green-50' : 'border-gray-200'
//                       }`}>
//                         {/* Collapsed View */}
//                         <div 
//                           className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
//                           onClick={() => toggleExpanded(mapping.id)}
//                         >
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-2 flex-1 min-w-0">
//                               {isExpanded ? (
//                                 <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
//                               ) : (
//                                 <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
//                               )}
//                               <div className="min-w-0 flex-1">
//                                 <div className="text-sm font-medium text-gray-900 truncate">
//                                   {targetField?.label || 'Select target field'}
//                                 </div>
//                                 <div className="flex items-center gap-1 text-xs text-gray-500">
//                                   <ArrowRight className="w-3 h-3" />
//                                   <span className="truncate">{getMappingPreview(mapping)}</span>
//                                 </div>
//                               </div>
//                             </div>
                            
//                             <div className="flex items-center gap-1">
//                               <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
//                                 {mappingTypes.find(t => t.id === mapping.type)?.label}
//                               </span>
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   removeMapping(mapping.id);
//                                 }}
//                                 className="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-600 transition-colors"
//                               >
//                                 <X className="w-3 h-3" />
//                               </button>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Expanded View */}
//                         {isExpanded && (
//                           <div className="px-4 pb-4 bg-white border-t border-gray-100">
//                             <div className="space-y-3">
//                               {/* Target Field */}
//                               <div>
//                                 <label className="block text-xs font-medium text-gray-700 mb-1">
//                                   Target Field
//                                 </label>
//                                 <select
//                                   value={mapping.targetField}
//                                   onChange={(e) => updateMapping(mapping.id, { targetField: e.target.value })}
//                                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                                 >
//                                   <option value="">Select target field...</option>
//                                   {memoizedTargetFields.map(field => (
//                                     <option key={field.value} value={field.value}>
//                                       {field.label}
//                                     </option>
//                                   ))}
//                                 </select>
//                               </div>

//                               {/* Mapping Type */}
//                               <div>
//                                 <label className="block text-xs font-medium text-gray-700 mb-1">
//                                   Type
//                                 </label>
//                                 <div className="flex gap-1">
//                                   {mappingTypes.filter(type => type.enabled).map(type => {
//                                     const isSelected = mapping.type === type.id;
//                                     return (
//                                       <button
//                                         key={type.id}
//                                         onClick={() => updateMapping(mapping.id, { type: type.id })}
//                                         className={`flex-1 px-2 py-1.5 rounded-md border text-xs font-medium transition-colors ${
//                                           isSelected
//                                             ? 'border-blue-500 bg-blue-50 text-blue-700'
//                                             : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//                                         }`}
//                                       >
//                                         {type.label}
//                                       </button>
//                                     );
//                                   })}
//                                 </div>
//                               </div>

//                               {/* Value Input */}
//                               {mapping.type === 'static' && (
//                                 <div>
//                                   <label className="block text-xs font-medium text-gray-700 mb-1">
//                                     Value
//                                   </label>
//                                   <input
//                                     type="text"
//                                     value={mapping.value || ''}
//                                     onChange={(e) => updateMapping(mapping.id, { value: e.target.value })}
//                                     placeholder="Enter static value..."
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                                   />
//                                 </div>
//                               )}

//                               {mapping.type === 'source' && enableSourceFields && (
//                                 <div>
//                                   <label className="block text-xs font-medium text-gray-700 mb-1">
//                                     Source Field
//                                   </label>
//                                   <select
//                                     value={mapping.sourceField || ''}
//                                     onChange={(e) => updateMapping(mapping.id, { sourceField: e.target.value })}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                                   >
//                                     <option value="">Select source field...</option>
//                                     {memoizedSourceFields.map(field => (
//                                       <option key={field.value} value={field.value}>
//                                         {field.label}
//                                       </option>
//                                     ))}
//                                   </select>
//                                 </div>
//                               )}

//                               {mapping.type === 'user' && enableUserFields && (
//                                 <div>
//                                   <label className="block text-xs font-medium text-gray-700 mb-1">
//                                     User Field
//                                   </label>
//                                   <select
//                                     value={mapping.userField || ''}
//                                     onChange={(e) => updateMapping(mapping.id, { userField: e.target.value })}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                                   >
//                                     <option value="">Select user field...</option>
//                                     {memoizedUserFields.map(field => (
//                                       <option key={field.value} value={field.value}>
//                                         {field.label}
//                                       </option>
//                                     ))}
//                                   </select>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* Footer with Save Button */}
//             <div className="border-t border-gray-200 p-4 bg-gray-50">
//               <div className="flex items-center justify-between">
//                 <div className="text-sm text-gray-600">
//                   {hasUnsavedChanges ? (
//                     <span className="flex items-center gap-1 text-orange-600">
//                       <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
//                       Unsaved changes
//                     </span>
//                   ) : (
//                     <span className="text-green-600">All changes saved</span>
//                   )}
//                 </div>
//                 <button
//                   onClick={handleSave}
//                   disabled={!hasUnsavedChanges}
//                   className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
//                     hasUnsavedChanges
//                       ? 'bg-blue-600 text-white hover:bg-blue-700'
//                       : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                   }`}
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };




export const DataMapperField = ({ field, value = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  
  // Internal state for mappings - this is the key fix
  const [internalMappings, setInternalMappings] = useState(() => 
    Array.isArray(value) ? value : []
  );

  // Sync internal state when value prop changes
  useEffect(() => {
    setInternalMappings(Array.isArray(value) ? value : []);
  }, [value]);

  // REMOVED: The problematic useEffect that was causing infinite re-renders
  // useEffect(() => {
  //   // This effect ensures the component re-renders when field options change
  //   // The dependency on field will trigger re-evaluation of all derived values
  // }, [field]);

  // Extract configuration from field object with memoization for performance
  // Use useMemo to prevent re-extraction on every render
  const fieldConfig = useMemo(() => ({
    target_fields: field.target_fields || [],
    source_fields: field.source_fields || [],
    userFields: field.userFields || [],
    enableStaticValues: field.enableStaticValues ?? true,
    enableUserFields: field.enableUserFields ?? true,
    enableSourceFields: field.enableSourceFields ?? true,
    className: field.className || "",
    label: field.label || "Field Mapping",
    placeholder: field.placeholder || "Configure field mappings"
  }), [
    field.target_fields, 
    field.source_fields, 
    field.userFields,
    field.enableStaticValues,
    field.enableUserFields,
    field.enableSourceFields,
    field.className,
    field.label,
    field.placeholder
  ]);

  const {
    target_fields,
    source_fields,
    userFields,
    enableStaticValues,
    enableUserFields,
    enableSourceFields,
    className,
    label,
    placeholder
  } = fieldConfig;

  // Memoize field arrays to prevent unnecessary re-renders
  const memoizedTargetFields = useMemo(() => target_fields, [target_fields]);
  const memoizedSourceFields = useMemo(() => source_fields, [source_fields]);
  const memoizedUserFields = useMemo(() => userFields, [userFields]);

  // Use internal mappings instead of value prop
  
  
  // Debug logging - wrap in useMemo to prevent logging on every render
  const debugInfo = useMemo(() => {
    const info = {
      internalMappingsLength: internalMappings.length,
      valueLength: Array.isArray(value) ? value.length : 0,
      mappingsLength: internalMappings.length
    };
    console.log('DataMapperField render:', info);
    return info;
  }, [internalMappings.length, value?.length, internalMappings.length]);

  // Memoize mapping types to prevent recreation
  const mappingTypes = useMemo(() => [
    { 
      id: 'static', 
      label: 'Static', 
      icon: Type, 
      enabled: enableStaticValues,
    },
    { 
      id: 'source', 
      label: 'Source', 
      icon: Database, 
      enabled: enableSourceFields,
    },
    { 
      id: 'user', 
      label: 'User', 
      icon: User, 
      enabled: enableUserFields,
    }
  ], [enableStaticValues, enableSourceFields, enableUserFields]);

  // Calculate mapped count
  const mappedCount = useMemo(() => {
    return internalMappings.filter(m => m.targetField && 
      ((m.type === 'static' && m.value) || 
       (m.type === 'source' && m.sourceField) || 
       (m.type === 'user' && m.userField))
    ).length;
  }, [internalMappings]);

  const addMapping = useCallback(() => {
    console.log('addMapping called - current mappings:', internalMappings);
    const newMapping = {
      id: Date.now().toString(),
      targetField: '',
      type: 'static',
      value: '',
      sourceField: '',
      userField: ''
    };
    
    // Use functional update to ensure we get the latest state
    setInternalMappings(prevMappings => {
      const updatedMappings = [...prevMappings, newMapping];
      console.log('addMapping - new mappings:', updatedMappings);
      return updatedMappings;
    });
    
    setExpandedRows(prev => {
      const newExpanded = new Set([...prev, newMapping.id]);
      console.log('addMapping - expanded rows:', newExpanded);
      return newExpanded;
    });
  }, [internalMappings]);

  const updateMapping = useCallback((id, updates) => {
    console.log('updateMapping called:', id, updates);
    setInternalMappings(prevMappings => {
      const updated = prevMappings.map(mapping => 
        mapping.id === id ? { ...mapping, ...updates } : mapping
      );
      console.log('updateMapping - updated mappings:', updated);
      return updated;
    });
  }, []);

  const removeMapping = useCallback((id) => {
    setExpandedRows(prev => {
      const newExpanded = new Set(prev);
      newExpanded.delete(id);
      return newExpanded;
    });
    setInternalMappings(prevMappings => 
      prevMappings.filter(mapping => mapping.id !== id)
    );
  }, []);

  // Save function to call onChange
  const handleSave = useCallback(() => {
    onChange(internalMappings);
    setIsOpen(false);
  }, [internalMappings, onChange]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(internalMappings) !== JSON.stringify(value);
  }, [internalMappings, value]);

  const toggleExpanded = useCallback((id) => {
    setExpandedRows(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return newExpanded;
    });
  }, []);

  const getMappingPreview = useCallback((mapping) => {
    if (!mapping.targetField) return 'No target selected';
    
    switch (mapping.type) {
      case 'static':
        return mapping.value ? `"${mapping.value}"` : 'No value';
      case 'source':
        if (mapping.sourceField) {
          const field = memoizedSourceFields.find(f => f.value === mapping.sourceField);
          return field ? field.label : mapping.sourceField;
        }
        return 'No source selected';
      case 'user':
        if (mapping.userField) {
          const field = memoizedUserFields.find(f => f.value === mapping.userField);
          return field ? field.label : mapping.userField;
        }
        return 'No user field selected';
      default:
        return 'Not configured';
    }
  }, [memoizedSourceFields, memoizedUserFields]);

  const isValidMapping = useCallback((mapping) => {
    return mapping.targetField && 
      ((mapping.type === 'static' && mapping.value) || 
       (mapping.type === 'source' && mapping.sourceField) || 
       (mapping.type === 'user' && mapping.userField));
  }, []);

  const filteredMappings = useMemo(() => {
    return internalMappings.filter(mapping => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      const targetField = memoizedTargetFields.find(f => f.value === mapping.targetField);
      return (targetField?.label?.toLowerCase().includes(query)) ||
             (mapping.value?.toLowerCase().includes(query)) ||
             (mapping.sourceField?.toLowerCase().includes(query)) ||
             (mapping.userField?.toLowerCase().includes(query));
    });
  }, [internalMappings, searchQuery, memoizedTargetFields]);

  return (
    <div className={className}>
      {/* Label */}
      {field.label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Config Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors w-full justify-between"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span>{mappedCount > 0 ? `${mappedCount} mapping(s) configured` : placeholder}</span>
        </div>
        <div className="flex items-center gap-2">
          {mappedCount > 0 && (
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
              {mappedCount}
            </span>
          )}
          {hasUnsavedChanges && (
            <span className="w-2 h-2 bg-orange-500 rounded-full" title="Unsaved changes"></span>
          )}
        </div>
      </button>

      {/* Help text */}
      {field.helpText && (
        <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
      )}

      {/* Side Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-25" onClick={() => setIsOpen(false)} />
          
          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={addMapping}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Mapping
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search mappings..."
                  value={searchQuery}
                  // @ts-ignore
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Mappings List */}
            <div className="flex-1 overflow-y-auto">
              {/* Debug info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="p-2 bg-yellow-50 text-xs">
                  <div>Internal mappings: {internalMappings.length}</div>
                  <div>Filtered mappings: {filteredMappings.length}</div>
                  <div>Search query: "{searchQuery}"</div>
                </div>
              )}
              
              {filteredMappings.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                    <Database className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mb-3">No mappings configured</p>
                  <button
                    onClick={addMapping}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Mapping
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {filteredMappings.map((mapping) => {
                    const isExpanded = expandedRows.has(mapping.id);
                    const isValid = isValidMapping(mapping);
                    const targetField = memoizedTargetFields.find(f => f.value === mapping.targetField);
                    
                    return (
                      <div key={mapping.id} className={`border rounded-lg overflow-hidden ${
                        isValid ? 'border-green-200 bg-green-50' : 'border-gray-200'
                      }`}>
                        {/* Collapsed View */}
                        <div 
                          className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => toggleExpanded(mapping.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {targetField?.label || 'Select target field'}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <ArrowRight className="w-3 h-3" />
                                  <span className="truncate">{getMappingPreview(mapping)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {mappingTypes.find(t => t.id === mapping.type)?.label}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeMapping(mapping.id);
                                }}
                                className="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded View */}
                        {isExpanded && (
                          <div className="px-4 pb-4 bg-white border-t border-gray-100">
                            <div className="space-y-3">
                              {/* Target Field */}
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Target Field
                                </label>
                                <select
                                  value={mapping.targetField}
                                  // @ts-ignore
                                  onChange={(e) => updateMapping(mapping.id, { targetField: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                >
                                  <option value="">Select target field...</option>
                                  {memoizedTargetFields.map(field => (
                                    <option key={field.value} value={field.value}>
                                      {field.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Mapping Type */}
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Type
                                </label>
                                <div className="flex gap-1">
                                  {mappingTypes.filter(type => type.enabled).map(type => {
                                    const isSelected = mapping.type === type.id;
                                    return (
                                      <button
                                        key={type.id}
                                        onClick={() => updateMapping(mapping.id, { type: type.id })}
                                        className={`flex-1 px-2 py-1.5 rounded-md border text-xs font-medium transition-colors ${
                                          isSelected
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                      >
                                        {type.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Value Input */}
                              {mapping.type === 'static' && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Value
                                  </label>
                                  <input
                                    type="text"
                                    value={mapping.value || ''}
                                    // @ts-ignore
                                    onChange={(e) => updateMapping(mapping.id, { value: e.target.value })}
                                    placeholder="Enter static value..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  />
                                </div>
                              )}

                              {mapping.type === 'source' && enableSourceFields && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Source Field
                                  </label>
                                  <select
                                    value={mapping.sourceField || ''}
                                    // @ts-ignore
                                    onChange={(e) => updateMapping(mapping.id, { sourceField: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  >
                                    <option value="">Select source field...</option>
                                    {memoizedSourceFields.map(field => (
                                      <option key={field.value} value={field.value}>
                                        {field.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}

                              {mapping.type === 'user' && enableUserFields && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    User Field
                                  </label>
                                  <select
                                    value={mapping.userField || ''}
                                    // @ts-ignore
                                    onChange={(e) => updateMapping(mapping.id, { userField: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  >
                                    <option value="">Select user field...</option>
                                    {memoizedUserFields.map(field => (
                                      <option key={field.value} value={field.value}>
                                        {field.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer with Save Button */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {hasUnsavedChanges ? (
                    <span className="flex items-center gap-1 text-orange-600">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      Unsaved changes
                    </span>
                  ) : (
                    <span className="text-green-600">All changes saved</span>
                  )}
                </div>
                <button
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    hasUnsavedChanges
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export {GlobalJavaScriptField, JavaScriptEditor};