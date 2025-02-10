import { Order } from '../../../Interfaces/Order';




export const StyleTable = {
  margin: '10px', 
  padding: '5px', 
  borderRadius: '8px',        
  
}

export const customStyles = {
  headRow: {
    style: {
      background: 'linear-gradient(150deg,  #f6bd5a, black)', 
      color: 'white',
      fontWeight: 'bold', 
      textAlign: 'center' as 'center',
    }, 
  },
  
  rows: {
    style: {
      color: 'black',
    },
  },

  
};


export const customImputs = {
  //backgroundColor: '#d3d3d3', 
  color: 'black',            
  borderRadius: '4px',       
  padding: '0.5rem',
  marginLeft: '30px',
  marginTop: '10px',          
};


export const conditionalRowStyles = [
  {
    when: (row: Order) => row.state === 'DELIVERED',
    style: {
      backgroundColor: '#f4f6f6', 
      color: 'black',
      '&:hover': {
        backgroundColor: '#ccd1d1', 
      },
    },
  },
];


