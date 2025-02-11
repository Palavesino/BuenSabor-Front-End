// Importaciones de componentes, funciones y modelos
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { FormikProps } from "formik";
import { useEffect, useState } from "react";
import { Category } from "../../../Interfaces/Category";
import { useGenericGet } from "../../../Services/useGenericGet";
import { MproductXRecipe } from "../../../Interfaces/ManufacturedProduct";
import { useGetImageId } from "../../../Util/useGetImageId";
import { Image } from "../../../Interfaces/Image";
import { useGenericGetXID } from "../../../Services/useGenericGetXID";
import { Price } from "../../../Interfaces/Price";
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
  const [image, setImage] = useState<Image>(); // Almacena la imagen obtenida de la API
  const getImage = useGetImageId();
  // Hook personalizado para realizar una petición GET genérica a la API
  const data = useGenericGet<Category>(
    "/api/categories/filter/unlocked/type/M",
    "Product Categories"
  );
  const data2 = useGenericGetXID<Price>(
    `/api/price/2`, formik.values.manufacturedProduct.id
  );

  // Obtiene las categorías desde la API cuando renderice la pág
  useEffect(() => {
    if (data.length > 0 && data2.id) {
      formik.setFieldValue("manufacturedProduct.price", data2);
      setCategories(data);
      // Obtener la imagen cuando se obtengan las categorías
      const fetchImage = async () => {
        const imageData = await getImage(formik.values.manufacturedProduct.id, "M");
        setImage(imageData);
      };
      fetchImage();
    }
  }, [data, data2]);



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
            <Form.Label>Precio de Costo</Form.Label>
            <Form.Control
              name="manufacturedProduct.price.costPrice"
              type="number"
              value={formik.values.manufacturedProduct.price?.costPrice || ""}
              onChange={formik.handleChange}
              isInvalid={Boolean(
                formik.errors.manufacturedProduct?.price?.costPrice &&
                formik.touched.manufacturedProduct?.price?.costPrice
              )}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.manufacturedProduct?.price?.costPrice}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Precio de Venta</Form.Label>
            <Form.Control
              name="manufacturedProduct.price.sellPrice"
              type="number"
              value={formik.values.manufacturedProduct.price?.sellPrice || ""}
              onChange={formik.handleChange}
              isInvalid={Boolean(
                formik.errors.manufacturedProduct?.price?.sellPrice &&
                formik.touched.manufacturedProduct?.price?.sellPrice
              )}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.manufacturedProduct?.price?.sellPrice}
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
              onChange={(e) => {
                formik.handleChange(e);
              }}
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
            <Form.Label>Imagen {!formik.values.file && image?.name && (` (${image?.name})`)}</Form.Label>
            <Form.Control
              style={
                !formik.values.file ? { width: '10rem', height: '2rem' } : undefined
              }
              name="file"
              type="file"
              onChange={(event) => {
                const input = event.target as HTMLInputElement;
                const file = input.files?.[0];
                formik.setFieldValue("file", file);
              }}
              isInvalid={Boolean(formik.errors.file && formik.touched.file)}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.file}
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
              rows={4}
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

