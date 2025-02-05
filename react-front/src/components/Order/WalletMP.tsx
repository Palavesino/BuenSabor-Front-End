
import { useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { Modal } from 'react-bootstrap';

interface WalletMPProps {
    preferenceId: string;
    show: boolean;
}


const WalletMP: React.FC<WalletMPProps> = ({ preferenceId, show }) => {
    useEffect(() => {
        initMercadoPago( import.meta.env.VITE_MP_PUBLIC_KEY || "", { locale: 'es-AR' });
    }, []);

    return (
        <Modal show={show} className="modal-order modal-lg " centered backdrop="static">
            <Modal.Body>
                <Wallet initialization={{ preferenceId: preferenceId }} />
            </Modal.Body>
        </Modal>
    );
};
export default WalletMP