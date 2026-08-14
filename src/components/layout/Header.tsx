import React, { useState, useEffect } from 'react';
import { Bell, Search, User, Key, LogOut, ShieldCheck, Building2, Database, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ChangePasswordModal } from '../auth/ChangePasswordModal';
import { isSupabaseConfigured, testSupabaseConnection } from '../../lib/supabase';

interface HeaderProps {
  onOpenAuthModal: () => void;
  onToggleMobileMenu?: () => void;
}

export function Header({ onOpenAuthModal, onToggleMobileMenu }: HeaderProps) {
  const { currentUser, businessOnboarding, logout } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<{ connected: boolean; message: string }>({
    connected: isSupabaseConfigured,
    message: isSupabaseConfigured ? 'Connected to Supabase' : 'Supabase credentials pending in .env'
  });

  useEffect(() => {
    if (isSupabaseConfigured) {
      testSupabaseConnection().then(setSupabaseStatus);
    }
  }, []);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'staff':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'driver':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200/80 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shadow-xs">
      <div className="flex items-center space-x-3">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input */}
        <div className="hidden sm:flex items-center w-64 md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-100/80 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl text-xs transition-all"
          />
        </div>
      </div>

      {/* Right User Bar */}
      <div className="flex items-center space-x-3">
        {/* Supabase Connection Status Badge */}
        <div 
          className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-semibold transition-all ${
            supabaseStatus.connected 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
          title={supabaseStatus.message}
        >
          <Database className={`w-3.5 h-3.5 ${supabaseStatus.connected ? 'text-emerald-600' : 'text-amber-600'}`} />
          <span>{supabaseStatus.connected ? 'Supabase Connected' : 'Supabase Ready (Pending Env)'}</span>
          <span className={`w-2 h-2 rounded-full ${supabaseStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
        </div>

        {businessOnboarding && (
          <div className="hidden md:flex items-center space-x-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold text-slate-800">{businessOnboarding.businessName}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
              {businessOnboarding.status}
            </span>
          </div>
        )}

        <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

        {currentUser ? (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'US'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-none">{currentUser.name}</div>
                <div className="flex items-center space-x-1 mt-1">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${getRoleBadge(currentUser.role)}`}>
                    {currentUser.role}
                  </span>
                  <span className="text-[11px] text-slate-400">(@{currentUser.username})</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPasswordModal(true)}
              title="Change Password"
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs flex items-center"
            >
              <Key className="w-4 h-4" />
            </button>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs flex items-center"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl text-xs shadow-md shadow-blue-600/20 transition-all flex items-center space-x-1.5"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign In / Sign Up</span>
          </button>
        )}
      </div>

      <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </header>
  );
}
