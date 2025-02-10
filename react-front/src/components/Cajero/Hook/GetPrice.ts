import { useAuth0 } from "@auth0/auth0-react";

export const useGetpreci = () => {
  const { getAccessTokenSilently } = useAuth0();
    const getprice = async (param1: number, param2: number) => {
       
      try {
       
        const token = await getAccessTokenSilently();
        const response = await fetch(`/api/price/${param1}/${param2}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
        });
  
        if (!response.ok) {
          console.error("Error al obtener los datos:", response.status);
          return null;
        }
  
        const data = await response.json();
       // console.log("Datos obtenidos:", data);
        return data;
      } catch (error) {
        console.error("Error al hacer la solicitud:", error);
        return null;
      }
    };
  
    return getprice; // Devuelve la función para ser utilizada en componentes.
  };
  