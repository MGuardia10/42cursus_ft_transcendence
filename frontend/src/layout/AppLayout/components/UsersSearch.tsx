// import { useState } from 'react';
import { HiSearch } from "react-icons/hi";
import { useNavigate } from "react-router";


import { useLanguage } from '@/hooks/useLanguage';
import { useSearch } from '@/hooks/useSearch';
import Spinner from '@/layout/Spinner/Spinner';
import UserSearchItem from '@/layout/AppLayout/components/UserSearchItem';


import type { SearchUser } from '@/types/friendsContext';


const UsersSearch: React.FC = () => {

	/* useLanguage Hook */
	const { t } = useLanguage();

	/* useNavigate Hook */
	const Navigate = useNavigate();
	

	const { query, setQuery, results, loading, error, hasSearched } = useSearch();

	/* Function to handle click on user */
	const handleClickUser = (user: SearchUser) => {
		setQuery('');
		Navigate(`/users/${user.id}`);
	};

  return (
    <div className="relative md:max-w-md mx-auto">
      <input
        type="text"
        id="search"
        placeholder={t("search_placeholder")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="py-1.5 px-2 md:py-2.5 md:px-3 w-32 md:w-full focus:outline-none focus:ring-2 focus:ring-text-tertiary bg-background-secondary text-xs"
      />
      <HiSearch className="absolute top-1/2 right-2 md:right-3 transform -translate-y-1/2 text-sm md:text-base" />

      {query.length > 0 && (
        <ul className="absolute w-50 md:w-64 mt-2 -ml-1 bg-background-secondary border border-background-primary rounded-xs overflow-hidden z-10 shadow-[6px_6px_6px_rgba(54,65,83,0.7)]">
          {loading ? (
            <li className="p-3 flex justify-center"><Spinner /></li>
          ) : error ? (
            <li className="text-sm md:text-base p-3 text-red-500">{error}</li>
          ) : results.length > 0 ? (
            results.map((user) => (
				<UserSearchItem
				  key={user.id}
				  user={user}
				  onSelect={handleClickUser}
				/>
			  ))
          ) : hasSearched ? (
            <li className="text-sm md:text-base p-3 text-gray-500">
              {t("search_no_results")}
            </li>
          ) : null}
        </ul>
      )}
    </div>
  );
};

export default UsersSearch;
