import React from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  Files, 
  Network, 
  Settings, 
  ShieldCheck, 
  Users, 
  FileText,
  Briefcase,
  GitMerge,
  Store,
  PlusCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'onboard', label: 'Onboard Business', icon: PlusCircle },
    { id: 'applications', label: 'Applications (KYC)', icon: ShieldCheck },
  ];

  const adminItems = [
    { id: 'users', label: 'User Roles', icon: Users },
    { id: 'docs', label: 'Documentation', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 flex items-center space-x-3 text-white">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">U</div>
        <span className="font-semibold text-lg tracking-tight">UniBoard</span>
      </div>
      
      <div className="px-4 pb-4 flex-1">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4 px-2">Operations</div>
        <nav className="space-y-1 mb-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activeTab === item.id 
                  ? "bg-blue-600 text-white" 
                  : "hover:bg-slate-800 hover:text-white",
                item.id === 'onboard' && activeTab !== 'onboard' ? "text-blue-400 font-semibold" : ""
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">System</div>
        <nav className="space-y-1">
          {adminItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activeTab === item.id 
                  ? "bg-blue-600 text-white" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-4 shrink-0">
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-sm font-medium text-white">System Status</div>
          <div className="flex items-center space-x-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-slate-400">All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
