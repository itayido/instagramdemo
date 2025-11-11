import { Link } from "react-router";
import Logout from "./Logout";

function Nav() {
  return (
    <>
      <Link to="/home/info">Info </Link>
      <Link to="/home/todolist">To Do List </Link>
      <Link to="/home/posts">Posts </Link>
      <Link to="/home/albums">Albums </Link>
      <Logout />
    </>
  );
}

export default Nav;
