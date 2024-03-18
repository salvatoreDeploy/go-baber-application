import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hook/AuthContext";

export function RequireAuth() {
  const { userPresenter } = useAuth();

  return userPresenter ? <Outlet /> : <Navigate to="/" state={{ from: location }} />;
}
