export const createEnvironmentalStatsConfig = (stats) => ({
  labels: [
    'Trees Spared', 
    'Water Saved (L)', 
    'CO2 Reduced (kg)'
  ],
  datasets: [{
    data: [
      stats.treesSpared,
      stats.waterSaved,
      stats.co2Reduced
    ],
    backgroundColor: [
      '#4ade80',
      '#60a5fa',
      '#34d399'
    ]
  }]
});

export const createChemicalImpactConfig = (chemicalImpact) => ({
  labels: ['BPA', 'Phthalates', 'Dioxins', 'Styrene', 'Polyethylene'],
  datasets: [{
    label: 'Chemicals Avoided',
    data: [
      chemicalImpact.bpa,
      chemicalImpact.phthalates,
      chemicalImpact.dioxins,
      chemicalImpact.styrene,
      chemicalImpact.polyethylene
    ],
    backgroundColor: [
      'rgba(255, 99, 132, 0.5)',
      'rgba(153, 102, 255, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(255, 159, 64, 0.5)',
      'rgba(75, 192, 192, 0.5)'
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(255, 159, 64, 1)',
      'rgba(75, 192, 192, 1)'
    ],
    borderWidth: 1
  }]
});

export const createProgressChartConfig = (weeklyProgress) => ({
  labels: ['Last Week', '2 Weeks Ago', '3 Weeks Ago', '4 Weeks Ago'],
  datasets: [{
    label: 'Cups Recycled',
    data: weeklyProgress || [0, 0, 0, 0],
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
});

export const createLeaderboardChartConfig = (leaderboard) => ({
  labels: leaderboard.map(user => user.username),
  datasets: [{
    label: 'Cups Recycled',
    data: leaderboard.map(user => user.recycledCups),
    backgroundColor: 'rgba(75, 192, 192, 0.5)'
  }]
});
