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
        <button type="submit">Submit</button>
      </form>
      <section>
        <ul>{listItems}</ul>
      </section>
    </>
  )
}
