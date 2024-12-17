import { useAuth0 } from "@auth0/auth0-react";

export const useGetItem = () => {
  const { getAccessTokenSilently } = useAuth0();
    const getItem = async () => {

     
      try {
       
        const tokenAuth = await getAccessTokenSilently();
        const response = await fetch("/api/order/all/complete", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenAuth}`, // Usando el token hardcodeado
          },
        });
  
        if (!response.ok) {
          console.error("Error al obtener los datos:", response.status);
          return null;
        }
        
        const data = await response.json();
        //console.log("Datos obtenidos:", JSON.stringify(data));
        return data;
      } catch (error) {
        console.error("Error al hacer la solicitud:", error);
        return null;
      }
    };
  
    return getItem; // Devuelve la función para ser utilizada en componentes.
  };
  