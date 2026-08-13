import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useLogistics, Driver } from './LogisticsContext';
import { 
  Plus, 
  Search, 
  Edit3, 
  Key, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Lock, 
  Hash, 
  Phone, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export function DriverManagement() {
  const { drivers, vehicles, addDriver, updateDriver, refreshData } = useLogistics();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    phone: '',
    email: '',
    nin: '',
    licenseNumber: '',
    status: 'Active' as const,
    canLogin: true,
  });

  const [credentialModalDriver, setCredentialModalDriver] = useState<Driver | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [canLoginToggle, setCanLoginToggle] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    (d.username && d.username.toLowerCase().includes(search.toLowerCase())) ||
    d.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (driver?: Driver) => {
    if (driver) {
      setEditingDriver(driver);
      setFormData({
        name: driver.name,
        username: driver.username || driver.id.toLowerCase().replace('-', ''),
        password: driver.password || '',
        phone: driver.phone || '',
        email: driver.email || '',
        nin: driver.nin || '',
        licenseNumber: driver.licenseNumber || '',
        status: driver.status,
        canLogin: driver.canLogin !== undefined ? driver.canLogin : true,
      });
    } else {
      setEditingDriver(null);
      setFormData({
        name: '',
        username: `drv_${Math.floor(100 + Math.random() * 900)}`,
        password: 'driverpassword123',
        phone: '',
        email: '',
        nin: '',
        licenseNumber: '',
        status: 'Active',
        canLogin: true,
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name) return;
    if (editingDriver) {
      await updateDriver(editingDriver.id, formData);
    } else {
      await addDriver(formData);
    }
    setShowModal(false);
  };

  const handleToggleLoginAccess = async (driver: Driver) => {
    const updatedCanLogin = !driver.canLogin;
    try {
      const res = await fetch(`/api/drivers/${driver.id}/login-access`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canLogin: updatedCanLogin }),
      });
      if (res.ok) {
        await refreshData();
      } else {
        updateDriver(driver.id, { canLogin: updatedCanLogin });
      }
    } catch (e) {
      updateDriver(driver.id, { canLogin: updatedCanLogin });
    }
  };

  const handleOpenCredentialsModal = (driver: Driver) => {
    setCredentialModalDriver(driver);
    setCanLoginToggle(driver.canLogin !== false);
    setNewPassword('');
    setStatusMessage('');
  };

  const handleSaveCredentials = async () => {
    if (!credentialModalDriver) return;
    try {
      const res = await fetch(`/api/drivers/${credentialModalDriver.id}/login-access`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          canLogin: canLoginToggle,
          password: newPassword || undefined,
        }),
      });

      if (res.ok) {
        setStatusMessage('Driver credentials updated successfully!');
        await refreshData();
        setTimeout(() => setCredentialModalDriver(null), 1000);
      } else {
        setStatusMessage('Failed to update credentials.');
      }
    } catch (e) {
      setStatusMessage('Error updating credentials.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Driver Fleet & Login Management</h2>
          <p className="text-slate-500 text-xs mt-1">Onboard drivers, assign login usernames, and manage portal access permissions.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/20">
          <Plus className="w-4 h-4 mr-2" /> Onboard New Driver
        </Button>
      </div>

      <Card>
        <CardHeader className="py-4 border-b bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder="Search drivers by name, ID or username..." 
                className="pl-9 bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-100/70 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-bold">Driver Info & NIN</th>
                  <th className="px-6 py-3 font-bold">Portal Username</th>
                  <th className="px-6 py-3 font-bold">Assigned Vehicle</th>
                  <th className="px-6 py-3 font-bold">Login Access</th>
                  <th className="px-6 py-3 font-bold">Status</th>
                  <th className="px-6 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDrivers.map(driver => {
                  const assignedVehicle = vehicles.find(v => v.id === driver.vehicleId);
                  return (
                    <tr key={driver.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{driver.name}</div>
                        <div className="text-xs text-slate-500 font-mono flex items-center space-x-2 mt-0.5">
                          <span>ID: {driver.id}</span>
                          {driver.nin && <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">NIN: {driver.nin}</span>}
                        </div>
                        <div className="text-xs text-slate-500">{driver.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-blue-700 font-semibold bg-blue-50 px-2.5 py-1 rounded-lg inline-block text-xs border border-blue-200">
                          @{driver.username || driver.id.toLowerCase().replace('-', '')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {assignedVehicle ? (
                          <div>
                            <div className="font-semibold text-slate-900">{assignedVehicle.plateNumber}</div>
                            <div className="text-xs text-slate-500">{assignedVehicle.name}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-xs">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleLoginAccess(driver)}
                          className={cn(
                            "inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer",
                            driver.canLogin !== false 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" 
                              : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                          )}
                        >
                          {driver.canLogin !== false ? (
                            <>
                              <UserCheck className="w-3 h-3 mr-1 text-emerald-600" /> Enabled
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3 mr-1 text-red-600" /> Disabled
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 text-xs font-semibold rounded-full border",
                          driver.status === 'Active' ? "bg-green-50 text-green-700 border-green-200" :
                          driver.status === 'Suspended' ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-red-50 text-red-700 border-red-200"
                        )}>
                          {driver.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1">
                        <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs" onClick={() => handleOpenCredentialsModal(driver)}>
                          <Key className="w-3.5 h-3.5 mr-1" /> Login Access
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleOpenModal(driver)}>
                          <Edit3 className="w-4 h-4 text-slate-600" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Onboard Driver Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg shadow-2xl border-none">
            <CardHeader className="bg-slate-900 text-white rounded-t-xl py-4">
              <CardTitle className="text-lg font-bold flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <span>{editingDriver ? 'Edit Driver Details' : 'Onboard New Driver'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Driver Full Name *</label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ibrahim Babangida" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Assigned Portal Username *</label>
                  <Input value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="ibrahim" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Phone Number *</label>
                  <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+234 803 000 0000" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">National ID Number (NIN)</label>
                  <Input value={formData.nin} onChange={e => setFormData({...formData, nin: e.target.value})} placeholder="11-digit NIN" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Driver License Number</label>
                  <Input value={formData.licenseNumber} onChange={e => setFormData({...formData, licenseNumber: e.target.value})} placeholder="LAG-90821-A" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Email Address</label>
                  <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="driver@company.com" />
                </div>
              </div>

              {!editingDriver && (
                <div className="space-y-1.5 bg-blue-50 p-3 rounded-xl border border-blue-200">
                  <label className="text-xs font-semibold text-blue-900 block">Default Setup Password</label>
                  <Input 
                    type="password"
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    placeholder="driverpassword123"
                  />
                  <p className="text-[11px] text-blue-700 mt-1">The driver will use their assigned username to sign in and update this password.</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-slate-700">Enable Portal Login Access:</span>
                <input 
                  type="checkbox"
                  checked={formData.canLogin}
                  onChange={e => setFormData({...formData, canLogin: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold" onClick={handleSave}>
                  Save Driver Record
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Driver Credentials & Access Modal */}
      {credentialModalDriver && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md shadow-2xl border-none">
            <CardHeader className="bg-slate-900 text-white rounded-t-xl py-4">
              <CardTitle className="text-base font-bold flex items-center space-x-2">
                <Key className="w-5 h-5 text-blue-400" />
                <span>Driver Credentials Access ({credentialModalDriver.name})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {statusMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1.5 border border-slate-200">
                <div>Assigned Username: <span className="font-mono font-bold text-blue-700">@{credentialModalDriver.username || credentialModalDriver.id}</span></div>
                <div>Driver Phone: <span className="font-medium text-slate-800">{credentialModalDriver.phone || 'N/A'}</span></div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-xl bg-white">
                <div>
                  <div className="text-xs font-bold text-slate-900">Portal Login Status</div>
                  <div className="text-[11px] text-slate-500">Allow or block driver sign-in</div>
                </div>
                <input 
                  type="checkbox"
                  checked={canLoginToggle}
                  onChange={e => setCanLoginToggle(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reset Password (Optional)</label>
                <Input 
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Leave empty to keep existing password"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold" onClick={handleSaveCredentials}>
                  Save Credentials
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setCredentialModalDriver(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
