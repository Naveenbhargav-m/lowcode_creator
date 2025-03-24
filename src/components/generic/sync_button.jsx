
export function SyncButton({title , onClick, style = {}}) {
    return (
      <button
      style={{
        backgroundColor: "black",
        color: "white",
        padding: "10px 20px",
        fontSize: "16px",
        height: "40px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        display: "flex", // Add flexbox
        alignItems: "center", // Center vertically
        justifyContent: "center", // Center horizontally
        ...style,
      }}
      onClick={(e) => onClick(e)}
    >
      <p style={{ margin: 0 }}>{title}</p>
    </button>
    
    );
}