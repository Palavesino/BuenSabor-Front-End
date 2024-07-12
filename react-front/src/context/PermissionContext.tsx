import { jwtDecode } from "jwt-decode";
import { UserRole } from '../components/Enum/UserRole';
import { useAuth0 } from "@auth0/auth0-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { User } from "../Interfaces/User";
import { useGetUserComplete } from "../components/Admin/UserComponents/hooks/use-GetUserComplete";

interface PermissionContextProps {
    userAuth0Id: string;
    userComplete: User | null;
    getUser: () => Promise<void>;
    permission: UserRole; // El rol de usuario actual
    getPermission: () => Promise<void>; // Función para obtener el permiso del usuario
}

interface PermissionsType {
    permissions: string[]; // Lista de permisos
    [key: string]: any; // Otros datos adicionales
}

interface PermissionProviderProps {
    children: React.ReactNode; // Los componentes hijos que deben estar envueltos por el proveedor
}

// Contexto de permisos
const PermissionContext = createContext<PermissionContextProps | undefined>(undefined);

// Hook personalizado para consumir el contexto de permisos
export const usePermission = (): PermissionContextProps => {
    const context = useContext(PermissionContext);

    if (context === undefined) {
        throw new Error('Error! PermissionContext');
    }

    return context;
};

// Proveedor de permisos
export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
    const [permission, setPermission] = useState<UserRole>(UserRole.espectador); // Estado para el rol de usuario
    const [userAuth0Id, setUserAuth0Id] = useState<string>("");
    const [userComplete, setUserComplete] = useState<User | null>(null);
    const getUserComplete = useGetUserComplete();
    const { isAuthenticated, getAccessTokenSilently, user } = useAuth0(); // Obtiene el estado de autenticación y la función para obtener el token de acceso de Auth0
    const getUser = useCallback(async () => {
        if (isAuthenticated) {
            if (user?.sub) {
                const userData = await getUserComplete(user?.sub);
                setUserComplete(userData as User);
                setUserAuth0Id(user?.sub);
            }
        }
    }, [user, isAuthenticated]);
    // Función para obtener el permiso del usuario
    const getPermission = useCallback(async () => {
        if (isAuthenticated) {
            if (user?.sub) {
                setUserAuth0Id(user?.sub);
            }
            const token = await getAccessTokenSilently(); // Obtiene el token de acceso
            const decoded = jwtDecode<PermissionsType>(token); // Decodifica el token para obtener los permisos
            setPermission(UserRole[decoded.permissions[0] as keyof typeof UserRole]); // Establece el rol de usuario basado en los permisos del token
        }
    }, [getAccessTokenSilently, isAuthenticated]);

    // Efecto para obtener el permiso cuando cambia el estado de autenticación
    useEffect(() => {

        getUser();
        getPermission();

    }, [getPermission, getUser]);

    // Valor del contexto de permisos
    const value = useMemo(() => ({ permission, getPermission, userAuth0Id, getUser, userComplete }), [permission, getPermission, userAuth0Id, getUser, userComplete]);

    // Retorna el proveedor de contexto de permisos con sus hijos envueltos
    return (
        <PermissionContext.Provider value={value}>
            {children}
        </PermissionContext.Provider>
    );
};
