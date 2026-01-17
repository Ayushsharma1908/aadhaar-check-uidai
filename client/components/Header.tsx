import React from 'react';
import { ICONS, COLORS } from '../constants';

interface HeaderProps {
  type: 'admin' | 'citizen' | 'landing';
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ type, onLogout }) => {
  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#1F2937] rounded-lg flex items-center justify-center text-white shadow-sm">
            <span className="font-bold text-xl">₹</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#111827] uppercase leading-none">
              AADHAAR Drishti
            </h1>
            <p className="text-xs text-gray-500 mt-1 font-medium tracking-widest uppercase">
              UIDAI Data Freshness Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {type === 'admin' && (
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 border border-gray-200 rounded-md">
              <ICONS.Lock size={14} className="text-gray-700" />
              <span className="text-xs font-bold text-gray-700 uppercase">Official Access</span>
            </div>
          )}
          {type === 'citizen' && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-100 rounded-md">
              <ICONS.Users size={14} className="text-[#B91C1C]" />
              <span className="text-xs font-bold text-[#B91C1C] uppercase">Citizen Service</span>
            </div>
          )}
          
          {onLogout && (
             <button onClick={onLogout} className="text-sm font-semibold text-gray-500 hover:text-[#B91C1C] transition-colors">
               Sign Out
             </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;