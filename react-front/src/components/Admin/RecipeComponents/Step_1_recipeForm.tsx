import { Recipe } from "../../../Models/ManufacturedProduct";
import { FormikProps } from "formik";
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
interface Step_1_recipeFormProps {
  nextStep: () => void;//Una función que avanza al siguiente paso del formulario.
  formik: FormikProps<Recipe>;// Proporciona acceso a las funciones y estados de Formik para manejar el estado del formulario.
}
/*
 El componente Step_1_recipeForm es una parte de un formulario más grande y se utiliza 
 como el primer paso en la Edicion de la Receta. 
 */

const Step_1_recipeForm: React.FC<Step_1_recipeFormProps> = ({ formik,nextStep }) => {
  return (
    <>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Denominación</Form.Label>
            <Form.Control
              name="denomination"
              type="text"
              value={formik.values.denomination || ""}
              onChange={formik.handleChange}
              isInvalid={Boolean(
                formik.errors.denomination && formik.touched.denomination
              )}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.denomination}
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
              name="description"
              value={formik.values.description || ""}
              onChange={formik.handleChange}
              isInvalid={Boolean(
                formik.errors.description && formik.touched.description
              )}
              rows={4} // You can adjust the number of visible rows as needed
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.description}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Modal.Footer className="mt-4">
      <Button onClick={nextStep}>Next</Button>
      </Modal.Footer>
    </>
  
  );
};

export default Step_1_recipeForm;