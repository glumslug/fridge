import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const UserProtected = () => {
  const { getUser } = useContext(AuthContext);
  const user = getUser();
  console.log(user);

  return user ? <Outlet /> : <Navigate to="/login" />;
};

const ProtectedRoutes = {
  UserProtected,
};

export default ProtectedRoutes;
