import "./App.css";
import Login from "./login/Login";
import Home from "./home/Home";
import Todo from "./home/Todo";
import AddInfo from "./register/AddInfo";
import Register from "./register/register";
import Info from "./home/components/Info";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import Albums from "./home/components/Albums";
import AlbumDetails from "./home/components/AlbumDetails";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to={"/login"} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/additionalInfo" element={<AddInfo />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home/todolist" element={<Todo />} />
          <Route path="/home/info" element={<Info />} />
          <Route path="/home/albums" element={<Albums></Albums>}></Route>
          <Route
            path="/albums/:id"
            element={<AlbumDetails></AlbumDetails>}
          ></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
