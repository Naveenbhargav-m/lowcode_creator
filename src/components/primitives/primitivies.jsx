import { effect, signal } from '@preact/signals';
import DynamicIcon from '../custom/dynamic_icon';
import { showFormPopup, variableKeys, variableMap } from '../../states/global_state';
import { ActionExecutor, FunctionExecutor } from '../../states/common_actions';

/**
 * Available Dynamic Components:
 * - Button: Clickable button with text
 * - Text: Text paragraph display
 * - Number: Numeric value display
 * - TextArea: Multi-line text input
 * - IconButton: Button with icon
 * - Image: Image display
 * - Avatar: Circular profile image
 * - Badge: Small status/label display
 * - Dropdown: Select dropdown menu
 * - ProgressBar: Progress indicator bar
 * - Indicator: Status indicator dot
 * - AvatarGroup: Group of circular profile images
 * - Icon: Icon display
 */

// Safe utility functions for error handling
const safeGet = (obj, path, defaultValue = {}) => {
  try {
    return path.split('.').reduce((current, key) => 
      current && current[key] !== undefined ? current[key] : defaultValue, obj);
  } catch (error) {
    console.warn(`Safe get failed for path: ${path}`, error);
    return defaultValue;
  }
};

const safeFunctionExecutor = (datamap, code, defaultValue = {}) => {
  try {
    if (!code || typeof code !== 'string') return defaultValue;
    return FunctionExecutor(datamap, code) || defaultValue;
  } catch (error) {
    console.warn('Function execution failed:', error);
    return defaultValue;
  }
};

const safeActionExecutor = (id, actionType) => {
  try {
    if (!id || !actionType) return;
    ActionExecutor(id, actionType);
  } catch (error) {
    console.warn(`Action execution failed for ${id}:${actionType}`, error);
  }
};

// Improved hook with better error handling
const useDynamicConfig = (initialConfig = {}, initialValue = null) => {
  const config = signal(initialConfig || {});
  const value = signal(initialValue);

  effect(() => {
    try {
      const keys = variableKeys?.peek?.() || [];
      let datamap = {};

      // Safely build datamap
      for (const key of keys) {
        try {
          const variableEntry = variableMap?.[key];
          if (variableEntry?.value !== undefined) {
            datamap[key] = variableEntry.value;
          }
        } catch (error) {
          console.warn(`Error processing variable key: ${key}`, error);
        }
      }

      // Safely update styles
      if (config.value?.styleCode) {
        try {
          const newStyles = safeFunctionExecutor(datamap, config.value.styleCode, {});
          if (newStyles && typeof newStyles === 'object') {
            config.value = {
              ...config.value,
              style: { ...config.value.style, ...newStyles }
            };
          }
        } catch (error) {
          console.warn('Style update failed:', error);
        }
      }

      // Safely update value
      if (config.value?.valueCode) {
        try {
          const newValue = safeFunctionExecutor(datamap, config.value.valueCode, {});
          if (newValue?.value !== undefined && newValue.value !== null) {
            value.value = newValue.value;
          }
        } catch (error) {
          console.warn('Value update failed:', error);
        }
      }
    } catch (error) {
      console.warn('Effect execution failed:', error);
    }
  });

  return { config, value };
};

// Improved DynamicWrapper with better error handling
export const DynamicWrapper = ({ children, config = {}, value = null }) => {
  const { config: dynamicConfig, value: dynamicValue } = useDynamicConfig(config, value);

  const handleAction = (actionType) => (e) => {
    try {
      if (!actionType || !dynamicConfig?.value) return;
      
      safeActionExecutor(dynamicConfig.value.id, actionType);
      
      if (actionType === "onClick" && dynamicConfig.value.actions?.onClick) {
        const clickAction = safeFunctionExecutor({}, dynamicConfig.value.actions.onClick, {});
        if (clickAction?.show_form !== undefined) {
          showFormPopup.value = clickAction.show_form;
        }
      }
    } catch (error) {
      console.warn(`Action handling failed for ${actionType}:`, error);
    }
  };

  // Safely render children
  const renderChildren = () => {
    try {
      if (typeof children === 'function') {
        return children(
          dynamicValue?.value ?? value ?? {},
          dynamicConfig?.value ?? config ?? {}
        );
      }
      return children;
    } catch (error) {
      console.warn('Children rendering failed:', error);
      return <div>Render Error</div>;
    }
  };

  return (
    <div
      onClick={handleAction("onClick")}
      onDblClick={handleAction("onDoubleClick")}
      onMouseEnter={handleAction("onHoverEnter")}
      onMouseLeave={handleAction("onHoverLeave")}
    >
      {renderChildren()}
    </div>
  );
};

