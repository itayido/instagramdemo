import { Outlet } from "react-router";
import { Link } from "react-router";
import Logout from "./components/Logout";

function Home() {
  return (
    <>
      <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <Link to="info">Info</Link>
        <Link to="todolist">To Do List</Link>
        <Link to="posts">Posts</Link>
        <Link to="albums">Albums</Link>
        <Logout />
      </nav>
      <Outlet />
    </>
  );
}

export default Home;
