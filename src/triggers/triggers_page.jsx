import { useState, useEffect } from 'react';
import { Code, Edit, Eye, List, Plus, Save, ChevronRight } from 'lucide-react';
import { TablesTab } from '../table_builder/tables_page';
import { dbViewSignal } from '../table_builder/table_builder_state';

// Main component for Trigger Management UI
export function TriggerManagementUI() {
  const [triggers, setTriggers] = useState([]);
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [tables, setTables] = useState([]);
  const [viewMode, setViewMode] = useState('details'); // 'details' or 'edit'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data fetch - replace with your actual data fetching logic
    const fetchData = async () => {
      try {
        // Mock data for demonstration
        const mockTriggers = [
          { id: 1, name: 'after_insert_users', table: 'users', event: 'AFTER INSERT', createdAt: '2025-04-20', condition: 'NEW.status = "active"', action: 'INSERT INTO audit_log (table_name, operation, record_id) VALUES ("users", "INSERT", NEW.id);' },
          { id: 2, name: 'before_update_orders', table: 'orders', event: 'BEFORE UPDATE', createdAt: '2025-04-22', condition: 'NEW.total != OLD.total', action: 'SET NEW.modified_at = NOW();' },
          { id: 3, name: 'after_delete_products', table: 'products', event: 'AFTER DELETE', createdAt: '2025-04-23', condition: '', action: 'INSERT INTO product_deletion_log (product_id, deleted_at) VALUES (OLD.id, NOW());' },
        ];
        
        const mockTables = ['users', 'orders', 'products', 'customers', 'inventory'];
        
        setTriggers(mockTriggers);
        setTables(mockTables);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTriggerSelect = (trigger) => {
    setSelectedTrigger(trigger);
    setViewMode('details');
  };

  const handleCreateTrigger = () => {
    const newTrigger = {
      id: null,
      name: '',
      table: '',
      event: 'AFTER INSERT',
      condition: '',
      action: ''
    };
    setSelectedTrigger(newTrigger);
    setViewMode('edit');
  };

  const handleEditToggle = () => {
    setViewMode(viewMode === 'details' ? 'edit' : 'details');
  };

  const handleSaveTrigger = (updatedTrigger) => {
    if (updatedTrigger.id) {
      // Update existing trigger
      setTriggers(triggers.map(t => t.id === updatedTrigger.id ? updatedTrigger : t));
    } else {
      // Add new trigger with generated ID
      const newId = Math.max(...triggers.map(t => t.id), 0) + 1;
      const newTrigger = { ...updatedTrigger, id: newId, createdAt: new Date().toISOString().split('T')[0] };
      setTriggers([...triggers, newTrigger]);
    }
    setSelectedTrigger(updatedTrigger.id ? updatedTrigger : { ...updatedTrigger, id: Math.max(...triggers.map(t => t.id), 0) + 1 });
    setViewMode('details');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading trigger data...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel - Trigger List */}
      <TablesTab onTableSelect={(tab) => dbViewSignal.value = tab}/>
      <TriggerList 
        triggers={triggers} 
        selectedTriggerId={selectedTrigger?.id}
        onSelectTrigger={handleTriggerSelect}
        onCreateTrigger={handleCreateTrigger}
      />
      
      {/* Right Panel - Trigger Details/Edit */}
      <div className="flex-1 p-6 bg-white overflow-auto">
        {selectedTrigger ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {selectedTrigger.id ? selectedTrigger.name : 'Create New Trigger'}
              </h2>
              <div className="flex gap-2">
                {selectedTrigger.id && (
                  <button 
                    onClick={handleEditToggle} 
                    className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    {viewMode === 'details' ? (
                      <>
                        <Code size={16} /> <span>Edit</span>
                      </>
                    ) : (
                      <>
                        <Eye size={16} /> <span>View Details</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            
            {viewMode === 'details' ? (
              <TriggerDetails trigger={selectedTrigger} />
            ) : (
              <TriggerForm 
                trigger={selectedTrigger} 
                tables={tables}
                onSave={handleSaveTrigger}
              />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <List size={48} />
            <p className="mt-4 text-lg">Select a trigger or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Component for the left panel trigger list
function TriggerList({ triggers, selectedTriggerId, onSelectTrigger, onCreateTrigger }) {
  return (
    <div className="w-72 bg-gray-800 text-white overflow-y-auto">
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-lg font-medium">Database Triggers</h2>
        <button 
          onClick={onCreateTrigger}
          className="p-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
          title="Create New Trigger"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="py-2">
        {triggers.length > 0 ? (
          triggers.map(trigger => (
            <div 
              key={trigger.id}
              onClick={() => onSelectTrigger(trigger)}
              className={`px-4 py-3 cursor-pointer hover:bg-gray-700 flex items-center justify-between ${selectedTriggerId === trigger.id ? 'bg-gray-700' : ''}`}
            >
              <div className="flex flex-col">
                <span className="font-medium">{trigger.name}</span>
                <span className="text-sm text-gray-400">{trigger.table} • {trigger.event}</span>
              </div>
              <ChevronRight size={16} className="text-gray-500" />
            </div>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-gray-400">
            No triggers found
          </div>
        )}
      </div>
    </div>
  );
}

// Component for displaying trigger details
function TriggerDetails({ trigger }) {
  return (
    <div className="space-y-6">
      <DetailCard title="Basic Information">
        <DetailItem label="Trigger Name" value={trigger.name} />
        <DetailItem label="Table" value={trigger.table} />
        <DetailItem label="Event" value={trigger.event} />
        {trigger.createdAt && (
          <DetailItem label="Created" value={trigger.createdAt} />
        )}
      </DetailCard>
      
      <DetailCard title="Execution">
        <DetailItem 
          label="Condition" 
          value={trigger.condition || "None (Always executes)"} 
          isCode={!!trigger.condition} 
        />
        <DetailItem 
          label="Action" 
          value={trigger.action} 
          isCode 
        />
      </DetailCard>
    </div>
  );
}

// Helper component for detail cards
function DetailCard({ title, children }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="font-medium text-gray-700">{title}</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {children}
      </div>
    </div>
  );
}

// Helper component for individual detail items
function DetailItem({ label, value, isCode = false }) {
  return (
    <div className="px-4 py-3 flex flex-col sm:flex-row">
      <div className="w-full sm:w-1/4 text-gray-500 mb-1 sm:mb-0">{label}</div>
      <div className="w-full sm:w-3/4">
        {isCode ? (
          <div className="bg-gray-50 p-3 rounded-md font-mono text-sm overflow-x-auto">
            {value}
          </div>
        ) : (
          <div className="text-gray-900">{value}</div>
        )}
      </div>
    </div>
  );
}

// Component for trigger editing form
function TriggerForm({ trigger, tables, onSave }) {
  const [formData, setFormData] = useState({ ...trigger });
  const [errors, setErrors] = useState({});

  const eventTypes = [
    'BEFORE INSERT',
    'AFTER INSERT',
    'BEFORE UPDATE',
    'AFTER UPDATE',
    'BEFORE DELETE',
    'AFTER DELETE'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    const newErrors = {};
    if (!formData.name) newErrors.name = "Trigger name is required";
    if (!formData.table) newErrors.table = "Table is required";
    if (!formData.action) newErrors.action = "Action is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Trigger Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="e.g., after_insert_users"
          required
        />
        
        <FormField
          label="Table"
          name="table"
          value={formData.table}
          onChange={handleChange}
          error={errors.table}
          required
          type="select"
        >
          <option value="">Select a table</option>
          {tables.map(table => (
            <option key={table} value={table}>{table}</option>
          ))}
        </FormField>
      </div>
      
      <FormField
        label="Event"
        name="event"
        value={formData.event}
        onChange={handleChange}
        type="select"
        required
      >
        {eventTypes.map(event => (
          <option key={event} value={event}>{event}</option>
        ))}
      </FormField>
      
      <FormField
        label="Condition (Optional)"
        name="condition"
        value={formData.condition}
        onChange={handleChange}
        placeholder="e.g., NEW.status = 'active'"
        type="textarea"
        rows={2}
      />
      
      <FormField
        label="Action"
        name="action"
        value={formData.action}
        onChange={handleChange}
        error={errors.action}
        placeholder="e.g., INSERT INTO audit_log (table_name, operation) VALUES ('users', 'INSERT');"
        type="textarea"
        rows={4}
        required
      />
      
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => onSave(trigger)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Save size={16} />
          Save Trigger
        </button>
      </div>
    </form>
  );
}

// Helper component for form fields
function FormField({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  type = "text", 
  required = false, 
  placeholder = "", 
  children,
  rows
}) {
  const id = `field-${name}`;
  
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {type === "select" ? (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${error ? 'border-red-300' : ''}`}
          required={required}
        >
          {children}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows || 3}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${error ? 'border-red-300' : ''}`}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${error ? 'border-red-300' : ''}`}
          placeholder={placeholder}
          required={required}
        />
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}