import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useFormik } from "formik";
import { Button, Form, Modal, Col, Row, Alert } from "react-bootstrap";
import { useGetUserLoginCount } from "./hooks/use-GetUserLoginCount.ts";
import { useGetAuth0User } from "./hooks/use-GetAuth0User.ts";
import { usePatchUserPassword } from "./hooks/use-PatchUserPassword.ts";
import { useGetUserRoles } from "./hooks/use-GetUserRoles.ts";
import { usePutUserLogIn } from "./hooks/use-PutUserLogIn.ts";
import { Auth0Role, Role, User } from "../../../Interfaces/User.ts";
import { ModalType } from "../../Enum/ModalType.ts";
import * as Yup from "yup";
import { usePostUserComplete } from "./hooks/use-PostUserComplete.ts";
import { FaUserLock } from "react-icons/fa";
import "./UserSingUp.css";
import { GiPlagueDoctorProfile } from "react-icons/gi";

interface Props {
    firstLogIn: boolean; // Indica si es el primer inicio de sesión del usuario
    setFirstLogIn: (value: boolean) => void; // Función para actualizar el estado de firstLogIn
}
/*
El componente UserSignUp proporciona la funcionalidad necesaria para que los usuarios puedan registrarse 
y gestionar su cuenta en el sistema de autenticación, utilizando Auth0 como proveedor de identidad.
*/
export const UserSingUp = ({ firstLogIn, setFirstLogIn }: Props) => {

    //Hooks
    const { user } = useAuth0();
    const userLogin = usePutUserLogIn();

    //Custom Hooks de Auth0
    const getAuth0LoginCount = useGetUserLoginCount();
    const getAuth0User = useGetAuth0User();
    const getUserRoles = useGetUserRoles();
    const changeUserPassword = usePatchUserPassword();

    const userCompletePost = usePostUserComplete();

    //Rol
    const [rol, setRol] = useState<Role>();
    //Se inicializa el Cliente
    const customer: User = {
        id: 0,
        auth0UserId: "",
        email: "",
        name: "",
        lastName: "",
        blocked: false,
        logged: false,
        role: {
            id: 0,
            denomination: "",
            idAuth0Role: ""
        },
        phones: [{ id: 0, phone: 0 }],
        addresses: [{ id: 0, address: "", departament: "" }]
    };
    //Manejo del modal
    const [showModal, setShowModal] = useState(false);
    const [currentModal, setCurrentModal] = useState<ModalType>(ModalType.None);

    useEffect(() => {
        // Función asincrónica para obtener el recuento de inicio de sesión del usuario
        async function getLoginCount() {
            // Verifica si hay un usuario autenticado y si es su primer inicio de sesión
            if (user?.sub && firstLogIn) {
                // Obtiene el número de inicio de sesión del usuario
                const logins: number = await getAuth0LoginCount(user.sub);
                // Si es el primer inicio de sesión
                if (logins === 1) {
                    // Obtiene información adicional del usuario desde Auth0
                  const userAuth0 = await getAuth0User(user.sub);
                    // Verifica si el usuario fue creado manualmente
                    const isManualCreation = userAuth0?.app_metadata?.isManualCreation || false;
                    // Obtiene los roles del usuario desde Auth0
                    const userRoles: Auth0Role[] = await getUserRoles(user.sub);
                    // Si el primer rol del usuario no es 'user'
                    if (userRoles[0].name !== "user") {
                        // Muestra el modal para cambiar la contraseña
                        setCurrentModal(ModalType.ChangePass);
                        setShowModal(true);
                    } else {
                        // Si no fue creado manualmente
                        if (!isManualCreation) {
                            // Establece el rol predeterminado para el usuario
                            setRol({
                                id: 3,
                                denomination: userRoles[0].name,
                                idAuth0Role: userRoles[0].id
                            });
                            // Muestra el modal para ingresar datos de usuario
                            setCurrentModal(ModalType.SingUp);
                            setShowModal(true);
                        }
                    }
                } else {
                    // Si no es el primer inicio de sesión, realiza el inicio de sesión del usuario automáticamente
                    await userLogin(user.sub);
                    // Actualiza el estado de firstLogIn para indicar que ya no es el primer inicio de sesión
                    setFirstLogIn(false);
                    // Actualiza el estado almacenado en el localStorage
                    localStorage.setItem('firstLogIn', JSON.stringify(false));
                }
            }
        }
        // Invoca la función para obtener el recuento de inicio de sesión
        getLoginCount();
    }, [user, firstLogIn]); // Las dependencias 'user' y 'firstLogIn' indican cuándo se debe ejecutar este efecto


    //POST en BBDD de Cliente
    const handleSave = async (customer: User) => {
        if (user?.sub && user.email != null) {
            await userCompletePost(customer);
            await userLogin(user.sub);
            setFirstLogIn(false)
            localStorage.setItem('firstLogIn', JSON.stringify(false));
            setShowModal(false)
        }
    }
    const requestBody = {
        password: '',
        confirmPassword: '',
    };

    //Password Auth0
    const handleNewPass = async (newPass: typeof requestBody) => {
        if (user?.sub) {
            await changeUserPassword(user.sub, newPass.password)
            await userLogin(user.sub);
            setFirstLogIn(false)
            localStorage.setItem('firstLogIn', JSON.stringify(false));
            setShowModal(false)
        }
    }
    // Define el esquema de validación del formulario
    const validationSchema = (modalType: ModalType) => {
        switch (modalType) {
            case 7:
                return Yup.object().shape({
                    password: Yup
                        .string()
                        .required('Ingrese Contraseña')
                        .matches(/(?=.*\d)/, 'La Contraseña debe contener al menos un dígito')
                        .matches(/(?=.*[a-z])/, 'La Contraseña debe contener al menos una letra minúscula')
                        .matches(/(?=.*[A-Z])/, 'La Contraseña debe contener al menos una letra mayúscula')
                        .min(8, 'La Contraseña debe tener al menos 8 caracteres'),
                    confirmPassword: Yup.string()
                        .required('Confirme la Contraseña')
                        .oneOf([Yup.ref('password')], 'Los Contraseña y confirm Contraseña deben coincidir'),

                });
            default:
                return Yup.object().shape({
                    name: Yup.string().required('Ingrese un nombre'),
                    lastName: Yup.string().required('Ingrese un apellido'),
                    phones: Yup.array().of(
                        Yup.object().shape({
                            phone: Yup.number().required('Ingrese un número de teléfono')
                        })
                    ).required('Proporcione al menos un número de teléfono'),
                    addresses: Yup.array().of(
                        Yup.object().shape({
                            address: Yup.string().required('Ingrese una dirección'),
                            departament: Yup.string().required('Ingrese un departamento')
                        })
                    ).required('Proporcione al menos una dirección'),

                });
        }
    };


    // Formik Customer
    const formikCustomer = useFormik({
        initialValues: customer,
        validationSchema: validationSchema(currentModal),
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (obj: User) => {
            const modifiedCustomer: User = {
                id: 0,
                auth0UserId: user?.sub ?? "",
                email: user?.email ?? "",
                name: obj.name,
                lastName: obj.lastName,
                blocked: false,
                logged: false,
                role: {
                    id: rol?.id ?? 0,
                    denomination: rol?.denomination ?? "",
                    idAuth0Role: rol?.idAuth0Role ?? ""
                },
                phones: obj.phones,
                addresses: obj.addresses
            };
            handleSave(modifiedCustomer);
        }
    });


    //Formik Password
    const formikPassword = useFormik({
        initialValues: requestBody,
        validationSchema: validationSchema(currentModal),
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (obj: typeof requestBody) => handleNewPass(obj),
    });

    return (
        <>
            {currentModal === ModalType.ChangePass && (
                <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
                    <Modal.Header className="modal-header">
                        <Modal.Title className="modal-title">Cambiar la Contraseña</Modal.Title>
                        <FaUserLock className="userLock-modal-icon" />
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={formikPassword.handleSubmit}>
                            <Form.Group className="mb-3" >
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    name="password"
                                    type="password"
                                    value={formikPassword.values.password || ''}
                                    onChange={formikPassword.handleChange}
                                    onBlur={formikPassword.handleBlur}
                                    isInvalid={Boolean(formikPassword.errors.password && formikPassword.touched.password)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formikPassword.errors.password}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Confirmar Contraseña</Form.Label>
                                <Form.Control
                                    name="confirmPassword"
                                    type="password"
                                    value={formikPassword.values.confirmPassword || ''}
                                    onChange={formikPassword.handleChange}
                                    onBlur={formikPassword.handleBlur}
                                    isInvalid={Boolean(formikPassword.errors.confirmPassword && formikPassword.touched.confirmPassword)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formikPassword.errors.confirmPassword}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Modal.Footer className="mt-4">
                                <Button variant="primary" type="submit" disabled={!formikPassword.isValid}>
                                    Guardar
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>)}

            {currentModal === ModalType.SingUp && (
                <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static" className="modal-lg">
                    <Modal.Header>
                        <Modal.Title>Datos de Usuario</Modal.Title>
                        <GiPlagueDoctorProfile className="userProfile-modal-icon" />
                        {/* <ImProfile className="userProfile-modal-icon"/> */}
                    </Modal.Header>
                    <Modal.Body>
                        <Alert variant="success" className="alert-modal">
                            Ingrese datos personales para poder realizar pedidos
                        </Alert>
                        <Form onSubmit={formikCustomer.handleSubmit}>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            name="name"
                                            type="text"
                                            value={formikCustomer.values.name || ''}
                                            onChange={formikCustomer.handleChange}
                                            onBlur={formikCustomer.handleBlur}
                                            isInvalid={Boolean(formikCustomer.errors.name && formikCustomer.touched.name)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formikCustomer.errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Apellido</Form.Label>
                                        <Form.Control
                                            name="lastName"
                                            type="text"
                                            value={formikCustomer.values.lastName || ''}
                                            onChange={formikCustomer.handleChange}
                                            onBlur={formikCustomer.handleBlur}
                                            isInvalid={Boolean(formikCustomer.errors.lastName && formikCustomer.touched.lastName)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formikCustomer.errors.lastName}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group >
                                        <Form.Label>Teléfono</Form.Label>
                                        <Form.Control
                                            name={`phones[0].phone`}
                                            type="number"
                                            value={formikCustomer.values.phones[0] ? formikCustomer.values.phones[0].phone : ''}
                                            onChange={formikCustomer.handleChange}
                                            onBlur={formikCustomer.handleBlur}
                                            isInvalid={!!(formikCustomer.touched.phones && formikCustomer.touched.phones[0] && formikCustomer.errors && formikCustomer.errors.phones && formikCustomer.errors.phones[0])}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formikCustomer.errors.phones && typeof formikCustomer.errors.phones[0] === 'object' && formikCustomer.errors.phones[0]?.phone}
                                        </Form.Control.Feedback>

                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId="formDepartamento">
                                        <Form.Label>Departamento</Form.Label>
                                        <Form.Control
                                            name="addresses[0].departament"
                                            type="text"
                                            value={formikCustomer.values.addresses.length > 0 ? formikCustomer.values.addresses[0].departament : ''}
                                            onChange={formikCustomer.handleChange}
                                            onBlur={formikCustomer.handleBlur}
                                            isInvalid={Boolean(formikCustomer.touched.addresses && formikCustomer.touched.addresses[0] && formikCustomer.errors.addresses && formikCustomer.errors.addresses[0])}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formikCustomer.errors.addresses && typeof formikCustomer.errors.addresses[0] === 'object' && formikCustomer.errors.addresses[0]?.departament}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId="formDireccion">
                                        <Form.Label>Dirección</Form.Label>
                                        <Form.Control
                                            name="addresses[0].address"
                                            type="text"
                                            value={formikCustomer.values.addresses[0] ? formikCustomer.values.addresses[0].address : ''}
                                            onChange={formikCustomer.handleChange}
                                            onBlur={formikCustomer.handleBlur}
                                            isInvalid={Boolean(formikCustomer.touched.addresses && formikCustomer.touched.addresses[0] && formikCustomer.errors.addresses && formikCustomer.errors.addresses[0])}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formikCustomer.errors.addresses && typeof formikCustomer.errors.addresses[0] === 'object' && formikCustomer.errors.addresses[0]?.address}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Modal.Footer >
                                <Button
                                    variant="success"
                                    type="submit"
                                    disabled={!formikCustomer.isValid}
                                >
                                    Guardar
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}

        </>
    )
}