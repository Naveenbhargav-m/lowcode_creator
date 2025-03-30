import React, { useState } from "react";

const Drop = ({ wrapParent = true, userstyle = {}, onDrop, dropElementData, children }) => {

  let style = {
    minHeight: "100%", // Use minHeight instead of height
    minWidth: "100%",  // Use minWidth instead of width
    transition: "border 0.2s ease",
    "backgroundColor": "grey",
    ...userstyle,
  };

  if (wrapParent === false) {
    style = {
      transition: "border 0.2s ease",
      "backgroundColor": "grey",
      position: "relative", // Ensures proper bounding for children
      display: "contents", // Lets the wrapper disappear and only the child is visible
      ...userstyle,
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
  };

  const handleDragLeave = () => {
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
