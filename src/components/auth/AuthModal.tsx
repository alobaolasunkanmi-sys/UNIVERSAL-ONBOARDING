import React, { useState } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { 
  Building2, 
  UserCheck, 
  Truck, 
  ShieldCheck, 
  Key, 
  UserPlus, 
  LogIn, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Phone,
  User,
  Hash
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  defaultTab?: 'login' | 'signup' | 'driver-setup';
}

export function AuthModal({ isOpen, onClose, defaultRole = 'admin', defaultTab = 'login' }: AuthModalProps) {
  const { login, adminSignUp, driverSetupPassword, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'driver-setup'>(defaultTab);
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);

  // Form States
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Admin Sign Up Form
  const [adminName, setAdminName] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminNin, setAdminNin] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('logistics');

  // Driver First-Time Setup
  const [driverUsername, setDriverUsername] = useState('');
  const [driverNewPassword, setDriverNewPassword] = useState('');
  const [driverConfirmPassword, setDriverConfirmPassword] = useState('');

  // Feedback State
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!usernameOrEmail || !loginPassword) {
      setErrorMessage('Please enter both username/email and password.');
      return;
    }

    const res = await login({
      usernameOrEmail,
      password: loginPassword,
      role: selectedRole,
    });

    if (res.success) {
      setSuccessMessage('Logged in successfully!');
      setTimeout(() => {
        onClose();
      }, 600);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleAdminSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!adminName || !adminPhone || !adminNin || !adminUsername || !adminPassword) {
      setErrorMessage('Please fill in all required fields: Name, Phone, NIN, Username, and Password.');
      return;
    }

    if (adminPassword !== adminConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password.');
      return;
    }

    const res = await adminSignUp({
      name: adminName,
      phone: adminPhone,
      nin: adminNin,
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
      businessName: businessName,
      businessType: businessType,
    });

    if (res.success) {
      setSuccessMessage('Admin Account Created! Redirecting to Business Onboarding...');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleDriverSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!driverUsername || !driverNewPassword) {
      setErrorMessage('Please enter your assigned driver username and new password.');
      return;
    }

    if (driverNewPassword !== driverConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const res = await driverSetupPassword({
      username: driverUsername,
      newPassword: driverNewPassword,
    });

    if (res.success) {
      setSuccessMessage('Password created successfully! Welcome to your Driver Portal.');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-600/30 border border-blue-400/30 rounded-xl text-blue-300">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">Portal Access & Security</h3>
                <p className="text-xs text-slate-300 mt-0.5">Role-Based Access for Admin, Staff, Drivers & Users</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-slate-800/80 p-1 rounded-xl mt-6 text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === 'login' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setErrorMessage(''); }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === 'signup' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Admin Sign Up</span>
            </button>
            <button
              onClick={() => { setActiveTab('driver-setup'); setErrorMessage(''); }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === 'driver-setup' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Driver Setup</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start space-x-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-start space-x-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. LOGIN TAB */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-xs flex items-center justify-between text-amber-900 font-medium">
                <span>⚡ Quick Demo Presets:</span>
                <div className="flex space-x-1.5">
                  <button
                    type="button"
                    onClick={() => { setSelectedRole('admin'); setUsernameOrEmail('admin'); setLoginPassword('admin123'); }}
                    className="px-2 py-1 bg-amber-200 hover:bg-amber-300 rounded text-[10px] font-bold"
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedRole('staff'); setUsernameOrEmail('staff'); setLoginPassword('staff123'); }}
                    className="px-2 py-1 bg-amber-200 hover:bg-amber-300 rounded text-[10px] font-bold"
                  >
                    Staff
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedRole('driver'); setUsernameOrEmail('ibrahim'); setLoginPassword('driver123'); }}
                    className="px-2 py-1 bg-amber-200 hover:bg-amber-300 rounded text-[10px] font-bold"
                  >
                    Driver
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Select Portal Role</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'admin', label: 'Admin', icon: Building2 },
                    { id: 'staff', label: 'Staff', icon: ShieldCheck },
                    { id: 'driver', label: 'Driver', icon: Truck },
                    { id: 'user', label: 'User', icon: UserCheck },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id as UserRole)}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center space-y-1.5 transition-all ${
                        selectedRole === r.id
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-semibold shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <r.icon className={`w-4 h-4 ${selectedRole === r.id ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Username or Email</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    placeholder={selectedRole === 'driver' ? 'e.g. ibrahim or driver@company.com' : 'e.g. admin or admin@company.com'}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{loading ? 'Authenticating...' : `Sign In as ${selectedRole.toUpperCase()}`}</span>
                </button>
              </div>

              {selectedRole === 'driver' && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('driver-setup')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
                  >
                    First time signing in as an onboarded driver? Click here to set your password.
                  </button>
                </div>
              )}
            </form>
          )}

          {/* 2. ADMIN SIGN UP TAB */}
          {activeTab === 'signup' && (
            <form onSubmit={handleAdminSignUpSubmit} className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
              <div className="bg-blue-50/70 border border-blue-200 p-3 rounded-xl text-xs text-blue-900 flex items-start space-x-2">
                <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Admin registration allows you to self-onboard yourself and your business/school. Requirements: Name, Phone, and National ID (NIN).
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="e.g. Alhaji Musa Bello"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      placeholder="+234 803 000 0000"
                      className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">National ID Number (NIN) *</label>
                  <div className="relative">
                    <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={adminNin}
                      onChange={(e) => setAdminNin(e.target.value)}
                      placeholder="11-digit NIN"
                      className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="admin_musa"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@business.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Business Name (Optional)</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex Logistics Ltd"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Business Type</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="logistics">Logistics & Haulage</option>
                    <option value="school">School / Institution</option>
                    <option value="corporate">Corporate Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    value={adminConfirmPassword}
                    onChange={(e) => setAdminConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{loading ? 'Creating Admin Account...' : 'Register as Admin'}</span>
                </button>
              </div>
            </form>
          )}

          {/* 3. DRIVER FIRST-TIME SETUP TAB */}
          {activeTab === 'driver-setup' && (
            <form onSubmit={handleDriverSetupSubmit} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 flex items-start space-x-2">
                <Truck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Onboarded drivers can enter the username assigned by their Admin to set up their custom portal password.
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Assigned Driver Username *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={driverUsername}
                    onChange={(e) => setDriverUsername(e.target.value)}
                    placeholder="e.g. ibrahim"
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">New Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={driverNewPassword}
                    onChange={(e) => setDriverNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Confirm New Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={driverConfirmPassword}
                    onChange={(e) => setDriverConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                >
                  <Key className="w-4 h-4" />
                  <span>{loading ? 'Creating Driver Credentials...' : 'Create Driver Password'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
