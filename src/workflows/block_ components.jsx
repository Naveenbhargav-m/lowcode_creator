import { Handle, Position } from '@xyflow/react';
import DynamicIcon from "../components/custom/dynamic_icon";
import { activeworkFlowBlock } from "./workflow_state";

// Enhanced color palette with consistent naming
const COLORS = {
  primary: "#3B82F6",    // Blue
  success: "#10B981",    // Green  
  warning: "#F59E0B",    // Amber
  danger: "#EF4444",     // Red
  info: "#06B6D4",       // Cyan
  purple: "#8B5CF6",     // Purple
  indigo: "#6366F1",     // Indigo
  pink: "#EC4899",       // Pink
};

// Node configuration - single source of truth
const NODE_CONFIG = {
  // Database operations
  insert_rows: { 
    label: "Insert Row", 
    icon: "plus-circle", 
    color: COLORS.success,
    description: "Add new record"
  },
  update_rows: { 
    label: "Update Row", 
    icon: "edit-3", 
    color: COLORS.primary,
    description: "Modify existing data"
  },
  read_rows: { 
    label: "Read Row", 
    icon: "database", 
    color: COLORS.info,
    description: "Query database"
  },
  delete_rows: { 
    label: "Delete Row", 
    icon: "trash-2", 
    color: COLORS.danger,
    description: "Remove record"
  },
  
  // Control flow
  condition: { 
    label: "Condition", 
    icon: "git-branch", 
    color: COLORS.warning,
    description: "if (condition) → then...",
    handles: [
      { id: 'target', type: 'target', position: Position.Top },
      { id: 'true', type: 'source', position: Position.Bottom, style: { left: '25%' } },
      { id: 'false', type: 'source', position: Position.Bottom, style: { left: '75%' } }
    ]
  },
  loop: { 
    label: "Loop", 
    icon: "repeat", 
    color: COLORS.warning,
    description: "Iterate through items",
    handles: [
      { id: 'target', type: 'target', position: Position.Top },
      { id: 'source', type: 'source', position: Position.Bottom },
      { id: 'body', type: 'source', position: Position.Right }
    ]
  },
  
  // Workflow control
  start: { 
    label: "Start", 
    icon: "play", 
    color: COLORS.success,
    description: "Begin workflow",
    handles: [{ id: 'source', type: 'source', position: Position.Bottom }]
  },
  end: { 
    label: "End", 
    icon: "square", 
    color: COLORS.danger,
    description: "Complete workflow",
    handles: [{ id: 'target', type: 'target', position: Position.Top }]
  },
  
  // Code & HTTP
  code_block: { 
    label: "Code Block", 
    icon: "code-2", 
    color: COLORS.indigo,
    description: "Execute code"
  },
  http_call: { 
    label: "HTTP Call", 
    icon: "globe", 
    color: COLORS.purple,
    description: "Make API request"
  },
  
  // Messaging
  create_topic: { 
    label: "Create Topic", 
    icon: "message-square-plus", 
    color: COLORS.info,
    description: "Create messaging topic"
  },
  publish: { 
    label: "Publish", 
    icon: "send", 
    color: COLORS.info,
    description: "Send message"
  },
  subscribe: { 
    label: "Subscribe", 
    icon: "mail", 
    color: COLORS.info,
    description: "Listen for messages"
  },
  delete_topic: { 
    label: "Delete Topic", 
    icon: "message-square-x", 
    color: COLORS.danger,
    description: "Remove topic"
  },
  
  // Auth
  google_auth_init: { 
    label: "Google Auth", 
    icon: "key", 
    color: COLORS.pink,
    description: "Initialize OAuth"
  },
  generate_auth_url: { 
    label: "Auth URL", 
    icon: "link", 
    color: COLORS.pink,
    description: "Generate OAuth URL"
  },
  exchange_code_for_token: { 
    label: "Exchange Token", 
    icon: "refresh-ccw", 
    color: COLORS.pink,
    description: "Get access token"
  },
  get_google_user: { 
    label: "Get User", 
    icon: "user", 
    color: COLORS.purple,
    description: "Fetch user info"
  },
  upsert_user: { 
    label: "Upsert User", 
    icon: "user-plus", 
    color: COLORS.purple,
    description: "Save user data"
  },
  verify_google_token: { 
    label: "Verify Token", 
    icon: "shield-check", 
    color: COLORS.pink,
    description: "Validate token"
  },
  refresh_google_token: { 
    label: "Refresh Token", 
    icon: "rotate-ccw", 
    color: COLORS.pink,
    description: "Renew access"
  }
};

// Default handles for most nodes
const DEFAULT_HANDLES = [
  { id: 'target', type: 'target', position: Position.Top },
  { id: 'source', type: 'source', position: Position.Bottom }
];

