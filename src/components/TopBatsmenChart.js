import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

const TopBatsmenChart = ({ data }) => {
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [topN, setTopN] = useState(15);

  // Get unique seasons - must be before early return
  const seasons = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }
    const uniqueSeasons = [...new Set(data.map(item => item.season_year))].filter(Boolean).sort();
    return uniqueSeasons;
  }, [data]);

  // Filter and prepare data - must be before early return
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    let filtered = data;
    
    if (selectedSeason !== 'all') {
      filtered = data.filter(item => item.season_year === parseInt(selectedSeason));
    }

    // Aggregate by player if showing all seasons
    if (selectedSeason === 'all') {
      const playerMap = {};
      filtered.forEach(item => {
        const name = item.player_name || 'Unknown';
        if (!playerMap[name]) {
          playerMap[name] = { name, runs: 0, seasons: new Set() };
        }
        playerMap[name].runs += parseFloat(item.total_runs) || 0;
        playerMap[name].seasons.add(item.season_year);
      });
      filtered = Object.values(playerMap).map(p => ({
        player_name: p.name,
        total_runs: p.runs,
        season_year: Array.from(p.seasons).join(', ')
      }));
    }

    return filtered
      .sort((a, b) => (parseFloat(b.total_runs) || 0) - (parseFloat(a.total_runs) || 0))
      .slice(0, topN)
      .map((item, index) => ({
        name: item.player_name || 'Unknown',
        runs: parseFloat(item.total_runs) || 0,
        season: item.season_year || 'N/A',
        rank: index + 1
      }))
      .reverse(); // Reverse to show top player at top (for vertical bar chart)
  }, [data, selectedSeason, topN]);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No data available for top batsmen</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-bold">{payload[0].payload.name}</p>
          <p className="text-blue-600">Runs: {payload[0].value}</p>
          <p className="text-gray-500">Season: {payload[0].payload.season}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Season:</label>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Seasons</option>
            {seasons.map(season => (
              <option key={season} value={season}>{season}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Top N:</label>
          <select
            value={topN}
            onChange={(e) => setTopN(parseInt(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value={10}>Top 10</option>
            <option value={15}>Top 15</option>
            <option value={20}>Top 20</option>
            <option value={25}>Top 25</option>
          </select>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={90}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="runs" 
            radius={[0, 4, 4, 0]}
            name="Total Runs"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColorForRank(chartData.length - 1 - index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Color gradient for bars
const getColorForRank = (index) => {
  const colors = [
    '#FFD700', // Gold for #1
    '#C0C0C0', // Silver for #2
    '#CD7F32', // Bronze for #3
    '#366092', // Blue for others
  ];
  
  if (index === 0) return colors[0];
  if (index === 1) return colors[1];
  if (index === 2) return colors[2];
  return colors[3];
};

export default TopBatsmenChart;

