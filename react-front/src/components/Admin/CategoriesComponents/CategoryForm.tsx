// Importaciones de componentes, funciones y modelos
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./CategoryForm.css";
import { Category } from "../../../Models/Category";
import { useEffect, useState } from "react";
import { useGenericPost } from "../../../Services/useGenericPost";
import { useGenericPut } from "../../../Services/useGenericPut";
import { useGenericGet } from "../../../Services/useGenericGet";
import { useGenericChangeStatus } from "../../../Services/useGenericChangeStatus";
import { ModalType } from "../../Enum/ModalType";

interface CategoryModalProps {
  show: boolean; // Indica si el modal debe mostrarse o no
  onHide: () => void; // Función que se ejecuta cuando el modal se cierra
  title: string; // Título del modal
  cat: Category; // Categoría actual que se está editando
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
  cat,
  setRefetch,
  modalType,
  state,
}) => {
  const [categories, setCategories] = useState<Category[]>([]); // Almacena las categorías obtenidas de la API
  const [select, setSelect] = useState(false); // Indica si se seleccionó la opción de categoría de producto o de ingrediente en el formulario
  const genericPost = useGenericPost(); // Hook personalizado para realizar una petición POST genérica a la API
  const genericPut = useGenericPut(); // Hook personalizado para realizar una petición PUT genérica a la API
  const updateCategoryStatus = useGenericChangeStatus(); // Hook personalizado para actualizar el estado de una categoría
  const data = useGenericGet<Category>(
    "/api/categories/filter/all-product",
    "Category"
  ); // Obtiene las categorías de producto desde la API
  const data2 = useGenericGet<Category>(
    "/api/categories/filter/ingredient",
    "Category"
  ); // Obtiene las categorías de ingrediente desde la API

  // Actualiza las categorías según la selección (producto o ingrediente)
  const fetchData = () => {
    if (select) {
      setCategories(data);
    } else {
      setCategories(data2);
    }
  };

  useEffect(() => {
    fetchData();
  }, [data, data2]);

  useEffect(() => {
    fetchData();
  }, [select]);

  // Maneja la lógica de guardar o actualizar una categoría
  const handleSaveUpdate = async (category: Category) => {
    const isNew = category.id === 0;
    console.log(JSON.stringify(category, null, 2));
    if (!isNew) {
      await genericPut<Category>(
        "/api/categories",
        category.id,
        category,
        "Categorías"
      );
    } else {
      await genericPost<Category>(
        "/api/categories/save",
        "Categorías",
        category
      );
    }
    setRefetch(true);
    onHide();
  };

  // Maneja el cambio de estado de una categoría
  const handleStateCategory = async () => {
    const id = cat.id;
    await updateCategoryStatus(id, state, "/api/categories/block", "Categoría");
    setRefetch(true);
    onHide();
  };

  // Define el esquema de validación del formulario
  const validationSchema = () => {
    return Yup.object().shape({
      id: Yup.number().integer().min(0),
      denomination: Yup.string().required("La denominación es requerida"),
      type: Yup.boolean(),
      categoryFatherId: Yup.number().integer().min(0).nullable(),
      categoryFatherDenomination: Yup.string().nullable(),
    });
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
    console.log(selectedCategory?.denomination);

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
    initialValues: cat,
    validationSchema: validationSchema(),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (obj: Category) => handleSaveUpdate(obj),
  });

  useEffect(() => {
    setSelect(formik.values.type);
  }, [formik.values.type]);
  // Renderizado del componente
  return (
    <>
      {modalType === ModalType.ChangeStatus && state !== cat.availability && (
        <Modal show={show} onHide={onHide} centered backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              ¿Está seguro que desea Dar de {title} el estado de la Categoría?
              <br /> <strong>{cat.denomination}</strong>?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleStateCategory}>
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
          className="modal-xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={formik.handleSubmit}>
              <Row>
                <Col>
                  <Form.Group controlId="formDenomination">
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
                  <Form.Group controlId="formCategoryFatherId">
                    <Form.Label>Categoría Padre</Form.Label>
                    <Form.Select
                      name="categoryFatherId"
                      value={formik.values.categoryFatherId || ""}
                      onChange={handleCategoryFatherChange}
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
                  <Form.Group controlId="formBlocked">
                    <Form.Label>Tipo</Form.Label>
                    <Form.Select
                      name="type"
                      value={formik.values.type.toString()}
                      onChange={(event) => {
                        formik.setFieldValue(
                          "type",
                          event.target.value === "true"
                        );
                      }}
                    >
                      <option value="false">Ingrediente</option>
                      <option value="true">Producto</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Modal.Footer className="mt-4">
                <Button variant="secondary" onClick={onHide}>
                  Cancelar
                </Button>
                <Button
                  variant="primary"
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
