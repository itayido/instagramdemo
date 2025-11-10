import { useEffect, useState } from "react";

function Todo() {
  const [data, setData] = useState([]);
  const [Value, setValue] = useState();

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
  }, [ActiveUser.id]);

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
    const newId = data.length ? Number(data[data.length - 1].id) + 1 : 1;
    const newItem = {
      id: "" + newId,
      title,
      completed: false,
      userId: ActiveUser.id,
    };
    setData((prev) => [...prev, newItem]);

    try {
      const res = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      if (created.id !== newId) {
        setData((prev) => prev.map((t) => (t.id === newId ? created : t)));
      }
    } catch {
      setData((prev) => prev.filter((t) => t.id !== newId));
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
      alert("שגיאה במחיקה");
    }
  };

  return (
    <div>
      {
        <ul>
          {data.map((todo) => (
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
      }
      <input
        type="text"
        placeholder="הוסף משימה..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.value.trim()) {
            addToDo(e.target.value.trim());
            e.target.value = "";
          }
        }}
      />
    </div>
  );
}

export default Todo;
