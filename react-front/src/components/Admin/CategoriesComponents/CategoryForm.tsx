// Importaciones de componentes, funciones y modelos
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import "./CategoryForm.css";
import { Category } from "../../../Interfaces/Category";
import { useEffect, useState } from "react";
import { useGenericPost } from "../../../Services/useGenericPost";
import { useGenericPut } from "../../../Services/useGenericPut";
import { useGenericChangeStatus } from "../../../Services/useGenericChangeStatus";
import { ModalType } from "../../Enum/ModalType";
import GetTypeCategories from "./hooks/use-typeCategorys";
import { validationSchemaCategory } from "../../../Util/YupValidation";
interface CategoryModalProps {
  show: boolean; // Indica si el modal debe mostrarse o no
  onHide: () => void; // Función que se ejecuta cuando el modal se cierra
  title: string; // Título del modal
  category: Category; // Categoría actual que se está editando
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>; // Función para actualizar el estado y volver a obtener los datos después de realizar una acción en el modal
  modalType: ModalType; // Tipo de modal, indica si es para editar, crear o cambiar el estado de una categoría
  state: boolean; // Estado actual de la categoría
}

/*
El componente CategoryModal proporciona la funcionalidad necesaria 
para editar, crear y cambiar el estado de una categoría, interactuando con 
la API y utilizando validación de formularios.
*/
const CategoryModal: React.FC<CategoryModalProps> = ({
  show,
  onHide,
  title,
  category,
  setRefetch,
  modalType,
  state,
}) => {
  const [categories, setCategories] = useState<Category[]>([]); // Almacena las categorías obtenidas de la API
  const [typeSelect, setTypeSelect] = useState(""); // Indica si se seleccionó la opción de tipo de categoría en el formulario
  const genericPost = useGenericPost(); // Hook personalizado para realizar una petición POST genérica a la API
  const genericPut = useGenericPut(); // Hook personalizado para realizar una petición PUT genérica a la API
  const updateCategoryStatus = useGenericChangeStatus(); // Hook personalizado para actualizar el estado de una categoría
  const data = modalType !== ModalType.ChangeStatus ? GetTypeCategories(typeSelect, category) : null;

  // Obtiene las categorías desde la API cuando renderice la pág
  useEffect(() => {
    if (data && data.length > 0) {
      setCategories(data);
    }
  }, [data]);

  // Maneja la lógica de guardar o actualizar una categoría
  const handleSaveUpdate = async (category: Category) => {
    const isNew = category.id === 0;
    if (!isNew) {
      await genericPut<Category>(
        "/api/categories/update",
        category.id,
        category
      );
    } else {
      await genericPost<Category>("/api/categories/save", category);
    }
    setRefetch(true);
    onHide();
  };

  // Maneja el cambio de estado de una categoría
  const handleStateCategory = async () => {
    const id = category.id;
    if (!state) {
      await updateCategoryStatus(id, "/api/categories/block");
    } else {
      await updateCategoryStatus(id, "/api/categories/unlock");
    }
    setRefetch(true);
    onHide();
  };

  // Maneja el cambio de la categoría padre en el formulario
  const handleCategoryFatherChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCategoryId = parseInt(event.target.value, 10);
    formik.setFieldValue(
      "categoryFatherId",
      isNaN(selectedCategoryId) ? null : selectedCategoryId
    );
    const selectedCategory = categories.find(
      (category) => category.id === selectedCategoryId
    );
    if (selectedCategory) {
      formik.setFieldValue(
        "categoryFatherDenomination",
        selectedCategory.denomination
      );
    } else {
      formik.setFieldValue("categoryFatherDenomination", "");
    }
  };


  // Configuración y gestión del formulario con Formik
  const formik = useFormik({
    initialValues: category,
    validationSchema: validationSchemaCategory(),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (obj: Category) => handleSaveUpdate(obj),
  });
  useEffect(() => {
    setTypeSelect(formik.values.type);
  }, [formik.values.type]);

  // Renderizado del componente
  return (
    <>
      {modalType === ModalType.ChangeStatus &&
        state !== category.availability && (
          <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                ¿Está seguro que desea Dar de {title} el estado de la Categoría?
                <br /> <strong>{category.denomination}</strong>?
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                Cancelar
              </Button>
              <Button
                variant={state ? "success" : "danger"}
                onClick={handleStateCategory}
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
                      onBlur={formik.handleBlur}
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
                    <Form.Label>Categoría Padre</Form.Label>
                    <Form.Select
                      name="categoryFatherId"
                      value={formik.values.categoryFatherId || ""}
                      onChange={handleCategoryFatherChange}
                      disabled={!formik.values.type}
                      isInvalid={
                        formik.touched.categoryFatherId &&
                        !!formik.errors.categoryFatherId
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
                      {formik.errors.categoryFatherId}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Tipo</Form.Label>
                    <Form.Select
                      name="type"
                      value={formik.values.type}
                      onChange={(event) => {
                        formik.setFieldValue("type", event.target.value);
                      }}
                      isInvalid={formik.touched.type && !!formik.errors.type}
                    >
                      <option value="">Seleccionar</option>
                      <option value="I">Ingrediente</option>
                      <option value="P">Producto</option>
                      <option value="M">Producto - Manufacturado</option>
                      <option value="G">General</option>
                    </Form.Select>
                    {formik.touched.type && formik.errors.type && (
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.type}
                      </Form.Control.Feedback>
                    )}
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

export default CategoryModal;
