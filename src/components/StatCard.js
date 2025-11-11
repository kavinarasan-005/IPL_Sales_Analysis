import React from 'react';

const StatCard = ({ title, value, subtitle, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">{value}</h3>
          <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
        </div>
        <div className={`${color} rounded-full p-4 text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;


