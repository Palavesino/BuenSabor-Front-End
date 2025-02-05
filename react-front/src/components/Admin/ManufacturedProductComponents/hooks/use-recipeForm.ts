import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { MproductXRecipe } from "../../../../Interfaces/ManufacturedProduct";
import { usePostImage } from "../../../../Util/PostImage";
import { useGetImageId } from "../../../../Util/useGetImageId";
import { Image } from "../../../../Interfaces/Image";
import { useSpinner } from "../../../../context/SpinnerContext";

// Función GetRecipeForm
const GetRecipeForm = () => {
  // Obtiene la función getAccessTokenSilently del hook useAuth0
  const { getAccessTokenSilently } = useAuth0();
  const { showSpinner, hideSpinner } = useSpinner();
  const changeImage = usePostImage();
  const getImage = useGetImageId();
  // Función postXPut: Realiza una solicitud POST o PUT según el ID del objeto ManufacturedProduct
  const postXPut = async (endpointPost: string, endpointPut: string, obj: MproductXRecipe) => {
    showSpinner();
    try {
      // Obtiene el token de acceso de forma segura
      const token = await getAccessTokenSilently();
      let response;
      let edit = false;
      let requestBody = {
        manufacturedProduct: obj.manufacturedProduct,
        recipe: obj.recipe
      }
      // Verifica si el objeto tiene un ID igual a 0 para determinar si es una solicitud POST o PUT
      if (obj.manufacturedProduct.id === 0) {
        // Realiza la solicitud POST
        response = await fetch(endpointPost, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
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
        const data = await response.json();
        if (edit) {
          const image: Image = await getImage(obj.manufacturedProduct.id, "M");
          // Realiza una solicitud POST para insertar la imagen
          if (obj.file) {
            await changeImage(3, obj.manufacturedProduct.id, obj.file, true, false, image.id);
          }
        } else {
          await changeImage(3, data.id, obj.file ? obj.file : undefined);
        }
        toast.success(`😎 Insertado Exitosamente!`, { position: "top-center" });
      } else {
        handleError(response);
      }
    } catch (error) {
      handleError(error);
    } finally {
      hideSpinner();
    }
  };

  const handleError = (error: any) => {
    console.error("Ha ocurrido un error: ", error);
    toast.error('Ha ocurrido un error', { position: 'top-center' });
  };

  return postXPut;
};

export default GetRecipeForm;

