// Importaciones de componentes, funciones y modelos
import GenericTable from "../../Generic/GenericTable";
import { useEffect, useState } from "react";
import { BsCircleFill } from "react-icons/bs";
import { useGenericGet } from "../../../Services/useGenericGet";
import { ModalType } from "../../Enum/ModalType";
import Menu from "../Menu";
import { Row, Col } from "react-bootstrap";
import { Product } from "../../../Interfaces/Product";
import ProductForm from "./ProductForm";

/*
el componente ProductTable se encarga de mostrar una tabla de productos, 
permitiendo editar, cambiar el estado y agregar nuevos productos. También utiliza un modal 
para mostrar los detalles de un producto y realizar acciones relacionadas.
*/

const ProductTable = () => {
  // Estado del modal
  const [showModal, setShowModal] = useState(false);
  // Estado para manejar lógica interna del componente
  const [state, setState] = useState(false);
  // Estado para el tipo de modal
  const [modalType, setModalType] = useState<ModalType>(ModalType.None);
  // Estado para indicar si es necesario refrescar los datos
  const [refetch, setRefetch] = useState(false);
  // Estado para almacenar los productos
  const [products, setProducts] = useState<Product[]>([]);
  // Estado para almacenar el producto seleccionado
  const [product, setProduct] = useState<Product>({
    id: 0,
    denomination: "",
    description: "",
    availability: true,
    minStock: 0,
    actualStock: 0,
    productCategoryID: 0,
    price: {
      id: 0,
      costPrice: 0,
      sellPrice: 0,
    },
  });
  // Estado para almacenar el título del modal
  const [title, setTitle] = useState("");

  // Obtener datos de los productos utilizando el hook useGenericGet
  const data = useGenericGet<Product>("/api/products/all", "Product", refetch);

  useEffect(() => {
    // Actualizar los productos cuando se obtiene nueva data
    setProducts(data);
    setRefetch(false);
  }, [data]);

  // Manejar el clic en un elemento de la tabla
  const handleClick = (
    p: Product,
    newTitle: string,
    modal: ModalType
  ) => {
    setTitle(newTitle);
    setProduct(p);
    setModalType(modal);
    setShowModal(true);
  };
  // Manejar la edición de un producto
  const handleEdit = (r: Product) => {
    handleClick(r, "Editar Producto", ModalType.Edit);
  };

  // Manejar la baja un producto
  const handleLow = (r: Product) => {
    setState(false);
    handleClick(r, "Baja", ModalType.ChangeStatus);
  };

  // Manejar la alta de un producto
  const handleHigh = (r: Product) => {
    setState(true);
    handleClick(r, "Alta", ModalType.ChangeStatus);
  };

  // Manejar la creación de un nuevo producto
  const handleAdd = () => {
    const newProduct: Product = {
      id: 0,
      denomination: "",
      description: "",
      availability: true,
      minStock: 0,
      actualStock: 0,
      productCategoryID: 0,
      price: {
        id: 0,
        costPrice: 0,
        sellPrice: 0,
      },
    };
    handleClick(newProduct, "Nuevo Producto", ModalType.Create);
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
            data={products}
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
                render: (row: Product) => (
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
                field: "productCategoryID",
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
          <ProductForm
            product={product}
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

export default ProductTable;
