import GenericTable from "../../Generic/GenericTable";
import { useEffect, useState } from "react";
import { ModalType, Rubro } from "../../../Models/Interfaces";
import { BsCircleFill } from "react-icons/bs";
import { CategoryModal } from "./FormularioRubro";
import { useGenericGet } from "../../../Services/useGenericGet";

const TablaRubros = () => {
  const [showModal, setShowModal] = useState(false);
  const [state, setState] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.None);
  const [refetch, setRefetch] = useState(false);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [rubro, setRubro] = useState<Rubro>({
    id: 0,
    denomination: "",
    availability: false,
    type: false,
    categoryFatherDenomination: "",
  });
  const [title, setTitle] = useState("");
  const data = useGenericGet<Rubro>(
    "/api/categories/all",
    "Categorías",
    refetch
  );
  useEffect(() => {
    setRubros(data);
    setRefetch(false);
  }, [data]);
  const handleClick = (rubro: Rubro, newTitle: string, modal: ModalType) => {
    console.log(JSON.stringify(rubro));
    setTitle(newTitle);
    setRubro(rubro);
    setModalType(modal);
    setShowModal(true);
  };
  const handleEdit = (r: Rubro) => {
    handleClick(r, "Editar Categoria", ModalType.Edit);
  };
  const handleLow = (r: Rubro) => {
    setState(true);
    handleClick(r, "Baja", ModalType.ChangeStatus);
  };
  const handleHigh = (r: Rubro) => {
    setState(false);
    handleClick(r, "Alta", ModalType.ChangeStatus);
  };
  const handleAdd = () => {
    const newRubro: Rubro = {
      id: 0,
      denomination: "",
      availability: false,
      type: false,
      categoryFatherDenomination: "",
    };
    handleClick(newRubro, "Nueva Categoria", ModalType.Create);
  };

  return (
    <>
      <GenericTable
        data={rubros}
        columns={[
          // Definir las columnas de la tabla
          { field: "id", title: "Id", width: 1 },
          { field: "denomination", title: "Denomination", width: 2 },
          {
            field: "availability",
            title: "State",
            width: 1,
            render: (row: Rubro) => (
              <BsCircleFill
                className={
                  row.availability ? "iconCircleBaja" : "iconCircleAlta"
                }
              />
            ),
          },
          {
            field: "type",
            title: "Type",
            width: 1,
            render: (row: Rubro) => (
              <div>{row.type ? "Producto" : "Ingrediente"}</div>
            ),
          },
          { field: "categoryFatherDenomination", title: "Father", width: 2 },
        ]}
        actions={{
          width: 2,
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

      {showModal && (
        <CategoryModal
          cat={rubro}
          title={title}
          show={showModal}
          onHide={() => setShowModal(false)}
          setRefetch={setRefetch}
          modalType={modalType}
          state={state}
        />
      )}
    </>
  );
};

export default TablaRubros;
