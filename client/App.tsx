import React, { useState } from 'react';
import Header from './components/Header';
import AdminDashboard from './pages/AdminDashboard';
import CitizenPortal from './pages/CitizenPortal';
import Button from './components/Button';
import { ICONS } from './constants';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'admin' | 'citizen'>('landing');

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#121212]">
      {currentView !== 'landing' && (
        <Header 
          type={currentView} 
          onLogout={() => setCurrentView('landing')} 
        />
      )}

      {currentView === 'landing' && (
        <div className="flex-1 flex flex-col">
           <Header type="landing" />
           <div className="flex-1 flex items-center justify-center p-6 bg-[#F8F7F4]">
             <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
               <motion.div 
                 initial={{ opacity: 0, x: -50 }} 
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.6 }}
               >
                 <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#111827] leading-tight tracking-tight">
                   Ensuring Data <span className="text-[#B91C1C]">Integrity</span> for a Digital India.
                 </h1>
                 <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                   AADHAAR Drishti is a privacy-first platform designed to analyze data freshness gaps and empower citizens to keep their digital identity up to date.
                 </p>
                 <div className="flex gap-6">
                   <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                     <ICONS.Shield className="text-green-700" size={18} />
                     Privacy by Design
                   </div>
                   <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                     <ICONS.Lock className="text-[#B91C1C]" size={18} />
                     DPDP Compliant
                   </div>
                 </div>
               </motion.div>

               <div className="space-y-6">
                 <motion.div 
                    whileHover={{ y: -4 }}
                    className="bg-white p-8 rounded-xl shadow-md border border-gray-200 cursor-pointer group transition-all"
                    onClick={() => setCurrentView('admin')}
                 >
                   <div className="flex items-center justify-between mb-5">
                     <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-[#1F2937] transition-colors">
                       <ICONS.BarChart2 className="text-[#1F2937] group-hover:text-white" size={24} />
                     </div>
                     <ICONS.ArrowRight className="text-gray-300 group-hover:text-[#1F2937]" />
                   </div>
                   <h3 className="text-xl font-bold mb-2 text-[#111827]">Government Dashboard</h3>
                   <p className="text-sm text-gray-500 leading-relaxed">For UIDAI Officials. Analyze aggregated freshness scores, migration trends, and generate risk reports.</p>
                 </motion.div>

                 <motion.div 
                    whileHover={{ y: -4 }}
                    className="bg-white p-8 rounded-xl shadow-md border border-gray-200 cursor-pointer group transition-all"
                    onClick={() => setCurrentView('citizen')}
                 >
                   <div className="flex items-center justify-between mb-5">
                     <div className="p-3 bg-red-50 rounded-lg group-hover:bg-[#B91C1C] transition-colors">
                       <ICONS.Users className="text-[#B91C1C] group-hover:text-white" size={24} />
                     </div>
                     <ICONS.ArrowRight className="text-gray-300 group-hover:text-[#B91C1C]" />
                   </div>
                   <h3 className="text-xl font-bold mb-2 text-[#111827]">Citizen Portal</h3>
                   <p className="text-sm text-gray-500 leading-relaxed">For Residents. Check your data status, understand update requirements, and locate centers.</p>
                 </motion.div>
               </div>
             </div>
           </div>
        </div>
      )}

      {currentView === 'admin' && <AdminDashboard />}
      {currentView === 'citizen' && <CitizenPortal />}
    </div>
  );
};

export default App;