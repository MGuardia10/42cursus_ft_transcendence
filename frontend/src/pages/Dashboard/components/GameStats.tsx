import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';


const GameStats: React.FC = () => {

	// useLanguage hook
	const { t } = useLanguage();

	// Datos fijos de ejemplo
	const wins = 75;
	const losses = 25;
	const total = wins + losses; // 100

	const pointsWon = 350;
	const pointsLost = 200;
	const totalPoints = pointsWon + pointsLost; // 550
  
	// Cálculo de ancho en porcentaje para cada barra
	const gameWonWidth = (wins / total) * 100;
	const gameLossWidth = (losses / total) * 100;
	const pointsWonWidth = (pointsWon / totalPoints) * 100;
	const pointsLossWidth = (pointsLost / totalPoints) * 100;

	return (
		<div className="flex flex-col justify-center gap-2 w-full px-8 py-10 md:px-10">

			{/* Game stats */}
			<div className='flex justify-between font-bold'>
				<h3>{ t("dashboard_games") }</h3>
				<p>{total}</p>
			</div>

			<hr className='-mt-1' />

			<div className='flex flex-col gap-2'>
				<div className='flex justify-between text-sm md:text-base'>
					<p>{ t("dashboard_games_wins") }</p>
					<p className='text-sm'>{wins}</p>
				</div>
				<div className="w-full bg-background-secondary rounded-full h-1.5 md:h-2">
					<div
						className="h-1.5 md:h-2 rounded-full bg-text-tertiary"
						style={{ width: `${gameWonWidth}%` }}
					/>
					</div>
			</div>

			<div className='flex flex-col gap-2'>
				<div className='flex justify-between text-sm md:text-base'>
					<p>{ t("dashboard_games_lost") }</p>
					<p className='text-sm'>{losses}</p>
				</div>
				<div className="w-full bg-background-secondary rounded-full h-1.5 md:h-2">
					<div
						className="h-1.5 md:h-2 rounded-full bg-text-secondary"
						style={{ width: `${gameLossWidth}%` }}
					/>
					</div>
			</div>

			

			{/* Points stats */}
			<div className='flex justify-between font-bold mt-4'>
				<h3>{ t("dashboard_points") }</h3>
				<p>{totalPoints}</p>
			</div>

			<hr className='-mt-1' />

			<div className='flex flex-col gap-2'>
				<div className='flex justify-between text-sm'>
					<p>{ t("dashboard_points_won") }</p>
					<p>{pointsWon}</p>
				</div>
				<div className="w-full bg-background-secondary rounded-full h-1.5 md:h-2">
					<div
						className="h-1.5 md:h-2 rounded-full bg-text-tertiary"
						style={{ width: `${pointsWonWidth}%` }}
					/>
				</div>
			</div>

			<div className='flex flex-col gap-2'>
				<div className='flex justify-between text-sm'>
					<p>{ t("dashboard_points_lost") }</p>
					<p>{pointsLost}</p>
				</div>
				<div className="w-full bg-background-secondary rounded-full h-1.5 md:h-2">
					<div
						className="h-1.5 md:h-2 rounded-full bg-text-secondary"
						style={{ width: `${pointsLossWidth}%` }}
					/>
				</div>
			</div>
		</div>
	);
};

export default GameStats;