import { useState } from "preact/hooks";
import { activeScreen, apiError, DeleteScreen, HasUnsavedChanges, isLoading, SetCurrentScreen } from "./screen_state";
import { Monitor, Plus, Trash2 } from "lucide-react";


function ScreensListPanels({ screens, activeScreen, onScreenSelect, onCreateScreen, onDeleteScreen, hasUnsavedChanges }) {
  // ScreensList Component - Updated to match TablesList pattern
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    if (newName.trim()) {
      onCreateScreen(newName);
      setNewName('');
      setIsCreating(false);
    }
  };

  // Convert screens object to array
  const screensArray = Object.values(screens || {});

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Screens</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white p-1.5 rounded hover:bg-indigo-700 transition-colors"
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
            placeholder="Screen name"
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
              onClick={() => setIsCreating(false)} 
              className="flex-1 bg-gray-200 text-gray-700 py-1.5 rounded text-sm hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1 max-h-64 overflow-y-auto">
        {screensArray.map(screen => (
          <div 
            key={screen.id}
            className={`flex items-center justify-between p-2.5 rounded-md cursor-pointer transition-colors ${
              activeScreen === screen.id 
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                : 'hover:bg-gray-100'
            }`}
            onClick={() => onScreenSelect(screen.id)}
          >
            <div className="flex items-center">
              <Monitor size={16} className="mr-2 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{screen.screen_name}</span>
                {hasUnsavedChanges(screen.id) && (
                  <span className="text-xs text-amber-600">Unsaved changes</span>
                )}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteScreen(screen.id);
              }}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {screensArray.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <Monitor size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No templates found</p>
          <p className="text-xs mt-1">Create your first template to get started</p>
        </div>
      )}
    </div>
  );
}


export {  ScreensListPanels };
