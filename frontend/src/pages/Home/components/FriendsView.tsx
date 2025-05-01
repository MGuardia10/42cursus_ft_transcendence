import { useState } from 'react';
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";

// import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useNotification } from '@/hooks/useNotification';
import { useFriends } from '@/hooks/useFriends';
import { Friend } from '@/types/friendsContext';

const FriendsView: React.FC = () => {

  /* useLanguage hook */
  const { t } = useLanguage();
  
  /* useAuth hook */
  // const { user } = useAuth();

  /* useNotification hook */
  const { addNotification } = useNotification();

  /* useState to set view */
  const [view, setView] = useState<'friends' | 'requests'>('friends');

  /* useFriends hook */
  const { friends, pending, acceptRequest, declineRequest }: { friends: Friend[], pending: Friend[], acceptRequest: (toUserId: number) => Promise<boolean>, declineRequest: (toUserId: number) => Promise<boolean> } = useFriends();

  /* Function to handle accept a friend request */
  const handleAcceptRequest = async (id: number) => {
    
    // send request to accept
    await acceptRequest(id);

    // add notification of success
    addNotification(`${t("notifications_friend_request_accepted")}`, 'success');
  };
  
  /* Function to handle decline a friend request */
  const handleDeclineRequest = async (id: number) => {

    // send request to accept
    await declineRequest(id);

    // add notification of success
    addNotification(`${t("notifications_friend_request_rejected")}`, 'success');
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
        <div className="grid grid-cols-1 gap-3 overflow-y-scroll scrollbar-thin">
          {friends.map((friend) => (
            <div key={friend.id} className="flex items-center px-4 py-3 rounded-sm bg-background-hover border-2 border-background-secondary">
              <img src={friend.avatar} alt={friend.alias} className="w-12 h-12 rounded-full border-2 border-text-tertiary mr-4 object-cover" />
              <div>
                <p className="font-semibold">{friend.alias}</p>
                <p className={`text-sm ${friend.alias ? 'text-green-500' : 'opacity-50 text-red-500'}`}>
                  {friend.alias ? `${ t("home_online") }` : `${ t("home_offline") }` }
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista de Solicitudes de amistad */}
      {view === 'requests' && (
        <div className="grid grid-cols-1 gap-3 overflow-y-scroll scrollbar-thin">
          {pending.filter( (friend): friend is Friend => friend.from === friend.id ).map((request) => (
            <div key={request.id} className="flex items-center px-4 py-3 rounded-sm bg-background-hover border-2 border-background-secondary">
              <img src={request.avatar} alt={request.alias} className="w-12 h-12 rounded-full border-2 border-text-tertiary mr-4 object-cover" />
              <div className="flex-1">
                <p className="font-semibold">{request.alias}</p>
              </div>
              <div className='flex gap-2 md:gap-4'>
                <FaCheck 
                  className="text-green-500 hover:cursor-pointer hover:text-green-300 transition-all duration-300" 
                  onClick={() => handleAcceptRequest(request.id)}
                />
                <ImCross
                  className="text-red-500 hover:cursor-pointer hover:text-red-300 transition-all duration-300"
                  onClick={() => handleDeclineRequest(request.id)}
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
