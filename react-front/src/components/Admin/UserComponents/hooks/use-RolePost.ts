import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { Role } from "../../../../Interfaces/User";
import { useSpinner } from "../../../../context/SpinnerContext";

/*
Este hook proporciona una función (rolePost) que realiza una solicitud POST a una API para 
asignar un rol a un usuario utilizando el token de acceso obtenido de Auth0.
*/
export const useRolPost = () => {
    // Obtiene las funciones necesarias de Auth0 React SDK
    const { getAccessTokenSilently } = useAuth0();
    const { showSpinner, hideSpinner } = useSpinner();

    // Define la función rolePost que realiza una petición POST para asignar un rol a un usuario
    const rolePost = async (userId: string, role: Role) => {
        showSpinner();
        try {
            // Codifica el ID del usuario para incluirlo en la URL
            const encodedUserId = encodeURIComponent(userId).replaceAll("|", "%7C");

            // Obtiene el token de acceso de forma silenciosa utilizando Auth0
            const token = await getAccessTokenSilently();
            // Prepara el cuerpo de la solicitud con el ID del usuario a asignar al rol
            // Realiza la petición POST a la API para asignar el rol al usuario
            const response = await fetch(`/api/users/roles/${encodedUserId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(role),
            });
            // Verifica si la respuesta de la API es exitosa
            if (response.ok) {
                // Muestra una notificación de éxito utilizando react-toastify
                toast.success(`😎 Rol Insertado Exitosamente!`, {
                    position: "top-center",
                });
            }
        } catch (error) {
            // Captura y maneja cualquier error que pueda ocurrir durante la asignación del rol
            console.error("Error assigning user to role:", error);
            toast.error(`Ah ocurrido un error` + error, {
                position: "top-center",
            });
        } finally {
            hideSpinner();
        }
    };
    return rolePost;
};
