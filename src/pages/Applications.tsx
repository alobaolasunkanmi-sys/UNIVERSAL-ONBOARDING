import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Search, Filter, ShieldAlert, Check, X, Eye, ExternalLink, Edit3, Lock, ShieldCheck, Save, Building2 } from 'lucide-react';
import { Application, ApplicationStatus } from '../types';
import { useAuth } from '../context/AuthContext';

interface ApplicationsProps {
  applications?: Application[];
  onUpdateStatus?: (id: string, status: ApplicationStatus) => void;
  onUpdateApplication?: (id: string, data: Partial<Application>) => void;
  onViewCustomerDashboard?: (app: Application) => void;
}

export function Applications({ 
  applications = [], 
  onUpdateStatus, 
  onUpdateApplication, 
  onViewCustomerDashboard 
}: ApplicationsProps) {
  const { currentUser } = useAuth();
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Super Admin Edit Modal state
  const [editingApp, setEditingApp] = useState<Application | null>(null);
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

  const isSuperAdmin = currentUser?.role === 'superadmin';
  const isAdmin = currentUser?.role === 'admin';

  // Strict Scoping Filter:
  // If registered admin, only show businesses they personally registered
  const scopedApplications = useMemo(() => {
    if (isSuperAdmin) {
      return applications;
    }
    if (isAdmin && currentUser) {
      return applications.filter(app => {
        const matchesUserId = app.registeredByUserId === currentUser.id;
        const matchesEmail = app.email && currentUser.email && app.email.toLowerCase() === currentUser.email.toLowerCase();
        const matchesName = app.applicant && currentUser.name && app.applicant.toLowerCase().includes(currentUser.name.toLowerCase());
        return matchesUserId || matchesEmail || matchesName;
      });
    }
    return applications;
  }, [applications, currentUser, isSuperAdmin, isAdmin]);

  // Apply search and status filters to scoped applications
  const filteredApplications = useMemo(() => {
    return scopedApplications.filter(app => {
      const matchesSearch = 
        app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [scopedApplications, searchTerm, statusFilter]);

  // Find selected app
  const selectedApp = useMemo(() => {
    return applications.find(a => a.id === selectedAppId) || null;
  }, [applications, selectedAppId]);

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

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp || !onUpdateApplication) return;

    onUpdateApplication(editingApp.id, {
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
        reviewedBy: currentUser?.name || 'Super Admin',
        reviewedAt: new Date().toISOString()
      }
    });

    setEditingApp(null);
  };

  if (selectedApp) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Review Business Record</h2>
            <p className="text-slate-500 text-sm mt-1">{selectedApp.id} • {selectedApp.businessName}</p>
          </div>
          <Button variant="outline" onClick={() => setSelectedAppId(null)}>Back to List</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Business Identification & Registration</CardTitle>
                {isSuperAdmin && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleOpenEditModal(selectedApp)}
                    className="gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Modify Record
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Business Name</p>
                    <p className="font-bold text-slate-900">{selectedApp.businessName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Industry Category</p>
                    <p className="font-medium text-slate-800">{selectedApp.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Applicant / Owner</p>
                    <p className="font-medium text-slate-800">{selectedApp.applicant}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Contact Information</p>
                    <p className="font-medium text-slate-800">{selectedApp.email} • {selectedApp.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">CAC Reg Number</p>
                    <p className="font-mono font-semibold text-slate-800">{selectedApp.details?.cacNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Physical Address</p>
                    <p className="font-medium text-slate-800">{selectedApp.details?.address || 'Not specified'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedApp.documents && selectedApp.documents.length > 0 ? (
                  <ul className="space-y-3">
                    {selectedApp.documents.map((doc, idx) => (
                      <li key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                            {doc.type.substring(0, 3).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{doc.type}</p>
                            <p className="text-xs text-slate-500">{doc.name}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View Document</Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic">No verification documents attached.</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Approval Decision & Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-semibold text-slate-600">Risk Assessment</span>
                  <span className={`font-black text-sm ${selectedApp.riskScore > 50 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {selectedApp.riskScore}/100
                  </span>
                </div>

                <div className="p-3 bg-slate-100 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-slate-700 block">Status:</span>
                  <Badge variant={
                    selectedApp.status === 'Approved' ? 'success' :
                    selectedApp.status === 'Rejected' ? 'destructive' : 'default'
                  }>
                    {selectedApp.status}
                  </Badge>
                </div>
                
                {isSuperAdmin ? (
                  <div className="space-y-2 pt-2">
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold" 
                      onClick={() => {
                        if (onUpdateStatus) onUpdateStatus(selectedApp.id, 'Approved');
                        setSelectedAppId(null);
                      }}
                    >
                      <Check className="w-4 h-4 mr-2" /> Approve Application
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 font-semibold"
                      onClick={() => {
                        if (onUpdateStatus) onUpdateStatus(selectedApp.id, 'Rejected');
                        setSelectedAppId(null);
                      }}
                    >
                      <X className="w-4 h-4 mr-2" /> Reject Application
                    </Button>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-medium space-y-1">
                    <div className="flex items-center space-x-1 font-bold text-amber-950">
                      <Lock className="w-3.5 h-3.5 text-amber-700" />
                      <span>Approval Restricted</span>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Only Super Admin can approve business onboarding applications. Your application is currently under Super Admin review.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Workspace Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-500 mb-4">
                  Open the full management workspace for this business.
                </p>
                <Button 
                  className="w-full font-semibold" 
                  variant="secondary"
                  onClick={() => onViewCustomerDashboard && onViewCustomerDashboard(selectedApp)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" /> Launch Business Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Registered Businesses & Onboarding Applications</h2>
          <p className="text-slate-500 text-sm mt-1">
            {isSuperAdmin 
              ? "Super Admin View: System-wide directory of all registered businesses." 
              : "Registered Admin View: Displaying only businesses registered by you."}
          </p>
        </div>

        {isAdmin && !isSuperAdmin && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 py-1.5 px-3 font-semibold text-xs flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>Scoped to Your Registered Business</span>
          </Badge>
        )}
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-50/50 rounded-t-xl">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search business name, applicant..." 
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="flex gap-2 text-xs font-semibold">
            <span className="px-3 py-1.5 bg-slate-200 rounded-lg text-slate-700">
              Showing {filteredApplications.length} of {scopedApplications.length}
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 font-bold">
              <tr>
                <th className="px-6 py-4">App ID</th>
                <th className="px-6 py-4">Business & Applicant</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4">Risk Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredApplications.length > 0 ? filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-blue-600">{app.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-sm">{app.businessName}</div>
                    <div className="text-slate-500">{app.applicant} • {app.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-medium">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
                      {app.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{app.submittedAt}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold px-2 py-0.5 rounded ${
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
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Record Details */}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-xs gap-1 border-slate-200"
                        onClick={() => setSelectedAppId(app.id)}
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>View</span>
                      </Button>

                      {/* Super Admin Quick Approval Actions */}
                      {isSuperAdmin && app.status !== 'Approved' && (
                        <Button 
                          size="sm" 
                          className="h-8 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                          onClick={() => onUpdateStatus && onUpdateStatus(app.id, 'Approved')}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </Button>
                      )}

                      {isSuperAdmin && app.status !== 'Rejected' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-8 text-xs gap-1 text-red-600 hover:bg-red-50 border-red-200 font-semibold"
                          onClick={() => onUpdateStatus && onUpdateStatus(app.id, 'Rejected')}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </Button>
                      )}

                      {/* Super Admin Edit Action */}
                      {isSuperAdmin && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-8 text-xs gap-1 border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold"
                          onClick={() => handleOpenEditModal(app)}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modify</span>
                        </Button>
                      )}

                      {/* Launch Dashboard */}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="h-8 text-xs text-slate-600 hover:text-slate-900"
                        onClick={() => onViewCustomerDashboard && onViewCustomerDashboard(app)}
                        title="Launch Business Dashboard"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 italic">
                    {isAdmin && !isSuperAdmin
                      ? "You have not registered any businesses under this account yet. Use the Onboarding Wizard to submit a business."
                      : "No businesses found matching criteria."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* SUPER ADMIN EDIT MODAL IN APPLICATIONS */}
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

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
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
                  <label className="block font-bold text-slate-700 mb-1">Category / Sector *</label>
                  <input 
                    type="text"
                    required
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Registered Applicant *</label>
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
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input 
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input 
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fleet Capacity</label>
                  <input 
                    type="text"
                    value={editForm.fleetSize}
                    onChange={(e) => setEditForm({ ...editForm, fleetSize: e.target.value })}
                    placeholder="e.g. 15 Trucks"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Risk Assessment Score (0-100)</label>
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
                  <label className="block font-bold text-slate-700 mb-1">Address</label>
                  <input 
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Super Admin Notes</label>
                <textarea 
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
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
                  <Save className="w-4 h-4 mr-2" /> Save Updates
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
