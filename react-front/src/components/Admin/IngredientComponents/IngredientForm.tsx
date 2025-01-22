// Importaciones de componentes, funciones y modelos
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useGenericChangeStatus } from "../../../Services/useGenericChangeStatus";
import { ModalType } from "../../Enum/ModalType";
import { Category } from "../../../Interfaces/Category";
import { useGenericGet } from "../../../Services/useGenericGet";
import { Ingredient, IngredientXStock } from "../../../Interfaces/Ingredient";
import { validationSchemaIngredient } from "../../../Util/YupValidation";
import IngredientPostPut from "./hooks/use-IngredientPostPut";

// Interfaz que define las propiedades esperadas por el componente IngredientForm
interface IngredientModalProps {
  show: boolean; // Indica si el modal debe mostrarse o no
  onHide: () => void; // Función que se ejecuta cuando el modal se cierra
  title: string; // Título del modal
  ingredient: Ingredient; // Ingrediente actual que se está editando
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>; // Función para actualizar el estado y volver a obtener los datos después de realizar una acción en el modal
  modalType: ModalType; // Tipo de modal, indica si es para editar, crear o cambiar el estado de un ingrediente
  state: boolean; // Estado actual del ingrediente
}

/*
  El componente IngredientForm proporciona la funcionalidad necesaria 
  para editar, crear y cambiar el estado de un ingrediente, interactuando con 
  la API y utilizando validación de formularios.
*/
const IngredientForm: React.FC<IngredientModalProps> = ({
  show,
  onHide,
  title,
  ingredient,
  setRefetch,
  modalType,
  state,
}) => {
  const [categories, setCategories] = useState<Category[]>([]); // Almacena las categorías obtenidas de la API
  const postXUpdate = IngredientPostPut(); // Hook personalizado para realizar una petición PUT genérica a la API
  const updateIngredientStatus = useGenericChangeStatus(); // Hook personalizado para actualizar el estado de un ingrediente
  const data = modalType !== ModalType.ChangeStatus ? useGenericGet<Category>(
    "/api/categories/filter/unlocked/type/I",
    "ingredient Categories"
  ) : null;

  const ingredientXStock: IngredientXStock = {
    ingredient: ingredient,
    stock: {
      id: 0,
      actualStock: 0,
      minStock: 0,
      ingredientStockID: 0,
      productStockID: null,
      denomination: "",
    }
  }
  // Obtiene las categorías desde la API cuando se renderiza la página
  useEffect(() => {
    if (data && data.length > 0) {
      setCategories(data);
    }
  }, [data]);

  // Maneja la lógica de guardar o actualizar un ingrediente
  const handleSaveUpdate = async (ingredientStock: IngredientXStock) => {
    await postXUpdate('/api/ingredients/save', '/api/ingredients/update', ingredientStock)
    setRefetch(true);
    onHide();
  };

  // Maneja el cambio de estado de un ingrediente
  const handleStateIngredient = async () => {
    const id = ingredient.id;
    if (!state) {
      await updateIngredientStatus(id, "/api/ingredients/block");
    } else {
      await updateIngredientStatus(id, "/api/ingredients/unlock");
    }
    setRefetch(true);
    onHide();
  };


  // Configuración y gestión del formulario con Formik
  const formik = useFormik({
    initialValues: ingredientXStock,
    validationSchema: validationSchemaIngredient(modalType),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (obj: IngredientXStock) => handleSaveUpdate(obj),
  });


  // Renderizado del componente
  return (
    <>
      {modalType === ModalType.ChangeStatus &&
        state !== ingredient.availability && (
          <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                ¿Está seguro que desea Dar de {title} el estado del Producto?
                <br /> <strong>{ingredient.denomination}</strong>?
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                Cancelar
              </Button>
              <Button
                variant={state ? "success" : "danger"}
                onClick={handleStateIngredient}
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
                      name="ingredient.denomination"
                      type="text"
                      value={formik.values.ingredient.denomination || ""}
                      onChange={formik.handleChange}
                      isInvalid={Boolean(
                        formik.errors.ingredient?.denomination &&
                        formik.touched.ingredient?.denomination
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.ingredient?.denomination}
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
                          value={formik.values.stock.minStock || ""}
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
                          value={formik.values.stock.actualStock || ""}
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
                    <Form.Control
                      name="ingredient.ingredientCategoryID"
                      as="select"
                      value={formik.values.ingredient.ingredientCategoryID || ""}
                      onChange={formik.handleChange}
                      isInvalid={
                        formik.touched.ingredient?.ingredientCategoryID &&
                        !!formik.errors.ingredient?.ingredientCategoryID
                      }
                    >
                      <option value={0}>Seleccionar</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.denomination}
                        </option>
                      ))}
                    </Form.Control>

                    <Form.Control.Feedback type="invalid">
                      {formik.errors.ingredient?.ingredientCategoryID}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Unidad de Medida</Form.Label>
                    <Form.Control
                      name="ingredient.unit"
                      as="select"
                      value={formik.values.ingredient.unit || ""}
                      onChange={formik.handleChange}
                      isInvalid={Boolean(
                        formik.errors.ingredient?.unit && formik.touched.ingredient?.unit
                      )}
                    >
                      <option value="">Selecciona una unidad</option>
                      <option value="gr">Gramo</option>
                      <option value="kg">Kilo</option>
                      <option value="L">Litro </option>
                      <option value="ud">Unidad </option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.ingredient?.unit}
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

export default IngredientForm;
