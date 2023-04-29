import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import "./Navbar.css";

const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <button className="botonLogout" onClick={() => logout()}>
      logout
    </button>
  );
};

export default LogoutButton;
