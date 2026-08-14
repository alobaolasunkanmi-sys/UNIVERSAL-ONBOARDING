import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  ShieldCheck, Building2, Users, Settings, Search, Edit3, 
  CheckCircle2, XCircle, Clock, AlertTriangle, Eye, Sliders,
  Save, RefreshCw, Key, Database, Globe, Lock, ShieldAlert
} from 'lucide-react';
import { Application, ApplicationStatus, UserAccount } from '../types';

interface SuperAdminHubProps {
  applications: Application[];
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onUpdateApplication: (id: string, data: Partial<Application>) => void;
  onViewCustomerDashboard: (app: Application) => void;
  onAddAuditLog?: (action: string, target: string, details: string) => void;
}

export function SuperAdminHub({
  applications = [],
  onUpdateStatus,
  onUpdateApplication,
  onViewCustomerDashboard,
  onAddAuditLog
}: SuperAdminHubProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingApp, setEditingApp] = useState<Application | null>(null);

  // Editable form state for modal
  const [editForm, setEditForm] = useState({
    businessName: '',
    type: '',
    applicant: '',
    email: '',
    phone: '',
    cacNumber: '',
    address: '',
    fleetSize: '',
    riskScore: 20,
    status: 'Pending' as ApplicationStatus,
    notes: ''
  });

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    allowAdminSignup: true,
    requireNin: false,
    autoAssignTrackers: true,
    platformName: 'UniBoard Multi-Tenant Enterprise Platform'
  });
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenEditModal = (app: Application) => {
    setEditingApp(app);
    setEditForm({
      businessName: app.businessName,
      type: app.type,
      applicant: app.applicant,
      email: app.email,
      phone: app.phone,
      cacNumber: app.details?.cacNumber || '',
      address: app.details?.address || '',
      fleetSize: app.details?.fleetSize || '',
      riskScore: app.riskScore || 20,
      status: app.status,
      notes: app.details?.notes || ''
    });
  };

  const handleSaveBusinessRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    const updatedData: Partial<Application> = {
      businessName: editForm.businessName,
      type: editForm.type,
      applicant: editForm.applicant,
      email: editForm.email,
      phone: editForm.phone,
      riskScore: Number(editForm.riskScore),
      status: editForm.status,
      details: {
        ...(editingApp.details || {}),
        cacNumber: editForm.cacNumber,
        address: editForm.address,
        fleetSize: editForm.fleetSize,
        notes: editForm.notes,
        reviewedBy: 'Super Admin',
        reviewedAt: new Date().toISOString()
      }
    };

    onUpdateApplication(editingApp.id, updatedData);

    if (onAddAuditLog) {
      onAddAuditLog(
        'Super Admin Modified Business Record',
        `${editingApp.id} (${editForm.businessName})`,
        `Updated details: CAC=${editForm.cacNumber}, Risk=${editForm.riskScore}, Status=${editForm.status}`
      );
    }

    setEditingApp(null);
  };

  const handleSaveSettings = () => {
    setSettingsSavedMsg('Platform configurations saved successfully!');
    if (onAddAuditLog) {
      onAddAuditLog('Super Admin Configuration Update', 'System Settings', 'Updated platform maintenance mode, registration flags & rules.');
    }
    setTimeout(() => setSettingsSavedMsg(''), 3000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider border border-purple-400/30">
              Super Admin Core Control
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Super Admin Platform Operations</h2>
          <p className="text-xs text-slate-300">
            Full authority to review, modify, approve, and configure all registered businesses across the UniBoard ecosystem.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/10 text-right">
            <div className="text-[10px] text-slate-300 uppercase font-semibold">Total Platform Businesses</div>
            <div className="text-xl font-black text-white">{applications.length} Registered</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Total Businesses</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{applications.length}</p>
              <p className="text-[11px] text-blue-600 font-medium mt-0.5">Across all registered admins</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Approved Active</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {applications.filter(a => a.status === 'Approved').length}
              </p>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Full platform access</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Pending Approvals</p>
              <p className="text-2xl font-black text-amber-600 mt-1">
                {applications.filter(a => a.status === 'Pending').length}
              </p>
              <p className="text-[11px] text-amber-600 font-medium mt-0.5">Awaiting Super Admin review</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Audit & Security</p>
              <p className="text-2xl font-black text-purple-600 mt-1">100%</p>
              <p className="text-[11px] text-purple-600 font-medium mt-0.5">Audit logging active</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dedicated Pending Onboarding Requests Section */}
      {applications.some(a => a.status === 'Pending' || a.status === 'Under Review') && (
        <Card className="border-2 border-amber-300 bg-amber-50/20 shadow-md overflow-hidden">
          <CardHeader className="bg-amber-100/60 border-b border-amber-200 py-4 flex flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-500 text-white rounded-xl">
                <Clock className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-amber-950 flex items-center gap-2">
                  <span>Pending Admin Onboarding Requests</span>
                  <Badge variant="warning" className="bg-amber-500 text-white font-black text-xs">
                    {applications.filter(a => a.status === 'Pending' || a.status === 'Under Review').length} Action Required
                  </Badge>
                </CardTitle>
                <p className="text-xs text-amber-800 mt-0.5">
                  New business registrations submitted by admins requiring Super Admin review and approval.
                </p>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setStatusFilter('Pending')}
              className="border-amber-300 text-amber-900 hover:bg-amber-100 font-semibold text-xs"
            >
              Filter Pending Below
            </Button>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-amber-200/60 bg-white">
            {applications.filter(a => a.status === 'Pending' || a.status === 'Under Review').map((app) => (
              <div key={app.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-amber-50/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{app.businessName}</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-mono font-bold rounded-md">
                      {app.id}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded-full">
                      {app.type}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span><strong>Applicant Admin:</strong> {app.applicant}</span>
                    <span><strong>Email:</strong> {app.email}</span>
                    <span><strong>Phone:</strong> {app.phone}</span>
                    <span><strong>CAC Reg:</strong> {app.details?.cacNumber || 'N/A'}</span>
                    <span><strong>Fleet/Capacity:</strong> {app.details?.fleetSize || 'Not set'}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto justify-end">
                  <Button
                    size="sm"
                    onClick={() => {
                      onUpdateStatus(app.id, 'Approved');
                      if (onAddAuditLog) {
                        onAddAuditLog('Super Admin Approved Business Onboarding', app.id, `Approved business ${app.businessName}`);
                      }
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Business
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onUpdateStatus(app.id, 'Rejected');
                      if (onAddAuditLog) {
                        onAddAuditLog('Super Admin Rejected Business Onboarding', app.id, `Rejected business ${app.businessName}`);
                      }
                    }}
                    className="text-red-600 hover:bg-red-50 border-red-200 font-semibold text-xs gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenEditModal(app)}
                    className="text-slate-600 hover:text-slate-900 text-xs"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Main Businesses Management Section */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>Registered Businesses Directory</span>
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Super Admin view to modify, review, approve or manage any business record.</p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search business, owner, ID..."
                className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none w-64 bg-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-slate-500 uppercase bg-slate-50 border-b border-slate-200 font-bold">
                <tr>
                  <th className="px-6 py-3.5">Business & ID</th>
                  <th className="px-6 py-3.5">Category / Sector</th>
                  <th className="px-6 py-3.5">Registered Admin</th>
                  <th className="px-6 py-3.5">Contact Details</th>
                  <th className="px-6 py-3.5">CAC Number</th>
                  <th className="px-6 py-3.5">Risk Score</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Super Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredApps.length > 0 ? (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        <div className="text-sm font-bold text-slate-900">{app.businessName}</div>
                        <div className="text-[11px] text-blue-600 font-mono font-medium">{app.id}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-semibold">
                          {app.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {app.applicant}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div>{app.email}</div>
                        <div className="text-slate-400 text-[11px]">{app.phone}</div>
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-slate-700">
                        {app.details?.cacNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          app.riskScore > 50 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {app.riskScore}/100
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          app.status === 'Approved' ? 'success' :
                          app.status === 'Rejected' ? 'destructive' :
                          app.status === 'Under Review' ? 'warning' : 'default'
                        }>
                          {app.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Modify Business Record */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenEditModal(app)}
                            className="h-8 text-xs gap-1 border-blue-200 hover:bg-blue-50 text-blue-700 font-semibold"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Modify</span>
                          </Button>

                          {/* Quick Approval / Rejection Toggles */}
                          {app.status !== 'Approved' && (
                            <Button
                              size="sm"
                              onClick={() => {
                                onUpdateStatus(app.id, 'Approved');
                                if (onAddAuditLog) {
                                  onAddAuditLog('Super Admin Approved Business Onboarding', app.id, `Approved business ${app.businessName}`);
                                }
                              }}
                              className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              Approve
                            </Button>
                          )}

                          {app.status !== 'Rejected' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                onUpdateStatus(app.id, 'Rejected');
                                if (onAddAuditLog) {
                                  onAddAuditLog('Super Admin Rejected Business Onboarding', app.id, `Rejected business ${app.businessName}`);
                                }
                              }}
                              className="h-8 text-xs text-red-600 hover:bg-red-50 border-red-200 font-semibold"
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" />
                              Reject
                            </Button>
                          )}

                          {/* Impersonate Customer Workspace */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onViewCustomerDashboard(app)}
                            className="h-8 text-xs text-slate-600 hover:text-slate-900"
                            title="Open Business Workspace View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500 italic">
                      No businesses found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Platform Configurations & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-purple-600" />
              <span>Platform Rules & Governance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {settingsSavedMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{settingsSavedMsg}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900">Allow Admin Self-Registration</div>
                  <div className="text-slate-500 text-[11px]">Allow new business admins to sign up autonomously on the portal.</div>
                </div>
                <input 
                  type="checkbox"
                  checked={systemSettings.allowAdminSignup}
                  onChange={(e) => setSystemSettings({ ...systemSettings, allowAdminSignup: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900">Require National ID (NIN) for Admin</div>
                  <div className="text-slate-500 text-[11px]">When disabled, NIN field remains optional during registration.</div>
                </div>
                <input 
                  type="checkbox"
                  checked={systemSettings.requireNin}
                  onChange={(e) => setSystemSettings({ ...systemSettings, requireNin: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900">Platform System Maintenance Mode</div>
                  <div className="text-slate-500 text-[11px]">Temporarily restrict tenant logins for scheduled platform upgrades.</div>
                </div>
                <input 
                  type="checkbox"
                  checked={systemSettings.maintenanceMode}
                  onChange={(e) => setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
              </div>
            </div>

            <Button onClick={handleSaveSettings} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold">
              <Save className="w-4 h-4 mr-2" /> Save Governance Rules
            </Button>
          </CardContent>
        </Card>

        {/* Database & Infrastructure Overview */}
        <Card className="border-slate-200">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <span>Multi-Tenant Infrastructure Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-400">Database Engine</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">ACTIVE</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Cloud SQL PostgreSQL with isolated multi-tenant records per registered business admin.
                </p>
              </div>

              <div className="p-3.5 bg-indigo-50 border border-indigo-200 text-indigo-950 rounded-xl space-y-1">
                <div className="font-bold text-xs flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Audit & Access Policy Active</span>
                </div>
                <p className="text-[11px] text-indigo-800 leading-relaxed">
                  Strict boundary rules ensure Registered Admins cannot modify or access records outside their personally registered business.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SUPER ADMIN MODIFY BUSINESS RECORD MODAL */}
      {editingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Super Admin Record Editor</div>
                <h3 className="text-xl font-bold mt-0.5">Modify Business Record - {editingApp.id}</h3>
              </div>
              <button 
                onClick={() => setEditingApp(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBusinessRecord} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business Name *</label>
                  <input 
                    type="text"
                    required
                    value={editForm.businessName}
                    onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category / Industry Type *</label>
                  <input 
                    type="text"
                    required
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Registered Applicant / Owner *</label>
                  <input 
                    type="text"
                    required
                    value={editForm.applicant}
                    onChange={(e) => setEditForm({ ...editForm, applicant: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">CAC Registration Number</label>
                  <input 
                    type="text"
                    value={editForm.cacNumber}
                    onChange={(e) => setEditForm({ ...editForm, cacNumber: e.target.value })}
                    placeholder="e.g. RC-1892041"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input 
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input 
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fleet / Staff Capacity</label>
                  <input 
                    type="text"
                    value={editForm.fleetSize}
                    onChange={(e) => setEditForm({ ...editForm, fleetSize: e.target.value })}
                    placeholder="e.g. 15 Trucks"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Risk Assessment Score (0 - 100)</label>
                  <input 
                    type="number"
                    min={0}
                    max={100}
                    value={editForm.riskScore}
                    onChange={(e) => setEditForm({ ...editForm, riskScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Approval Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as ApplicationStatus })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Registered Physical Address</label>
                  <input 
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    placeholder="Full physical office address"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 text-xs">Super Admin Audit Remarks / Notes</label>
                <textarea 
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="Compliance review observations, inspection dates, CAC verification notes..."
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditingApp(null)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Business Record Updates
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
