import * as Yup from "yup";
import { ModalType } from "../components/Enum/ModalType";

export const validationSchemaUserComplete = Yup.object().shape({
    name: Yup.string().required('Ingrese un nombre'),
    lastName: Yup.string().required('Ingrese un apellido'),
    phone: Yup.string()
        .required('Ingrese un número de teléfono')
        .min(8, 'El número de teléfono debe tener al menos 8 caracteres')
        .max(15, 'El número de teléfono no puede tener más de 15 caracteres'),
    addresses: Yup.array().of(
        Yup.object().shape({
            address: Yup.string().required('Ingrese una dirección'),
            departament: Yup.string().required('Ingrese un departamento')
        })
    ).min(1, 'Proporcione al menos una dirección'),
    otherwise: Yup.object(),

});

export const validationSchemaPassword = Yup.object().shape({
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

export const validationSchemaCategory = () => {
    return Yup.object().shape({
        id: Yup.number().integer().min(0),
        denomination: Yup.string().required("La denominación es requerida"),
        type: Yup.string().required("El Tipo es requerido"),
        categoryFatherId: Yup.number().integer().min(0).nullable(),
        categoryFatherDenomination: Yup.string().nullable(),
    });
};
export const validationStock = () => {
    return Yup.object().shape({
        minStock: Yup.number()
            .integer()
            .moreThan(4, "El Stock Mínimo debe ser 5 o más")
            .required("El Stock Mínimo es requerido"),
        actualStock: Yup.number()
            .integer()
            .min(
                Yup.ref("minStock"),
                "El Stock Actual no puede ser menor al Stock Mínimo"
            )
            .required("El Stock Actual es requerido"),
    });
};
export const validationSchemaIngredient = (modalType: ModalType) => {

    switch (modalType) {
        case 1:
            return Yup.object().shape({
                ingredient: Yup.object().shape({
                    id: Yup.number().integer().min(0),
                    denomination: Yup.string().required("La denominación es requerida"),
                    unit: Yup.string().required("La unidad es requerida"),
                    ingredientCategoryID: Yup.number()
                        .integer()
                        .moreThan(0, "Selecciona una categoría")
                        .required("La categoría es requerida"),
                }),
                stock: Yup.object().shape({
                    minStock: Yup.number()
                        .integer()
                        .moreThan(4, "El Stock Mínimo debe ser 5 o más")
                        .required("El Stock Mínimo es requerido"),
                    actualStock: Yup.number()
                        .integer()
                        .min(
                            Yup.ref("minStock"),
                            "El Stock Actual no puede ser menor al Stock Mínimo"
                        )
                        .required("El Stock Actual es requerido"),
                }),
            });
        default:
            return Yup.object().shape({
                ingredient: Yup.object().shape({
                    id: Yup.number().integer().min(0),
                    denomination: Yup.string().required("La denominación es requerida"),
                    unit: Yup.string().required("La unidad es requerida"),
                    ingredientCategoryID: Yup.number()
                        .integer()
                        .moreThan(0, "Selecciona una categoría")
                        .required("La categoría es requerida"),
                }),
            });
    }


};
export const validationSchemaProduct = (modalType: ModalType) => {
    switch (modalType) {
        case 1:
            return Yup.object().shape({
                product: Yup.object().shape({
                    denomination: Yup.string().required("La denominación es requerida"),
                    productCategoryID: Yup.number()
                        .integer()
                        .moreThan(0, "Selecciona una categoría")
                        .required("La categoría es requerido"),
                    description: Yup.string().required("La Descripción es requerida"),
                    price: Yup.object().shape({
                        costPrice: Yup.number().required("El Precio de Costo es requerido").min(0, "No puede Ingresar Valor Negativo"),
                        sellPrice: Yup.number().required("El Precio de Venta es requerido").min(
                            Yup.ref("costPrice"),
                            "El Precio de Venta no puede ser menor al Precio de Costo"
                        ),
                    }),

                }),
                stock: Yup.object().shape({
                    minStock: Yup.number()
                        .integer()
                        .moreThan(4, "El Stock Mínimo debe ser 5 o más")
                        .required("El Stock Mínimo es requerido"),
                    actualStock: Yup.number()
                        .integer()
                        .min(
                            Yup.ref("minStock"),
                            "El Stock Actual no puede ser menor al Stock Mínimo"
                        )
                        .required("El Stock Actual es requerido"),
                }),

                file: Yup.mixed().when("product.id", (id: unknown, schema) => {
                    if (Number(id) === 0) {
                        return schema.required("La Imagen es requerida").test(
                            "FILE_SIZE",
                            "El archivo subido es demasiado grande.",
                            (value) => !value || (value && (value as File).size <= 1024 * 1024 * 10)
                        ).test(
                            "FILE_FORMAT",
                            "El archivo subido tiene un formato no compatible.",
                            (value) => !value || (value && ["image/jpg", "image/jpeg", "image/png"].includes((value as File).type))
                        );
                    } else {
                        return schema.nullable().notRequired().test(
                            "FILE_SIZE",
                            "El archivo subido es demasiado grande.",
                            (value) => !value || (value && (value as File).size <= 1024 * 1024 * 10)
                        ).test(
                            "FILE_FORMAT",
                            "El archivo subido tiene un formato no compatible.",
                            (value) => !value || (value && ["image/jpg", "image/jpeg", "image/png"].includes((value as File).type))
                        );
                    }
                }),
            });
        default:
            return Yup.object().shape({
                product: Yup.object().shape({
                    denomination: Yup.string().required("La denominación es requerida"),
                    productCategoryID: Yup.number()
                        .integer()
                        .moreThan(0, "Selecciona una categoría")
                        .required("La categoría es requerido"),
                    description: Yup.string().required("La Descripción es requerida"),
                    price: Yup.object().shape({
                        costPrice: Yup.number().required("El Precio de Costo es requerido").min(0, "No puede Ingresar Valor Negativo"),
                        sellPrice: Yup.number().required("El Precio de Venta es requerido").min(
                            Yup.ref("costPrice"),
                            "El Precio de Venta no puede ser menor al Precio de Costo"
                        ),
                    }),
                }),
                file: Yup.mixed().when("product.id", (id: unknown, schema) => {
                    if (Number(id) === 0) {
                        return schema.required("La Imagen es requerida").test(
                            "FILE_SIZE",
                            "El archivo subido es demasiado grande.",
                            (value) => !value || (value && (value as File).size <= 1024 * 1024 * 10)
                        ).test(
                            "FILE_FORMAT",
                            "El archivo subido tiene un formato no compatible.",
                            (value) => !value || (value && ["image/jpg", "image/jpeg", "image/png"].includes((value as File).type))
                        );
                    } else {
                        return schema.nullable().notRequired().test(
                            "FILE_SIZE",
                            "El archivo subido es demasiado grande.",
                            (value) => !value || (value && (value as File).size <= 1024 * 1024 * 10)
                        ).test(
                            "FILE_FORMAT",
                            "El archivo subido tiene un formato no compatible.",
                            (value) => !value || (value && ["image/jpg", "image/jpeg", "image/png"].includes((value as File).type))
                        );
                    }
                }),
            });
    }

};

export const validationSchemaManufacturedProduct = () => {
    return Yup.object().shape({
        manufacturedProduct: Yup.object().shape({
            id: Yup.number().integer().min(0),
            denomination: Yup.string().required("La denominación es requerida"),
            manufacturedProductCategoryID: Yup.number()
                .integer()
                .moreThan(0, "Selecciona una categoría")
                .required("La categoría es requerida"),
            description: Yup.string().required("La Descripción es requerida"),
            cookingTime: Yup.string().required("El tiempo de preparado es requerido"),
            price: Yup.object().shape({
                costPrice: Yup.number().required("El Precio de Costo es requerido").min(0, "No puede Ingresar Valor Negativo"),
                sellPrice: Yup.number().required("El Precio de Venta es requerido").min(
                    Yup.ref("costPrice"),
                    "El Precio de Venta no puede ser menor al Precio de Costo"
                ),
            }),
        }),
        recipe:
            Yup.object().when('manufacturedProduct.id', {
                is: (manufacturedProductId: number) => {
                    return manufacturedProductId === 0;
                },
                then: () =>
                    Yup.object({
                        id: Yup.number().integer().min(0),
                        denomination: Yup.string().required("La denominación es requerida"),
                        description: Yup.string().required("La descripción es requerida"),
                        steps: Yup.array()
                            .of(
                                Yup.object().shape({
                                    description: Yup.string().required("La descripción del paso es requerida"),
                                })
                            )
                            .min(3, 'Debe haber al menos 3 pasos en la receta'),
                        ingredientsQuantity: Yup.array()
                            .of(
                                Yup.object().shape({
                                    quantity: Yup.number().required("Cantidad es requerido").min(0, "No puede Ingresar Valor Negativo"),
                                })
                            )
                            .min(3, 'Debe haber al menos 3 Ingredientes en la receta'),
                    }),
            }),
        file: Yup.mixed().when("manufacturedProduct.id", (id: unknown, schema) => {
            if (Number(id) === 0) {
                return schema.required("La Imagen es requerida").test(
                    "FILE_SIZE",
                    "El archivo subido es demasiado grande.",
                    (value) => !value || (value && (value as File).size <= 1024 * 1024 * 10)
                ).test(
                    "FILE_FORMAT",
                    "El archivo subido tiene un formato no compatible.",
                    (value) => !value || (value && ["image/jpg", "image/jpeg", "image/png"].includes((value as File).type))
                );
            } else {
                return schema.nullable().notRequired().test(
                    "FILE_SIZE",
                    "El archivo subido es demasiado grande.",
                    (value) => !value || (value && (value as File).size <= 1024 * 1024 * 10)
                ).test(
                    "FILE_FORMAT",
                    "El archivo subido tiene un formato no compatible.",
                    (value) => !value || (value && ["image/jpg", "image/jpeg", "image/png"].includes((value as File).type))
                );
            }
        })
    })
};



export const validationSchemaRecipe = () => {
    return Yup.object().shape({
        id: Yup.number().integer().min(0),
        denomination: Yup.string().required("La denominación es requerida"),
        description: Yup.string().required("La descripción es requerida"),
        steps: Yup.array()
            .of(
                Yup.object().shape({
                    description: Yup.string().required(
                        "La descripción del paso es requerida"
                    ),
                })
            )
            .min(3, 'Debe haber al menos 3 pasos en la receta'),
        ingredientsQuantity: Yup.array()
            .of(
                Yup.object().shape({
                    quantity: Yup.number().required("Cantidad es requerido").min(0, "No puede Ingresar Valor Negativo"),
                })
            )
            .min(3, 'Debe haber al menos 3 Ingredientes en la receta'),
    });
};

export const validationSchemaUser = (modalType: ModalType, checkEmailExists: (email: string) => Promise<boolean>) => {
    switch (modalType) {
        case 2:
            return Yup.object().shape({
                role: Yup.object().shape({
                    idAuth0Role: Yup.string().required('Ingrese Rol'),
                }),
            });
        default:
            return Yup.object().shape({
                auth0User: Yup.object().shape({
                    email: Yup.string().email('Ingrese un email válido').required('Ingrese el email')
                        .test('checkEmail', 'El correo electrónico ya existe', value => {
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    checkEmailExists(value)
                                        .then(exists => resolve(!exists))
                                        .catch(() => resolve(false));
                                }, 500);
                            });
                        }),
                    password: Yup.string()
                        .required('Ingrese password')
                        .matches(/(?=.*\d)/, 'El password debe contener al menos un dígito')
                        .matches(/(?=.*[a-z])/, 'El password debe contener al menos una letra minúscula')
                        .matches(/(?=.*[A-Z])/, 'El password debe contener al menos una letra mayúscula')
                        .min(8, 'El password debe tener al menos 8 caracteres'),
                }),
                role: Yup.object().shape({
                    idAuth0Role: Yup.string().required('Ingrese Rol'),
                }),
                confirmPassword: Yup.string()
                    .required('Confirme el password')
                    .oneOf([Yup.ref('auth0User.password')], 'Los password y confirmPassword deben coincidir'),
            });
    }
};

export const validationSchemaOrder = (isDelivery: boolean) => {
    return Yup.object().shape({
        deliveryMethod: Yup.string()
            .required("El método de entrega es requerido"),
        phone: isDelivery ? Yup.string().required('El teléfono es requerido') : Yup.string(),
        address: isDelivery ? Yup.string().required('La dirección es requerida') : Yup.string(),
        apartment: isDelivery ? Yup.string().required('El apartamento es requerido') : Yup.string(),
        paymentType: Yup.string()
            .required("La forma de pago es requerida")
    });
};


