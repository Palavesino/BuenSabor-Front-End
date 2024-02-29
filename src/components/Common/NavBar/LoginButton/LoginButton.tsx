// Importacion de dependencias
import { useAuth0 } from "@auth0/auth0-react";

// Importacion de estilos
import "./LoginButton.css"

/*
 *Componente de botón de inicio de sesión.
 *El componente muestra un botón que, al hacer clic, redirige al usuario a la página de inicio de sesión utilizando la función loginWithRedirect proporcionada por useAuth0().
 */
const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  // Renderizado del componente
  return (
    <button className="login-button" onClick={() => loginWithRedirect()}>
      Login
    </button>
  );
};

export default LoginButton;