import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { OrderDetail } from '../../Interfaces/OrderDetail';  
import { useGetRecipe } from './Hook/hookRecipe'; // Hook para obtener la receta
import { Recipe } from '../../Interfaces/ManufacturedProduct'; // Asegúrate de tener la interfaz adecuada para Recipe
import "./Style/Cocinero.css"
interface BootstrapModalProps {
    orderDetails: OrderDetail[];
    show: boolean;
    handleClose: () => void;
}

const BootstrapModal: React.FC<BootstrapModalProps> = ({ orderDetails, show, handleClose }) => {
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [showRecipeModal, setShowRecipeModal] = useState<boolean>(false);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    
    const { getRecipe } = useGetRecipe(); // Desestructuramos getRecipe

    const handleRecipeClick = async (productId: number) => {
        // Llamamos a la función getRecipe correctamente
        const fetchedRecipe = await getRecipe(productId);
        if (fetchedRecipe) {
            setSelectedRecipe(fetchedRecipe);
            setShowRecipeModal(true); // Mostramos el modal de receta
        }
    };

    useEffect(() => {
        if (!show) {
            setRecipe(null); // Limpiar la receta cuando se cierre el modal
            setShowRecipeModal(false); // Cerrar el modal de receta
        }
    }, [show]);

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header className="custom-modal-header">
                    <Modal.Title>Lista de productos</Modal.Title>
                </Modal.Header>
                <Modal.Body className="custom-modal-body">
                    
                    <ul>
                        {orderDetails.map((detail) => (
                            <ul key={detail.id}>
                                {detail.itemProduct ? (
                                    <div>
                                        <strong>{detail.itemProduct.denomination}</strong> <br/>
                                        -{detail.itemProduct.description}
                                        <br/>
                                        -Cantidad: {detail.quantity}                                           
                                     </div>
                                ) : detail.itemManufacturedProduct ? (
                                    <div>
                                        
                                        <strong>{detail.itemManufacturedProduct.denomination}</strong>
                                        
                                        <button className="buttonModal" onClick={() => handleRecipeClick(detail.itemManufacturedProduct?.id || 0)}>
                                            Ver receta
                                        </button>
                                         <br/>
                                        -{detail.itemManufacturedProduct.description}
                                        <br/>
                                       -Cantidad pedida: {detail.quantity}

                                        
                                    </div>
                                ) : (
                                    <div>No hay productos asociados</div>
                                )}
                            </ul>
                        ))}
                    </ul>
                </Modal.Body>
               
            </Modal>

            {/* Modal para mostrar la receta */}
            <Modal show={showRecipeModal} onHide={() => setShowRecipeModal(false)}>
                <Modal.Header  className="custom-modal-header">
                    <Modal.Title>{selectedRecipe?.denomination}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Descripción:</h5>
                    <p>{selectedRecipe?.description}</p>
                    <h5>Paso a paso:</h5>
                    <ul>
                        {selectedRecipe?.steps?.map((step, index) => (
                            <li key={index}>{step.description}</li>
                        ))}
                    </ul>
                    <h5>Ingredientes</h5>
                    <ul>
                        {selectedRecipe?.ingredients?.map((ingredient, index) => (
                            <p key={index}>-{ingredient.denomination}</p>
                        ))}
                    </ul>
                </Modal.Body>
              
            </Modal>
        </>
    );
};

export default BootstrapModal;
