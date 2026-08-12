import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Building2, CheckCircle2, Clock, XCircle, Grid } from 'lucide-react';
import { Application } from '../types';

interface DashboardProps {
  applications?: Application[];
}

export function Dashboard({ applications = [] }: DashboardProps) {
  const pendingApps = applications.filter(a => a.status === 'Pending').length;
  const approvedApps = applications.filter(a => a.status === 'Approved').length;
  const rejectedApps = applications.filter(a => a.status === 'Rejected').length;
  const totalApps = applications.length;

  const getRecentActivities = () => {
    return applications.slice(0, 5).map(app => ({
      time: app.submittedAt,
      text: `New ${app.type} Application submitted by ${app.businessName}.`,
      user: app.applicant
    }));
  };

  const recentActivities = getRecentActivities();

  // Basic mock data for charts since we don't have historical data
  const data = [
    { name: 'Mon', applications: 0, approved: 0 },
    { name: 'Tue', applications: 0, approved: 0 },
    { name: 'Wed', applications: 0, approved: 0 },
    { name: 'Thu', applications: 0, approved: 0 },
    { name: 'Fri', applications: 0, approved: 0 },
    { name: 'Sat', applications: 0, approved: 0 },
    { name: 'Sun', applications: totalApps, approved: approvedApps },
  ];

  const categoryCounts = applications.reduce((acc, app) => {
    acc[app.type] = (acc[app.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const bizTypeData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  if (bizTypeData.length === 0) {
    bizTypeData.push({ name: 'None', value: 0 });
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
      <p className="text-slate-500 text-sm mt-1 -mt-4">Monitor platform onboarding, business categories, and system health.</p>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApps}</div>
            <p className="text-xs text-slate-500">Total applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Apps</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApps}</div>
            <p className="text-xs text-slate-500">In Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedApps}</div>
            <p className="text-xs text-slate-500">Active businesses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Apps</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedApps}</div>
            <p className="text-xs text-slate-500">Failed compliance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Grid className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-slate-500">Active templates</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Onboarding Volume (7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip />
                <Area type="monotone" dataKey="applications" stroke="#3b82f6" fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distribution by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bizTypeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="value" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.length > 0 ? recentActivities.map((act, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0"></div>
                  <div>
                    <p className="text-sm text-slate-900">{act.text}</p>
                    <div className="text-xs text-slate-500 mt-0.5 flex gap-2">
                      <span>{act.time}</span>
                      <span>•</span>
                      <span>{act.user}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-500 italic">No recent activities.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg flex items-start gap-3">
                <Grid className="w-5 h-5 text-slate-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">System Ready</h4>
                  <p className="text-xs text-slate-600 mt-1">Platform is running smoothly.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
