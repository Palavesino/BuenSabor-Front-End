import { Row, Col, Image, Card, Table, Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import PasswordForm from "../Auth0/SignUp/UserFormComplete/PasswordForm";
import { ModalType } from "../Enum/ModalType";
import { FaCamera } from "react-icons/fa";
import UserCompleteForm from "../Auth0/SignUp/UserFormComplete/UserCompleteForm";
import "./UserProfile.css";
import ImageForm from "./Picture/ImageForm";
import { useGetImageId } from "../../Util/useGetImageId";
import { Image as UserImage } from "../../Interfaces/Image";
import { FaUserCircle } from "react-icons/fa";
import { usePermission } from "../../context/PermissionContext";
const UserProfile = () => {
    const { userComplete } = usePermission();
    const [showModal, setShowModal] = useState(false);
    const [image, setImage] = useState<UserImage>(); // Usar el nuevo nombre
    const [refetch, setRefetch] = useState(false);
    const [modalType, setModalType] = useState<ModalType>(ModalType.None);
    const getImage = useGetImageId();
    useEffect(() => {
        const fetchUserComplete = async () => {
            if (userComplete) {
                const imageData = await getImage(userComplete.id, "U");
                setImage(imageData);
            }
        };
        fetchUserComplete();
        setRefetch(false);
    }, [refetch]);

    const changePass = () => {
        setModalType(ModalType.ChangePass);
        setShowModal(true);
    };
    const changeImage = () => {
        setModalType(ModalType.ChangeImage);
        setShowModal(true);
    };
    const updateUser = () => {
        setModalType(ModalType.Edit);
        setShowModal(true);
    };


    return (
        <div>
            {userComplete ? (
                <>
                    <Row style={{ width: "100%" }}>
                        <Col sm={3}>
                            <Card className='profile-Card'>
                                <Card.Body>
                                    <div className='profile-Body-div'>
                                        {(image) ? (
                                            <>
                                            <Image className='profile-image' src={`../../../uploads/users/${image?.name}`} roundedCircle />
                                            </>
                                            
                                        ) : (
                                            <FaUserCircle className='profile-image' />
                                        )}
                                        <Button className="edit-button" onClick={changeImage}><FaCamera className="profile-camareIcon" /><br />Editar</Button>
                                    </div>
                                    <Card.Title className='profile-Title'>{userComplete.name}</Card.Title>
                                </Card.Body>
                            </Card>

                        </Col>
                        <Col sm={8}>

                            <Table responsive className='profile-Table'>
                                <thead>
                                    <tr>
                                        <th colSpan={3} className="text-center">
                                            Mis Datos

                                        </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th colSpan={2} >
                                            Datos Personales
                                        </th>
                                        <th className="text-center">
                                            <Button onClick={updateUser} className="profile-Button-Update">
                                                Modificar Datos ⮕
                                            </Button>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>Nombre</th>
                                        <td colSpan={2}>{userComplete.name || ""} {userComplete.lastName || ""}</td>
                                    </tr>
                                    <tr>
                                        <th>Telefono</th>
                                        <td colSpan={2}>{userComplete.phone || ""} </td>
                                    </tr>
                                    <tr>
                                        <th className="th-Department">Departamento</th>
                                        <td colSpan={2}>{userComplete.apartment || ""} </td>
                                    </tr>
                                    <tr>
                                        <th className="th-Addresses">Direccion</th>
                                        <td colSpan={2}>{userComplete.address || ""} </td>
                                    </tr>


                                    <tr>
                                        <th>Email</th>
                                        <td colSpan={2}>{userComplete.email || ""}</td>
                                    </tr>

                                    <tr>
                                        <th>Contraseña</th>
                                        <td colSpan={2}><Button onClick={changePass} className="profile-Password-Button">
                                            Cambiar Contraseña ⮕
                                        </Button></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                        {modalType === ModalType.ChangePass && userComplete && (
                            <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
                                <PasswordForm setShowModal={setShowModal} userSub={userComplete.auth0UserId} />
                            </Modal>
                        )}
                        {modalType === ModalType.ChangeImage && userComplete && (
                            <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
                                <ImageForm setShowModal={setShowModal} userId={userComplete.id} obj={image} setRefetch={setRefetch} />
                            </Modal>
                        )}
                        {modalType === ModalType.Edit && userComplete && (
                            <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static" className="modal-lg">
                                <UserCompleteForm setShowModal={setShowModal} userComplete={userComplete} modalType={modalType} setRefetch={setRefetch} />
                            </Modal>
                        )}
                    </Row>
                </>

            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UserProfile;
