import { effect, signal } from '@preact/signals';
import DynamicIcon from '../custom/dynamic_icon';
import { showFormPopup, variableKeys, variableMap } from '../../states/global_state';
import { ActionExecutor, FunctionExecutor } from '../../states/common_actions';


const useDynamicConfig = (initialConfig, initialValue) => {
  const config = signal(initialConfig);
  const value = signal(initialValue);

  effect(() => {
    const keys = variableKeys.peek();
    let datamap = {};

    for (const key of keys) {
      const variableEntry = variableMap[key];
      if (variableEntry && variableEntry.value !== undefined) {
        datamap[key] = variableEntry.value;
      }
    }

    const newStyles = FunctionExecutor(datamap, config.value.styleCode);
    config.value.style = { ...config.value.style, ...newStyles };

    const newValue = FunctionExecutor(datamap, config.value.valueCode);
    if (newValue && newValue.value !== undefined && newValue.value !== null) {
      value.value = newValue.value;
    }
  });

  return { config, value };
};

// Reusable wrapper component
export const DynamicWrapper = ({ children, config, value }) => {
  const { config: dynamicConfig, value: dynamicValue } = useDynamicConfig(config, value);

  const handleAction = (actionType) => (e) => {
    e.stopPropagation();
    ActionExecutor(dynamicConfig.value.id, actionType);
    if (actionType === "onClick" && dynamicConfig.value.actions?.onClick) {
      const clickAction = FunctionExecutor({}, dynamicConfig.value.actions.onClick);
      if (clickAction?.show_form !== undefined) {
        console.log("Setting show_form:", clickAction);
        showFormPopup.value = clickAction.show_form;
      }
    }
  };

  return (
    <div
      style={{display:"contents"}}
      onClick={handleAction("onClick")}
      onDblClick={handleAction("onDoubleClick")}
      onMouseEnter={handleAction("onHoverEnter")}
      onMouseLeave={handleAction("onHoverLeave")}
    >
      {children(dynamicValue.value, dynamicConfig.value)}
    </div>
  );
};


// Refactored Button Component
export const Button = ({ value, config }) => (
  <DynamicWrapper config={config} value={value}>
    {(dynamicValue) => (
      <button>{dynamicValue}</button>
    )}
  </DynamicWrapper>
);

// Refactored Text Component
export const Text = ({ value, config }) => (
  <DynamicWrapper config={config} value={value}>
    {(dynamicValue) => (
      <p>{dynamicValue}</p>
    )}
  </DynamicWrapper>
);

// Refactored Number Component
export const Number = ({ value, config }) => (
  <DynamicWrapper config={config} value={value}>
    {(dynamicValue) => (
      <span>{dynamicValue}</span>
    )}
  </DynamicWrapper>
);

// Refactored TextArea Component
export const TextArea = ({ value, config }) => (
  <DynamicWrapper config={config} value={value}>
    {(dynamicValue) => (
      <textarea>{dynamicValue}</textarea>
    )}
  </DynamicWrapper>
);


// Refactored IconButton Component
export const IconButton = ({ icon, config }) => (
  <DynamicWrapper config={config} value={icon}>
    {(dynamicValue) => (
      <button>
        <DynamicIcon name={dynamicValue} size={config.style?.iconSize} />
      </button>
    )}
  </DynamicWrapper>
);

// Refactored Image Component
export const Image = ({ src, config }) => (
  <DynamicWrapper config={config} value={src}>
    {(dynamicValue) => (
      <img src={dynamicValue} alt="" style={config.style} />
    )}
  </DynamicWrapper>
);

// Refactored Avatar Component
export const Avatar = ({ src, config }) => {
    console.log("avatar configs:",config);
    return (
      <DynamicWrapper config={config} value={src}>
    {(dynamicValue) => (
      <img src={dynamicValue} alt="" style={{ ...config.style, borderRadius: "50%" }} />
    )}
  </DynamicWrapper>
    );
}
// Refactored Badge Component
export const Badge = ({ value, config }) => (
  <DynamicWrapper config={config} value={value}>
    {(dynamicValue) => (
      <span>{dynamicValue}</span>
    )}
  </DynamicWrapper>
);


export const Dropdown = ({ value, config, options }) => {
  return (
    <DynamicWrapper config={config} value={value}>
    <select
      style={config.value.style}
      onChange={(e) => {
        e.stopPropagation();
        value.value = e.target["value"];
        ActionExecutor(config.value.id, "onChange");
      }}
    >
      {config.value.map((option) => (
        <option value={option} key={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    </DynamicWrapper>
  );
};


export const ProgressBar = ({ progress, config }) => {
  return (
    <DynamicWrapper config={config} value={progress}>
      {({ style, value }) => (
        <div style={style}>
          <div
            style={{
              width: `${value}%`,
              backgroundColor: style.primary || "#76c7c0",
              height: "100%",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      )}
    </DynamicWrapper>
  );
};

export const Indicator = ({ active, config }) => {
  return (
    <DynamicWrapper config={config} value={active}>
      {({ style, value }) => (
        <span
          style={{
            ...style,
            backgroundColor: value ? style.activeColor || "green" : style.inactiveColor || "gray",
          }}
        />
      )}
    </DynamicWrapper>
  );
};

export const AvatarGroup = ({ avatars, config }) => {
  return (
    <DynamicWrapper config={config} value={avatars}>
      {({ style, value }) => (
        <div style={style}>
          {value.map((avatar, index) => (
            <img
              key={index}
              src={avatar.src}
              alt=""
              style={{
                width: style.size || "40px",
                height: style.size || "40px",
                borderRadius: "50%",
                objectFit: "cover",
                border: style.border || "2px solid white",
                ...avatar.style,
              }}
            />
          ))}
        </div>
      )}
    </DynamicWrapper>
  );
};

export const Icon = ({ name, config }) => {
  return (
    <DynamicWrapper config={config} value={name}>
      {({ style, value }) => (
        <span style={style}>
          <DynamicIcon name={value} size={style.size} />
        </span>
      )}
    </DynamicWrapper>
  );
};
