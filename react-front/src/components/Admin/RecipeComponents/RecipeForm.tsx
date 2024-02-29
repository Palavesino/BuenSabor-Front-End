// Importaciones de componentes, funciones y modelos
import { Form, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useGenericPut } from "../../../Services/useGenericPut";
import { ModalType } from "../../Enum/ModalType";
import { Recipe } from "../../../Interfaces/ManufacturedProduct";
import Step_2_recipeForm from "./Step_2_recipeForm";
import Step_1_recipeForm from "./Step_1_recipeForm";
import { useGenericGetXID } from "../../../Services/useGenericGetXID";

interface RecipeFormProps {
  show: boolean; // Indica si el modal debe mostrarse o no
  onHide: () => void; // Función que se ejecuta cuando el modal se cierra
  title: string; // Título del modal
  idRecipe: number; // ID de Receta actual que se está editando
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>; // Función para actualizar el estado y volver a obtener los datos después de realizar una acción en el modal
  modalType: ModalType; // Tipo de modal, indica si es para editar, crear o cambiar el estado de una categoría
}

/*
  El componente RecipeForm proporciona la funcionalidad necesaria 
  para editar una receta, interactuando con 
  la API y utilizando validación de formularios.
*/
const RecipeForm: React.FC<RecipeFormProps> = ({
  show,
  onHide,
  title,
  idRecipe,
  setRefetch,
  modalType,
}) => {
  const [step, SetStep] = useState(1);
  const genericPut = useGenericPut(); // Hook personalizado para realizar una petición PUT genérica a la API
  const [recipe, setRecipe] = useState<Recipe>({
    id: 0,
    manufacturedProductId: 0,
    denomination: " ",
    description: "",
    steps: [],
  });
  // Hook personalizado para realizar una petición Get genérica a la API
  const data = useGenericGetXID<Recipe>(
    "/api/recipes/complete",
    idRecipe
  );

  // Obtiene la Receta desde la API cuando se renderiza la página
  useEffect(() => {
    const fetchData = async () => {
      if (data) {
        setRecipe(data);
        formik.setValues(data); // Resetear el formulario después de actualizar recipe
      }
    };
    fetchData();
  }, [data]);

  // Maneja la lógica de actualizar una Receta
  const handleUpdate = async (recipe: Recipe) => {
    await genericPut<Recipe>(
      "/api/recipes/update",
      recipe.id,
      recipe
    );
    setRefetch(true);
    onHide();
  };

  // Define el esquema de validación del formulario
  const validationSchema = () => {
    return Yup.object().shape({
      id: Yup.number().integer().min(0),
      denomination: Yup.string().required("La denominación es requerida"),
      description: Yup.string().required("La descripción es requerida"),
      steps: Yup.array()
        .of(
          Yup.object().shape({
            description: Yup.string().required(
              "La descripción del paso es requerida"
            ),
          })
        )
        .min(3, 'Debe haber al menos 3 pasos en la receta'),
    });
  };

  // Configuración y gestión del formulario con Formik
  const formik = useFormik({
    initialValues: recipe,
    validationSchema: validationSchema(),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (obj: Recipe) => handleUpdate(obj),
  });
 // Renderiza el componente según el paso actual
  let componentToRender;
  switch (step) {
    case 1:
      title = "Editando Receta";
      componentToRender = (
        <Step_1_recipeForm nextStep={() => SetStep(step + 1)} formik={formik} />
      );
      break;
    case 2:
      title = "Lista de Pasos";
      componentToRender = (
        <Step_2_recipeForm
          formik={formik}
          previousStep={() => SetStep(step - 1)}
        />
      );
      break;
    default:
      componentToRender = <div>Error</div>;
  }

  // Renderizado del componente
  return (
    <>
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
            <Form onSubmit={formik.handleSubmit}>{componentToRender}</Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default RecipeForm;
