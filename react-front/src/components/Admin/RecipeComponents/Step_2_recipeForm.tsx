import { FormikProps } from "formik";
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { useState } from "react";
import { TiDelete } from "react-icons/ti";
import "../ManufacturedProductComponents/Step_3_form.css";
import { Recipe } from "../../../Interfaces/Recipe";
interface Step_2_recipeFormProps {
    previousStep: () => void;//Una función que retrocede al anterior paso del formulario.
    formik: FormikProps<Recipe>;// Proporciona acceso a las funciones y estados de Formik para manejar el estado del formulario.
}
/*
 El componente Step_2_recipeForm es una parte de un formulario más grande y se utiliza 
 como el segundo paso en la Edicion de los Pasos de la Receta . 
 */
const Step_2_recipeForm: React.FC<Step_2_recipeFormProps> = ({ formik, previousStep }) => {
    const [step, setStep] = useState<string>("");
    const addStep = () => {
        if (step) {
            const currentSteps = formik.values.steps || [];
            // Agregar el paso actual al array de pasos
            const updatedSteps = [
                ...currentSteps,
                { description: step, stepNumber: currentSteps.length + 1 }
            ];
            // Actualizar el valor del campo en Formik con los pasos actualizados
            formik.setFieldValue("steps", updatedSteps);
            // Limpiar la entrada del paso después de agregarlo al array de pasos
            setStep("");
        }
    };
    const removeStep = (index: number) => {
        const updatedSteps = [...formik.values.steps];

        // Eliminar el paso en el índice dado
        updatedSteps.splice(index, 1);

        // Recalcular los stepNumber para los pasos restantes
        const recalculatedSteps = updatedSteps.map((step, i) => ({
            ...step,
            stepNumber: i + 1
        }));

        formik.setFieldValue("steps", recalculatedSteps);
    };


    return (
        <>
            <Row>
                <Col>
                    <Form.Group>
                        <Form.Label>Step</Form.Label>
                        <Form.Control
                            name="steps"
                            type="text"
                            value={step}
                            onChange={(e) => setStep(e.target.value)}
                            isInvalid={Boolean(
                                formik.errors.steps &&
                                formik.touched.steps
                            )}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.steps ? (
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
                            {formik.values.steps.map((st, index) => (
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

export default Step_2_recipeForm;