import { useAuth0 } from "@auth0/auth0-react";

export const useGetAuth0User = () => {
    const { getAccessTokenSilently } = useAuth0();
    const getAuth0User = async (userAuth0Id: string) => {
        try {
            const token = await getAccessTokenSilently();
            const encodedUserId = encodeURIComponent(userAuth0Id).replaceAll('|', '%7C');

            const response = await fetch(`/api/users/auth0/${encodedUserId}`, {
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
    return getAuth0User;
}