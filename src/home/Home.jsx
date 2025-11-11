import { Outlet } from "react-router";
import Nav from "./components/Nav";

function Home() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}

export default Home;
