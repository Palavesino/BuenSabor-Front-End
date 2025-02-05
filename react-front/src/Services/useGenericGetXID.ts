import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSpinner } from "../context/SpinnerContext"; // Importar SpinnerContext

export const useGenericGetXID = <T>(
  endpoint: string,
  id: number,
  refetch?: boolean
) => {
  const { getAccessTokenSilently } = useAuth0();
  const { showSpinner, hideSpinner } = useSpinner(); 

  const [data, setData] = useState<T>({} as T);

  useEffect(() => {
    fetchData();
  }, [refetch]);

  const fetchData = async () => {
    showSpinner();
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${endpoint}/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        console.error(`❌ Error al obtener datos:`, response.status);
      }
    } catch (e) {
      console.error(`❌ Error al obtener datos:`, e);
    } finally {
      hideSpinner();
    }
  };

  return data;
};
