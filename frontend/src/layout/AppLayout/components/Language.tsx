import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import type { Language } from '@/types/languageContext';
import { FaChevronDown } from "react-icons/fa";

const Language: React.FC = () => {

	// extract setLanguage and traduction function t from useLanguage hook
	const { language, setLanguage, t } = useLanguage();

	// useState to handle the window width and options in select
	const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
	const [options, setOptions] = useState<[string, string][]>([]);
  
	// Manage changes on window size
	useEffect(() => {
	  const handleResize = () => {
		setWindowWidth(window.innerWidth);
	  };
  
	  window.addEventListener("resize", handleResize);
	  
	  handleResize();
  
	  return () => window.removeEventListener("resize", handleResize);
	}, []);
  
	// Define conditions to change options
	useEffect(() => {
	  if (windowWidth > 768) {
		// BIG size cases
		setOptions([[`${t("spanish_flag")} ${t("spanish")}`, "es"], [`${t("english_flag")} ${t("english")}`, "en"], [`${t("portuguese_flag")} ${t("portuguese")}`, "pt"]]);
	  } else {
		// SMALL size cases
		setOptions([[`${t("spanish_flag")}`, "es"], [`${t("english_flag")}`, "en"], [`${t("portuguese_flag")}`, "pt"]]);
	  }
	}, [windowWidth, t]);

	return (
		<div className='relative w-14 md:w-32 flex items-center'>
			{/* Select language */}
			<select
				className='py-1.5 px-2 md:py-2.5 md:px-3 appearance-none outline-none pointer-events-auto focus:ring-2 focus:ring-text-tertiary hover:cursor-pointer w-full md:pr-6 text-xs bg-background-secondary'
				id='language'
				value={language}
				onChange={(e) => {
					// cast e.target.value to type Language
					const selectedLanguage = e.target.value as Language;

					// validate input
					if (["es", "en", "pt"].includes(selectedLanguage)) {
						// Set new Language on context
						setLanguage(selectedLanguage);
					}
				}
			}>
				{options.map((option, index) => (
					<option key={index} value={option[1]}>
						{option[0]}
					</option>
				))}
			</select>

			{/* Change default icon */}
			<FaChevronDown className='pointer-events-none hover:cursor-pointer absolute inset-y-0 right-2 md:right-3 my-auto text-xs' />
		</div>
	);
};

export default Language;