import { h } from 'preact';
import { useSignal } from '@preact/signals';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

function SidebarItem({ id, label }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} className="sidebar-item">
      {label}
    </div>
  );
}

function DraggableItem({ id, content }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} className="draggable-item">
      {content}
    </div>
  );
}

function DropArea({ items }) {
  const { setNodeRef } = useDroppable({ id: 'drop-area' });

  return (
    <div ref={setNodeRef} className="drop-area">
      {items.value.map((item) => (
        <DraggableItem key={item.id} id={item.id} content={item.content} />
      ))}
    </div>
  );
}

export default function ScreenBuilderTest() {
  const items = useSignal([]);

  const handleDragEnd = (event) => {
    const { active } = event;
    if (active && active.id) {
      items.value = [
        ...items.value,
        { id: `item-${items.value.length + 1}`, content: active.id }
      ];
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="app-container">
        <aside className="sidebar">
          <h2>Elements</h2>
          <SidebarItem id="Text Field" label="Text Field" />
          <SidebarItem id="Button" label="Button" />
          <SidebarItem id="Image" label="Image" />

          <h2>Containers</h2>
          <SidebarItem id="Card" label="Card" />
          <SidebarItem id="Row" label="Row" />
          <SidebarItem id="Column" label="Column" />
        </aside>

        <main className="main-content">
          <h2>Design Area</h2>
          <DropArea items={items} />
        </main>
      </div>
    </DndContext>
  );
}
