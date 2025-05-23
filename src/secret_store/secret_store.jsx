import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, ChevronDown, ChevronUp, Search, Lock, Key, Loader2, History, RefreshCw } from 'lucide-react';
import { CreateGroup, CreateSecret, UpdateGroup, UpdateSecret, DeleteGroup, DeleteSecret, GetDataFromAPI } from './secret_store_api'; 
// Loading Component
const LoadingSpinner = ({ size = 16 }) => (
  <Loader2 size={size} className="animate-spin" />
);

// Secret Item Component
const SecretItem = ({ secret, onEdit, onDelete, isLoading }) => {
  const [showValue, setShowValue] = useState(false);
  
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm mb-3 hover:shadow-md transition-all duration-200">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-medium text-gray-800 truncate">{secret.name}</h3>
          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium shrink-0">
            {secret.group_name || secret.group}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded flex-1 min-w-0">
            <div className="truncate">
              {showValue ? secret.value : '••••••••••••••••••••'}
            </div>
          </div>
          <button 
            onClick={() => setShowValue(!showValue)} 
            className="text-gray-500 hover:text-blue-600 transition-colors shrink-0"
            title={showValue ? 'Hide value' : 'Show value'}
          >
            <Lock size={16} />
          </button>
        </div>
        <div className="text-xs text-gray-500">
          Created: {new Date(secret.created_at || secret.createdAt).toLocaleDateString()}
          {(secret.updated_at !== secret.created_at || secret.updatedAt !== secret.createdAt) && (
            <span className="ml-3">Updated: {new Date(secret.updated_at || secret.updatedAt).toLocaleDateString()}</span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 ml-4 gap-2">
        <button 
          onClick={() => onEdit(secret)} 
          disabled={isLoading}
          className="text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Edit secret"
        >
          {isLoading ? <LoadingSpinner /> : <Edit size={16} />}
        </button>
        <button 
          onClick={() => onDelete(secret.id)} 
          disabled={isLoading}
          className="text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete secret"
        >
          {isLoading ? <LoadingSpinner /> : <Trash2 size={16} />}
        </button>
      </div>
    </div>
  );
};

// Group Panel Component
const GroupPanel = ({ group, secrets, onEdit, onDelete, isOpen, onToggle, isLoading }) => {
  const filteredSecrets = secrets.filter(secret => 
    (secret.group_name || secret.group) === group
  );
  
  if (filteredSecrets.length === 0) return null;
  
  return (
    <div className="mb-4">
      <div 
        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={onToggle}
      >
        <h2 className="font-semibold text-gray-700 flex items-center">
          <Key size={16} className="mr-2 text-blue-600" />
          {group} <span className="ml-2 text-sm text-gray-500">({filteredSecrets.length})</span>
        </h2>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      
      {isOpen && (
        <div className="mt-3 pl-2 max-h-96 overflow-y-auto">
          {filteredSecrets.map(secret => (
            <SecretItem 
              key={secret.id} 
              secret={secret} 
              onEdit={onEdit} 
              onDelete={onDelete}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Modal Overlay Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full lg:max-w-2xl">
          {children}
        </div>
      </div>
    </div>
  );
};

// Secret Form Component
const SecretForm = ({ secret, groups, onSave, onCancel, isLoading }) => {
  const [name, setName] = useState(secret?.name || '');
  const [value, setValue] = useState(secret?.value || '');
  const [group, setGroup] = useState(secret?.group_name || secret?.group || (groups.length > 0 ? groups[0] : ''));
  const [newGroup, setNewGroup] = useState('');
  const [showNewGroup, setShowNewGroup] = useState(false);

  useEffect(() => {
    setName(secret?.name || '');
    setValue(secret?.value || '');
    setGroup(secret?.group_name || secret?.group || (groups.length > 0 ? groups[0] : ''));
    setNewGroup('');
    setShowNewGroup(false);
  }, [secret, groups]);

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (!name.trim() || !value.trim()) return;
    if (showNewGroup && !newGroup.trim()) return;
    
    const finalGroup = showNewGroup ? newGroup.trim() : group;
    const now = new Date().toISOString();
    
    // Create object with correct field names for database
    const secretData = {
      id: secret?.id || Date.now().toString(),
      name: name.trim(),
      value: value.trim(),
      group_name: finalGroup, // Use group_name to match DB schema
      created_at: secret?.created_at || secret?.createdAt || now,
      updated_at: now,
      is_active: true
    };
    
    onSave(secretData, showNewGroup ? newGroup.trim() : null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="bg-white px-6 py-4" onKeyDown={handleKeyDown}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Lock size={20} className="mr-2 text-blue-600" />
          {secret ? 'Edit Secret' : 'Add New Secret'}
        </h2>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Secret Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            // @ts-ignore
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g. AWS Access Key"
            disabled={isLoading}
            autoFocus
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Secret Value <span className="text-red-500">*</span>
          </label>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
            placeholder="e.g. sk_test_4eC39HqLyjWDarjtT1zdp7dc"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            This value will be encrypted and stored securely
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group <span className="text-red-500">*</span>
          </label>
          {!showNewGroup ? (
            <div className="flex gap-2">
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={isLoading || groups.length === 0}
              >
                {groups.length === 0 ? (
                  <option value="">No groups available</option>
                ) : (
                  groups.map(g => (
                    <option key={g.id} value={g.name}>{g.name}</option>
                  ))
                )}
              </select>
              <button
                type="button"
                onClick={() => setShowNewGroup(true)}
                disabled={isLoading}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center transition-colors disabled:opacity-50"
                title="Create new group"
              >
                <Plus size={16} className="mr-1" />
                New
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="New group name"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewGroup(false)}
                disabled={isLoading}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                title="Cancel new group"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !name.trim() || !value.trim() || (showNewGroup && !newGroup.trim())}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? (
            <>
              <LoadingSpinner className="mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Save Secret
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Main Component
export default function SecretsManager() {
  const [secrets, setSecrets] = useState([]);
  const [groups, setGroups] = useState([]);
  const [editingSecret, setEditingSecret] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [openGroups, setOpenGroups] = useState({});
  const [error, setError] = useState(null);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsInitialLoading(true);
    setError(null);
    try {
      const data = await GetDataFromAPI();
      setSecrets(data.secrets || []);
      setGroups(data.groups || []);
      console.log("data:",data);
      // Set all groups to open by default
      const initialOpenGroups = (data.groups || []).reduce((acc, group) => {
        acc[group] = true;
        return acc;
      }, {});
      setOpenGroups(initialOpenGroups);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load secrets. Please try again.');
    } finally {
      setIsInitialLoading(false);
    }
  };

  const filteredSecrets = secrets.filter(secret => {
    if (!searchTerm) return true;
    const groupName = secret.group_name || secret.group || '';
    return (
      secret.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      secret.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSaveSecret = async (secret, newGroupName) => {
    setIsLoading(true);
    setError(null);
    try {
      const isEditing = secret.id && secrets.some(s => s.id === secret.id);
      
      // Create new group if needed
      if (newGroupName && !groups.includes(newGroupName)) {
        await CreateGroup({ name: newGroupName });
        setGroups([...groups, newGroupName]);
        setOpenGroups({...openGroups, [newGroupName]: true});
      }
      
      let savedSecret;
      if (isEditing) {
        savedSecret = await UpdateSecret(secret.id, secret);
        setSecrets(secrets.map(s => s.id === secret.id ? { ...s, ...savedSecret } : s));
      } else {
        savedSecret = await CreateSecret(secret);
        setSecrets([...secrets, savedSecret]);
      }
      
      setEditingSecret(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving secret:', error);
      setError('Failed to save secret. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSecret = async (id) => {
    if (!window.confirm('Are you sure you want to delete this secret?')) return;
    
    setIsLoading(true);
    setError(null);
    try {
      await DeleteSecret(id);
      setSecrets(secrets.filter(secret => secret.id !== id));
    } catch (error) {
      console.error('Error deleting secret:', error);
      setError('Failed to delete secret. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleGroup = (group) => {
    setOpenGroups({
      ...openGroups,
      [group]: !openGroups[group]
    });
  };

  const handleRefresh = () => {
    loadData();
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size={32} />
          <p className="mt-4 text-gray-600">Loading secrets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Lock className="mr-3 text-blue-600" />
              Secrets Manager
            </h1>
            <p className="text-gray-600 mt-1">Securely manage your API keys and secrets</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
              title="Refresh data"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>
            
            <button
              onClick={() => {
                setIsAdding(true);
                setEditingSecret(null);
              }}
              disabled={isAdding || editingSecret || isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-sm transition-all"
            >
              <Plus size={18} className="mr-2" />
              Add Secret
            </button>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search secrets, groups, or values..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        
        {/* Form Modal */}
        <Modal 
          isOpen={isAdding || editingSecret} 
          onClose={() => {
            if (!isLoading) {
              setIsAdding(false);
              setEditingSecret(null);
            }
          }}
        >
          <SecretForm
            secret={editingSecret}
            groups={groups}
            onSave={handleSaveSecret}
            onCancel={() => {
              setIsAdding(false);
              setEditingSecret(null);
            }}
            isLoading={isLoading}
          />
        </Modal>
        
        {/* Secrets List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-h-[70vh] overflow-y-auto">
          <div className="p-6">
            {groups.map(group => (
              <GroupPanel
                key={group}
                group={group}
                secrets={filteredSecrets}
                onEdit={setEditingSecret}
                onDelete={handleDeleteSecret}
                isOpen={openGroups[group]}
                onToggle={() => toggleGroup(group)}
                isLoading={isLoading}
              />
            ))}
            
            {filteredSecrets.length === 0 && searchTerm && (
              <div className="text-center py-12 text-gray-500">
                <Search size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No secrets found</h3>
                <p>No secrets match your search for "{searchTerm}"</p>
              </div>
            )}
            
            {secrets.length === 0 && !searchTerm && (
              <div className="text-center py-12 text-gray-500">
                <Lock size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No secrets yet</h3>
                <p>Click "Add Secret" to get started with your first secret.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Stats Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Total: {secrets.length} secrets • {groups.length} groups
        </div>
      </div>
    </div>
  );
}