import { createContext } from 'react';
import { FriendsContextType } from '@/types/friendsContext';

export const FriendsContext = createContext<FriendsContextType | undefined>(undefined);