import { FormEvent, useState, useEffect, useRef } from 'react';
import { FaChevronDown } from "react-icons/fa";
import { useLanguage } from '@/hooks/useLanguage';
import { useNotification } from '@/hooks/useNotification';


const GameSettings: React.FC = () => {

	// useNotification hook
	const { addNotification } = useNotification();

	// Variable to check if Default or Custom settings are enabled
	const [custom, setCustom] = useState<boolean>(false);

	// Variables for each custom setting
	const [score, setScore] = useState<string>('5');
	const [serveDelay, setServeDelay] = useState<string>('no');
	const [bgColor, setBgColor] = useState("#000000");
  	const [barColor, setBarColor] = useState("#FFFFFF");
  	const [ballColor, setBallColor] = useState("#CC0000");

	// useLanguage hook
	const { t } = useLanguage();

	// Canvas reference
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
	
		const width = canvas.width;
		const height = canvas.height;

		// Clear the canvas
		ctx.clearRect(0, 0, width, height);
	
		// Draw the field background
		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, width, height);
	
		// Draw the side bars (goals)
		ctx.fillStyle = barColor;
		ctx.fillRect(10, (height / 2) - 35, 8, 70); // Left bar
		ctx.fillRect(width - 18, (height / 2) - 35, 8, 70); // Rigth bar
		
		// Draw the central dashed line
		ctx.setLineDash([10, 10]);
		ctx.strokeStyle = barColor;
		ctx.beginPath();
		ctx.moveTo(width / 2, 0);
		ctx.lineTo(width / 2, height);
		ctx.stroke();
		ctx.setLineDash([]); // Resetear el estilo de línea
		
		// Draw the ball
		ctx.fillStyle = ballColor;
		ctx.beginPath();
		ctx.arc(width / 2, height / 2, 8, 0, Math.PI * 2);
		ctx.fill();

		// Draw the field border
		ctx.strokeStyle = barColor;
		ctx.lineWidth = 3;
		ctx.strokeRect(0, 0, width, height);
	}, [bgColor, barColor, ballColor, custom]);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		
		// Lógica para actualizar el nombre en su endpoint
		console.log('Propiedades:', score, serveDelay, bgColor, barColor, ballColor);

		// Show notification
		addNotification(`${t("notifications_game_settings_success")}`, 'success');
		// addNotification(`${t("notifications_game_settings_error")}`, 'error');
	};

	return (
		<div className="w-full rounded-md mx-auto p-6 md:p-10 bg-background-secondary">

			<h1 className="text-xl md:text-3xl font-bold mb-6">{ t("game_settings_h1") }</h1>

			{/* Change default setting to custom settings */}
			<div className='flex flex-row gap-2 md:gap-3'>
				<p className='text-sm md:text-base'>{ t("game_settings_custom") }</p>
				<button
					type="button"
					onClick={() => setCustom((prev) => !prev)}
					className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none hover:cursor-pointer ${ custom ? 'bg-text-secondary' : 'bg-gray-300'}`}
				>
				<span
					className={`inline-block w-4 h-4 bg-white rounded-full transform transition-transform ${ custom ? 'translate-x-6' : 'translate-x-1'}`}
				></span>
          		</button>
			</div>
			
		
			{/* Show custom settings */}
			<form
				onSubmit={ handleSubmit }
				className={`${ custom ? 'flex flex-col gap-2 md:gap-2.5 mt-4' : 'hidden' }`}
			>
				{/* Points to win game */}
				<label htmlFor='score' className="block text-sm font-medium">
					{ t("game_settings_points") }
				</label>
				<div className='relative'>
					<select
						id="score"
						value={score}
						onChange={(e) => setScore(e.target.value)}
						className="w-full text-sm md:text-base p-1.5 md:p-2 border rounded-xs appearance-none outline-text-tertiary hover:cursor-pointer"
					>
						<option value="3">3 { t("game_settings_points_opt") }</option>
						<option value="5">5 { t("game_settings_points_opt") }</option>
						<option value="10">10 { t("game_settings_points_opt") }</option>
						<option value="15">15 { t("game_settings_points_opt") }</option>
						<option value="20">20 { t("game_settings_points_opt") }</option>
					</select>
					<FaChevronDown className='pointer-events-none hover:cursor-pointer absolute inset-y-0 right-3 my-auto text-xs' />
				</div>
				

				{/* Seconds to wait when a goal is scored */}
				<label htmlFor='serveDelay' className="block text-sm font-medium mt-4">
				{ t("game_settings_serve_delay") }
				</label>
				<div className='relative'>
					<select
						id="serveDelay"
						value={serveDelay}
						onChange={(e) => setServeDelay(e.target.value)}
						className="w-full text-sm md:text-base p-1.5 md:p-2 border rounded-xs appearance-none outline-text-tertiary hover:cursor-pointer"
					>
						<option value="no">{ t("game_settings_no_delay") }</option>
						<option value="1">1 { t("game_settings_seconds") }</option>
						<option value="2">2 { t("game_settings_seconds") }s</option>
						<option value="3">3 { t("game_settings_seconds") }s</option>
					</select>
					<FaChevronDown className='pointer-events-none hover:cursor-pointer absolute inset-y-0 right-3 my-auto text-xs' />
				</div>

				{/* Color selector */}
				<div className="flex flex-col items-center gap-4 py-8 md:py-10">
					<canvas ref={canvasRef} width={500} height={300} className='w-[250px] h-[150px] md:w-[300px] md:h-[200px] lg:w-[500px] lg:h-[300px]'/>
					<div className="flex gap-2  md:gap-4 lg:gap-10">
						<label className="flex items-center gap-1 md:gap-2 text-sm hover:cursor-pointer">
						{ t("game_settings_bg") }
						<input
							type="color"
							value={bgColor}
							className='hover:cursor-pointer'
							onChange={(e) => setBgColor(e.target.value)}
						/>
						</label>
						<label className="flex items-center gap-1 md:gap-2 text-sm hover:cursor-pointer">
						{ t("game_settings_bar") }
						<input
							type="color"
							value={barColor}
							className='hover:cursor-pointer'
							onChange={(e) => setBarColor(e.target.value)}
						/>
						</label>
						<label className="flex items-center gap-1 md:gap-2 text-sm hover:cursor-pointer">
						{ t("game_settings_ball") }
						<input
							type="color"
							value={ballColor}
							className='hover:cursor-pointer'
							onChange={(e) => setBallColor(e.target.value)}
						/>
						</label>
					</div>
				</div>
				<button
						type="submit"
						className="bg-text-secondary text-sm md:text-base text-white px-3 py-2 rounded-xs hover:bg-text-tertiary hover:cursor-pointer transition-all duration-300"
					>
					{ t("game_settings_submit") }
				</button>
			</form>
		</div>
	);
};

export default GameSettings;
