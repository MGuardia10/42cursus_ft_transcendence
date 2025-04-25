export interface routeProps {
	children?: React.ReactNode;
  }

export interface User {
	id: string;
	language: string;
	name: string;
	alias: string;
	email: string;
	avatar?: string;
	tfa: boolean;
}

export interface AuthContextType {
	user: User | null;
	loading: boolean;
	isAuthenticated: boolean;
	login: () => void;
	logout: () => Promise<void>;
	refreshUser: () => Promise<void>;
}