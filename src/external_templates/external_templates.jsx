import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, ChevronDown, ChevronRight, Mail, MessageSquare, AlertCircle, Bell, FileText, RefreshCw } from 'lucide-react';

// Dummy data
const initialTemplates = [
  {
    id: 3,
    name: 'Order Confirmation',
    type: 'sms',
    platform: 'Twilio',
    group_name: 'Transactions',
    content: 'Your order #12345 has been confirmed and is being processed.',
    extras: {},
    _change_type: null
  },
  {
    id: 4,
    name: 'Appointment Reminder',
    type: 'sms',
    platform: 'Twilio',
    group_name: 'Notifications',
    content: 'Reminder: You have an appointment scheduled for tomorrow at 2 PM.',
    extras: {},
    _change_type: null
  }
];

const initialPlatforms = ['SendGrid', 'Mailchimp', 'Twilio', 'Customer.io', 'Braze'];
const initialGroups = ['Onboarding', 'Account', 'Transactions', 'Notifications', 'Marketing'];
const templateTypes = ['email', 'sms', 'push', 'webhook', 'in-app'];

// Mock API functions
const LoadDataFromAPI = () => Promise.resolve(initialTemplates);
const SetDataToAPI = (changes) => {
  console.log('API calls to be made:', changes);
  return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
};

// Reusable Button Component
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'sm', 
  className = '', 
  disabled = false, 
  loading = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg focus:ring-blue-500',
    secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 shadow-sm',
    success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg focus:ring-green-500',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md hover:shadow-lg focus:ring-red-500',
    ghost: 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1" />}
      {children}
    </button>
  );
};

