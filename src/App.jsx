import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";

import Login from "./login/Login";
import Register from "./register/register";
import AddInfo from "./register/AddInfo";

import ProtectedRoute from "./home/components/ProtectedRoute";
import Home from "./home/Home";
import Info from "./home/components/Info";
import Todo from "./home/components/Todo";
import Posts from "./home/components/Posts";
import PostDetails from "./home/components/PostDetails";
import Albums from "./home/components/Albums";
import AlbumDetails from "./home/components/AlbumDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/additionalInfo" element={<AddInfo />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />}>
            <Route index element={<Navigate to="info" />} />

            <Route path="info" element={<Info />} />
            <Route path="todolist" element={<Todo />} />

            <Route path="posts" element={<Posts />} />
            <Route path="posts/post/:postId" element={<PostDetails />} />

            <Route path="albums" element={<Albums />} />
            <Route path="albums/album/:id" element={<AlbumDetails />} />
          </Route>
        </Route>

        <Route path="*" element={<h1>EROR 404</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
