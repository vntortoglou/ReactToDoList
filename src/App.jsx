import { useState } from "react";

export default function ToDoList() {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);

  function handleSubmit(event) {
    event.preventDefault();

    const newId =
      items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;

    setItems([
      ...items,
      {
        id: newId,
        description: inputValue,
      },
    ]);

    setInputValue("");
  }

  const listItems = items.map((item) => (
    <li key={item.id}>{item.description}</li>
  ));

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="toDo">toDo:</label>
        <input
          id="toDo"
          type="text"
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
        />
<button className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
  Sketch
</button>
      </form>
      <section>
        <ul>{listItems}</ul>
      </section>
    </>
  )
}
