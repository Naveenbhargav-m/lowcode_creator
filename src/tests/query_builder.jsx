import { useState, useEffect } from 'react';
import { Plus, Trash, Save, Edit, Database, Table, LayoutGrid, Filter, SortAsc, SortDesc, Copy, List, ChevronDown, ChevronRight, Search, ArrowRight, X, Code } from 'lucide-react';

// Centralized theme and styles
const theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#6366f1',
    background: '#f8fafc',
    surface: '#ffffff',
    border: '#e2e8f0',
    text: {
      primary: '#334155',
      secondary: '#64748b',
      light: '#94a3b8'
    },
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b'
  },
  borderRadius: {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  },
  spacing: {
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  }
};

// Sample database schema
const sampleSchema = {
  tables: {
    users: {
      id: 'integer',
      name: 'string',
      email: 'string',
      created_at: 'timestamp',
      role_id: 'integer'
    },
    roles: {
      id: 'integer',
      name: 'string',
      permissions: 'string'
    },
    orders: {
      id: 'integer',
      user_id: 'integer',
      amount: 'decimal',
      status: 'string',
      created_at: 'timestamp'
    },
    products: {
      id: 'integer',
      name: 'string',
      price: 'decimal',
      category_id: 'integer',
      stock: 'integer'
    },
    order_items: {
      id: 'integer',
      order_id: 'integer',
      product_id: 'integer',
      quantity: 'integer',
      price: 'decimal'
    },
    categories: {
      id: 'integer',
      name: 'string',
      parent_id: 'integer'
    }
  },
  relationships: [
    { from: 'users.role_id', to: 'roles.id' },
    { from: 'orders.user_id', to: 'users.id' },
    { from: 'order_items.order_id', to: 'orders.id' },
    { from: 'order_items.product_id', to: 'products.id' },
    { from: 'products.category_id', to: 'categories.id' },
    { from: 'categories.parent_id', to: 'categories.id' }
  ]
};

