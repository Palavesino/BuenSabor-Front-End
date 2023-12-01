import { FormikProps } from "formik";
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Recipe } from "../../../Models/ManufacturedProduct";
import {TiDelete } from "react-icons/ti";
import "./Step_2_recipeForm.css";
interface Step2Props {
  previousStep: () => void;
  formik: FormikProps<Recipe>;
}

const Step_2_recipeForm: React.FC<Step2Props> = ({ formik, previousStep }) => {
  const [step, setStep] = useState("");
  const addStep = () => {
    if (step) {
      const currentSteps = formik.values.step || []; 
      // Add the current step to the steps array
      const updatedSteps = [...currentSteps, step];  
      formik.setFieldValue("step", updatedSteps); 
      // Clear the step input after adding it to the steps array
      setStep("");
    }
  };
  const removeStep = (index:number) => {
    const updatedSteps = [...formik.values.step];
    updatedSteps.splice(index, 1); // Eliminar el elemento en el índice dado
    formik.setFieldValue("step", updatedSteps);
  };
  

  return (
    <>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Step</Form.Label>
            <Form.Control
              name="step"
              type="text"
              value={step}
              onChange={(e) => setStep(e.target.value)}
              isInvalid={Boolean(
                formik.errors.step &&
                  formik.touched.step
              )}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.step}
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
            {formik.values.step.map((st, index) => (
               <div key={index} className="list-item">
               <div className="text-item">
                 <li>{st}</li>
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
