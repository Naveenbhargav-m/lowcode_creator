import React, { useState } from "react";

const Drop = ({ wrapParent = true, onDrop, dropElementData, children }) => {
  const [isHighlighted, setIsHighlighted] = useState(false);

  let style = {
    height: "100%",
    width: "100%",
    transition: "border 0.2s ease",
    position: "relative", // To ensure proper bounding for children
  };

  if (wrapParent === false) {
    style = {
      transition: "border 0.2s ease",
      position: "relative", // Ensures proper bounding for children
      display: "contents", // Lets the wrapper disappear and only the child is visible
    };
  }

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    let data2 = event.dataTransfer.getData("text/plain");
    const data = JSON.parse(data2);
    const dropData = {
      data,
      dropElementData,
    };

    if (onDrop) {
      onDrop(dropData);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsHighlighted(true); // Show visual feedback when an item is dragged over
  };

  const handleDragLeave = () => {
    setIsHighlighted(false); // Remove visual feedback when the item is no longer over
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      style={style}
    >
      {children}
    </div>
  );
};

export { Drop };
