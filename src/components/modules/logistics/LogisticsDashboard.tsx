import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { useLogistics } from './LogisticsContext';
import { Users, Truck, CreditCard, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function LogisticsDashboard() {
  const { drivers, vehicles, payments } = useLogistics();

  const totalExpected = vehicles.reduce((acc, v) => acc + v.hirePurchaseTotal, 0);
  const totalPaid = payments.filter(p => p.status === 'Confirmed').reduce((acc, p) => acc + p.amount, 0);
  const activeVehicles = vehicles.filter(v => v.status === 'Active').length;
  const pendingPayments = payments.filter(p => p.status === 'Pending').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Income & Overview</h2>
          <p className="text-slate-500 mt-1">Real-time tracking of hire purchase progress.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-600 to-emerald-700 text-white border-none">
          <CardContent className="p-6">
            <p className="text-green-100 font-medium text-sm">Total Paid Income</p>
            <h2 className="text-3xl font-bold mt-1">{formatCurrency(totalPaid)}</h2>
            <div className="mt-4 pt-4 border-t border-green-500/30">
              <p className="text-sm text-green-100">Out of {formatCurrency(totalExpected)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div>
              <p className="text-slate-500 font-medium text-sm">Active Drivers</p>
              <h2 className="text-3xl font-bold mt-1 text-slate-900">{drivers.filter(d => d.status === 'Active').length}</h2>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-sm text-slate-500">
              <Users className="w-4 h-4 mr-2" /> Total Drivers: {drivers.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div>
              <p className="text-slate-500 font-medium text-sm">Active Vehicles</p>
              <h2 className="text-3xl font-bold mt-1 text-slate-900">{activeVehicles}</h2>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-sm text-slate-500">
              <Truck className="w-4 h-4 mr-2" /> Tracked on platform
            </div>
          </CardContent>
        </Card>

        <Card className={pendingPayments > 0 ? "border-amber-200 bg-amber-50" : ""}>
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div>
              <p className="text-slate-500 font-medium text-sm">Pending Receipts</p>
              <h2 className="text-3xl font-bold mt-1 text-slate-900">{pendingPayments}</h2>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-sm text-slate-500">
              {pendingPayments > 0 ? <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" /> : <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />}
              Needs Confirmation
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No payments recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Driver</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.slice().reverse().slice(0, 5).map(payment => {
                    const driver = drivers.find(d => d.id === payment.driverId);
                    return (
                      <tr key={payment.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{driver?.name || 'Unknown'}</td>
                        <td className="px-4 py-3">{formatCurrency(payment.amount)}</td>
                        <td className="px-4 py-3">{new Date(payment.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            payment.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                            payment.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
