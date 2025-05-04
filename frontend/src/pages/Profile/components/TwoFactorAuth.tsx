import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useToggleTFA } from '@/hooks/useToggleTFA';
import { useNotification } from '@/hooks/useNotification';

const TwoFactorAuth: React.FC = () => {

	/* useAuth hook */
	const { user, refreshUser } = useAuth();
	
	/* useNotification hook */
	const { addNotification } = useNotification();

	/* useUpdateAlias hook */
	const { toggleTFA, error } = useToggleTFA();

	/* useLanguage hook */
	const { t } = useLanguage();
	
	/* useState hook */
	const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(user?.tfa || false);
	
	/* Function to handle the toggle of two-factor authentication */
	const handleTwoFactorToggle = async () => {

		// change tfa value in the backend
		await toggleTFA(!twoFactorEnabled);

		// Check for errors
		if (error) {
			addNotification(error, 'error');
			return;
		}
		
		// Refresh user data
		await refreshUser();
		
		// Show notification
		addNotification(
			!twoFactorEnabled
			? t('notifications_two_factor_success')
			: t('notifications_two_factor_disabled'),
			'success'
		);

		// Set 2FA state
		setTwoFactorEnabled((prev) => !prev);
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