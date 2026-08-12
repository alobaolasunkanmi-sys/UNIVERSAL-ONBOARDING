import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useLogistics, Driver } from './LogisticsContext';
import { Plus, Search, Edit3, ShieldAlert, CheckCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function DriverManagement() {
  const { drivers, vehicles, addDriver, updateDriver } = useLogistics();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const [formData, setFormData] = useState({
    name: '', address: '', phone: '', email: '', status: 'Active' as const,
  });

  const filteredDrivers = drivers.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  const handleOpenModal = (driver?: Driver) => {
    if (driver) {
      setEditingDriver(driver);
      setFormData({
        name: driver.name, address: driver.address, phone: driver.phone, email: driver.email, status: driver.status
      });
    } else {
      setEditingDriver(null);
      setFormData({ name: '', address: '', phone: '', email: '', status: 'Active' });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingDriver) {
      updateDriver(editingDriver.id, formData);
    } else {
      addDriver(formData);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Driver KYC & Management</h2>
          <p className="text-slate-500 mt-1">Manage driver records and details.</p>
        </div>
        <Button onClick={() => handleOpenModal()}><Plus className="w-4 h-4 mr-2" /> Add Driver</Button>
      </div>

      <Card>
        <CardHeader className="py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder="Search drivers..." 
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
                  <th className="px-6 py-4 font-semibold">Driver Info</th>
                  <th className="px-6 py-4 font-semibold">Contact</th>
                  <th className="px-6 py-4 font-semibold">Assigned Vehicle</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDrivers.map(driver => {
                  const assignedVehicle = vehicles.find(v => v.id === driver.vehicleId);
                  return (
                    <tr key={driver.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{driver.name}</div>
                        <div className="text-xs text-slate-500">{driver.id}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div>{driver.phone}</div>
                        <div className="text-xs">{driver.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        {assignedVehicle ? (
                          <div>
                            <div className="font-medium text-slate-900">{assignedVehicle.plateNumber}</div>
                            <div className="text-xs text-slate-500">{assignedVehicle.name}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None</span>
                        )}
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
                      <td className="px-6 py-4 text-right">
                        <Button size="sm" variant="ghost" onClick={() => handleOpenModal(driver)}>
                          <Edit3 className="w-4 h-4 text-blue-600" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
                {filteredDrivers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic">
                      No drivers found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader>
              <CardTitle>{editingDriver ? 'Edit Driver' : 'Register New Driver'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Address (KYC)</label>
                <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Phone</label>
                  <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              {editingDriver && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button className="flex-1" onClick={handleSave}>Save Details</Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
