import React, { useEffect, useState } from 'react';

interface CountdownProps {
  orderId: number;
  estimatedTime: string;
  onTimeUp: (orderId: number) => void;
}

const Countdown: React.FC<CountdownProps> = ({ orderId, estimatedTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isCountdownStarted, setIsCountdownStarted] = useState<boolean>(false);
  const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isCountdownStarted) return;

    const [hours, minutes, seconds] = estimatedTime.split(':').map((str) => parseInt(str));
    const estimatedTimeInMs = new Date().getTime() + (hours * 3600 + minutes * 60 + seconds) * 1000;
    setTimeLeft(estimatedTimeInMs - new Date().getTime());

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        const updatedTime = prevTime - 1000;
        if (updatedTime <= 0) {
          clearInterval(interval);
          onTimeUp(orderId); // Notificamos que el tiempo se agotó
        }
        return updatedTime;
      });
    }, 1000);

    setCountdownInterval(interval);

    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval); // Limpiar el intervalo si el temporizador se detiene
      }
    };
  }, [isCountdownStarted, estimatedTime, orderId, onTimeUp]);

  const formatTime = (timeInMs: number) => {
    const hours = Math.floor(timeInMs / 3600000);
    const minutes = Math.floor((timeInMs % 3600000) / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div>
      {!isCountdownStarted ? (
        <button className="btn btn-primary" onClick={() => setIsCountdownStarted(true)}>
          Iniciar Cuenta Regresiva
        </button>
      ) : (
        <button disabled className="btn btn-secondary">
          {timeLeft > 0 ? `Faltan: ${formatTime(timeLeft)}` : 'Tiempo Agotado'}
        </button>
      )}
    </div>
  );
};

export default Countdown;
