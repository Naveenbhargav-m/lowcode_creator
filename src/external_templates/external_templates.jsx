import { useState } from 'react';
import { Search, Plus, Trash2, Edit2, Save, X, ChevronDown, ChevronRight, Mail, MessageSquare, AlertCircle, Bell, FileText } from 'lucide-react';

// Dummy data
const initialTemplates = [
  {
    id: 1,
    name: 'Welcome Email',
    type: 'email',
    platform: 'SendGrid',
    group: 'Onboarding',
    content: 'Welcome to our platform! Were excited to have you on board.',
    subject: 'Welcome to Our Platform'
  },
  {
    id: 2,
    name: 'Password Reset',
    type: 'email',
    platform: 'Mailchimp',
    group: 'Account',
    content: 'You requested a password reset. Click the link below to reset your password.',
    subject: 'Password Reset Request'
  },
  {
    id: 3,
    name: 'Order Confirmation',
    type: 'sms',
    platform: 'Twilio',
    group: 'Transactions',
    content: 'Your order #12345 has been confirmed and is being processed.',
  },
  {
    id: 4,
    name: 'Appointment Reminder',
    type: 'sms',
    platform: 'Twilio',
    group: 'Notifications',
    content: 'Reminder: You have an appointment scheduled for tomorrow at 2 PM.',
  }
];

// Initial platforms and groups
const initialPlatforms = ['SendGrid', 'Mailchimp', 'Twilio', 'Customer.io', 'Braze'];
const initialGroups = ['Onboarding', 'Account', 'Transactions', 'Notifications', 'Marketing'];
const templateTypes = ['email', 'sms', 'push', 'webhook', 'in-app'];

// Component for Template Card
const TemplateCard = ({ template, onEdit, onDelete }) => {
  let typeIcon;
  
  switch(template.type) {
    case 'email':
      typeIcon = <Mail className="w-4 h-4 text-blue-500" />;
      break;
    case 'sms':
      typeIcon = <MessageSquare className="w-4 h-4 text-green-500" />;
      break;
    case 'push':
      typeIcon = <Bell className="w-4 h-4 text-purple-500" />;
      break;
    case 'webhook':
      typeIcon = <AlertCircle className="w-4 h-4 text-orange-500" />;
      break;
    case 'in-app':
      typeIcon = <FileText className="w-4 h-4 text-indigo-500" />;
      break;
    default:
      typeIcon = <Mail className="w-4 h-4 text-gray-500" />;
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          {typeIcon}
          <h3 className="font-medium ml-2">{template.name}</h3>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(template)} 
            className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(template.id)} 
            className="p-1 text-gray-500 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mb-2 flex justify-between">
        <span>Platform: {template.platform}</span>
        <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">{template.group}</span>
      </div>
      
      <div className="text-sm text-gray-700 mb-1 truncate">
        {template.subject && <p className="font-medium">Subject: {template.subject}</p>}
        <p className="truncate mt-1">{template.content}</p>
      </div>
    </div>
  );
};

