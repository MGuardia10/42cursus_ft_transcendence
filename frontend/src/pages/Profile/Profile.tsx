import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

import { VscFolderActive } from "react-icons/vsc";
import { VscFolder } from "react-icons/vsc";

const Profile: React.FC = () => {

  // States for each field
  const [name, setName] = useState<string>('');
  const [alias, setAlias] = useState<string>('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);

  // useLanguage hook
  const { t } = useLanguage();

  const handleNameSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lógica para actualizar el nombre en su endpoint
    console.log('Actualizando nombre:', name);
  };

  const handleAliasSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lógica para actualizar el alias en su endpoint
    console.log('Actualizando alias:', alias);
  };

  const handleAvatarSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lógica para actualizar el avatar en su endpoint
    console.log('Actualizando avatar:', avatar);

	// Manejar cuando llega null !!!!

  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled((prev) => !prev);
	// Se cambia el valor al re-renderizar componente, por lo que false cuando entra en esta funcion es true y viceversa. Tener en cuenta cuando API sea implementada
	console.log('Actualizando autenticación en dos factores:', twoFactorEnabled);
  };

  return (
    <div className="w-full rounded-md mx-auto p-6 md:p-10 bg-background-secondary">
      <h1 className="text-xl md:text-3xl font-bold mb-6">{ t('user_settings_h1') }</h1>

      {/* Formulario para actualizar el nombre */}
      <form onSubmit={handleNameSubmit} className="flex flex-col gap-2 md:gap-2.5 mb-6">
		<label htmlFor="name" className="inline-block text-sm font-medium">
			{ t('user_settings_name') }
		</label>
		<div className="flex flex-row gap-2 md:gap-3">
			<input
				id="name"
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="Miguel Guardia"
				className="flex-1 p-1.5 md:p-2 text-sm md:text-base border rounded-xs focus:outline-none focus:ring focus:border-blue-300"
				required
				autoComplete='off'
			/>
			<button
				type="submit"
				className="bg-text-secondary text-sm md:text-base text-white p-1.5 md:p-2 rounded-xs hover:bg-text-tertiary hover:cursor-pointer transition-all duration-300"
			>
			{ t('user_settings_submit') }
			</button>
		</div>
	  </form>

      {/* Formulario para actualizar el alias */}
	  <form onSubmit={handleAliasSubmit} className="flex flex-col gap-2 md:gap-2.5 mb-6">
		<label htmlFor="alias" className="inline-block text-sm font-medium">
			{ t('user_settings_alias') }
		</label>
		<div className='flex flex-row gap-2 md:gap-3'>
			<input
				id="alias"
				type="text"
				value={alias}
				onChange={(e) => setAlias(e.target.value)}
				placeholder="mguardia"
				className="flex-1 p-1.5 md:p-2 text-sm md:text-base border rounded-xs focus:outline-none focus:ring focus:border-blue-300"
				required
			/>
			<button
				type="submit"
				className="bg-text-secondary text-white p-1.5 md:p-2 text-sm md:text-base rounded-xs hover:bg-text-tertiary hover:cursor-pointer transition-all duration-300"
			>
				{ t('user_settings_submit') }
			</button>
		</div>
      </form>

      {/* Formulario para actualizar el avatar */}
      <form onSubmit={handleAvatarSubmit} className="flex flex-col mb-6">
		<div className='flex flex-col gap-2.5'>
			<div className="inline-block whitespace-nowrap text-sm font-medium">
			{ t('user_settings_avatar') }
			</div>
			<div className='flex flex-row gap-2 md:gap-3'>
				<label
					htmlFor="avatar"
					className="text-sm md:text-base cursor-pointer flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xs border"
				>
					{ avatar ? <VscFolderActive className='text-text-tertiary'/> : <VscFolder /> }
					<p className='inline-block whitespace-nowrap'>{ t("user_settings_upload") }</p>
				</label>
				<input
					id="avatar"
					type="file"
					accept="image/*"
					onChange={handleAvatarChange}
					className="hidden"
				/>
				<button
				type="submit"
				className="text-sm md:text-base text-white p-1.5 md:p-2 rounded-xs bg-text-secondary hover:bg-text-tertiary hover:cursor-pointer transition-all duration-300"
				>
					{ t('user_settings_submit') }
				</button>
			</div>
		</div>
		{ avatar && (
		<div>
			<img
			src={ URL.createObjectURL(avatar) }
			alt="Vista previa del avatar"
			className="mt-6 h-20 w-20 object-cover rounded-full border"
			/>
		</div>
		)}
      </form>

      {/* Formulario para actualizar la autenticación en dos factores */}
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
    </div>
  );
};

export default Profile;



/*
	- Change username
	- Change alias for tournaments
	- Change profile picture
	- Configure two-factor authentication
*/