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

  // Recuperar estado del contador desde localStorage
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

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const getCookingTime = (orderDetails: OrderDetail[]) => {
    let maxCookingTime = 0;

    orderDetails.forEach((detail) => {
      if (detail.itemManufacturedProduct && detail.itemManufacturedProduct.cookingTime) {
        const cookingTime = detail.itemManufacturedProduct.cookingTime;
        const quantity = detail.quantity;
        const [hours, minutes, seconds] = cookingTime.split(':').map((str) => parseInt(str));
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;

        // Multiplicar por la cantidad y sumar al total
        maxCookingTime += totalSeconds * quantity;
      }
    });


    return maxCookingTime;
  };

  const handleStartCountdown = (orderId: number, orderDetails: OrderDetail[]) => {
    const cookingTimeInSeconds = getCookingTime(orderDetails);
    if (cookingTimeInSeconds === 0) return; // No iniciar si no hay tiempo válido

    const cookingTimeInMs = new Date().getTime() + cookingTimeInSeconds * 1000;

    setCountdown((prev) => {
      const newCountdown = { ...prev, [orderId]: cookingTimeInMs };
      localStorage.setItem('countdown', JSON.stringify(newCountdown));
      return newCountdown;
    });

    setIsCountdownStarted((prev) => {
      const newIsCountdownStarted = { ...prev, [orderId]: true };
      localStorage.setItem('isCountdownStarted', JSON.stringify(newIsCountdownStarted));
      return newIsCountdownStarted;
    });
  };

  const handleChangeOrderState = async (orderId: number) => {
    try {
      const updatedOrder = await update(OrderStatus.READY, orderId);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, state: updatedOrder.state } : order
        )
      );
    } catch (err) {
      console.error('Error al editar el pedido');
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

  const adjustTime = (orderId: number, amount: number) => {
    setCountdown((prev) => {
      const newCountdown = { ...prev };
      if (newCountdown[orderId]) {
        newCountdown[orderId] += amount * 1000;
        localStorage.setItem('countdown', JSON.stringify(newCountdown));
      }
      return newCountdown;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        const newCountdown = { ...prev };
        Object.keys(newCountdown).forEach((orderId) => {
          const timeLeft = remainingTime(Number(orderId));
          if (timeLeft <= 0 && !isTimeUp[Number(orderId)]) {
            setIsTimeUp((prev) => ({
              ...prev,
              [Number(orderId)]: true,
            }));
          }
        });
        return newCountdown;
      });
    }, 1000);

    return () => clearInterval(interval);
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
                      <strong>Fecha del pedido</strong>{order.dateTime && (
                        new Date(order.dateTime).toLocaleString()
                      )}
                      <br />
                    </div>

                    <div className="button-container">
                      <button className="buttonProductosC" onClick={() => handleShowModal(order.orderDetails)}>
                        Ver Productos
                      </button>

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
                            onClick={() => {
                              if (isTimeUp[order.id]) {
                                handleChangeOrderState(order.id);
                              } else {
                                handleStartCountdown(order.id, order.orderDetails);
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
