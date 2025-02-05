import { useState } from "react";
import { useFormik } from "formik";
import { ManufacturedProduct, MproductXRecipe } from "../../../Interfaces/ManufacturedProduct";
import Step_1_form from "./Step_1_form";
import Step_2_form from "./Step_2_form";
import { Button, Form, Modal } from "react-bootstrap";
import { ModalType } from "../../Enum/ModalType";
import Step_3_form from "./Step_3_form";
import { useGenericChangeStatus } from "../../../Services/useGenericChangeStatus";
import GetRecipeForm from "./hooks/use-recipeForm";
import M_ProductEdit from "./M_ProductEdit";
import { validationSchemaManufacturedProduct } from "../../../Util/YupValidation";
import Step_4_form from "./Step_4_form";

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
            ingredientsQuantity: [],
        },
        // image: {
        //     id: 0,
        //     name: "",
        //     relationType: "",
        //     relationId: Mproduct.id,
        // },
        file: null,
    };
    // Maneja la lógica de guardar o actualizar un Producto Manufacturado
    const handleSaveUpdate = async (Mproduct: MproductXRecipe) => {
        onHide();
        await postXput("/api/manufactured-products/saveR", "/api/manufactured-products/update", Mproduct);
        setRefetch(true);
    };

    // Maneja el cambio de estado de un Producto Manufacturado
    const handleStateMproducts = async () => {
        onHide();
        const id = Mproduct.id;
        if (!state) {
            await updateMproductStatus(id, "/api/manufactured-products/block");
        } else {
            await updateMproductStatus(id, "/api/manufactured-products/unlock");
        }
        setRefetch(true);
    };
    // Configuración y gestión del formulario con Formik
    const formik = useFormik({
        initialValues: recipeXmproduct,
        validationSchema: validationSchemaManufacturedProduct(),
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (obj: MproductXRecipe) => handleSaveUpdate(obj),
        // onSubmit: (obj: MproductXRecipe) => {
        //     console.log(JSON.stringify(obj, null, 2));
        // },
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
            title = "Lista de Ingredientes";
            componentToRender = (
                <Step_4_form formik={formik} previousStep={() => SetStep(step - 1)} nextStep={() => SetStep(step + 1)} />
            );
            break;
        case 4:
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