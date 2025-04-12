import { useState } from 'react';
import { HiSearch } from "react-icons/hi";
import { IoPersonAddSharp } from "react-icons/io5";
import { IoPersonRemoveSharp } from "react-icons/io5";
import { CgSandClock } from "react-icons/cg";

import { useLanguage } from '@/hooks/useLanguage';
import { useNotification } from '@/hooks/useNotification';


const UsersSearch: React.FC = () => {

	// useLanguage hook
	const { t } = useLanguage();

	// useNotification hook
	const { addNotification } = useNotification();

	// useState for search query
	const [query, setQuery] = useState("");
  
    // Lista de elementos a buscar (simula datos de la API)
    const items = ["Apple", "Banana", "Cherry", "Date", "Grape", "Orange", "Watermelon"];

    // Filtrar elementos según el texto ingresado
    const filteredItems = items.filter(item => item.toLowerCase().includes(query.toLowerCase()));

	// Function to handle addFriend
	const handleAddFriend = (friend: string) => {
		// Aquí puedes agregar la lógica para agregar el amigo
		console.log(`Agregando amigo: ${friend}`);
		addNotification(`${t("notifications_friend_request")}`, 'success');
		// addNotification(`${t("notifications_friends_error")}`, 'error');
	};

	// Function to handle removeFriend
	const handleRemoveFriend = (friend: string) => {
		// Aquí puedes agregar la lógica para eliminar el amigo
		console.log(`Eliminando amigo: ${friend}`);
		addNotification(`${t("notifications_friend_remove")}`, 'success');
		// addNotification(`t(${"notifications_friends_error")}`, 'error');
	};

	return (
		<div className="relative md:max-w-md mx-auto">
      	    {/* Search Input */}
			<input
				type="text"
				id='search'
				placeholder={t("search_placeholder")}
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				className="py-1.5 px-2 md:py-2.5 md:px-3 w-32 md:w-full focus:outline-none focus:ring-2 focus:ring-text-tertiary bg-background-secondary text-xs"
			/>

			<HiSearch className="absolute top-1/2 right-2 md:right-3 transform -translate-y-1/2 text-sm md:text-base" />

      		{/* List of results */}
			{query.length > 0 && (
				<ul className="absolute w-50 md:w-64 mt-2 -ml-1 bg-background-secondary border border-background-primary rounded-xs overflow-hidden z-10 shadow-[6px_6px_6px_rgba(54,65,83,0.7)]">
					{(filteredItems.length > 0) ? (
						filteredItems.map((item, index) => (
							<li key={index} className="flex items-center justify-between py-3 px-2 border-b mx-2 border-gray-700 last:border-none">
								<p className='text-gray-200 text-sm md:text-base'>
									{item}
								</p>
								<button 
									className='bg-text-tertiary p-2 rounded-xs hover:bg-text-secondary transition-all duration-300 hover:cursor-pointer'
									onClick={() => {handleAddFriend(item)}
									}
								>
									<IoPersonAddSharp className="text-sm md:text-base font-bold" />
								</button>
								<button 
									className='bg-red-700/80 p-2 rounded-xs hover:bg-red-600 transition-all duration-300 hover:cursor-pointer'
									onClick={() => {handleRemoveFriend(item)}}
								>
									<IoPersonRemoveSharp className="text-sm md:text-base font-bold" />
								</button>
								<button 
									className='p-2 rounded-xs bg-gray-500 cursor-not-allowed'
								>
									<CgSandClock className="text-sm md:text-base font-bold" />
								</button>
							</li>
						))
						) : (
						<li className="text-sm md:text-base p-3 text-gray-500">{t("search_no_results")}</li>
					)}
				</ul>
			)}
    	</div>
	);
};

export default UsersSearch;