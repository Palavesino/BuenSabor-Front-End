import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Formulario.css";
import { ModalType, Rubro } from "../../../Models/Interfaces";
import { useEffect, useState } from "react";
import { useGenericPost } from "../../../Services/useGenericPost";
import { useGenericPut } from "../../../Services/useGenericPut";
import { useGenericGet } from "../../../Services/useGenericGet";
import { useGenericChangeStatus } from "../../../Services/useGenericChangeStatus";

interface Props {
  show: boolean;
  onHide: () => void;
  title: string;
  cat: Rubro;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  modalType: ModalType;
  state: boolean;
}
export const CategoryModal = ({
  show,
  onHide,
  title,
  cat,
  setRefetch,
  modalType,
  state,
}: Props) => {
  const [categories, setCategories] = useState<Rubro[]>([]);
  const [select, setSelect] = useState(false);
  const genericPost = useGenericPost();
  const genericPut = useGenericPut();
  const updateCategoryStatus = useGenericChangeStatus();
  const data = useGenericGet<Rubro>(
    "/api/categories/filter/all-product",
    "Rubro"
  );
  const data2 = useGenericGet<Rubro>(
    "/api/categories/filter/ingredient",
    "Rubro"
  );

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

  const handleSaveUpdate = async (rubro: Rubro) => {
    const isNew = rubro.id === 0;
    console.log(JSON.stringify(rubro, null, 2));
    if (!isNew) {
      await genericPut<Rubro>("/api/categories", rubro.id, rubro, "Categorías");
    } else {
      await genericPost<Rubro>("/api/categories/save", "Categorías", rubro);
    }
    setRefetch(true);
    onHide();
  };

  const handleStateCategory = async () => {
    const id = cat.id;
    await updateCategoryStatus(id, state, "/api/categories/block", "Categoría");
    setRefetch(true);
    onHide();
  };

  const validationSchema = () => {
    return Yup.object().shape({
      id: Yup.number().integer().min(0),
      denomination: Yup.string().required("La denominacion es requerida"),
      type: Yup.boolean(),
      categoryFatherId: Yup.number().integer().min(0).nullable(),
      categoryFatherDenomination: Yup.string().nullable(),
    });
  };

  const handleCategoryFatherChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCategory = parseInt(event.target.value, 10);
    formik.setFieldValue(
      "categoryFatherId",
      isNaN(selectedCategory) ? null : selectedCategory
    );
    const selectedRubro = categories.find(
      (rubro) => rubro.id === selectedCategory
    );
    console.log(selectedRubro?.denomination);

    if (selectedRubro) {
      formik.setFieldValue(
        "categoryFatherDenomination",
        selectedRubro.denomination
      );
    } else {
      formik.setFieldValue("categoryFatherDenomination", "");
    }
  };

  const formik = useFormik({
    initialValues: cat,
    validationSchema: validationSchema(),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (obj: Rubro) => handleSaveUpdate(obj),
  });
  useEffect(() => {
    setSelect(formik.values.type);
  }, [formik.values.type]);

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
