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

const ScoresByVenueChart = ({ data }) => {
  const [sortBy, setSortBy] = useState('average'); // 'average' or 'highest'

  // Process and sort data based on selected metric
  const sortedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    const processed = [...data]
      .map(item => ({
        ...item,
        average_score: parseFloat(item.average_score) || 0,
        highest_score: parseFloat(item.highest_score) || 0
      }))
      .sort((a, b) => {
        if (sortBy === 'average') {
          return b.average_score - a.average_score;
        }
        return b.highest_score - a.highest_score;
      })
      .slice(0, 15)
      .reverse(); // Reverse for vertical bar chart (highest at top)

    return processed;
  }, [data, sortBy]);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No data available for scores by venue</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const currentValue = sortBy === 'average' ? data.average_score : data.highest_score;
      const currentLabel = sortBy === 'average' ? 'Average Score' : 'Highest Score';
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-bold text-lg">{data.venue_name}</p>
          <p className={`text-lg font-semibold ${sortBy === 'average' ? 'text-blue-600' : 'text-purple-600'}`}>
            {currentLabel}: {currentValue.toFixed(1)}
          </p>
          <hr className="my-2" />
          <p className="text-sm text-gray-600">Average: {data.average_score.toFixed(1)}</p>
          <p className="text-sm text-gray-600">Highest: {data.highest_score.toFixed(1)}</p>
        </div>
      );
    }
    return null;
  };

  const getColor = (value, max) => {
    if (max === 0) return '#96CEB4'; // Default color if max is 0
    const ratio = value / max;
    if (ratio > 0.8) return '#FF6B6B';
    if (ratio > 0.6) return '#4ECDC4';
    if (ratio > 0.4) return '#45B7D1';
    return '#96CEB4';
  };

  const maxValue = sortedData.length > 0 
    ? Math.max(...sortedData.map(d => sortBy === 'average' ? d.average_score : d.highest_score))
    : 0;

  const currentMetricLabel = sortBy === 'average' ? 'Average Score' : 'Highest Score';

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Scores by Venue</h3>
          <p className="text-sm text-gray-500 mt-1">Showing: {currentMetricLabel}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('average')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              sortBy === 'average'
                ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Average Score
          </button>
          <button
            onClick={() => setSortBy('highest')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              sortBy === 'highest'
                ? 'bg-purple-600 text-white shadow-lg ring-2 ring-purple-300'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Highest Score
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          key={sortBy} // Force re-render when metric changes
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            domain={[0, 'dataMax + 10']}
            label={{ value: currentMetricLabel, position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            type="category"
            dataKey="venue_name"
            width={115}
            tick={{ fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            payload={[{
              value: currentMetricLabel,
              type: 'rect',
              color: sortBy === 'average' ? '#3B82F6' : '#A855F7'
            }]}
          />
          <Bar
            dataKey={sortBy === 'average' ? 'average_score' : 'highest_score'}
            radius={[0, 4, 4, 0]}
            name={currentMetricLabel}
            fill={sortBy === 'average' ? '#3B82F6' : '#A855F7'}
            isAnimationActive={true}
            animationDuration={500}
            animationBegin={0}
          >
            {sortedData.map((entry, index) => {
              // Use solid, distinct colors based on metric
              const fillColor = sortBy === 'average' ? '#3B82F6' : '#A855F7';
              return (
                <Cell
                  key={`cell-${entry.venue_name}-${sortBy}-${index}`}
                  fill={fillColor}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoresByVenueChart;


