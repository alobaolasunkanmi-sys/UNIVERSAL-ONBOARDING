import React from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  ShieldCheck, 
  Users, 
  FileText,
  PlusCircle,
  Truck,
  CreditCard,
  Key,
  LogOut,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuthModal?: () => void;
}

export function Sidebar({ activeTab, setActiveTab, onOpenAuthModal }: SidebarProps) {
  const { currentUser, businessOnboarding, logout } = useAuth();

  const role = currentUser?.role || 'admin';

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto border-r border-slate-800 z-20">
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between text-white border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-600/30 text-white">
            U
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white block">UniBoard</span>
            <span className="text-[10px] text-blue-400 font-semibold tracking-wide uppercase">
              {businessOnboarding?.businessName || 'Logistics Portal'}
            </span>
          </div>
        </div>
      </div>

      {/* User Role Card */}
      <div className="p-4 bg-slate-800/60 mx-3 my-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-500/30">
            {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AD'}
          </div>
          <div className="truncate">
            <div className="text-xs font-bold text-white truncate">{currentUser?.name || 'Administrator'}</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
              <span>{role} Portal</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Sections */}
      <div className="px-3 pb-4 flex-1 space-y-6">
        {/* Business Categories & Onboarding Section */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">
            Company Onboarding & Workspaces
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('onboard')}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                activeTab === 'onboard' 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" 
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              )}
            >
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Business Category Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('wizard')}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                activeTab === 'wizard' 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" 
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              )}
            >
              <PlusCircle className="w-4 h-4 text-pink-400" />
              <span>Onboarding Wizard</span>
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                activeTab === 'applications' 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" 
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              )}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>KYC & Business Verification</span>
            </button>
          </nav>
        </div>

        {/* Platform & RBAC Section */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">
            Role & Access Controls
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('users')}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                activeTab === 'users' 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" 
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              )}
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>User Roles & RBAC Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                activeTab === 'docs' 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" 
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              )}
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>System Documentation</span>
            </button>
          </nav>
        </div>
      </div>
      
      {/* Footer System Status & Auth */}
      <div className="mt-auto p-3 shrink-0 border-t border-slate-800 space-y-2">
        <button
          onClick={onOpenAuthModal}
          className="w-full py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 font-semibold text-xs flex items-center justify-center space-x-2 transition-all"
        >
          <Key className="w-3.5 h-3.5" />
          <span>Switch User / Portal Login</span>
        </button>

        <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white">Database</span>
            <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">Cloud SQL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
