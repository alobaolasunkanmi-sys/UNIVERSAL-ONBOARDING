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
  History,
  Sliders
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuthModal?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ activeTab, setActiveTab, onOpenAuthModal, isOpen = false, onClose }: SidebarProps) {
  const { currentUser, businessOnboarding } = useAuth();

  const role = currentUser?.role || 'admin';
  const isSuperAdmin = role === 'superadmin';

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <div className={cn(
        "w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto border-r border-slate-800 z-30 transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand Header */}
      <div className="p-6 flex items-center justify-between text-white border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-600/30 text-white">
            U
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white block">UniBoard</span>
            <span className="text-[10px] text-blue-400 font-semibold tracking-wide uppercase">
              {businessOnboarding?.businessName || (isSuperAdmin ? 'Platform Core' : 'Business Portal')}
            </span>
          </div>
        </div>
      </div>

      {/* User Role Card */}
      <div className="p-4 bg-slate-800/60 mx-3 my-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <div className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border ${
            isSuperAdmin 
              ? 'bg-purple-600/20 text-purple-300 border-purple-500/30' 
              : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
          }`}>
            {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AD'}
          </div>
          <div className="truncate">
            <div className="text-xs font-bold text-white truncate">{currentUser?.name || 'Administrator'}</div>
            <div className="text-[10px] uppercase font-bold flex items-center space-x-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isSuperAdmin ? 'bg-purple-400' : 'bg-emerald-400'} inline-block`}></span>
              <span className={isSuperAdmin ? 'text-purple-300' : 'text-emerald-400'}>{role}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Sections */}
      <div className="px-3 pb-4 flex-1 space-y-6">

        {/* 1. Super Admin Core Control (if Super Admin) */}
        {isSuperAdmin && (
          <div>
            <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-2 px-3">
              Super Admin Control
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => handleNavClick('superadmin-hub')}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  activeTab === 'superadmin-hub' 
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30" 
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                )}
              >
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>Super Admin Hub</span>
              </button>

              <button
                onClick={() => handleNavClick('audit-logs')}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  activeTab === 'audit-logs' 
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30" 
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                )}
              >
                <History className="w-4 h-4 text-amber-400" />
                <span>Audit Logs & Security</span>
              </button>
            </nav>
          </div>
        )}

        {/* 2. Business Workspaces & Management */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">
            {isSuperAdmin ? 'All Platform Businesses' : 'My Registered Business'}
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => handleNavClick('applications')}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                activeTab === 'applications' 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" 
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              )}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>{isSuperAdmin ? 'All Applications & KYC' : 'My Business Application'}</span>
            </button>

            <button
              onClick={() => handleNavClick('wizard')}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                activeTab === 'wizard' 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" 
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              )}
            >
              <PlusCircle className="w-4 h-4 text-pink-400" />
              <span>Register New Business</span>
            </button>

            <button
              onClick={() => handleNavClick('dashboard')}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                activeTab === 'dashboard' 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" 
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              )}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Company Dashboard</span>
            </button>

            <button
              onClick={() => handleNavClick('onboard')}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                activeTab === 'onboard' 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" 
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              )}
            >
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Industry Workspaces Hub</span>
            </button>
          </nav>
        </div>

        {/* 3. Platform & Governance Section */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">
            Roles & Governance
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => handleNavClick('users')}
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
              onClick={() => handleNavClick('docs')}
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
    </>
  );
}
