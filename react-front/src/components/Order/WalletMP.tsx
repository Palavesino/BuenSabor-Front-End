
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'

interface WalletMPProps {
    preferenceId: string;
}


const WalletMP: React.FC<WalletMPProps> = ({ preferenceId }) => {
  
    initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY || "", { locale: 'es-AR' });

    return (
        <Wallet initialization={{ preferenceId: preferenceId }} />
    );
};
export default WalletMP