import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ToDoList() {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);
  const [newItemIndex, setNewItemIndex] = useState(null);
  const [showBootLogs, setShowBootLogs] = useState(true);
  const [flash, setFlash] = useState(false);

  // Boot log disappears after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBootLogs(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    let newId = items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;

    setItems([
      ...items,
      {
        id: newId,
        description: inputValue.trim(),
      },
    ]);
    setInputValue("");
    setNewItemIndex(items.length);

    // Trigger green flash
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
  }

  function handleRemove(id) {
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== id);
      return newItems;
    });
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over?.id);
      setItems((items) => arrayMove(items, oldIndex, newIndex));
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-400 flex items-center justify-center p-8 relative font-mono overflow-hidden">
      {/* Matrix Digital Rain */}
      <div className="absolute inset-0 pointer-events-none z-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
        <div className="absolute inset-0 animate-matrixRain bg-[linear-gradient(rgba(0,255,100,0.2)_1px,transparent_1px)] bg-[length:2px_20px] opacity-10" />
      </div>

      {/* Terminal Flash */}
      {flash && (
        <div className="fixed inset-0 bg-green-400 opacity-20 z-50 pointer-events-none animate-fadeFlash" />
      )}

      {/* Boot Logs */}
      {showBootLogs && (
        <div className="absolute top-0 left-0 w-full text-sm text-green-500 p-4 z-20 bg-black/80 backdrop-blur-sm border-b border-green-700 space-y-1 animate-fadeIn">
          <p>[SYS] Initializing memory bank...</p>
          <p>[OK] Connection to mainframe established</p>
          <p>[UPLOAD] Task queue active</p>
        </div>
      )}

      <div className="w-full max-w-2xl bg-black/70 backdrop-blur border border-green-800 shadow-[0_0_20px_#00ff88] rounded-2xl p-10 z-10 mt-10">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-green-400 drop-shadow-[0_0_15px_#00ff88]">
            MEMORY.UPLINK
          </h1>
          <p className="text-sm text-green-500 italic mt-2 tracking-widest">
            Upload tasks to memory stack.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
          <input
            className="flex-grow bg-black border border-green-600 text-green-300 placeholder-green-600 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 shadow-inner"
            type="text"
            placeholder="Enter next protocol..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-500 text-black font-bold px-6 py-3 rounded-md shadow-[0_0_10px_#00ff88] transition-all"
          >
            Upload
          </button>
        </form>

        <section>
          {items.length > 0 ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                <ul className="transition-all duration-500">
                  {items.map((item, index) => (
                    <SortableItem key={item.id} id={item.id} item={item} handleRemove={handleRemove} isNew={newItemIndex === index} />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          ) : (
            <p className="text-green-700 text-center italic">Standby... no tasks loaded.</p>
          )}
        </section>
      </div>
    </div>
  );
}

function SortableItem({ id, item, handleRemove, isNew }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`bg-black/40 border-l-4 border-green-400 text-green-300 px-5 py-3 mb-4 rounded-lg font-mono tracking-wide shadow-[0_0_10px_#00ff88] relative hover:scale-[1.02] transition-transform duration-200 flex justify-between items-center ${
        isNew ? "animate-slide-in" : ""
      }`}
    >
      <div className="flex-1 cursor-grab" {...attributes} {...listeners}>
        {item.description}
      </div>
      <button
        onClick={() => handleRemove(item.id)}
        className="ml-4 text-green-400 hover:text-green-200 text-xl font-bold z-10"
        aria-label="Remove task"
      >
        ✖
      </button>
    </li>
  );
}
