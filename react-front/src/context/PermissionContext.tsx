import { jwtDecode } from "jwt-decode";
import { UserRole } from '../components/Enum/UserRole';
import { useAuth0 } from "@auth0/auth0-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface PermissionContextProps {
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
    const { isAuthenticated, getAccessTokenSilently } = useAuth0(); // Obtiene el estado de autenticación y la función para obtener el token de acceso de Auth0

    // Función para obtener el permiso del usuario
    const getPermission = useCallback(async () => {
        if (isAuthenticated) {
            const token = await getAccessTokenSilently(); // Obtiene el token de acceso

            const decoded = jwtDecode<PermissionsType>(token); // Decodifica el token para obtener los permisos
            setPermission(UserRole[decoded.permissions[0] as keyof typeof UserRole]); // Establece el rol de usuario basado en los permisos del token
        }
    }, [isAuthenticated, getAccessTokenSilently]);

    // Efecto para obtener el permiso cuando cambia el estado de autenticación
    useEffect(() => {
        getPermission();
    }, [getPermission]);

    // Valor del contexto de permisos
    const value = useMemo(() => ({ permission, getPermission }), [permission, getPermission]);

    // Retorna el proveedor de contexto de permisos con sus hijos envueltos
    return (
        <PermissionContext.Provider value={value}>
            {children}
        </PermissionContext.Provider>
    );
};
