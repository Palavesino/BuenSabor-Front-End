// Importaciones de componentes, funciones y modelos
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useGenericChangeStatus } from "../../../Services/useGenericChangeStatus";
import { ModalType } from "../../Enum/ModalType";
import { Product, ProductXStock } from "../../../Interfaces/Product";
import { Category } from "../../../Interfaces/Category";
import { useGenericGet } from "../../../Services/useGenericGet";
import { useGetImageId } from "../../../Util/useGetImageId";
import { Image } from "../../../Interfaces/Image";
import { Price } from "../../../Interfaces/Price";
import { useGenericGetXID } from "../../../Services/useGenericGetXID";
import { validationSchemaProduct } from "../../../Util/YupValidation";
import ProductPostPut from "./hook/use-ProductPostPut";
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
  const [oldImage, setOldImage] = useState<Image>(); // Almacena la imagen obtenida de la API
  const getImage = useGetImageId();// Hook personalizado para realizar una petición GET  a la API
  const postXUpdate = ProductPostPut();
  const updateProductStatus = useGenericChangeStatus(); // Hook personalizado para actualizar el estado de un Producto
  const data = modalType !== ModalType.ChangeStatus ? useGenericGet<Category>(
    "/api/categories/filter/unlocked/type/P",
    "Product Categories"
  ) : null;
  const data2 = modalType === ModalType.Edit ? useGenericGetXID<Price>(
    `/api/price/1`, product.id
  ) : null;

  // Obtiene las categorías desde la API cuando renderice la pág
  useEffect(() => {

    if (data && data.length > 0) {
      setCategories(data);
      if (data2 && Object.keys(data2).length > 0) {
        formik.setFieldValue("product.price", data2);
        const fetchImage = async () => {
          const requestBody: Image = await getImage(formik.values.product.id, "P");
          setOldImage(requestBody)
        };
        fetchImage();
      }

    }
  }, [data, data2]);

  // Maneja la lógica de guardar o actualizar  un producto
  const handleSaveUpdate = async (p: ProductXStock) => {
    onHide();
    await postXUpdate('/api/products/saveComplete', '/api/products/update', p, oldImage)
    setRefetch(true);
  };

  // Maneja el cambio de estado de un producto
  const handleStateProducts = async () => {
    onHide();
    const id = product.id;
    if (!state) {
      await updateProductStatus(id, "/api/products/block");
    } else {
      await updateProductStatus(id, "/api/products/unlock");
    }
    setRefetch(true);
  };

  const requestBody: ProductXStock = {
    product,
    file: null,
    stock: {
      id: 0,
      actualStock: 0,
      minStock: 0,
      ingredientStockID: 0,
      productStockID: null,
      denomination: "",
    }
  };
  // Configuración y gestión del formulario con Formik
  const formik = useFormik({
    initialValues: requestBody,
    validationSchema: validationSchemaProduct(modalType),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (obj: typeof requestBody) => handleSaveUpdate(obj),
  })


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
                      name="product.denomination"
                      type="text"
                      value={formik.values.product?.denomination || ""}
                      onChange={formik.handleChange}
                      isInvalid={Boolean(
                        formik.errors.product?.denomination &&
                        formik.touched.product?.denomination
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.product?.denomination}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Precio de Costo</Form.Label>
                    <Form.Control
                      name="product.price.costPrice"
                      type="number"
                      value={formik.values.product.price?.costPrice || ""}
                      onChange={formik.handleChange}
                      isInvalid={Boolean(
                        formik.errors.product?.price?.costPrice &&
                        formik.touched.product?.price?.costPrice
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.product?.price?.costPrice}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Precio de Venta</Form.Label>
                    <Form.Control
                      name="product.price.sellPrice"
                      type="number"
                      value={formik.values.product.price?.sellPrice || ""}
                      onChange={formik.handleChange}
                      isInvalid={Boolean(
                        formik.errors.product?.price?.sellPrice &&
                        formik.touched.product?.price?.sellPrice
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.product?.price?.sellPrice}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                {modalType !== ModalType.Edit && (
                  <>
                    <Col>
                      <Form.Group>
                        <Form.Label>Stock Mínimo</Form.Label>
                        <Form.Control
                          name="stock.minStock"
                          type="number"
                          value={formik.values.stock?.minStock || ""}
                          onChange={formik.handleChange}
                          isInvalid={Boolean(
                            formik.errors.stock?.minStock && formik.touched.stock?.minStock
                          )}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.stock?.minStock}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Stock Actual</Form.Label>
                        <Form.Control
                          name="stock.actualStock"
                          type="number"
                          value={formik.values.stock?.actualStock || ""}
                          onChange={formik.handleChange}
                          isInvalid={Boolean(
                            formik.errors.stock?.actualStock && formik.touched.stock?.actualStock
                          )}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.stock?.actualStock}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </>
                )}

                <Col sm={6}>
                  <Form.Group>
                    <Form.Label>Categoría</Form.Label>
                    <Form.Select
                      name="product.productCategoryID"
                      value={formik.values.product?.productCategoryID || ""}
                      onChange={formik.handleChange}
                      isInvalid={
                        formik.touched.product?.productCategoryID &&
                        !!formik.errors.product?.productCategoryID
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
                      {formik.errors.product?.productCategoryID}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Imagen {!formik.values.file && oldImage && (` (${oldImage.name})`)}</Form.Label>
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
                      isInvalid={Boolean(
                        formik.errors.file && formik.touched.file
                      )}
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
                      name="product.description"
                      value={formik.values.product?.description || ""}
                      onChange={formik.handleChange}
                      isInvalid={Boolean(
                        formik.errors.product?.description && formik.touched.product?.description
                      )}
                      rows={4} // You can adjust the number of visible rows as needed
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.product?.description}
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
