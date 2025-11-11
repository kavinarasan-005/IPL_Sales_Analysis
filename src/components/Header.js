import React from 'react';
import { Trophy } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Trophy className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">IPL Data Analysis Dashboard</h1>
              <p className="text-blue-100 text-sm mt-1">Comprehensive Cricket Analytics</p>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
              <p className="text-sm">Live Analytics</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


