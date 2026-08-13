import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LogisticsDashboard } from './components/modules/logistics/LogisticsDashboard';
import { VehicleManagement } from './components/modules/logistics/VehicleManagement';
import { DriverManagement } from './components/modules/logistics/DriverManagement';
import { IncomeManagement } from './components/modules/logistics/IncomeManagement';
import { DriverPortal } from './components/modules/logistics/DriverPortal';
import { BusinessOnboardingView } from './components/auth/BusinessOnboardingView';
import { OnboardingWizard } from './pages/OnboardingWizard';
import { Applications } from './pages/Applications';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { Documentation } from './pages/Documentation';
import { ClientDemoShowcase } from './components/demo/ClientDemoShowcase';
import { AuthModal } from './components/auth/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LogisticsProvider } from './components/modules/logistics/LogisticsContext';
import { Users, Settings, ShieldCheck, Building2, Lock, UserCheck, Key } from 'lucide-react';
import { Application, ApplicationStatus } from './types';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState('demo');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [impersonatingApp, setImpersonatingApp] = useState<Application | null>(null);
  const { currentUser } = useAuth();

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('platform_applications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: 'APP-1001',
        businessName: 'Suntracomm Logistics Ltd',
        applicant: 'Ibrahim Babangida',
        type: 'Logistics Company',
        email: 'ibrahim@suntracomm.com',
        phone: '+234 803 123 4567',
        submittedAt: '2026-08-10',
        status: 'Approved',
        riskScore: 12,
        documents: [{ type: 'CAC', name: 'cac_cert.pdf' }]
      },
      {
        id: 'APP-1002',
        businessName: 'St. Mary Model College',
        applicant: 'Dr. Chinedu Okafor',
        type: 'School',
        email: 'admin@stmary.edu.ng',
        phone: '+234 802 987 6543',
        submittedAt: '2026-08-12',
        status: 'Pending',
        riskScore: 28,
        documents: [{ type: 'Logo', name: 'school_logo.png' }]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('platform_applications', JSON.stringify(applications));
  }, [applications]);

  const handleUpdateApplicationStatus = (id: string, status: ApplicationStatus) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
  };

  const handleUpdateApplication = (id: string, data: Partial<Application>) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, ...data } : app));
    if (impersonatingApp && impersonatingApp.id === id) {
      setImpersonatingApp(prev => prev ? { ...prev, ...data } : null);
    }
  };

  const handleAddApplication = (newAppData: Omit<Application, 'id' | 'submittedAt' | 'status' | 'riskScore'>) => {
    const newApp: Application = {
      ...newAppData,
      id: `APP-${1000 + applications.length + 1}`,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Pending',
      riskScore: Math.floor(Math.random() * 30) + 10
    };
    setApplications(prev => [newApp, ...prev]);
  };

  if (impersonatingApp) {
    return (
      <CustomerDashboard 
        app={impersonatingApp} 
        onExit={() => setImpersonatingApp(null)}
        onUpdateApp={handleUpdateApplication}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'demo':
        return (
          <ClientDemoShowcase 
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        );
      case 'dashboard':
        return <LogisticsDashboard />;
      case 'vehicles':
        return <VehicleManagement />;
      case 'drivers':
        return <DriverManagement />;
      case 'income':
        return <IncomeManagement />;
      case 'driver-portal':
        return <DriverPortal />;
      case 'onboard':
        return <BusinessOnboardingView />;
      case 'wizard':
        return (
          <OnboardingWizard 
            onComplete={handleAddApplication} 
            onGoToDashboard={() => setActiveTab('applications')} 
          />
        );
      case 'applications':
        return (
          <Applications 
            applications={applications} 
            onUpdateStatus={handleUpdateApplicationStatus} 
            onUpdateApplication={handleUpdateApplication}
            onViewCustomerDashboard={(app) => setImpersonatingApp(app)}
          />
        );
      case 'docs':
        return <Documentation />;
      case 'users':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Role-Based Access Control (RBAC) Matrix</h2>
                <p className="text-xs text-slate-500 mt-1">Configured permissions for Admin, Staff, Drivers, and Users across businesses.</p>
              </div>
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-blue-600/20"
              >
                <Key className="w-4 h-4" />
                <span>Switch Portal Role</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  role: 'Admin / Business Owner',
                  desc: 'Self sign-up, apply for business onboarding, create drivers, manage vehicles, approve payments.',
                  privileges: ['Admin Self-Registration', 'Business Onboarding Application', 'Driver Onboarding & Login Access', 'Full Financial & Hire Purchase Control'],
                  color: 'border-blue-500 bg-blue-50/30'
                },
                {
                  role: 'Onboarded Driver',
                  desc: 'Sign in with assigned username, set password, track hire purchase progress, submit receipts.',
                  privileges: ['Portal Sign In by Username', 'Custom Password Management', 'Weekly Target & Balance Tracker', 'Payment Receipt Upload'],
                  color: 'border-amber-500 bg-amber-50/30'
                },
                {
                  role: 'Operations Staff / User',
                  desc: 'Fleet monitoring, vehicle tracking, maintenance logs, application review.',
                  privileges: ['Vehicle Inspection Logs', 'Daily Trip Tracking', 'Payment Verification Queue', 'General Customer Support'],
                  color: 'border-purple-500 bg-purple-50/30'
                }
              ].map((r, i) => (
                <div key={i} className={`bg-white p-6 rounded-2xl border-2 ${r.color} shadow-sm space-y-4`}>
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-slate-800" />
                    <h3 className="font-bold text-slate-900 text-sm">{r.role}</h3>
                  </div>
                  <p className="text-xs text-slate-600">{r.desc}</p>
                  <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    {r.privileges.map((p, j) => (
                      <li key={j} className="flex items-center space-x-2 text-slate-700 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <LogisticsDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />
      
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <Header onOpenAuthModal={() => setIsAuthModalOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </main>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LogisticsProvider>
        <MainAppContent />
      </LogisticsProvider>
    </AuthProvider>
  );
}
