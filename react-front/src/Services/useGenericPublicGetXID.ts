import { useEffect, useState } from "react";

export const useGenericPublicGetXID = <T>(
  endpoint: string,
  id: number,
  refetch?: boolean
) => {

  const [data, setData] = useState<T>({} as T);

  useEffect(() => {
    fetchData();
  }, [refetch]);

  const fetchData = async () => {
    try {

      const response = await fetch(`${endpoint}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        console.error(`Error fetching  data:`, response.status);
      }
    } catch (e) {
      console.error(`Error fetching data:`, e);
    }
  };
  return data;
};
