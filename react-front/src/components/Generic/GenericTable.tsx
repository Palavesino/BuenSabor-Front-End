import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import {
  Button,
  Table,
  InputGroup,
  FormControl,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { TableProps } from "./CamposTablaGenerica";
import { BsCircleFill } from "react-icons/bs";
import { TiCancel } from "react-icons/ti";
import { IoIosEye } from "react-icons/io";
import {
  FaArrowAltCircleDown,
  FaTrashAlt,
  FaArrowAltCircleUp,
} from "react-icons/fa";
import { GiFeather } from "react-icons/gi";
import "./Table.css";

function GenericTable<T>({
  data,
  columns,
  actions,
  onAdd,
  onUpdate,
  onCancel,
  onDelete,
  onView,
  onhighLogic,
  onlowLogic,
  customSearch,
}: TableProps<T>) {
  const [searchText, setSearchText] = useState(""); // Estado para almacenar el texto de búsqueda
  const [filteredData, setFilteredData] = useState<T[]>(data); // Estado para almacenar los datos filtrados
  const [isLoading, setIsLoading] = useState(false); // Estado para indicar si se está realizando una búsqueda

  useEffect(() => {
    let isMounted = true; // Variable para controlar si el componente está montado

    const handleSearch = async () => {
      if (customSearch) {
        // Si se proporciona una función de búsqueda personalizada
        setIsLoading(true); // Habilitar la carga
        const filteredData = await customSearch(searchText); // Realizar la búsqueda personalizada
        if (isMounted) {
          setFilteredData(filteredData); // Actualizar los datos filtrados
          setIsLoading(false); // Deshabilitar la carga
        }
      } else {
        setFilteredData(
          data.filter((item) => defaultSearch(item, searchText)) // Filtrar los datos en función del texto de búsqueda
        );
      }
    };

    handleSearch();

    // Cleanup: establecer la variable isMounted en false cuando el componente se desmonta
    return () => {
      isMounted = false;
    };
  }, [searchText, data, customSearch]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value); // Actualizar el estado del texto de búsqueda cuando cambia
  };

  const handleSearchSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (customSearch) {
      setIsLoading(true); // Habilitar la carga
      const filteredData = await customSearch(searchText); // Realizar la búsqueda personalizada
      setFilteredData(filteredData); // Actualizar los datos filtrados
      setIsLoading(false); // Deshabilitar la carga
    }
  };

  const defaultSearch = (item: T, search: string): boolean =>
    columns.some((column) => {
      const value = item[column.field];
      return (
        typeof value === "string" &&
        value.toLowerCase().includes(search.toLowerCase())
      );
    });

  return (
    <Container>
      <Row className="align-items-center">
        <Col sm={6}>
          {actions.create && (
            <Button onClick={onAdd} className="button-New">
              {actions.title ? actions.title: 'Nuevo'}
            </Button>
          )}{" "}
          {/* Botón para agregar un nuevo elemento */}
        </Col>

        {!actions.offSearch && (
          <Col sm={6}>
            <form onSubmit={handleSearchSubmit}>
              <InputGroup className="mb-3 button-Search">
                <FormControl
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                  onChange={handleSearchChange}
                  value={searchText}
                />
                {/* <Button
                variant="primary"
                id="button-addon2"
                type="submit"
                disabled={isLoading}
              >
                Button
              </Button> */}
              </InputGroup>
            </form>
          </Col>)}
      </Row>
      <Table bordered responsive>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                style={{
                  width: `${column.width ? (column.width * 100) / 12 : ""}%`,
                }}
              >
                {column.title}
              </th> // Encabezado de la tabla
            ))}
            {(actions.update ||
              actions.delete ||
              actions.view ||
              actions.highLogic ||
              actions.lowLogic) && (
                <th
                  style={{
                    width: `${actions.width ? (actions.width * 100) / 12 : ""}%`,
                  }}
                >
                  Actions
                </th>
              )}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              {columns.map((column, key) => (
                <td key={key} className={column.styleClass}>
                  {column.render
                    ? column.render(item)
                    : String(item[column.field])}
                </td>
              ))}
              <td className="td-Accion">
                {actions.highLogic && (
                  <FaArrowAltCircleUp
                    className="icon-High"
                    onClick={() => onhighLogic!(item)}
                  />
                )}
                {actions.lowLogic && (
                  <FaArrowAltCircleDown
                    className="icon-Low"
                    onClick={() => onlowLogic!(item)}
                  />
                )}
                {actions.update && (
                  <GiFeather
                    className="icon-Edit"
                    onClick={() => onUpdate!(item)}
                  />
                )}
                {actions.cancel && (
                  <TiCancel
                    className="icon-Cancel"
                    onClick={() => onCancel!(item)}
                  />
                )}
                {actions.delete && (
                  <FaTrashAlt onClick={() => onDelete!(item)} />
                )}
                {actions.view && (
                  <IoIosEye
                  className="icon-View"
                   onClick={() => onView!(item)} />
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default GenericTable;
