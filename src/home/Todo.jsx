import { useEffect, useState } from "react";

function Todo() {
  // const [TodosId, setTodosId] = useState(null);
  // const [TodosTitle, setTodosTitle] = useState(null);
  const [data, setData] = useState([]);

  const ActiveUser = JSON.parse(localStorage.getItem("ActiveUser"));
  useEffect(() => {
    async function fetchitems() {
      try {
        const response = await fetch(
          `http://localhost:3000/todos?userId=${ActiveUser.id}`
        );
        const data = await response.json();
        setData(data);
        // setTodosId(data.id);
        // // setTodosTitle(data.title);
        // console.log(TodosTitle);
        // console.log(TodosId);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchitems();
  }, [ActiveUser.id]);

  const handleCheckboxChange = async (id) => {
    // עדכון מקומי (UI מיידי)
    const listToDo = data.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setData(listToDo);

    // שליחת עדכון לשרת
    const updatedItem = listToDo.find((item) => item.id === id);

    try {
      const updateOption = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // תיקון: application
        },
        body: JSON.stringify({ completed: updatedItem.completed }),
      };

      const response = await fetch(
        `http://localhost:3000/todos/${id}`,
        updateOption
      );
      if (!response.ok) throw new Error("Failed to update todo");

      console.log("Todo updated on server:", updatedItem);
    } catch (err) {
      console.error("Error updating todo:", err);
      // אפשר להחזיר את המצב הקודם אם יש שגיאה
      setData(data); // מחזירים למצב לפני העדכון
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
                onChange={() => handleCheckboxChange(1)}
              />
              {todo.title}
            </li>
          ))}
        </ul>
      }
    </div>
  );
}

export default Todo;
