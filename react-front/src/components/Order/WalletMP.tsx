
import { useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { Modal } from 'react-bootstrap';

interface WalletMPProps {
    preferenceId: string;
    show: boolean;
}


const WalletMP: React.FC<WalletMPProps> = ({ preferenceId, show }) => {
    useEffect(() => {
        initMercadoPago('TEST-2e745a9d-9ee7-473f-a7a2-d539c36f2f22', { locale: 'es-AR' });
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