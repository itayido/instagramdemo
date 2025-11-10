import "./App.css";
import Login from "./login/Login";
import Home from "./home/Home";
import Todo from "./home/Todo";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to={"/login"} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home/todolist" element={<Todo />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
