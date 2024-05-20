import React from "react";
import { FaUserLock } from "react-icons/fa";
import { Button, Form, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { ValidationSchemaPassword } from "./Validation/ValidationSchemaPassword";
import { usePatchUserPassword } from "../hooks/use-PatchUserPassword";
import "./UserSingUp.css";

type RequestBodyType = {
    password: string;
    confirmPassword: string;
};

type HandleNewPassType = (newPass: RequestBodyType) => void;

interface PasswordFormProps {
    handleNewPass?: HandleNewPassType;
    userSub: string;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordForm: React.FC<PasswordFormProps> = ({ handleNewPass, userSub, setShowModal }) => {
    const changeUserPassword = usePatchUserPassword();

    const handleSave = async (newPass: RequestBodyType) => {
        await changeUserPassword(userSub, newPass.password)
        setShowModal(false)
    }
    // Formik Password
    const formikPassword = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: ValidationSchemaPassword,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (values: RequestBodyType) => {
            if (handleNewPass) {
                handleNewPass(values);
            } else {
                handleSave(values);
            };
        },
    });
    return (
        <>
            <Modal.Header className="modal-header" closeButton={!handleNewPass}>
                <Modal.Title className="modal-title">Cambiar la Contraseña</Modal.Title>
                <FaUserLock className="userLock-modal-icon" />
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={formikPassword.handleSubmit}>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="contra">Contraseña</Form.Label>
                        <Form.Control
                            id="contra"
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
                        <Form.Label htmlFor="confirm" >Confirmar Contraseña</Form.Label>
                        <Form.Control
                            id="confirm"
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
        </>
    )
}
export default PasswordForm