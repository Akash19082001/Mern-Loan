// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if a token exists in localStorage

  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/" />;
};

export default ProtectedRoute;
