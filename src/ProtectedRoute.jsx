import { Navigate, Outlet } from "react-router";

function ProtectedRoute() {
  const activeUser = JSON.parse(localStorage.getItem("ActiveUser") || {});

  if (!activeUser || !activeUser.username) {
    return <Navigate to="/register" />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
