import { createContext } from 'react';
import { LanguageContextProps } from '@/types/context';

export const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);