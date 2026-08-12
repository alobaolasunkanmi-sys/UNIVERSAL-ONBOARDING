import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useLogistics, Driver, Vehicle } from './LogisticsContext';
import { Upload, FileText, CheckCircle2, Clock, MapPin, Truck, Calendar } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function DriverPortal() {
  const { drivers, vehicles, payments, addPayment } = useLogistics();
  const [driverId, setDriverId] = useState('');
  const [loggedInDriver, setLoggedInDriver] = useState<Driver | null>(null);
  
  const [paymentAmount, setPaymentAmount] = useState('');
  const [fileAttached, setFileAttached] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const d = drivers.find(d => d.id === driverId || d.phone === driverId);
    if (d) {
      setLoggedInDriver(d);
    } else {
      alert('Driver not found. Please check your ID or Phone number.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileAttached(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  if (!loggedInDriver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-slate-50 animate-in fade-in">
        <Card className="w-full max-w-md shadow-xl border-none">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Driver Portal</h2>
              <p className="text-slate-500 mt-2">Log in to track your hire purchase payments.</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Driver ID or Phone Number</label>
                <Input 
                  placeholder="e.g. DRV-001 or 08012345678" 
                  value={driverId}
                  onChange={(e) => setDriverId(e.target.value)}
                  className="h-12"
                />
              </div>
              <Button type="submit" className="w-full h-12 text-lg">Sign In to Portal</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const assignedVehicle = vehicles.find(v => v.id === loggedInDriver.vehicleId);
  const myPayments = payments.filter(p => p.driverId === loggedInDriver.id);
  const totalPaid = myPayments.filter(p => p.status === 'Confirmed').reduce((acc, p) => acc + p.amount, 0);
  const outstanding = assignedVehicle ? assignedVehicle.hirePurchaseTotal - totalPaid : 0;
  
  const progress = assignedVehicle ? (totalPaid / assignedVehicle.hirePurchaseTotal) * 100 : 0;

  const handleSubmitPayment = () => {
    if (paymentAmount && Number(paymentAmount) > 0) {
      addPayment({
        driverId: loggedInDriver.id,
        amount: Number(paymentAmount),
        date: new Date().toISOString(),
        receiptUrl: fileAttached || undefined
      });
      setSubmitted(true);
      setPaymentAmount('');
      setFileAttached(null);
      setFileName('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome, {loggedInDriver.name}</h2>
          <p className="text-slate-500 mt-1">Manage your hire purchase progress and payments.</p>
        </div>
        <Button variant="outline" onClick={() => setLoggedInDriver(null)}>Sign Out</Button>
      </div>

      {assignedVehicle ? (
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-slate-400 font-medium mb-1">Assigned Vehicle</p>
                <h3 className="text-2xl font-bold">{assignedVehicle.name}</h3>
                <div className="inline-block mt-2 px-3 py-1 bg-white/10 rounded-md text-slate-300 font-mono text-sm tracking-wider">
                  {assignedVehicle.plateNumber}
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Total Hire Purchase</span>
                    <span className="font-semibold">{formatCurrency(assignedVehicle.hirePurchaseTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-green-400">Total Paid</span>
                    <span className="font-semibold">{formatCurrency(totalPaid)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-4 border-t border-white/10">
                    <span className="text-amber-400">Outstanding Balance</span>
                    <span className="font-semibold text-lg">{formatCurrency(outstanding)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-400">Payment Progress</span>
                  <span className="font-medium">{progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-3 mb-6">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                
                <div className="bg-white/5 p-4 rounded-lg border border-white/10 space-y-3">
                  <div className="flex items-center text-sm text-slate-300">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    Due Date: <span className="ml-2 font-medium text-white">{new Date(assignedVehicle.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <Clock className="w-4 h-4 mr-2 text-slate-400" />
                    Weekly Target: <span className="ml-2 font-medium text-white">{formatCurrency(assignedVehicle.weeklyPaymentDue)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-50 border-dashed">
          <CardContent className="py-12 text-center text-slate-500">
            You currently do not have a vehicle assigned to you.
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Submit Payment Receipt</CardTitle>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center mb-4">
                <CheckCircle2 className="w-5 h-5 mr-3" />
                Payment submitted for admin review!
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Amount Paid (₦)</label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 25000" 
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Upload Receipt</label>
                  <label 
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors block w-full text-center",
                      fileAttached ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileUpload} />
                    {fileAttached ? (
                      <div className="flex flex-col items-center">
                        <FileText className="w-8 h-8 text-blue-600 mb-2" />
                        <span className="text-sm font-medium text-blue-700">Receipt Attached ({fileName || 'receipt'})</span>
                        <span className="text-xs text-blue-500 mt-1">Click to replace</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                        <span className="text-sm font-medium text-slate-700">Click to upload bank receipt</span>
                        <span className="text-xs text-slate-500 mt-1">PNG, JPG or PDF</span>
                      </div>
                    )}
                  </label>
                </div>
                
                <Button 
                  className="w-full" 
                  disabled={!paymentAmount || !fileAttached}
                  onClick={handleSubmitPayment}
                >
                  Submit Payment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Payment History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {myPayments.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">No payment history found.</div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto">
                {myPayments.slice().reverse().map(payment => (
                  <div key={payment.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <div className="font-semibold text-slate-900">{formatCurrency(payment.amount)}</div>
                      <div className="text-xs text-slate-500 mt-1">{new Date(payment.date).toLocaleString()}</div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                          payment.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                          payment.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
