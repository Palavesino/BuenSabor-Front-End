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

export const customComboBox = {
  //backgroundColor: '#d3d3d3', 
  color: 'black',            
  borderRadius: '4px',       
  padding: '0.5rem',
  width: '300px',             
  marginLeft: '10px',
  marginTop: '10px',         
};

export const conditionalRowStyles = [
  {
    when: (row: Order) => row.state === 'CANCELED',
    style: {
      backgroundColor: '#ff5634', 
      color: 'black',
      '&:hover': {
        backgroundColor: '#ff411b',
      },
    },
  },
  {
    when: (row: Order) => row.state === 'REJECTED',
    style: {
      backgroundColor: '#ea3814', 
      color: 'black',
      '&:hover': {
        backgroundColor: '#c02000',
      },
    },
  },
  {
    when: (row: Order) => row.state === 'FINALIZED',
    style: {
      backgroundColor: '#8af76f',
      color: 'black',
      '&:hover': {
        backgroundColor: '#6ff798', 
      },
    },
  },
  {
    when: (row: Order) => row.state === 'DELIVERED',
    style: {
      backgroundColor: '#f9e79f', 
      color: 'black',
      '&:hover': {
        backgroundColor: '#f7dc6f', 
      },
    },
  },
  {
    when: (row: Order) => row.state === 'PREPARATION',
    style: {
      backgroundColor: '#f9e79f', 
      color: 'black',
      '&:hover': {
        backgroundColor: '#f7dc6f', 
      },
    },
  },
  {
    when: (row: Order) => row.state === 'PENDING',
    style: {
      backgroundColor: '#f4f6f6', 
      color: 'black',
      '&:hover': {
        backgroundColor: '#ccd1d1', 
      },
    },
  },
  {
    when: (row: Order) => row.state === 'READY',
    style: {
      backgroundColor: '#f4f6f6', 
      color: 'black',
      '&:hover': {
        backgroundColor: '#ccd1d1', 
      },
    },
  },
 
];


