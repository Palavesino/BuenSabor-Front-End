import * as Yup from "yup";

export const ValidationSchemaPassword = Yup.object().shape({
    password: Yup
        .string()
        .required('Ingrese Contraseña')
        .matches(/(?=.*\d)/, 'La Contraseña debe contener al menos un dígito')
        .matches(/(?=.*[a-z])/, 'La Contraseña debe contener al menos una letra minúscula')
        .matches(/(?=.*[A-Z])/, 'La Contraseña debe contener al menos una letra mayúscula')
        .min(8, 'La Contraseña debe tener al menos 8 caracteres'),
    confirmPassword: Yup.string()
        .required('Confirme la Contraseña')
        .oneOf([Yup.ref('password')], 'Los Contraseña y confirm Contraseña deben coincidir'),

});

