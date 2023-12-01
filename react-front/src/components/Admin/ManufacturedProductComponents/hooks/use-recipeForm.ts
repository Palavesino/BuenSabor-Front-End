import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { ManufacturedProduct } from "../../../../Models/ManufacturedProduct";

// Función GetRecipeForm
const GetRecipeForm = () => {
  // Obtiene la función getAccessTokenSilently del hook useAuth0
  const { getAccessTokenSilently } = useAuth0();

  // Función postXPut: Realiza una solicitud POST o PUT según el ID del objeto ManufacturedProduct
  const postXPut = async (endpointPost: string, endpointPut: string, obj: ManufacturedProduct) => {
    try {
      // Obtiene el token de acceso de forma segura
      const token = await getAccessTokenSilently();
      let response;

      // Verifica si el objeto tiene un ID igual a 0 para determinar si es una solicitud POST o PUT
      if (obj?.id === 0) {
        // Realiza la solicitud POST
        response = await fetch(endpointPost, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(obj),
        });
      } else {
        // Realiza la solicitud PUT
        response = await fetch(`${endpointPut}/${obj?.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(obj),
        });
      }

      // Verifica si la respuesta es exitosa
      if (response.ok) {
        // Muestra un mensaje de éxito usando la librería toast
        toast.success('😎 Insertado Exitosamente!', {
          position: 'top-center',
        });
        return true; // Devuelve true para indicar que la operación fue exitosa
      } else {
        // Muestra un mensaje de error si la respuesta no es exitosa
        toast.error('La petición no fue exitosa', {
          position: 'top-center',
        });
      }
    } catch (error) {
      // Muestra un mensaje de error en caso de una excepción
      toast.error('Ha ocurrido un error: ' + error, {
        position: 'top-center',
      });
    }
  };

  // Devuelve la función postXPut para que pueda ser utilizada más adelante
  return postXPut;
};

// Exporta la función GetRecipeForm como el componente principal de este módulo
export default GetRecipeForm;

