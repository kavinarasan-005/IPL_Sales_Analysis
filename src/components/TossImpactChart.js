import React, { useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

const TossImpactChart = ({ data }) => {
  const [viewMode, setViewMode] = useState('countplot'); // 'countplot' or 'pie'

  // Process data for countplot (like notebook Cell 31)
  const countplotData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    // Group by toss_winner and match_outcome
    const grouped = {};
    data.forEach(item => {
      const tossWinner = item.toss_winner || 'Unknown';
      const outcome = item.match_outcome || 'Unknown';
      
      if (!grouped[tossWinner]) {
        grouped[tossWinner] = { Won: 0, Lost: 0, name: tossWinner };
      }
      if (outcome === 'Won') {
        grouped[tossWinner].Won += 1;
      } else {
        grouped[tossWinner].Lost += 1;
      }
    });

    return Object.values(grouped)
      .sort((a, b) => (b.Won + b.Lost) - (a.Won + a.Lost))
      .slice(0, 15);
  }, [data]);

  // Process data for pie chart
  const pieData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    const outcomeCounts = data.reduce((acc, item) => {
      const outcome = item.match_outcome || 'Unknown';
      acc[outcome] = (acc[outcome] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(outcomeCounts).map(([name, value]) => ({
      name,
      value
    }));
  }, [data]);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No data available for toss impact analysis</p>
      </div>
    );
  }

  const COLORS = ['#2ecc71', '#e74c3c', '#3498db'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload || payload[0];
      if (viewMode === 'countplot') {
        return (
          <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
            <p className="font-bold">{data.name}</p>
            <p className="text-green-600">Won: {data.Won}</p>
            <p className="text-red-600">Lost: {data.Lost}</p>
            <p className="text-gray-500">Total: {data.Won + data.Lost}</p>
          </div>
        );
      } else {
        const total = pieData.reduce((sum, item) => sum + item.value, 0);
        const percentage = ((data.value / total) * 100).toFixed(1);
        return (
          <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
            <p className="font-bold">{data.name}</p>
            <p className="text-blue-600">Matches: {data.value}</p>
            <p className="text-gray-500">Percentage: {percentage}%</p>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">Toss Impact Analysis</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('countplot')}
            className={`px-3 py-1 rounded text-sm ${
              viewMode === 'countplot'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            By Team
          </button>
          <button
            onClick={() => setViewMode('pie')}
            className={`px-3 py-1 rounded text-sm ${
              viewMode === 'pie'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Overall
          </button>
        </div>
      </div>
      {viewMode === 'countplot' ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={countplotData}
            margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 11 }}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Won" stackId="a" fill="#2ecc71" name="Won" />
            <Bar dataKey="Lost" stackId="a" fill="#e74c3c" name="Lost" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TossImpactChart;


