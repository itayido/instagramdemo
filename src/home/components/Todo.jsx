import { useEffect, useState } from "react";

function Todo() {
  const [data, setData] = useState([]);
  const [value, setValue] = useState("");

  const ActiveUser = JSON.parse(localStorage.getItem("ActiveUser"));
  useEffect(() => {
    async function fetchitems() {
      try {
        const response = await fetch(
          `http://localhost:3000/todos?userId=${ActiveUser.id}`
        );
        const data = await response.json();
        setData(data);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchitems();
  }, []);

  const handleCheckboxChange = async (id) => {
    const listToDo = data.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setData(listToDo);

    const updatedItem = listToDo.find((item) => item.id === id);

    try {
      const updateOption = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: updatedItem.completed }),
      };
      console.log(updateOption);

      const response = await fetch(
        `http://localhost:3000/todos/${id}`,
        updateOption
      );
      if (!response.ok) throw new Error("Failed to update todo");

      console.log("Todo updated on server:", updatedItem);
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const addToDo = async (title) => {
    const tempId = "temp" + Date.now();
    const newItem = {
      id: tempId,
      title,
      completed: false,
      userId: "" + ActiveUser.id,
    };
    setData((prev) => [...prev, newItem]);

    try {
      const res = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (!res.ok) throw new Error();

      const createdtodo = await res.json();

      setData((prev) =>
        prev.map((todo) => (todo.id === tempId ? createdtodo : todo))
      );
    } catch {
      setData((prev) => prev.filter((t) => t.id !== tempId));
    }
  };

  const deleteToDo = async (id) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("failed");
      console.log("deleted");
    } catch (err) {
      console.log("error:", err);
      const itemToRestore = data.find((item) => item.id === id);
      if (itemToRestore) {
        setData((prev) => [...prev, itemToRestore]);
      }
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    addToDo(value);
    setValue("");
  }

  function handleSort(e) {
    const option = e.target.value;
    let sorted = [...data];

    if (option === "alpha")
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    else if (option === "completed")
      sorted.sort((a, b) => a.completed - b.completed);
    else if (option === "random") sorted.sort(() => Math.random() - 0.5);

    setData(sorted);
  }

  return (
    <div>
      <label>
        sort by
        <select onChange={handleSort}>
          <option value="alpha">a-z</option>
          <option value="completed">completed</option>
          <option value="random">random</option>
        </select>
      </label>

      <ul>
        {data.length === 0
          ? "No To Dos Left"
          : data.map((todo) => (
              <li key={todo.id}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleCheckboxChange(todo.id)}
                />
                {todo.title}
                <button onClick={() => deleteToDo(todo.id)}>delete</button>
              </li>
            ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <label htmlFor="add">Add to do</label>
        <input
          id="add"
          type="text"
          value={value}
          placeholder="new to do"
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default Todo;
