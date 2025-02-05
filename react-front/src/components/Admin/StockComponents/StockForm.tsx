// Importaciones de componentes, funciones y modelos
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { ModalType } from "../../Enum/ModalType";
import { validationStock } from "../../../Util/YupValidation";
import { Stock } from "../../../Interfaces/Stock";
import { useGenericPut } from "../../../Services/useGenericPut";
// Interfaz que define las propiedades esperadas por el componente StockForm
interface StockFormModalProps {
    show: boolean; // Indica si el modal debe mostrarse o no
    onHide: () => void; // Función que se ejecuta cuando el modal se cierra
    title: string; // Título del modal
    stock: Stock; // Elemento del stock actual que se está editando
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>; // Función para actualizar el estado y volver a obtener los datos después de realizar una acción en el modal
    modalType: ModalType; // Tipo de modal, indica si es para editar, crear o cambiar el estado de un elemento del stock
}

/*
  El componente StockForm proporciona la funcionalidad necesaria 
  para editar un elemento del stock, 
  interactuando con la API y utilizando validación de formularios.
*/
const StockForm: React.FC<StockFormModalProps> = ({
    show,
    onHide,
    title,
    stock,
    setRefetch,
    modalType,
}) => {
    const genericUpdate = useGenericPut();

    // Maneja la lógica de guardar o actualizar un elemento del stock
    const handleUpdate = async (s: Stock) => {
        onHide();
        await genericUpdate('/api/stock/update', s.id, s);
        setRefetch(true);
    };

    // Configuración y gestión del formulario con Formik
    const formik = useFormik({
        initialValues: stock,
        validationSchema: validationStock(),
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (obj: Stock) => handleUpdate(obj),
    });


    // Renderizado del componente
    return (
        <>
            {modalType !== ModalType.ChangeStatus && (
                <Modal
                    show={show}
                    onHide={onHide}
                    centered
                    backdrop="static"
                    className="modal-xl modal-form"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={formik.handleSubmit}>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Denominación</Form.Label>
                                        <Form.Control
                                            name="denomination"
                                            type="text"
                                            value={formik.values.denomination || ""}
                                            onChange={formik.handleChange}
                                            isInvalid={Boolean(
                                                formik.errors.denomination && formik.touched.denomination
                                            )}
                                            readOnly
                                            disabled
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.denomination}
                                        </Form.Control.Feedback>

                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>

                                <Col>
                                    <Form.Group>
                                        <Form.Label>Stock Mínimo</Form.Label>
                                        <Form.Control
                                            name="minStock"
                                            type="number"
                                            value={formik.values.minStock || ""}
                                            onChange={formik.handleChange}
                                            isInvalid={Boolean(
                                                formik.errors.minStock && formik.touched.minStock
                                            )}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.minStock}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Stock Actual</Form.Label>
                                        <Form.Control
                                            name="actualStock"
                                            type="number"
                                            value={formik.values.actualStock || ""}
                                            onChange={formik.handleChange}
                                            isInvalid={Boolean(
                                                formik.errors.actualStock && formik.touched.actualStock
                                            )}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.actualStock}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Modal.Footer className="mt-4">
                                <Button variant="secondary" onClick={onHide}>
                                    Cancelar
                                </Button>
                                <Button
                                    variant="success"
                                    type="submit"
                                    disabled={!formik.isValid}
                                >
                                    Guardar
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};

export default StockForm