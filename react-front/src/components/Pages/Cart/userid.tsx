import { useAuth0 } from "@auth0/auth0-react";

export const userfff = () => {
    const { getAccessTokenSilently } = useAuth0();
    const getuserid = async (id: number) => {
        try {
            const token = await getAccessTokenSilently();

            const response = await fetch(`/api/users/${id}`, {
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
            console.error("Error Get User from Auth0:", error);

        } 

    }
    return getuserid;
}