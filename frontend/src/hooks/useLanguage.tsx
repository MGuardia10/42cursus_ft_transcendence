import { useContext } from 'react';
import { LanguageContextProps } from '@/types/languageContext';
import { LanguageContext } from '@/context/Language/LanguageContext';

export const useLanguage = (): LanguageContextProps => {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error('useLanguage must be used within a LanguageProvider');
	}
	return context;
};