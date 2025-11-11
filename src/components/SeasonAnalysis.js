import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const SeasonAnalysis = ({ data }) => {
  // Group by season and calculate average runs
  const seasonData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    const grouped = data.reduce((acc, item) => {
      const season = item.season_year || 'Unknown';
      const runs = parseFloat(item.total_runs) || 0;
      
      if (!acc[season]) {
        acc[season] = { season, total: 0, count: 0 };
      }
      
      acc[season].total += runs;
      acc[season].count += 1;
      
      return acc;
    }, {});

    return Object.values(grouped)
      .map(item => ({
        season: item.season.toString(),
        avgRuns: parseFloat((item.total / item.count).toFixed(2)),
        totalRuns: item.total,
        players: item.count
      }))
      .sort((a, b) => parseFloat(a.season) - parseFloat(b.season));
  }, [data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-bold">Season {data.season}</p>
          <p className="text-blue-600">Avg Runs: {data.avgRuns.toFixed(2)}</p>
          <p className="text-gray-500">Total Players: {data.players}</p>
        </div>
      );
    }
    return null;
  };

  if (seasonData.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No season data available</p>
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={seasonData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="season" 
            label={{ value: 'Season', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            label={{ value: 'Average Runs', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="avgRuns" 
            stroke="#366092" 
            strokeWidth={3}
            dot={{ fill: '#366092', r: 6 }}
            activeDot={{ r: 8 }}
            name="Average Runs"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {seasonData.slice(0, 3).map((season) => (
          <div key={season.season} className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Season {season.season}</p>
            <p className="text-2xl font-bold text-primary">{season.avgRuns.toFixed(2)}</p>
            <p className="text-xs text-gray-400">Average Runs</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonAnalysis;


