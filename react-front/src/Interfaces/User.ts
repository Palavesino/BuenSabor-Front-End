export interface User {
  id: number;
  auth0UserId: string;
  email: string;
  name: string;
  lastName: string;
  blocked: boolean;
  logged: boolean;
  role: Role;
  phones: Phone[];
  addresses: Address[];
}

export interface Role {
  id: number;
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
export interface Phone {
  id: number;
  phone: number;
}export interface Address {
  id: number;
  address: string;
  departament: string;
}