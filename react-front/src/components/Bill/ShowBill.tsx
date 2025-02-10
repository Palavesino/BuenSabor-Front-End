import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useGenericGetXID } from '../../Services/useGenericGetXID';
import { Bill } from '../../Interfaces/Bill';
import "./ShowBill.css";
interface ShowBillModalProps {
    show: boolean; // Indica si el modal debe mostrarse o no
    onHide: () => void; // Función que se ejecuta cuando el modal se cierra
    orderId: number;
}
const ShowBill: React.FC<ShowBillModalProps> = ({ show, onHide, orderId }) => {
    const [bill, setBill] = useState<Bill>();
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const data = useGenericGetXID<Bill>('/api/bill/order', orderId);

    useEffect(() => {
        if (data) {
            setBill(data);
        }
    }, [data]);

    useEffect(() => {
        if (bill?.base64) {
            const byteCharacters = atob(bill.base64);
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const blob = new Blob([byteNumbers], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);

            return () => {
                URL.revokeObjectURL(url);
            };
        }
    }, [bill]);

    return (
        <>
            {pdfUrl && (
                <Modal show={show} centered backdrop="static" className="modal-xl">
                    <div style={{ height: '80vh', position: 'relative' }}>
                        <div className='div-hide'>
                            <span className="button-closeModal" onClick={onHide} aria-hidden="true">&times;</span>
                        </div>
                        <iframe
                            src={pdfUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 'none' }}
                        ></iframe>
                    </div>
                </Modal>
            )}
            {/* {bill && !bill.base64 && (
                <Modal show={show} onHide={onHide} centered backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            <div >
                                <strong>   No hay factura disponible</strong>
                            </div>
                        </p>
                    </Modal.Body>
                </Modal>
            )} */}
        </>
    );
};

export default ShowBill;
