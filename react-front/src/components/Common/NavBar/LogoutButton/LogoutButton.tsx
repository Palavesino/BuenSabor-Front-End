// Importacion de dependencias
import { useAuth0 } from "@auth0/auth0-react";

// Importacion de estados
import "./LogoutButton.css";

/*
 *Componente de botón de cierre de sesión.
 *El componente muestra un botón que, al hacer clic, ejecuta la función logout proporcionada por useAuth0() para cerrar la sesión del usuario.
 */
const LogoutButton = () => {
  const { logout } = useAuth0();

  // Renderizado del componente
  return (
    <button className="logout-button" onClick={() => logout()}>
      logout
    </button>
  );
};

export default LogoutButton;