// Reusable Input Component
const Input = ({ 
  label, 
  error, 
  required = false, 
  className = '', 
  containerClassName = '',
  ...props 
}) => (
  <div className={`space-y-1 ${containerClassName}`}>
    {label && (
      <label className="block text-xs font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      className={`block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${error ? 'border-red-300 focus:ring-red-500' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

// Enhanced Select with Add New functionality
const SelectWithAddNew = ({ 
  options, 
  value, 
  onChange, 
  onAddNew, 
  placeholder, 
  label, 
  required = false 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState('');

  const handleAddNew = () => {
    if (newValue.trim()) {
      onAddNew(newValue.trim());
      onChange(newValue.trim());
      setNewValue('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewValue('');
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {isAdding ? (
        <div className="flex gap-1">
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddNew();
              if (e.key === 'Escape') handleCancel();
            }}
            placeholder={`Add new ${placeholder.toLowerCase()}`}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            autoFocus
          />
          <Button variant="success" onClick={handleAddNew} size="xs" className="px-2">
            <Save size={12} />
          </Button>
          <Button variant="ghost" onClick={handleCancel} size="xs" className="px-2">
            <X size={12} />
          </Button>
        </div>
      ) : (
        <select
          value={value}
          onChange={(e) => {
            if (e.target.value === "__add_new__") {
              setIsAdding(true);
            } else {
              onChange(e.target.value);
            }
          }}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="">Select {placeholder}</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
          <option value="__add_new__" className="text-blue-600 font-medium">
            + Add New {placeholder}
          </option>
        </select>
      )}
    </div>
  );
};

// Template Type Icon Component
const TypeIcon = ({ type, className = "w-4 h-4" }) => {
  const icons = {
    email: <Mail className={`${className} text-blue-500`} />,
    sms: <MessageSquare className={`${className} text-green-500`} />,
    push: <Bell className={`${className} text-purple-500`} />,
    webhook: <AlertCircle className={`${className} text-orange-500`} />,
    'in-app': <FileText className={`${className} text-indigo-500`} />
  };
  
  return icons[type] || <Mail className={`${className} text-gray-500`} />;
};

// Change Indicator Component
const ChangeIndicator = ({ changeType }) => {
  if (!changeType) return null;
  
  const colors = {
    create: 'bg-green-500',
    update: 'bg-yellow-500',
    delete: 'bg-red-500'
  };
  
  return (
    <div className={`absolute -top-1 -right-1 w-3 h-3 ${colors[changeType]} rounded-full border-2 border-white shadow-sm`} />
  );
};

// Template Card Component
const TemplateCard = ({ template, onEdit, onDelete }) => {
  const isDeleted = template._change_type === 'delete';
  
  return (
    <div className={`relative group bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
      isDeleted ? 'bg-red-50 border-red-200 opacity-75' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <ChangeIndicator changeType={template._change_type} />
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <TypeIcon type={template.type} />
            <h3 className={`font-medium text-gray-900 truncate text-sm ${isDeleted ? 'line-through text-gray-500' : ''}`}>
              {template.name}
            </h3>
          </div>
          
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button 
              variant="ghost" 
              size="xs" 
              onClick={() => onEdit(template)}
              disabled={isDeleted}
              className="p-1"
            >
              <Edit2 size={12} />
            </Button>
            <Button 
              variant="ghost" 
              size="xs" 
              onClick={() => onDelete(template.id)}
              className="p-1 hover:text-red-600"
            >
              <Trash2 size={12} />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-medium text-gray-600">{template.platform}</span>
          <span className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
            {template.group_name}
          </span>
        </div>
        
        <div className="space-y-1">
          {template.subject && (
            <p className="font-medium text-gray-800 text-xs truncate">
              {template.subject}
            </p>
          )}
          <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
            {template.content}
          </p>
        </div>
      </div>
    </div>
  );
};

// Template Form Modal
const TemplateForm = ({ template, onSave, onCancel, platforms, groups, onAddPlatform, onAddGroup }) => {
  const [formData, setFormData] = useState(template || {
    name: '',
    type: 'email',
    platform: '',
    group_name: '',
    content: '',
    subject: '',
    extras: {}
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Template name is required';
    if (!formData.platform) newErrors.platform = 'Platform is required';
    if (!formData.group_name) newErrors.group_name = 'Group is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {template ? 'Edit Template' : 'Create New Template'}
          </h2>
          <Button variant="ghost" onClick={onCancel} size="xs" className="p-1">
            <X size={16} />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Template Name"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter template name"
                error={errors.name}
              />
              
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {templateTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <SelectWithAddNew
                label="Platform"
                required
                options={platforms}
                value={formData.platform}
                onChange={(value) => handleChange('platform', value)}
                onAddNew={onAddPlatform}
                placeholder="Platform"
              />
              
              <SelectWithAddNew
                label="Group"
                required
                options={groups}
                value={formData.group_name}
                onChange={(value) => handleChange('group_name', value)}
                onAddNew={onAddGroup}
                placeholder="Group"
              />
            </div>
            
            {formData.type === 'email' && (
              <Input
                label="Email Subject"
                value={formData.subject || ''}
                onChange={(e) => handleChange('subject', e.target.value)}
                placeholder="Enter email subject"
              />
            )}
            
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                rows="4"
                className={`block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-sm ${errors.content ? 'border-red-300 focus:ring-red-500' : ''}`}
                placeholder="Enter template content..."
              />
              {errors.content && <p className="text-xs text-red-600">{errors.content}</p>}
            </div>
            </div>
        </div>
        
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-100">
          <Button variant="secondary" onClick={onCancel} size="sm">
            Cancel
          </Button>
          <Button onClick={handleSubmit} size="sm">
            {template ? 'Update Template' : 'Create Template'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Template Group Component
const TemplateGroup = ({ group, templates, onEdit, onDelete, isExpanded, onToggle }) => {
  const totalTemplates = templates.length;
  const changedTemplates = templates.filter(t => t._change_type).length;

  return (
    <div className="mb-4">
      <div 
        className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 p-4 rounded-lg cursor-pointer transition-all duration-300 border border-gray-200"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          {isExpanded ? 
            <ChevronDown className="w-4 h-4 text-gray-600" /> : 
            <ChevronRight className="w-4 h-4 text-gray-600" />
          }
          <h2 className="text-base font-bold text-gray-900">{group}</h2>
          <div className="flex items-center space-x-2">
            <span className="bg-white px-2 py-0.5 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
              {totalTemplates}
            </span>
            {changedTemplates > 0 && (
              <span className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                {changedTemplates} changed
              </span>
            )}
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4 pl-4">
          {templates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main Component
export default function TemplateRegistrationPage() {
  const [templates, setTemplates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState(['Onboarding', 'Account']);
  const [platforms, setPlatforms] = useState(initialPlatforms);
  const [groups, setGroups] = useState(initialGroups);
  const [syncing, setSyncing] = useState(false);
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    LoadDataFromAPI().then(data => {
      setTemplates(data);
      const maxId = Math.max(0, ...data.map(t => t.id));
      setNextId(maxId + 1);
    });
  }, []);

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.group_name]) {
      acc[template.group_name] = [];
    }
    acc[template.group_name].push(template);
    return acc;
  }, {});

  const getPendingChanges = () => ({
    create: templates.filter(t => t._change_type === 'create'),
    update: templates.filter(t => t._change_type === 'update'),
    delete: templates.filter(t => t._change_type === 'delete')
  });

  const pendingChanges = getPendingChanges();
  const hasPendingChanges = Object.values(pendingChanges).some(arr => arr.length > 0);
  const totalPendingChanges = Object.values(pendingChanges).reduce((sum, arr) => sum + arr.length, 0);
  
  const handleAddTemplate = () => {
    setEditingTemplate(null);
    setShowForm(true);
  };
  
  const handleEditTemplate = (template) => {
    if (template._change_type === 'delete') return;
    setEditingTemplate(template);
    setShowForm(true);
  };
  
  const handleDeleteTemplate = (id) => {
    setTemplates(templates.map(template => {
      if (template.id === id) {
        if (template._change_type === 'create') {
          return null;
        } else {
          return { ...template, _change_type: 'delete' };
        }
      }
      return template;
    }).filter(Boolean));
  };
  
  const handleSaveTemplate = (templateData) => {
    if (editingTemplate) {
      setTemplates(templates.map(template => {
        if (template.id === editingTemplate.id) {
          const changeType = template._change_type === 'create' ? 'create' : 'update';
          return { 
            ...templateData, 
            id: template.id, 
            _change_type: changeType 
          };
        }
        return template;
      }));
    } else {
      const newTemplate = { 
        ...templateData, 
        id: nextId, 
        _change_type: 'create' 
      };
      setTemplates([...templates, newTemplate]);
      setNextId(nextId + 1);
      
      if (!expandedGroups.includes(templateData.group_name)) {
        setExpandedGroups([...expandedGroups, templateData.group_name]);
      }
    }
    setShowForm(false);
  };
  
  const toggleGroup = (group) => {
    setExpandedGroups(prev => 
      prev.includes(group) 
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const handleAddPlatform = (newPlatform) => {
    if (!platforms.includes(newPlatform)) {
      setPlatforms([...platforms, newPlatform]);
    }
  };

  const handleAddGroup = (newGroup) => {
    if (!groups.includes(newGroup)) {
      setGroups([...groups, newGroup]);
    }
  };

  const handleSyncChanges = async () => {
    setSyncing(true);
    try {
      await SetDataToAPI(getPendingChanges());
      setTemplates(templates
        .filter(t => t._change_type !== 'delete')
        .map(t => ({ ...t, _change_type: null }))
      );
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Template Management
            </h1>
            <div className="flex gap-2">
              {hasPendingChanges && (
                <Button
                  variant="success"
                  onClick={handleSyncChanges}
                  loading={syncing}
                  size="sm"
                >
                  <RefreshCw size={12} className="mr-1" />
                  Sync ({totalPendingChanges})
                </Button>
              )}
              <Button onClick={handleAddTemplate} size="sm">
                <Plus size={12} className="mr-1" />
                Create Template
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 h-full">
          {/* Template Form Modal */}
          {showForm && (
            <TemplateForm 
              template={editingTemplate} 
              onSave={handleSaveTemplate} 
              onCancel={() => setShowForm(false)}
              platforms={platforms}
              groups={groups}
              onAddPlatform={handleAddPlatform}
              onAddGroup={handleAddGroup}
            />
          )}
          
          {/* Template Groups - Scrollable */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 h-full overflow-y-auto">
            {Object.keys(groupedTemplates).length > 0 ? (
              <div>
                {Object.keys(groupedTemplates).map(group => (
                  <TemplateGroup
                    key={group}
                    group={group}
                    templates={groupedTemplates[group]}
                    onEdit={handleEditTemplate}
                    onDelete={handleDeleteTemplate}
                    isExpanded={expandedGroups.includes(group)}
                    onToggle={() => toggleGroup(group)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">No templates found</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                  Get started by creating your first template.
                </p>
                <Button onClick={handleAddTemplate} size="sm">
                  <Plus size={12} className="mr-1" />
                  Create Template
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}