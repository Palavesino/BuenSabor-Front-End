import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, Outlet } from "react-router-dom";
import { UserRole } from "../components/Enum/UserRole";
import { usePermission } from "../context/PermissionContext";


export const AuthGuard = () => {
    const { permission } = usePermission();
    const { isAuthenticated, isLoading } = useAuth0();
    if (isLoading || (isAuthenticated && permission === UserRole.espectador)) return null;
    return isAuthenticated ? <Outlet /> : <Navigate replace to={"/unauthenticated"} />
};
export default AuthGuard