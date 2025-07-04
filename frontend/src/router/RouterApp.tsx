import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import AuthLayout from '@/layout/AuthLayout/AuthLayout';
import AppLayout from '@/layout/AppLayout/AppLayout';
import PrivateRoute from '@/router/PrivateRoute';
import PublicRoute from '@/router/PublicRoute';
import Login from '@/pages/Login/Login';
import TwoFactorAuth from '@/pages/TwoFactorAuth/TwoFactorAuth';
import Home from '@/pages/Home/Home';
import SingleMatch from '@/pages/SingleMatch/SingleMatch';
import Tournament from '@/pages/Tournament/Tournament';
import Dashboard from '@/pages/Dashboard/Dashboard';
import LeaderBoard from '@/pages/Leaderboard/Leaderboard';
import Profile from '@/pages/Profile/Profile';
import GameSettings from '@/pages/Settings/GameSettings';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';

const RouterApp: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
					<Route path="/login" element={<Login />} />
					<Route path="/login/tfa" element={<TwoFactorAuth />} />
				</Route>

				<Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
						<Route path="/" element={<Home />} />
						<Route path="/users/:id" element={<Dashboard />} />
						<Route path="/single-match" element={<SingleMatch />} />
						<Route path="/tournament" element={<Tournament />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/leaderboard" element={<LeaderBoard />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/game-settings" element={<GameSettings />} />
				</Route>

				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</BrowserRouter>
	);
};

export default RouterApp;