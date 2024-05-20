import * as Yup from "yup";

export const ValidationSchemaUserComplete = Yup.object().shape({
    name: Yup.string().required('Ingrese un nombre'),
    lastName: Yup.string().required('Ingrese un apellido'),
    phone: Yup.number().required('Ingrese un número de teléfono'),
    address: Yup.string().required('Ingrese una dirección'),
    apartment: Yup.string().required('ngrese un departamento'),
});



