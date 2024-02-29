export interface User {
  id: number;
  auth0UserId: string;
  email: string;
  blocked: boolean;
  logged: boolean;
  role: Role;
  password: string;
}

export interface Role {
  id: string;
  denomination: string;
  idAuth0Role: string;
}
export interface Auth0User {
  email?: string;
  password?: string;
  blocked?: boolean;
}
export interface Auth0Role {
  id: string;
  name: string;
  description: string
}
