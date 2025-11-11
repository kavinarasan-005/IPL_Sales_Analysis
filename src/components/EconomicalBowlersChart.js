import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const EconomicalBowlersChart = ({ data }) => {
  const [topN, setTopN] = useState(15);

  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data
      .slice(0, topN)
      .map((item) => ({
        name: item.player_name || 'Unknown',
        economy: parseFloat(item.avg_runs_per_ball) || 0,
        wickets: parseFloat(item.total_wickets) || 0
      }))
      .reverse(); // Reverse to show best at top (for vertical bar chart)
  }, [data, topN]);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No data available for economical bowlers</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No data available for economical bowlers</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-bold">{payload[0].payload.name}</p>
          <p className="text-green-600">Economy: {payload[0].value.toFixed(2)}</p>
          <p className="text-gray-500">Wickets: {payload[0].payload.wickets}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="mb-4 flex justify-end items-center">
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
            dataKey="economy" 
            fill="#70AD47"
            radius={[0, 4, 4, 0]}
            name="Economy Rate"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EconomicalBowlersChart;


