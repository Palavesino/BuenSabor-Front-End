
import { FormikProps } from "formik";
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { useState } from "react";
import { MproductXRecipe } from "../../../Interfaces/ManufacturedProduct";
import { TiDelete } from "react-icons/ti";
import "./Step_3_form.css";
interface Step3Props {
    previousStep: () => void;//Una función que retrocede al anterior paso del formulario.
    formik: FormikProps<MproductXRecipe>;// Proporciona acceso a las funciones y estados de Formik para manejar el estado del formulario.
}
/*
 El componente Step_3_form es una parte de un formulario más grande y se utiliza 
 como el tercer paso en la creación de los Pasos de la Receta de un Producto Manufacturado. 
 */
const Step_3_form: React.FC<Step3Props> = ({ formik, previousStep }) => {
    // Estado local para almacenar la descripción del paso actual
    const [step, setStep] = useState<string>("");

    // Función para agregar el paso actual a la lista de pasos en el formulario
    const addStep = () => {
        if (step) {
            const currentSteps = formik.values.recipe.steps || [];
            // Agregar el paso actual al array de pasos
            const updatedSteps = [...currentSteps, { description: step }];
            // Actualizar el valor del campo en Formik con los pasos actualizados
            formik.setFieldValue("recipe.steps", updatedSteps);
            // Limpiar la entrada del paso después de agregarlo al array de pasos
            setStep("");
        }
    };

    // Función para eliminar un paso de la lista de pasos en el formulario
    const removeStep = (index: number) => {
        const updatedSteps = [...formik.values.recipe.steps];
        updatedSteps.splice(index, 1); // Eliminar el elemento en el índice dado
        formik.setFieldValue("recipe.steps", updatedSteps);
    };

    // Renderizado del componente
    return (
        <>
            <Row>
                <Col>
                    <Form.Group>
                        <Form.Label>Step</Form.Label>
                        <Form.Control
                            name="recipe.steps"
                            type="text"
                            value={step}
                            onChange={(e) => setStep(e.target.value)}
                            isInvalid={Boolean(
                                formik.errors.recipe?.steps &&
                                formik.touched.recipe?.steps
                            )}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.recipe?.steps ? (
                                'Debe haber al menos 3 pasos en la receta'
                            ) : null}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group>
                        <Button onClick={addStep} className="button-add">Add</Button>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Form.Label className="title">Step List</Form.Label>
                <Col>
                    <div className="div-List">

                        <ul>
                            {formik.values.recipe.steps.map((st, index) => (
                                <div key={index} className="list-item">
                                    <div className="text-item">
                                        <li>{st.description}</li>
                                    </div>
                                    <div>
                                        <TiDelete onClick={() => removeStep(index)} className="button-delete" />
                                    </div>
                                </div>

                            ))}
                        </ul>
                    </div>
                </Col>
            </Row>

            <Modal.Footer className="mt-4">
                <Button onClick={previousStep}>Previous</Button>
                <Button variant="success" type="submit">
                    Guardar
                </Button>
            </Modal.Footer>
        </>
    );
};

export default Step_3_form;