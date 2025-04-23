import TwoFactorInput from '@/pages/TwoFactorAuth/components/TwoFactorInput';

const TwoFactorAuth: React.FC = () => {

	/* Function to handle 2FA */
	const handleCodeComplete = async (code: string) => {

		// try {
		// 	const response = await fetch('/login/tfa', {
		// 	  method: 'POST',
		// 	  headers: {
		// 		'Content-Type': 'application/json',
		// 	  },
		// 	  credentials: 'include', // si usas cookies
		// 	  body: JSON.stringify({ code }),
		// 	});
	  
		// 	if (response.status === 200) {
		// 	  console.log('Autenticación 2FA exitosa');
		// 	  // redirige al dashboard u otra página
		// 	} else if (response.status === 401) {
		// 	  alert('Código incorrecto. Inténtalo de nuevo.');
		// 	} else if (response.status === 429) {
		// 	  alert('Límite de intentos alcanzado. Inténtalo más tarde.');
		// 	} else {
		// 	  alert('Error inesperado. Intenta nuevamente.');
		// 	}
		// } catch (error) {
		// 	console.error('Error al verificar 2FA:', error);
		// 	alert('Error de red. Verifica tu conexión.');
		// }

		await new Promise((resolve) => setTimeout(resolve, 2000));
		console.log('Código 2FA ingresado:', code);
		// aquí llamas a tu API para verificar el 2FA...
	};

	return (
		<div className="min-h-screen flex items-center justify-center">
			<TwoFactorInput onComplete={handleCodeComplete} />
		</div>
	);
};

export default TwoFactorAuth;
  