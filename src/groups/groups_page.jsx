import { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Search, X, Info, Settings, Users } from 'lucide-react';

// ======== DATA LAYER ========
// This would typically connect to your API
const useGroupsData = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mock data loading - replace with actual API call
    setTimeout(() => {
      setGroups([
        { id: 1, name: 'Administrators', isAdmin: true, memberCount: 5, description: 'Full system access' },
        { id: 2, name: 'Content Editors', isAdmin: false, memberCount: 12, description: 'Can edit content' },
        { id: 3, name: 'Viewers', isAdmin: false, memberCount: 28, description: 'Read-only access' }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const addGroup = (groupData) => {
    // In real app, this would make an API call
    const newGroup = {
      id: Date.now(),
      memberCount: 0,
      ...groupData
    };
    setGroups([...groups, newGroup]);
    return Promise.resolve(newGroup);
  };

  const updateGroup = (id, groupData) => {
    // In real app, this would make an API call
    setGroups(groups.map(group => 
      group.id === id ? { ...group, ...groupData } : group
    ));
    return Promise.resolve();
  };

  const deleteGroup = (id) => {
    // In real app, this would make an API call
    setGroups(groups.filter(group => group.id !== id));
    return Promise.resolve();
  };

  return { groups, loading, error, addGroup, updateGroup, deleteGroup };
};

// ======== REUSABLE COMPONENTS ========
const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  onClick,
  disabled = false,
  className = '' 
}) => {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center rounded-md font-medium transition-colors
        ${variantClasses[variant]} 
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

const TextField = ({ 
  label, 
  name, 
  value, 
  onChange,
  placeholder = '',
  error = '',
  type = 'text',
  required = false
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
          ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

const Checkbox = ({ label, name, checked, onChange }) => {
  return (
    <div className="flex items-center mb-4">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
      />
      <label htmlFor={name} className="ml-2 block text-sm text-gray-700">
        {label}
      </label>
    </div>
  );
};

const Modal = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-medium">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const Alert = ({ message, type = 'info', onClose }) => {
  const typeClasses = {
    info: 'bg-blue-50 border-blue-300 text-blue-800',
    success: 'bg-green-50 border-green-300 text-green-800',
    error: 'bg-red-50 border-red-300 text-red-800',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
  };

  const iconMap = {
    info: <Info size={20} />,
    success: <Info size={20} />,
    error: <Info size={20} />,
    warning: <Info size={20} />,
  };

  return (
    <div className={`rounded-md border p-4 mb-4 flex justify-between ${typeClasses[type]}`}>
      <div className="flex">
        <div className="flex-shrink-0 mr-3">
          {iconMap[type]}
        </div>
        <div>{message}</div>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={16} />
        </button>
      )}
    </div>
  );
};

const EmptyState = ({ title, description, actionLabel, onAction, icon }) => {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

// ======== FEATURE COMPONENTS ========
const GroupForm = ({ group, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: group?.name || '',
    description: group?.description || '',
    isAdmin: group?.isAdmin || false
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Group name is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField 
        label="Group Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter group name"
        error={errors.name}
        required
      />
      
      <TextField 
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Describe the group's purpose"
      />
      
      <Checkbox
        label="Administrator Group"
        name="isAdmin"
        checked={formData.isAdmin}
        onChange={handleChange}
      />
      
      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          {group ? 'Update Group' : 'Create Group'}
        </Button>
      </div>
    </form>
  );
};

const GroupsTable = ({ groups, onEdit, onDelete }) => {
  if (!groups.length) {
    return (
      <EmptyState
        title="No groups yet"
        description="Create your first user group to get started"
        actionLabel="Create Group"
        onAction={() => onEdit()}
        icon={<Users size={48} className="text-gray-400" />}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Members
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Permissions
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {groups.map((group) => (
            <tr key={group.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{group.name}</div>
                <div className="text-sm text-gray-500">{group.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{group.memberCount}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {group.isAdmin ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Admin
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Standard
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
  );
};

const GroupListItem = ({ group, onEdit, onDelete }) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <div className="flex items-center justify-between p-4">
        <div>
          <h3 className="font-medium text-gray-900">{group.name}</h3>
          <p className="text-sm text-gray-500">{group.description}</p>
          <div className="flex items-center mt-1">
            <span className="text-xs text-gray-500">{group.memberCount} members</span>
            {group.isAdmin && (
              <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                Admin
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
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
      </div>
    </div>
  );
};

const SearchFilter = ({ value, onChange }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search groups..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

// ======== MAIN APP COMPONENT ========
export function UserGroupsManager() {
  const { groups, loading, error, addGroup, updateGroup, deleteGroup } = useGroupsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'list'
  const [notification, setNotification] = useState(null);

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEdit = (group = null) => {
    setCurrentGroup(group);
    setIsModalOpen(true);
  };

  const handleDelete = (groupId) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      deleteGroup(groupId).then(() => {
        showNotification('Group deleted successfully', 'success');
      }).catch(err => {
        showNotification('Failed to delete group', 'error');
      });
    }
  };

  const handleSubmit = (formData) => {
    const operation = currentGroup 
      ? updateGroup(currentGroup.id, formData)
      : addGroup(formData);
    
    operation.then(() => {
      setIsModalOpen(false);
      showNotification(
        currentGroup ? 'Group updated successfully' : 'Group created successfully',
        'success'
      );
    }).catch(err => {
      showNotification('An error occurred', 'error');
    });
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Groups</h1>
            <p className="text-gray-600 mt-1">Manage user groups and permissions</p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <Button 
              onClick={() => handleAddEdit()} 
              icon={<PlusCircle size={18} />}
            >
              Add Group
            </Button>
          </div>
        </div>
        
        {notification && (
          <Alert 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification(null)} 
          />
        )}
        
        <Card className="mb-6">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <SearchFilter 
              value={searchTerm}
              onChange={setSearchTerm}
            />
            
            <div className="flex items-center space-x-2">
              <Button 
                variant={viewMode === 'table' ? 'primary' : 'secondary'} 
                size="sm" 
                onClick={() => setViewMode('table')}
                icon={<Settings size={16} />}
              >
                Table
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'primary' : 'secondary'} 
                size="sm" 
                onClick={() => setViewMode('list')}
                icon={<Settings size={16} />}
              >
                List
              </Button>
            </div>
          </div>
          
          <div>
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading groups...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">Error loading groups</div>
            ) : viewMode === 'table' ? (
              <GroupsTable 
                groups={filteredGroups} 
                onEdit={handleAddEdit} 
                onDelete={handleDelete}
              />
            ) : (
              <div>
                {filteredGroups.length === 0 ? (
                  <EmptyState
                    title="No groups found"
                    description={searchTerm ? "Try adjusting your search" : "Create your first user group to get started"}
                    actionLabel={!searchTerm ? "Create Group" : null}
                    onAction={!searchTerm ? () => handleAddEdit() : null}
                    icon={<Users size={48} className="text-gray-400" />}
                  />
                ) : (
                  filteredGroups.map(group => (
                    <GroupListItem 
                      key={group.id} 
                      group={group} 
                      onEdit={handleAddEdit} 
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </Card>
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