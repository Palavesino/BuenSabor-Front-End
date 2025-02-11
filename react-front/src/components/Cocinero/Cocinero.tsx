import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useGetItem } from './Hook/hookItem';
import { updateOrderState } from './Hook/UpdateOrderState';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModalProduct from './ModalProduct';
import { OrderDetail } from '../../Interfaces/OrderDetail';
import { Order } from '../../Interfaces/Order';
import { OrderStatus } from '../Enum/OrderStatus';
import "./Style/Cocinero.css"

const Cocinero: React.FC = () => {
  const getItem = useGetItem();
  const [orders, setOrders] = useState<Order[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentOrderDetails, setCurrentOrderDetails] = useState<OrderDetail[]>([]);
  const [countdown, setCountdown] = useState<{ [key: number]: number }>({});
  const [isTimeUp, setIsTimeUp] = useState<{ [key: number]: boolean }>({});
  const [isCountdownStarted, setIsCountdownStarted] = useState<{ [key: number]: boolean }>({});
  const update = updateOrderState();

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getItem();
      if (data) {
        setOrders(data);
      }
    };
    fetchOrders();
  }, []);

  // Recuperar el estado del contador y si la cuenta regresiva fue iniciada desde localStorage
  useEffect(() => {
    const savedCountdown = localStorage.getItem('countdown');
    const savedIsCountdownStarted = localStorage.getItem('isCountdownStarted');
    if (savedCountdown && savedIsCountdownStarted) {
      setCountdown(JSON.parse(savedCountdown));
      setIsCountdownStarted(JSON.parse(savedIsCountdownStarted));
    }
  }, []);

  const handleShowModal = (orderDetails: OrderDetail[]) => {
    setCurrentOrderDetails(orderDetails);
    setShowModal(true);
  };
  const sumCookingTime = (orderDetails: OrderDetail[]): number => {
    const totalCookingTime = orderDetails.reduce((total, orderDetail) => {
        if (orderDetail.itemManufacturedProduct) {
            // Obtener el tiempo de cocción en formato de texto (e.g., "30 min" o "1 hour")
            const cookingTime = orderDetail.itemManufacturedProduct.cookingTime;
            
            // Convertir el tiempo de cocción a minutos
            const timeInMinutes = convertCookingTimeToMinutes(cookingTime);
            return total + timeInMinutes;
        }
        return total;
    }, 0);

    return totalCookingTime;
};

// Función para convertir el tiempo de cocción a minutos
const convertCookingTimeToMinutes = (cookingTime: string): number => {
    const timePattern = /(\d+)\s*(hour|minute|h|m)/i;
    const match = cookingTime.match(timePattern);

    if (match) {
        const value = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();

        // Convertir a minutos
        if (unit === "hour" || unit === "h") {
            return value * 60; // Convertir horas a minutos
        } else if (unit === "minute" || unit === "m") {
            return value; // Ya está en minutos
        }
    }
    return 0; // Si no se puede parsear, devolvemos 0
};

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleStartCountdown = (orderId: number, estimatedTime: string) => {
    const [hours, minutes, seconds] = estimatedTime.split(':').map((str) => parseInt(str));
    const estimatedTimeInMs = new Date().getTime() + (hours * 3600 + minutes * 60 + seconds) * 1000;

    setCountdown((prev) => {
      const newCountdown = { ...prev, [orderId]: estimatedTimeInMs };
      localStorage.setItem('countdown', JSON.stringify(newCountdown));  // Guardamos en localStorage
      return newCountdown;
    });

    setIsCountdownStarted((prev) => {
      const newIsCountdownStarted = { ...prev, [orderId]: true };
      localStorage.setItem('isCountdownStarted', JSON.stringify(newIsCountdownStarted));  // Guardamos en localStorage
      return newIsCountdownStarted;
    });
  };

  const handleChangeOrderState = async (orderId: number) => {
    try {
      const updatedOrder = await update(OrderStatus.READY, orderId); // Cambiamos el estado a READY
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, state: updatedOrder.state } : order
        )
      );
    } catch (err) {
      console.log('Error al editar el pedido');
    }
  };

  const remainingTime = (orderId: number) => {
    return countdown[orderId] ? countdown[orderId] - new Date().getTime() : 0;
  };

  const formatTime = (timeInMs: number) => {
    const hours = Math.floor(timeInMs / 3600000);
    const minutes = Math.floor((timeInMs % 3600000) / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Funciones para sumar o restar tiempo
  const adjustTime = (orderId: number, amount: number) => {
    setCountdown((prev) => {
      const newCountdown = { ...prev };
      if (newCountdown[orderId]) {
        newCountdown[orderId] += amount * 1000; // amount está en segundos, convertimos a milisegundos
        localStorage.setItem('countdown', JSON.stringify(newCountdown)); // Guardamos en localStorage
      }
      return newCountdown;
    });
  };

  // Actualizar si el tiempo se agotó
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        const newCountdown = { ...prev };
        Object.keys(newCountdown).forEach((orderId) => {
          const timeLeft = remainingTime(Number(orderId));
          if (timeLeft <= 0 && !isTimeUp[Number(orderId)]) {
            setIsTimeUp((prev) => ({
              ...prev,
              [Number(orderId)]: true, // Marcar el pedido como "tiempo agotado"
            }));
          }
        });
        return newCountdown; // Actualizar el estado para re-renderizar
      });
    }, 1000);

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, [countdown, isTimeUp]);

  return (
    <div className="container mt-5">
      <div className="row">
        {orders
          .filter((order) => order.state === 'PREPARATION')
          .map((order) => {
            const timeLeft = remainingTime(order.id);
            const formattedTime = formatTime(timeLeft);

            return (
              <div key={order.id} className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Orden #{order.id}</h5>
                    <div className="card-text">
                      <strong>Cliente</strong> {order.userName} {order.userLastName}
                      <br />
                      <strong>Tiempo estimado </strong> {sumCookingTime(order.orderDetails)}
                      <br />
                      <strong>Fecha del pedido</strong>
                      {order.dateTime && (
                        new Date(order.dateTime).toLocaleString()
                      )}
                      <br />
                    </div>

                    <div className="button-container">
                      {//order.orderDetails.length > 0 && (
                        <div>
                          <button className="buttonProductosC" onClick={() => handleShowModal(order.orderDetails)}>
                            Ver Productos
                          </button>
                        </div>
                        //)
                      }

                      <div className="mt-3">
                        {isCountdownStarted[order.id] && timeLeft > 0 ? (
                          <div>
                            <p className="cuenta">
                              {formattedTime}
                            </p>

                            <div className="mt-2">
                              <Button variant="warning" onClick={() => adjustTime(order.id, -60)}>
                                Restar 1 Minuto
                              </Button>
                              <Button variant="success" onClick={() => adjustTime(order.id, 60)} className="ms-2">
                                Añadir 1 Minuto
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <button className="buttonCocinar"
                            //variant={isTimeUp[order.id] ? 'danger' : 'secondary'}
                            onClick={() => {
                              if (isTimeUp[order.id]) {
                                // Cambiar el estado
                                handleChangeOrderState(order.id);
                              } else {
                                // Iniciar la cuenta regresiva
                                handleStartCountdown(order.id, order.estimatedTime);
                              }
                            }}
                          >
                            {isTimeUp[order.id] ? 'Tiempo Agotado - Cambiar Estado' : 'A cocinar!'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <ModalProduct orderDetails={currentOrderDetails} show={showModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default Cocinero;
