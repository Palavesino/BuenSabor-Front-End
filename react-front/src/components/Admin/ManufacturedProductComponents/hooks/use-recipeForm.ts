import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { MproductXRecipe } from "../../../../Interfaces/ManufacturedProduct";
import { usePostImage } from "../../../../Util/PostImage";
import { useGetImageId } from "../../../../Util/useGetImageId";
import { Image } from "../../../../Interfaces/Image";

// Función GetRecipeForm
const GetRecipeForm = () => {
  // Obtiene la función getAccessTokenSilently del hook useAuth0
  const { getAccessTokenSilently } = useAuth0();
  const changeImage = usePostImage();
  const getImage = useGetImageId();
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
      if (response.ok) {
        if (edit) {
          const image: Image = await getImage(obj.manufacturedProduct.id, "M");
          // Realiza una solicitud POST para insertar la imagen
          if (obj.file) {
            await changeImage(3, obj.manufacturedProduct.id, obj.file, true, false, image.id);
          }
        } else {
          //Llama al metodo insertAssociatedData para insertar la image y la receta Asociada el Producto Manufacturado
          await insertAssociatedData(obj, token);
        }
        toast.success(`😎 Insertado Exitosamente!`, { position: "top-center" });
      } else {
        handleError(response);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Función insertAssociatedData: Realiza una solicitud POST de Image y Receta con el ID asociado al Producto Manufacturado
  const insertAssociatedData = async (obj: MproductXRecipe, token: string) => {
    try {
      // Realiza la solicitud Get para traer el ultimo id de Producto Manufacturado Insertado.
      const response1 = await fetch("/api/manufactured-products/lastID", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const id = await response1.json();
      const manufacturedProductId = Number(id);// Convertir el ID analizado a un número
      // Realiza la solicitud POST de receta asosciada a el producto Manufacturado
      const response2 = await fetch('/api/recipes/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...obj.recipe, manufacturedProductId }),
      });

      if (response2.ok) {
        await changeImage(3, manufacturedProductId, obj.file ? obj.file : undefined);
      } else {
        console.error("Error al Insertar Recipe");
      }
    } catch (error) {
      console.error("Error al Insertar Associated Data", error);
    }
  };

  const handleError = (error: any) => {
    console.error("Ha ocurrido un error: ", error);
    toast.error('Ha ocurrido un error', { position: 'top-center' });
  };

  return postXPut;
};

export default GetRecipeForm;

