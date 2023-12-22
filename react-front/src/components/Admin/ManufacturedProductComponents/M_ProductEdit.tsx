// Importaciones de componentes, funciones y modelos
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { FormikProps } from "formik";
import { useEffect, useState } from "react";
import { Category } from "../../../Models/Category";
import { useGenericGet } from "../../../Services/useGenericGet";
import { MproductXRecipe } from "../../../Models/ManufacturedProduct";
interface M_ProductEditProps {
  onHide: () => void; // Función que se ejecuta cuando el modal se cierra
  formik: FormikProps<MproductXRecipe>;// Proporciona acceso a las funciones y estados de Formik para manejar el estado del formulario.

}
/*
 El componente M_ProductEdit es una parte de un formulario más grande y se utiliza 
 como el  paso en la edición de un Producto Manufacturado. 
 */
const M_ProductEdit: React.FC<M_ProductEditProps> = ({
  onHide, formik
}) => {
  const [categories, setCategories] = useState<Category[]>([]);// Almacena las categorías obtenidas de la API
  // Hook personalizado para realizar una petición GET genérica a la API
  const data = useGenericGet<Category>(
    "/api/categories/filter/unlocked/type/M",
    "Product Categories"
  );

  // Obtiene las categorías desde la API cuando renderice la pág
  useEffect(() => {
    setCategories(data);
  }, [data]);
  return (
    <>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Denominación</Form.Label>
            <Form.Control
              name="manufacturedProduct.denomination"
              type="text"
              value={formik.values.manufacturedProduct.denomination || ""}
              onChange={formik.handleChange}
              isInvalid={Boolean(
                formik.errors.manufacturedProduct?.denomination &&
                formik.touched.manufacturedProduct?.denomination
              )}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.manufacturedProduct?.denomination}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="manufacturedProduct.manufacturedProductCategoryID"
              value={formik.values.manufacturedProduct.manufacturedProductCategoryID || ""}
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.manufacturedProduct?.manufacturedProductCategoryID &&
                !!formik.errors.manufacturedProduct?.manufacturedProductCategoryID
              }
            >
              <option value="">Seleccionar</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.denomination}
                </option>
              ))}
            </Form.Select>

            <Form.Control.Feedback type="invalid">
              {formik.errors.manufacturedProduct?.manufacturedProductCategoryID}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Tiempo de preparado (HH:MM:SS)</Form.Label>
            <Form.Control
              name="manufacturedProduct.cookingTime"
              type="time" // Utiliza el tipo "time" para campos de tiempo
              step={1}
              value={formik.values.manufacturedProduct.cookingTime || ""}
              onChange={formik.handleChange}
              isInvalid={Boolean(
                formik.errors.manufacturedProduct?.cookingTime &&
                formik.touched.manufacturedProduct?.cookingTime
              )}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.manufacturedProduct?.cookingTime}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>URL de la Imagen</Form.Label>
            <Form.Control
              name="manufacturedProduct.urlImage"
              type="text"
              value={formik.values.manufacturedProduct.urlImage || ""}
              onChange={formik.handleChange}
              isInvalid={Boolean(
                formik.errors.manufacturedProduct?.urlImage &&
                formik.touched.manufacturedProduct?.urlImage
              )}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.manufacturedProduct?.urlImage}
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
              name="manufacturedProduct.description"
              value={formik.values.manufacturedProduct.description || ""}
              onChange={formik.handleChange}
              isInvalid={Boolean(
                formik.errors.manufacturedProduct?.description &&
                formik.touched.manufacturedProduct?.description
              )}
              rows={4} // You can adjust the number of visible rows as needed
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.manufacturedProduct?.description}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Modal.Footer className="mt-4">
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button
          variant="success"
          type="submit"
          disabled={!formik.isValid}
        >
          Guardar
        </Button>
      </Modal.Footer>

    </>
  );
};

export default M_ProductEdit;
