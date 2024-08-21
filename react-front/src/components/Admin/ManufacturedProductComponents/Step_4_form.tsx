import { FormikProps } from "formik";
import { Button, Col, Form, Row, Modal, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { MproductXRecipe } from "../../../Interfaces/ManufacturedProduct";
import { TiDelete } from "react-icons/ti";
import "./Step_4_form.css";
import { Ingredient } from "../../../Interfaces/Ingredient";
import { useGenericGet } from "../../../Services/useGenericGet";
interface Step4Props {
  previousStep: () => void;//Una función que retrocede al anterior paso del formulario.
  nextStep: () => void;//Una función que avanza al siguiente paso del formulario.
  formik: FormikProps<MproductXRecipe>;// Proporciona acceso a las funciones y estados de Formik para manejar el estado del formulario.
}
/*
 El componente Step_4_form es una parte de un formulario más grande y se utiliza 
 como el 4to paso en la creación de los Ingredientes a utilizar de la Receta de un Producto Manufacturado. 
 */
const Step_4_form: React.FC<Step4Props> = ({ formik, previousStep, nextStep }) => {
  const [ingredientId, setIngredientId] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const data = useGenericGet<Ingredient>(
    "/api/ingredients/all",
    "ingredients"
  )
  // Obtienelos ingredientes desde la API cuando se renderiza la página
  useEffect(() => {
    if (data && data.length > 0) {
      setIngredients(data);
    }
  }, [data]);
  const addIngredient = () => {
    const selectedIngredient = ingredients.find(
      (ingredient) => ingredient.id === parseInt(ingredientId, 10)
    );

    if (!selectedIngredient) return;

    const currentIngredients = formik.values.recipe.ingredients || [];
    const isDuplicate = currentIngredients.some(
      (item) => item.ingredient.id === selectedIngredient.id
    );

    if (isDuplicate) {
      alert("El ingrediente ya está en la lista.");
      return;
    }

    const updatedIngredients = [
      ...currentIngredients,
      { ingredient: selectedIngredient, quantity: 0 },
    ];

    formik.setFieldValue("recipe.ingredients", updatedIngredients);
    setIngredientId("");
  };
  // Función para eliminar un Ingrediente de la lista de Ingredientes en el formulario
  const removeIngredient = (index: number) => {
    const updatedIngredient = [...formik.values.recipe.ingredients];
    updatedIngredient.splice(index, 1);
    formik.setFieldValue("recipe.ingredients", updatedIngredient);
  };
  const handleQuantityChange = (index: number, value: number) => {
    const updatedIngredients = [...formik.values.recipe.ingredients];
    updatedIngredients[index].quantity = value;
    formik.setFieldValue("recipe.ingredients", updatedIngredients);
  };


  // Renderizado del componente
  return (
    <>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Ingrediente</Form.Label>
            <Form.Control
              name="recipe.ingredients"
              as="select"
              value={ingredientId || ""}
              onChange={(e) => setIngredientId(e.target.value)}
              isInvalid={
                formik.touched.recipe?.ingredients &&
                !!formik.errors.recipe?.ingredients
              }
            >
              <option value={0}>Seleccionar</option>
              {ingredients.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.denomination}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {formik.errors.recipe?.ingredients ? (
                'Debe haber al menos 3 ingredientes en la receta'
              ) : null}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group>
            <Button onClick={addIngredient} className="button-add">Add</Button>
          </Form.Group>
        </Col>
      </Row>
      <Form.Label className="title">Ingredient List</Form.Label>
      <Row className="mt-4">
        <Col>
          <div className="table-ingredients-container">
            <Table bordered responsive >
              <thead>
                <tr>
                  <th className="td-denomination">Denominación</th>
                  <th className="td-unit">Unidad de Medida</th>
                  <th className="td-quantity">Cantidad</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {formik.values.recipe.ingredients.map((ingredientXQuantity, index) => (
                  <tr key={index}>
                    <td>{ingredientXQuantity.ingredient.denomination}</td>
                    <td>{ingredientXQuantity.ingredient.unit}</td>
                    <td>
                      <Form.Control
                        type="number"
                        value={ingredientXQuantity.quantity || 0}
                        onChange={(e) => handleQuantityChange(index, parseFloat(e.target.value))}
                        min="0"
                      />
                    </td>
                    <td className="td-button-delete">
                      <TiDelete onClick={() => removeIngredient(index)} className="button-delete-ingredient" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      <Modal.Footer className="mt-4">
        <Button onClick={previousStep}>Previous</Button>
        <Button onClick={nextStep}>Next</Button>
      </Modal.Footer>
    </>
  );
};

export default Step_4_form