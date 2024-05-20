// Importaciones de componentes, funciones y modelos
import GenericTable from "../../Generic/GenericTable";
import { useEffect, useState } from "react";
import { BsCircleFill } from "react-icons/bs";
import { useGenericGet } from "../../../Services/useGenericGet";
import { ModalType } from "../../Enum/ModalType";
import Menu from "../Menu";
import { Row, Col } from "react-bootstrap";
import { ManufacturedProduct } from "../../../Interfaces/ManufacturedProduct";
import MP_Form from "./MP_Form";

/*
El componente M_ProductTable se encarga de mostrar una tabla de productos manufacturados,
permitiendo editar, cambiar el estado y agregar nuevos productos. También utiliza un modal
para mostrar los detalles de un producto y realizar acciones relacionadas.
*/

const M_ProductTable = () => {
  // Estado del modal
  const [showModal, setShowModal] = useState(false);
  // Estado para manejar lógica interna del componente
  const [state, setState] = useState(false);
  // Estado para el tipo de modal
  const [modalType, setModalType] = useState<ModalType>(ModalType.None);
  // Estado para indicar si es necesario refrescar los datos
  const [refetch, setRefetch] = useState(false);
  // Estado para almacenar los productos manufacturados
  const [Mproducts, setMproducts] = useState<ManufacturedProduct[]>([]);
  // Estado para almacenar el producto manufacturado seleccionado
  const [Mproduct, setMproduct] = useState<ManufacturedProduct>({
    id: 0,
    denomination: "",
    description: "",
    availability: true,
    manufacturedProductCategoryID: 0,
    cookingTime: "",
  });
  // Estado para almacenar el título del modal
  const [title, setTitle] = useState("");

  // Obtener datos de los productos manufacturados utilizando el hook useGenericGet
  const data = useGenericGet<ManufacturedProduct>(
    "/api/manufactured-products/all",
    "Manufactured Product",
    refetch
  );

  useEffect(() => {
    // Actualizar los productos manufacturados cuando se obtiene nueva data
    setMproducts(data);
    setRefetch(false);
  }, [data]);

  // Manejar el clic en un elemento de la tabla
  const handleClick = (
    Mproduct: ManufacturedProduct,
    newTitle: string,
    modal: ModalType
  ) => {
    setTitle(newTitle);
    setMproduct(Mproduct);
    setModalType(modal);
    setShowModal(true);
  };

  // Manejar la edición de un Producto Manufacturado
  const handleEdit = (r: ManufacturedProduct) => {
    handleClick(r, "Editar Producto Manufacturado", ModalType.Edit);
  };

  // Manejar la baja de un Producto Manufacturado
  const handleLow = (r: ManufacturedProduct) => {
    setState(false);
    handleClick(r, "Baja", ModalType.ChangeStatus);
  };

  // Manejar la alta de un Producto Manufacturado
  const handleHigh = (r: ManufacturedProduct) => {
    setState(true);
    handleClick(r, "Alta", ModalType.ChangeStatus);
  };

  // Manejar la creación de un nuevo Producto Manufacturado
  const handleAdd = () => {
    const newMproduct: ManufacturedProduct = {
      id: 0,
      denomination: "",
      description: "",
      availability: true,
      manufacturedProductCategoryID: 0,
      cookingTime: "",
    };
    handleClick(newMproduct, "Nuevo Producto Manufacturado", ModalType.Create);
  };
  // Renderizado del componente
  return (
    <>
      <Row style={{ width: "100%" }}>
        <Col sm={2}>
          <Menu />
        </Col>
        <Col sm={10}>
          <GenericTable
            data={Mproducts}
            columns={[
              // Definir las columnas de la tabla
              { field: "id", title: "Id", width: 1 },
              { field: "denomination", title: "Denomination", width: 2 },
              {
                field: "description",
                title: "Description",
                width: 2,
                styleClass: "td-hidden",
              },
              {
                field: "availability",
                title: "State",
                width: 1,
                render: (row: ManufacturedProduct) => (
                  <BsCircleFill
                    className={
                      row.availability ? "icon-CircleHigh" : "icon-CircleLow"
                    }
                  />
                ),
              },
              {
                field: "manufacturedProductCategoryID",
                title: "CategoryID",
                width: 1,
              },
            ]}
            actions={{
              width: 1.5,
              create: true,
              highLogic: true,
              lowLogic: true,
              update: true,
            }}
            onAdd={handleAdd}
            onUpdate={handleEdit}
            onlowLogic={handleLow}
            onhighLogic={handleHigh}
          />
        </Col>
        {showModal && (
          <MP_Form
            Mproduct={Mproduct}
            title={title}
            show={showModal}
            onHide={() => setShowModal(false)}
            setRefetch={setRefetch}
            modalType={modalType}
            state={state}
          />
        )}
      </Row>
    </>
  );
};

export default M_ProductTable;
