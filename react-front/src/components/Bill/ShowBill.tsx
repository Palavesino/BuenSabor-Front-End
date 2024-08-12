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
const ShowBill: React.FC<ShowBillModalProps> = ({
    show,
    onHide,
    orderId

}) => {
    //const base64 = 'JVBERi0xLjUKJeLjz9MKMiAwIG9iago8PC9GaWx0ZXIvRmxhdGVEZWNvZGUvTGVuZ3RoIDE4Nz4+c3RyZWFtCnicdc7LCsIwEAXQfb5ilrqo5tEXWZaquPAF8QOCHTGSNrWNQv/eFlwoxN1l5gxzH6RQRKSQ0xRURShELJ/Ccs2AcVBXMiuMtVCi18b2c3UfDf2hsw022GlvXAOl9iiBUx5HNIu4AC4kE5Lz4OGhq7CDbSkhDu5L01/cs/ES6IIGhXJeWwksyZI/4tyPL/a6HmtNUWHvg+6ohxobD2poR1q34UJozQu7AXbob66SUH0GX3qlyIm8AaqtV40KZW5kc3RyZWFtCmVuZG9iago0IDAgb2JqCjw8L0NvbnRlbnRzIDIgMCBSL1R5cGUvUGFnZS9SZXNvdXJjZXM8PC9Gb250PDwvRjEgMSAwIFI+Pj4+L1BhcmVudCAzIDAgUi9NZWRpYUJveFswIDAgNTk1IDg0Ml0+PgplbmRvYmoKMSAwIG9iago8PC9TdWJ0eXBlL1R5cGUxL1R5cGUvRm9udC9CYXNlRm9udC9IZWx2ZXRpY2EvRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nPj4KZW5kb2JqCjMgMCBvYmoKPDwvS2lkc1s0IDAgUl0vVHlwZS9QYWdlcy9Db3VudCAxPj4KZW5kb2JqCjUgMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDMgMCBSPj4KZW5kb2JqCjYgMCBvYmoKPDwvQ3JlYXRpb25EYXRlKEQ6MjAyNDA3MjMyMzEzMjItMDMnMDAnKS9Qcm9kdWNlcihPcGVuUERGIDIuMC4yKT4+CmVuZG9iagp4cmVmCjAgNwowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAzODEgMDAwMDAgbiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwNDY5IDAwMDAwIG4gCjAwMDAwMDAyNjkgMDAwMDAgbiAKMDAwMDAwMDUyMCAwMDAwMCBuIAowMDAwMDAwNTY1IDAwMDAwIG4gCnRyYWlsZXIKPDwvSW5mbyA2IDAgUi9JRCBbPDEyZjhlNTI3MjRmMWZjMjU4MjA3ODMzYjExN2Q1NzAxPjwxMmY4ZTUyNzI0ZjFmYzI1ODIwNzgzM2IxMTdkNTcwMT5dL1Jvb3QgNSAwIFIvU2l6ZSA3Pj4Kc3RhcnR4cmVmCjY0NwolJUVPRgo=';
    const [bill, setBill] = useState<Bill>();
    const data = useGenericGetXID<Bill>('/api/bill/order', orderId);
    useEffect(() => {
        if (data) {
            setBill(data);
        }
    }, [data])

    return (
        <>
            {bill && bill.base64 && (
                <Modal show={show} centered backdrop="static" className="modal-xl">
                    <div style={{ height: '80vh', position: 'relative' }}>
                        <div className='div-hide'>
                            <span className="button-closeModal" onClick={onHide} aria-hidden="true">&times;</span>
                        </div>
                        <iframe
                            src={`data:application/pdf;base64,${bill?.base64}`}
                            width="100%"
                            height="100%"
                            style={{ border: 'none' }}
                        ></iframe>
                    </div>
                </Modal>
            )}
            {bill && !bill.base64 && (
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
            )}
        </>
    );

}

export default ShowBill;
