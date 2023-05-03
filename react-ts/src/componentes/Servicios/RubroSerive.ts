import Rubro from "../Model/Rubro";

export function getRubroJSON() {
  const datos: Rubro[] = [
    {
      id: 1,
      nombre: "Verduras",
      estado: true,
    },
    {
      id: 2,
      nombre: "Frutas",
      estado: false,
    },
    {
      id: 3,
      nombre: "Carnes",
      estado: true,
    },
    {
      id: 4,
      nombre: "Pescados y mariscos",
      estado: true,
    },
    {
      id: 5,
      nombre: "Lácteos",
      estado: false,
    },
    {
      id: 6,
      nombre: "Huevos y ovoproductos",
      estado: true,
    },
    {
      id: 7,
      nombre: "Cereales y harinas",
      estado: false,
    },
    {
      id: 8,
      nombre: "Legumbres",
      estado: true,
    },
    {
      id: 9,
      nombre: "Frutos secos y semillas",
      estado: false,
    },
    {
      id: 10,
      nombre: "Especias y condimentos",
      estado: false,
    },
  ];
  return datos;
}
export function getRubroXId(id: number) {
  let rubro: Rubro = new Rubro();
  const datos: Rubro[] = getRubroJSON();
  datos.forEach((i: Rubro) => {
    if (i.id === id) {
      rubro = i;
      return;
    }
  });

  return rubro;
}

/*export async function getPlatosJSONFetch(){
	let urlServer = 'http://localhost:8080/api/platos';
	let response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	console.log(response);
	return await response.json();
}

export async function getRubroXIdFecth(id:number){
	let urlServer = 'http://localhost:8080/api/platoxid/'+id;
	let response = await fetch(urlServer, {
		method: 'GET',
        headers: {
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		},
        mode: 'cors'
	});
	return await response.json() as Plato;
    
} */
