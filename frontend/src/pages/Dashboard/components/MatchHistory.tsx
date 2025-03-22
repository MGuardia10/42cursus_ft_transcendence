import React from 'react';

const gameResults = [
	{
		userPoints: 10,
		opponentPoints: 5,
		result: 'win',
		userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
		opponentAvatar: "https://randomuser.me/api/portraits/women/20.jpg",
	},
	{
		userPoints: 7,
		opponentPoints: 8,
		result: 'lose',
		userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
		opponentAvatar: "https://randomuser.me/api/portraits/women/25.jpg",
	},
	{
		userPoints: 12,
		opponentPoints: 11,
		result: 'win', // o 'lose' según la lógica que definas para empates
		userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
		opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
	},
	{
		userPoints: 12,
		opponentPoints: 10,
		result: 'win', // o 'lose' según la lógica que definas para empates
		userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
		opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
	},
	{
		userPoints: 12,
		opponentPoints: 10,
		result: 'win', // o 'lose' según la lógica que definas para empates
		userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
		opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
	},
	{
		userPoints: 12,
		opponentPoints: 10,
		result: 'win', // o 'lose' según la lógica que definas para empates
		userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
		opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
	},
	{
		userPoints: 12,
		opponentPoints: 10,
		result: 'win', // o 'lose' según la lógica que definas para empates
		userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
		opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
	},
	// {
	// 	userPoints: 12,
	// 	opponentPoints: 10,
	// 	result: 'win', // o 'lose' según la lógica que definas para empates
	// 	userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
	// 	opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
	// },
	// {
	// 	userPoints: 12,
	// 	opponentPoints: 10,
	// 	result: 'win', // o 'lose' según la lógica que definas para empates
	// 	userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
	// 	opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
	// },
	// {
	// 	userPoints: 12,
	// 	opponentPoints: 10,
	// 	result: 'win', // o 'lose' según la lógica que definas para empates
	// 	userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
	// 	opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
	// },
	// {
	// 	userPoints: 12,
	// 	opponentPoints: 10,
	// 	result: 'win', // o 'lose' según la lógica que definas para empates
	// 	userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
	// 	opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
	// },
	// {
	// 	userPoints: 12,
	// 	opponentPoints: 10,
	// 	result: 'win', // o 'lose' según la lógica que definas para empates
	// 	userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
	// 	opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
	// },
	// {
	// 	userPoints: 12,
	// 	opponentPoints: 10,
	// 	result: 'win', // o 'lose' según la lógica que definas para empates
	// 	userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
	// 	opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
	// },
	// {
	// 	userPoints: 12,
	// 	opponentPoints: 10,
	// 	result: 'win', // o 'lose' según la lógica que definas para empates
	// 	userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
	// 	opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
	// },
	// {
	// 	userPoints: 12,
	// 	opponentPoints: 10,
	// 	result: 'win', // o 'lose' según la lógica que definas para empates
	// 	userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
	// 	opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
	// },
	// {
	// 	userPoints: 12,
	// 	opponentPoints: 10,
	// 	result: 'win', // o 'lose' según la lógica que definas para empates
	// 	userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
	// 	opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
	// },
	// {
	// 	userPoints: 12,
	// 	opponentPoints: 10,
	// 	result: 'win', // o 'lose' según la lógica que definas para empates
	// 	userAvatar: "https://i.redd.it/c83vyz4t9b651.jpg",
	// 	opponentAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
	// }
  ];

const MatchHistory: React.FC = () => {
	return (
		<div className="flex flex-col gap-3 w-full p-6 h-full">
			{/* Title */}
			<h1 className="text-xl mb-2">Match History</h1>
			{/* Matches */}
			<div className='flex flex-col gap-3 max-h-auto overflow-y-auto scrollbar scrollbar-thumb-background-secondary scrollbar-track-background-primary'>
				{gameResults && gameResults.map((game, index) => (
					<div key={index} className={`flex items-center justify-between py-2.5 px-4 rounded-md ${game.result === 'win' ? 'bg-[#4cbfa2] border-2 border-[#2ba384]' : 'bg-[#d75743] border-2 border-[#c53e29]'}`}>
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
		</div>
	);
};

export default MatchHistory;