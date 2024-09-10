import React, { useState } from "react";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import "./OrderForm.css";
import { useCart } from "../../context/CartContext";
import { usePermission } from "../../context/PermissionContext";
import { Order } from "../../Interfaces/Order";
import { useOrderSave } from "./hook/use-SaveOrder";
import WalletMP from "./WalletMP";
import { validationSchemaOrder } from "../../Util/YupValidation";
import { PaymentStatus } from "../Enum/Paid";
import { OrderStatus } from "../Enum/OrderStatus";
import { useSendEmail } from "../Bill/hook/use-SendEmail";



interface OrderFormProps {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    show: boolean;
}


const OrderForm: React.FC<OrderFormProps> = ({ show, setShowModal }) => {
    const { cart, clearCart } = useCart();
    const { userComplete } = usePermission();
    const [idPreference, setIdPreference] = useState<string>('');
    const [isDelivery, setIsDelivery] = useState(false);
    const orderPost = useOrderSave(); // Hook personalizado para realizar una petición POST genérica a la API
    const sendEmail = useSendEmail(); // Hook personalizado para realizar una petición POST genérica a la API
    const subtotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
    const discount = subtotal > 5000 ? parseFloat((subtotal * 0.1).toFixed(2)) : 0;

    const totalCookingTime = cart.reduce((acc, item) => {
        if (item.itemManufacturedProduct && item.itemManufacturedProduct.cookingTime) {
            // Descomponer el tiempo en horas, minutos y segundos
            const [hours, minutes, seconds] = item.itemManufacturedProduct.cookingTime.split(':').map(Number);
            // Sumar los tiempos
            acc += hours * 3600 + minutes * 60 + seconds;
        }
        return acc;
    }, 0);
    // Suponiendo que totalCookingTime es el tiempo total en segundos

    // Convertir el tiempo total de segundos a horas, minutos y segundos
    const totalHours = Math.floor(totalCookingTime / 3600);
    const totalMinutes = Math.floor((totalCookingTime % 3600) / 60);
    const totalSeconds = totalCookingTime % 60;

    // Crear una cadena con el formato HH:MM:SS
    const totalTimeString = `${totalHours.toString().padStart(2, '0')}:${totalMinutes.toString().padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`;

    const handleSaveUpdate = async (o: typeof requestBody) => {
        const order: Order = {
            id: 0,
            address: o.address,
            apartment: userComplete?.apartment || "",
            discount: discount,
            estimatedTime: totalTimeString,
            paid: o.paymentType !== 'mp' ? PaymentStatus.APPROVED : PaymentStatus.IN_PROCESS,
            state: OrderStatus.PENDING,
            isCanceled: false,
            phone: requestBody.phone as string,
            total: subtotal - discount,
            userId: userComplete?.id || 0,
            userName: userComplete?.name || "",
            userLastName: userComplete?.lastName || "",
            deliveryMethod: o.deliveryMethod,
            orderDetails: cart,
            paymentType: o.paymentType,

        }
        const response = await orderPost(order);
        if (response) {
            if (order.paymentType === "mp") {
                setIdPreference(response.preferenceId);
                order.id = response.orderId
            }else {
                order.id = response.id
                setShowModal(false);
            }
         await sendEmail(order.id);
        }
        clearCart();
    };

    // Formik Password
    const requestBody = {
        phone: userComplete?.phone || 0,
        address: userComplete?.address || "",
        apartment: userComplete?.apartment || "",
        deliveryMethod: "",
        paymentType: "",

    };
    const formik = useFormik({
        initialValues: requestBody,
        validationSchema: validationSchemaOrder(isDelivery),
        validateOnChange: true,
        validateOnBlur: true,
        // onSubmit: (values: typeof requestBody) => console.log(JSON.stringify(values)),
        onSubmit: (values: typeof requestBody) => handleSaveUpdate(values),
    });
    return (
        <>
            {!idPreference ? (

                <Modal show={show} className="modal-order modal-lg modal-form" centered backdrop="static" onHide={() => setShowModal(false)}  >
                    <Modal.Body >
                        <Button className="button-closeModal" onClick={() => setShowModal(false)}>
                            <span aria-hidden="true">&times;</span>
                        </Button>

                        <Form onSubmit={formik.handleSubmit} className={idPreference ? 'divInvisible' : 'divVisible'} >
                            <Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Label className="col-label">Retiro</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Check
                                            type="radio"
                                            label="Delivery"
                                            name="deliveryMethod"
                                            id="delivery"
                                            value="delivery"
                                            //onChange={handleDeliveryMethodChange}
                                            onChange={(event) => {
                                                const input = event.target as HTMLInputElement;
                                                formik.setFieldValue("deliveryMethod", input.value);
                                                formik.setFieldValue("paymentType", "");
                                                setIsDelivery(true);
                                            }}
                                            className="radio-button"
                                            isInvalid={Boolean(
                                                formik.errors.deliveryMethod && formik.touched.deliveryMethod
                                            )}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Check
                                            type="radio"
                                            label="Local"
                                            name="deliveryMethod"
                                            id="local"
                                            value="local"
                                            onChange={(event) => {
                                                const input = event.target as HTMLInputElement;
                                                formik.setFieldValue("deliveryMethod", input.value);
                                                formik.setFieldValue("paymentType", "");
                                                setIsDelivery(false);
                                            }}
                                            className="radio-button"
                                            isInvalid={Boolean(
                                                formik.errors.deliveryMethod && formik.touched.deliveryMethod
                                            )}
                                        />
                                    </Col>
                                </Row>


                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.deliveryMethod}
                                </Form.Control.Feedback>
                            </Form.Group>
                            {formik.values.deliveryMethod === 'delivery' && (
                                <Row>
                                    <Col className="phone">
                                        <Form.Group controlId="formPhone">
                                            <Form.Label>Teléfono</Form.Label>
                                            <Form.Control
                                                placeholder="Teléfono"
                                                type="number"
                                                name="phone"
                                                onChange={formik.handleChange || ""}
                                                value={formik.values.phone}
                                                isInvalid={Boolean(
                                                    formik.errors.phone && formik.touched.phone
                                                )}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.phone}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col className="address">
                                        <Form.Group>
                                            <Form.Label>Dirección</Form.Label>
                                            <Form.Control
                                                placeholder="Dirección"
                                                type="text"
                                                name="address"
                                                onChange={formik.handleChange}
                                                value={formik.values.address}
                                                isInvalid={Boolean(
                                                    formik.errors.address && formik.touched.address
                                                )}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.address}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col className="apartment">
                                        <Form.Group>
                                            <Form.Label>Departamento</Form.Label>
                                            <Form.Control
                                                placeholder="Departamento"
                                                type="text"
                                                name="apartment"
                                                onChange={formik.handleChange}
                                                value={formik.values.apartment}
                                                isInvalid={Boolean(
                                                    formik.errors.apartment && formik.touched.apartment
                                                )}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.apartment}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}
                            {formik.values.deliveryMethod !== '' && (
                                <Form.Group>
                                    <Row className="row-typePay">
                                        <Col className="col-label">
                                            <Form.Label>Forma de pago</Form.Label>
                                        </Col>
                                        <Col sm={formik.values.deliveryMethod !== 'local' ? 7 : 5}>
                                            <Form.Check
                                                className="radio-button-typePay"
                                                type="radio"
                                                label="Mercado Pago"
                                                name="paymentType"
                                                id="mercadoPago"
                                                value="mp"
                                                checked={formik.values.paymentType === 'mp'}
                                                onChange={formik.handleChange}
                                                isInvalid={Boolean(
                                                    formik.errors.paymentType && formik.touched.paymentType
                                                )}
                                            />
                                        </Col>
                                        {formik.values.deliveryMethod === 'local' && (
                                            <Col>
                                                <Form.Check
                                                    className="radio-button-typePay"
                                                    type="radio"
                                                    label="Efectivo"
                                                    name="paymentType"
                                                    id="cash"
                                                    value="cash"
                                                    checked={formik.values.paymentType === 'cash'}
                                                    onChange={formik.handleChange}
                                                    isInvalid={Boolean(
                                                        formik.errors.paymentType && formik.touched.paymentType
                                                    )}
                                                />
                                            </Col>
                                        )}
                                    </Row>
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.paymentType}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            )}

                            <Row>
                                <label className="col-label" > Resume de Pedido</label>
                            </Row>
                            <div className="scrollable-container">
                                {cart.map((product, index) => (
                                    <Row className="row-colWidht" key={index}>
                                        <Col >
                                            <p> {product.itemProduct ? product.itemProduct.denomination : product.itemManufacturedProduct?.denomination}</p>
                                        </Col>
                                        <Col >
                                            <p className="truncate-text"> {product.itemProduct ? product.itemProduct.description : product.itemManufacturedProduct?.description}</p>
                                        </Col>
                                        <Col>
                                            <p className="text-rigth">  ${product.itemProduct ? product.itemProduct.price.sellPrice : product.itemManufacturedProduct?.price.sellPrice}</p>
                                        </Col>

                                    </Row>
                                ))}
                            </div>
                            <Row className="row-colWidht">
                                <Col > <p>Forma de entrega:</p></Col>
                                <Col > <p>{formik.values.deliveryMethod !== ""
                                    ? formik.values.deliveryMethod
                                    : "Ingrese Forma de Entrega"
                                }</p></Col>
                            </Row>
                            <Row className="row-colWidht">
                                <Col> <p>Forma de pago:</p></Col>
                                <Col > <p>{formik.values.paymentType !== ""
                                    ? (formik.values.paymentType !== "mp" ? "Efectivo" : "Mercado Pago")
                                    : "Ingrese Formade de Pago"
                                }</p></Col>
                            </Row>
                            <div className="text-rigth">
                                <Row>
                                    <Col>
                                        <p>{`Subtotal: $${subtotal}`}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <p>{`Descuento: $${discount}`}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <p>Envío: $xxxx</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <p>{`Total: $${subtotal - discount}`}</p>
                                    </Col>
                                </Row>
                            </div>
                            <Modal.Footer >
                                <Button type="submit" disabled={!formik.isValid} className="button-order">
                                    Confirmar Pedido
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>
            ) :
                <WalletMP preferenceId={idPreference} show={!!idPreference} />
            }

        </>
    );

}
export default OrderForm