// template_left_panel.jsx
import { 
  activeTamplate, 
  SetTemplateActiveElements, 
  templateNamesList, 
  DeleteTemplate,
  HasUnsavedChanges,
  isLoading,
  apiError
} from "./templates_state";
import { useState } from "react";
import { Plus, FileText, Trash2 } from "lucide-react";

function TemplatesListPanel({ templatesObject }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Convert templates object to array for rendering
  const templatesList = templatesObject ? Object.entries(templatesObject).map(([id, template]) => ({
    id,
    name: template.name || `Template ${id}`,
    ...template
  })) : [];

  const handleCreate = () => {
    if (newName.trim()) {
      // You'll need to implement CreateTemplate function
      // onCreateTemplate(newName);
      setNewName('');
      setIsCreating(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await DeleteTemplate(id);
    } catch (error) {
      console.error("Failed to delete template:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSelect = (id) => {
    if (activeTamplate.value !== id) {
      activeTamplate.value = id;
      SetTemplateActiveElements();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Templates</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white p-1.5 rounded hover:bg-indigo-700 transition-colors"
          disabled={isLoading.value}
        >
          <Plus size={18} />
        </button>
      </div>

      {isCreating && (
        <div className="mb-4 space-y-2">
          <input
            type="text"
            value={newName}
            // @ts-ignore
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Template name"
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            autoFocus
            onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
          />
          <div className="flex gap-2">
            <button 
              onClick={handleCreate} 
              className="flex-1 bg-indigo-600 text-white py-1.5 rounded text-sm hover:bg-indigo-700 transition-colors"
            >
              Create
            </button>
            <button 
              onClick={() => {
                setIsCreating(false);
                setNewName('');
              }} 
              className="flex-1 bg-gray-200 text-gray-700 py-1.5 rounded text-sm hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading.value && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
          <span className="ml-2 text-sm text-gray-600">Loading...</span>
        </div>
      )}
      
      {apiError.value && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{apiError.value}</p>
        </div>
      )}

      <div className="space-y-1 max-h-64 overflow-y-auto">
        {templatesList.map(template => {
          const isActive = activeTamplate.value === template.id;
          const hasChanges = HasUnsavedChanges(template.id);
          const isDeleting = deletingId === template.id;
          
          return (
            <div 
              key={template.id}
              className={`flex items-center justify-between p-2.5 rounded-md cursor-pointer transition-colors ${
                isActive 
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => handleSelect(template.id)}
            >
              <div className="flex items-center flex-1">
                <FileText size={16} className="mr-2 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{template.name}</span>
                    {hasChanges && (
                      <span className="ml-2 text-xs text-amber-500 font-medium">
                        •
                      </span>
                    )}
                  </div>
                  {hasChanges && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      Unsaved changes
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(template.id);
                }}
                disabled={isDeleting}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete template"
              >
                {isDeleting ? (
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border border-gray-400 border-t-transparent"></div>
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            </div>
          );
        })}
        
        {templatesList.length === 0 && !isLoading.value && (
          <div className="text-center text-gray-500 p-8">
            <FileText size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No templates found</p>
            <p className="text-xs mt-1 text-gray-400">Create your first template to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}