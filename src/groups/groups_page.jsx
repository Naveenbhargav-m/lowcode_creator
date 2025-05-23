import { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Search, X, Info, Users, RefreshCw } from 'lucide-react';

// ======== DATA LAYER ========
const useGroupsData = () => {
  const [groups, setGroups] = useState([]);
  const [deleteGroups, setDeleteGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setGroups([
        { id: 1, name: 'Administrators', isAdmin: true, memberCount: 5, description: 'Full system access' },
        { id: 2, name: 'Content Editors', isAdmin: false, memberCount: 12, description: 'Can edit content' },
        { id: 3, name: 'Viewers', isAdmin: false, memberCount: 28, description: 'Read-only access' },
        { id: 4, name: 'Marketing Team', isAdmin: false, memberCount: 8, description: 'Marketing content access' },
        { id: 5, name: 'Sales Team', isAdmin: false, memberCount: 15, description: 'Sales data access' },
        { id: 6, name: 'Support Team', isAdmin: false, memberCount: 10, description: 'Customer support access' },
        { id: 7, name: 'Development Team', isAdmin: true, memberCount: 7, description: 'Development access' },
        { id: 8, name: 'Quality Assurance', isAdmin: false, memberCount: 6, description: 'Testing and QA access' },
        { id: 9, name: 'HR Department', isAdmin: false, memberCount: 4, description: 'Human resources access' },
        { id: 10, name: 'Finance Team', isAdmin: false, memberCount: 3, description: 'Financial data access' }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const addGroup = (groupData) => {
    const newGroup = {
      id: Date.now(),
      memberCount: 0,
      ...groupData,
      _changeType: "create"
    };
    setGroups(prev => [...prev, newGroup]);
    return Promise.resolve(newGroup);
  };

  const updateGroup = (id, groupData) => {
    setGroups(prev => prev.map(group => {
      if (group.id === id) {
        // If it's already a create, keep it as create
        const changeType = group._changeType === "create" ? "create" : "update";
        return { ...group, ...groupData, _changeType: changeType };
      }
      return group;
    }));
    return Promise.resolve();
  };

  const deleteGroup = (id) => {
    const groupToDelete = groups.find(g => g.id === id);
    if (groupToDelete && groupToDelete._changeType !== "create") {
      setDeleteGroups(prev => [...prev, id]);
    }
    setGroups(prev => prev.filter(group => group.id !== id));
    return Promise.resolve();
  };

  return { groups, loading, deleteGroups, addGroup, updateGroup, deleteGroup };
};

// ======== COMPONENTS ========
const Button = ({ children, variant = 'primary', size = 'md', icon, onClick, disabled, className = '' }) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center rounded-md font-medium transition-colors
        ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

const Modal = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-medium">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
};

const GroupForm = ({ group, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: group?.name || '',
    description: group?.description || '',
    isAdmin: group?.isAdmin || false,
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setErrors({ name: 'Group name is required' });
      return;
    }
    setErrors({});
    onSubmit(formData);
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Group Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter group name"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
            ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the group's purpose"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          name="isAdmin"
          checked={formData.isAdmin}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <label className="ml-2 block text-sm text-gray-700">Administrator Group</label>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>
          {group ? 'Update Group' : 'Create Group'}
        </Button>
      </div>
    </div>
  );
};

const GroupsTable = ({ groups, onEdit, onDelete }) => {
  if (!groups.length) {
    return (
      <div className="text-center py-12" style={{}}>
        <Users size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No groups yet</h3>
        <p className="text-gray-500 mb-6">Create your first user group to get started</p>
        <Button onClick={() => onEdit()} variant="primary">Create Group</Button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Fixed Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Members
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
        </table>
      </div>
      
      {/* Scrollable Body */}
      <div className="overflow-y-auto" style={{ maxHeight: '350px' }}>
        <table className="min-w-full">
          <tbody className="bg-white divide-y divide-gray-200">
            {groups.map((group, index) => (
              <tr key={group.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{group.name}</div>
                  <div className="text-sm text-gray-500">{group.description}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{group.memberCount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    group.isAdmin ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {group.isAdmin ? 'Admin' : 'Standard'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {group._changeType && (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      group._changeType === 'create' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {group._changeType}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEdit(group)}
                      icon={<Edit size={16} />}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDelete(group.id)}
                      icon={<Trash2 size={16} />}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ======== MAIN APP ========
export function UserGroupsManager() {
  const { groups, loading, deleteGroups, addGroup, updateGroup, deleteGroup } = useGroupsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [notification, setNotification] = useState(null);

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEdit = (group = null) => {
    setCurrentGroup(group);
    setIsModalOpen(true);
  };

  const handleSync = () => {
    console.log("Groups with changes:", groups.filter(g => g._changeType));
    console.log("Groups to delete:", deleteGroups);
  };

  const handleDelete = (groupId) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      deleteGroup(groupId).then(() => {

      }).catch(() => {
      });
    }
  };

  const handleSubmit = (formData) => {
    const operation = currentGroup 
      ? updateGroup(currentGroup.id, formData)
      : addGroup(formData);
    
    operation.then(() => {
      setIsModalOpen(false);

    }).catch(() => {
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Groups</h1>
            <p className="text-gray-600 mt-1">Manage user groups and permissions</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <Button
              variant="success"
              onClick={handleSync}
              size="sm"
              icon={<RefreshCw size={16} />}
            > 
              Sync
            </Button>
            <Button 
              onClick={() => handleAddEdit()} 
              icon={<PlusCircle size={18} />}
            >
              Add Group
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden pb-8">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search groups..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading groups...</div>
          ) : (
            <GroupsTable 
              groups={filteredGroups} 
              onEdit={handleAddEdit} 
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
      
      <Modal 
        title={currentGroup ? "Edit Group" : "Create New Group"} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      >
        <GroupForm 
          group={currentGroup} 
          onSubmit={handleSubmit} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}