// Button Component
export const Button = ({ value = '', config = {} }) => (
  <DynamicWrapper config={config} value={value}>
    {(dynamicValue) => (
      <button style={safeGet(config, 'style', {})}>
        {dynamicValue || value || 'Button'}
      </button>
    )}
  </DynamicWrapper>
);

// Text Component
export const Text = ({ value = '', config = {} }) => (
  <DynamicWrapper config={config} value={value}>
    {(dynamicValue) => (
      <p style={safeGet(config, 'style', {})}>
        {dynamicValue || value || ''}
      </p>
    )}
  </DynamicWrapper>
);

// Number Component
export const Number = ({ value = 0, config = {} }) => (
  <DynamicWrapper config={config} value={value}>
    {(dynamicValue) => (
      <span style={safeGet(config, 'style', {})}>
        {dynamicValue !== undefined ? dynamicValue : (value !== undefined ? value : 0)}
      </span>
    )}
  </DynamicWrapper>
);

// TextArea Component
export const TextArea = ({ value = '', config = {} }) => (
  <DynamicWrapper config={config} value={value}>
    {(dynamicValue) => (
      <textarea 
        style={safeGet(config, 'style', {})}
        // @ts-ignore
        defaultValue={dynamicValue || value || ''}
      />
    )}
  </DynamicWrapper>
);

// IconButton Component
export const IconButton = ({ icon = 'default', config = {} }) => (
  <DynamicWrapper config={config} value={icon}>
    {(dynamicValue) => (
      <button style={safeGet(config, 'style', {})}>
        <DynamicIcon 
          name={dynamicValue || icon || 'default'} 
          size={safeGet(config, 'style.iconSize', 16)} 
        />
      </button>
    )}
  </DynamicWrapper>
);

// Image Component
export const Image = ({ src = '', config = {} }) => (
  <DynamicWrapper config={config} value={src}>
    {(dynamicValue) => (
      <img 
        src={dynamicValue || src || '/api/placeholder/100/100'} 
        alt={safeGet(config, 'alt', '')} 
        style={safeGet(config, 'style', {})}
        onError={(e) => {
          // @ts-ignore
          e.target.src = '/api/placeholder/100/100';
        }}
      />
    )}
  </DynamicWrapper>
);

// Avatar Component
export const Avatar = ({ config = {} }) => (
  <DynamicWrapper config={config} value={safeGet(config, 'value', '')}>
    {(dynamicValue) => (
      <img 
        src={dynamicValue || safeGet(config, 'value', '') || '/api/placeholder/40/40'} 
        alt={safeGet(config, 'alt', 'Avatar')}
        style={{ 
          ...safeGet(config, 'style', {}), 
          borderRadius: "50%",
          width: safeGet(config, 'style.width', '40px'),
          height: safeGet(config, 'style.height', '40px'),
          objectFit: 'cover'
        }}
        onError={(e) => {
          // @ts-ignore
          e.target.src = '/api/placeholder/40/40';
        }}
      />
    )}
  </DynamicWrapper>
);

// Badge Component
export const Badge = ({ value = '', config = {} }) => (
  <DynamicWrapper config={config} value={value}>
    {(dynamicValue) => (
      <span style={safeGet(config, 'style', {})}>
        {dynamicValue || value || ''}
      </span>
    )}
  </DynamicWrapper>
);

