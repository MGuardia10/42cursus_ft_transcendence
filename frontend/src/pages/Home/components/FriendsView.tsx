import { useState } from 'react';
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { useLanguage } from '@/hooks/useLanguage';
import { useNotification } from '@/hooks/useNotification';

interface Friend {
  id: number;
  name: string;
  photo: string;
  online: boolean;
}

interface FriendRequest {
  id: number;
  name: string;
  photo: string;
}

const FriendsView: React.FC = () => {

  // useLanguage hook
  const { t } = useLanguage();

  // useNotification hook
  const { addNotification } = useNotification();

  // Estado para cambiar entre vista de amigos y solicitudes.
  const [view, setView] = useState<'friends' | 'requests'>('friends');

  // Datos de ejemplo para amigos.
  const friends: Friend[] = [
    { id: 1, name: 'Juan', photo: 'https://randomuser.me/api/portraits/men/8.jpg', online: true },
    { id: 2, name: 'Ana', photo: 'https://randomuser.me/api/portraits/men/9.jpg', online: false },
    { id: 3, name: 'Ana', photo: 'https://randomuser.me/api/portraits/men/9.jpg', online: false },
    { id: 4, name: 'Ana', photo: 'https://randomuser.me/api/portraits/men/9.jpg', online: false },
    { id: 5, name: 'Ana', photo: 'https://randomuser.me/api/portraits/men/9.jpg', online: false },
    { id: 6, name: 'Ana', photo: 'https://randomuser.me/api/portraits/men/9.jpg', online: false },
    { id: 7, name: 'Ana', photo: 'https://randomuser.me/api/portraits/men/9.jpg', online: false },
    { id: 8, name: 'Ana', photo: 'https://randomuser.me/api/portraits/men/9.jpg', online: false },
    { id: 9, name: 'Ana', photo: 'https://randomuser.me/api/portraits/men/9.jpg', online: false },
    // Puedes agregar más amigos aquí
  ];

  // Datos de ejemplo para solicitudes de amistad.
  const friendRequests: FriendRequest[] = [
    { id: 3, name: 'Carlos', photo: 'https://randomuser.me/api/portraits/men/10.jpg' },
    // Puedes agregar más solicitudes aquí
  ];

  // Función para aceptar una solicitud.
  const acceptRequest = (id: number) => {
    console.log(`Solicitud de amistad aceptada: ${id}`);
    // Aquí iría la lógica para aceptar la solicitud.
    addNotification('Friend request accepted!', 'success');
  };

  // Función para rechazar una solicitud.
  const rejectRequest = (id: number) => {
    console.log(`Solicitud de amistad rechazada: ${id}`);
    // Aquí iría la lógica para rechazar la solicitud.
    addNotification('Friend request rejected!', 'error');
  };

  return (
    <div className="flex flex-col gap-2 md:gap-6 h-full p-5 sm:p-6 md:p-8 w-full">
      {/* Botones para cambiar la vista */}
      <div className="flex items-center text-sm md:text-base">
        <button
          className={`px-2 md:px-4 hover:cursor-pointer ${view === 'friends' ? 'text-text-secondary' : 'hover:text-text-tertiary transition-all duration-300'}`}
          onClick={() => setView('friends')}
        >
          { t("home_friends") }
        </button>
        <hr className='h-full border border-gray-800'/>
        <button
          className={`px-2 md:px-4 hover:cursor-pointer ${view === 'requests' ? 'text-text-secondary' : 'hover:text-text-tertiary transition-all duration-300'}`}
          onClick={() => setView('requests')}
        >
          { t("home_requests") }
        </button>
      </div>

	  <hr className='mb-1 md:mb-0 md:-mt-2 w-full border border-gray-800' />

      {/* Vista de Amigos */}
      {view === 'friends' && (
        <div className="grid grid-cols-1 gap-3 overflow-y-scroll scrollbar-thin h-full">
          {friends.map((friend) => (
            <div key={friend.id} className="flex items-center px-4 py-3 rounded-sm bg-background-hover border-2 border-background-secondary">
              <img src={friend.photo} alt={friend.name} className="w-12 h-12 rounded-full border-2 border-text-tertiary mr-4" />
              <div>
                <p className="font-semibold">{friend.name}</p>
                <p className={`text-sm ${friend.online ? 'text-green-500' : 'opacity-50 text-red-500'}`}>
                  {friend.online ? `${ t("home_online") }` : `${ t("home_offline") }` }
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista de Solicitudes de amistad */}
      {view === 'requests' && (
        <div className="grid grid-cols-1 gap-3 overflow-y-scroll scrollbar-thin">
          {friendRequests.map((request) => (
            <div key={request.id} className="flex items-center p-4 rounded-sm bg-background-hover border-2 border-background-secondary">
              <img src={request.photo} alt={request.name} className="w-12 h-12 rounded-full border-2 border-text-tertiary mr-4" />
              <div className="flex-1">
                <p className="font-semibold">{request.name}</p>
              </div>
              <div className='flex gap-2 md:gap-4'>
                <FaCheck 
                  className="text-green-500 hover:cursor-pointer hover:text-green-300 transition-all duration-300" 
                  onClick={() => acceptRequest(request.id)}
                />
                <ImCross
                  className="text-red-500 hover:cursor-pointer hover:text-red-300 transition-all duration-300"
                  onClick={() => rejectRequest(request.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsView;
