export interface TwoFactorInputProps {
	length?: number;
	onComplete: (code: string) => Promise<void>;
	resetKey?: number;
}