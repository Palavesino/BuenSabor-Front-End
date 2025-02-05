import { useAuth0 } from "@auth0/auth0-react";

export const useEmailExists = () => {
    const { getAccessTokenSilently } = useAuth0();
    const emailExists = async (email: string) => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`/api/users/check-email/${email}`, {
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
            console.error("Error check Email Exists from user:", error);

        }

    }
    return emailExists;
}