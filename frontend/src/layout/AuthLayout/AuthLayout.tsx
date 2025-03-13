import { useState, useEffect, useRef } from "react";
import { Outlet } from 'react-router';

const AuthLayout = () => {

	// State to re-renderize ball position
	const [ballPos, setBallPos] = useState({ x: 50, y: 50 });

	// use refs to maintain the position and direction without triggering constant re-renders
	const ballPosRef = useRef(ballPos);
	const ballDirRef = useRef({ dx: 3, dy: 3 });

	useEffect(() => {
		const ballSize = 16; // Tamaño en px (w-4 / h-4 de Tailwind es 1rem = 16px aproximadamente)

		const updateBall = () => {
			const { x, y } = ballPosRef.current;
			const { dx, dy } = ballDirRef.current;
			const screenWidth = window.innerWidth;
			const screenHeight = window.innerHeight;

			// Calculate new position
			let newX = x + dx;
			let newY = y + dy;

			// Check horizontal limits
			if (newX <= 0) {
				newX = 0;
				ballDirRef.current.dx = -dx; // Rebound inverting dx
			} else if (newX >= screenWidth - ballSize) {
				newX = screenWidth - ballSize;
				ballDirRef.current.dx = -dx;
			}

			// Check vertical limits
			if (newY <= 0) {
				newY = 0;
				ballDirRef.current.dy = -dy; // Rebound inverting dy
			} else if (newY >= screenHeight - ballSize) {
				newY = screenHeight - ballSize;
				ballDirRef.current.dy = -dy;
			}

			// update ref and state to re-renderize
			ballPosRef.current = { x: newX, y: newY };
			setBallPos({ x: newX, y: newY });
		};

		// Usa requestAnimationFrame para animación fluida (~60 FPS)
		let animationFrameId: number;
		const animate = () => {
			updateBall();
			animationFrameId = requestAnimationFrame(animate);
		};

		animate();

		return () => cancelAnimationFrame(animationFrameId);
	}, []);

	return (
	<div className="flex items-center justify-center h-screen relative overflow-hidden">
		{/* Pelota animada con rebote */}
		<div
		className="absolute w-5 h-5 bg-white rounded-full"
		style={{
			left: `${ballPos.x}px`,
			top: `${ballPos.y}px`,
		}}
		></div>

		{/* Outlet with login management */}
		<Outlet />
		
	</div>
	);
};

export default AuthLayout;