// Reusable components
const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false }) => {
  const baseClasses = 'flex items-center justify-center gap-1 font-medium transition-all';
  const variantClasses = {
    primary: `bg-blue-500 hover:bg-blue-600 text-white ${theme.borderRadius.md}`,
    secondary: `bg-gray-100 hover:bg-gray-200 text-gray-800 ${theme.borderRadius.md}`,
    danger: `bg-red-500 hover:bg-red-600 text-white ${theme.borderRadius.md}`,
    outline: `border border-gray-300 hover:bg-gray-100 text-gray-700 ${theme.borderRadius.md}`,
    ghost: 'hover:bg-gray-100 text-gray-700',
    link: 'text-blue-500 hover:underline'
  };
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-2'
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white shadow-sm border border-gray-200 ${theme.borderRadius.lg} overflow-hidden ${className}`}>
    {children}
  </div>
);

const Select = ({ options, value, onChange, placeholder = 'Select...', className = '' }) => {
  return (
    <select
      className={`border border-gray-300 ${theme.borderRadius.md} px-3 py-2 w-full bg-white ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const Input = ({ value, onChange, placeholder = '', type = 'text', className = '' }) => (
  <input
    type={type}
    className={`border border-gray-300 ${theme.borderRadius.md} px-3 py-2 w-full ${className}`}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
  />
);

const Badge = ({ children, color = 'blue', className = '' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
    gray: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 ${theme.borderRadius.full} text-xs font-medium ${colorClasses[color]} ${className}`}>
      {children}
    </span>
  );
};

const TabHeader = ({ active, children, onClick }) => (
  <button
    className={`px-4 py-2 font-medium text-sm flex items-center gap-1 ${
      active
        ? 'text-blue-600 border-b-2 border-blue-500'
        : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

// Schema Explorer Component
const SchemaExplorer = ({ schema, onTableSelect, onFieldSelect, selectedTable }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTables, setExpandedTables] = useState({});

  const filteredTables = Object.keys(schema.tables).filter(tableName => 
    tableName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTable = (tableName) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }));
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search tables..."
            className="pl-8"
          />
        </div>
      </div>
      <div className="p-2">
        {filteredTables.map(tableName => (
          <div key={tableName} className="mb-1">
            <div 
              className={`flex items-center gap-2 px-2 py-1.5 ${theme.borderRadius.md} cursor-pointer hover:bg-gray-100 ${selectedTable === tableName ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={() => {
                toggleTable(tableName);
                onTableSelect(tableName);
              }}
            >
              {expandedTables[tableName] ? 
                <ChevronDown className="h-4 w-4 text-gray-500" /> : 
                <ChevronRight className="h-4 w-4 text-gray-500" />
              }
              <Table className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{tableName}</span>
            </div>
            {expandedTables[tableName] && (
              <div className="ml-6 mt-1 border-l border-gray-200 pl-3">
                {Object.entries(schema.tables[tableName]).map(([fieldName, fieldType]) => (
                  <div 
                    key={fieldName}
                    className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-gray-100 text-sm"
                    onClick={() => onFieldSelect(tableName, fieldName, fieldType)}
                  >
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <span>{fieldName}</span>
                    <span className="text-xs text-gray-500 ml-auto">{fieldType}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// QueryDesigner components
const TableSelector = ({ tables, selectedTable, onSelectTable }) => {
  const tableOptions = Object.keys(tables).map(table => ({
    value: table,
    label: table
  }));

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">From Table</label>
      <Select
        options={tableOptions}
        value={selectedTable}
        onChange={onSelectTable}
        placeholder="Select a table"
      />
    </div>
  );
};

const FieldSelector = ({ availableFields, selectedFields, onToggleField }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Select Fields</label>
      <div className="border border-gray-300 rounded-md p-2 max-h-48 overflow-y-auto">
        {Object.keys(availableFields).length === 0 ? (
          <div className="text-gray-500 text-sm p-2">Select a table first</div>
        ) : (
          Object.keys(availableFields).map(field => (
            <div key={field} className="flex items-center mb-1 last:mb-0">
              <input
                type="checkbox"
                id={`field-${field}`}
                className="mr-2"
                checked={selectedFields.includes(field)}
                onChange={() => onToggleField(field)}
              />
              <label htmlFor={`field-${field}`} className="text-sm">
                {field} <span className="text-xs text-gray-500">({availableFields[field]})</span>
              </label>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const JoinBuilder = ({ schema, selectedTable, joins, onAddJoin, onRemoveJoin, onUpdateJoin }) => {
  const getRelatedTables = (tableName) => {
    const relatedTables = [];
    schema.relationships.forEach(rel => {
      const [fromTable] = rel.from.split('.');
      const [toTable] = rel.to.split('.');
      
      if (fromTable === tableName && !relatedTables.includes(toTable)) {
        relatedTables.push(toTable);
      }
      if (toTable === tableName && !relatedTables.includes(fromTable)) {
        relatedTables.push(fromTable);
      }
    });
    return relatedTables;
  };

  const findJoinCondition = (fromTable, toTable) => {
    for (const rel of schema.relationships) {
      const [fromTableRel, fromField] = rel.from.split('.');
      const [toTableRel, toField] = rel.to.split('.');
      
      if ((fromTableRel === fromTable && toTableRel === toTable) ||
          (fromTableRel === toTable && toTableRel === fromTable)) {
        return {
          fromTable: fromTableRel,
          fromField,
          toTable: toTableRel,
          toField
        };
      }
    }
    return null;
  };

  const handleAddJoin = () => {
    const relatedTables = getRelatedTables(selectedTable);
    if (relatedTables.length > 0) {
      const relatedTable = relatedTables[0];
      const condition = findJoinCondition(selectedTable, relatedTable);
      
      if (condition) {
        onAddJoin({
          type: 'INNER',
          table: relatedTable,
          on: {
            leftTable: condition.fromTable,
            leftField: condition.fromField,
            rightTable: condition.toTable,
            rightField: condition.toField
          }
        });
      }
    }
  };

  const joinTypeOptions = [
    { value: 'INNER', label: 'INNER JOIN' },
    { value: 'LEFT', label: 'LEFT JOIN' },
    { value: 'RIGHT', label: 'RIGHT JOIN' },
    { value: 'FULL', label: 'FULL JOIN' }
  ];

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">Joins</label>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddJoin}
          disabled={!selectedTable}
        >
          <Plus className="h-4 w-4" /> Add Join
        </Button>
      </div>
      
      {joins.length === 0 ? (
        <div className="text-gray-500 text-sm border border-dashed border-gray-300 rounded-md p-4 text-center">
          No joins defined. Click 'Add Join' to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {joins.map((join, index) => (
            <Card key={index} className="p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Select
                    options={joinTypeOptions}
                    value={join.type}
                    onChange={(value) => onUpdateJoin(index, { ...join, type: value })}
                    className="w-32"
                  />
                  <span className="font-medium text-sm">{join.table}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onRemoveJoin(index)}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>{join.on.leftTable}.{join.on.leftField}</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <span>{join.on.rightTable}.{join.on.rightField}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const WhereBuilder = ({ schema, selectedTable, joins, conditions, onAddCondition, onRemoveCondition, onUpdateCondition }) => {
  const [newConditionField, setNewConditionField] = useState('');
  const [newConditionOperator, setNewConditionOperator] = useState('=');
  const [newConditionValue, setNewConditionValue] = useState('');

  const getAvailableFields = () => {
    const fields = {};
    
    // Add fields from the selected table
    if (selectedTable && schema.tables[selectedTable]) {
      Object.entries(schema.tables[selectedTable]).forEach(([field, type]) => {
        fields[`${selectedTable}.${field}`] = type;
      });
    }
    
    // Add fields from joined tables
    joins.forEach(join => {
      if (schema.tables[join.table]) {
        Object.entries(schema.tables[join.table]).forEach(([field, type]) => {
          fields[`${join.table}.${field}`] = type;
        });
      }
    });
    
    return fields;
  };

  const availableFields = getAvailableFields();
  const fieldOptions = Object.keys(availableFields).map(field => ({
    value: field,
    label: field
  }));

  const operatorOptions = [
    { value: '=', label: '=' },
    { value: '!=', label: '!=' },
    { value: '>', label: '>' },
    { value: '<', label: '<' },
    { value: '>=', label: '>=' },
    { value: '<=', label: '<=' },
    { value: 'LIKE', label: 'LIKE' },
    { value: 'IN', label: 'IN' },
    { value: 'BETWEEN', label: 'BETWEEN' },
    { value: 'IS NULL', label: 'IS NULL' },
    { value: 'IS NOT NULL', label: 'IS NOT NULL' }
  ];

  const handleAddCondition = () => {
    if (newConditionField && newConditionOperator) {
      onAddCondition({
        field: newConditionField,
        operator: newConditionOperator,
        value: newConditionValue
      });
      
      // Reset form
      setNewConditionField('');
      setNewConditionOperator('=');
      setNewConditionValue('');
    }
  };

  const isNullOperator = (op) => op === 'IS NULL' || op === 'IS NOT NULL';

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">Where Conditions</label>
      </div>
      
      {/* Add new condition form */}
      <Card className="p-3 mb-3">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-5">
            <Select
              options={fieldOptions}
              value={newConditionField}
              onChange={setNewConditionField}
              placeholder="Select field"
              className="text-sm"
            />
          </div>
          <div className="col-span-3">
            <Select
              options={operatorOptions}
              value={newConditionOperator}
              onChange={setNewConditionOperator}
              className="text-sm"
            />
          </div>
          <div className="col-span-3">
            {!isNullOperator(newConditionOperator) && (
              <Input
                value={newConditionValue}
                onChange={setNewConditionValue}
                placeholder="Value"
                className="text-sm"
              />
            )}
          </div>
          <div className="col-span-1">
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddCondition}
              disabled={!newConditionField || !newConditionOperator || (!isNullOperator(newConditionOperator) && !newConditionValue)}
              className="w-full"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
      
      {/* List of conditions */}
      {conditions.length === 0 ? (
        <div className="text-gray-500 text-sm border border-dashed border-gray-300 rounded-md p-4 text-center">
          No conditions defined.
        </div>
      ) : (
        <div className="space-y-2">
          {conditions.map((condition, index) => (
            <Card key={index} className="p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <span className="font-medium">{condition.field}</span>
                  <span className="px-1">{condition.operator}</span>
                  {!isNullOperator(condition.operator) && (
                    <span className="bg-gray-100 px-2 py-0.5 rounded">{condition.value}</span>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onRemoveCondition(index)}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const GroupByBuilder = ({ schema, selectedTable, joins, groupByFields, onAddGroupByField, onRemoveGroupByField }) => {
  const [newGroupByField, setNewGroupByField] = useState('');

  const getAvailableFields = () => {
    const fields = {};
    
    // Add fields from the selected table
    if (selectedTable && schema.tables[selectedTable]) {
      Object.entries(schema.tables[selectedTable]).forEach(([field, type]) => {
        fields[`${selectedTable}.${field}`] = type;
      });
    }
    
    // Add fields from joined tables
    joins.forEach(join => {
      if (schema.tables[join.table]) {
        Object.entries(schema.tables[join.table]).forEach(([field, type]) => {
          fields[`${join.table}.${field}`] = type;
        });
      }
    });
    
    return fields;
  };

  const availableFields = getAvailableFields();
  const fieldOptions = Object.keys(availableFields).map(field => ({
    value: field,
    label: field
  }));

  const handleAddGroupByField = () => {
    if (newGroupByField && !groupByFields.includes(newGroupByField)) {
      onAddGroupByField(newGroupByField);
      setNewGroupByField('');
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">Group By</label>
      </div>
      
      {/* Add new group by field form */}
      <div className="flex gap-2 mb-3">
        <div className="flex-grow">
          <Select
            options={fieldOptions}
            value={newGroupByField}
            onChange={setNewGroupByField}
            placeholder="Select field"
            className="text-sm"
          />
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleAddGroupByField}
          disabled={!newGroupByField}
        >
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>
      
      {/* List of group by fields */}
      {groupByFields.length === 0 ? (
        <div className="text-gray-500 text-sm border border-dashed border-gray-300 rounded-md p-4 text-center">
          No group by fields defined.
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {groupByFields.map((field, index) => (
            <Badge key={index} color="blue" className="flex items-center gap-1">
              {field}
              <button 
                className="ml-1 hover:text-blue-600" 
                onClick={() => onRemoveGroupByField(index)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

const OrderByBuilder = ({ schema, selectedTable, joins, orderByFields, onAddOrderByField, onRemoveOrderByField, onUpdateOrderByField }) => {
  const [newOrderByField, setNewOrderByField] = useState('');
  const [newOrderByDirection, setNewOrderByDirection] = useState('ASC');

  const getAvailableFields = () => {
    const fields = {};
    
    // Add fields from the selected table
    if (selectedTable && schema.tables[selectedTable]) {
      Object.entries(schema.tables[selectedTable]).forEach(([field, type]) => {
        fields[`${selectedTable}.${field}`] = type;
      });
    }
    
    // Add fields from joined tables
    joins.forEach(join => {
      if (schema.tables[join.table]) {
        Object.entries(schema.tables[join.table]).forEach(([field, type]) => {
          fields[`${join.table}.${field}`] = type;
        });
      }
    });
    
    return fields;
  };

  const availableFields = getAvailableFields();
  const fieldOptions = Object.keys(availableFields).map(field => ({
    value: field,
    label: field
  }));

  const handleAddOrderByField = () => {
    if (newOrderByField) {
      onAddOrderByField({
        field: newOrderByField,
        direction: newOrderByDirection
      });
      
      // Reset form
      setNewOrderByField('');
      setNewOrderByDirection('ASC');
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">Order By</label>
      </div>
      
      {/* Add new order by field form */}
      <div className="flex gap-2 mb-3">
        <div className="flex-grow">
          <Select
            options={fieldOptions}
            value={newOrderByField}
            onChange={setNewOrderByField}
            placeholder="Select field"
            className="text-sm"
          />
        </div>
        <div className="w-24">
          <Select
            options={[
              { value: 'ASC', label: 'ASC' },
              { value: 'DESC', label: 'DESC' }
            ]}
            value={newOrderByDirection}
            onChange={setNewOrderByDirection}
            className="text-sm"
          />
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleAddOrderByField}
          disabled={!newOrderByField}
        >
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>
      
      {/* List of order by fields */}
      {orderByFields.length === 0 ? (
        <div className="text-gray-500 text-sm border border-dashed border-gray-300 rounded-md p-4 text-center">
          No order by fields defined.
        </div>
      ) : (
        <div className="space-y-2">
          {orderByFields.map((orderBy, index) => (
            <Card key={index} className="p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{orderBy.field}</span>
                  <Badge color={orderBy.direction === 'ASC' ? 'green' : 'purple'}>
                    {orderBy.direction === 'ASC' ? (
                      <div className="flex items-center gap-1">
                        <SortAsc className="h-3 w-3" /> ASC
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <SortDesc className="h-3 w-3" /> DESC
                      </div>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onUpdateOrderByField(index, {
                      ...orderBy,
                      direction: orderBy.direction === 'ASC' ? 'DESC' : 'ASC'
                    })}
                  >
                    {orderBy.direction === 'ASC' ? (
                      <SortDesc className="h-4 w-4 text-gray-500" />
                    ) : (
                      <SortAsc className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onRemoveOrderByField(index)}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const PaginationBuilder = ({ limit, offset, onUpdateLimit, onUpdateOffset }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Pagination</label>
      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block text-xs text-gray-500 mb-1">Limit</label>
          <Input
            type="number"
            value={limit}
            onChange={onUpdateLimit}
            placeholder="Limit"
            className="text-sm"
          />
        </div>
        <div className="w-1/2">
          <label className="block text-xs text-gray-500 mb-1">Offset</label>
          <Input
            type="number"
            value={offset}
            onChange={onUpdateOffset}
            placeholder="Offset"
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
};

// Query Editor Component
const QueryEditor = ({ query, onSaveQuery }) => {
  const [queryJson, setQueryJson] = useState(JSON.stringify(query, null, 2));
  
  useEffect(() => {
    setQueryJson(JSON.stringify(query, null, 2));
  }, [query]);

  const handleSave = () => {
    try {
      const parsedQuery = JSON.parse(queryJson);
      onSaveQuery(parsedQuery);
    } catch (error) {
      alert("Invalid JSON format");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">Query JSON</label>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-1" /> Save Changes
        </Button>
      </div>
      <textarea
        value={queryJson}
        onChange={(e) => setQueryJson(e.target.value)}
        className="flex-grow font-mono text-sm p-4 border border-gray-300 rounded-md"
      />
    </div>
  );
};

// Query List Component
const QueryList = ({ queries, activeQueryId, onSelectQuery, onDeleteQuery, onDuplicateQuery, onNewQuery }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-3 p-3 border-b border-gray-200">
        <h3 className="font-medium text-gray-800">Saved Queries</h3>
        <Button
          variant="primary"
          size="sm"
          onClick={onNewQuery}
        >
          <Plus className="h-4 w-4 mr-1" /> New Query
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto px-3">
        {queries.length === 0 ? (
          <div className="text-gray-500 text-sm border border-dashed border-gray-300 rounded-md p-4 text-center">
            No saved queries. Create a new one to get started.
          </div>
        ) : (
          <div className="space-y-2">
            {queries.map(query => (
              <Card 
                key={query.id}
                className={`p-3 cursor-pointer transition-all ${
                  activeQueryId === query.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                }`}
                onClick={() => onSelectQuery(query.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-sm">{query.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge color={query.type === 'SELECT' ? 'blue' : query.type === 'INSERT' ? 'green' : query.type === 'UPDATE' ? 'yellow' : 'red'}>
                        {query.type}
                      </Badge>
                      {query.isDirty && <Badge color="gray">Modified</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateQuery(query.id);
                      }}
                    >
                      <Copy className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteQuery(query.id);
                      }}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {query.table && <div>Table: {query.table}</div>}
                  <div>Last modified: {new Date(query.updatedAt).toLocaleString()}</div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// QueryDesigner component
const QueryDesigner = ({ schema, query, onChange }) => {
  const [activeTab, setActiveTab] = useState('fields');
  
  const handleTableSelect = (tableName) => {
    onChange({
      ...query,
      table: tableName,
      fields: []
    });
  };

  const handleToggleField = (field) => {
    const newFields = [...query.fields];
    const index = newFields.indexOf(field);
    
    if (index >= 0) {
      newFields.splice(index, 1);
    } else {
      newFields.push(field);
    }
    
    onChange({
      ...query,
      fields: newFields
    });
  };

  const handleAddJoin = (join) => {
    onChange({
      ...query,
      joins: [...query.joins, join]
    });
  };

  const handleRemoveJoin = (index) => {
    const newJoins = [...query.joins];
    newJoins.splice(index, 1);
    onChange({
      ...query,
      joins: newJoins
    });
  };

  const handleUpdateJoin = (index, updatedJoin) => {
    const newJoins = [...query.joins];
    newJoins[index] = updatedJoin;
    onChange({
      ...query,
      joins: newJoins
    });
  };

  const handleAddCondition = (condition) => {
    onChange({
      ...query,
      conditions: [...query.conditions, condition]
    });
  };

  const handleRemoveCondition = (index) => {
    const newConditions = [...query.conditions];
    newConditions.splice(index, 1);
    onChange({
      ...query,
      conditions: newConditions
    });
  };

  const handleUpdateCondition = (index, updatedCondition) => {
    const newConditions = [...query.conditions];
    newConditions[index] = updatedCondition;
    onChange({
      ...query,
      conditions: newConditions
    });
  };

  const handleAddGroupByField = (field) => {
    onChange({
      ...query,
      groupBy: [...query.groupBy, field]
    });
  };

  const handleRemoveGroupByField = (index) => {
    const newGroupBy = [...query.groupBy];
    newGroupBy.splice(index, 1);
    onChange({
      ...query,
      groupBy: newGroupBy
    });
  };

  const handleAddOrderByField = (orderBy) => {
    onChange({
      ...query,
      orderBy: [...query.orderBy, orderBy]
    });
  };

  const handleRemoveOrderByField = (index) => {
    const newOrderBy = [...query.orderBy];
    newOrderBy.splice(index, 1);
    onChange({
      ...query,
      orderBy: newOrderBy
    });
  };

  const handleUpdateOrderByField = (index, updatedOrderBy) => {
    const newOrderBy = [...query.orderBy];
    newOrderBy[index] = updatedOrderBy;
    onChange({
      ...query,
      orderBy: newOrderBy
    });
  };

  const handleUpdateLimit = (value) => {
    onChange({
      ...query,
      limit: value
    });
  };

  const handleUpdateOffset = (value) => {
    onChange({
      ...query,
      offset: value
    });
  };

  const availableFields = query.table ? schema.tables[query.table] : {};

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <TableSelector 
          tables={schema.tables} 
          selectedTable={query.table}
          onSelectTable={handleTableSelect}
        />
      </div>
      
      <div className="border-b border-gray-200 mb-4">
        <div className="flex">
          <TabHeader
            active={activeTab === 'fields'}
            onClick={() => setActiveTab('fields')}
          >
            <LayoutGrid className="h-4 w-4" /> Fields
          </TabHeader>
          <TabHeader
            active={activeTab === 'joins'}
            onClick={() => setActiveTab('joins')}
          >
            <Database className="h-4 w-4" /> Joins
          </TabHeader>
          <TabHeader
            active={activeTab === 'conditions'}
            onClick={() => setActiveTab('conditions')}
          >
            <Filter className="h-4 w-4" /> Where
          </TabHeader>
          <TabHeader
            active={activeTab === 'groupBy'}
            onClick={() => setActiveTab('groupBy')}
          >
            <List className="h-4 w-4" /> Group By
          </TabHeader>
          <TabHeader
            active={activeTab === 'orderBy'}
            onClick={() => setActiveTab('orderBy')}
          >
            <SortAsc className="h-4 w-4" /> Order By
          </TabHeader>
          <TabHeader
            active={activeTab === 'pagination'}
            onClick={() => setActiveTab('pagination')}
          >
            <LayoutGrid className="h-4 w-4" /> Pagination
          </TabHeader>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        {activeTab === 'fields' && (
          <FieldSelector 
            availableFields={availableFields}
            selectedFields={query.fields}
            onToggleField={handleToggleField}
          />
        )}
        
        {activeTab === 'joins' && (
          <JoinBuilder 
            schema={schema}
            selectedTable={query.table}
            joins={query.joins}
            onAddJoin={handleAddJoin}
            onRemoveJoin={handleRemoveJoin}
            onUpdateJoin={handleUpdateJoin}
          />
        )}
        
        {activeTab === 'conditions' && (
          <WhereBuilder 
            schema={schema}
            selectedTable={query.table}
            joins={query.joins}
            conditions={query.conditions}
            onAddCondition={handleAddCondition}
            onRemoveCondition={handleRemoveCondition}
            onUpdateCondition={handleUpdateCondition}
          />
        )}
        
        {activeTab === 'groupBy' && (
          <GroupByBuilder 
            schema={schema}
            selectedTable={query.table}
            joins={query.joins}
            groupByFields={query.groupBy}
            onAddGroupByField={handleAddGroupByField}
            onRemoveGroupByField={handleRemoveGroupByField}
          />
        )}
        
        {activeTab === 'orderBy' && (
          <OrderByBuilder 
            schema={schema}
            selectedTable={query.table}
            joins={query.joins}
            orderByFields={query.orderBy}
            onAddOrderByField={handleAddOrderByField}
            onRemoveOrderByField={handleRemoveOrderByField}
            onUpdateOrderByField={handleUpdateOrderByField}
          />
        )}
        
        {activeTab === 'pagination' && (
          <PaginationBuilder 
            limit={query.limit}
            offset={query.offset}
            onUpdateLimit={handleUpdateLimit}
            onUpdateOffset={handleUpdateOffset}
          />
        )}
      </div>
    </div>
  );
};

// Main component
export const VisualQueryBuilder = () => {
  const [queries, setQueries] = useState([
    {
      id: '1',
      name: 'User Orders Query',
      type: 'SELECT',
      table: 'users',
      fields: ['users.id', 'users.name', 'orders.amount'],
      joins: [
        {
          type: 'INNER',
          table: 'orders',
          on: {
            leftTable: 'users',
            leftField: 'id',
            rightTable: 'orders',
            rightField: 'user_id'
          }
        }
      ],
      conditions: [
        {
          field: 'users.role_id',
          operator: '=',
          value: '1'
        }
      ],
      groupBy: [],
      orderBy: [
        {
          field: 'orders.amount',
          direction: 'DESC'
        }
      ],
      limit: 10,
      offset: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDirty: false
    }
  ]);
  
  const [activeQueryId, setActiveQueryId] = useState('1');
  const [activeView, setActiveView] = useState('designer'); // 'designer', 'json', 'output'
  const [schema, setSchema] = useState(sampleSchema);
  
  const activeQuery = queries.find(q => q.id === activeQueryId) || queries[0];
  
  const handleQueryChange = (updatedQuery) => {
    const updatedQueries = queries.map(q => {
      if (q.id === activeQueryId) {
        return {
          ...updatedQuery,
          updatedAt: new Date().toISOString(),
          isDirty: true
        };
      }
      return q;
    });
    
    setQueries(updatedQueries);
  };
  
  const handleSaveQuery = (updatedQuery) => {
    const updatedQueries = queries.map(q => {
      if (q.id === activeQueryId) {
        return {
          ...updatedQuery,
          updatedAt: new Date().toISOString(),
          isDirty: false
        };
      }
      return q;
    });
    
    setQueries(updatedQueries);
  };
  
  const handleNewQuery = () => {
    const newId = String(Math.max(...queries.map(q => parseInt(q.id))) + 1);
    const newQuery = {
      id: newId,
      name: `New Query ${newId}`,
      type: 'SELECT',
      table: '',
      fields: [],
      joins: [],
      conditions: [],
      groupBy: [],
      orderBy: [],
      limit: 10,
      offset: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDirty: false
    };
    
    setQueries([...queries, newQuery]);
    setActiveQueryId(newId);
  };
  
  const handleDeleteQuery = (queryId) => {
    if (queries.length === 1) {
      alert("Cannot delete the only query. Create a new one first.");
      return;
    }
    
    const updatedQueries = queries.filter(q => q.id !== queryId);
    setQueries(updatedQueries);
    
    if (activeQueryId === queryId) {
      setActiveQueryId(updatedQueries[0].id);
    }
  };
  
  const handleDuplicateQuery = (queryId) => {
    const queryToDuplicate = queries.find(q => q.id === queryId);
    const newId = String(Math.max(...queries.map(q => parseInt(q.id))) + 1);
    
    const duplicatedQuery = {
      ...queryToDuplicate,
      id: newId,
      name: `${queryToDuplicate.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDirty: false
    };
    
    setQueries([...queries, duplicatedQuery]);
    setActiveQueryId(newId);
  };
  
  const handleSelectQuery = (queryId) => {
    setActiveQueryId(queryId);
  };
  
  const generateQueryOutput = () => {
    // This would typically format the query into the desired output format
    // For now, we'll just return the complete query object with a change tracking property
    if (!activeQuery) return null;
    
    return {
      queries: queries.map(q => ({
        ...q,
        status: q.isDirty ? 'MODIFIED' : 'NO_CHANGE'
      }))
    };
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50" style={{color:"black"}}>
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Visual Query Builder</h1>
          <div className="flex gap-2">
            <Button
              variant={activeView === 'designer' ? 'primary' : 'outline'}
              onClick={() => setActiveView('designer')}
            >
              <LayoutGrid className="h-4 w-4 mr-1" /> Designer
            </Button>
            <Button
              variant={activeView === 'json' ? 'primary' : 'outline'}
              onClick={() => setActiveView('json')}
            >
              <Code className="h-4 w-4 mr-1" /> JSON
            </Button>
            <Button
              variant={activeView === 'output' ? 'primary' : 'outline'}
              onClick={() => setActiveView('output')}
            >
              <Database className="h-4 w-4 mr-1" /> Output
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                const output = generateQueryOutput();
                console.log('Query Output:', output);
                alert('Query output generated! Check the console.');
              }}
            >
              <Save className="h-4 w-4 mr-1" /> Save All
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-grow flex overflow-hidden">
        <div className="w-1/4 border-r border-gray-200 overflow-hidden">
          <QueryList 
            queries={queries}
            activeQueryId={activeQueryId}
            onSelectQuery={handleSelectQuery}
            onDeleteQuery={handleDeleteQuery}
            onDuplicateQuery={handleDuplicateQuery}
            onNewQuery={handleNewQuery}
          />
        </div>
        
        <div className="w-1/4 border-r border-gray-200 overflow-hidden">
          <SchemaExplorer 
            schema={schema}
            onTableSelect={(tableName) => handleQueryChange({...activeQuery, table: tableName})}
            onFieldSelect={(tableName, fieldName) => {
              if (activeQuery.table === tableName && !activeQuery.fields.includes(`${tableName}.${fieldName}`)) {
                handleQueryChange({
                  ...activeQuery,
                  fields: [...activeQuery.fields, `${tableName}.${fieldName}`]
                });
              }
            }}
            selectedTable={activeQuery.table}
          />
        </div>
        
        <div className="flex-grow p-4 overflow-hidden">
          {activeView === 'designer' && activeQuery && (
            <QueryDesigner 
              schema={schema}
              query={activeQuery}
              onChange={handleQueryChange}
            />
          )}
          
          {activeView === 'json' && activeQuery && (
            <QueryEditor 
              query={activeQuery}
              onSaveQuery={handleSaveQuery}
            />
          )}
          
          {activeView === 'output' && (
            <div className="h-full">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">Query Output</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const output = generateQueryOutput();
                    navigator.clipboard.writeText(JSON.stringify(output, null, 2));
                    alert('Output copied to clipboard!');
                  }}
                >
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
              </div>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto h-full text-xs text-gray-800">
                {JSON.stringify(generateQueryOutput(), null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
