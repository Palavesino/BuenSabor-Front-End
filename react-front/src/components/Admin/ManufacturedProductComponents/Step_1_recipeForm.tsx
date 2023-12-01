import { FormikProps } from "formik";
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Recipe } from "../../../Models/ManufacturedProduct";
interface Step2Props {
  nextStep: () => void;
  formik: FormikProps<Recipe>;
}

const Step_1_recipeForm: React.FC<Step2Props> = ({ formik, nextStep }) => {
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
