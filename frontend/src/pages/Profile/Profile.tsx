import { useLanguage } from '@/hooks/useLanguage';

import DeleteAccount from '@/pages/Profile/components/DeleteAccount';
import TwoFactorAuth from '@/pages/Profile/components/TwoFactorAuth';
import AvatarUpdate from '@/pages/Profile/components/AvatarUpdate';
import AliasUpdate from '@/pages/Profile/components/AliasUpdate';
// import NameUpdate from './components/NameUpdate';

const Profile: React.FC = () => {

  // useLanguage hook
  const { t } = useLanguage();

  return (
    <div className="w-full rounded-md mx-auto p-6 md:p-10 bg-background-secondary">
      <h1 className="text-xl md:text-3xl font-bold mb-6">{ t('user_settings_h1') }</h1>

      {/* Formulario para actualizar el alias */}
	  <AliasUpdate />

      {/* Formulario para actualizar el avatar */}
	  <AvatarUpdate />

      {/* Formulario para actualizar la autenticación en dos factores */}
	  <TwoFactorAuth />

	  {/* Botón para eliminar la cuenta */}
	  <DeleteAccount />

	</div>
  );
};

export default Profile;
