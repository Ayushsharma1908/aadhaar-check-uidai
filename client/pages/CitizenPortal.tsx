import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ICONS, COLORS } from '../constants';
import Button from '../components/Button';
import { getCitizenStatus } from '../services/dataService';
import Chatbot from '../components/Chatbot';

const CitizenPortal: React.FC = () => {
  const [step, setStep] = useState<'login' | 'otp' | 'dashboard'>('login');
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState('');
  const [last4Aadhaar, setLast4Aadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [citizenData, setCitizenData] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/citizen/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, last4Aadhaar })
      });

      const data = await response.json();

      if (data.success) {
        setStep('otp');
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/citizen/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp, last4Aadhaar })
      });

      const data = await response.json();

      if (data.success) {
        // Store token for chatbot
        setAuthToken(data.token);
        // Fetch citizen status
        try {
          const statusData = await getCitizenStatus(data.token);
          setCitizenData(statusData);
          setStep('dashboard');
        } catch (fetchErr) {
          console.error(fetchErr);
          setError('Failed to load profile data');
        }
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col items-center">
      <AnimatePresence mode="wait">
        {step === 'login' ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md mt-16 px-4"
          >
            <div className="bg-white p-10 shadow-lg rounded-xl border border-gray-200">
              <div className="flex justify-center mb-8">
                <div className="p-4 bg-red-50 rounded-full">
                  <ICONS.Fingerprint size={40} className="text-[#B91C1C]" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center text-[#111827] mb-2 tracking-tight">Check Aadhaar Status</h2>
              <p className="text-center text-gray-500 text-sm mb-8 leading-relaxed">
                Securely verify your data freshness without sharing biometric data.
              </p>

              <form onSubmit={handleLogin} className="space-y-6">
                {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 ml-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="98765 XXXXX"
                    className="w-full border border-gray-300 p-3.5 rounded-lg focus:border-[#1F2937] focus:ring-1 focus:ring-[#1F2937] outline-none bg-white text-gray-900 transition-all placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 ml-1">Last 4 Digits of Aadhaar</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={last4Aadhaar}
                    onChange={(e) => setLast4Aadhaar(e.target.value)}
                    placeholder="XXXX"
                    className="w-full border border-gray-300 p-3.5 rounded-lg focus:border-[#1F2937] focus:ring-1 focus:ring-[#1F2937] outline-none bg-white text-gray-900 transition-all placeholder-gray-400"
                    required
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start gap-3">
                  <ICONS.Shield size={16} className="text-gray-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong>Demo Mode:</strong> No actual data is accessed. This is a simulation for demonstration.
                  </p>
                </div>

                <Button fullWidth disabled={loading} className="mt-2">
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>
            </div>
          </motion.div>
        ) : step === 'otp' ? (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md mt-16 px-4"
          >
            <div className="bg-white p-10 shadow-lg rounded-xl border border-gray-200">
              <div className="flex justify-center mb-8">
                <div className="p-4 bg-blue-50 rounded-full">
                  <ICONS.MessageSquare size={40} className="text-blue-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center text-[#111827] mb-2 tracking-tight">Verify OTP</h2>
              <p className="text-center text-gray-500 text-sm mb-8 leading-relaxed">
                Enter the 6-digit code sent to your mobile number ending in {mobile.slice(-4)}.
              </p>

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 ml-1">OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full border border-gray-300 p-3.5 rounded-lg focus:border-[#1F2937] focus:ring-1 focus:ring-[#1F2937] outline-none bg-white text-gray-900 transition-all placeholder-gray-400 text-center text-xl tracking-widest"
                    required
                  />
                </div>

                <Button fullWidth disabled={loading} className="mt-2">
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>

                <div className="text-center">
                  <button type="button" onClick={() => setStep('login')} className="text-sm text-gray-500 hover:text-gray-800 underline">
                    Back to Login
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-5xl mt-8 px-6 pb-12"
          >
            {/* Citizen Dashboard Header */}
            <div className="bg-[#1F2937] text-white p-8 rounded-t-xl shadow-lg flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Welcome, Resident</h2>
                <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Session Active • Aadhaar ending in **** {citizenData?.last4Aadhaar || last4Aadhaar}
                </p>
              </div>
              <div className="text-right bg-gray-800 px-5 py-3 rounded-lg border border-gray-700">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Action Status</p>
                <p className="text-base font-bold text-white flex items-center gap-2 justify-end">
                  {citizenData?.recommendations?.length > 0 ? 'Updates Recommended' : 'All Good'}
                  {citizenData?.recommendations?.length > 0 ? <ICONS.AlertTriangle size={16} className="text-[#B91C1C]" /> : <ICONS.CheckCircle size={16} className="text-green-500" />}
                </p>
              </div>
            </div>

            {/* Status Grid */}
            <div className="bg-white p-8 shadow-sm border-b border-l border-r border-gray-200 rounded-b-xl mb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatusCard
                icon={<ICONS.Home />}
                title="Address Details"
                status={citizenData?.demoStatus?.address === 'Stale' ? 'Needs Update' : 'Fresh'}
                color={citizenData?.demoStatus?.address === 'Stale' ? 'red' : 'green'}
                message={citizenData?.demoStatus?.address === 'Stale' ? "High migration detected in your district. Please confirm your current residential address." : "Your address details appear recent and valid."}
              />
              <StatusCard
                icon={<ICONS.Smartphone />}
                title="Mobile Linking"
                status={citizenData?.demoStatus?.mobile === 'Unlinked' ? 'Unlinked' : 'Linked'}
                color={citizenData?.demoStatus?.mobile === 'Unlinked' ? 'red' : 'green'}
                message={citizenData?.demoStatus?.mobile === 'Unlinked' ? "Mobile number not linked. OTP services may be unavailable." : "Your mobile number is active and successfully linked for OTP services."}
              />
              <StatusCard
                icon={<ICONS.Fingerprint />}
                title="Biometrics"
                status={citizenData?.demoStatus?.biometric === 'Aging' ? 'May Fail' : 'Good'}
                color={citizenData?.demoStatus?.biometric === 'Aging' ? 'gray' : 'green'}
                message={citizenData?.demoStatus?.biometric === 'Aging' ? "Based on the 60+ age profile, a biometric update is advised to prevent auth failures." : "Biometric data seems current."}
              />
            </div>

            {/* Transparency & Action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm">
                <h3 className="font-bold text-[#111827] flex items-center gap-2 mb-6 text-lg">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <ICONS.Activity size={20} className="text-gray-700" />
                  </div>
                  Why am I seeing this?
                </h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  Our system analyzes aggregated community trends. In your district <strong>({citizenData?.district})</strong>,
                  residents in your age group often face address discrepancies due to specific risk factors (Risk Level: {citizenData?.districtRisk}).
                </p>
                <div className="text-xs text-gray-500 font-medium bg-gray-50 border border-gray-200 p-3 rounded-lg flex items-center gap-2">
                  <ICONS.Lock size={14} />
                  Privacy Note: Individual data is NOT tracked or stored.
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>
                <h3 className="font-bold text-[#111827] mb-6 text-lg relative z-10">Recommended Actions</h3>
                <ul className="space-y-4 relative z-10">
                  {citizenData?.recommendations?.length > 0 ? citizenData.recommendations.map((rec: any, index: number) => (
                    <li key={rec.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center text-[#B91C1C] font-bold text-xs border border-red-100">{index + 1}</div>
                        <div>
                          <span className="text-sm font-semibold text-gray-900 block">{rec.title}</span>
                          <span className="text-xs text-gray-500">{rec.estimatedTime}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="text-xs py-2 px-4 h-9">Act</Button>
                    </li>
                  )) : (
                    <p className="text-sm text-gray-500">No actions required at this time.</p>
                  )}
                </ul>
              </div>
            </div>

            {/* Awareness Banner */}
            <div className="mt-8 bg-[#1F2937] p-5 rounded-lg flex gap-5 items-center shadow-md">
              <div className="bg-gray-700 p-3 rounded-full text-white">
                <ICONS.FileText size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Government Advisory</h4>
                <p className="text-xs text-gray-300">Please keep Aadhaar details updated to ensure seamless delivery of subsidies and benefits.</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button onClick={() => {
                setStep('login');
                setAuthToken('');
                setCitizenData(null);
              }} className="text-sm text-gray-500 font-medium hover:text-[#B91C1C] transition-colors">
                Log out securely
              </button>
            </div>

            {/* Chatbot */}
            {authToken && <Chatbot token={authToken} citizenData={citizenData} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatusCard: React.FC<{ icon: React.ReactNode, title: string, status: string, color: 'red' | 'green' | 'gray', message: string }> = ({ icon, title, status, color, message }) => {
  const colorStyles = {
    red: { bg: 'bg-red-50', text: 'text-[#B91C1C]', border: 'border-red-100', badge: 'bg-white border-red-100 text-[#B91C1C]' },
    green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100', badge: 'bg-white border-green-100 text-green-700' },
    gray: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', badge: 'bg-white border-gray-200 text-gray-700' }
  };

  const style = colorStyles[color];

  return (
    <div className={`p-6 rounded-lg border ${style.border} ${style.bg} flex flex-col h-full transition-all hover:shadow-sm`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 bg-white rounded-lg shadow-sm text-gray-700 border border-gray-100">{icon}</div>
        <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${style.badge} shadow-sm`}>{status}</span>
      </div>
      <h4 className="font-bold text-base mb-2 text-[#111827]">{title}</h4>
      <p className="text-xs text-gray-600 leading-relaxed">{message}</p>
    </div>
  );
};

export default CitizenPortal;