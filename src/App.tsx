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
import { SuperAdminHub } from './pages/SuperAdminHub';
import { AuditLogs, initialAuditLogs } from './pages/AuditLogs';
import { AuthModal } from './components/auth/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LogisticsProvider } from './components/modules/logistics/LogisticsContext';
import { Users, Settings, ShieldCheck, Building2, Lock, UserCheck, Key } from 'lucide-react';
import { Application, ApplicationStatus, AuditLog } from './types';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState('onboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [impersonatingApp, setImpersonatingApp] = useState<Application | null>(null);
  const { currentUser, businessOnboarding, setBusinessOnboarding, applyForOnboarding } = useAuth();

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

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
        applicant: 'Suntracomm Super Admin',
        type: 'Logistics Company',
        email: 'admin@suntracomm.com',
        phone: '+234 800 111 2222',
        registeredByUserId: 'ACC-ADMIN-001',
        submittedAt: '2026-08-10',
        status: 'Approved',
        riskScore: 12,
        documents: [{ id: 'doc-1', type: 'CAC', name: 'cac_cert.pdf', url: '', uploadedAt: '2026-08-10', verified: true }],
        details: {
          cacNumber: 'RC-1892041',
          address: 'Plot 12 Commercial Avenue, Ikeja, Lagos State',
          fleetSize: '15 Heavy Trucks',
          notes: 'Verified CAC documents with CAC portal.'
        }
      },
      {
        id: 'APP-1002',
        businessName: 'St. Mary Model College',
        applicant: 'Dr. Chinedu Okafor',
        type: 'School',
        email: 'admin@stmary.edu.ng',
        phone: '+234 802 987 6543',
        registeredByUserId: 'ACC-ADM-889012',
        submittedAt: '2026-08-12',
        status: 'Pending',
        riskScore: 28,
        documents: [{ id: 'doc-2', type: 'Logo', name: 'school_logo.png', url: '', uploadedAt: '2026-08-12', verified: false }],
        details: {
          cacNumber: 'RN-890214',
          address: '15 School Road, Enugu',
          fleetSize: '4 School Buses',
          notes: 'Pending Super Admin document review.'
        }
      },
      {
        id: 'APP-1003',
        businessName: 'GreenField Agri Foods',
        applicant: 'Alhaji Musa Garba',
        type: 'Corporate Business',
        email: 'musa@greenfield.ng',
        phone: '+234 803 555 1122',
        registeredByUserId: 'ACC-ADM-998811',
        submittedAt: '2026-08-13',
        status: 'Approved',
        riskScore: 18,
        documents: [{ id: 'doc-3', type: 'CAC', name: 'cac_greenfield.pdf', url: '', uploadedAt: '2026-08-13', verified: true }],
        details: {
          cacNumber: 'RC-991204',
          address: '22 Farm Estate Rd, Kaduna',
          fleetSize: '8 Cargo Vans',
          notes: 'Approved for agricultural logistics.'
        }
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('platform_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    if (currentUser?.role === 'superadmin') {
      fetch('/api/onboarding/all')
        .then(res => res.json())
        .then((data: any[]) => {
          if (Array.isArray(data) && data.length > 0) {
            setApplications(prev => {
              const existingIds = new Set(prev.map(a => a.id));
              const newApps = data
                .filter(d => !existingIds.has(d.id))
                .map(d => ({
                  id: d.id,
                  businessName: d.businessName,
                  type: d.businessType,
                  applicant: 'Registered Admin',
                  email: d.email || '',
                  phone: d.phone || '',
                  registeredByUserId: d.adminId,
                  submittedAt: d.createdAt ? d.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
                  status: d.status,
                  riskScore: Math.floor(Math.random() * 30) + 10,
                  details: {
                    cacNumber: d.cacNumber || '',
                    address: d.address || '',
                  }
                } as Application));
                
              if (newApps.length > 0) {
                return [...newApps, ...prev];
              }
              return prev;
            });
          }
        })
        .catch(err => console.error("Failed to fetch backend applications", err));
    }
  }, [currentUser?.role]);

  // Handle redirection based on user role and onboarding status
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'superadmin') {
        setActiveTab('superadmin-hub');
      } else if (currentUser.role === 'admin') {
        const matchingApp = applications.find(a => 
          (a.registeredByUserId && a.registeredByUserId === currentUser.id) ||
          (a.email && currentUser.email && a.email.toLowerCase() === currentUser.email.toLowerCase()) ||
          (a.applicant && currentUser.name && a.applicant.toLowerCase().includes(currentUser.name.toLowerCase()))
        );

        if (businessOnboarding?.status === 'Approved' || matchingApp?.status === 'Approved') {
          setActiveTab('dashboard');
        } else if (matchingApp) {
          // Admin has an application but it's not approved yet, take them to dashboard where pending UI is shown
          setActiveTab('dashboard');
        } else {
          setActiveTab('wizard');
        }
      } else if (currentUser.role === 'driver') {
        setActiveTab('driver-portal');
      }
    }
  }, [currentUser?.id, currentUser?.role, businessOnboarding?.status]);

  const handleAddAuditLog = (action: string, target: string, details: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actorId: currentUser?.id || 'SYSTEM',
      actorName: currentUser?.name || 'System Engine',
      actorRole: currentUser?.role || 'admin',
      action,
      target,
      details,
      ipAddress: '102.89.23.11'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleUpdateApplicationStatus = (id: string, status: ApplicationStatus) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
    const targetApp = applications.find(a => a.id === id);
    if (targetApp && status === 'Approved') {
      const newOnboarding = {
        id: `BIZ-${id}`,
        adminId: targetApp.registeredByUserId || currentUser?.id || 'ACC-ADMIN-001',
        businessName: targetApp.businessName,
        businessType: targetApp.type,
        status: 'Approved' as const,
        email: targetApp.email,
        phone: targetApp.phone,
      };
      setBusinessOnboarding(newOnboarding);
      localStorage.setItem('uniboard_onboarding', JSON.stringify(newOnboarding));
    }

    // Persist to backend if it's a backend ID
    fetch(`/api/onboarding/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(console.error);

    handleAddAuditLog(
      `Updated Application Status to ${status}`,
      `Application ${id}`,
      `Status changed by ${currentUser?.name || 'Super Admin'}`
    );
  };

  const handleUpdateApplication = (id: string, data: Partial<Application>) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, ...data } : app));
    if (impersonatingApp && impersonatingApp.id === id) {
      setImpersonatingApp(prev => prev ? { ...prev, ...data } : null);
    }
    handleAddAuditLog(
      'Modified Business Record',
      `Application ${id}`,
      `Updated fields by ${currentUser?.name || 'Super Admin'}`
    );
  };

  const handleAddApplication = (newAppData: Omit<Application, 'id' | 'submittedAt' | 'status' | 'riskScore'>) => {
    const newApp: Application = {
      ...newAppData,
      id: `APP-${1000 + applications.length + 1}`,
      registeredByUserId: currentUser?.id,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Pending',
      riskScore: Math.floor(Math.random() * 30) + 10
    };
    setApplications(prev => [newApp, ...prev]);
    
    if (currentUser?.role === 'admin') {
      const newOnboarding = {
        id: `BIZ-${newApp.id}`,
        adminId: currentUser.id,
        businessName: newApp.businessName,
        businessType: newApp.type,
        status: 'Pending' as const,
        email: newApp.email,
        phone: newApp.phone
      };
      setBusinessOnboarding(newOnboarding);
      localStorage.setItem('uniboard_onboarding', JSON.stringify(newOnboarding));
      
      // Also persist to backend
      applyForOnboarding({
        businessName: newApp.businessName,
        businessType: newApp.type,
        cacNumber: newApp.details?.cacNumber || '',
        address: newApp.details?.address || '',
        phone: newApp.phone,
        email: newApp.email
      }).catch(console.error);
    }

    handleAddAuditLog(
      'Registered Business Application',
      `${newApp.id} (${newApp.businessName})`,
      `Registered by ${currentUser?.name || 'Admin'} (${currentUser?.id})`
    );
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
      case 'superadmin-hub':
        return (
          <SuperAdminHub 
            applications={applications}
            onUpdateStatus={handleUpdateApplicationStatus}
            onUpdateApplication={handleUpdateApplication}
            onViewCustomerDashboard={(app) => setImpersonatingApp(app)}
            onAddAuditLog={handleAddAuditLog}
          />
        );
      case 'audit-logs':
        return <AuditLogs logs={auditLogs} />;
      case 'demo':
        return (
          <ClientDemoShowcase 
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        );
      case 'dashboard':
        if (currentUser?.role === 'admin') {
          const matchingApp = applications.find(a => 
            (a.registeredByUserId && a.registeredByUserId === currentUser.id) ||
            (a.email && currentUser.email && a.email.toLowerCase() === currentUser.email.toLowerCase()) ||
            (a.applicant && currentUser.name && a.applicant.toLowerCase().includes(currentUser.name.toLowerCase()))
          );
          
          if (matchingApp && matchingApp.status !== 'Approved') {
            return (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck className="w-12 h-12 text-amber-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Application Under Review</h2>
                <p className="text-slate-600 text-lg max-w-lg mb-8">
                  Your business onboarding request for <span className="font-semibold text-slate-900">{matchingApp.businessName || 'your business'}</span> is currently being reviewed by the Super Admin team.
                </p>
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-left max-w-md w-full">
                  <h3 className="font-semibold text-slate-900 mb-4">Application Status</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Status</span>
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-bold text-xs">
                        {matchingApp.status || 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Submitted Date</span>
                      <span className="text-sm font-medium text-slate-900">{matchingApp.submittedAt || 'Recently'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">Reference ID</span>
                      <span className="text-sm font-mono font-bold text-slate-900">{matchingApp.id || '---'}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-8">You will gain access to your full dashboard once approved.</p>
              </div>
            );
          }
        }
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
        return (
          <BusinessOnboardingView 
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        );
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
                <p className="text-xs text-slate-500 mt-1">Configured system permissions across Super Admin, Registered Admin, Staff, and Drivers.</p>
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
                  role: 'Super Admin',
                  desc: 'System-wide authority. Modify any business record, approve/reject requests, manage system configuration, audit logs, and user roles.',
                  privileges: ['System-Wide Business Modification', 'Global Approval Authority', 'Audit Trail Governance', 'Platform Configuration & Users Control'],
                  color: 'border-purple-500 bg-purple-50/30'
                },
                {
                  role: 'Registered Admin',
                  desc: 'Personal business owner. Scoped strictly to view, manage, and update businesses they personally registered.',
                  privileges: ['Personal Business View & Management', 'Onboard Drivers & Assign Vehicles', 'Driver Portal Password Control', 'Scoped Financial Receipts'],
                  color: 'border-blue-500 bg-blue-50/30'
                },
                {
                  role: 'Onboarded Driver',
                  desc: 'Assigned vehicle driver. Sign in with username, track hire purchase weekly targets, upload payment receipts.',
                  privileges: ['Username Portal Sign-In', 'Custom Password Setup', 'Weekly Hire Purchase Progress', 'Payment Receipt Uploads'],
                  color: 'border-amber-500 bg-amber-50/30'
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
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className="flex-1 flex flex-col lg:ml-64 overflow-hidden w-full transition-all">
        <Header 
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 relative">
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
