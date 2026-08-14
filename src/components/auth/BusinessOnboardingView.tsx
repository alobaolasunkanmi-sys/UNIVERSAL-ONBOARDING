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
  Send,
  Truck,
  School,
  Briefcase,
  ShoppingBag,
  HardHat,
  Wheat,
  UserCheck,
  ChevronRight,
  Sparkles,
  Key,
  LayoutDashboard
} from 'lucide-react';
import { LogisticsDashboard } from '../modules/logistics/LogisticsDashboard';
import { VehicleManagement } from '../modules/logistics/VehicleManagement';
import { DriverManagement } from '../modules/logistics/DriverManagement';
import { IncomeManagement } from '../modules/logistics/IncomeManagement';
import { DriverPortal } from '../modules/logistics/DriverPortal';

interface BusinessOnboardingViewProps {
  onNavigateTab?: (tab: string) => void;
  onOpenAuthModal?: () => void;
}

export function BusinessOnboardingView({ onNavigateTab, onOpenAuthModal }: BusinessOnboardingViewProps) {
  const { currentUser, businessOnboarding, applyForOnboarding, loading } = useAuth();
  
  const [selectedCategory, setSelectedCategory] = useState<string>(businessOnboarding?.businessType || 'logistics');
  const [activeWorkspaceView, setActiveWorkspaceView] = useState<'onboard' | 'dashboard' | 'vehicles' | 'drivers' | 'income' | 'driver-portal'>('onboard');

  const [businessName, setBusinessName] = useState(businessOnboarding?.businessName || '');
  const [cacNumber, setCacNumber] = useState(businessOnboarding?.cacNumber || '');
  const [address, setAddress] = useState(businessOnboarding?.address || '');
  const [phone, setPhone] = useState(businessOnboarding?.phone || currentUser?.phone || '');
  const [email, setEmail] = useState(businessOnboarding?.email || currentUser?.email || '');

  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const categories = [
    {
      id: 'logistics',
      name: 'Logistics & Haulage Fleet',
      desc: 'Heavy trucks, tippers, dumpers, cargo delivery & hire-purchase management',
      icon: Truck,
      badge: 'Active Module',
      color: 'border-blue-500 hover:border-blue-600 bg-gradient-to-br from-blue-50/50 to-slate-50'
    },
    {
      id: 'school',
      name: 'School & Campus Transport',
      desc: 'School buses, student route tracking, driver assignments & tuition transport billing',
      icon: School,
      badge: 'Popular',
      color: 'border-emerald-500 hover:border-emerald-600 bg-gradient-to-br from-emerald-50/50 to-slate-50'
    },
    {
      id: 'corporate',
      name: 'Corporate Enterprise Fleet',
      desc: 'Executive vehicles, employee shuttles, mileage tracking & asset management',
      icon: Briefcase,
      badge: 'Enterprise',
      color: 'border-purple-500 hover:border-purple-600 bg-gradient-to-br from-purple-50/50 to-slate-50'
    },
    {
      id: 'retail',
      name: 'Retail & E-Commerce Delivery',
      desc: 'Dispatch vans, delivery motorbikes, order fulfillment & driver payouts',
      icon: ShoppingBag,
      badge: 'Express',
      color: 'border-amber-500 hover:border-amber-600 bg-gradient-to-br from-amber-50/50 to-slate-50'
    },
    {
      id: 'construction',
      name: 'Construction & Equipment Hire',
      desc: 'Excavators, cranes, heavy site haulage & lease payment tracking',
      icon: HardHat,
      badge: 'Industrial',
      color: 'border-orange-500 hover:border-orange-600 bg-gradient-to-br from-orange-50/50 to-slate-50'
    },
    {
      id: 'agriculture',
      name: 'Agricultural & Cold Chain',
      desc: 'Refrigerated produce vans, grain trailers & farm-to-market haulage',
      icon: Wheat,
      badge: 'Agro Fleet',
      color: 'border-teal-500 hover:border-teal-600 bg-gradient-to-br from-teal-50/50 to-slate-50'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');

    if (!businessName) {
      setErrorMessage('Please enter your Business / Institution Name.');
      return;
    }

    const res = await applyForOnboarding({
      businessName,
      businessType: selectedCategory,
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

  // Render Sub-Workspace if launched
  if (activeWorkspaceView !== 'onboard') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveWorkspaceView('onboard')}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-semibold text-xs flex items-center space-x-1 transition-all"
            >
              ← Back to Business Categories Hub
            </button>
            <span className="text-slate-300">|</span>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>{businessName || businessOnboarding?.businessName || 'Onboarded Company'}</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800 uppercase font-bold">
                {selectedCategory}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setActiveWorkspaceView('dashboard')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                activeWorkspaceView === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveWorkspaceView('vehicles')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                activeWorkspaceView === 'vehicles' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Vehicles
            </button>
            <button
              onClick={() => setActiveWorkspaceView('drivers')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                activeWorkspaceView === 'drivers' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Drivers
            </button>
            <button
              onClick={() => setActiveWorkspaceView('income')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                activeWorkspaceView === 'income' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Income Receipts
            </button>
            <button
              onClick={() => setActiveWorkspaceView('driver-portal')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                activeWorkspaceView === 'driver-portal' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Driver Portal
            </button>
          </div>
        </div>

        {activeWorkspaceView === 'dashboard' && <LogisticsDashboard />}
        {activeWorkspaceView === 'vehicles' && <VehicleManagement />}
        {activeWorkspaceView === 'drivers' && <DriverManagement />}
        {activeWorkspaceView === 'income' && <IncomeManagement />}
        {activeWorkspaceView === 'driver-portal' && <DriverPortal />}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Role Recognition Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center font-bold text-xl text-blue-300 shrink-0">
            {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'US'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">Authenticated Portal Access</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              {currentUser ? `Welcome back, ${currentUser.name}` : 'Company & Portal Onboarding Hub'}
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Recognized Role: <span className="font-bold text-amber-300 uppercase">{currentUser?.role || 'Guest / Visitor'}</span>
              {currentUser?.username && <span className="text-slate-400 ml-1">(@{currentUser.username})</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          {!currentUser ? (
            <button
              onClick={onOpenAuthModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl text-xs shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition-all"
            >
              <Key className="w-4 h-4" />
              <span>Sign In / Admin Sign Up</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold py-2 px-4 rounded-xl text-xs flex items-center space-x-2 transition-all"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Switch Portal Role</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Business Categories Onboarding Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Select Business Category to Onboard</h2>
            <p className="text-xs text-slate-500">Click on any category below to select it for company onboarding and launch its workspace.</p>
          </div>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            6 Industry Sector Categories Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative group flex flex-col justify-between ${cat.color} ${
                  isSelected ? 'ring-2 ring-blue-600 border-blue-600 shadow-md' : 'border-slate-200/80 hover:shadow-sm'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-200/60 text-slate-700 border-slate-300/60'
                    }`}>
                      {cat.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                      <span>{cat.name}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{cat.desc}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                  <span className={isSelected ? 'text-blue-700 font-bold' : 'text-slate-500'}>
                    {isSelected ? '✓ Selected for Onboarding' : 'Click to Select Category'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(cat.id);
                      setActiveWorkspaceView('dashboard');
                    }}
                    className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-[11px] font-bold underline"
                  >
                    <span>Launch Workspace</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Onboarding Application Form & Admin Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Onboarding Application Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Onboarding Registration Form</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Onboarding Category: <span className="font-bold text-blue-600 uppercase">{categories.find(c => c.id === selectedCategory)?.name}</span>
              </p>
            </div>
            {businessOnboarding && (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Status: {businessOnboarding.status}</span>
              </span>
            )}
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
                <label className="block text-xs font-medium text-slate-700 mb-1">Company / Institution Name *</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Suntracomm Logistics Ltd or St. Mary Academy"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Selected Industry Sector</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-blue-900"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
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
              <label className="block text-xs font-medium text-slate-700 mb-1">Official Email Address</label>
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
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Plot 12 Commercial Avenue, Ikeja, Lagos State"
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center space-x-2 text-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting Onboarding...' : 'Submit Business Onboarding'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveWorkspaceView('dashboard')}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-5 rounded-xl text-xs flex items-center space-x-2 shadow-sm transition-all"
              >
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                <span>Open Category Operational Console</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Info Box */}
        <div className="space-y-6">
          {/* Admin Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Recognized User Profile</span>
            </h3>

            {currentUser ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Name:</span>
                  <span className="font-semibold text-slate-900">{currentUser.name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Username:</span>
                  <span className="font-mono text-blue-700 font-semibold">@{currentUser.username}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-medium text-slate-900">{currentUser.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">NIN Status:</span>
                  <span className="font-mono text-emerald-700 font-bold">{currentUser.nin ? '✓ NIN Verified' : 'Standard'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Active Role:</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold uppercase">{currentUser.role}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">You are currently browsing as guest. Sign in or register as Admin to link your company onboarding profile.</p>
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all"
                >
                  <Key className="w-4 h-4" />
                  <span>Sign In / Admin Registration</span>
                </button>
              </div>
            )}
          </div>

          {/* Onboarding Workflow Steps */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-sm font-bold mb-3">Onboarding Workflow</h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</div>
                <div>
                  <div className="font-semibold text-white">Sign Up / Login with Role</div>
                  <div className="text-[11px] text-slate-400">Admin self-signup with NIN & phone verification</div>
                </div>
              </li>
              <li className="flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</div>
                <div>
                  <div className="font-semibold text-white">Select Business Category</div>
                  <div className="text-[11px] text-slate-400">Choose from 6 industry fleet & enterprise categories</div>
                </div>
              </li>
              <li className="flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</div>
                <div>
                  <div className="font-semibold text-white">Launch Category Console</div>
                  <div className="text-[11px] text-slate-400">Manage drivers, vehicles, and income receipts</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
