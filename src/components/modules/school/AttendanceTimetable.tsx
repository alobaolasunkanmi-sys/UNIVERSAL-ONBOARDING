import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Clock, Calendar, Check, X, FileText, Download } from 'lucide-react';
import { SCHOOL_CLASSES } from './ClassManagement';
import { cn } from '../../../lib/utils';
import { useSchool } from './SchoolContext';

export function AttendanceTimetable() {
  const { students, attendance, updateAttendance } = useSchool();
  const [activeTab, setActiveTab] = useState<'attendance' | 'timetable'>('attendance');
  const [selectedClass, setSelectedClass] = useState<string>('KG 1');
  const [week, setWeek] = useState('Week 4, Term 1 (Oct 2 - Oct 6)');

  const classStudents = students.filter(s => s.class === selectedClass);

  const getAttendanceRecord = (studentId: string) => {
    return attendance.find(a => a.studentId === studentId) || { studentId, mon: 'P', tue: 'P', wed: 'P', thu: 'P', fri: 'P' };
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Attendance & Timetable</h2>
          <p className="text-slate-500 mt-1">Manage weekly class timetables and student attendance records.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={activeTab === 'attendance' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </Button>
          <Button 
            variant={activeTab === 'timetable' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('timetable')}
          >
            Timetable
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-slate-50 border-b flex flex-row items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <select 
              className="h-10 px-3 py-2 rounded-md border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {SCHOOL_CLASSES.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            <div className="h-6 w-px bg-slate-200"></div>
            <span className="text-sm font-medium text-slate-600">{week}</span>
          </div>
          {activeTab === 'attendance' ? (
            <Button size="sm"><Check className="w-4 h-4 mr-2" /> Save Attendance</Button>
          ) : (
            <Button size="sm" variant="outline"><Download className="w-4 h-4 mr-2" /> Export PDF</Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {activeTab === 'attendance' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-medium text-slate-600">Student Info</th>
                    <th className="px-4 py-4 font-medium text-slate-600 text-center">Monday</th>
                    <th className="px-4 py-4 font-medium text-slate-600 text-center">Tuesday</th>
                    <th className="px-4 py-4 font-medium text-slate-600 text-center">Wednesday</th>
                    <th className="px-4 py-4 font-medium text-slate-600 text-center">Thursday</th>
                    <th className="px-4 py-4 font-medium text-slate-600 text-center">Friday</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classStudents.map(student => {
                    const record = getAttendanceRecord(student.id);
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/30">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{student.name}</div>
                          <div className="text-xs text-slate-500">{student.id}</div>
                        </td>
                        {(['mon', 'tue', 'wed', 'thu', 'fri'] as const).map(day => {
                          const status = record[day];
                          return (
                            <td key={day} className="px-4 py-4 text-center">
                              <select 
                                className={cn(
                                  "w-24 px-2 py-1.5 text-xs font-semibold rounded-md border text-center appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500",
                                  status === 'P' ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                                )}
                                value={status}
                                onChange={(e) => updateAttendance(student.id, day, e.target.value as 'P' | 'A')}
                              >
                                <option value="P" className="text-green-700">Present</option>
                                <option value="A" className="text-red-700">Absent</option>
                              </select>
                            </td>
                          )
                        })}
                      </tr>
                    );
                  })}
                  {classStudents.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500 italic">
                        No students enrolled in this class.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-1 border-r pr-4 space-y-4">
                  <div className="h-10 text-right text-xs font-medium text-slate-500 pt-2">Time</div>
                  <div className="h-16 text-right text-sm font-medium text-slate-700 pt-4">08:00 - 09:00</div>
                  <div className="h-16 text-right text-sm font-medium text-slate-700 pt-4">09:00 - 10:00</div>
                  <div className="h-16 text-right text-sm font-medium text-slate-700 pt-4">10:00 - 11:00</div>
                  <div className="h-8 text-right text-sm font-bold text-slate-400 pt-1 border-y border-dashed mt-2 mb-2">BREAK</div>
                  <div className="h-16 text-right text-sm font-medium text-slate-700 pt-4">11:30 - 12:30</div>
                  <div className="h-16 text-right text-sm font-medium text-slate-700 pt-4">12:30 - 13:30</div>
                </div>
                
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                  <div key={day} className="col-span-1 space-y-4">
                    <div className="h-10 text-center text-sm font-bold text-slate-700 bg-slate-100 rounded-t-lg pt-2">{day}</div>
                    <div className="h-16 bg-blue-50 border border-blue-100 rounded-lg p-2 text-center flex flex-col justify-center">
                      <span className="text-sm font-bold text-blue-700">Mathematics</span>
                      <span className="text-xs text-blue-500">Mr. John</span>
                    </div>
                    <div className="h-16 bg-indigo-50 border border-indigo-100 rounded-lg p-2 text-center flex flex-col justify-center">
                      <span className="text-sm font-bold text-indigo-700">English</span>
                      <span className="text-xs text-indigo-500">Mrs. Sarah</span>
                    </div>
                    <div className="h-16 bg-emerald-50 border border-emerald-100 rounded-lg p-2 text-center flex flex-col justify-center">
                      <span className="text-sm font-bold text-emerald-700">Science</span>
                      <span className="text-xs text-emerald-500">Mr. Paul</span>
                    </div>
                    <div className="h-8 text-center text-sm font-bold text-slate-400 pt-1 border-y border-dashed mt-2 mb-2">BREAK</div>
                    <div className="h-16 bg-amber-50 border border-amber-100 rounded-lg p-2 text-center flex flex-col justify-center">
                      <span className="text-sm font-bold text-amber-700">Arts</span>
                      <span className="text-xs text-amber-500">Ms. Rose</span>
                    </div>
                    <div className="h-16 bg-slate-50 border border-slate-200 rounded-lg p-2 text-center flex flex-col justify-center">
                      <span className="text-sm font-bold text-slate-700">P.E.</span>
                      <span className="text-xs text-slate-500">Coach Dan</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
