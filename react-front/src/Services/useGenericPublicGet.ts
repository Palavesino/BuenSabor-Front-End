import { useEffect, useState } from "react";
export const useGenericPublicGet = <T>(
  endpoint: string,
  entidadMsj: string,
  refetch?: boolean
) => {

  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    fetchData();
  }, [refetch]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${endpoint}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        console.error(`Error fetching ${entidadMsj} data:`, response.status);
      }
    } catch (e) {
      console.error(`Error fetching ${entidadMsj} data:`, e);
    }
  };
  return data;
};
