// Importaciones de componentes, funciones y modelos
import GenericTable from "../../Generic/GenericTable";
import { useEffect, useState } from "react";
import { Category } from "../../../Models/Category";
import { BsCircleFill } from "react-icons/bs";
import CategoryModal from "./CategoryForm";
import { useGenericGet } from "../../../Services/useGenericGet";
import { ModalType } from "../../Enum/ModalType";

/*
el componente TablaCategorys se encarga de mostrar una tabla de categorías, 
permitiendo editar, cambiar el estado y agregar nuevas categorías. También utiliza un modal 
para mostrar los detalles de una categoría y realizar acciones relacionadas.
*/

const TablaCategorys = () => {
  // Estado del modal
  const [showModal, setShowModal] = useState(false);
  // Estado para manejar lógica interna del componente
  const [state, setState] = useState(false);
  // Estado para el tipo de modal
  const [modalType, setModalType] = useState<ModalType>(ModalType.None);
  // Estado para indicar si es necesario refrescar los datos
  const [refetch, setRefetch] = useState(false);
  // Estado para almacenar las categorías
  const [categorys, setCategorys] = useState<Category[]>([]);
  // Estado para almacenar la categoría seleccionada
  const [category, setCategory] = useState<Category>({
    id: 0,
    denomination: "",
    availability: false,
    type: false,
    categoryFatherDenomination: "",
  });
  // Estado para almacenar el título del modal
  const [title, setTitle] = useState("");

  // Obtener datos de las categorías utilizando el hook useGenericGet
  const data = useGenericGet<Category>(
    "/api/categories/all",
    "Categorías",
    refetch
  );

  useEffect(() => {
    // Actualizar las categorías cuando se obtiene nueva data
    setCategorys(data);
    setRefetch(false);
  }, [data]);

  // Manejar el clic en un elemento de la tabla
  const handleClick = (
    category: Category,
    newTitle: string,
    modal: ModalType
  ) => {
    console.log(JSON.stringify(category));
    setTitle(newTitle);
    setCategory(category);
    setModalType(modal);
    setShowModal(true);
  };

  // Manejar la edición de una categoría
  const handleEdit = (r: Category) => {
    handleClick(r, "Editar Categoria", ModalType.Edit);
  };

  // Manejar la baja de una categoría
  const handleLow = (r: Category) => {
    setState(true);
    handleClick(r, "Baja", ModalType.ChangeStatus);
  };

  // Manejar la alta de una categoría
  const handleHigh = (r: Category) => {
    setState(false);
    handleClick(r, "Alta", ModalType.ChangeStatus);
  };

  // Manejar la creación de una nueva categoría
  const handleAdd = () => {
    const newCategory: Category = {
      id: 0,
      denomination: "",
      availability: false,
      type: false,
      categoryFatherDenomination: "",
    };
    handleClick(newCategory, "Nueva Categoria", ModalType.Create);
  };
  // Renderizado del componente
  return (
    <>
      {/* Componente de tabla genérica */}
      <GenericTable
        data={categorys}
        columns={[
          // Definir las columnas de la tabla
          { field: "id", title: "Id", width: 1 },
          { field: "denomination", title: "Denomination", width: 2 },
          {
            field: "availability",
            title: "State",
            width: 1,
            render: (row: Category) => (
              <BsCircleFill
                className={
                  row.availability ? "icon-CircleLow" : "icon-CircleHigh"
                }
              />
            ),
          },
          {
            field: "type",
            title: "Type",
            width: 1,
            render: (row: Category) => (
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

      {/* Modal de categoría */}
      {showModal && (
        <CategoryModal
          cat={category}
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

export default TablaCategorys;
