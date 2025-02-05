import { useAuth0 } from "@auth0/auth0-react";

export const UseGetProductLastId = () => {
    const { getAccessTokenSilently } = useAuth0();
    const GetProductLastId = async () => {
        try {
            const token = await getAccessTokenSilently();

            const response = await fetch(`/api/products/lastID`, {
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
            console.error("Error Last id  from Product:", error);

        }

    }
    return GetProductLastId;
}
