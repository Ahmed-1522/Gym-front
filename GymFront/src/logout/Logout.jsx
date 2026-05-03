import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Logout() {
  const navigate = useNavigate();
  const { setuserLogin } = useContext(UserContext);

  useEffect(() => {
    localStorage.clear();
    setuserLogin(null);
    navigate("/login", { replace: true });
  }, [navigate, setuserLogin]);

  return <div></div>;
}
