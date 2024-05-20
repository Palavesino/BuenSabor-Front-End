import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { usePostImage } from "../../../Util/PostImage";
import { Image } from "../../../Interfaces/Image";
import * as Yup from "yup";

interface FormValues {
    file: File | null;
}

interface ImageFormProps {
    userId: number;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
    obj: Image | undefined;
}


const ImageForm: React.FC<ImageFormProps> = ({ userId, setShowModal, obj, setRefetch }) => {
    const changeUserImage = usePostImage();
    //const [image,Setimage] = useState<String>("");

    const handleSave = async (newImage: FormValues) => {
        const dto: Image = {
            id: 0,
            name: "",
            route: "",
            type: "",
            size: 0,
            productId: null,
            userId: userId,
            manufacturedProductId: null,
            base64: "",
        };
        if (obj) {
            await changeUserImage(obj, newImage.file ? newImage.file : undefined, true, true);
        } else {

            await changeUserImage(dto, newImage.file ? newImage.file : undefined, false, true)
        }
        setShowModal(false);
        setRefetch(true);
    }

    const ValidationSchema = Yup.object().shape({
        file: Yup.mixed().nullable().required("La Imagen es requerida").test(
            "FILE_SIZE", "El archivo subido es demasiado grande.",
            (value) => !value || (value && (value as File).size <= 1024 * 1024 * 10) // 10 MB en bytes
        ).test(
            "FILE_FORMAT",
            "El archivo subido tiene un formato no compatible.",
            (value) => !value || (value && ["image/jpg", "image/jpeg", "image/png"].includes((value as File).type))
        ),
    });
    // Formik Password
    const formik = useFormik({
        initialValues: {
            file: null, // inicializado como null
        },
        validationSchema: ValidationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (values: FormValues) => handleSave(values),
    });

    return (
        <>
            <Modal.Header className="modal-header" closeButton>
                <Modal.Title className="modal-title">Editar Imagen</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={formik.handleSubmit}>
                    <Form.Group className="mb-3" >
                        <Form.Label>Imagen</Form.Label>
                        <Form.Control
                            name="file"
                            type="file"
                            onChange={(event) => {
                                const input = event.target as HTMLInputElement;
                                const file = input.files?.[0];
                                formik.setFieldValue("file", file);
                            }}
                            isInvalid={Boolean(
                                formik.errors.file && formik.touched.file
                            )}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.file}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Modal.Footer className="mt-4">
                        <Button variant="primary" type="submit" disabled={!formik.isValid}>
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </>
    )
}
export default ImageForm