// Dropdown Component
export const Dropdown = ({ value = '', config = {} }) => {
  const options = safeGet(config, 'options', []);
  
  return (
    <DynamicWrapper config={config} value={value}>
      {(dynamicValue, dynamicConfig) => (
        <select
          style={safeGet(dynamicConfig, 'style', {})}
          value={dynamicValue || value || ''}
          onChange={(e) => {
            try {
              e.stopPropagation();
              // @ts-ignore
              if (value && typeof value === 'object' && 'value' in value) {
                // @ts-ignore
                value.value = e.target.value;
              }
              safeActionExecutor(safeGet(dynamicConfig, 'id'), "onChange");
            } catch (error) {
              console.warn('Dropdown change failed:', error);
            }
          }}
        >
          {options.map((option, index) => {
            const optionValue = option?.value || option || '';
            const optionLabel = option?.label || option || '';
            return (
              <option value={optionValue} key={optionValue || index}>
                {optionLabel}
              </option>
            );
          })}
        </select>
      )}
    </DynamicWrapper>
  );
};

// ProgressBar Component
export const ProgressBar = ({ value = 0, config = {} }) => (
  <DynamicWrapper config={config} value={value}>
    {(dynamicValue) => {
      // @ts-ignore
      const progressValue = Math.max(0, Math.min(100, Number(dynamicValue) || Number(value) || 0));
      const style = safeGet(config, 'style', {});
      
      return (
        <div style={{
          width: '100%',
          height: '20px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          overflow: 'hidden',
          ...style
        }}>
          <div
            style={{
              width: `${progressValue}%`,
              backgroundColor: safeGet(style, 'color', '#76c7c0'),
              height: "100%",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      );
    }}
  </DynamicWrapper>
);

// Indicator Component
export const Indicator = ({ active = false, config = {} }) => (
  <DynamicWrapper config={config} value={active}>
    {(dynamicValue, dynamicConfig) => {
      const isActive = dynamicValue !== undefined ? dynamicValue : active;
      const style = safeGet(dynamicConfig, 'style', {});
      
      return (
        <span
          style={{
            display: 'inline-block',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            ...style,
            backgroundColor: isActive 
              ? safeGet(style, 'activeColor', 'green') 
              : safeGet(style, 'inactiveColor', 'gray'),
          }}
        />
      );
    }}
  </DynamicWrapper>
);

// AvatarGroup Component
export const AvatarGroup = ({ avatars = [], config = {} }) => (
  <DynamicWrapper config={config} value={avatars}>
    {(dynamicValue, dynamicConfig) => {
      const avatarList = Array.isArray(dynamicValue) ? dynamicValue : 
                       Array.isArray(avatars) ? avatars : [];
      const style = safeGet(dynamicConfig, 'style', {});
      
      return (
        <div style={{
          display: 'flex',
          ...style
        }}>
          {avatarList.map((avatar, index) => {
            const avatarSrc = avatar?.src || avatar || '/api/placeholder/40/40';
            return (
              <img
                key={avatar?.id || index}
                src={avatarSrc}
                alt={avatar?.alt || `Avatar ${index + 1}`}
                style={{
                  width: safeGet(style, 'size', '40px'),
                  height: safeGet(style, 'size', '40px'),
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: safeGet(style, 'border', '2px solid white'),
                  marginLeft: index > 0 ? '-8px' : '0',
                  ...safeGet(avatar, 'style', {}),
                }}
                onError={(e) => {
                  // @ts-ignore
                  e.target.src = '/api/placeholder/40/40';
                }}
              />
            );
          })}
        </div>
      );
    }}
  </DynamicWrapper>
);

// Icon Component
export const Icon = ({ name = 'default', config = {} }) => (
  <DynamicWrapper config={config} value={name}>
    {(dynamicValue) => (
      <span style={safeGet(config, 'style', {})}>
        <DynamicIcon 
          name={dynamicValue || name || 'default'} 
          size={safeGet(config, 'style.size', 16)} 
        />
      </span>
    )}
  </DynamicWrapper>
);