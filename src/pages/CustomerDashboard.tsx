import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Application } from '../types';
import { 
  LogOut, Save, Edit3, Settings, ShieldCheck, CreditCard, Users, Store, School, Building2,
  LayoutDashboard, MessageSquare, FileText, BarChart3, Users2, Briefcase, Calendar, 
  ShoppingCart, Scissors, Home, Pill, GraduationCap, ClipboardList, BookOpen, Clock, 
  Truck, Megaphone, ShieldAlert, Lock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ClassManagement } from '../components/modules/school/ClassManagement';
import { StudentManagement } from '../components/modules/school/StudentManagement';
import { SchoolFees } from '../components/modules/school/SchoolFees';
import { AttendanceTimetable } from '../components/modules/school/AttendanceTimetable';
import { StaffManagement } from '../components/modules/school/StaffManagement';
import { SchoolDashboardWidgets } from '../components/modules/school/SchoolDashboard';
import { SchoolCommunicationCenter } from '../components/modules/school/CommunicationCenter';
import { SchoolProvider } from '../components/modules/school/SchoolContext';

import { LogisticsDashboard } from '../components/modules/logistics/LogisticsDashboard';
import { DriverManagement } from '../components/modules/logistics/DriverManagement';
import { VehicleManagement } from '../components/modules/logistics/VehicleManagement';
import { IncomeManagement } from '../components/modules/logistics/IncomeManagement';
import { DriverPortal } from '../components/modules/logistics/DriverPortal';
import { LogisticsProvider } from '../components/modules/logistics/LogisticsContext';

interface CustomerDashboardProps {
  app: Application;
  onExit: () => void;
  onUpdateApp: (id: string, data: Partial<Application>) => void;
}

