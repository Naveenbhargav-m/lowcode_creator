import { useState } from 'react';
import { Plus, Trash2, Edit, Save, X, ChevronDown, ChevronUp, Search, Lock, Key } from 'lucide-react';

// Sample initial data
const initialSecrets = [
  { id: '1', name: 'AWS Access Key', value: '********AKXY', group: 'AWS' },
  { id: '2', name: 'AWS Secret Key', value: '********YZ12', group: 'AWS' },
  { id: '3', name: 'Stripe API Key', value: '********sk_test', group: 'Payment' },
  { id: '4', name: 'SendGrid API Key', value: '********SG.key', group: 'Email' },
  { id: '5', name: 'MongoDB URI', value: '********mongodb+srv://', group: 'Database' }
];

const initialGroups = ['AWS', 'Payment', 'Email', 'Database', 'Other'];

// Secret Item Component
const SecretItem = ({ secret, onEdit, onDelete }) => {
  const [showValue, setShowValue] = useState(false);
  
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm mb-2 hover:shadow-md transition-shadow">
      <div className="flex-1">
        <h3 className="font-medium text-gray-800">{secret.name}</h3>
        <div className="flex items-center mt-1">
          <div className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded flex-1">
            {showValue ? secret.value : '••••••••••••'}
          </div>
          <button 
            onClick={() => setShowValue(!showValue)} 
            className="ml-2 text-gray-500 hover:text-blue-600"
          >
            <Lock size={16} />
          </button>
        </div>
      </div>
      <div className="flex shrink-0 ml-4">
        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
          {secret.group}
        </span>
        <button 
          onClick={() => onEdit(secret)} 
          className="ml-2 text-gray-500 hover:text-blue-600"
        >
          <Edit size={16} />
        </button>
        <button 
          onClick={() => onDelete(secret.id)} 
          className="ml-2 text-gray-500 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

// Group Panel Component
const GroupPanel = ({ group, secrets, onEdit, onDelete, isOpen, onToggle }) => {
  const filteredSecrets = secrets.filter(secret => secret.group === group);
  
  if (filteredSecrets.length === 0) return null;
  
  return (
    <div className="mb-4">
      <div 
        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg cursor-pointer"
        onClick={onToggle}
      >
        <h2 className="font-semibold text-gray-700 flex items-center">
          <Key size={16} className="mr-2 text-blue-600" />
          {group} <span className="ml-2 text-sm text-gray-500">({filteredSecrets.length})</span>
        </h2>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      
      {isOpen && (
        <div className="mt-2 pl-2">
          {filteredSecrets.map(secret => (
            <SecretItem 
              key={secret.id} 
              secret={secret} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Secret Form Component
const SecretForm = ({ secret, groups, onSave, onCancel }) => {
  const [name, setName] = useState(secret?.name || '');
  const [value, setValue] = useState(secret?.value || '');
  const [group, setGroup] = useState(secret?.group || groups[0]);
  const [newGroup, setNewGroup] = useState('');
  const [showNewGroup, setShowNewGroup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalGroup = showNewGroup ? newGroup : group;
    onSave({
      id: secret?.id || Date.now().toString(),
      name,
      value,
      group: finalGroup
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        {secret ? 'Edit Secret' : 'Add New Secret'}
      </h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Secret Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g. AWS Access Key"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Secret Value</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g. xkeysib-83jd92..."
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
        {!showNewGroup ? (
          <div className="flex">
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {groups.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowNewGroup(true)}
              className="ml-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
            >
              <Plus size={16} className="mr-1" />
              New
            </button>
          </div>
        ) : (
          <div className="flex">
            <input
              type="text"
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="New group name"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewGroup(false)}
              className="ml-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Save size={16} className="mr-1" />
          Save Secret
        </button>
      </div>
    </form>
  );
};

// Main Component
export default function SecretsManager() {
  const [secrets, setSecrets] = useState(initialSecrets);
  const [groups, setGroups] = useState(initialGroups);
  const [editingSecret, setEditingSecret] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openGroups, setOpenGroups] = useState(initialGroups.reduce((acc, group) => {
    acc[group] = true;
    return acc;
  }, {}));

  const filteredSecrets = secrets.filter(secret => {
    if (!searchTerm) return true;
    return (
      secret.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      secret.group.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSaveSecret = (secret) => {
    if (secret.id && secrets.some(s => s.id === secret.id)) {
      setSecrets(secrets.map(s => s.id === secret.id ? secret : s));
    } else {
      setSecrets([...secrets, secret]);
    }
    
    if (!groups.includes(secret.group)) {
      setGroups([...groups, secret.group]);
      setOpenGroups({...openGroups, [secret.group]: true});
    }
    
    setEditingSecret(null);
    setIsAdding(false);
  };

  const handleDeleteSecret = (id) => {
    setSecrets(secrets.filter(secret => secret.id !== id));
  };

  const toggleGroup = (group) => {
    setOpenGroups({
      ...openGroups,
      [group]: !openGroups[group]
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Lock className="mr-2 text-blue-600" />
          Secrets Manager
        </h1>
        
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingSecret(null);
          }}
          disabled={isAdding || editingSecret}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <Plus size={16} className="mr-1" />
          Add Secret
        </button>
      </div>
      
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search secrets or groups..."
          className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {(isAdding || editingSecret) && (
        <div className="mb-6">
          <SecretForm
            secret={editingSecret}
            groups={groups}
            onSave={handleSaveSecret}
            onCancel={() => {
              setIsAdding(false);
              setEditingSecret(null);
            }}
          />
        </div>
      )}
      
      <div className="space-y-2">
        {groups.map(group => (
          <GroupPanel
            key={group}
            group={group}
            secrets={filteredSecrets}
            onEdit={setEditingSecret}
            onDelete={handleDeleteSecret}
            isOpen={openGroups[group]}
            onToggle={() => toggleGroup(group)}
          />
        ))}
        
        {filteredSecrets.length === 0 && searchTerm && (
          <div className="text-center py-12 text-gray-500">
            No secrets found matching "{searchTerm}"
          </div>
        )}
        
        {secrets.length === 0 && !searchTerm && (
          <div className="text-center py-12 text-gray-500">
            No secrets added yet. Click "Add Secret" to get started.
          </div>
        )}
      </div>
    </div>
  );
}