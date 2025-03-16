import React from 'react';
import { useState } from 'react';
import { HiSearch } from "react-icons/hi";
import { useLanguage } from '@/hooks/useLanguage';

const UsersSearch: React.FC = () => {

	const { t } = useLanguage();
	const [query, setQuery] = useState("");
  
    // Lista de elementos a buscar (simula datos de la API)
    const items = ["Apple", "Banana", "Cherry", "Date", "Grape", "Orange", "Watermelon"];

    // Filtrar elementos según el texto ingresado
    const filteredItems = items.filter(item => item.toLowerCase().includes(query.toLowerCase()));

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
				<ul className="absolute w-full mt-1 bg-black border border-gray-300 shadow-lg rounded-lg overflow-hidden z-10">
					{(filteredItems.length > 0) ? (
						filteredItems.map((item, index) => (
							<li key={index} className="p-2 border-b last:border-none hover:bg-gray-100">
								{item}
							</li>
						))
						) : (
						<li className="p-2 text-gray-500">{t("search_no_results")}</li>
					)}
				</ul>
			)}
    	</div>
	);
};

export default UsersSearch;