import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import { ICONS } from '../constants';
import { getAggregatedStats, getUpdateGapAnalysis, getMigrationImpactData, getDistricts, getAIRecommendations, getAllStates } from '../services/dataService';
import { RiskLevel } from '../types';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>({ freshnessScore: 0, highRiskDistricts: 0, avgFailureRate: 0 });
  const [migrationData, setMigrationData] = useState<any[]>([]);
  const [updateGaps, setUpdateGaps] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>('All States');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await getAggregatedStats();
        setStats(statsData);

        const migData = await getMigrationImpactData();
        setMigrationData(migData);

        const gapData = await getUpdateGapAnalysis();
        setUpdateGaps(gapData);

        const statesData = await getAllStates();
        setStates(statesData);

        const districtData = await getDistricts(selectedState === 'All States' ? undefined : selectedState);
        setDistricts(districtData);

        const recData = await getAIRecommendations();
        setRecommendations(recData);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };
    fetchData();
  }, [selectedState]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="pb-12 min-h-screen bg-[#F8F7F4]">
      {/* Sub-header / Filters */}
      <div className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3">
            <select 
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-gray-50 border border-gray-300 px-4 py-2 text-sm rounded-lg font-medium text-gray-700 focus:ring-1 focus:ring-gray-500 outline-none"
            >
              <option>All States</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <select className="bg-gray-50 border border-gray-300 px-4 py-2 text-sm rounded-lg font-medium text-gray-700 focus:ring-1 focus:ring-gray-500 outline-none">
              <option>All Age Groups</option>
              <option>0-5 Years</option>
              <option>18-35 Years</option>
              <option>60+ Years</option>
            </select>
            <select className="bg-gray-50 border border-gray-300 px-4 py-2 text-sm rounded-lg font-medium text-gray-700 focus:ring-1 focus:ring-gray-500 outline-none">
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            <ICONS.Shield size={14} className="text-gray-600" />
            <span>Aggregated & Anonymized Data (DPDP Compliant)</span>
          </div>
        </div>
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-6 pt-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div variants={itemVariants} className="bg-white p-6 border border-gray-200 shadow-sm rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gray-800"></div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Freshness Score</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{stats.freshnessScore}</span>
              <span className="text-xs text-gray-400 font-medium">/ 100</span>
            </div>
            <div className="mt-3 flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded w-fit">
              ▲ 2.4% vs last month
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-6 border border-gray-200 shadow-sm rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#B91C1C]"></div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Updates Required</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{stats.recordsNeedingUpdatePct}%</span>
            </div>
            <div className="mt-3 flex items-center text-xs font-medium text-[#B91C1C] bg-red-50 px-2 py-1 rounded w-fit">
              Critical in Rural Sectors
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-6 border border-gray-200 shadow-sm rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gray-600"></div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">High Risk Districts</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{stats.highRiskDistricts}</span>
              <span className="text-xs text-gray-500 ml-1">Districts</span>
            </div>
            <p className="mt-3 text-xs text-gray-400">Requires intervention</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-6 border border-gray-200 shadow-sm rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gray-400"></div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Auth Failure Rate</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{stats.avgFailureRate}%</span>
            </div>
            <p className="mt-3 text-xs text-gray-400">Primarily Biometric (60+)</p>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Update Gaps */}
          <motion.div variants={itemVariants} className="bg-white p-6 shadow-sm border border-gray-200 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <div className="p-1.5 bg-gray-100 rounded-md">
                  <ICONS.Activity size={18} className="text-gray-700" />
                </div>
                Update Gap Analysis
              </h3>
              <span className="text-xs font-medium text-gray-500 border border-gray-200 px-2 py-1 rounded-md">Urban vs Rural</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={updateGaps} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#E5E7EB" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="type" type="category" tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }} width={80} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E7EB', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="urbanGap" name="Urban Gap %" fill="#4B5563" radius={[0, 4, 4, 0]} barSize={16} />
                  <Bar dataKey="ruralGap" name="Rural Gap %" fill="#B91C1C" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Migration Impact */}
          <motion.div variants={itemVariants} className="bg-white p-6 shadow-sm border border-gray-200 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <div className="p-1.5 bg-gray-100 rounded-md">
                  <ICONS.Map size={18} className="text-gray-700" />
                </div>
                Migration vs. Data Staleness
              </h3>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="migrationIndex" name="Migration Index" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} label={{ value: 'Migration Index', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#9CA3AF' }} />
                  <YAxis type="number" dataKey="updateLag" name="Freshness Lag" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} label={{ value: 'Staleness (%)', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#9CA3AF' }} />
                  <ZAxis type="category" dataKey="name" name="District" />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E7EB', borderRadius: '8px', padding: '10px' }}
                  />
                  <Scatter name="Districts" data={migrationData} fill="#B91C1C" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Heatmap Grid & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* District Risk Heatmap List */}
          <motion.div variants={itemVariants} className="col-span-1 bg-white p-6 shadow-sm border border-gray-200 rounded-xl">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <ICONS.AlertTriangle size={20} className="text-[#B91C1C]" />
              Risk Analysis
            </h3>
            <div className="space-y-1 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {districts.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{d.name}</p>
                    <p className="text-xs text-gray-500">{d.state}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border ${d.riskLevel === RiskLevel.CRITICAL ? 'bg-red-50 text-[#B91C1C] border-red-100' :
                      d.riskLevel === RiskLevel.HIGH ? 'bg-orange-50 text-orange-700 border-orange-100' :
                        d.riskLevel === RiskLevel.MEDIUM ? 'bg-gray-50 text-gray-700 border-gray-200' :
                          'bg-green-50 text-green-700 border-green-100'
                      }`}>
                      {d.riskLevel}
                    </span>
                    <p className="text-[10px] mt-1 text-gray-400 font-mono">Score: {d.freshnessScore}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Recommendations */}
          <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2 bg-[#1F2937] p-8 shadow-md rounded-xl text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-white flex items-center gap-2">
                <ICONS.FileText size={20} className="text-gray-400" />
                Actionable Recommendations
              </h3>
              <span className="text-[10px] bg-white text-[#1F2937] px-2 py-1 font-bold rounded uppercase tracking-wider">AI Generated</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="bg-[#374151] p-5 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors group">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-gray-100 group-hover:text-white">{rec.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${rec.priority === 'High' ? 'bg-[#7F1D1D] text-red-100' : 'bg-gray-600 text-gray-200'
                      }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 mb-4 leading-relaxed">
                    {rec.description}
                  </p>
                  <div className="flex justify-between items-center border-t border-gray-600 pt-3">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">{rec.actionType}</span>
                    <button className="text-xs text-white hover:text-gray-200 underline font-medium flex items-center gap-1">
                      Initiate <ICONS.ArrowRight size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;