// Enhanced detail renderers for specific node types
const DetailRenderers = {
  code_block: (data) => {
    if (!data.code) return null;
    const lines = data.code.split('\n').length;
    const preview = data.code.length > 50 ? data.code.substring(0, 47) + '...' : data.code;
    return (
      <div className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono border-l-2 border-indigo-400 overflow-hidden">
        <div className="flex justify-between items-center mb-1 text-gray-500">
          <span>{data.language || 'javascript'}</span>
          <span>{lines} lines</span>
        </div>
        <div className="text-gray-700 whitespace-pre-wrap break-all">{preview}</div>
      </div>
    );
  },
  
  http_call: (data) => {
    if (!data.method && !data.url) return null;
    return (
      <div className="mt-1 space-y-1">
        {data.method && data.url && (
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
              {data.method}
            </span>
            <span className="text-xs text-gray-600 truncate flex-1">{data.url}</span>
          </div>
        )}
        {data.headers && (
          <div className="text-xs text-gray-500">
            {Object.keys(data.headers).length} headers
          </div>
        )}
      </div>
    );
  },
  
  // Generic key-value renderer for most nodes
  generic: (data, fields) => {
    const entries = fields.filter(field => data[field]).slice(0, 3); // Limit to 3 fields
    if (entries.length === 0) return null;
    
    return (
      <div className="mt-1 space-y-1">
        {entries.map(field => (
          <div key={field} className="flex items-center gap-2 text-xs">
            <span className="font-medium text-gray-600 capitalize">
              {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
            </span>
            <span className="text-gray-700 truncate flex-1">
              {typeof data[field] === 'string' 
                ? (data[field].length > 20 ? data[field].substring(0, 17) + '...' : data[field])
                : Array.isArray(data[field]) 
                ? data[field].join(', ')
                : String(data[field])
              }
            </span>
          </div>
        ))}
      </div>
    );
  }
};

// Universal Flow Node Component
function FlowNode({ data, type }) {
  const config = NODE_CONFIG[type];
  if (!config) {
    console.warn(`Unknown node type: ${type}`);
    return null;
  }

  const handleClick = () => {
    activeworkFlowBlock.value = { ...data, type };
  };

  // Determine handles
  const handles = data.handles || config.handles || DEFAULT_HANDLES;
  
  // Render node details based on type
  const renderDetails = () => {
    // Custom renderers for specific types
    if (DetailRenderers[type]) {
      return DetailRenderers[type](data);
    }
    
    // Generic renderer for common patterns
    const commonFields = ['table', 'conditions', 'topic', 'topicName', 'message', 'email', 'url', 'collection', 'variable'];
    const relevantFields = commonFields.filter(field => data[field]);
    
    if (relevantFields.length > 0) {
      return DetailRenderers.generic(data, relevantFields);
    }
    
    return null;
  };

  return (
    <div 
      onClick={handleClick}
      className="group cursor-pointer select-none"
      style={{ width: '200px' }} // Fixed width for consistency
    >
      {/* Render handles */}
      {handles.map((handle) => (
        <Handle
          key={handle.id}
          id={handle.id}
          type={handle.type}
          position={handle.position}
          style={{
            background: config.color,
            width: '8px',
            height: '8px',
            border: '2px solid white',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
            ...handle.style
          }}
          isConnectable={true}
        />
      ))}
      
      {/* Node body */}
      <div 
        className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden relative"
        style={{
          borderLeft: `4px solid ${config.color}`,
          borderColor: '#e2e8f0',
          borderLeftColor: config.color
        }}
      >
        {/* Header */}
        <div className="flex items-center p-3 pb-2">
          <div 
            className="flex items-center justify-center w-8 h-8 rounded-md mr-3 flex-shrink-0"
            style={{ 
              backgroundColor: `${config.color}15`,
              color: config.color 
            }}
          >
            <DynamicIcon name={config.icon} size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-gray-900 truncate">
              {config.label}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {config.description}
            </div>
          </div>
        </div>
        
        {/* Details */}
        <div className="px-3 pb-3">
          {renderDetails()}
        </div>
        
        {/* Hover effect indicator */}
        <div 
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{
            background: `linear-gradient(45deg, transparent 0%, ${config.color}08 100%)`
          }}
        />
      </div>
    </div>
  );
}

// Factory function to create node components
const createNodeComponent = (type) => ({ data }) => (
  <FlowNode data={data} type={type} />
);

// Export all node components
export const InsertRow = createNodeComponent('insert_rows');
export const UpdateRow = createNodeComponent('update_rows');
export const ReadRow = createNodeComponent('read_rows');
export const DeleteRow = createNodeComponent('delete_rows');
export const Condition = createNodeComponent('condition');
export const Loop = createNodeComponent('loop');
export const Start = createNodeComponent('start');
export const End = createNodeComponent('end');
export const CodeBlock = createNodeComponent('code_block');
export const HttpCall = createNodeComponent('http_call');
export const CreateTopic = createNodeComponent('create_topic');
export const PublishMessage = createNodeComponent('publish');
export const SubscribeMessage = createNodeComponent('subscribe');
export const SubscribeTopic = createNodeComponent('subscribe'); // Alias
export const UnsubscribeTopic = createNodeComponent('subscribe'); // Reuse with different config
export const DeleteTopic = createNodeComponent('delete_topic');
export const GoogleAuthInit = createNodeComponent('google_auth_init');
export const GenerateAuthUrl = createNodeComponent('generate_auth_url');
export const ExchangeCodeForToken = createNodeComponent('exchange_code_for_token');
export const GetGoogleUser = createNodeComponent('get_google_user');
export const UpsertUser = createNodeComponent('upsert_user');
export const VerifyGoogleToken = createNodeComponent('verify_google_token');
export const RefreshGoogleToken = createNodeComponent('refresh_google_token');

// Utility to get all available node types
export const getAvailableNodeTypes = () => Object.keys(NODE_CONFIG);

// Utility to create a new node with default configuration
export const createNode = (type, data = {}) => ({
  type,
  data: {
    ...data,
    handles: data.handles || NODE_CONFIG[type]?.handles || DEFAULT_HANDLES
  }
});