import { useEffect, useRef } from 'react';
import { Notification } from '@/types/notificationContext';
import { useNotification } from '@/hooks/useNotification';
import { RxCross2 } from "react-icons/rx";


const NotificationItem: React.FC<{notification: Notification}> = ({ notification }) => {

  // useNotification hook
  const { removeNotification } = useNotification();

  // useRef to store the timer
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Delete notification after 5 seconds
  useEffect(() => {
    // Configuramos el timer una sola vez al montar el componente
    timerRef.current = setTimeout(() => {
      removeNotification(notification.id);
    }, 3000);

    return () => {
      // Limpiamos el timer al desmontar
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // Nota: si removeNotification está memorizado (por ejemplo, con useCallback)
    // y notification.id no cambia, podemos dejar el array de dependencias vacío.
  }, [notification.id, removeNotification]);

  // Función para eliminar la notificación de forma manual
  const handleRemove = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    removeNotification(notification.id);
  };

  // Assign a background color based on the notification type
  const backgroundClass =
    notification.type === 'success'
      ? 'bg-text-tertiary/80'
      : 'bg-red-400/80';

  return (
    <div className={`text-white relative p-4 w-52 md:w-64 rounded-sm mb-2 ${backgroundClass} overflow-hidden animate-slideInRight`}>
      <p className='font-bold text-xs md:text-sm mt-1.5'>{notification.message}</p>
      {/* Botón para eliminar la notificación */}
      <RxCross2
        onClick={() => handleRemove()}
        className="font-bold text-sm absolute top-1.5 right-1.5 rounded hover:cursor-pointer duration-200 transition-all"
      />
      {/* Barra de progreso */}
      <div className="absolute bottom-0 left-0 h-1 bg-white opacity-90 w-full animate-progressBar" />
    </div>
  );
};

export default NotificationItem;
