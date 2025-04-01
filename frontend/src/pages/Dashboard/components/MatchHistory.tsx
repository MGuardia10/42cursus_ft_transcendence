import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface Game {
	userPoints: number;
	opponentPoints: number;
	result: string;
	userAvatar: string;
	opponentAvatar: string;
	userName: string;
	opponentName: string;
	date: string;
}

const gameResults = [
    {
        userPoints: 10,
        opponentPoints: 5,
        result: 'win',
        userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
        opponentAvatar: "https://randomuser.me/api/portraits/women/20.jpg",
        userName: "Alice",
        opponentName: "Kevin",
        date: "12-03-2025 14:32"
    },
    {
        userPoints: 7,
        opponentPoints: 8,
        result: 'lose',
        userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
        opponentAvatar: "https://randomuser.me/api/portraits/women/25.jpg",
        userName: "Noah",
        opponentName: "Emma",
        date: "05-02-2025 09:15"
    },
    {
        userPoints: 12,
        opponentPoints: 11,
        result: 'win',
        userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
        opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
        userName: "Liam",
        opponentName: "Sophia",
        date: "28-01-2025 21:47"
    },
    {
        userPoints: 12,
        opponentPoints: 10,
        result: 'win',
        userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
        opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
        userName: "Mia",
        opponentName: "Ryan",
        date: "19-03-2025 18:20"
    },
    {
        userPoints: 12,
        opponentPoints: 10,
        result: 'win',
        userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
        opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
        userName: "David",
        opponentName: "Olivia",
        date: "10-04-2025 07:55"
    },
    {
        userPoints: 12,
        opponentPoints: 10,
        result: 'win',
        userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
        opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
        userName: "Hannah",
        opponentName: "Peter",
        date: "02-03-2025 16:10"
    },
    {
        userPoints: 12,
        opponentPoints: 10,
        result: 'win',
        userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
        opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
        userName: "Grace",
        opponentName: "Frank",
        date: "14-02-2025 22:40"
    },
    {
        userPoints: 12,
        opponentPoints: 10,
        result: 'win',
        userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
        opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
        userName: "Charlie",
        opponentName: "Julia",
        date: "27-01-2025 11:05"
    },
    {
        userPoints: 12,
        opponentPoints: 10,
        result: 'win',
        userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
        opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
        userName: "Quinn",
        opponentName: "Tom",
        date: "08-02-2025 19:30"
    },
    {
        userPoints: 12,
        opponentPoints: 10,
        result: 'win',
        userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
        opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
        userName: "Isaac",
        opponentName: "Sophia",
        date: "03-03-2025 13:12"
    }
];


const MatchHistory: React.FC = () => {

	// useLanguage hook
	const { t } = useLanguage();

	// useState hook
	const [selectedGame, setSelectedGame] = useState<Game | null>(null);
	const [showFullView, setShowFullView] = useState(false);


	return (
		<div className="flex flex-col gap-3 w-full p-6 h-full">
			{/* Title */}
			<h2 className="md:text-xl mb-2">{ t("dashboard_match_history") }</h2>
			{/* Matches */}
			<div className='flex flex-col gap-3 max-h-auto overflow-y-auto scrollbar scrollbar-thumb-background-secondary scrollbar-track-background-primary'>
				{gameResults && gameResults.map((game, index) => (
					// Game Card
					<div
						key={index}
						className={`flex items-center justify-between py-2.5 px-4 rounded-md hover:cursor-pointer ${game.result === 'win' ? 'bg-[#4cbfa2] border-2 border-[#2ba384]' : 'bg-[#d75743] border-2 border-[#c53e29]'}`}
						onClick={() => { setSelectedGame(game); setShowFullView(true)}}
					>
						<div className="flex items-center gap-4">
							<img src={game.userAvatar} alt="user" className="w-10 h-10 rounded-full border-2 border-text-tertiary" />
						</div>
						<p className="font-bold">{game.userPoints} - {game.opponentPoints}</p>
						<div className="flex items-center gap-4">
							<img src={game.opponentAvatar} alt="opponent" className="w-10 h-10 rounded-full border-2 border-text-tertiary" />
						</div>
					</div>
				))}
			</div>
			{/* Game Details */}
			{selectedGame && (
				<div
					className={`absolute top-0 left-0 w-full h-full flex items-center justify-center bg-background-primary/90 z-9 overflow-x-hidden transition-all duration-200 ${showFullView ? "opacity-100 scale-100" : "opacity-0 scale-95 invisible"}`}
					onClick={() => setShowFullView(false)}
				>
					<div
						className={`bg-background-secondary flex flex-col items-center justify-center gap-6 md:gap-12 lg:gap-14 py-5 px-10 lg:py-10 lg:px-30 rounded-xs border ${ selectedGame.result === 'win' ? 'border-border-primary' : 'border-red-600' } `}
						onClick={(e) => e.stopPropagation()}
					>
						{/* title */}
						<h3 className="text-xl font-bold">Match Details</h3>

						{/* Details */}
						<div className='flex flex-row gap-10 lg:gap-16 mt-4'>
							<div className="flex flex-col items-center gap-2">
								<img src={selectedGame.userAvatar} alt="user" className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full border-2 border-text-tertiary" />
								<p className='text-sm md:text-base'>{selectedGame.userName}</p>
							</div>
							<div className='flex flex-col items-center justify-center gap-3'>
								<p className="md:text-lg font-bold">{selectedGame.userPoints} - {selectedGame.opponentPoints}</p>
								<p className={`text-sm ${selectedGame.result === 'win' ? 'text-text-tertiary': 'text-red-600'}`}>{selectedGame.result === 'win' ? 'You won!' : 'You lost!'}</p>
							</div>
							<div className="flex flex-col items-center gap-2">
								<img src={selectedGame.opponentAvatar} alt="opponent" className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full border-2 border-text-tertiary" />
								<p className='text-sm md:text-base'>{selectedGame.opponentName}</p>
							</div>
						</div>

						{/* Date */}
						<p className='text-sm md:text-base text-gray-400'>{selectedGame.date}</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default MatchHistory;