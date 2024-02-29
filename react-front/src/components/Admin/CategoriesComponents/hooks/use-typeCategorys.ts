import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Category } from "../../../../Interfaces/Category";

// Definición del componente GetTypeCategories
const GetTypeCategories = (type: string, category: Category) => {
  // Estado local para almacenar los datos obtenidos
  const [data, setData] = useState([]);
  // Obtención de la función getAccessTokenSilently de useAuth0
  const { getAccessTokenSilently } = useAuth0();

  // Función para construir la URL de la solicitud al servidor
  const getUrl = () => {
    let aux = "";
    if (category.id !== 0 && category.type === type) {
      aux = "/api/categories/filter/unlocked/id/" + category.id;
    } else {
      aux = "/api/categories/filter/unlocked/type/" + type;
    }
    return aux;
  };

  // Efecto para realizar la solicitud al servidor cuando cambia el tipo
  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = getUrl();
        // Verificar que el tipo no esté vacío
        if (type !== "") {
          // Obtener el token de acceso de forma segura
          const token = await getAccessTokenSilently();
          // Realizar la solicitud GET al servidor
          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Verificar si la solicitud fue exitosa
          if (response.ok) {
            const data = await response.json();
            // Actualizar el estado local con los datos obtenidos
            setData(data);
          } else {
            console.error(`Error fetching data:`, response.status);
          }
        }
      } catch (e) {
        console.error(`Error fetching data:`, e);
      }
    };

    // Llamar a la función fetchData al montar o cuando cambia el tipo
    fetchData();
  }, [type]);

  // Devolver los datos obtenidos
  return data;
};

// Exportar el componente GetTypeCategories
export default GetTypeCategories;

