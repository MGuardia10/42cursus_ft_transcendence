import { useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useNotification } from "@/hooks/useNotification";
import TwoFactorInput from '@/pages/TwoFactorAuth/components/TwoFactorInput';

const TwoFactorAuth: React.FC = () => {

	/* useParams hook to get the params from the URL */
	const [searchParams] = useSearchParams();
	const hash = searchParams.get('hash') || '';

	/* useNavigate hook to redirect */
	const navigate = useNavigate();

	/* useNotification hook */
	const { addNotification } = useNotification();

	/* useState hook to reset the input */
	const [resetKey, setResetKey] = useState(0);

	/* Make setTimeout a promise to manage set cookie from backend correctly */
	const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

	/* Function to handle 2FA */
	const handleCodeComplete = useCallback(async (code: string) => {

		try {
			const response = await fetch(`${ import.meta.env.VITE_AUTH_API_BASEURL_EXTERNAL }/tfa`, {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json',
			  },
			  credentials: 'include',
			  body: JSON.stringify({ hash, code }),
			});
	  
			if (response.status === 200) {

				/* Wait 3 seconds */
				await sleep(1500);
				addNotification('Login Successful!', 'success');
				await sleep(1000);
				/* Redirect to the home page */
				window.location.assign(`${import.meta.env.VITE_FRONTEND_BASEURL_EXTERNAL}/`);

			} else if (response.status === 401) {

				/* Write error */
				await sleep(1000);
				addNotification('Invalid code! Try again.', 'error');
				setResetKey((k) => k + 1);
				
			} else if (response.status === 429) {
				
				/* Write errors */
				await sleep(1000);
				addNotification('Too many attemps!', 'error');
				await sleep(500);
				addNotification('Redirecting to login...', 'error');
				await sleep(2000);

				/* Redirect to login page */
				navigate('/login', { replace: true });

			} else {

				/* Write errors */
				await sleep(1000);
				addNotification('Error checking code!', 'error');
				await sleep(500);
				addNotification('Redirecting to login...', 'error');
				await sleep(1000);

				/* redirect to login */
				navigate('/login', { replace: true });
			}

		} catch (e) {

			/* Write errors */
			await sleep(1000);
			addNotification(`Error: ${e}`, 'error');
			await sleep(500);
			addNotification('Redirecting to login...', 'error');
			await sleep(1000);

			/* redirect to login */
			navigate('/login', { replace: true });

		}
	}, [hash, addNotification, navigate]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			<TwoFactorInput onComplete={handleCodeComplete} resetKey={resetKey} />
		</div>
	);
};

export default TwoFactorAuth;
  