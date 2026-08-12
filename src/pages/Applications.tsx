import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Search, Filter, ShieldAlert, Check, X, Eye, ExternalLink } from 'lucide-react';
import { Application, ApplicationStatus } from '../types';

interface ApplicationsProps {
  applications?: Application[];
  onUpdateStatus?: (id: string, status: ApplicationStatus) => void;
  onUpdateApplication?: (id: string, data: Partial<Application>) => void;
  onViewCustomerDashboard?: (app: Application) => void;
}

export function Applications({ applications = [], onUpdateStatus, onUpdateApplication, onViewCustomerDashboard }: ApplicationsProps) {
  const [selectedAppId, setSelectedAppId] = React.useState<string | null>(null);
  
  // Find the selected app from the applications array
  const selectedApp = React.useMemo(() => {
    return applications.find(a => a.id === selectedAppId) || null;
  }, [applications, selectedAppId]);

  if (selectedApp) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Review Application</h2>
            <p className="text-slate-500 text-sm mt-1">{selectedApp.id} - {selectedApp.businessName}</p>
          </div>
          <Button variant="outline" onClick={() => setSelectedAppId(null)}>Back to List</Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Business Name</p>
                    <p className="font-medium">{selectedApp.businessName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Category</p>
                    <p className="font-medium">{selectedApp.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Applicant</p>
                    <p className="font-medium">{selectedApp.applicant}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Contact</p>
                    <p className="font-medium">{selectedApp.email} • {selectedApp.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uploaded Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedApp.documents && selectedApp.documents.length > 0 ? (
                  <ul className="space-y-3">
                    {selectedApp.documents.map((doc, idx) => (
                      <li key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-xs">
                            {doc.type.substring(0, 3).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{doc.type}</p>
                            <p className="text-xs text-slate-500">{doc.name}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View File</Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500 italic">No documents uploaded.</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Decision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 mb-4">
                  <span className="text-sm font-medium">Risk Score</span>
                  <span className={`font-bold ${selectedApp.riskScore > 75 ? 'text-red-600' : selectedApp.riskScore > 40 ? 'text-amber-600' : 'text-green-600'}`}>
                    {selectedApp.riskScore}/100
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white" 
                    onClick={() => {
                      if (onUpdateStatus) onUpdateStatus(selectedApp.id, 'Approved');
                      setSelectedAppId(null);
                    }}
                  >
                    <Check className="w-4 h-4 mr-2" /> Approve Application
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={() => {
                      if (onUpdateStatus) onUpdateStatus(selectedApp.id, 'Rejected');
                      setSelectedAppId(null);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" /> Reject Application
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Simulation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-500 mb-4">
                  Experience the dashboard exactly as the customer sees it. From there, you can edit business settings and details on their behalf.
                </p>
                <Button 
                  className="w-full" 
                  variant="secondary"
                  onClick={() => onViewCustomerDashboard && onViewCustomerDashboard(selectedApp)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" /> Impersonate Customer
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Applications & KYC</h2>
          <p className="text-slate-500 text-sm mt-1">Review onboarding requests and manage compliance workflows.</p>
        </div>
        <Button>Export Report</Button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search applications..." 
                className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 gap-2">
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-slate-100">All ({applications.length})</Badge>
            <Badge variant="secondary" className="px-3 py-1 cursor-pointer text-blue-700 bg-blue-50">Pending ({applications.filter(a => a.status === 'Pending').length})</Badge>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">App ID</th>
                <th className="px-6 py-4 font-medium">Business Details</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Submitted</th>
                <th className="px-6 py-4 font-medium">Risk Score</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {applications.length > 0 ? applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-blue-600">{app.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{app.businessName}</div>
                    <div className="text-slate-500">{app.applicant}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{app.type}</td>
                  <td className="px-6 py-4 text-slate-500">{app.submittedAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${app.riskScore > 75 ? 'text-red-600' : app.riskScore > 40 ? 'text-amber-600' : 'text-green-600'}`}>
                        {app.riskScore}/100
                      </span>
                      {app.riskScore > 75 && <ShieldAlert className="w-4 h-4 text-red-500" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      app.status === 'Approved' ? 'success' :
                      app.status === 'Rejected' ? 'destructive' :
                      app.status === 'Returned' ? 'warning' :
                      app.status === 'In Review' ? 'secondary' : 'default'
                    }>
                      {app.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => setSelectedAppId(app.id)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {app.status === 'Pending' && (
                        <>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => onUpdateStatus && onUpdateStatus(app.id, 'Approved')}><Check className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => onUpdateStatus && onUpdateStatus(app.id, 'Rejected')}><X className="w-4 h-4" /></Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-500 italic">No applications found. Submit one via the Onboarding Wizard.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
