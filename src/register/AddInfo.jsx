import { useLocation, useNavigate } from "react-router";
import { useState } from "react";

function AddInfo() {
  const location = useLocation();
  const navigate = useNavigate();

  const { username, password } = location.state;

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const newUser = { username, website: password, email, phone };

    try {
      await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      localStorage.setItem("ActiveUser", JSON.stringify(newUser));
      navigate("/home");
    } catch (err) {
      console.error("Error saving user:", err);
    }
  }

  return (
    <>
      <h2>Additional Info for {username}</h2>
      <form onSubmit={handleSubmit}>
        <label>Phone Number: </label>
        <input
          type="number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <br />
        <label>Email: </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <button type="submit">Finish Registration</button>
      </form>
    </>
  );
}

export default AddInfo;
