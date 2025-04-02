// src/components/Drag.js

const Draggable = ({ data, onDragStart, children }) => {
  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", JSON.stringify(data));
    if (onDragStart) {
      onDragStart(data);
    }
  };

  return (
    <div draggable onDragStart={handleDragStart}>
      {children}
    </div>
  );
};

export { Draggable };
