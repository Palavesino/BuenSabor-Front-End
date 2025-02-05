import { useAuth0 } from "@auth0/auth0-react";

export const useGetUserLoginCount = () => {
    const { getAccessTokenSilently } = useAuth0();
    const userLoginCount = async (userAuth0Id: string) => {
        try {
            const token = await getAccessTokenSilently();
            const encodedUserId = encodeURIComponent(userAuth0Id).replaceAll('|', '%7C');

            const response = await fetch(`/api/users/logins-count/${encodedUserId}`, {
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
            console.error("Error Login Count from user:", error);

        }

    }
    return userLoginCount;
}