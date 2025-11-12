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

  async function handleCheckboxChange(id) {
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
  }

  async function addToDo(title) {
    const newItem = {
      title,
      completed: false,
      userId: "" + ActiveUser.id,
    };

    try {
      const res = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error();
      const createdtodo = await res.json();
      setData((prev) => [...prev, createdtodo]);
    } catch (err) {
      console.error(err);
      alert("couldnt add to do");
    }
  }

  async function deleteToDo(id) {
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("failed");
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.log("error:", err);
      alert("couldnt delete todo");
    }
  }

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
