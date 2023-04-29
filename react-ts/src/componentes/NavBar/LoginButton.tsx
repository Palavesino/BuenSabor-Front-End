import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import "./Navbar.css";
const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button className="botonLogin" onClick={() => loginWithRedirect()}>
      Login
    </button>
  );
};
export default LoginButton;
