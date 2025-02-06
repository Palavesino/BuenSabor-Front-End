export const customStyles = {
  headRow: {
    style: {
      background: 'linear-gradient(150deg,  #f6bd5a, black)', 
      color: 'white',
      
     
    }, 
  },
  
  rows: {
    style: {
      color: 'black',
      backgroundColor: '#f6bd5a',
    
    },
    highlightOnHoverStyle: {
      backgroundColor: '#d89e45', // Color más oscuro al pasar el mouse
      color: 'white', // Cambiar el color del texto (opcional)
      transition: 'all 0.3s ease-in-out', // Transición suave
    },
  },

  table: {
    style: {
      borderTopLeftRadius: '10px', // Bordes redondeados en la parte superior izquierda
      borderTopRightRadius: '10px', // Bordes redondeados en la parte superior derecha
      overflow: 'hidden', // Asegura que el contenido no se desborde
    },
  },
  
   

  pagination: {
    style: {
      borderTop: '2px solid #ddd', // Borde superior sutil para separar la paginación
      backgroundColor: '#f6bd5a', // Fondo de la paginación
      color: 'black', // Color del texto en la paginación
      borderBottomLeftRadius: '10px', // Bordes redondeados en la parte inferior izquierda
      borderBottomRightRadius: '10px', // Bordes redondeados en la parte inferior derecha
    },
  },

  // Estilos para los botones de la paginación (anterior, siguiente, etc.)
  paginationButton: {
    style: {
      backgroundColor: '#f6bd5a', // Fondo de los botones de la paginación
      color: 'black', // Color del texto de los botones
      borderRadius: '5px', // Bordes redondeados en los botones
      padding: '5px 10px', // Espaciado de los botones
      border: 'none', // Eliminar borde
      cursor: 'pointer', // Cambia el cursor al pasar por encima
      margin: '0 5px', // Espaciado entre los botones
    },
  },

  // Estilo cuando el cursor pasa sobre los botones de paginación
  paginationButtonHover: {
    style: {
      backgroundColor: '#d89e45', // Fondo más oscuro al pasar el cursor
      color: 'white', // Texto blanco al pasar el cursor
    },
  },

  // Estilo para el texto de la paginación (por ejemplo, "Mostrando 1-10 de X resultados")
  paginationText: {
    style: {
      color: 'black', // Color del texto
      fontSize: '14px', // Tamaño de la fuente
    },
  },
}

