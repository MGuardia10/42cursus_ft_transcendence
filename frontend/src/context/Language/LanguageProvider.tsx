import React, { useState, ReactNode } from 'react';
import { LanguageContext } from '@/context/Language/LanguageContext';
import { Language } from '@/types/context';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [language, setLanguage] = useState<Language>('es');

	return (
		<LanguageContext.Provider value={{ language, setLanguage }}>
			{children}
		</LanguageContext.Provider>
	);
};
