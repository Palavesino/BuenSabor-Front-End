import React, { createContext, useContext, useState, ReactNode } from 'react';

type SpinnerContextProps = {
    active: boolean;
    setActive: (state: boolean) => void;
    showSpinner: () => void;
    hideSpinner: () => void;
};

// Crear el contexto del spinner
export const SpinnerContext = createContext<SpinnerContextProps | undefined>(undefined);

// Hook personalizado para usar el contexto del spinner
export function useSpinner() {
    const context = useContext(SpinnerContext);
    if (context === undefined) {
        throw new Error('useSpinner must be used within a SpinnerProvider');
    }
    return context;
}

// Proveedor del contexto del spinner
export const SpinnerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [active, setActive] = useState<boolean>(false);

    const showSpinner = () => setActive(true);
    const hideSpinner = () => setActive(false);

    return (
        <SpinnerContext.Provider value={{ active, setActive, showSpinner, hideSpinner }}>
            {children}
        </SpinnerContext.Provider>
    );
};
