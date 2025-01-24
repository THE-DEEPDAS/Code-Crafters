import React, { useEffect, useState } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import axios from "axios";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import { QRCodeSVG } from "qrcode.react";
import BaseLayout from "../Layouts/BaseLayout";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

// Register ChartJS components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement
);

const Encourage = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/signin");
			return;
		}
	}, [navigate]);

	const [userData, setUserData] = useState(null);
	const [leaderboard, setLeaderboard] = useState([]);
	const [achievements, setAchievements] = useState([]);
	const [quotes] = useState([
		"Every cup recycled is a step towards a greener future! 🌱",
		"You're making waves in environmental conservation! 🌊",
		"Small actions create big impacts! Keep going! ⭐",
		"You're part of the solution, not the pollution! 🌍",
		"Your eco-friendly choices inspire others! 🌿",
	]);
	const [selectedAchievement, setSelectedAchievement] = useState(null);
	const [showCertificate, setShowCertificate] = useState(false);
	const [stats, setStats] = useState({
		treesSpared: 0,
		waterSaved: 0,
		co2Reduced: 0,
	});
	const [socket, setSocket] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showMetricsForm, setShowMetricsForm] = useState(false);
	const [newMetrics, setNewMetrics] = useState({
		recycledCups: "",
		dailyCupUsage: "",
	});

	const milestones = [100, 500, 1000, 5000, 10000];
	const nextMilestone =
		milestones.find((m) => m > (userData?.recycledCups || 0)) || "Max Level!";

	const environmentalStats = {
		labels: ["Trees Spared", "Water Saved (L)", "CO2 Reduced (kg)"],
		datasets: [
			{
				data: [stats.treesSpared, stats.waterSaved, stats.co2Reduced],
				backgroundColor: ["#4ade80", "#60a5fa", "#34d399"],
			},
		],
	};

	const calculateStats = (cups) => {
		return {
			treesSpared: (cups * 0.0005).toFixed(2),
			waterSaved: (cups * 0.5).toFixed(2),
			co2Reduced: (cups * 0.033).toFixed(2),
		};
	};

	const generateCertificate = async (achievement) => {
		const certificateRef = document.createElement("div");
		certificateRef.innerHTML = `
      <div class="certificate-container bg-white p-8 rounded-lg border-8 border-green-600 text-center">
        <h1 class="text-3xl font-bold mb-4">Certificate of Achievement</h1>
        <p class="text-xl mb-2">This certifies that</p>
        <h2 class="text-2xl font-bold mb-4">${userData?.username}</h2>
        <p class="text-xl mb-4">has successfully recycled</p>
        <h3 class="text-4xl font-bold text-green-600 mb-4">${
					achievement.milestone
				} Cups</h3>
        <p class="text-lg mb-4">Contributing to a greener planet</p>
        <p class="text-md">${new Date().toLocaleDateString()}</p>
      </div>
    `;

		const canvas = await html2canvas(certificateRef);
		return canvas.toDataURL("image/png");
	};

	const shareAchievement = async (achievement) => {
		try {
			const certificateImage = await generateCertificate(achievement);
			if (navigator.share) {
				await navigator.share({
					title: "My Cup Karma Achievement!",
					text: `I've recycled ${achievement.milestone} cups! Join me in making the planet greener!`,
					url: window.location.href,
				});
			} else {
				// Fallback to copying to clipboard
				const shareText = `I've recycled ${achievement.milestone} cups on Cup Karma! Join me in making the planet greener!`;
				await navigator.clipboard.writeText(shareText);
				alert("Share text copied to clipboard!");
			}
		} catch (error) {
			console.error("Error sharing:", error);
		}
	};

	const changeMetrics = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("token");
		try {
			const response = await axios.patch(
				"http://localhost:3000/api/update-stats",
				newMetrics,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setStats(calculateStats(response.data.recycledCups));
			setUserData({ ...userData, ...response.data });
			setShowMetricsForm(false);
		} catch (error) {
			console.error("Error changing metrics:", error.response || error);
			setError(
				error.response?.data?.message || "An unexpected error occurred."
			);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const token = localStorage.getItem("token");
			try {
				const [userResponse, leaderboardResponse, achievementsResponse] =
					await Promise.all([
						axios.get("http://localhost:3000/api/stats/user", {
							headers: { Authorization: `Bearer ${token}` },
						}),
						axios.get("http://localhost:3000/api/stats/leaderboard", {
							headers: { Authorization: `Bearer ${token}` },
						}),
						axios.get("http://localhost:3000/api/stats/achievements", {
							headers: { Authorization: `Bearer ${token}` },
						}),
					]);

				setUserData(userResponse.data);
				setLeaderboard(leaderboardResponse.data);
				setAchievements(achievementsResponse.data);
				setStats(calculateStats(userResponse.data.recycledCups));
			} catch (error) {
				console.error("Error fetching data:", error.response || error);
				setError(
					error.response?.data?.message || "An unexpected error occurred."
				);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		// Initialize socket connection
		const newSocket = io("http://localhost:3000", {
			withCredentials: true,
			extraHeaders: {
				"my-custom-header": "abcd",
			},
		});
		setSocket(newSocket);

		// Join leaderboard room
		newSocket.emit("joinLeaderboard");

		// Listen for leaderboard updates
		newSocket.on("leaderboardUpdate", (updatedLeaderboard) => {
			setLeaderboard(updatedLeaderboard);
		});

		return () => newSocket.disconnect();
	}, []);

	const progressChart = {
		labels: ["Last Week", "2 Weeks Ago", "3 Weeks Ago", "4 Weeks Ago"],
		datasets: [
			{
				label: "Cups Recycled",
				data: userData?.weeklyProgress || [0, 0, 0, 0],
				borderColor: "rgb(75, 192, 192)",
				tension: 0.1,
			},
		],
	};

	const leaderboardChart = {
		labels: leaderboard.map((user) => user.username),
		datasets: [
			{
				label: "Cups Recycled",
				data: leaderboard.map((user) => user.recycledCups),
				backgroundColor: "rgba(75, 192, 192, 0.5)",
			},
		],
	};

	const StatsGrid = () => (
		<div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-12'>
			{/* Total Cups Recycled */}
			<motion.div
				whileHover={{ scale: 1.05 }}
				className='bg-white rounded-xl shadow-lg p-6'
			>
				<h3 className='text-lg font-semibold text-gray-700 mb-2'>
					Total Cups Recycled
				</h3>
				<p className='text-3xl font-bold text-green-600'>
					{userData?.recycledCups || 0}
				</p>
			</motion.div>

			{/* Environmental Impact */}
			<motion.div
				whileHover={{ scale: 1.05 }}
				className='bg-white rounded-xl shadow-lg p-6'
			>
				<h3 className='text-lg font-semibold text-gray-700 mb-2'>
					Trees Saved
				</h3>
				<p className='text-3xl font-bold text-green-600'>
					{((userData?.recycledCups || 0) * 0.0005).toFixed(2)}
				</p>
			</motion.div>

			{/* Achievements */}
			<motion.div
				whileHover={{ scale: 1.05 }}
				className='bg-white rounded-xl shadow-lg p-6'
			>
				<h3 className='text-lg font-semibold text-gray-700 mb-2'>
					Achievements
				</h3>
				<p className='text-3xl font-bold text-green-600'>
					{achievements.length}
				</p>
			</motion.div>

			{/* Current Streak */}
			<motion.div
				whileHover={{ scale: 1.05 }}
				className='bg-white rounded-xl shadow-lg p-6'
			>
				<h3 className='text-lg font-semibold text-gray-700 mb-2'>
					Current Streak
				</h3>
				<p className='text-3xl font-bold text-orange-500'>
					{userData?.streak?.count || 0} days
				</p>
			</motion.div>
		</div>
	);

	if (loading) {
		return (
			<BaseLayout>
				<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50'>
					<div className='text-center'>
						<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto'></div>
						<p className='mt-4 text-gray-600'>Loading your green journey...</p>
					</div>
				</div>
			</BaseLayout>
		);
	}

	if (error) {
		return (
			<BaseLayout>
				<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50'>
					<div className='text-center p-8 bg-white rounded-lg shadow-lg'>
						<h2 className='text-2xl font-bold text-red-600 mb-4'>
							Oops! Something went wrong
						</h2>
						<p className='text-gray-600 mb-4'>{error}</p>
						<button
							onClick={() => window.location.reload()}
							className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
						>
							Try Again
						</button>
					</div>
				</div>
			</BaseLayout>
		);
	}

	return (
		<BaseLayout>
			<div className='min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-6'>
				<div className='max-w-7xl mx-auto'>
					{/* Motivational Quote */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='text-center mb-12'
					>
						<h1 className='text-4xl font-bold text-green-800 mb-4'>
							Your Green Journey
						</h1>
						<p className='text-xl text-green-600 italic'>
							{userData?.username},{" "}
							{quotes[Math.floor(Math.random() * quotes.length)]}
						</p>
					</motion.div>

					{/* Progress to Next Milestone */}
					<motion.div
						whileHover={{ scale: 1.02 }}
						className='bg-white rounded-xl shadow-lg p-6 mb-8'
					>
						<h3 className='text-xl font-bold text-green-800 mb-4'>
							Road to Next Milestone: {nextMilestone}
						</h3>
						<div className='w-full bg-gray-200 rounded-full h-4'>
							<div
								className='bg-green-600 rounded-full h-4 transition-all duration-500'
								style={{
									width: `${
										((userData?.recycledCups % nextMilestone) / nextMilestone) *
										100
									}%`,
								}}
							/>
						</div>
						<p className='text-gray-600 mt-2'>
							{userData?.recycledCups || 0} / {nextMilestone} cups
						</p>
					</motion.div>

					{/* Stats Grid */}
					<StatsGrid />

					{/* Environmental Impact */}
					<motion.div className='bg-white rounded-xl shadow-lg p-6 mb-8'>
						<h3 className='text-xl font-bold text-green-800 mb-4'>
							Your Environmental Impact
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<Doughnut data={environmentalStats} />
							</div>
							<div className='flex flex-col justify-center'>
								<div className='mb-4'>
									<p className='text-lg font-semibold'>Trees Spared</p>
									<p className='text-3xl font-bold text-green-600'>
										{stats.treesSpared}
									</p>
								</div>
								<div className='mb-4'>
									<p className='text-lg font-semibold'>Water Saved</p>
									<p className='text-3xl font-bold text-blue-600'>
										{stats.waterSaved}L
									</p>
								</div>
								<div>
									<p className='text-lg font-semibold'>CO2 Reduced</p>
									<p className='text-3xl font-bold text-teal-600'>
										{stats.co2Reduced}kg
									</p>
								</div>
							</div>
						</div>
						<button
							onClick={() => setShowMetricsForm(true)}
							className='mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
						>
							Change Metrics
						</button>
						{showMetricsForm && (
							<form onSubmit={changeMetrics} className='mt-4'>
								<div className='mb-4'>
									<label className='block text-gray-700'>Recycled Cups</label>
									<input
										type='number'
										value={newMetrics.recycledCups}
										onChange={(e) =>
											setNewMetrics({
												...newMetrics,
												recycledCups: e.target.value,
											})
										}
										className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									/>
								</div>
								<div className='mb-4'>
									<label className='block text-gray-700'>Daily Cup Usage</label>
									<input
										type='number'
										value={newMetrics.dailyCupUsage}
										onChange={(e) =>
											setNewMetrics({
												...newMetrics,
												dailyCupUsage: e.target.value,
											})
										}
										className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									/>
								</div>
								<button
									type='submit'
									className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
								>
									Update Metrics
								</button>
							</form>
						)}
					</motion.div>

					{/* Charts */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12'>
						{/* Progress Chart */}
						<div className='bg-white rounded-xl shadow-lg p-6'>
							<h3 className='text-lg font-semibold text-gray-700 mb-4'>
								Your Progress
							</h3>
							<Line data={progressChart} options={{ responsive: true }} />
						</div>

						{/* Leaderboard Chart */}
						<div className='bg-white rounded-xl shadow-lg p-6'>
							<h3 className='text-lg font-semibold text-gray-700 mb-4'>
								Community Leaderboard
							</h3>
							<Bar data={leaderboardChart} options={{ responsive: true }} />
						</div>
					</div>

					{/* Achievements Gallery with Sharing */}
					<motion.div className='bg-white rounded-xl shadow-lg p-6'>
						<h3 className='text-xl font-bold text-green-800 mb-4'>
							Your Green Achievements
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
							{achievements.map((achievement, index) => (
								<motion.div
									key={index}
									whileHover={{ scale: 1.05 }}
									className='bg-gradient-to-br from-green-100 to-teal-100 rounded-lg p-4'
								>
									<div className='flex justify-between items-start mb-2'>
										<h4 className='font-semibold text-green-800'>
											{achievement.milestone} Cups
										</h4>
										<QRCodeSVG
											value={`${window.location.origin}/achievement/${achievement._id}`}
											size={64}
											className='rounded'
										/>
									</div>
									<p className='text-sm text-green-600 mb-3'>
										Achieved on{" "}
										{new Date(achievement.achievedAt).toLocaleDateString()}
									</p>
									<div className='flex space-x-2'>
										<button
											onClick={() => {
												setSelectedAchievement(achievement);
												setShowCertificate(true);
											}}
											className='flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors'
										>
											View Certificate
										</button>
										<button
											onClick={() => shareAchievement(achievement)}
											className='flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors'
										>
											Share
										</button>
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>

					{/* Certificate Modal */}
					{showCertificate && selectedAchievement && (
						<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
							<motion.div
								initial={{ scale: 0.9, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								className='bg-white p-8 rounded-lg max-w-2xl w-full'
							>
								<div id='certificate' className='certificate-container'>
									{/* Certificate content will be generated here */}
								</div>
								<div className='flex justify-end mt-4 space-x-2'>
									<button
										onClick={() => setShowCertificate(false)}
										className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
									>
										Close
									</button>
									<button
										onClick={() => shareAchievement(selectedAchievement)}
										className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
									>
										Share
									</button>
								</div>
							</motion.div>
						</div>
					)}
				</div>
			</div>
		</BaseLayout>
	);
};

export default Encourage;
