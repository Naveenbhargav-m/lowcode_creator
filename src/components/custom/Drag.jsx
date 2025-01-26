// src/components/Drag.js
import React from "react";

const Draggable = ({ data, onDragStart, children }) => {
  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", JSON.stringify(data));
    if (onDragStart) {
      onDragStart(data);
    }
  };

  return (
    <div draggable onDragStart={handleDragStart} style={{ display: "block" }}>
      {children}
    </div>
  );
};

export { Draggable };
