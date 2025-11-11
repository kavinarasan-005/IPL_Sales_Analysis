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

const RunsInWinsChart = ({ data }) => {
  const [topN, setTopN] = useState(15);

  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    // Filter out players with 0 runs, sort by avg_runs_in_wins DESC, then take topN
    // Reverse for vertical bar chart: Recharts shows first item at bottom, so reverse puts highest at top
    const filteredAndSorted = data
      .filter(item => parseFloat(item.avg_runs_in_wins) > 0)
      .sort((a, b) => {
        const runsA = parseFloat(a.avg_runs_in_wins) || 0;
        const runsB = parseFloat(b.avg_runs_in_wins) || 0;
        return runsB - runsA; // DESC order (highest first)
      })
      .slice(0, topN)
      .map((item) => ({
        name: item.player_name || 'Unknown',
        avgRuns: parseFloat(item.avg_runs_in_wins) || 0,
        innings: parseFloat(item.innings_played) || 0
      }))
      .reverse(); // Reverse so top performer appears at top of vertical bar chart
    
    return filteredAndSorted;
  }, [data, topN]);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No data available for runs in winning matches</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-bold">{payload[0].payload.name}</p>
          <p className="text-purple-600">Avg Runs: {payload[0].value.toFixed(2)}</p>
          <p className="text-gray-500">Innings: {payload[0].payload.innings}</p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No data available for runs in winning matches</p>
      </div>
    );
  }

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
            dataKey="avgRuns" 
            fill="#9b59b6"
            radius={[0, 4, 4, 0]}
            name="Avg Runs in Wins"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RunsInWinsChart;


