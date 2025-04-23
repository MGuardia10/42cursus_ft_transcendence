// Define la forma de tu usuario
export interface User {
	id: string;
	name: string;
	email: string;
	avatar?: string;
}

// Qué ofrece el contexto
export interface AuthContextType {
	user: User | null;
	loading: boolean;
	isAuthenticated: boolean;
	login: () => void;
	logout: () => Promise<void>;
	refreshUser: () => Promise<void>;
}