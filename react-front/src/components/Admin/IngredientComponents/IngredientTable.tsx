// Importaciones de componentes, funciones y modelos
import GenericTable from "../../Generic/GenericTable";
import { useEffect, useState } from "react";
import { BsCircleFill } from "react-icons/bs";
import { useGenericGet } from "../../../Services/useGenericGet";
import { ModalType } from "../../Enum/ModalType";
import Menu from "../Menu";
import { Row, Col } from "react-bootstrap";
import { Ingredient } from "../../../Models/Ingredient";
import IngredientForm from "./IngredientForm";

/*
el componente IngredientTable se encarga de mostrar una tabla de ingredientes, 
permitiendo editar, cambiar el estado y agregar nuevos ingredientes. También utiliza un modal 
para mostrar los detalles de un ingrediente y realizar acciones relacionadas.
*/

const IngredientTable = () => {
  // Estado del modal
  const [showModal, setShowModal] = useState(false);
  // Estado para manejar lógica estado del componente
  const [state, setState] = useState(false);
  // Estado para el tipo de modal
  const [modalType, setModalType] = useState<ModalType>(ModalType.None);
  // Estado para indicar si es necesario refrescar los datos
  const [refetch, setRefetch] = useState(false);
  // Estado para almacenar los ingredientes
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  // Estado para almacenar el ingrediente seleccionado
  const [ingredient, setIngredient] = useState<Ingredient>({
    id: 0,
    denomination: "",
    unit: "",
    availability: true,
    minStock: 0,
    actualStock: 0,
    ingredientCategoryID: 0,
  });
  // Estado para almacenar el título del modal
  const [title, setTitle] = useState("");

  // Obtener datos de los ingredientes, utilizando el hook useGenericGet
  const data = useGenericGet<Ingredient>(
    "/api/ingredients/all",
    "Ingredients",
    refetch
  );

  useEffect(() => {
    // Actualizar los ingredientes cuando se obtiene nueva data
    setIngredients(data);
    setRefetch(false);
  }, [data]);

  // Manejar el clic en un elemento de la tabla
  const handleClick = (
    ingredient: Ingredient,
    newTitle: string,
    modal: ModalType
  ) => {
    setTitle(newTitle);
    setIngredient(ingredient);
    setModalType(modal);
    setShowModal(true);
  };

  // Manejar la edición de una ingredient
  const handleEdit = (r: Ingredient) => {
    handleClick(r, "Editar Ingredient", ModalType.Edit);
  };
  // Manejar la baja de un ingredient
  const handleLow = (r: Ingredient) => {
    setState(false);
    handleClick(r, "Baja", ModalType.ChangeStatus);
  };

  // Manejar la alta de un ingredient
  const handleHigh = (r: Ingredient) => {
    setState(true);
    handleClick(r, "Alta", ModalType.ChangeStatus);
  };

  // Manejar la creación de un nuevo ingredient
  const handleAdd = () => {
    const newIngredient: Ingredient = {
      id: 0,
      denomination: "",
      unit: "",
      availability: true,
      minStock: 0,
      actualStock: 0,
      ingredientCategoryID: 0,
    };
    handleClick(newIngredient, "Nuevo Ingredient", ModalType.Create);
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
            data={ingredients}
            columns={[
              // Definir las columnas de la tabla
              { field: "id", title: "Id", width: 1 },
              { field: "denomination", title: "Denomination", width: 2 },
              { field: "unit", title: "Unit", width: 1 },
              {
                field: "availability",
                title: "State",
                width: 1,
                render: (row: Ingredient) => (
                  <BsCircleFill
                    className={
                      row.availability ? "icon-CircleHigh" : "icon-CircleLow"
                    }
                  />
                ),
              },
              { field: "minStock", title: "MinStock", width: 1 },
              { field: "actualStock", title: "Stock", width: 1 },
              {
                field: "ingredientCategoryID",
                title: "CategoryID",
                width: 1,
              },
            ]}
            actions={{
              width: 1.3,
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
          <IngredientForm
            ingredient={ingredient}
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
export default IngredientTable;
