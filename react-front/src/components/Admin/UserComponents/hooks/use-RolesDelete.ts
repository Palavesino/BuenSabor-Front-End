import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { useSpinner } from "../../../../context/SpinnerContext";

/*
Este hook proporciona una función (rolesDelete) que realiza una solicitud DELETE a una API 
para eliminar roles específicos de un usuario utilizando el token de acceso obtenido de Auth0. 
*/
export const useRolesDelete = () => {
    // Obtiene las funciones necesarias de Auth0 React SDK
    const { getAccessTokenSilently } = useAuth0();
    const { showSpinner, hideSpinner } = useSpinner();

    // Define la función rolesDelete que realiza una petición DELETE para eliminar roles de un usuario
    const rolesDelete = async (userId: string, roles: string[]) => {
        showSpinner();
        try {
            // Obtiene el token de acceso de forma silenciosa utilizando Auth0
            const token = await getAccessTokenSilently();

            // Codifica el ID del usuario para incluirlo en la URL
            const encodedUserId = encodeURIComponent(userId).replaceAll("|", "%7C");

            // Realiza la petición DELETE a la API para eliminar los roles del usuario
            await fetch(`/api/users/roles/${encodedUserId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ roles: roles })
                }
            );
        } catch (error) {
            // Captura y maneja cualquier error que pueda ocurrir durante la eliminación de roles
            console.error("Error deleting roles from user:", error);
            toast.error(`Ah ocurrido un error` + error, {
                position: "top-center",
            });
        } finally {
            hideSpinner(); // Ocultar el spinner después de la solicitud
        }
    };
    return rolesDelete;
};
