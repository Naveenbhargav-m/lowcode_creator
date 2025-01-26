// src/components/ReorderableGrid.js
import React, { useState } from 'react';

const ReorderableGrid = ({ children, data, onReorder }) => {
  const [order, setOrder] = useState(data);

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData('draggedIndex', index);
  };

  const handleDrop = (event, index) => {
    const draggedIndex = event.dataTransfer.getData('draggedIndex');
    const newOrder = Array.from(order);
    const [movedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, movedItem);
    setOrder(newOrder);
    onReorder(newOrder);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {React.Children.map(children, (child, index) => (
        <div
          draggable
          onDragStart={(event) => handleDragStart(event, index)}
          onDrop={(event) => handleDrop(event, index)}
          onDragOver={handleDragOver}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export { ReorderableGrid };
