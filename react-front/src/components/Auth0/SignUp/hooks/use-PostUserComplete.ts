import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { User } from "../../../../Interfaces/User";

/*
Este hook proporciona una función (postUserComplete) que realiza una solicitud POST a una API
para crear un nuevo usuario utilizando el token de acceso obtenido de Auth0. 
*/
export const usePostUserComplete = () => {
    // Obtiene las funciones necesarias de Auth0 React SDK
    const { getAccessTokenSilently } = useAuth0();
    // Función que realiza una petición POST para crear un nuevo usuario
    const postUserComplete = async (obj: User, title?: string) => {
        try {
            // Obtiene el token de acceso de forma silenciosa utilizando Auth0
            const token = await getAccessTokenSilently();
            // Realiza la petición POST a la API para crear un nuevo usuario
            const response = await fetch(`/api/users/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(obj),
            });
            // Verifica si la respuesta es exitosa
            if (response.ok) {
                // Obtiene el cuerpo de la respuesta JSON
                const responseBody = await response.json();
                // Extrae el ID del nuevo usuario creado
                const userId = responseBody.user_id;
                // Muestra un mensaje de éxito si la respuesta es exitosa

                toast.success(title ? title : `😎 Usuario Registradro Exitosamente!`, {
                    position: "top-center",
                });
                // Retorna el ID del nuevo usuario
                return userId;
            }
        } catch (error) {
            // Captura y maneja cualquier error que pueda ocurrir durante la creación del usuario
            console.error("Error creating new user:", error);
            toast.error(`Ah ocurrido un error` + error, {
                position: "top-center",
            });
        }
    };
    return postUserComplete;
};