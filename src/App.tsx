/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Applications } from './pages/Applications';
import { Documentation } from './pages/Documentation';
import { OnboardingWizard } from './pages/OnboardingWizard';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { Users, Settings } from 'lucide-react';
import { Application, ApplicationStatus } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('onboard');
  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('platform_applications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [impersonatingApp, setImpersonatingApp] = useState<Application | null>(null);

  useEffect(() => {
    localStorage.setItem('platform_applications', JSON.stringify(applications));
  }, [applications]);

  const handleAddApplication = (app: Omit<Application, 'id' | 'submittedAt' | 'status' | 'riskScore'>) => {
    const newApp: Application = {
      ...app,
      id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: new Date().toLocaleDateString(),
      status: 'Pending',
      riskScore: Math.floor(Math.random() * 40) + 10,
    };
    setApplications(prev => [newApp, ...prev]);
  };

  const handleUpdateApplicationStatus = (id: string, status: ApplicationStatus) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
  };

  const handleUpdateApplication = (id: string, data: Partial<Application>) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, ...data } : app));
    if (impersonatingApp && impersonatingApp.id === id) {
      setImpersonatingApp(prev => prev ? { ...prev, ...data } : null);
    }
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
      case 'dashboard':
        return <Dashboard applications={applications} />;
      case 'onboard':
        return <OnboardingWizard onComplete={handleAddApplication} onGoToDashboard={() => setActiveTab('dashboard')} />;
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
          <div className="flex flex-col items-center justify-center h-96 text-slate-500">
            <Users className="w-12 h-12 mb-4 text-slate-300" />
            <h2 className="text-xl font-semibold text-slate-900">User Roles & Permissions</h2>
            <p>Manage RBAC across all organization levels.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="flex flex-col items-center justify-center h-96 text-slate-500">
            <Settings className="w-12 h-12 mb-4 text-slate-300" />
            <h2 className="text-xl font-semibold text-slate-900">Platform Settings</h2>
            <p>Configure global webhooks, API keys, and notification engines.</p>
          </div>
        );
      default:
        return <Dashboard applications={applications} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
