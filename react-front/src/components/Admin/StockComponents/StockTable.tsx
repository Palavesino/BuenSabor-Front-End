// Importaciones de componentes, funciones y modelos
import GenericTable from "../../Generic/GenericTable";
import { useEffect, useState } from "react";
import { useGenericGet } from "../../../Services/useGenericGet";
import { ModalType } from "../../Enum/ModalType";
import Menu from "../Menu";
import { Row, Col } from "react-bootstrap";
import { Stock } from "../../../Interfaces/Stock";
import StockForm from "./StockForm";
import Aumento from "./Aumento";

/*
El componente StockTable se encarga de mostrar una tabla de stock, 
permitiendo editar, cambiar el estado y agregar nuevos elementos al stock. 
También utiliza un modal para mostrar los detalles de un elemento de stock 
y realizar acciones relacionadas.
*/

const StockTable = () => {
  // Estado del modal
  const [showModal, setShowModal] = useState(false);
  // Estado para el tipo de modal
  const [modalType, setModalType] = useState<ModalType>(ModalType.None);
  // Estado para indicar si es necesario refrescar los datos
  const [refetch, setRefetch] = useState(false);
  // Estado para almacenar los elementos del stock
  const [stock, setStock] = useState<Stock[]>([]);
  // Estado para almacenar el elemento de stock seleccionado
  const [item, setItem] = useState<Stock>({
    id: 0,
    actualStock: 0,
    minStock: 0,
    productStockID: 0,
    ingredientStockID: 0,
    denomination: "",
  });
  // Estado para almacenar el título del modal
  const [title, setTitle] = useState("");

  // Obtener datos del stock, utilizando el hook useGenericGet
  const data = useGenericGet<Stock>(
    "/api/stock/all",
    "Stock",
    refetch
  );

  useEffect(() => {
    // Actualizar los elementos del stock cuando se obtienen nuevos datos
    setStock(data);
    setRefetch(false);
  }, [data]);

  // Manejar el clic en un elemento de la tabla
  const handleClick = (
    item: Stock,
    newTitle: string,
    modal: ModalType
  ) => {
    setTitle(newTitle);
    setItem(item);
    setModalType(modal);
    setShowModal(true);
  };

  // Manejar la edición de un elemento del stock
  const handleEdit = (r: Stock) => {
    handleClick(r, "Editar Stock", ModalType.Edit);
  };
  const handlestock = () => {
    setModalType(ModalType.Stock);
    setShowModal(true);
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
            data={stock}
            columns={[
              // Definir las columnas de la tabla
              { field: "id", title: "Id", width: 1 },
              { field: "denomination", title: "Denomination", width: 2 },
              { field: "minStock", title: "MinStock", width: 2 },
              { field: "actualStock", title: "Stock", width: 2 },
            ]}
            actions={{
              width: 0.7,
              update: true,
              create: true,
              title:'General'

            }}
            onAdd={handlestock}
            onUpdate={handleEdit}
          />
        </Col>
        {showModal && (
          <StockForm
            stock={item}
            title={title}
            show={showModal}
            onHide={() => setShowModal(false)}
            setRefetch={setRefetch}
            modalType={modalType}
          />
        )}
        {showModal && (
          <Aumento
            show={showModal}
            onHide={() => setShowModal(false)}
            setRefetch={setRefetch}
            modalType={modalType}
          />
        )}
      </Row>
    </>
  );
};
export default StockTable;

