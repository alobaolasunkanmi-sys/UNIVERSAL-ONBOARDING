import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Shield, Filter, Download, History, UserCheck, AlertTriangle, Clock } from 'lucide-react';
import { AuditLog, UserRole } from '../types';

interface AuditLogsProps {
  logs?: AuditLog[];
  onAddLog?: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
}

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'LOG-1001',
    timestamp: '2026-08-14 01:15:22',
    actorId: 'ACC-ADMIN-001',
    actorName: 'Suntracomm Super Admin',
    actorRole: 'superadmin',
    action: 'Approved Application',
    target: 'APP-1001 (Suntracomm Logistics Ltd)',
    details: 'Verified CAC document RC-1892041 and activated business account.',
    ipAddress: '102.89.23.11'
  },
  {
    id: 'LOG-1002',
    timestamp: '2026-08-14 00:42:10',
    actorId: 'ACC-ADMIN-001',
    actorName: 'Suntracomm Super Admin',
    actorRole: 'superadmin',
    action: 'Modified Business Record',
    target: 'APP-1002 (St. Mary Model College)',
    details: 'Updated risk score from 35 to 28 after document re-inspection.',
    ipAddress: '102.89.23.11'
  },
  {
    id: 'LOG-1003',
    timestamp: '2026-08-13 18:30:00',
    actorId: 'ACC-ADM-889012',
    actorName: 'Dr. Chinedu Okafor',
    actorRole: 'admin',
    action: 'Registered Business',
    target: 'APP-1002 (St. Mary Model College)',
    details: 'Submitted onboarding application for school category with 4 vehicles.',
    ipAddress: '197.210.44.88'
  },
  {
    id: 'LOG-1004',
    timestamp: '2026-08-13 14:10:05',
    actorId: 'ACC-ADMIN-001',
    actorName: 'Suntracomm Super Admin',
    actorRole: 'superadmin',
    action: 'Updated System Configuration',
    target: 'Platform Settings',
    details: 'Enabled optional NIN requirement for Admin self-registration.',
    ipAddress: '102.89.23.11'
  }
];

export function AuditLogs({ logs = initialAuditLogs }: AuditLogsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || log.actorRole === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Platform Audit Trail</h2>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Immutable log of all business modifications, admin reviews, and system events.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 py-1.5 px-3 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Audit Trail Active</span>
          </Badge>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search actor, action, business ID..." 
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Roles</option>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Registered Admin</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredLogs.length}</span> recorded audit events
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Timestamp</th>
                <th className="px-6 py-4 font-semibold">Actor / User</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Action Performed</th>
                <th className="px-6 py-4 font-semibold">Target Record</th>
                <th className="px-6 py-4 font-semibold">Details & Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{log.timestamp}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{log.actorName}</div>
                      <div className="text-xs text-slate-400 font-mono">{log.actorId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        log.actorRole === 'superadmin' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        log.actorRole === 'admin' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium text-xs">
                      {log.target}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 max-w-xs leading-relaxed">
                      {log.details}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500 italic">
                    No matching audit records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
