// Importaciones de componentes, funciones y modelos
import GenericTable from "../../Generic/GenericTable";
import { useEffect, useState } from "react";
import RecipeForm from "./RecipeForm";
import { useGenericGet } from "../../../Services/useGenericGet";
import { ModalType } from "../../Enum/ModalType";
import Menu from "../Menu";
import { Row, Col } from "react-bootstrap";
import { Recipe } from "../../../Models/ManufacturedProduct";

/*
  El componente RecipesTable se encarga de mostrar una tabla de recetas y
  permite editar. También utiliza un modal, para mostrar los detalles de una receta .
*/

const RecipesTable = () => {
  // Estado del modal
  const [showModal, setShowModal] = useState(false);
  // Estado para el tipo de modal
  const [modalType, setModalType] = useState<ModalType>(ModalType.None);
  // Estado para indicar si es necesario refrescar los datos
  const [refetch, setRefetch] = useState(false);
  // Estado para almacenar las recetas
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  // Estado para almacenar la receta seleccionada
  const [recipe, setRecipe] = useState<Recipe>({
    id: 0,
    manufacturedProductId: 0,
    denomination: "",
    description: "",
    steps: [],
  });
  // Estado para almacenar el título del modal
  const [title, setTitle] = useState("");

  // Obtener datos de las recetas utilizando el hook useGenericGet
  const data = useGenericGet<Recipe>(
    "/api/recipes/all",
    "Recetas",
    refetch
  );

  useEffect(() => {
    // Actualizar las recetas cuando se obtiene nueva data
    setRecipes(data);
    setRefetch(false);
  }, [data]);

  // Manejar el clic en un elemento de la tabla
  const handleClick = (
    recipe: Recipe,
    newTitle: string,
    modal: ModalType
  ) => {
    setTitle(newTitle);
    setRecipe(recipe);
    setModalType(modal);
    setShowModal(true);
  };

  // Manejar la edición de una receta
  const handleEdit = (r: Recipe) => {
    handleClick(r, "Editar Receta", ModalType.Edit);
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
            data={recipes}
            columns={[
              // Definir las columnas de la tabla
              { field: "id", title: "Id", width: 1 },
              { field: "denomination", title: "Denomination", width: 2 },
              { field: "description", title: "Description", width: 4 },
              {
                field: "manufacturedProductId",
                title: "ID-M-Product",
                width: 1,
              },
            ]}
            actions={{
              width: 1,
              update: true,
            }}
            onUpdate={handleEdit}
          />
        </Col>
        {showModal && (
          <RecipeForm
            idRecipe={recipe.id}
            title={title}
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

export default RecipesTable;

