import { createContext } from 'react';
import { AuthContextType } from '@/types/authContext.ts';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);