// themes_left_list.jsx
import { useState } from "preact/hooks";
import { 
  themeNameAndIDSList, 
  ActiveTheme,
  SetActiveTheme,
  CreateTheme,
  DeleteTheme,
  DuplicateTheme,
  SetDefaultTheme,
  HasUnsavedChanges,
  isLoading,
  themes
} from "./themes_state";
import { Copy, Palette, Plus, Search, Star, Trash2 } from "lucide-react";



// Themes Component
function ThemesList() {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleCreate = async () => {
    if (newName.trim()) {
      try {
        await CreateTheme({ name: newName.trim() });
        setNewName("");
        setIsCreating(false);
      } catch (error) {
        console.error("Failed to create theme:", error);
      }
    }
  };

  const handleDelete = async (themeId) => {
    if (showDeleteConfirm !== themeId) {
      setShowDeleteConfirm(themeId);
      return;
    }

    try {
      await DeleteTheme(themeId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete theme:", error);
    }
  };

  const handleDuplicate = async (themeId) => {
    try {
      await DuplicateTheme(themeId);
    } catch (error) {
      console.error("Failed to duplicate theme:", error);
    }
  };

  const handleSetDefault = async (themeId) => {
    try {
      await SetDefaultTheme(themeId);
    } catch (error) {
      console.error("Failed to set default theme:", error);
    }
  };

  const filteredThemes = themeNameAndIDSList.value.filter(theme =>
    theme.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Themes</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-purple-600 text-white p-1.5 rounded hover:bg-purple-700 transition-colors"
          disabled={isLoading.value}
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search themes..."
          value={searchTerm}
          // @ts-ignore
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      {isCreating && (
        <div className="mb-4 space-y-2">
          <input
            type="text"
            value={newName}
            // @ts-ignore
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Theme name"
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            autoFocus
            onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
          />
          <div className="flex gap-2">
            <button 
              onClick={handleCreate} 
              className="flex-1 bg-purple-600 text-white py-1.5 rounded text-sm hover:bg-purple-700 transition-colors"
              disabled={!newName.trim() || isLoading.value}
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
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
          <span className="ml-2 text-sm text-gray-600">Loading...</span>
        </div>
      )}

      <div className="space-y-1 max-h-full overflow-y-auto border border-gray-200 rounded-md flex-1">
        {filteredThemes.length === 0 ? (
          <div className="text-center text-gray-500 p-8">
            <Palette size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {searchTerm ? "No themes match your search" : "No themes found"}
            </p>
            <p className="text-xs mt-1 text-gray-400">Create your first theme to get started</p>
          </div>
        ) : (
          filteredThemes.map((theme) => {
            const isActive = ActiveTheme.value === theme.id;
            const isDefault = themes[theme.id]?.is_default || false;
            const hasChanges = HasUnsavedChanges(theme.id);
            const isDeleting = showDeleteConfirm === theme.id;
            
            return (
              <div 
                key={theme.id}
                className={`flex items-center justify-between p-2.5 border-b border-gray-100 cursor-pointer transition-colors ${
                  isActive 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => SetActiveTheme(theme.id)}
              >
                <div className="flex items-center flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 ${
                    isActive ? 'bg-purple-600' : 'bg-gray-200'
                  }`}>
                    <Palette size={14} className={isActive ? 'text-white' : 'text-gray-600'} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium truncate">{theme.name}</span>
                      {isDefault && (
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded flex-shrink-0">
                          DEFAULT
                        </span>
                      )}
                      {hasChanges && (
                        <span className="ml-2 w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">ID: {theme.id}</div>
                    {hasChanges && (
                      <div className="text-xs text-gray-500">Unsaved changes</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {isDeleting ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(theme.id);
                        }}
                        disabled={isLoading.value}
                        className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(null);
                        }}
                        className="px-2 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(theme.id);
                        }}
                        disabled={isLoading.value || isDefault}
                        className={`transition-colors p-1 ${
                          isDefault 
                            ? 'text-green-500 cursor-not-allowed' 
                            : 'text-gray-400 hover:text-green-500'
                        }`}
                        title={isDefault ? "Already default" : "Set as default theme"}
                      >
                        <Star size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(theme.id);
                        }}
                        disabled={isLoading.value}
                        className="text-gray-400 hover:text-purple-500 transition-colors p-1"
                        title="Duplicate theme"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(theme.id);
                        }}
                        disabled={isLoading.value}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Delete theme"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}


export { ThemesList };