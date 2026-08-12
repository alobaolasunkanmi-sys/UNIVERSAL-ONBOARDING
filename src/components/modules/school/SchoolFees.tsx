import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Search, CreditCard, Receipt, FileText } from 'lucide-react';
import { SCHOOL_CLASSES } from './ClassManagement';
import { cn } from '../../../lib/utils';
import { useSchool, FeeRecord, Student } from './SchoolContext';

export function SchoolFees() {
  const { fees, students, updateFee } = useSchool();
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState<string | 'All'>('All');
  
  // Combine fees with student details
  const combinedRecords = fees.map(fee => {
    const student = students.find(s => s.id === fee.studentId);
    return {
      ...fee,
      name: student?.name || 'Unknown Student',
      class: student?.class || 'Unknown Class'
    };
  });

  const filteredRecords = combinedRecords.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.studentId.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === 'All' || r.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  const getStatus = (record: any) => {
    if (record.paid >= record.totalFees) return { label: 'Fully Paid', color: 'bg-green-100 text-green-700 border-green-200' };
    if (record.paid > 0) return { label: 'Partially Paid', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    return { label: 'Pending', color: 'bg-red-100 text-red-700 border-red-200' };
  };

  const classBreakdown = Object.entries(combinedRecords.reduce((acc, curr) => {
    const balance = curr.totalFees - curr.paid;
    if (balance > 0 && curr.class !== 'Unknown Class') {
      if (!acc[curr.class]) acc[curr.class] = { count: 0, amount: 0 };
      acc[curr.class].count += 1;
      acc[curr.class].amount += balance;
    }
    return acc;
  }, {} as Record<string, { count: number, amount: number }>));

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">School Fees Management</h2>
          <p className="text-slate-500 mt-1">Track and manage student fee payments and balances.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-500 mb-1">Total Expected</h3>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(combinedRecords.reduce((acc, curr) => acc + curr.totalFees, 0))}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-green-700 mb-1">Total Paid</h3>
            <p className="text-3xl font-bold text-green-700">{formatCurrency(combinedRecords.reduce((acc, curr) => acc + curr.paid, 0))}</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-amber-700 mb-1">Total Outstanding</h3>
            <p className="text-3xl font-bold text-amber-700">{formatCurrency(combinedRecords.reduce((acc, curr) => acc + (curr.totalFees - curr.paid), 0))}</p>
          </CardContent>
        </Card>
      </div>
      
      {classBreakdown.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Outstanding Balance by Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {classBreakdown.map(([cls, data]) => {
                const breakdown = data as { count: number, amount: number };
                return (
                  <div key={cls} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-700">{cls}</span>
                      <Badge variant="secondary" className="bg-white">{breakdown.count} owing</Badge>
                    </div>
                    <p className="text-xl font-bold text-amber-600">{formatCurrency(breakdown.amount)}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search students by name or ID..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select 
              className="h-10 px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="All">All Classes</option>
              {SCHOOL_CLASSES.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-y border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">Student Info</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Class</th>
                  <th className="px-4 py-3 font-medium text-slate-600 text-right">Total Fees</th>
                  <th className="px-4 py-3 font-medium text-slate-600 text-right">Amount Paid</th>
                  <th className="px-4 py-3 font-medium text-slate-600 text-right">Pending Balance</th>
                  <th className="px-4 py-3 font-medium text-slate-600 text-center">Status</th>
                  <th className="px-4 py-3 font-medium text-slate-600 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.length > 0 ? filteredRecords.map(record => {
                  const status = getStatus(record);
                  const balance = record.totalFees - record.paid;
                  return (
                    <tr key={record.studentId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{record.name}</div>
                        <div className="text-xs text-slate-500">{record.studentId}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{record.class}</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-900">{formatCurrency(record.totalFees)}</td>
                      <td className="px-4 py-3 text-right font-medium text-green-600">{formatCurrency(record.paid)}</td>
                      <td className="px-4 py-3 text-right font-medium text-amber-600">{formatCurrency(balance)}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className={cn("bg-white", status.color)}>{status.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 text-xs"
                          onClick={() => {
                            const amount = window.prompt(`Enter amount paid by ${record.name}:`);
                            if (amount && !isNaN(Number(amount))) {
                              updateFee(record.studentId, Number(amount));
                            }
                          }}
                        >
                          <Receipt className="w-3 h-3 mr-1" /> Log Payment
                        </Button>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-500 italic">
                      No fee records found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
