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

  function handleRemove(id) {
    setItems(items.filter((item) => item.id !== id));
  }

  const listItems = items.map((item) => (
    <li key={item.id} className="flex items-center justify-between mb-2">
      {item.description}
      <button
        onClick={() => handleRemove(item.id)}
        className="ml-4 text-white bg-red-500"
      >
        ✕
      </button>
    </li>
  ));

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-4">
        <label htmlFor="toDo" className="block text-white mb-2">
          toDo:
        </label>
        <input
          className="randomInput p-2 mr-2 rounded"
          id="toDo"
          type="text"
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
        />
        <button className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          Add
        </button>
      </form>
      <section>
        <ul>{listItems}</ul>
      </section>
    </>
  );
}
