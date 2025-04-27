import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

const TwoFactorAuth: React.FC = () => {

	// useLanguage hook
	const { t } = useLanguage();

	// useState hook
	const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);
	
	// Function to handle the toggle of two-factor authentication
	const handleTwoFactorToggle = () => {
		setTwoFactorEnabled((prev) => !prev);
		// Se cambia el valor al re-renderizar componente, por lo que false cuando entra en esta funcion es true y viceversa. Tener en cuenta cuando API sea implementada
		console.log('Actualizando autenticación en dos factores:', twoFactorEnabled);
	};
	
	return (
		<form>
        <div className="flex items-center gap-4">
		  <label htmlFor="twoFactor" className="text-sm font-medium">
		  { t('user_settings_two_factor') }
		  </label>
          <button
		  	id='twoFactor'
            type="button"
            onClick={handleTwoFactorToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none hover:cursor-pointer ${
              twoFactorEnabled ? 'bg-text-secondary' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block w-4 h-4 bg-white rounded-full transform transition-transform ${
                twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            ></span>
          </button>
        </div>
      </form>
	);
};

export default TwoFactorAuth;