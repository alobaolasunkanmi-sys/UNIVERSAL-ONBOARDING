import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useLogistics, Vehicle } from './LogisticsContext';
import { Plus, Search, Edit3, ShieldAlert, Wifi, PowerOff, RefreshCw } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function VehicleManagement() {
  const { vehicles, drivers, addVehicle, updateVehicle, updateDriver } = useLogistics();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [formData, setFormData] = useState({
    plateNumber: '', name: '', trackerId: '', trackerSerialNumber: '',
    hirePurchaseTotal: 0, weeklyPaymentDue: 0, dueDate: '', driverId: '', status: 'Active' as any
  });

  const filteredVehicles = vehicles.filter(v => 
    v.plateNumber.toLowerCase().includes(search.toLowerCase()) || 
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        plateNumber: vehicle.plateNumber, name: vehicle.name, trackerId: vehicle.trackerId, 
        trackerSerialNumber: vehicle.trackerSerialNumber, hirePurchaseTotal: vehicle.hirePurchaseTotal,
        weeklyPaymentDue: vehicle.weeklyPaymentDue, dueDate: vehicle.dueDate, 
        driverId: vehicle.driverId || '', status: vehicle.status
      });
    } else {
      setEditingVehicle(null);
      setFormData({ 
        plateNumber: '', name: '', trackerId: '', trackerSerialNumber: '',
        hirePurchaseTotal: 0, weeklyPaymentDue: 0, dueDate: '', driverId: '', status: 'Active'
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingVehicle) {
      updateVehicle(editingVehicle.id, {
        ...formData,
        hirePurchaseTotal: Number(formData.hirePurchaseTotal),
        weeklyPaymentDue: Number(formData.weeklyPaymentDue)
      });
      // If reassigned to a driver, update the driver's record
      if (formData.driverId && formData.driverId !== editingVehicle.driverId) {
        if (editingVehicle.driverId) updateDriver(editingVehicle.driverId, { vehicleId: undefined });
        updateDriver(formData.driverId, { vehicleId: editingVehicle.id });
      }
    } else {
      addVehicle({
        ...formData,
        hirePurchaseTotal: Number(formData.hirePurchaseTotal),
        weeklyPaymentDue: Number(formData.weeklyPaymentDue)
      });
    }
    setShowModal(false);
  };

  const handleShutDown = (vehicle: Vehicle) => {
    if (window.confirm(`Are you sure you want to SHUT DOWN tracker ${vehicle.trackerId} on vehicle ${vehicle.plateNumber}?`)) {
      updateVehicle(vehicle.id, { status: 'Shut Down' });
      alert('Vehicle has been remotely shut down via tracker.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Vehicle & Tracker Management</h2>
          <p className="text-slate-500 mt-1">Manage vehicles, hire purchase details, and remote trackers.</p>
        </div>
        <Button onClick={() => handleOpenModal()}><Plus className="w-4 h-4 mr-2" /> Add Vehicle</Button>
      </div>

      <Card>
        <CardHeader className="py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder="Search plate number or vehicle name..." 
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
                  <th className="px-6 py-4 font-semibold">Vehicle</th>
                  <th className="px-6 py-4 font-semibold">Tracker Details</th>
                  <th className="px-6 py-4 font-semibold">Assigned Driver</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVehicles.map(vehicle => {
                  const driver = drivers.find(d => d.id === vehicle.driverId);
                  return (
                    <tr key={vehicle.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{vehicle.plateNumber}</div>
                        <div className="text-xs text-slate-500">{vehicle.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-slate-700">
                          <Wifi className="w-3 h-3 mr-1 text-blue-500" />
                          <span className="font-medium">{vehicle.trackerId}</span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-1">SN: {vehicle.trackerSerialNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        {driver ? (
                          <div className="font-medium text-slate-700">{driver.name}</div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 text-xs font-semibold rounded-full border",
                          vehicle.status === 'Active' ? "bg-green-50 text-green-700 border-green-200" :
                          vehicle.status === 'Shut Down' ? "bg-red-50 text-red-700 border-red-200" :
                          "bg-amber-50 text-amber-700 border-amber-200"
                        )}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {vehicle.status === 'Active' && (
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleShutDown(vehicle)}>
                              <PowerOff className="w-4 h-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => handleOpenModal(vehicle)}>
                            <Edit3 className="w-4 h-4 text-blue-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {filteredVehicles.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic">
                      No vehicles found.
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
          <Card className="w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingVehicle ? 'Edit Vehicle & Plan' : 'Register Vehicle'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Plate Number</label>
                  <Input value={formData.plateNumber} onChange={e => setFormData({...formData, plateNumber: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Vehicle Name / Model</label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t pt-4 border-slate-100">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Tracker ID</label>
                  <Input value={formData.trackerId} onChange={e => setFormData({...formData, trackerId: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Tracker Serial</label>
                  <Input value={formData.trackerSerialNumber} onChange={e => setFormData({...formData, trackerSerialNumber: e.target.value})} />
                </div>
              </div>
              
              <div className="space-y-2 border-t pt-4 border-slate-100">
                <label className="text-sm font-medium text-slate-700">Assigned Driver</label>
                <select 
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.driverId}
                  onChange={e => setFormData({...formData, driverId: e.target.value})}
                >
                  <option value="">Unassigned</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.id})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Hire Purchase Total (₦)</label>
                  <Input type="number" value={formData.hirePurchaseTotal} onChange={e => setFormData({...formData, hirePurchaseTotal: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Weekly Payment (₦)</label>
                  <Input type="number" value={formData.weeklyPaymentDue} onChange={e => setFormData({...formData, weeklyPaymentDue: Number(e.target.value)})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Completion Due Date</label>
                  <Input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                  >
                    <option value="Active">Active</option>
                    <option value="Shut Down">Shut Down (Penalty)</option>
                    <option value="Recovered">Recovered (Write-off)</option>
                    <option value="Reassigned">Reassigned</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1" onClick={handleSave}>Save Vehicle</Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
