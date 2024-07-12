// Importaciones de componentes, funciones y modelos
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { ModalType } from "../../Enum/ModalType";
import { Auth0User, Role, User } from "../../../Interfaces/User";
import { useUserPost } from "./hooks/use-UserPost";
import { useRolPost } from "./hooks/use-RolePost";
import { useStatusPut } from "./hooks/use-StatusUpdate";
import { useRolesDelete } from "./hooks/use-RolesDelete";
import { useEmailExists } from "./hooks/use-EmailExists";
import { useGenericGet } from "../../../Services/useGenericGet";
import { useEffect, useState } from "react";
import { validationSchemaUser } from "../../../Util/YupValidation";

// Interfaz que define las propiedades esperadas por el componente UserForm
interface UserModalProps {
    show: boolean; // Indica si el modal debe mostrarse o no
    onHide: () => void; // Función que se ejecuta cuando el modal se cierra
    title: string; // Título del modal
    user: User; // Usuario actual que se está editando
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>; // Función para actualizar el estado y volver a obtener los datos después de realizar una acción en el modal
    modalType: ModalType; // Tipo de modal, indica si es para editar, crear o cambiar el estado de un Usuario
    state: boolean; // Estado actual del Usuario
}

/*
  El componente UserForm proporciona la funcionalidad necesaria 
  para editar, crear y cambiar el estado de un usuario, interactuando con 
  la API y utilizando validación de formularios.
*/
const UserForm: React.FC<UserModalProps> = ({
    show,
    onHide,
    title,
    user,
    setRefetch,
    modalType,
    state,
}) => {

    const userPost = useUserPost(); // Hook personalizado para realizar una petición POST genérica a la API
    const rolePost = useRolPost(); // Hook personalizado para realizar una petición POST genérica a la API
    const updateUserStatus = useStatusPut(); // Hook personalizado para actualizar el estado de un usuario
    const deleteRolesFromUser = useRolesDelete(); // Hook personalizado para Eliminar roles de  un usuario
    const checkEmailExists = useEmailExists(); // Hook personalizado para verificar si email del usuario ya existe en la BD
    const data = modalType !== ModalType.ChangeStatus ? useGenericGet<Role>(
        "/api/roles/all",
        "Roles"
    ) : null;
    const [roles, setRoles] = useState<Role[]>([]);
    useEffect(() => {
        if (data && data.length > 0) {
            setRoles(data);
        }
    }, [data]);
    // Maneja la lógica de guardar o actualizar un Usuario
    const handleSaveUpdate = async (u: typeof requestBody) => {
        const isNew = modalType === ModalType.Create;
        if (isNew) {
            await userPost("/api/users/saveAuth0User", u.role, u.auth0User);
        } else {
            //Si se selecciona otro rol distinto al existente llamo a la API de Auth0
            if (!user?.role || u.role !== user?.role) {
                //Si existe alguno se procede a eliminarlo
                if (user?.role) {
                    await deleteRolesFromUser(user.auth0UserId, [user.role.idAuth0Role]);
                }
                //Asigno el nuevo rol al usuario
                await rolePost(user.auth0UserId, u.role,);
            }
        }
        setRefetch(true);
        onHide();
    };
    // Maneja el cambio de estado de un Usuario
    const handleStateUser = async () => {
        if (!state) {
            await updateUserStatus(true, user.auth0UserId);
        } else {
            await updateUserStatus(false, user.auth0UserId);
        }
        setRefetch(true);
        onHide();
    };
    let auh0User: Auth0User = {
        email: user.email,
        password: "",
        blocked: user.blocked,
    };
    const requestBody = {
        auth0User: auh0User,
        confirmPassword: "",
        role: user.role ?? "",
    };
    // Configuración y gestión del formulario con Formik
    const formik = useFormik({
        initialValues: requestBody,
        validationSchema: validationSchemaUser(modalType, checkEmailExists),
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (obj: typeof requestBody) => handleSaveUpdate(obj),
    });
    // Renderizado del componente
    return (
        <>
            {modalType === ModalType.ChangeStatus &&
                state === user.blocked && (
                    <Modal show={show} onHide={onHide} centered backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title>{title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>
                                ¿Está seguro que desea Dar de {title} el estado del Usuario?
                                <br /> <strong>{user.email}</strong>?
                            </p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={onHide}>
                                Cancelar
                            </Button>
                            <Button
                                variant={state ? "success" : "danger"}
                                onClick={handleStateUser}
                            >
                                Guardar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
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
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            name="auth0User.email"
                                            type="email"
                                            value={formik.values.auth0User.email || ""}
                                            onChange={formik.handleChange}
                                            readOnly={modalType === ModalType.Edit}
                                            isInvalid={Boolean(formik.errors.auth0User?.email && formik.touched.auth0User?.email)}
                                            style={{
                                                backgroundColor: modalType === ModalType.Edit ? '#dad9d95e' : 'white',
                                                borderColor: modalType === ModalType.Edit ? '#d8d8d8' : '',
                                                pointerEvents: modalType === ModalType.Edit ? 'none' : 'auto',
                                            }}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.auth0User?.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            name="auth0User.password"
                                            type="password"
                                            value={
                                                modalType === ModalType.Edit
                                                    ? '**********'
                                                    : formik.values.auth0User.password || ''
                                            }
                                            onChange={formik.handleChange}
                                            readOnly={modalType === ModalType.Edit}
                                            isInvalid={Boolean(
                                                formik.errors.auth0User?.password && formik.touched.auth0User?.password
                                            )}
                                            style={{
                                                backgroundColor: modalType === ModalType.Edit ? '#dad9d95e' : 'white',
                                                borderColor: modalType === ModalType.Edit ? '#d8d8d8' : '',
                                                pointerEvents: modalType === ModalType.Edit ? 'none' : 'auto',
                                            }}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.auth0User?.password}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            {modalType !== ModalType.Edit && (
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Form.Control
                                                name="confirmPassword"
                                                type="password"
                                                value={formik.values.confirmPassword || ""}
                                                onChange={formik.handleChange}
                                                isInvalid={Boolean(formik.errors.confirmPassword && formik.touched.confirmPassword)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.confirmPassword}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}

                            <Row>
                                <Col sm={6}>
                                    <Form.Group>
                                        <Form.Label>Rol</Form.Label>
                                        <Form.Control
                                            name="role"
                                            as="select"
                                            value={formik.values.role.idAuth0Role || ""}
                                            onChange={(event) => {
                                                const selectedRole = roles.find(role => role.idAuth0Role === event.target.value);
                                                formik.setFieldValue("role", selectedRole || { id: "", denomination: "", auth0RoleId: "" });
                                            }}
                                            isInvalid={formik.touched.role && !!formik.errors.role}
                                        >
                                            <option value={""}>Seleccionar</option>
                                            {roles.map((rol: Role) => (
                                                <option key={rol.id} value={rol.idAuth0Role}>
                                                    {rol.denomination}
                                                </option>
                                            ))}
                                        </Form.Control>


                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.role?.idAuth0Role}
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

export default UserForm;