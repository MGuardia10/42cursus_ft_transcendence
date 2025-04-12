import React, { useState, ReactNode } from 'react';
import { LanguageContext } from '@/context/Language/LanguageContext';
import { Language } from '@/types/languageContext';
import { translations } from '@/context/Language/translations';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [language, setLanguage] = useState<Language>('es');

	const t = (key: keyof typeof translations["es"]) => translations[language][key];

	return (
		<LanguageContext.Provider value={{ language, setLanguage, t }}>
			{children}
		</LanguageContext.Provider>
	);
};
