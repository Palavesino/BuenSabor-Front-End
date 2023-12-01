// Importaciones de componentes, funciones y modelos
import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useGenericPost } from "../../../Services/useGenericPost";
import { useGenericPut } from "../../../Services/useGenericPut";
import { useGenericChangeStatus } from "../../../Services/useGenericChangeStatus";
import { ModalType } from "../../Enum/ModalType";
import { Category } from "../../../Models/Category";
import { useGenericGet } from "../../../Services/useGenericGet";
import { ManufacturedProduct } from "../../../Models/ManufacturedProduct";
import RecipeForm from "./RecipeForm";
import GetRecipeForm from "./hooks/use-recipeForm";
interface MproductModalProps {
  show: boolean; // Indica si el modal debe mostrarse o no
  onHide: () => void; // Función que se ejecuta cuando el modal se cierra
  title: string; // Título del modal
  Mproduct: ManufacturedProduct; // Producto Manufacturado actual que se está editando
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>; // Función para actualizar el estado y volver a obtener los datos después de realizar una acción en el modal
  modalType: ModalType; // Tipo de modal, indica si es para editar, crear o cambiar el estado de un Producto Manufacturado
  state: boolean; // Estado actual del Producto Manufacturado
}

/*
El componente M_ProductForm proporciona la funcionalidad necesaria 
para editar, crear y cambiar el estado de un Producto Manufacturado, interactuando con 
la API y utilizando validación de formularios.
*/
const M_ProductForm: React.FC<MproductModalProps> = ({
  show,
  onHide,
  title,
  Mproduct,
  setRefetch,
  modalType,
  state,
}) => {
  const [categories, setCategories] = useState<Category[]>([]); // Almacena las categorías obtenidas de la API
  const [showRecipeForm, setShowRecipeForm] = useState(false);  // Estado para mostrar RecipeForm
  const postXput = GetRecipeForm();
  const updateMproductStatus = useGenericChangeStatus(); // Hook personalizado para actualizar el estado de un Producto Manufacturado
  const [componentToRender, setComponentToRender] = useState(false);
  const data = useGenericGet<Category>(
    "/api/categories/filter/unlocked/type/M",
    "Product Categories"
  );

  // Obtiene las categorías desde la API cuando renderice la pág
  useEffect(() => {
    setCategories(data);
  }, [data]);

  // Maneja la lógica de guardar o actualizar un Producto Manufacturado
  const handleSaveUpdate = async (Mproduct: ManufacturedProduct) => {
    console.log(JSON.stringify(Mproduct, null, 2));
    let response = await postXput("/api/manufactured-products/save", "/api/manufactured-products/update", Mproduct);
    console.log("componentToRender= " + response);
    setShowRecipeForm(true);
    setRefetch(true);
    onHide();
    console.log("setShowRecipeForm = " + showRecipeForm);
  };

  // Maneja el cambio de estado de un Producto Manufacturado
  const handleStateMproducts = async () => {
    const id = Mproduct.id;
    if (!state) {
      await updateMproductStatus(id, "/api/manufactured-products/block");
    } else {
      await updateMproductStatus(id, "/api/manufactured-products/unlock");
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
      urlImage: Yup.string().required("La URL de la Imagen es requerida"),
      description: Yup.string().required("La Descripción es requerida"),
      cookingTime: Yup.string().required("El tiempo de preparado es requerida"),
    });
  };
  // Configuración y gestión del formulario con Formik
  const formik = useFormik({
    initialValues: Mproduct,
    validationSchema: validationSchema(),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (obj: ManufacturedProduct) => handleSaveUpdate(obj).then(() => {
      setShowRecipeForm(true);
      console.log("despues = " + componentToRender + showRecipeForm)

    }),
    // onSubmit: (obj: ManufacturedProduct) =>
    //   console.log(JSON.stringify(obj, null, 2)),
  });

  // Renderizado del componente
  return (
    <>

      {modalType === ModalType.ChangeStatus &&
        state !== Mproduct.availability && (
          <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                ¿Está seguro que desea Dar de {title} el estado del Producto?
                <br /> <strong>{Mproduct.denomination}</strong>?
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                Cancelar
              </Button>
              <Button
                variant={state ? "success" : "danger"}
                onClick={handleStateMproducts}
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
                <Col>
                  <Form.Group>
                    <Form.Label>Tiempo de preparado (HH:MM:SS)</Form.Label>
                    <Form.Control
                      name="cookingTime"
                      type="time" // Utiliza el tipo "time" para campos de tiempo
                      step={1}
                      value={formik.values.cookingTime || ""}
                      onChange={formik.handleChange}
                      isInvalid={Boolean(
                        formik.errors.cookingTime && formik.touched.cookingTime
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.cookingTime}
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
      {showRecipeForm && <RecipeForm show={true} />}
    </>
  );
};

export default M_ProductForm;
