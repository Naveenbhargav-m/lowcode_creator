// src/components/ReorderableList.js
import React from "preact/compat";
import { useState } from "preact/hooks";

const ReorderableList = ({ children, data, onReorder }) => {
  const [order, setOrder] = useState(data.elements);

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData('draggedIndex', index);
  };

  const handleDrop = (event, index) => {
    const draggedIndex = event.dataTransfer.getData('draggedIndex');
    const newOrder = Array.from(order);
    const [movedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, movedItem);
    setOrder(newOrder);
    const newData = { ...data, elements: newOrder };
    onReorder(newData);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      {React.Children.map(children, (child, index) => (
        <div
          draggable
          onDragStart={(event) => handleDragStart(event, index)}
          onDrop={(event) => handleDrop(event, index)}
          onDragOver={handleDragOver}
          style={{ margin: '5px', padding: '5px' }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export { ReorderableList };
