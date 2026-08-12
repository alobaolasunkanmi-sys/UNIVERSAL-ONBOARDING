import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Plus, Search, Users, UserCog, Mail, Phone, X } from 'lucide-react';
import { useSchool, Staff } from './SchoolContext';

export function StaffManagement() {
  const { staff: staffList, addStaff, updateStaff, removeStaff } = useSchool();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    email: '',
    phone: '',
    status: 'Active'
  });

  const filteredStaff = staffList.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.role.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (staff?: Staff) => {
    if (staff) {
      setEditingStaff(staff);
      setFormData({
        name: staff.name,
        role: staff.role,
        department: staff.department,
        email: staff.email,
        phone: staff.phone,
        status: staff.status
      });
    } else {
      setEditingStaff(null);
      setFormData({
        name: '',
        role: '',
        department: '',
        email: '',
        phone: '',
        status: 'Active'
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingStaff) {
      updateStaff(editingStaff.id, formData);
    } else {
      addStaff(formData);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Staff & Team Management</h2>
          <p className="text-slate-500 mt-1">Register and manage school staff, teachers, and administrators.</p>
        </div>
        <Button onClick={() => handleOpenModal()}><Plus className="w-4 h-4 mr-2" /> Register Staff</Button>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search staff by name, role, or department..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-y border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">Staff Info</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Role & Dept</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Contact</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Status</th>
                  <th className="px-4 py-3 font-medium text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.length > 0 ? filteredStaff.map(staff => (
                  <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{staff.name}</div>
                          <div className="text-xs text-slate-500">{staff.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{staff.role}</div>
                      <div className="text-xs text-slate-500">{staff.department}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center text-slate-600 mb-1">
                        <Mail className="w-3 h-3 mr-2" /> <span className="text-xs">{staff.email}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Phone className="w-3 h-3 mr-2" /> <span className="text-xs">{staff.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={staff.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}>
                        {staff.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleOpenModal(staff)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <UserCog className="w-4 h-4 mr-2" /> Manage
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => {
                          if (window.confirm(`Are you sure you want to remove ${staff.name}?`)) {
                            removeStaff(staff.id);
                          }
                        }} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <X className="w-4 h-4 mr-2" /> Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-500 italic">
                      No staff records found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in p-4">
          <Card className="w-full max-w-lg shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50">
              <CardTitle>{editingStaff ? 'Edit Staff Details' : 'Register New Staff'}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-medium text-slate-700">Full Name</label>
                  <Input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g., Dr. Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700">Role</label>
                  <Input 
                    value={formData.role} 
                    onChange={e => setFormData({...formData, role: e.target.value})} 
                    placeholder="e.g., Teacher, Admin"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700">Department</label>
                  <Input 
                    value={formData.department} 
                    onChange={e => setFormData({...formData, department: e.target.value})} 
                    placeholder="e.g., Science, Admin"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700">Email Address</label>
                  <Input 
                    type="email"
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    placeholder="email@school.edu"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700">Phone Number</label>
                  <Input 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    placeholder="Phone number"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-medium text-slate-700">Status</label>
                  <select 
                    className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save Staff</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
