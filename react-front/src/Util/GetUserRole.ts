import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Role } from "../Interfaces/User";

export const useGetUserRole = (id: string) => {
    const { getAccessTokenSilently } = useAuth0();
    const [data, setData] = useState<Role | null>(null);

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getAccessTokenSilently();
                const encodedUserId = encodeURIComponent(id).replaceAll('|', '%7C');

                const response = await fetch(`/api/users/role/${encodedUserId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    setData(userData.filter(isValidRole));
                } else {
                    console.error(`Error fetching data:`, response.status);
                }
            } catch (error) {
                console.error("Error Get User Role from BD:", error);
            }
        };

        fetchData();
    }, [getAccessTokenSilently, id]);

    const isValidRole = (role: Role): boolean => {
        return role.id !== undefined && role.denomination !== undefined && role.idAuth0Role !== undefined;
    };

    return data;
};
