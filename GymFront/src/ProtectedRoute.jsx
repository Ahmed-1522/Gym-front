import { Navigate } from "react-router-dom";
import { MygetAuth } from "./services/authservice";


export default function ProtectedRoute({ children, role }) {
  const auth = MygetAuth();

  // مش عامل login
  if (!auth) {
    return <Navigate to="/" />;
  }

  // role غلط
  if (role && auth.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
}