// Importaciones de componentes, funciones y modelos
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { ModalType } from "../../Enum/ModalType";
import { Category } from "../../../Interfaces/Category";
import { useGenericGet } from "../../../Services/useGenericGet";
import { useGenericPost } from "../../../Services/useGenericPost";
import { validationStockGeneral } from "../../../Util/YupValidation";
interface AumentoModalProps {
    show: boolean; // Indica si el modal debe mostrarse o no
    onHide: () => void; // Función que se ejecuta cuando el modal se cierra
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>; // Función para actualizar el estado y volver a obtener los datos después de realizar una acción en el modal
    modalType: ModalType; // Tipo de modal, indica si es para editar, crear o cambiar el estado de una categoría
}

/*
  El componente ProductForm proporciona la funcionalidad necesaria 
  para editar, crear y cambiar el estado de un producto, interactuando con 
  la API y utilizando validación de formularios.
*/
const Aumento: React.FC<AumentoModalProps> = ({
    show,
    onHide,
    setRefetch,
    modalType,
}) => {
    const post = useGenericPost()
    const [categories, setCategories] = useState<Category[]>([]); // Almacena las categorías obtenidas de la API
    const data = modalType !== ModalType.ChangeStatus ? useGenericGet<Category>(
        "/api/categories/all",
        "Product Categories"
    ) : null;

    // Obtiene las categorías desde la API cuando renderice la pág
    useEffect(() => {

        if (data && data.length > 0) {
            setCategories(data);


        }
    }, [data]);
    const requestBody = {
        CategoryID: 0,
        stocknumber: 0,
        aumento: null,
    };

    // Maneja la lógica de guardar o actualizar  un producto
    const handleSaveUpdate = async (obj: typeof requestBody) => {
        console.log(JSON.stringify(obj))
        onHide();
        await post(`/api/stock/bulkTransactional/${obj.CategoryID}/${obj.aumento ? obj.aumento : 'A'}/${obj.stocknumber}`, null)
        setRefetch(true);
    };



    // Configuración y gestión del formulario con Formik
    const formik = useFormik({
        initialValues: requestBody,
        validationSchema: validationStockGeneral,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (obj: typeof requestBody) => handleSaveUpdate(obj),
    })


    // Renderizado del componente
    return (
        <>

            {modalType === ModalType.Stock && (
                <Modal
                    show={show}
                    onHide={onHide}
                    centered
                    backdrop="static"
                    className="modal-xl modal-form"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Aumento-Decremento</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={formik.handleSubmit}>

                            <Row>

                                <>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Number</Form.Label>
                                            <Form.Control
                                                name="stocknumber"
                                                type="number"
                                                value={formik.values.stocknumber || ""}
                                                onChange={formik.handleChange}
                                                isInvalid={Boolean(
                                                    formik.errors.stocknumber && formik.touched.stocknumber
                                                )}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.stocknumber}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>


                                </>


                                <Col sm={6}>
                                    <Form.Group>
                                        <Form.Label>Categoría</Form.Label>
                                        <Form.Select
                                            name="CategoryID"
                                            value={formik.values.CategoryID || ""}
                                            onChange={formik.handleChange}
                                            isInvalid={
                                                formik.touched.CategoryID &&
                                                !!formik.errors.CategoryID
                                            }
                                        >
                                            <option value="">Seleccionar</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.denomination}
                                                </option>
                                            ))}
                                        </Form.Select>

                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.CategoryID}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Row>
                                            <Col>
                                                <Form.Check
                                                    type="radio"
                                                    label="Aumento"
                                                    name="aumento"
                                                    id="aumento"
                                                    value="A"
                                                    onChange={(event) => {
                                                        const input = event.target as HTMLInputElement;
                                                        formik.setFieldValue("aumento", input.value);
                                                    }}
                                                    className="radio-button"
                                                    isInvalid={Boolean(formik.errors.aumento && formik.touched.aumento)}
                                                />

                                                <Form.Check
                                                    type="radio"
                                                    label="Decremento"
                                                    name="aumento"
                                                    id="aumento"
                                                    value="R"
                                                    onChange={(event) => {
                                                        const input = event.target as HTMLInputElement;
                                                        formik.setFieldValue("aumento", input.value);
                                                    }}
                                                    className="radio-button"
                                                    isInvalid={Boolean(formik.errors.aumento && formik.touched.aumento)}
                                                />
                                            </Col>
                                        </Row>

                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.aumento}
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

export default Aumento;
