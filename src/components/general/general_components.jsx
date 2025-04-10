

export function SelectComponent({options, selected, onChange, style = {}}) {
    return(
      <select
        value={selected}
        onChange={(e) => onChange(e, {value: e.target.value})}
        style={{
          width: "120px", 
          marginRight: "10px",
          padding: "8px 12px",
          fontSize: "14px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontWeight: "500",
          color: "#2d3748",
          backgroundColor: "black",
          borderRadius: "6px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
          cursor: "pointer",
          appearance: "none",
          backgroundImage: "url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23434A54%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px top 50%",
          backgroundSize: "10px auto",
          transition: "all 0.2s ease",
          "color": "white",
          ...style
        }}
      >
        {options.map(option => (
          <option 
            key={typeof option === 'object' ? option.value : option} 
            value={typeof option === 'object' ? option.value : option}
          >
            {typeof option === 'object' ? option.label : option}
          </option>
        ))}
      </select>
    );
  }