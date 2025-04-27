import { useState, useEffect, useCallback, ReactNode } from 'react';
import { LanguageContext } from '@/context/Language/LanguageContext';
import { Language } from '@/types/languageContext';
import { translations } from '@/context/Language/translations';

import { useAuth } from '@/hooks/useAuth';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

	/* useAuth hook */
	const { user, isAuthenticated, loading } = useAuth();

	/* Set one language as a fallback */
	const FALLBACK: Language = 'en';
		
	const [language, setLanguageState] = useState<Language>(FALLBACK);
		
	/* Syncronize user language */
	useEffect(() => {

		// if loading, return
		if (loading) return ;

		// If user is authenticated and has a language, set it
		if (isAuthenticated && user?.language) {
			setLanguageState(user.language as Language);
			return ;
		}

		// If no User data for language, read localstorage or set default lang
		const saved = localStorage.getItem('lang') as Language | null
		const envDefault = import.meta.env.VITE_DEFAULT_LANGUAGE as Language | undefined
	
		setLanguageState(
		  saved
		  || (envDefault && ['en','es','pt'].includes(envDefault) ? envDefault : FALLBACK)
		)
	}, [loading, isAuthenticated, user?.language])
				
		/* Set language function */
	const setLanguage = useCallback(
		async (lang: Language) => {
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
	}, [isAuthenticated]);
		
	/* use translations */
	const t = (key: keyof typeof translations["es"]) => translations[language][key];

	return (
		<LanguageContext.Provider value={{ language, setLanguage, t }}>
			{children}
		</LanguageContext.Provider>
	);
};
