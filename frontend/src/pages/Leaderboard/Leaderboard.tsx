import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { IoMdArrowRoundBack } from "react-icons/io";

// Datos de prueba
const users = [
	{ id: 1, name: "Alice", wins: 90, image: "https://randomuser.me/api/portraits/women/1.jpg" },
	{ id: 2, name: "Bob", wins: 85, image: "https://randomuser.me/api/portraits/men/1.jpg" },
	{ id: 3, name: "Charlie", wins: 78, image: "https://randomuser.me/api/portraits/men/2.jpg" },
	{ id: 4, name: "Dave", wins: 70, image: "https://randomuser.me/api/portraits/men/3.jpg" },
	{ id: 5, name: "Eve", wins: 65, image: "https://randomuser.me/api/portraits/women/2.jpg" },
	{ id: 6, name: "Frank", wins: 60, image: "https://randomuser.me/api/portraits/men/4.jpg" },
	{ id: 7, name: "Pepe", wins: 60, image: "https://randomuser.me/api/portraits/men/5.jpg" },
	{ id: 8, name: "Juan", wins: 50, image: "https://randomuser.me/api/portraits/men/6.jpg" },
	{ id: 9, name: "Bartolo", wins: 40, image: "https://randomuser.me/api/portraits/men/7.jpg" },
	{ id: 10, name: "Luis", wins: 30, image: "https://randomuser.me/api/portraits/men/8.jpg" },
	{ id: 11, name: "Manuel", wins: 30, image: "https://randomuser.me/api/portraits/men/9.jpg" },
	{ id: 12, name: "Sara", wins: 28, image: "https://randomuser.me/api/portraits/women/3.jpg" },
	{ id: 13, name: "Maria", wins: 16, image: "https://randomuser.me/api/portraits/women/4.jpg" },
	{ id: 14, name: "Alex", wins: 12, image: "https://randomuser.me/api/portraits/men/10.jpg" },
	{ id: 15, name: "Mariana", wins: 10, image: "https://randomuser.me/api/portraits/men/11.jpg" },
	{ id: 16, name: "Jesús", wins: 9, image: "https://randomuser.me/api/portraits/men/12.jpg" },
	{ id: 17, name: "Paolo", wins: 7, image: "https://randomuser.me/api/portraits/men/13.jpg" },
	{ id: 18, name: "Mario", wins: 5, image: "https://randomuser.me/api/portraits/men/14.jpg" },
];

const Leaderboard: React.FC = () => {

	// useLanguage hook
	const { t } = useLanguage();

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5; // Cantidad de usuarios por página en el ranking

	// Separar los top 3 y el resto
	const topPlayers = users.slice(0, 3);
	const otherPlayers = users.slice(3);
	const totalPages = Math.ceil(otherPlayers.length / itemsPerPage);
	const currentPlayers = otherPlayers.slice((currentPage - 1) * itemsPerPage,currentPage * itemsPerPage);

	return (
	<div className="w-full rounded-md mx-auto p-6 md:p-10 bg-background-secondary">

		{/* Top 3 Podio */}
		<div className="mb-6">
		<h2 className="text-lg md:text-2xl font-semibold mb-4">{ t("leaderboard_top_3") }</h2>
		<div className="flex justify-center items-end gap-4 md:gap-8 lg:gap-10">
			{/* Segundo puesto (izquierda) */}
			<div className="flex flex-col items-center">
				<span className="text-xl font-bold text-gray-300 mb-2">2</span>
				<img
					src={topPlayers[1].image}
					alt={topPlayers[1].name}
					className="w-14 h-14 md:w-16 md:h-16 rounded-full mb-2 border-2 border-gray-300"
				/>
				<span className="font-bold">{topPlayers[1].name}</span>
				<span className="text-xs md:text-sm">{topPlayers[1].wins}% { t("leaderboard_wins") }</span>
			</div>
			{/* Primer puesto (centro) */}
			<div className="flex flex-col items-center">
				<span className="text-2xl font-bold text-yellow-500 mb-2">1</span>
				<img
					src={topPlayers[0].image}
					alt={topPlayers[0].name}
					className="w-20 h-20 md:w-24 md:h-24 rounded-full mb-2 border-2 border-yellow-500"
				/>
				<span className="font-bold">{topPlayers[0].name}</span>
				<span className="text-xs md:text-sm">{topPlayers[0].wins}% { t("leaderboard_wins") }</span>
			</div>
			{/* Tercer puesto (derecha) */}
			<div className="flex flex-col items-center">
				<span className="text-xl font-bold text-orange-800 mb-2">3</span>
				<img
					src={topPlayers[2].image}
					alt={topPlayers[2].name}
					className="w-14 h-14 md:w-16 md:h-16 rounded-full mb-2 border-2 border-orange-800"
				/>
				<span className="font-bold">{topPlayers[2].name}</span>
				<span className="text-xs md:text-sm">{topPlayers[2].wins}% { t("leaderboard_wins") }</span>
			</div>
		</div>
	</div>


	{/* Ranking con paginación */}
	<div>
		<h2 className="text-lg md:text-2xl font-semibold mb-4">{ t("leaderboard_ranking") }</h2>
		<ul className="flex flex-col gap-3">
		{currentPlayers.map((player, index) => (
			<li
			key={player.id}
			className="flex flex-row items-center justify-between gap-4 p-3 bg-background-primary rounded-md hover:cursor-pointer transition-all duration-300"
			>
			<div className="flex items-center gap-3">
					<span className="font-bold text-text-tertiary">{ index + 4 }</span>
					<img
						src={player.image}
						alt={player.name}
						className="w-10 h-10 rounded-full border-2 border-text-tertiary"
					/>
					<span className="font-bold">{player.name}</span>
			</div>
			<div>
				<p className="font-bold text-text-tertiary">{player.wins}% { t("leaderboard_wins") }</p>
			</div>
			</li>
		))}
		</ul>
		{/* Controles de paginación */}
		<div className="mt-5 md:mt-8 flex justify-center items-center gap-4">
			<button
			onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
			disabled={currentPage === 1}
			className="flex items-center p-2 md:py-2 md:px-3 bg-text-secondary rounded-xs disabled:opacity-50 disabled:cursor-default disabled:hover:bg-text-tertiary hover:cursor-pointer hover:bg-text-tertiary transition-all duration-300"
			>
			<IoMdArrowRoundBack className="inline-block" />
			</button>
			<span>
			{currentPage} / {totalPages || 1}
			</span>
			<button
			onClick={() =>
				setCurrentPage((prev) => Math.min(prev + 1, totalPages))
			}
			disabled={currentPage === totalPages}
			className="flex items-center p-2 md:py-2 md:px-3 bg-text-secondary rounded-xs disabled:opacity-50 disabled:cursor-default disabled:hover:bg-text-tertiary hover:cursor-pointer hover:bg-text-tertiary transition-all duration-300"
			>
			<IoMdArrowRoundBack className="inline-block rotate-180" />
			</button>
		</div>
		</div>
	</div>
	);
};

export default Leaderboard;
