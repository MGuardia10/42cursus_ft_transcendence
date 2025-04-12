import { translations } from '@/context/Language/translations';

export type Language = 'es' | 'en' | 'pt';

export interface LanguageContextProps {
	language: Language;
	setLanguage: (language: Language) => void;
	t: (key: keyof typeof translations["es"]) => string;
}