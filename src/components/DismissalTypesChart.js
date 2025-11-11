import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFE66D', '#FF8B94', '#A8E6CF', '#FFD3A5'];

const DismissalTypesChart = ({ data }) => {
  const [viewMode, setViewMode] = useState('bar'); // 'bar' or 'pie'

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No data available for dismissal types</p>
      </div>
    );
  }

  // Format dismissal type names for better display
  const formatDismissalType = (type) => {
    return type
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const sortedData = [...data]
    .map(item => ({
      ...item,
      frequency: parseFloat(item.frequency) || 0,
      formattedType: formatDismissalType(item.out_type || 'Unknown')
    }))
    .sort((a, b) => b.frequency - a.frequency);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload || payload[0];
      const total = sortedData.reduce((sum, item) => sum + item.frequency, 0);
      const percentage = ((data.frequency / total) * 100).toFixed(1);
      const displayName = data.formattedType || data.out_type;
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-bold">{displayName}</p>
          <p className="text-blue-600">Frequency: {data.frequency.toLocaleString()}</p>
          <p className="text-gray-500">Percentage: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">Dismissal Types</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('bar')}
            className={`px-3 py-1 rounded text-sm ${
              viewMode === 'bar'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Bar Chart
          </button>
          <button
            onClick={() => setViewMode('pie')}
            className={`px-3 py-1 rounded text-sm ${
              viewMode === 'pie'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pie Chart
          </button>
        </div>
      </div>
      {viewMode === 'bar' ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 165, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="formattedType"
              width={160}
              tick={{ fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="frequency" radius={[0, 4, 4, 0]}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="w-full">
          <ResponsiveContainer width="100%" height={500}>
            <PieChart margin={{ top: 10, right: 10, bottom: 100, left: 10 }}>
              <Pie
                data={sortedData}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={({ percent }) => {
                  // Only show percentage labels for slices larger than 5% to avoid clutter
                  if (percent > 0.05) {
                    return `${(percent * 100).toFixed(0)}%`;
                  }
                  return '';
                }}
                outerRadius={100}
                innerRadius={0}
                fill="#8884d8"
                dataKey="frequency"
                nameKey="formattedType"
                paddingAngle={1}
                isAnimationActive={true}
              >
                {sortedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    const total = sortedData.reduce((sum, item) => sum + item.frequency, 0);
                    const percentage = ((data.payload.frequency / total) * 100).toFixed(1);
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                        <p className="font-bold">{data.payload.formattedType || data.payload.out_type}</p>
                        <p className="text-blue-600">Frequency: {data.payload.frequency.toLocaleString()}</p>
                        <p className="text-gray-500">Percentage: {percentage}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                align="center"
                height={80}
                wrapperStyle={{ paddingTop: '20px' }}
                payload={sortedData.map((entry, index) => {
                  const total = sortedData.reduce((sum, item) => sum + item.frequency, 0);
                  const percentage = ((entry.frequency / total) * 100).toFixed(1);
                  return {
                    value: `${entry.formattedType} (${percentage}%)`,
                    type: 'circle',
                    id: entry.out_type,
                    color: COLORS[index % COLORS.length]
                  };
                })}
                iconType="circle"
                layout="horizontal"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default DismissalTypesChart;


