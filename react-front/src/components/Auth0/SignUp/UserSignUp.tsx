import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Modal } from "react-bootstrap";
import { useGetUserLoginCount } from "./hooks/use-GetUserLoginCount.ts";
import { useGetAuth0User } from "./hooks/use-GetAuth0User.ts";
import { usePatchUserPassword } from "./hooks/use-PatchUserPassword.ts";
import { useGetUserRoles } from "./hooks/use-GetUserRoles.ts";
import { usePutUserLogIn } from "./hooks/use-PutUserLogIn.ts";
import { Auth0Role, Role, User } from "../../../Interfaces/User.ts";
import { ModalType } from "../../Enum/ModalType.ts";
import { usePostUserComplete } from "./hooks/use-PostUserComplete.ts";
import PasswordForm from "./UserFormComplete/PasswordForm.tsx";
import UserCompleteForm from "./UserFormComplete/UserCompleteForm.tsx";

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
        phone: "",
        address: "",
        apartment: "",
    };

    //Manejo del modal
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(ModalType.None);

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
                        setModalType(ModalType.ChangePass);
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
                            setModalType(ModalType.SingUp);
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

    //Agregar los datos de auth0 y rol al cliente para guardar en la BBDD
    async function completeUserData(u: User, Auth0Id: string, Email: string) {
        return {
            ...u,
            auth0UserId: Auth0Id,
            email: Email,
            role: {
                id: rol?.id ?? 0,
                denomination: rol?.denomination ?? "",
                idAuth0Role: rol?.idAuth0Role ?? ""
            }
        };
    }

    //POST en BBDD de Cliente
    const handleSave = async (customer: User) => {
        if (user?.sub && user.email != null) {
            const newCustomer: User = await completeUserData(customer, user?.sub, user?.email);
            await userCompletePost(newCustomer);
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

    return (
        <>
            {modalType === ModalType.ChangePass && user?.sub && (
                <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
                    <PasswordForm handleNewPass={handleNewPass} setShowModal={setShowModal} userSub={user?.sub} />
                </Modal>)}

            {modalType === ModalType.SingUp && (
                <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static" className="modal-lg">
                    <UserCompleteForm setShowModal={setShowModal} userComplete={customer} modalType={modalType} handleNewUser={handleSave} />
                </Modal>
            )}

        </>
    )
}