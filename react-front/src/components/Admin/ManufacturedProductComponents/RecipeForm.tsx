import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ManufacturedProduct, Recipe } from "../../../Models/ManufacturedProduct";
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import Step_1_recipeForm from "./Step_1_recipeForm";
import Step_2_recipeForm from "./Step_2_recipeForm";
interface RecipeFormProps {
  show: boolean; // Indica si el modal debe mostrarse o no
  //onHide: () => void; // Función que se ejecuta cuando el modal se cierra
  //Mproduct: ManufacturedProduct; // Producto Manufacturado actual que se está editando
}
const RecipeForm : React.FC<RecipeFormProps> = ({
  show
}) => {
  const [step, SetStep] = useState(1);
  const [recipe, SetRecipe] = useState<Recipe>({
    id: 0,
    denomination: "",
    description: "",
    step: [],
  });
   // Define el esquema de validación del formulario
   const validationSchema = () => {
    return Yup.object().shape({
      id: Yup.number().integer().min(0),
      denomination: Yup.string().required("La denominación es requerida"),
      description: Yup.string().required("La descripción es requerida"),
      step: Yup.array()
      .of(Yup.string().required())
      .min(3, "Debe haber al menos 3 pasos en la receta"),
    });
  };

  // Configuración y gestión del formulario con Formik
  const formik = useFormik({
    initialValues: recipe,
    validationSchema: validationSchema(),
    validateOnChange: true,
    validateOnBlur: true,
    //onSubmit: (obj: ManufacturedProduct) => handleSaveUpdate(obj),
    onSubmit: (obj: Recipe) => console.log(JSON.stringify(obj, null, 2)),
  });
  // Render the component based on the current step
  let componentToRender;
  let title;
  switch (step) {
    case 1:
      title = "Receta De la Abuela";
      componentToRender = (
        <Step_1_recipeForm nextStep={() => SetStep(step + 1)} formik={formik} />
      );
      break;
    case 2:
      title = "STEPS";
      componentToRender = (
        <Step_2_recipeForm
          formik={formik}
          previousStep={() => SetStep(step - 1)}
        />
      );
      break;
    case 3:
      componentToRender = (
        <h1 className="display-1 text-success text-center">Exito!</h1>
      );
      break;
    default:
      componentToRender = <div>Error</div>;
  }

  return (
    <>
      <Modal
        show={show}
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
    </>
  );
};

export default RecipeForm;
