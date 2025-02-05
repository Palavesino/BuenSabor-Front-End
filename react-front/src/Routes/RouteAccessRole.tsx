import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
  isRolPermited: boolean;
  path?: string

}

export function RouteAccessRole({ children, isRolPermited, path }: PrivateRouteProps) {
  return isRolPermited ? <>{children}</> : <Navigate replace to={path ? path : "/unauthenticated"} />;
};