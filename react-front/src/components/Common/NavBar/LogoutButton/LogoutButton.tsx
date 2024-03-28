// Importacion de dependencias
import { useAuth0 } from "@auth0/auth0-react";

// Importacion de estados
import "./LogoutButton.css";
import { usePutUserLogOut } from "../../../Auth0/SignUp/hooks/use-PutUserLogOut";

/*
 *Componente de botón de cierre de sesión.
 *El componente muestra un botón que, al hacer clic, ejecuta la función logout proporcionada por useAuth0() para cerrar la sesión del usuario.
 */
const LogoutButton = () => {
  const { logout, user } = useAuth0();
  const userLogout = usePutUserLogOut();
  const handleLogout = async () => {
    await userLogout(user?.sub as string);
    localStorage.setItem('firstLogIn', JSON.stringify(true));
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  // Renderizado del componente
  return (
    <button className="logout-button" onClick={() => handleLogout()}>
      logout
    </button>
  );
};

export default LogoutButton;
