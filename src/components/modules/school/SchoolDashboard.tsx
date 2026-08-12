import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { CreditCard, Users, GraduationCap, TrendingUp, Calendar, ArrowRight, UserPlus, FileText } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useSchool } from './SchoolContext';

export function SchoolDashboardWidgets({ setActiveModule }: { setActiveModule: (module: string) => void }) {
  const { students, fees, attendance } = useSchool();

  const totalFeesExpected = fees.reduce((acc, f) => acc + f.totalFees, 0);
  const totalFeesPaid = fees.reduce((acc, f) => acc + f.paid, 0);
  const feesProgress = totalFeesExpected > 0 ? (totalFeesPaid / totalFeesExpected) * 100 : 0;

  // Compute dummy recent docs based on students
  const recentDocs = students
    .filter(s => s.reportCards && s.reportCards.length > 0)
    .flatMap(s => s.reportCards!.map(r => ({ title: `${r} - ${s.name}`, date: 'Recently added', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' })))
    .slice(0, 3);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fees Progress */}
        <Card className="bg-gradient-to-br from-green-600 to-emerald-700 text-white border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 font-medium text-sm">School Fees Collected</p>
                <h2 className="text-3xl font-bold mt-1">{formatCurrency(totalFeesPaid)}</h2>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-green-500/30">
              <div className="flex justify-between text-sm">
                <span className="text-green-100">Outstanding:</span>
                <span className="font-semibold text-white">{formatCurrency(totalFeesExpected - totalFeesPaid)}</span>
              </div>
              <div className="w-full bg-green-800/50 rounded-full h-1.5 mt-2">
                <div className="bg-white h-1.5 rounded-full" style={{ width: `${feesProgress}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Rate */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 font-medium text-sm">Avg. Weekly Attendance</p>
                <h2 className="text-3xl font-bold mt-1 text-slate-900">92%</h2>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Trend:</span>
                <span className="font-medium text-emerald-600 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +2% this week</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Students */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 font-medium text-sm">Total Students</p>
                <h2 className="text-3xl font-bold mt-1 text-slate-900">{students.length}</h2>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Distribution:</span>
                <span className="font-medium text-slate-700">KG: {students.filter(s => s.class.includes('KG')).length} | Nry: {students.filter(s => s.class.includes('Nursery')).length} | Basic: {students.filter(s => s.class.includes('Basic')).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Intakes */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 font-medium text-sm">New Intakes</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h2 className="text-3xl font-bold text-slate-900">12</h2>
                  <span className="text-sm font-medium text-slate-500">this term</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-sm">
              <div>
                <span className="text-slate-400 block text-xs">This Week</span>
                <span className="font-semibold text-slate-700">3</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">This Month</span>
                <span className="font-semibold text-slate-700">8</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Uploaded Documents Overview</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setActiveModule('students')} className="text-blue-600 hover:text-blue-700">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-sm font-medium text-slate-500 mb-1">Report Cards</div>
                <div className="text-2xl font-bold text-slate-900">1,245</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-sm font-medium text-slate-500 mb-1">Other Docs</div>
                <div className="text-2xl font-bold text-slate-900">382</div>
              </div>
            </div>
            <div className="space-y-3">
              {recentDocs.length > 0 ? recentDocs.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", doc.bg)}>
                    <doc.icon className={cn("w-4 h-4", doc.color)} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-slate-900">{doc.title}</h4>
                    <p className="text-xs text-slate-500">{doc.date}</p>
                  </div>
                </div>
              )) : (
                <div className="p-4 text-center text-sm text-slate-500 italic">No recent documents</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick School Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'students', label: 'Register Student', icon: UserPlus, desc: 'Add new intakes' },
                { id: 'fees', label: 'Log Fee Payment', icon: CreditCard, desc: 'Record school fees' },
                { id: 'attendance', label: 'Mark Attendance', icon: Calendar, desc: 'Daily attendance' },
                { id: 'communication', label: 'Send Announcement', icon: Users, desc: 'Email parents' },
              ].map(action => (
                <Button 
                  key={action.id} 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col gap-2 items-start text-left hover:border-blue-200 hover:bg-blue-50/50" 
                  onClick={() => setActiveModule(action.id)}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mb-1">
                    <action.icon className="w-4 h-4 text-slate-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{action.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{action.desc}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
