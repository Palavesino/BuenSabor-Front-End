import { useAuth0 } from "@auth0/auth0-react";

export const useGetItems = () => {
    const { getAccessTokenSilently } = useAuth0();
    const getItems = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`/api/order/items`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error(`Error fetching data:`, response.status);
            }
        } catch (error) {
            console.error("Error Get Items from BD = ", error);

        }

    }
    return getItems;
}
