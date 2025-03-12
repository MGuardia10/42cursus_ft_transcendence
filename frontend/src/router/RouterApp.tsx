import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import AppLayout from '@/layout/AppLayout/AppLayout';
import AuthLayout from '@/layout/AuthLayout/AuthLayout';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Home from '@/pages/Home/Home';
import LeaderBoard from '@/pages/Leaderboard/Leaderboard';
import Login from '@/pages/Login/Login';
import Profile from '@/pages/Profile/Profile';
import Settings from '@/pages/Settings/Settings';
import SingleMatch from '@/pages/SingleMatch/SingleMatch';
import Tournament from '@/pages/Tournament/Tournament';


const RouterApp: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<AuthLayout />}>
					<Route path="login" element={<Login />} />
				</Route>

				<Route element={<AppLayout />}>
					<Route path="/" element={<Home />} />
					<Route path="/single-match" element={<SingleMatch />} />
					<Route path="/tournament" element={<Tournament />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/leaderboard" element={<LeaderBoard />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/game-settings" element={<Settings />} />
				</Route>

				<Route path="*" element={<h1>Not Found</h1>} />
			</Routes>
		</BrowserRouter>
	);
};

export default RouterApp;