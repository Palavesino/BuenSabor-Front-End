// Importacion de dependencias
import { useAuth0 } from "@auth0/auth0-react";

/*
 *Componente de perfil de usuario.
 *El componente muestra la información del usuario, como la imagen, el nombre y el correo electrónico, si el usuario está autenticado.
 *Utiliza el hook useAuth0() para obtener la información del usuario y el estado de autenticación.
 *Si el usuario está autenticado, se muestra la imagen, el nombre, el correo electrónico y una representación en formato JSON de los datos del usuario.
 *Si el usuario no está autenticado, no se muestra nada.
 */
const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  // Renderizado del componente
  return isAuthenticated ? (
    <div>
      <img src={user?.picture} alt={user?.name} />
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
      <pre>{JSON.stringify(user)}</pre>
    </div>
  ) : (
    <></>
  );
};

export default Profile;