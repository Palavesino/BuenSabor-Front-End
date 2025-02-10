import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { OrderDetail } from '../../Interfaces/OrderDetail';  
import { useGetpreci } from './Hook/GetPrice';

interface BootstrapModalProps {
    orderDetails: OrderDetail[];
    show: boolean;
    handleClose: () => void;
}

const BootstrapModal: React.FC<BootstrapModalProps> = ({ orderDetails, show, handleClose }) => {
    const getpreci = useGetpreci();

    // Estado para almacenar los precios de los productos
    const [productPrices, setProductPrices] = useState<Record<number, { sellPrice: number; costPrice: number } | null>>({});

    // Función para obtener el precio de un producto
    const fetchPrice = async (productId: number, manufactured: boolean) => {
        const priceData = await getpreci(manufactured ? 2 : 1, productId); // Envía parámetros al hook
        setProductPrices((prev) => ({
            ...prev,
            [productId]: priceData, // Asocia los datos de precio al producto
        }));
    };

    // Efecto para cargar los precios cuando se abra el modal
    useEffect(() => {
        if (show) {
            orderDetails.forEach((detail) => {
                const productId = detail.itemProduct?.id || detail.itemManufacturedProduct?.id;
                const manufactured = !!detail.itemManufacturedProduct;
                if (productId) {
                    fetchPrice(productId, manufactured);
                }
            });
        }
    }, [show, orderDetails]);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Detalles de los productos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul>
                    {orderDetails.map((detail) => {
                        const productId = detail.itemProduct?.id || detail.itemManufacturedProduct?.id;
                        const priceData = productId ? productPrices[productId] : null;

                        return (
                            <p key={detail.id}>
                                {detail.itemProduct ? (
                                    <div>
                                        <strong>{detail.itemProduct.denomination}</strong> <br/> 
                                         Cantidad: {detail.quantity}  <br/>
                                         Subtotal: {detail.subtotal} <br/>
                                         Precio de venta: {priceData ? `$${priceData.sellPrice}` : 'Cargando...'} <br/>
                                         Precio de costo: {priceData ? `$${priceData.costPrice}` : 'Cargando...'}
                                    </div>
                                ) : detail.itemManufacturedProduct ? (
                                    <div>
                                        <strong>{detail.itemManufacturedProduct.denomination}</strong> <br/>
                                         Cantidad: {detail.quantity} <br/>
                                         Subtotal: {detail.subtotal} <br/>
                                         Precio de venta: {priceData ? `$${priceData.sellPrice}` : 'Cargando...'} <br/>
                                         Precio de costo: {priceData ? `$${priceData.costPrice}` : 'Cargando...'}
                                    </div>
                                ) : (
                                    <div>No hay productos asociados</div>
                                )}
                            </p>
                        );
                    })}
                </ul>
            </Modal.Body>
        </Modal>
    );
};

export default BootstrapModal;
