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
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import BaseLayout from '../Layouts/BaseLayout';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { 
  createEnvironmentalStatsConfig, 
  createChemicalImpactConfig,
  createProgressChartConfig,
  createLeaderboardChartConfig 
} from '../utils/chartConfigs';

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
  const nextMilestone = milestones.find(m => m > (userData?.recycledCups || 0)) || 'Max Level!';

  const [chemicalImpact, setChemicalImpact] = useState({
    bpa: 0,
    phthalates: 0,
    dioxins: 0,
    styrene: 0,
    polyethylene: 0
  });

  const environmentalStats = {
    labels: [
      'Trees Spared', 
      'Water Saved (L)', 
      'CO2 Reduced (kg)',
      'BPA Avoided (mg)',
      'Phthalates Avoided (mg)',
      'Dioxins Avoided (µg)',
      'Styrene Avoided (mg)',
      'Polyethylene Avoided (g)'
    ],
    datasets: [{
      data: [
        stats.treesSpared,
        stats.waterSaved,
        stats.co2Reduced,
        stats.bpa,
        stats.phthalates,
        stats.dioxins,
        stats.styrene,
        stats.polyethylene
      ],
      backgroundColor: [
        '#4ade80',
        '#60a5fa',
        '#34d399',
        '#f87171',
        '#c084fc',
        '#fbbf24',
        '#f472b6',
        '#a78bfa'
      ]
    }]
  };

  // Enhance the calculateStats function to ensure accurate calculations based on recycledCups
  const calculateStats = (cups) => {
    return {
      treesSpared: (cups * 0.002).toFixed(2), // 1 tree produces ~59,000 paper cups
      waterSaved: (cups * 0.04).toFixed(2), // 33ml water per paper cup production
      co2Reduced: (cups * 0.012).toFixed(2), // 11.2g CO2 per paper cup
      bpa: (cups * 0.05).toFixed(2), // 5µg BPA per plastic cup
      phthalates: (cups * 0.08).toFixed(2), // 15µg phthalates per plastic cup
      dioxins: (cups * 0.002).toFixed(4), // 2ng dioxins per paper cup
      styrene: (cups * 0.15).toFixed(2), // 25µg styrene per plastic cup
      polyethylene: (cups * 0.35).toFixed(2) // 50mg polyethylene per plastic cup
    };
  };

  const generateCertificate = async (achievement) => {
    return new Promise((resolve) => {
      const certificateElement = document.createElement('div');
      certificateElement.className = 'certificate-container bg-white p-8 rounded-lg border-8 border-green-600 text-center';
      certificateElement.style.width = '800px';
      certificateElement.style.height = '600px';
      
      certificateElement.innerHTML = `
        <div class="certificate-content">
          <h1 class="text-3xl font-bold mb-4">Certificate of Achievement</h1>
          
          <p class="text-xl mb-2">This certifies that</p>
          <h2 class="text-2xl font-bold mb-4">${userData?.username}</h2>
          <p class="text-xl mb-4">has successfully recycled</p>
          <h3 class="text-4xl font-bold text-green-600 mb-4">${achievement.milestone} Cups</h3>
          <p class="text-lg mb-4">Contributing to a greener planet</p>
          <div class="mt-8">
            <p class="text-md">Awarded on ${new Date().toLocaleDateString()}</p>
            <p class="text-md">Cup Karma Environmental Initiative</p>
          </div>
        </div>
      `;

      document.body.appendChild(certificateElement);
      
      html2canvas(certificateElement).then(canvas => {
        document.body.removeChild(certificateElement);
        resolve(canvas.toDataURL('image/png'));
      });
    });
  };

  const shareAchievement = async (achievement) => {
    try {
      await generateCertificate(achievement);
      window.location.href = 'https://www.exampleShareSite.com';
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const refreshData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [userResponse, leaderboardResponse, achievementsResponse] = await Promise.all([
        axios.get('http://localhost:3000/api/stats/user', { 
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:3000/api/stats/leaderboard', { 
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:3000/api/stats/achievements', { 
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setUserData(userResponse.data);
      setLeaderboard(leaderboardResponse.data);
      setAchievements(achievementsResponse.data);
      const updatedStats = calculateStats(userResponse.data.recycledCups);
      setStats(updatedStats);
      setChemicalImpact({
        bpa: updatedStats.bpa,
        phthalates: updatedStats.phthalates,
        dioxins: updatedStats.dioxins,
        styrene: updatedStats.styrene,
        polyethylene: updatedStats.polyethylene
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError(error.response?.data?.message || 'An unexpected error occurred.');
    }
  };

  // New input handler
  const handleMetricsChange = (e) => {
    const { name, value } = e.target;
    // Remove any non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    setNewMetrics(prev => ({
      ...prev,
      [name]: numericValue
    }));
  };

  // Updated metrics change handler with direct achievement checking
  const changeMetrics = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const updatedCups = parseFloat(newMetrics.recycledCups);
      const dailyUsage = parseFloat(newMetrics.dailyCupUsage) || 0;

      if (isNaN(updatedCups) || updatedCups < 0) {
        alert('Please enter a valid number of cups');
        return;
      }

      // Update user stats
      const response = await axios.patch(
        'http://localhost:3000/api/stats/update-metrics',
        {
          recycledCups: updatedCups,
          dailyCupUsage: dailyUsage
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      // Update local state with response data
      setUserData(response.data.user);
      const newStats = calculateStats(response.data.user.recycledCups);
      setStats(newStats);
      setChemicalImpact({
        bpa: newStats.bpa,
        phthalates: newStats.phthalates,
        dioxins: newStats.dioxins,
        styrene: newStats.styrene,
        polyethylene: newStats.polyethylene
      });

      // If new achievement was unlocked
      if (response.data.achievement) {
        const alreadyExists = achievements.some(a => a._id === response.data.achievement._id);
        if (!alreadyExists) {
          setAchievements(prev => [...prev, response.data.achievement]);
        }
      }

      // Reset form
      setNewMetrics({ recycledCups: '', dailyCupUsage: '' });
      setShowMetricsForm(false);

      // Refresh all data
      await refreshData();

      if (socket) {
        socket.emit('metricsUpdated');
      }

      // Check and unlock achievements based on the updated cups
      await checkAndUnlockAchievements(response.data.user.recycledCups);
    } catch (error) {
      console.error('Error updating metrics:', error);
      setError(error.response?.data?.message || 'An unexpected error occurred while updating metrics.');
    }
  };

  // Updated achievement checking function
  const checkAndUnlockAchievements = async (currentCups) => {
    if (!currentCups) return;
    
    const token = localStorage.getItem('token');
    try {
      // Get all possible milestones up to current cups
      const unlockedMilestones = milestones.filter(m => currentCups >= m);
      
      // Get existing achievements
      const response = await axios.get('http://localhost:3000/api/stats/achievements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const existingAchievements = response.data;
      const existingMilestones = existingAchievements.map(a => a.milestone);
      
      // Find new milestones
      const newMilestones = unlockedMilestones.filter(m => !existingMilestones.includes(m));
      
      // Create new achievements
      const newAchievements = [];
      for (const milestone of newMilestones) {
        try {
          const achievementResponse = await axios.post(
            'http://localhost:3000/api/stats/achievements',
            { milestone },
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true
            }
          );
          
          if (achievementResponse.data) {
            newAchievements.push(achievementResponse.data);
          }
        } catch (error) {
          console.error('Error creating achievement:', error);
        }
      }
      
      if (newAchievements.length > 0) {
        // Update local achievements state with new achievements
        setAchievements(prev => [...prev, ...newAchievements]);
        
        // Show the highest milestone achievement
        const highestAchievement = newAchievements.reduce((prev, current) => 
          (current.milestone > prev.milestone) ? current : prev
        );
        
        setSelectedAchievement(highestAchievement);
        
        // Alert the user
        alert(`Congratulations! You've unlocked ${newAchievements.length} new achievement(s)!`);
        
        // Refresh user data to update achievement count
        await refreshData();
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        const [userResponse, leaderboardResponse, achievementsResponse] = await Promise.all([
          axios.get('http://localhost:3000/api/stats/user', { 
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:3000/api/stats/leaderboard', { 
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:3000/api/stats/achievements', { 
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setUserData(userResponse.data);
        setLeaderboard(leaderboardResponse.data);
        setAchievements(achievementsResponse.data);
        setStats(calculateStats(userResponse.data.recycledCups));
        
      } catch (error) {
        console.error('Error fetching data:', error.response || error);
        setError(error.response?.data?.message || 'An unexpected error occurred.');
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
    newSocket.on('leaderboardUpdate', (updatedLeaderboard) => {
      setLeaderboard(updatedLeaderboard);
    });

    // Listen for metrics updates from other users
    newSocket.on('metricsUpdated', () => {
      refreshData();
    });

		return () => newSocket.disconnect();
	}, []);

  // Ensure that graph data relies on the latest recycledCups from the userData state
  useEffect(() => {
    if (userData) {
      const updatedStats = calculateStats(userData.recycledCups);
      setStats(updatedStats);
      setChemicalImpact({
        bpa: updatedStats.bpa,
        phthalates: updatedStats.phthalates,
        dioxins: updatedStats.dioxins,
        styrene: updatedStats.styrene,
        polyethylene: updatedStats.polyethylene
      });
    }
  }, [userData]);

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
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Current Streak
        </h3>
        <p className="text-3xl font-bold text-orange-500">
          {userData?.streak?.count || 0} days
        </p>
      </motion.div>
    </div>
  );

  // Update the metrics form component
  const MetricsForm = () => (
    <form onSubmit={changeMetrics} className="mt-4 space-y-4">
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Total Recycled Cups</label>
        <input
          type="text"
          name="recycledCups"
          pattern="\d*"
          required
          value={newMetrics.recycledCups}
          onChange={handleMetricsChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          placeholder="Enter total number of cups recycled"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Daily Cup Usage</label>
        <input
          type="text"
          name="dailyCupUsage"
          pattern="\d*"
          value={newMetrics.dailyCupUsage}
          onChange={handleMetricsChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          placeholder="Enter daily cup usage (optional)"
        />
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => setShowMetricsForm(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Update Metrics
        </button>
      </div>
    </form>
  );

  const ChemicalImpactSection = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h3 className="text-xl font-bold text-green-800 mb-4">
        Harmful Chemicals Avoided
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="font-semibold text-red-700">BPA</p>
          <p className="text-2xl font-bold text-red-600">{chemicalImpact.bpa} mg</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="font-semibold text-purple-700">Phthalates</p>
          <p className="text-2xl font-bold text-purple-600">{chemicalImpact.phthalates} mg</p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="font-semibold text-yellow-700">Dioxins</p>
          <p className="text-2xl font-bold text-yellow-600">{chemicalImpact.dioxins} µg</p>
        </div>
        <div className="p-4 bg-pink-50 rounded-lg">
          <p className="font-semibold text-pink-700">Styrene</p>
          <p className="text-2xl font-bold text-pink-600">{chemicalImpact.styrene} mg</p>
        </div>
        <div className="p-4 bg-violet-50 rounded-lg">
          <p className="font-semibold text-violet-700">Polyethylene</p>
          <p className="text-2xl font-bold text-violet-600">{chemicalImpact.polyethylene} g</p>
        </div>
      </div>
    </div>
  );

  // Define the chemicalImpactChart variable
  const chemicalImpactChart = createChemicalImpactConfig(chemicalImpact);

  // Add Chemical Impact Chart component
  const ChemicalImpactChart = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h3 className="text-xl font-bold text-green-800 mb-4">
        Chemicals Avoided Over Time
      </h3>
      <Bar
        data={chemicalImpactChart}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Amount (mg)'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Harmful Chemicals Avoided Through Recycling'
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y;
                  return `${label}: ${value.toFixed(2)} mg`;
                }
              }
            }
          }
        }}
      />
    </div>
  );

const ChartSection = () => (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Weekly Progress</h3>
          <Line data={createProgressChartConfig(userData?.weeklyProgress)} options={{ maintainAspectRatio: true }} />
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Leaderboard</h3>
          <Bar data={createLeaderboardChartConfig(leaderboard)} options={{ maintainAspectRatio: true }} />
        </div>
      </div>
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
          <motion.div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-green-800 mb-4">
              Your Environmental Impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Doughnut data={environmentalStats} />
              </div>
              <div className="flex flex-col justify-center">
                <div className="mb-4">
                  <p className="text-lg font-semibold">Trees Spared</p>
                  <p className="text-3xl font-bold text-green-600">{stats.treesSpared}</p>
                </div>
                <div className="mb-4">
                  <p className="text-lg font-semibold">Water Saved</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.waterSaved}L</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">CO2 Reduced</p>
                  <p className="text-3xl font-bold text-teal-600">{stats.co2Reduced}kg</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowMetricsForm(true)}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Change Metrics
            </button>
            {showMetricsForm && <MetricsForm />}
          </motion.div>

          <ChemicalImpactSection />
          <ChemicalImpactChart />

          {/* Charts */}
          <ChartSection />

          
          {/* Achievements Gallery with Sharing */}
          <motion.div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-green-800 mb-4">
              Your Green Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-green-100 to-teal-100 rounded-lg p-4"
                >
                  <div className="flex items-center mb-2">
                    <h4 className="font-semibold text-green-800 mr-2">
                      {achievement.milestone} Cups
                    </h4>
                    <QRCodeSVG
                      value={`${window.location.origin}/achievement/${achievement._id}`}
                      size={48}
                    />
                  </div>
                  <p className="text-sm text-green-600 mb-3">
                    Achieved on {new Date(achievement.achievedAt).toLocaleDateString()}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedAchievement(achievement);
                        setShowCertificate(true);
                      }}
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      View Certificate
                    </button>
                    <button
                      onClick={() => shareAchievement(achievement)}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-8 rounded-lg max-w-4xl w-full"
              >
                <div id="certificate" className="certificate-container">
                  <div className="bg-white p-8 rounded-lg border-8 border-green-600 text-center">
                    <h1 className="text-3xl font-bold mb-4">Certificate of Achievement</h1>
                    <p className="text-xl mb-2">This certifies that</p>
                    <h2 className="text-2xl font-bold mb-4">{userData?.username || 'User'}</h2>
                    <p className="text-xl mb-4">has successfully recycled</p>
                    <h3 className="text-4xl font-bold text-green-600 mb-4">
                      {selectedAchievement.milestone} Cups
                    </h3>
                    <p className="text-lg mb-4">Contributing to a greener planet</p>
                    <p className="text-md">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={() => setShowCertificate(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => shareAchievement(selectedAchievement)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