export function CustomerDashboard({ app, onExit, onUpdateApp }: CustomerDashboardProps) {
  const [activeModule, setActiveModule] = useState('dashboard');
  
  const renderIcon = () => {
    if (app.type.includes('School')) return <School className="w-8 h-8 text-blue-600" />;
    if (app.type.includes('Corporate')) return <Building2 className="w-8 h-8 text-indigo-600" />;
    if (app.type.includes('Pharmacy')) return <Pill className="w-8 h-8 text-green-600" />;
    if (app.type.includes('Real Estate')) return <Home className="w-8 h-8 text-teal-600" />;
    if (app.type.includes('Tailor')) return <Scissors className="w-8 h-8 text-pink-600" />;
    if (app.type.includes('Logistics') || app.businessName.toLowerCase().includes('suntracomm')) return <Truck className="w-8 h-8 text-slate-600" />;
    return <Store className="w-8 h-8 text-orange-600" />;
  };

  const universalModules = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'communication', label: 'Communication Centre', icon: MessageSquare },
    { id: 'team', label: 'Staff & Team', icon: Users2 },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getCategoryModules = () => {
    if (app.type.includes('School')) return [
      { id: 'students', label: 'Student Management', icon: GraduationCap },
      { id: 'classes', label: 'Class Management', icon: ClipboardList },
      { id: 'attendance', label: 'Attendance & Timetable', icon: Clock },
      { id: 'fees', label: 'School Fees', icon: CreditCard },
    ];
    if (app.type.includes('Pharmacy')) return [
      { id: 'inventory', label: 'Medicine Inventory', icon: Pill },
      { id: 'pos', label: 'Point of Sale (POS)', icon: CreditCard },
      { id: 'prescriptions', label: 'Prescriptions', icon: ClipboardList },
      { id: 'suppliers', label: 'Suppliers', icon: Truck },
    ];
    if (app.type.includes('Supermarket')) return [
      { id: 'catalogue', label: 'Product Catalogue', icon: Store },
      { id: 'pos', label: 'Point of Sale (POS)', icon: CreditCard },
      { id: 'inventory', label: 'Inventory Management', icon: ClipboardList },
      { id: 'promotions', label: 'Discounts & Promos', icon: Megaphone },
    ];
    if (app.type.includes('Corporate')) return [
      { id: 'employees', label: 'Employee Directory', icon: Users2 },
      { id: 'departments', label: 'Departments', icon: Building2 },
      { id: 'projects', label: 'Projects & Tasks', icon: Briefcase },
      { id: 'compliance', label: 'Compliance Tracking', icon: ShieldCheck },
    ];
    if (app.type.includes('Tailor')) return [
      { id: 'customers', label: 'Customer Profiles', icon: Users },
      { id: 'measurements', label: 'Measurements', icon: Scissors },
      { id: 'orders', label: 'Orders & Production', icon: ShoppingCart },
      { id: 'fabric', label: 'Fabric Inventory', icon: Store },
    ];
    if (app.type.includes('Real Estate')) return [
      { id: 'properties', label: 'Property Listings', icon: Home },
      { id: 'tenants', label: 'Tenants & Leases', icon: Users },
      { id: 'rent', label: 'Rent Collection', icon: CreditCard },
      { id: 'maintenance', label: 'Maintenance', icon: Settings },
    ];
    if (app.type.includes('Logistics') || app.businessName.toLowerCase().includes('suntracomm')) return [
      { id: 'drivers', label: 'Driver Management', icon: Users },
      { id: 'vehicles', label: 'Vehicle Management', icon: Truck },
      { id: 'income', label: 'Income Management', icon: CreditCard },
      { id: 'driver-portal', label: 'Driver Portal', icon: Truck },
    ];
    return [];
  };

  const categoryModules = getCategoryModules();

  const renderDashboardWidgets = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none">
            <CardContent className="p-6">
              <p className="text-blue-100 font-medium text-sm">Monthly Revenue</p>
              <h2 className="text-3xl font-bold mt-1">₦0.00</h2>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-slate-500 font-medium text-sm">Active Users</p>
              <h2 className="text-3xl font-bold mt-1 text-slate-900">0</h2>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-slate-500 font-medium text-sm">Pending Tasks</p>
              <h2 className="text-3xl font-bold mt-1 text-slate-900">0</h2>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-slate-500 font-medium text-sm">System Health</p>
              <h2 className="text-3xl font-bold mt-1 text-green-600">Optimal</h2>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500">No recent activities to show.</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {categoryModules.slice(0, 4).map(mod => (
                  <Button key={mod.id} variant="outline" className="h-auto py-4 flex flex-col gap-2 items-center justify-center text-slate-600" onClick={() => setActiveModule(mod.id)}>
                    <mod.icon className="w-6 h-6" />
                    <span className="text-xs">{mod.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderCommunicationCentre = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Communication Centre</h2>
          <p className="text-slate-500 mt-1">Manage bulk SMS, emails, and notifications.</p>
        </div>
        <Button><MessageSquare className="w-4 h-4 mr-2" /> New Campaign</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Email Campaigns</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-sm text-slate-500 mt-1">Sent this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">SMS Delivered</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-sm text-slate-500 mt-1">Credits remaining: 500</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Push Notifications</h3>
            <p className="text-3xl font-bold text-indigo-600">0</p>
            <p className="text-sm text-slate-500 mt-1">Active subscribers</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Message Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-slate-50">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">Welcome Message</h4>
                <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded">Email</span>
              </div>
              <p className="text-sm text-slate-600 font-mono bg-white p-2 border rounded">Dear {'{{CustomerName}}'}, welcome to {'{{BusinessName}}'}!</p>
            </div>
            <div className="p-4 border rounded-lg bg-slate-50">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">Payment Reminder</h4>
                <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded">SMS</span>
              </div>
              <p className="text-sm text-slate-600 font-mono bg-white p-2 border rounded">Reminder: Your balance of {'{{OutstandingBalance}}'} is due on {'{{DueDate}}'}.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
      businessName: app.businessName,
      applicant: app.applicant,
      email: app.email || '',
      phone: app.phone || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
      onUpdateApp(app.id, formData);
      setIsEditing(false);
    };

    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Business Settings</h2>
            <p className="text-slate-500 mt-1">Manage your business profile and preferences.</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Business Profile</CardTitle>
            {!isEditing && (
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Edit3 className="w-4 h-4 text-blue-600" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-500">Business Name</label>
                  <Input name="businessName" value={formData.businessName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-500">Owner / Applicant</label>
                  <Input name="applicant" value={formData.applicant} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-500">Email Address</label>
                  <Input name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-500">Phone Number</label>
                  <Input name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500">Business Name</p>
                    <p className="font-semibold text-slate-900">{app.businessName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Owner / Applicant</p>
                    <p className="font-semibold text-slate-900">{app.applicant}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Email Address</p>
                    <p className="font-semibold text-slate-900">{app.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Phone Number</p>
                    <p className="font-semibold text-slate-900">{app.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400">Application ID: {app.id}</p>
                  <p className="text-xs text-slate-400">Submitted: {app.submittedAt}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderGenericModule = (title: string) => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
        <Store className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{title} Module</h2>
      <p className="text-slate-500 max-w-md">
        This module is provisioned dynamically for {app.type} businesses. You are currently viewing it in Admin Impersonation mode.
      </p>
      <Button className="mt-6" variant="outline" onClick={() => setActiveModule('dashboard')}>Back to Dashboard</Button>
    </div>
  );

  const renderContent = () => {
    if (activeModule === 'settings') return renderSettings();

    if (app.status === 'Rejected') {
      return (
        <Card className="h-full min-h-[400px] flex items-center justify-center border-dashed border-red-200 bg-red-50/50">
          <CardContent className="text-center py-12">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Rejected</h2>
            <p className="text-slate-600 max-w-md mx-auto mb-6">
              Unfortunately, your business application did not meet our compliance requirements. Please review your settings or contact support for more details.
            </p>
            <Button onClick={() => setActiveModule('settings')}>Review Settings</Button>
          </CardContent>
        </Card>
      );
    }

    if (app.status !== 'Approved') {
      return (
        <Card className="h-full min-h-[400px] flex items-center justify-center border-dashed">
          <CardContent className="text-center py-12">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Application in Review</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              Your business profile is currently being reviewed by our compliance team. Full dashboard features will be unlocked once approved.
            </p>
            <Button variant="outline" onClick={() => setActiveModule('settings')}>Update Details</Button>
          </CardContent>
        </Card>
      );
    }

    if (app.type.includes('School')) {
      if (activeModule === 'dashboard') return <SchoolDashboardWidgets setActiveModule={setActiveModule} />;
      if (activeModule === 'communication') return <SchoolCommunicationCenter />;
      if (activeModule === 'team') return <StaffManagement />;
      if (activeModule === 'students') return <StudentManagement />;
      if (activeModule === 'classes') return <ClassManagement />;
      if (activeModule === 'fees') return <SchoolFees />;
      if (activeModule === 'attendance') return <AttendanceTimetable />;
    }

    if (app.type.includes('Logistics') || app.businessName.toLowerCase().includes('suntracomm')) {
      if (activeModule === 'dashboard' || activeModule === 'logistics-dashboard') return <LogisticsDashboard />;
      if (activeModule === 'drivers') return <DriverManagement />;
      if (activeModule === 'vehicles') return <VehicleManagement />;
      if (activeModule === 'income') return <IncomeManagement />;
      if (activeModule === 'driver-portal') return <DriverPortal />;
    }

    if (activeModule === 'dashboard') return renderDashboardWidgets();
    if (activeModule === 'communication') return renderCommunicationCentre();
    
    const allModules = [...universalModules, ...categoryModules];
    const mod = allModules.find(m => m.id === activeModule);
    return renderGenericModule(mod?.label || 'Unknown');
  };

  const isLogistics = app.type.includes('Logistics') || app.businessName.toLowerCase().includes('suntracomm');
  const Wrapper = app.type.includes('School') ? SchoolProvider : (isLogistics ? LogisticsProvider : React.Fragment);

  return (
    <Wrapper>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Top Navigation */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-slate-50 border border-slate-100 text-blue-600 p-2 rounded-xl">
                {renderIcon()}
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight text-slate-900">{app.businessName}</h1>
                <p className="text-xs text-slate-500 font-medium">{app.type} Workspace</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-sm font-medium">
                <ShieldCheck className="w-4 h-4" />
                Viewing as Customer (Impersonation)
              </div>
              <Button variant="destructive" size="sm" onClick={onExit}>
                <LogOut className="w-4 h-4 mr-2" /> Exit
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 max-w-[1600px] w-full mx-auto flex overflow-hidden">
          {/* Left Sidebar Navigation */}
          <aside className="w-64 border-r border-slate-200 bg-white hidden md:block overflow-y-auto py-6 flex-shrink-0">
            <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Universal Tools</div>
            <nav className="space-y-1 px-2 mb-8">
              {universalModules.map((item) => {
                const isLocked = app.status !== 'Approved' && item.id !== 'settings';
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      activeModule === item.id 
                        ? "bg-blue-50 text-blue-700" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                      isLocked && "opacity-75"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {isLocked && <Lock className="w-3 h-3 text-slate-400" />}
                  </button>
                );
              })}
            </nav>

            {categoryModules.length > 0 && (
              <>
                <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">{app.type} Modules</div>
                <nav className="space-y-1 px-2">
                  {categoryModules.map((item) => {
                    const isLocked = app.status !== 'Approved';
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveModule(item.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          activeModule === item.id 
                            ? "bg-blue-50 text-blue-700" 
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                          isLocked && "opacity-75"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {isLocked && <Lock className="w-3 h-3 text-slate-400" />}
                      </button>
                    );
                  })}
                </nav>
              </>
            )}
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
            <div className="max-w-5xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </Wrapper>
  );
}
