import { useContext } from 'react';
import { FriendsContext } from '@/context/Friends/FriendsContext';

export function useFriends() {
	const ctx = useContext(FriendsContext);
	if (!ctx) throw new Error('useFriends debe usarse dentro de <FriendsProvider>');
	return ctx;
  }