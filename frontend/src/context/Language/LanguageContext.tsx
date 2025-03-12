import { createContext } from 'react';
import { LanguageContextProps } from '@/types/languageContext';

export const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);