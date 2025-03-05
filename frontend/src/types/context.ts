export type Language = 'es' | 'en' | 'pt';

export interface LanguageContextProps {
	language: Language;
	setLanguage: (language: Language) => void;
}