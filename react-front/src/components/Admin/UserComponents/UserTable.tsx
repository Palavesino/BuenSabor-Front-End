// Importaciones de componentes, funciones y modelos
import GenericTable from "../../Generic/GenericTable";
import { useEffect, useState } from "react";
import { BsCircleFill } from "react-icons/bs";
import { useGenericGet } from "../../../Services/useGenericGet";
import { ModalType } from "../../Enum/ModalType";
import Menu from "../Menu";
import { Row, Col } from "react-bootstrap";
import { Role, User } from "../../../Interfaces/User";
import UserForm from "./UserForm";

/*
el componente UserTable se encarga de mostrar una tabla de Usuarios, 
permitiendo editar, cambiar el estado y agregar nuevos Usuarios. También utiliza un modal 
para mostrar los detalles de un Usuario y realizar acciones relacionadas.
*/

const UserTable = () => {
    // Estado del modal
    const [showModal, setShowModal] = useState(false);
    // Estado para manejar lógica estado del componente
    const [state, setState] = useState(false);
    // Estado para el tipo de modal
    const [modalType, setModalType] = useState<ModalType>(ModalType.None);
    // Estado para indicar si es necesario refrescar los datos
    const [refetch, setRefetch] = useState(false);

    const [roles, setRoles] = useState<Role[]>([]);

    const [users, setUsers] = useState<User[]>([]);

    const [user, setUser] = useState<User>({
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
    });
    // Estado para almacenar el título del modal
    const [title, setTitle] = useState("");
    // Obtener datos de los usuarios, utilizando el hook useGenericGet
    const data = useGenericGet<User>(
        "/api/users/all",
        "Users",
        refetch
    );
    const data2 = useGenericGet<Role>(
        "/api/roles/all",
        "Roles"
    );

    useEffect(() => {
        // Actualizar los Usuarios cuando se obtiene nueva data
        setUsers(data);
        setRoles(data2);
        setRefetch(false);
    }, [data]);

    // Manejar el clic en un elemento de la tabla
    const handleClick = (
        user: User,
        newTitle: string,
        modal: ModalType
    ) => {
        setTitle(newTitle);
        setUser(user);
        setModalType(modal);
        setShowModal(true);
    };

    // Manejar la edición de una Usuario
    const handleEdit = (r: User) => {
        handleClick(r, "Editar Rol de Usuario", ModalType.Edit);
    };
    // Manejar la baja de un Usuario
    const handleLow = (r: User) => {
        setState(false);
        handleClick(r, "Baja", ModalType.ChangeStatus);
    };

    // Manejar la alta de un Usuario
    const handleHigh = (r: User) => {
        setState(true);
        handleClick(r, "Alta", ModalType.ChangeStatus);
    };

    // Manejar la creación de un nuevo Usuario
    const handleAdd = () => {
        const newUser: User = {
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

        handleClick(newUser, "Nuevo Usuario", ModalType.Create);
    };
    // Renderizado del componente
    return (
        <>
            <Row style={{ width: "100%" }}>
                <Col sm={2}>
                    <Menu />
                </Col>
                <Col sm={10}>
                    <GenericTable
                        data={users}
                        columns={[
                            // Definir las columnas de la tabla
                            { field: "id", title: "Id", width: 1 },
                            { field: "email", title: "Email", width: 2 },
                            {
                                field: "role",
                                title: "Role",
                                width: 1,
                                render: (row: User) => (
                                    <ul>
                                        <li>
                                            {row.role.denomination}
                                        </li>
                                    </ul>
                                )
                                ,
                            },
                            {
                                field: "blocked",
                                title: "State",
                                width: 1,
                                render: (row: User) => (
                                    <BsCircleFill
                                        className={
                                            row.blocked ? "icon-CircleLow" : "icon-CircleHigh"
                                        }
                                    />
                                ),
                            },
                        ]}
                        actions={{
                            width: 1.3,
                            create: true,
                            highLogic: true,
                            lowLogic: true,
                            update: true,
                        }}
                        onAdd={handleAdd}
                        onUpdate={handleEdit}
                        onlowLogic={handleLow}
                        onhighLogic={handleHigh}
                    />
                </Col>
                {showModal && (
                    <UserForm
                        roles={roles}
                        user={user}
                        title={title}
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        setRefetch={setRefetch}
                        modalType={modalType}
                        state={state}
                    />
                )}
            </Row>
        </>
    );
};
export default UserTable;