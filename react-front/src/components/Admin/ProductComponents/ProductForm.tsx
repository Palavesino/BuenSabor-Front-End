// Importaciones de componentes, funciones y modelos
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useGenericPost } from "../../../Services/useGenericPost";
import { useGenericPut } from "../../../Services/useGenericPut";
import { useGenericChangeStatus } from "../../../Services/useGenericChangeStatus";
import { ModalType } from "../../Enum/ModalType";
import { Product } from "../../../Interfaces/Product";
import { Category } from "../../../Interfaces/Category";
import { useGenericGet } from "../../../Services/useGenericGet";
import { usePostImage } from "../../../Util/PostImage";
import { useGetImageId } from "../../../Util/useGetImageId";
import { UseGetProductLastId } from "./hook/use-GetProductLastId";
import { Image } from "../../../Interfaces/Image";
import { Price } from "../../../Interfaces/Price";
import { useGenericGetXID } from "../../../Services/useGenericGetXID";
import { validationSchemaProduct } from "../../../Util/YupValidation";
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
  const genericPost = useGenericPost(); // Hook personalizado para realizar una petición POST genérica a la API
  const genericPut = useGenericPut(); // Hook personalizado para realizar una petición PUT genérica a la API
  const changeImage = usePostImage();// Hook personalizado para realizar una petición POST  a la API
  const getImage = useGetImageId();// Hook personalizado para realizar una petición GET  a la API
  const getLastId = UseGetProductLastId();
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
          const requestBody: Image = await getImage(formik.values.product.id, "p");
          setOldImage(requestBody)
        };
        fetchImage();
      }

    }
  }, [data, data2]);

  // Maneja la lógica de guardar o actualizar  un producto
  const handleSaveUpdate = async (p: typeof requestBody) => {
    const isNew = p.product.id === 0;
    if (!isNew) {
      await genericPut<Product>("/api/products/update", p.product.id, p.product);
      if (oldImage && p.file) {
        await changeImage(2, p.product.id, p.file, true, false, oldImage.id);
      }
    } else {
      await genericPost<Product>("/api/products/save", p.product);
      const productId = await getLastId();
      await changeImage(2, productId, p.file ? p.file : undefined);
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
  
  const requestBody = {
    product,
    file: null
  };
  // Configuración y gestión del formulario con Formik
  const formik = useFormik({
    initialValues: requestBody,
    validationSchema: validationSchemaProduct(),
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
                <Col>
                  <Form.Group>
                    <Form.Label>Stock Mínimo</Form.Label>
                    <Form.Control
                      name="product.minStock"
                      type="number"
                      value={formik.values.product?.minStock || ""}
                      onChange={formik.handleChange}
                      isInvalid={Boolean(
                        formik.errors.product?.minStock && formik.touched.product?.minStock
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.product?.minStock}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Stock Actual</Form.Label>
                    <Form.Control
                      name="product.actualStock"
                      type="number"
                      value={formik.values.product?.actualStock || ""}
                      onChange={formik.handleChange}
                      isInvalid={Boolean(
                        formik.errors.product?.actualStock && formik.touched.product?.actualStock
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.product?.actualStock}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
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