// Dropdown with Add New option
const DropdownWithAddNew = ({ options, value, onChange, onAddNew, placeholder }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState('');

  const handleAddNewClick = () => {
    setIsAdding(true);
  };

  const handleSaveNew = () => {
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

  if (isAdding) {
    return (
      <div className="flex">
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={`Add new ${placeholder}`}
          className="w-full p-2 border rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          autoFocus
        />
        <button 
          onClick={handleSaveNew}
          className="px-3 bg-blue-500 text-white border-blue-500 border rounded-none"
        >
          <Save className="w-4 h-4" />
        </button>
        <button 
          onClick={handleCancel}
          className="px-3 bg-gray-300 text-gray-700 border-gray-300 border rounded-r-md"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
      >
        <option value="">Select {placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
        <option value="__add_new__">+ Add New {placeholder}</option>
      </select>
      {value === "__add_new__" && setTimeout(() => {
        onChange("");
        handleAddNewClick();
      }, 0)}
    </div>
  );
};

// Template Form Component
const TemplateForm = ({ template, onSave, onCancel, platforms, groups, onAddPlatform, onAddGroup }) => {
  const [formData, setFormData] = useState(template || {
    name: '',
    type: 'email',
    platform: '',
    group: '',
    content: '',
    subject: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {template ? 'Edit Template' : 'Add New Template'}
        </h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {templateTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
            <DropdownWithAddNew
              options={platforms}
              value={formData.platform}
              onChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
              onAddNew={onAddPlatform}
              placeholder="Platform"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
            <DropdownWithAddNew
              options={groups}
              value={formData.group}
              onChange={(value) => setFormData(prev => ({ ...prev, group: value }))}
              onAddNew={onAddGroup}
              placeholder="Group"
            />
          </div>
        </div>
        
        {formData.type === 'email' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="8"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
};

// Template Group Component
const TemplateGroup = ({ group, templates, onEdit, onDelete, isExpanded, onToggle }) => {
  return (
    <div className="mb-4">
      <div 
        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center">
          {isExpanded ? 
            <ChevronDown className="w-4 h-4 mr-2" /> : 
            <ChevronRight className="w-4 h-4 mr-2" />
          }
          <h2 className="font-medium">{group}</h2>
          <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded-full">
            {templates.length}
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3 pl-6">
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
  const [templates, setTemplates] = useState(initialTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState(['Onboarding', 'Account']);
  const [platforms, setPlatforms] = useState(initialPlatforms);
  const [groups, setGroups] = useState(initialGroups);
  
  // Group templates
  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.group]) {
      acc[template.group] = [];
    }
    acc[template.group].push(template);
    return acc;
  }, {});
  
  // Filter templates based on search
  const filteredGroups = Object.keys(groupedTemplates).filter(group => {
    return group.toLowerCase().includes(searchTerm.toLowerCase()) || 
      groupedTemplates[group].some(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
  });
  
  const handleAddTemplate = () => {
    setEditingTemplate(null);
    setShowForm(true);
  };
  
  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setShowForm(true);
  };
  
  const handleDeleteTemplate = (id) => {
    setTemplates(templates.filter(template => template.id !== id));
  };
  
  const handleSaveTemplate = (templateData) => {
    if (editingTemplate) {
      // Update existing template
      setTemplates(templates.map(template => 
        template.id === editingTemplate.id ? { ...templateData, id: template.id } : template
      ));
    } else {
      // Add new template
      const newId = Math.max(0, ...templates.map(t => t.id)) + 1;
      setTemplates([...templates, { ...templateData, id: newId }]);
      
      // Auto-expand the group of the new template
      if (!expandedGroups.includes(templateData.group)) {
        setExpandedGroups([...expandedGroups, templateData.group]);
      }
    }
    setShowForm(false);
  };
  
  const toggleGroup = (group) => {
    if (expandedGroups.includes(group)) {
      setExpandedGroups(expandedGroups.filter(g => g !== group));
    } else {
      setExpandedGroups([...expandedGroups, group]);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Template Management</h1>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search templates..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddTemplate}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 mr-1" />
            Add Template
          </button>
        </div>
        
        {/* Template Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="max-w-2xl w-full mx-4">
              <TemplateForm 
                template={editingTemplate} 
                onSave={handleSaveTemplate} 
                onCancel={() => setShowForm(false)}
                platforms={platforms}
                groups={groups}
                onAddPlatform={handleAddPlatform}
                onAddGroup={handleAddGroup}
              />
            </div>
          </div>
        )}
        
        {/* Template Groups */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Templates</h2>
          
          {filteredGroups.length > 0 ? (
            filteredGroups.map(group => (
              <TemplateGroup
                key={group}
                group={group}
                templates={groupedTemplates[group].filter(template => 
                  template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  template.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  template.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  group.toLowerCase().includes(searchTerm.toLowerCase())
                )}
                onEdit={handleEditTemplate}
                onDelete={handleDeleteTemplate}
                isExpanded={expandedGroups.includes(group)}
                onToggle={() => toggleGroup(group)}
              />
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>No templates found. Try a different search term or add a new template.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}