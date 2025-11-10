import { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/users?username=${userName}`
      );
      const data = await response.json();

      if (data.length === 0) {
        setMessage("Username not found.");
        return;
      }

      const user = data[0];

      if (user.website === password) {
        setMessage(`Welcome back, ${user.username}!`);
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/home");
      } else {
        setMessage("Incorrect password.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong");
    }

    setUserName("");
    setPassword("");
  }

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="userName">Username: </label>
        <input
          id="userName"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <br />
        <label htmlFor="password">Password: </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </>
  );
}

export default Login;
