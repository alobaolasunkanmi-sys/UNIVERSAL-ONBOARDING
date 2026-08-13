import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useLogistics, Driver } from './LogisticsContext';
import { useAuth } from '../../../context/AuthContext';
import { ChangePasswordModal } from '../../auth/ChangePasswordModal';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Calendar, 
  Key, 
  LogOut, 
  Lock,
  User,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export function DriverPortal() {
  const { drivers, vehicles, payments, addPayment } = useLogistics();
  const { currentUser, login, logout, driverSetupPassword } = useAuth();

  // Local Login States if not already logged in via global auth
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Password Setup Mode State
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [setupUsername, setSetupUsername] = useState('');
  const [setupNewPassword, setSetupNewPassword] = useState('');
  const [setupConfirmPassword, setSetupConfirmPassword] = useState('');
  const [setupError, setSetupError] = useState('');
  const [setupSuccess, setSetupSuccess] = useState('');

  // Payment Form States
  const [paymentAmount, setPaymentAmount] = useState('');
  const [fileAttached, setFileAttached] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Change Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Active Logged In Driver Object
  let activeDriver: Driver | null = null;
  if (currentUser && currentUser.role === 'driver') {
    activeDriver = drivers.find(d => 
      d.id === currentUser.id || 
      (d.username && d.username.toLowerCase() === currentUser.username.toLowerCase()) ||
      d.email === currentUser.email
    ) || {
      id: currentUser.id,
      name: currentUser.name,
      username: currentUser.username,
      phone: currentUser.phone || '',
      email: currentUser.email || '',
      vehicleId: currentUser.vehicleId,
      status: 'Active',
      canLogin: true,
    };
  }

  const handleDriverLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!usernameInput || !passwordInput) {
      setLoginError('Please enter your username and password.');
      return;
    }

    const res = await login({
      usernameOrEmail: usernameInput,
      password: passwordInput,
      role: 'driver',
    });

    if (!res.success) {
      setLoginError(res.message);
    }
  };

  const handleDriverSetupPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError('');
    setSetupSuccess('');

    if (!setupUsername || !setupNewPassword) {
      setSetupError('Please enter your assigned username and custom password.');
      return;
    }

    if (setupNewPassword !== setupConfirmPassword) {
      setSetupError('Passwords do not match.');
      return;
    }

    const res = await driverSetupPassword({
      username: setupUsername,
      newPassword: setupNewPassword,
    });

    if (res.success) {
      setSetupSuccess('Password created! Signing into your Driver Portal...');
      setTimeout(() => {
        setIsSetupMode(false);
      }, 1000);
    } else {
      setSetupError(res.message);
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

  if (!activeDriver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-slate-50/50 p-4 animate-in fade-in">
        <Card className="w-full max-w-md shadow-2xl border-none overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 text-center">
            <div className="w-14 h-14 bg-blue-600/30 border border-blue-400/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-blue-300">
              <Truck className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold">Logistics Driver Portal</h2>
            <p className="text-xs text-slate-300 mt-1">Access your hire purchase records and submit weekly payments.</p>
          </div>

          <CardContent className="p-6">
            {!isSetupMode ? (
              <form onSubmit={handleDriverLogin} className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Driver Username</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <Input 
                      placeholder="e.g. ibrahim" 
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className="pl-9 h-11 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Driver Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <Input 
                      type="password"
                      placeholder="••••••••" 
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="pl-9 h-11 text-sm"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20">
                  Sign In to Driver Portal
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setIsSetupMode(true); setLoginError(''); }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
                  >
                    Onboarded driver? Click here to create your portal password
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleDriverSetupPassword} className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-xs text-blue-900 flex items-start space-x-2">
                  <Key className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Enter the username assigned by your Admin to create your driver portal password.</span>
                </div>

                {setupError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{setupError}</span>
                  </div>
                )}

                {setupSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{setupSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Driver Username</label>
                  <Input 
                    placeholder="e.g. ibrahim" 
                    value={setupUsername}
                    onChange={(e) => setSetupUsername(e.target.value)}
                    className="h-10 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
                  <Input 
                    type="password"
                    placeholder="••••••••" 
                    value={setupNewPassword}
                    onChange={(e) => setSetupNewPassword(e.target.value)}
                    className="h-10 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
                  <Input 
                    type="password"
                    placeholder="••••••••" 
                    value={setupConfirmPassword}
                    onChange={(e) => setSetupConfirmPassword(e.target.value)}
                    className="h-10 text-sm"
                  />
                </div>

                <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm">
                  Create Password & Access Portal
                </Button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => { setIsSetupMode(false); setSetupError(''); }}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    ← Back to Driver Sign In
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const assignedVehicle = vehicles.find(v => v.id === activeDriver.vehicleId);
  const myPayments = payments.filter(p => p.driverId === activeDriver.id);
  const totalPaid = myPayments.filter(p => p.status === 'Confirmed').reduce((acc, p) => acc + p.amount, 0);
  const outstanding = assignedVehicle ? assignedVehicle.hirePurchaseTotal - totalPaid : 0;
  const progress = assignedVehicle && assignedVehicle.hirePurchaseTotal > 0 ? (totalPaid / assignedVehicle.hirePurchaseTotal) * 100 : 0;

  const handleSubmitPayment = () => {
    if (paymentAmount && Number(paymentAmount) > 0) {
      addPayment({
        driverId: activeDriver.id,
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
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Welcome, {activeDriver.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">Driver Username: <span className="font-mono text-blue-700 font-semibold">@{activeDriver.username || activeDriver.id}</span></p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowPasswordModal(true)}
            className="text-xs border-slate-200 hover:bg-slate-50"
          >
            <Key className="w-3.5 h-3.5 mr-1 text-slate-500" /> Change Password
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={logout}
            className="text-xs text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-3.5 h-3.5 mr-1" /> Sign Out
          </Button>
        </div>
      </div>

      {/* Vehicle Hire Purchase Status Card */}
      {assignedVehicle ? (
        <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden shadow-xl border-none">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Assigned Fleet Vehicle</p>
                <h3 className="text-2xl font-bold text-white">{assignedVehicle.name}</h3>
                <div className="inline-block mt-2 px-3 py-1 bg-white/10 rounded-lg text-slate-200 font-mono text-xs tracking-wider border border-white/10">
                  Plate Number: {assignedVehicle.plateNumber}
                </div>
                
                <div className="mt-8 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Total Hire Purchase Value</span>
                    <span className="font-semibold text-white">{formatCurrency(assignedVehicle.hirePurchaseTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-emerald-400 font-medium">Total Payments Confirmed</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(totalPaid)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-3 border-t border-white/10">
                    <span className="text-amber-400 font-medium">Outstanding Hire Balance</span>
                    <span className="font-bold text-lg text-amber-300">{formatCurrency(outstanding)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-center bg-white/5 p-6 rounded-2xl border border-white/10">
                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Hire Purchase Completion</span>
                  <span className="font-bold text-blue-400">{progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-700/60 rounded-full h-3 mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
                
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-slate-400"><Clock className="w-3.5 h-3.5 mr-1.5" /> Weekly Payment Rate:</span>
                    <span className="font-semibold text-white">{formatCurrency(assignedVehicle.weeklyHirePurchaseRate || 150000)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-slate-400"><ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Status:</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[11px]">Active Contract</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-50 border-dashed">
          <CardContent className="py-12 text-center text-slate-500 text-sm">
            You currently do not have a vehicle assigned to your profile. Please contact your Admin.
          </CardContent>
        </Card>
      )}

      {/* Payment Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">Submit Payment Receipt</CardTitle>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center mb-4 text-xs font-semibold">
                <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-600" />
                Payment receipt submitted successfully for Admin confirmation!
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Amount Paid (₦) *</label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 25000" 
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="h-10 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Upload Receipt Image or Document *</label>
                  <label 
                    className={cn(
                      "border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors block w-full text-center",
                      fileAttached ? "border-blue-500 bg-blue-50/50" : "border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileUpload} />
                    {fileAttached ? (
                      <div className="flex flex-col items-center">
                        <FileText className="w-8 h-8 text-blue-600 mb-2" />
                        <span className="text-xs font-semibold text-blue-700">Receipt Attached ({fileName || 'receipt'})</span>
                        <span className="text-[11px] text-blue-500 mt-0.5">Click to replace</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                        <span className="text-xs font-semibold text-slate-700">Click to upload bank transfer receipt</span>
                        <span className="text-[11px] text-slate-500 mt-0.5">PNG, JPG or PDF</span>
                      </div>
                    )}
                  </label>
                </div>
                
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 text-xs shadow-md shadow-blue-600/20" 
                  disabled={!paymentAmount || !fileAttached}
                  onClick={handleSubmitPayment}
                >
                  Submit Payment to Admin
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">Payment History & Status</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {myPayments.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">No payment records found.</div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto">
                {myPayments.slice().reverse().map(payment => (
                  <div key={payment.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{formatCurrency(payment.amount)}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{new Date(payment.date).toLocaleString()}</div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                          payment.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
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

      <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </div>
  );
}
