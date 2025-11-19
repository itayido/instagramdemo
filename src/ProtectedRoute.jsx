import { Navigate, Outlet } from "react-router";

function ProtectedRoute() {
  const user = localStorage.getItem("ActiveUser");
  const activeUser = JSON.parse(user || "{}");

  if (!activeUser || !activeUser.username) {
    return <Navigate to="/register" />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
