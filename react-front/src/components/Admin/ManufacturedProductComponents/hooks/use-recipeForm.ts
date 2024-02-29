import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { MproductXRecipe } from "../../../../Interfaces/ManufacturedProduct";

// Función GetRecipeForm
const GetRecipeForm = () => {
  // Obtiene la función getAccessTokenSilently del hook useAuth0
  const { getAccessTokenSilently } = useAuth0();

  // Función postXPut: Realiza una solicitud POST o PUT según el ID del objeto ManufacturedProduct
  const postXPut = async (endpointPost: string, endpointPut: string, obj: MproductXRecipe) => {
    try {
      // Obtiene el token de acceso de forma segura
      const token = await getAccessTokenSilently();
      let response;
      let edit = false;

      // Verifica si el objeto tiene un ID igual a 0 para determinar si es una solicitud POST o PUT
      if (obj.manufacturedProduct.id === 0) {
        // Realiza la solicitud POST
        response = await fetch(endpointPost, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(obj.manufacturedProduct),
        });
      } else {
        // Realiza la solicitud PUT
        edit = true;
        response = await fetch(`${endpointPut}/${obj.manufacturedProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(obj.manufacturedProduct),
        });
      }

      // Verifica si la respuesta es exitosa
      if (response.ok && !edit) {
        try {
          // Realiza una solicitud para obtener el último ID insertado
          let response2 = await fetch("/api/manufactured-products/lastID", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Obtiene el ID del producto manufacturado recién insertado
          const id = await response2.json();
          obj.recipe.manufacturedProductId = Number(id); // Convertir el ID analizado a un número

          // Realiza una solicitud POST para insertar la receta asociada al producto manufacturado
          response2 = await fetch('/api/recipes/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(obj.recipe),
          });

          // Verifica si la respuesta de la inserción de la receta es exitosa
          if (response2.ok) {
            toast.success(`😎 Insertado Exitosamente!`, {
              position: "top-center",
            });
          }
        } catch (error) {
          console.error("Error al Insertar Recipe", error);
        }
      } else if (response.ok) {
        // Muestra un mensaje de éxito si la respuesta es exitosa y no es una edición
        toast.success(`😎 Insertado Exitosamente!`, {
          position: "top-center",
        });
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


