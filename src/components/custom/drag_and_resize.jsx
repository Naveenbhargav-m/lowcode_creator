
import { h } from 'preact';
import { signal, useSignal } from '@preact/signals';
import ResizeTracker from './size_tracker';
import { useRef } from 'preact/hooks';

const snapToGrid = (value, gridSize) => Math.round(value / gridSize) * gridSize;
let parentData = signal({});

export function DragAndResizableParent({ children, gridSize = 10 }) {
  return (
    <ResizeTracker
      callback={(width, height) => {
        parentData.value = { width, height };
      }}
    >
      <div
        class="parent-container"
        style={{
          height: '100%',
          width: '100%',
          position: 'relative',
          overflow: 'hidden', // Prevent children from being dragged outside

        }}
      >
        {children &&
          children.map((child, index) =>
            h(child.type, { ...child.props, gridSize, key: index })
          )}
      </div>
    </ResizeTracker>
  );
}

// Utility: Snap to grid

export function DragAndResizableChild({
  children,
  initialPosition = { x: 0, y: 0 },
  initialSize = { width: 400, height: 400 },
  gridSize = 10,
  onChildUpdate,
}) {

  const position = useSignal({ x: initialPosition.x, y: initialPosition.y });
  const size = useSignal({ width: initialSize.width, height: initialSize.height });
  const isDragging = useSignal(false);
  const isResizing = useSignal(false);
  const dragStart = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    isDragging.value = true;

    const parentContainer = e.target.closest('.parent-container');
    const parentBounds = parentContainer.getBoundingClientRect();

    dragStart.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.value.x,
      initialY: position.value.y,
      parentBounds, // Store the bounds of the parent container
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.value || isResizing.value) return;

    const deltaX = e.clientX - dragStart.current.startX;
    const deltaY = e.clientY - dragStart.current.startY;

    const newX = snapToGrid(dragStart.current.initialX + deltaX, gridSize);
    const newY = snapToGrid(dragStart.current.initialY + deltaY, gridSize);

    // Constrain movement within parent bounds
    const { width: parentWidth, height: parentHeight } = dragStart.current.parentBounds;

    const constrainedX = Math.min(
      Math.max(newX, 0),
      parentWidth - size.value.width
    );
    const constrainedY = Math.min(
      Math.max(newY, 0),
      parentHeight - size.value.height
    );
    position.value = { x: constrainedX, y: constrainedY };

    // Call the parent update callback
    onChildUpdate({ position: position.value, size: size.value });
  };

  const handleMouseUp = () => {
    isDragging.value = false;
    isResizing.value = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleResizeMouseDown = (e) => {
    e.stopPropagation();
    isResizing.value = true;

    const parentContainer = e.target.closest('.parent-container'); // Find the parent container
    const parentBounds = parentContainer.getBoundingClientRect();

    dragStart.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialWidth: size.value.width,
      initialHeight: size.value.height,
      initialPosition: { ...position.value },
      parentBounds, // Store the bounds of the parent container
    };

    document.addEventListener('mousemove', handleResizeMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeMouseMove = (e) => {
    if (!isResizing.value) return;

    const deltaX = e.clientX - dragStart.current.startX;
    const deltaY = e.clientY - dragStart.current.startY;

    let newWidth = dragStart.current.initialWidth + deltaX;
    let newHeight = dragStart.current.initialHeight + deltaY;

    const { width: parentWidth, height: parentHeight } = dragStart.current.parentBounds;

    // Ensure the width and height stay within the parent bounds
    size.value = {
      width: Math.min(Math.max(newWidth, 50), parentWidth),
      height: Math.min(Math.max(newHeight, 50), parentHeight),
    };

    // Call the parent update callback
    onChildUpdate({ position: position.value, size: size.value });
  };

  return (
    <div
      class="draggable-resizable"
      style={{
        position: 'absolute',
        transform: `translate(${position.value.x}px, ${position.value.y}px)`,
        width: `${size.value.width}px`,
        height: `${size.value.height}px`,
        backgroundColor: 'grey',
        boxSizing: 'border-box',
      }}
      onMouseDown={handleMouseDown}
    >
      {children}
      <div
        class="resize-handle"
        style={{
          position: 'absolute',
          bottom: '0',
          right: '0',
          width: '20px',
          height: '20px',
          backgroundColor: 'red',
          cursor: 'se-resize',
        }}
        onMouseDown={handleResizeMouseDown}
      ></div>
    </div>
  );
}