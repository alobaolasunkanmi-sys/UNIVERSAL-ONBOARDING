import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  Send
} from 'lucide-react';

export function BusinessOnboardingView() {
  const { currentUser, businessOnboarding, applyForOnboarding, loading } = useAuth();
  
  const [businessName, setBusinessName] = useState(businessOnboarding?.businessName || '');
  const [businessType, setBusinessType] = useState(businessOnboarding?.businessType || 'logistics');
  const [cacNumber, setCacNumber] = useState(businessOnboarding?.cacNumber || '');
  const [address, setAddress] = useState(businessOnboarding?.address || '');
  const [phone, setPhone] = useState(businessOnboarding?.phone || currentUser?.phone || '');
  const [email, setEmail] = useState(businessOnboarding?.email || currentUser?.email || '');

  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');

    if (!businessName) {
      setErrorMessage('Please enter your Business/School Name.');
      return;
    }

    const res = await applyForOnboarding({
      businessName,
      businessType,
      cacNumber,
      address,
      phone,
      email,
    });

    if (res.success) {
      setMessage(res.message);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Business & School Onboarding</h1>
              <p className="text-xs text-slate-500 mt-0.5">Apply for portal onboarding and manage business identity</p>
            </div>
          </div>
        </div>

        {/* Live Application Status Badge */}
        {businessOnboarding && (
          <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status:</span>
            {businessOnboarding.status === 'Approved' ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Active & Verified
              </span>
            ) : businessOnboarding.status === 'Rejected' ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                <AlertCircle className="w-3.5 h-3.5 mr-1 text-red-600" /> Rejected
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" /> Pending Approval
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Onboarding Application Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Apply for Business Onboarding</h2>
            <p className="text-xs text-slate-500 mt-1">Submit your business or school registration details for official verification.</p>
          </div>

          {message && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Business / Institution Name *</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Suntracomm Logistics Ltd"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Business Category *</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="logistics">Logistics & Fleet Management</option>
                  <option value="school">School / Academy</option>
                  <option value="corporate">Corporate Enterprise</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">CAC Registration / License No.</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={cacNumber}
                    onChange={(e) => setCacNumber(e.target.value)}
                    placeholder="e.g. RC-1892041"
                    className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Contact Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Contact Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.com"
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Physical Business Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Plot 12 Commercial Avenue, Ikeja, Lagos State"
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center space-x-2 text-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting Application...' : 'Submit Onboarding Application'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Info Box */}
        <div className="space-y-6">
          {/* Admin Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Admin Profile Details</span>
            </h3>

            {currentUser ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Name:</span>
                  <span className="font-semibold text-slate-900">{currentUser.name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Username:</span>
                  <span className="font-mono text-blue-700 font-semibold">{currentUser.username}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-medium text-slate-900">{currentUser.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">NIN:</span>
                  <span className="font-mono text-slate-900">{currentUser.nin || 'Verified'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Role Privilege:</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold uppercase">{currentUser.role}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Please sign up or log in as Admin.</p>
            )}
          </div>

          {/* Onboarding Workflow Steps */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-sm font-bold mb-3">Onboarding Checklist</h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</div>
                <div>
                  <div className="font-semibold text-white">Admin Portal Registration</div>
                  <div className="text-[11px] text-slate-400">Self-sign up with NIN & phone verification</div>
                </div>
              </li>
              <li className="flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</div>
                <div>
                  <div className="font-semibold text-white">Apply for Onboarding</div>
                  <div className="text-[11px] text-slate-400">Submit CAC license and operational details</div>
                </div>
              </li>
              <li className="flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</div>
                <div>
                  <div className="font-semibold text-white">Driver Onboarding & Login Setup</div>
                  <div className="text-[11px] text-slate-400">Create driver usernames & enable portal login access</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
