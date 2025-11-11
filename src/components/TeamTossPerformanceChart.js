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

const TeamTossPerformanceChart = ({ data }) => {
  const [metric, setMetric] = useState('wins'); // 'wins' or 'ratio'

  // Process and prepare chart data - MUST be called before any conditional returns
  const chartData = useMemo(() => {
    // Handle empty data
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    const processed = data
      .map(item => {
        const wins = parseFloat(item.wins_after_toss) || 0;
        const matches = parseFloat(item.matches_played) || 0;
        return {
          team: item.team1 || 'Unknown',
          wins_after_toss: wins,
          matches_played: matches,
          win_ratio: matches > 0 
            ? parseFloat(((wins / matches) * 100).toFixed(1))
            : 0
        };
      })
      .filter(item => item.matches_played > 0); // Filter out teams with no matches
    
    // Sort the data
    const sorted = [...processed].sort((a, b) => {
      if (metric === 'wins') {
        // Sort by wins DESC, then by team name for consistency
        if (b.wins_after_toss !== a.wins_after_toss) {
          return b.wins_after_toss - a.wins_after_toss;
        }
        return a.team.localeCompare(b.team);
      }
      // Sort by win_ratio DESC, then by wins DESC, then by team name
      if (b.win_ratio !== a.win_ratio) {
        return b.win_ratio - a.win_ratio;
      }
      if (b.wins_after_toss !== a.wins_after_toss) {
        return b.wins_after_toss - a.wins_after_toss;
      }
      return a.team.localeCompare(b.team);
    });
    
    // Reverse so top performers appear at top of vertical chart
    // Don't slice - show all teams
    return sorted.reverse();
  }, [data, metric]);

  // Early return after hooks
  if (!data || !Array.isArray(data) || data.length === 0 || chartData.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No data available for team toss performance</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-bold">{data.team}</p>
          <p className="text-green-600">Wins After Toss: {data.wins_after_toss}</p>
          <p className="text-blue-600">Matches Played: {data.matches_played}</p>
          <p className="text-purple-600">Win Ratio: {data.win_ratio}%</p>
        </div>
      );
    }
    return null;
  };

  const getColor = (value, max) => {
    if (max === 0) return '#95a5a6'; // Gray for zero max value
    if (value === 0) return '#e74c3c'; // Red for zero wins
    const ratio = value / max;
    if (ratio > 0.7) return '#2ecc71'; // Green for high performance
    if (ratio > 0.5) return '#3498db'; // Blue for good performance
    if (ratio > 0.3) return '#f39c12'; // Orange for moderate performance
    return '#e74c3c'; // Red for low performance
  };

  // Calculate max value, but ensure minimum domain for better visibility
  const maxValue = chartData.length > 0
    ? Math.max(
        ...chartData.map(d => metric === 'wins' ? d.wins_after_toss : d.win_ratio)
      )
    : 0;
  
  // For wins, ensure domain shows at least 0-2 so we can see the scale properly
  // For ratio, ensure domain shows at least 0-100
  const xAxisDomain = metric === 'wins' 
    ? [0, Math.max(maxValue, 2)] // At least 0-2 for wins
    : [0, Math.max(maxValue, 10)]; // At least 0-10% for ratio

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Team Performance After Winning Toss</h3>
          <p className="text-sm text-gray-500 mt-1">Showing {chartData.length} teams</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMetric('wins')}
            className={`px-3 py-1 rounded text-sm ${
              metric === 'wins'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Total Wins
          </button>
          <button
            onClick={() => setMetric('ratio')}
            className={`px-3 py-1 rounded text-sm ${
              metric === 'ratio'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Win Ratio
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={Math.max(400, chartData.length * 50)}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            domain={xAxisDomain}
            allowDecimals={metric === 'wins' ? false : true}
            tickFormatter={metric === 'wins' ? (value) => Math.round(value) : (value) => `${Math.round(value)}%`}
          />
          <YAxis
            type="category"
            dataKey="team"
            width={145}
            tick={{ fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey={metric === 'wins' ? 'wins_after_toss' : 'win_ratio'}
            radius={[0, 4, 4, 0]}
            name={metric === 'wins' ? 'Wins After Toss' : 'Win Ratio (%)'}
            minPointSize={2}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getColor(
                  metric === 'wins' ? entry.wins_after_toss : entry.win_ratio,
                  Math.max(maxValue, metric === 'wins' ? 2 : 10)
                )}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TeamTossPerformanceChart;


