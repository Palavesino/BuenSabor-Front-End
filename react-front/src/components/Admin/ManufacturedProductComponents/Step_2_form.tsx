// Importaciones de componentes, funciones y modelos
import { MproductXRecipe } from "../../../Interfaces/ManufacturedProduct";
import { FormikProps } from "formik";
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
interface Step2Props {
  previousStep: () => void;//Una función que retrocede al anterior paso del formulario.
  nextStep: () => void;//Una función que avanza al siguiente paso del formulario.
  formik: FormikProps<MproductXRecipe>;// Proporciona acceso a las funciones y estados de Formik para manejar el estado del formulario.
}
/*
 El componente Step_2_form es una parte de un formulario más grande y se utiliza 
 como el segundo paso en la creación de la Receta de un Producto Manufacturado. 
 */
const Step_2_form: React.FC<Step2Props> = ({ formik, previousStep, nextStep }) => {
  return (
    <>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Denominación</Form.Label>
            <Form.Control
              name="recipe.denomination"
              type="text"
              value={formik.values.recipe.denomination || ""}
              onChange={formik.handleChange}
              isInvalid={Boolean(
                formik.errors.recipe?.denomination && formik.touched.recipe?.denomination
              )}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.recipe?.denomination}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              name="recipe.description"
              value={formik.values.recipe.description || ""}
              onChange={formik.handleChange}
              isInvalid={Boolean(
                formik.errors.recipe?.description && formik.touched.recipe?.description
              )}
              rows={4} // You can adjust the number of visible rows as needed
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.recipe?.description}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Modal.Footer className="mt-4">
        <Button onClick={previousStep}>Previous</Button>
        <Button onClick={nextStep}>Next</Button>
      </Modal.Footer>
    </>

  );
};

export default Step_2_form;
