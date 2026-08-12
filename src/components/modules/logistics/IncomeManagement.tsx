import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { useLogistics } from './LogisticsContext';
import { Check, X, FileText, Search, Download, TrendingDown, Image as ImageIcon } from 'lucide-react';
import { Input } from '../../ui/input';

export function IncomeManagement() {
  const { payments, drivers, vehicles, confirmPayment, rejectPayment } = useLogistics();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'payments' | 'outstanding'>('payments');
  const [viewReceiptUrl, setViewReceiptUrl] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  const filteredPayments = payments.filter(p => {
    const driver = drivers.find(d => d.id === p.driverId);
    if (!driver) return false;
    return driver.name.toLowerCase().includes(search.toLowerCase());
  });

  const outstandingData = drivers.filter(d => d.vehicleId).map(driver => {
    const vehicle = vehicles.find(v => v.id === driver.vehicleId);
    const driverPayments = payments.filter(p => p.driverId === driver.id && p.status === 'Confirmed');
    const totalPaid = driverPayments.reduce((acc, p) => acc + p.amount, 0);
    const totalExpected = vehicle ? vehicle.hirePurchaseTotal : 0;
    const balance = totalExpected - totalPaid;
    return { driver, vehicle, totalExpected, totalPaid, balance };
  }).filter(data => data.vehicle);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Income Management</h2>
          <p className="text-slate-500 mt-1">Review receipts and analyze outstanding balances.</p>
        </div>
        <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export Report</Button>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'payments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('payments')}
        >
          Recent Payments
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'outstanding' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('outstanding')}
        >
          Outstanding Balances
        </button>
      </div>

      {activeTab === 'payments' && (
        <Card>
          <CardHeader className="py-4 border-b">
            <div className="flex items-center justify-between">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search by driver name..." 
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Date Submitted</th>
                    <th className="px-6 py-4 font-semibold">Driver</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold">Receipt</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.slice().reverse().map(payment => {
                    const driver = drivers.find(d => d.id === payment.driverId);
                    return (
                      <tr key={payment.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 text-slate-600">
                          {new Date(payment.date).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{driver?.name}</div>
                          <div className="text-xs text-slate-500">{driver?.id}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4">
                          {payment.receiptUrl ? (
                            <Button variant="ghost" size="sm" className="h-8 text-xs text-blue-600 hover:bg-blue-50" onClick={() => setViewReceiptUrl(payment.receiptUrl!)}>
                              <ImageIcon className="w-4 h-4 mr-1" /> View Receipt
                            </Button>
                          ) : (
                            <span className="text-slate-400 italic text-xs">No file</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                            payment.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                            payment.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {payment.status === 'Pending' && (
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => confirmPayment(payment.id)}>
                                <Check className="w-4 h-4 mr-1" /> Confirm
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => rejectPayment(payment.id)}>
                                <X className="w-4 h-4 mr-1" /> Reject
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                  {filteredPayments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500 italic">
                        No payments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'outstanding' && (
        <Card>
          <CardHeader>
            <CardTitle>Outstanding Balances Analysis</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Driver & Vehicle</th>
                    <th className="px-6 py-4 font-semibold">Total Hire Purchase</th>
                    <th className="px-6 py-4 font-semibold">Total Paid</th>
                    <th className="px-6 py-4 font-semibold">Outstanding Balance</th>
                    <th className="px-6 py-4 font-semibold">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {outstandingData.map(data => {
                    const progress = data.totalExpected > 0 ? (data.totalPaid / data.totalExpected) * 100 : 0;
                    return (
                      <tr key={data.driver.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{data.driver.name}</div>
                          <div className="text-xs text-slate-500">{data.vehicle?.plateNumber} - {data.vehicle?.name}</div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700">
                          {formatCurrency(data.totalExpected)}
                        </td>
                        <td className="px-6 py-4 font-medium text-green-600">
                          {formatCurrency(data.totalPaid)}
                        </td>
                        <td className="px-6 py-4 font-bold text-red-600 flex items-center">
                          <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
                          {formatCurrency(data.balance)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="text-xs text-slate-500 font-medium">{progress.toFixed(0)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {outstandingData.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic">
                        No active driver vehicles found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Receipt Viewer Modal */}
      {viewReceiptUrl && (
        <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-50 p-4" onClick={() => setViewReceiptUrl(null)}>
          <div className="bg-white p-4 rounded-xl max-w-3xl max-h-[90vh] overflow-auto relative shadow-2xl" onClick={e => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 rounded-full bg-white/50 hover:bg-slate-100" onClick={() => setViewReceiptUrl(null)}>
              <X className="w-5 h-5 text-slate-700" />
            </Button>
            <img src={viewReceiptUrl} alt="Payment Receipt" className="max-w-full h-auto rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
