import { useAuth0 } from "@auth0/auth0-react";
import { useSpinner } from "../../../../context/SpinnerContext";

export const useGetAuth0User = () => {
    const { getAccessTokenSilently } = useAuth0();
    const { showSpinner, hideSpinner } = useSpinner(); 
    const getAuth0User = async (userAuth0Id: string) => {
        showSpinner();
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

        }finally {
            hideSpinner(); 
          }

    }
    return getAuth0User;
}