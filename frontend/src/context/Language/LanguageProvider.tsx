import { useState, useEffect, useCallback, ReactNode } from 'react';
import { LanguageContext } from '@/context/Language/LanguageContext';
import { Language } from '@/types/languageContext';
import { translations } from '@/context/Language/translations';

import { useAuth } from '@/hooks/useAuth';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

	/* useAuth hook */
	const { user, isAuthenticated } = useAuth();
	
	/* default language */
	const defaultLang: Language =
    	(isAuthenticated && user?.language as Language) || 
    	(localStorage.getItem('lang') as Language) ||
    	(import.meta.env.VITE_DEFAULT_LANGUAGE as Language) || 
		'en';

		console.log("default: ", defaultLang);
		
	const [language, setLanguageState] = useState<Language>(defaultLang);
		
	/* Syncronize user language */
	useEffect(() => {
		// Si el usuario trae un idioma, lo uso
		if (isAuthenticated && user?.language) {
			setLanguageState(user.language as Language);
		}
	}, [isAuthenticated, user?.language])
		
		console.log("languaje after useeffect: ", language);
		
		/* Set language function */
		const setLanguage = useCallback(
			async (lang: Language) => {
				console.log("languaje setLanguage: ", language);
				setLanguageState(lang)
				localStorage.setItem('lang', lang)
				
				if (isAuthenticated) {
					await fetch(`${import.meta.env.VITE_AUTH_API_BASEURL_EXTERNAL}/update`, {
						method: 'POST',
						credentials: 'include',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ language: lang }),
					}
				)
			}
		}, [isAuthenticated, language]);
		
		console.log("languaje: ", language);
	/* use translations */
	const t = (key: keyof typeof translations["es"]) => translations[language][key];

	return (
		<LanguageContext.Provider value={{ language, setLanguage, t }}>
			{children}
		</LanguageContext.Provider>
	);
};
