// Importaciones de componentes, funciones y modelos
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useGenericPost } from "../../../Services/useGenericPost";
import { useGenericPut } from "../../../Services/useGenericPut";
import { useGenericChangeStatus } from "../../../Services/useGenericChangeStatus";
import { ModalType } from "../../Enum/ModalType";
import { Product } from "../../../Interfaces/Product";
import { Category } from "../../../Interfaces/Category";
import { useGenericGet } from "../../../Services/useGenericGet";
interface ProductModalProps {
  show: boolean; // Indica si el modal debe mostrarse o no
  onHide: () => void; // Función que se ejecuta cuando el modal se cierra
  title: string; // Título del modal
  product: Product; // Producto actual que se está editando
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>; // Función para actualizar el estado y volver a obtener los datos después de realizar una acción en el modal
  modalType: ModalType; // Tipo de modal, indica si es para editar, crear o cambiar el estado de una categoría
  state: boolean; // Estado actual del Producto
}

/*
  El componente ProductForm proporciona la funcionalidad necesaria 
  para editar, crear y cambiar el estado de un producto, interactuando con 
  la API y utilizando validación de formularios.
*/
const ProductForm: React.FC<ProductModalProps> = ({
  show,
  onHide,
  title,
  product,
  setRefetch,
  modalType,
  state,
}) => {
  const [categories, setCategories] = useState<Category[]>([]); // Almacena las categorías obtenidas de la API
  const genericPost = useGenericPost(); // Hook personalizado para realizar una petición POST genérica a la API
  const genericPut = useGenericPut(); // Hook personalizado para realizar una petición PUT genérica a la API
  const updateProductStatus = useGenericChangeStatus(); // Hook personalizado para actualizar el estado de un Producto
  const data = useGenericGet<Category>(
    "/api/categories/filter/unlocked/type/P",
    "Product Categories"
  );

  // Obtiene las categorías desde la API cuando renderice la pág
  useEffect(() => {
    setCategories(data);
  }, [data]);

  // Maneja la lógica de guardar o actualizar  un producto
  const handleSaveUpdate = async (product: Product) => {
    const isNew = product.id === 0;
    if (!isNew) {
      await genericPut<Product>("/api/products/update", product.id, product);
    } else {
      await genericPost<Product>("/api/products/save", product);
    }
    setRefetch(true);
    onHide();
  };

  // Maneja el cambio de estado de un producto
  const handleStateProducts = async () => {
    const id = product.id;
    if (!state) {
      await updateProductStatus(id, "/api/products/block");
    } else {
      await updateProductStatus(id, "/api/products/unlock");
    }
    setRefetch(true);
    onHide();
  };
  // Define el esquema de validación del formulario
  const validationSchema = () => {
    return Yup.object().shape({
      id: Yup.number().integer().min(0),
      denomination: Yup.string().required("La denominación es requerida"),
      productCategoryID: Yup.number()
        .integer()
        .moreThan(0, "Selecciona una categoría")
        .required("La categoría es requerido"),
      minStock: Yup.number()
        .integer()
        .min(0)
        .required("El Stock Mínimo es requerido"),
      actualStock: Yup.number()
        .integer()
        .min(
          Yup.ref("minStock"),
          "El Stock Actual no puede ser menor al Stock Mínimo"
        )
        .required("El Stock Actual es requerido"),
      urlImage: Yup.string().required("La URL de la Imagen es requerida"),
      description: Yup.string().required("La Descripción es requerida"),
    });
  };
  // Configuración y gestión del formulario con Formik
  const formik = useFormik({
    initialValues: product,
    validationSchema: validationSchema(),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (obj: Product) => handleSaveUpdate(obj),
  });

  // Renderizado del componente
  return (
    <>
      {modalType === ModalType.ChangeStatus &&
        state !== product.availability && (
          <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                ¿Está seguro que desea Dar de {title} el estado del Producto?
                <br /> <strong>{product.denomination}</strong>?
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                Cancelar
              </Button>
              <Button
                variant={state ? "success" : "danger"}
                onClick={handleStateProducts}
              >
                Guardar
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      {modalType !== ModalType.ChangeStatus && (
        <Modal
          show={show}
          onHide={onHide}
          centered
          backdrop="static"
          className="modal-xl modal-form"
        >
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={formik.handleSubmit}>
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
                        formik.errors.denomination &&
                        formik.touched.denomination
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
                    <Form.Label>Stock Mínimo</Form.Label>
                    <Form.Control
                      name="minStock"
                      type="number"
                      value={formik.values.minStock || ""}
                      onChange={formik.handleChange}
                      isInvalid={Boolean(
                        formik.errors.minStock && formik.touched.minStock
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.minStock}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Stock Actual</Form.Label>
                    <Form.Control
                      name="actualStock"
                      type="number"
                      value={formik.values.actualStock || ""}
                      onChange={formik.handleChange}
                      isInvalid={Boolean(
                        formik.errors.actualStock && formik.touched.actualStock
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.actualStock}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group>
                    <Form.Label>Categoría</Form.Label>
                    <Form.Select
                      name="productCategoryID"
                      value={formik.values.productCategoryID || ""}
                      onChange={formik.handleChange}
                      isInvalid={
                        formik.touched.productCategoryID &&
                        !!formik.errors.productCategoryID
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
                      {formik.errors.productCategoryID}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>URL de la Imagen</Form.Label>
                    <Form.Control
                      name="urlImage"
                      type="text"
                      value={formik.values.urlImage || ""}
                      onChange={formik.handleChange}
                      isInvalid={Boolean(
                        formik.errors.urlImage && formik.touched.urlImage
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.urlImage}
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
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default ProductForm;
