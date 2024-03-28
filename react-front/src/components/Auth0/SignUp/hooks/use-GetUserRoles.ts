import { useAuth0 } from "@auth0/auth0-react";
import { Auth0Role } from "../../../../Interfaces/User";

export const useGetUserRoles = () => {
    const { getAccessTokenSilently } = useAuth0();
    const getUserRoles = async (userAuth0Id: string) => {
        try {
            const token = await getAccessTokenSilently();
            const encodedUserId = encodeURIComponent(userAuth0Id).replaceAll('|', '%7C');

            const response = await fetch(`/api/roles/auth0/${encodedUserId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                return data.filter(isValidRole)
            } else {
                console.error(`Error fetching data:`, response.status);
            }
        } catch (error) {
            console.error("Error Get User from Auth0:", error);

        }

    }
    const isValidRole = (role: Auth0Role): boolean => {
        return role.id !== undefined && role.name !== undefined && role.description !== undefined;
    };
    return getUserRoles;
}