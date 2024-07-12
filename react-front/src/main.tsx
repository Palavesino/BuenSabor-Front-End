import ReactDOM from "react-dom/client";
// Importaciones de dependencias
import { BrowserRouter } from "react-router-dom";
import React from "react";
// Importaciones de componentes, funciones y modelos
import App from "./App.tsx";

// Importaciones de estilos
import "./index.css";
import AuthProvider from "./components/Auth0/Auth0Provider.tsx";

const storedAuthState = JSON.parse(localStorage.getItem("authState") || "{}");
const initialAuthState = {
  isAuthenticated: storedAuthState.isAuthenticated || false,
  idToken: storedAuthState.idToken || "",
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
  
  {/* <React.StrictMode> */}
    <AuthProvider initialAuthState={initialAuthState}>
        <App />
    </AuthProvider>
  {/* </React.StrictMode> */}
  </>
);