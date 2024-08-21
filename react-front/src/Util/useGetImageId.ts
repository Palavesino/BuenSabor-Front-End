import { useAuth0 } from "@auth0/auth0-react";
export const useGetImageId = () => {
    const { getAccessTokenSilently } = useAuth0();
    const GetImageId = async (id: number, filter: string) => {
        try {
            let accessToken = await getAccessTokenSilently();
                                     
            const response = await fetch(`/api/images/filter/${filter}/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const data = await response.text();
                if (!data) {
                    return null;
                } else {
                    return JSON.parse(data);
                }
            } else {
                console.error(`Error fetching data:`, response.status);
            }
        } catch (error) {
            console.error("Error Get Image Id from BD:", error);
        }

    }
    return GetImageId;
}
