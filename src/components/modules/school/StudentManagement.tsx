import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Plus, Search, GraduationCap, FileText, User, X, Upload, CheckCircle2 } from 'lucide-react';
import { SCHOOL_CLASSES } from './ClassManagement';
import { cn } from '../../../lib/utils';
import { useSchool, Student } from './SchoolContext';

export function StudentManagement() {
  const { students, addStudent, updateStudent, removeStudent } = useSchool();
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState<string | 'All'>('All');
  
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    class: 'KG 1',
    guardian: '',
    phone: '',
    email: '',
  });

  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === 'All' || s.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const handleOpenModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        name: student.name,
        age: student.age.toString(),
        class: student.class,
        guardian: student.guardian,
        phone: student.phone,
        email: student.email || '',
      });
    } else {
      setEditingStudent(null);
      setFormData({
        name: '',
        age: '',
        class: 'KG 1',
        guardian: '',
        phone: '',
        email: '',
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingStudent) {
      updateStudent(editingStudent.id, {
        ...formData,
        age: parseInt(formData.age) || 0,
      });
    } else {
      addStudent({
        ...formData,
        age: parseInt(formData.age) || 0,
      });
    }
    setShowModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && viewingStudent) {
      const file = e.target.files[0];
      const newReports = [...(viewingStudent.reportCards || []), file.name];
      updateStudent(viewingStudent.id, { reportCards: newReports });
      setViewingStudent({ ...viewingStudent, reportCards: newReports });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Student Management</h2>
          <p className="text-slate-500 mt-1">Register and manage student academic records and details.</p>
        </div>
        <Button onClick={() => handleOpenModal()}><Plus className="w-4 h-4 mr-2" /> Register Student</Button>
      </div>

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
                  <th className="px-4 py-3 font-medium text-slate-600">Student ID</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Name</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Age</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Class</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Guardian / Contact</th>
                  <th className="px-4 py-3 font-medium text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length > 0 ? filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{student.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-slate-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{student.age} yrs</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="bg-white border-blue-200 text-blue-700">{student.class}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-900 font-medium">{student.guardian}</p>
                      <p className="text-xs text-slate-500">{student.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleOpenModal(student)} className="text-slate-600 hover:bg-slate-100">
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setViewingStudent(student)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <FileText className="w-4 h-4 mr-2" /> Records
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => {
                          if (window.confirm(`Are you sure you want to remove ${student.name}? This will remove all their records.`)) {
                            removeStudent(student.id);
                          }
                        }} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <X className="w-4 h-4 mr-2" /> Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500 italic">
                      No students found matching your criteria.
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
              <CardTitle>{editingStudent ? 'Edit Student Details' : 'Register New Student'}</CardTitle>
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
                    placeholder="Enter student name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700">Age</label>
                  <Input 
                    type="number"
                    value={formData.age} 
                    onChange={e => setFormData({...formData, age: e.target.value})} 
                    placeholder="Age"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700">Class</label>
                  <select 
                    className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.class}
                    onChange={e => setFormData({...formData, class: e.target.value})}
                  >
                    {SCHOOL_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-medium text-slate-700">Guardian Name</label>
                  <Input 
                    value={formData.guardian} 
                    onChange={e => setFormData({...formData, guardian: e.target.value})} 
                    placeholder="Parent / Guardian Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700">Guardian Phone</label>
                  <Input 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    placeholder="Phone Number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700">Guardian Email</label>
                  <Input 
                    type="email"
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    placeholder="Email Address"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save Student</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Student Records Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in p-4">
          <Card className="w-full max-w-2xl shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50">
              <CardTitle>Academic Records: {viewingStudent.name}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setViewingStudent(null)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-4 mb-6 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{viewingStudent.name}</h3>
                  <p className="text-sm text-slate-500">{viewingStudent.id} • {viewingStudent.class} • {viewingStudent.age} yrs</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-slate-900">Uploaded Report Cards & Documents</h4>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept=".pdf,.doc,.docx,.jpg,.png"
                  />
                  <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" /> Upload Document
                  </Button>
                </div>
                
                <div className="border rounded-lg divide-y">
                  {(!viewingStudent.reportCards || viewingStudent.reportCards.length === 0) ? (
                    <div className="p-8 text-center text-slate-500">
                      <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p>No documents uploaded yet.</p>
                    </div>
                  ) : (
                    viewingStudent.reportCards.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-500" />
                          <span className="text-sm font-medium text-slate-700">{doc}</span>
                        </div>
                        <Button size="sm" variant="ghost" className="text-blue-600">View</Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
