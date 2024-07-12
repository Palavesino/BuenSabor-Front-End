import { User } from "../../../../Interfaces/User";
import { ModalType } from "../../../Enum/ModalType";
import { usePostUserComplete } from "../hooks/use-PostUserComplete";
import { useFormik } from "formik";
import { Button, Form, Modal, Alert, Col, Row } from "react-bootstrap";
import { GiPlagueDoctorProfile } from "react-icons/gi";
import "./UserSingUp.css";
import { validationSchemaUserComplete } from "../../../../Util/YupValidation";

type HandleNewPassType = (u: User) => void;

interface UserCompleteFormProps {
    handleNewUser?: HandleNewPassType;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    userComplete: User;
    modalType: ModalType; // Tipo de modal, indica si es para editar, crear o cambiar el estado de un Usuario
    setRefetch?: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserCompleteForm: React.FC<UserCompleteFormProps> = ({ handleNewUser, setRefetch, userComplete, setShowModal, modalType }) => {
    const userCompletePost = usePostUserComplete();
    const handleSave = async (customer: User) => {
        await userCompletePost(customer, "😎 Usuario Editado Exitosamente!");
        setShowModal(false)
        if (setRefetch) {
            setRefetch(true);
        }
    }
    // Formik userComplete
    const formik = useFormik({
        initialValues: userComplete,
        validationSchema: validationSchemaUserComplete,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (obj: User) => {
            if (handleNewUser) {
                handleNewUser(obj);
            } else {
                if (userComplete.role.id === 3) {
                    obj.name = userComplete.name;
                    obj.lastName = userComplete.lastName;
                }
                handleSave(obj);
                // console.log(JSON.stringify(obj, null, 2))
            };
        },
    });
    return (
        <>
            <Modal.Header closeButton={!handleNewUser}>
                <Modal.Title>Datos de Usuario</Modal.Title>
                <GiPlagueDoctorProfile className="userProfile-modal-icon" />
            </Modal.Header>
            <Modal.Body>
                <Alert variant="success" className="alert-modal">
                    {modalType === ModalType.Edit ? "Todos los campos que se encuentran en gris no pueden ser cambiados" : "Ingrese datos personales para poder realizar pedidos"}
                </Alert>

                <Form onSubmit={formik.handleSubmit}>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor="nombre">Nombre</Form.Label>
                                <Form.Control
                                    id="nombre"
                                    name="name"
                                    type="text"
                                    value={formik.values.name || ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    readOnly={(modalType === ModalType.Edit && userComplete.role.id === 3)}
                                    isInvalid={Boolean(formik.errors.name && formik.touched.name)}
                                    style={{
                                        backgroundColor: (modalType === ModalType.Edit && userComplete.role.id === 3) ? '#dad9d95e' : 'white',
                                        borderColor: (modalType === ModalType.Edit && userComplete.role.id === 3) ? '#d8d8d8' : '',
                                        pointerEvents: (modalType === ModalType.Edit && userComplete.role.id === 3) ? 'none' : 'auto',
                                    }}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.name}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor="apellido">Apellido</Form.Label>
                                <Form.Control
                                    id="apellido"
                                    name="lastName"
                                    type="text"
                                    value={formik.values.lastName || ''}
                                    onChange={formik.handleChange}
                                    readOnly={(modalType === ModalType.Edit && userComplete.role.id === 3)}
                                    onBlur={formik.handleBlur}
                                    isInvalid={Boolean(formik.errors.lastName && formik.touched.lastName)}
                                    style={{
                                        backgroundColor: (modalType === ModalType.Edit && userComplete.role.id === 3) ? '#dad9d95e' : 'white',
                                        borderColor: (modalType === ModalType.Edit && userComplete.role.id === 3) ? '#d8d8d8' : '',
                                        pointerEvents: (modalType === ModalType.Edit && userComplete.role.id === 3) ? 'none' : 'auto',
                                    }}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.lastName}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group >
                                <Form.Label htmlFor="telefono">Teléfono</Form.Label>
                                <Form.Control
                                    id="telefono"
                                    name={`phone`}
                                    type="number"
                                    value={formik.values.phone || ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={Boolean(formik.errors.phone && formik.touched.phone)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.phone}
                                </Form.Control.Feedback>

                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group >
                                <Form.Label htmlFor="departamento">Departamento</Form.Label>
                                <Form.Control
                                    id="departamento"
                                    name="apartment"
                                    type="text"
                                    value={formik.values.apartment || ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={Boolean(formik.errors.apartment && formik.touched.apartment)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.apartment}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                    </Row>
                    <Row>
                        <Col>
                            <Form.Group >
                                <Form.Label htmlFor="direccion">Dirección</Form.Label>
                                <Form.Control
                                    id="direccion"
                                    name="address"
                                    type="text"
                                    value={formik.values.address || ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={Boolean(formik.errors.address && formik.touched.address)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.address}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Modal.Footer>
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

        </>
    )
}
export default UserCompleteForm