import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ManufacturedProduct, MproductXRecipe } from "../../../Interfaces/ManufacturedProduct";
import Step_1_form from "./Step_1_form";
import Step_2_form from "./Step_2_form";
import { Button, Form, Modal } from "react-bootstrap";
import { ModalType } from "../../Enum/ModalType";
import Step_3_form from "./Step_3_form";
import { useGenericChangeStatus } from "../../../Services/useGenericChangeStatus";
import GetRecipeForm from "./hooks/use-recipeForm";
import M_ProductEdit from "./M_ProductEdit";

interface MproductModalProps {
    show: boolean; // Indica si el modal debe mostrarse o no
    onHide: () => void; // Función que se ejecuta cuando el modal se cierra
    title: string; // Título del modal
    Mproduct: ManufacturedProduct; // Producto Manufacturado actual que se está editando
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>; // Función para actualizar el estado y volver a obtener los datos después de realizar una acción en el modal
    modalType: ModalType; // Tipo de modal, indica si es para editar, crear o cambiar el estado de un Producto Manufacturado
    state: boolean; // Estado actual del Producto Manufacturado
}

/*
El componente MP_Form permite editar, crear y cambiar el estado de un Producto Manufacturado. 
Utiliza el formulario Formik para gestionar la entrada del usuario, tiene tres pasos que guían al usuario 
a través de la creación de una receta y utiliza validación Yup para garantizar datos válidos antes de enviarlos a la API.
Además, maneja la lógica de actualización y cambio de estado del Producto Manufacturado.
*/
const MP_Form: React.FC<MproductModalProps> = ({
    show,
    onHide,
    title,
    Mproduct,
    setRefetch,
    modalType,
    state,
}) => {

    // Estado para gestionar el paso actual del formulario
    const [step, SetStep] = useState(1);

    // Hook personalizado para actualizar el estado de un Producto Manufacturado
    const updateMproductStatus = useGenericChangeStatus();

    // Hook personalizado para obtener funciones relacionadas con el formulario de receta
    const postXput = GetRecipeForm();

    // Objeto que representa el estado inicial de la receta y el producto manufacturado
    let recipeXmproduct: MproductXRecipe = {
        manufacturedProduct: Mproduct,
        recipe: {
            id: 0,
            manufacturedProductId: 0,
            denomination: "",
            description: "",
            steps: [],
        },
        image: {
            id: 0,
            name: "",
            route: "",
            type: "",
            size: 0,
            productId: null,
            userId: null,
            manufacturedProductId: Mproduct.id,
            base64: "",
        },
        file: null,
    };

    // Maneja la lógica de guardar o actualizar un Producto Manufacturado
    const handleSaveUpdate = async (Mproduct: MproductXRecipe) => {
        await postXput("/api/manufactured-products/save", "/api/manufactured-products/update", Mproduct);
        onHide();
        setRefetch(true);
    };

    // Maneja el cambio de estado de un Producto Manufacturado
    const handleStateMproducts = async () => {
        const id = Mproduct.id;
        if (!state) {
            await updateMproductStatus(id, "/api/manufactured-products/block");
        } else {
            await updateMproductStatus(id, "/api/manufactured-products/unlock");
        }
        setRefetch(true);
        onHide();
    };

    // Define el esquema de validación del formulario con Yup
    const validationSchema = () => {
        return Yup.object().shape({
            manufacturedProduct: Yup.object().shape({
                id: Yup.number().integer().min(0),
                denomination: Yup.string().required("La denominación es requerida"),
                manufacturedProductCategoryID: Yup.number()
                    .integer()
                    .moreThan(0, "Selecciona una categoría")
                    .required("La categoría es requerida"),
                description: Yup.string().required("La Descripción es requerida"),
                cookingTime: Yup.string().required("El tiempo de preparado es requerido"),
            }),
            recipe:
                Yup.object().when('manufacturedProduct.id', {
                    is: (manufacturedProductId: number) => {
                        return manufacturedProductId === 0;
                    },
                    then: () =>
                        Yup.object({
                            id: Yup.number().integer().min(0),
                            denomination: Yup.string().required("La denominación es requerida"),
                            description: Yup.string().required("La descripción es requerida"),
                            steps: Yup.array()
                                .of(
                                    Yup.object().shape({
                                        description: Yup.string().required("La descripción del paso es requerida"),
                                    })
                                )
                                .min(3, 'Debe haber al menos 3 pasos en la receta'),
                        }),
                }),
            file: Yup.mixed().when("manufacturedProduct.id", (id: unknown, schema) => {
                if (Number(id) === 0) {
                    return schema.required("La Imagen es requerida").test(
                        "FILE_SIZE",
                        "El archivo subido es demasiado grande.",
                        (value) => !value || (value && (value as File).size <= 1024 * 1024 * 10) 
                    ).test(
                        "FILE_FORMAT",
                        "El archivo subido tiene un formato no compatible.",
                        (value) => !value || (value && ["image/jpg", "image/jpeg", "image/png"].includes((value as File).type))
                    );
                } else {
                    return schema.nullable().notRequired().test(
                        "FILE_SIZE",
                        "El archivo subido es demasiado grande.",
                        (value) => !value || (value && (value as File).size <= 1024 * 1024 * 10)
                    ).test(
                        "FILE_FORMAT",
                        "El archivo subido tiene un formato no compatible.",
                        (value) => !value || (value && ["image/jpg", "image/jpeg", "image/png"].includes((value as File).type))
                    );
                }
            })
        })
    };

    // Configuración y gestión del formulario con Formik
    const formik = useFormik({
        initialValues: recipeXmproduct,
        validationSchema: validationSchema(),
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (obj: MproductXRecipe) => handleSaveUpdate(obj),
    });
    // Renderiza el componente correspondiente al paso actual del formulario
    let componentToRender;
    switch (step) {
        case 1:
            componentToRender = (
                <Step_1_form nextStep={() => SetStep(step + 1)} formik={formik} />
            );
            break;
        case 2:
            title = "Nueva Receta";
            componentToRender = (
                <Step_2_form formik={formik} previousStep={() => SetStep(step - 1)} nextStep={() => SetStep(step + 1)} />
            );
            break;
        case 3:
            title = "Lista de Pasos";
            componentToRender = (
                <Step_3_form formik={formik} previousStep={() => SetStep(step - 1)} />
            );
            break;
        default:
            componentToRender = <div>Error</div>;
    }
    // Renderizado del componente
    return (
        <>
            {modalType === ModalType.ChangeStatus &&
                state !== Mproduct.availability && (
                    <Modal show={show} onHide={onHide} centered backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title>{title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>
                                ¿Está seguro que desea Dar de {title} el estado del Producto?
                                <br /> <strong>{Mproduct.denomination}</strong>?
                            </p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={onHide}>
                                Cancelar
                            </Button>
                            <Button
                                variant={state ? "success" : "danger"}
                                onClick={handleStateMproducts}
                            >
                                Guardar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
            {modalType !== ModalType.ChangeStatus && modalType !== ModalType.Edit && (
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
                        <Form onSubmit={formik.handleSubmit}>{componentToRender}</Form>
                    </Modal.Body>
                </Modal>)}
            {modalType !== ModalType.ChangeStatus && modalType !== ModalType.Create && (
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
                            <M_ProductEdit onHide={onHide} formik={formik} />
                        </Form>
                    </Modal.Body>
                </Modal>)}
        </>
    );
};

export default MP_Form;