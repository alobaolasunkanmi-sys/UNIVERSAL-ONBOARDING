import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Student {
  id: string;
  name: string;
  age: number;
  class: string;
  guardian: string;
  phone: string;
  email: string;
  reportCards?: string[];
  enrollmentDate: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: string;
}

export interface FeeRecord {
  studentId: string;
  totalFees: number;
  paid: number;
}

export interface AttendanceRecord {
  studentId: string;
  mon: 'P' | 'A';
  tue: 'P' | 'A';
  wed: 'P' | 'A';
  thu: 'P' | 'A';
  fri: 'P' | 'A';
}

interface SchoolContextType {
  students: Student[];
  staff: Staff[];
  fees: FeeRecord[];
  attendance: AttendanceRecord[];
  addStudent: (student: Omit<Student, 'id' | 'enrollmentDate' | 'reportCards'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  removeStudent: (id: string) => void;
  addStaff: (staff: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, staff: Partial<Staff>) => void;
  removeStaff: (id: string) => void;
  updateFee: (studentId: string, amountPaid: number) => void;
  updateAttendance: (studentId: string, day: keyof Omit<AttendanceRecord, 'studentId'>, status: 'P' | 'A') => void;
}

const mockStudents: Student[] = [
  { id: 'STU-001', name: 'Aisha Bello', age: 4, class: 'KG 1', guardian: 'Mr. Bello', phone: '08012345678', email: 'bello@example.com', reportCards: ['Term 1 Report'], enrollmentDate: new Date().toISOString() },
  { id: 'STU-002', name: 'Chuks Obi', age: 5, class: 'KG 2', guardian: 'Mrs. Obi', phone: '08023456789', email: 'obi@example.com', enrollmentDate: new Date().toISOString() },
  { id: 'STU-003', name: 'Zainab Ahmed', age: 6, class: 'Nursery 1', guardian: 'Dr. Ahmed', phone: '08034567890', email: 'ahmed@example.com', enrollmentDate: new Date().toISOString() },
];

const mockStaff: Staff[] = [
  { id: 'STF-001', name: 'Dr. John Okafor', role: 'Principal', department: 'Administration', email: 'john@school.edu', phone: '08011112222', status: 'Active' },
  { id: 'STF-002', name: 'Mrs. Sarah Smith', role: 'Teacher', department: 'English', email: 'sarah@school.edu', phone: '08022223333', status: 'Active' },
];

const getFeeForClass = (className: string) => {
  if (className.includes('KG')) return 50000;
  if (className.includes('Nursery')) return 60000;
  return 80000;
};

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [fees, setFees] = useState<FeeRecord[]>(
    mockStudents.map(s => ({
      studentId: s.id,
      totalFees: getFeeForClass(s.class),
      paid: s.id === 'STU-001' ? 50000 : 0
    }))
  );
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(
    mockStudents.map(s => ({
      studentId: s.id,
      mon: 'P', tue: 'P', wed: 'P', thu: 'P', fri: 'P'
    }))
  );

  const addStudent = (studentData: Omit<Student, 'id' | 'enrollmentDate' | 'reportCards'>) => {
    const newId = `STU-00${students.length + 1}`;
    const newStudent: Student = {
      ...studentData,
      id: newId,
      enrollmentDate: new Date().toISOString(),
      reportCards: []
    };
    setStudents([newStudent, ...students]);
    setFees([...fees, { studentId: newId, totalFees: getFeeForClass(newStudent.class), paid: 0 }]);
    setAttendance([...attendance, { studentId: newId, mon: 'P', tue: 'P', wed: 'P', thu: 'P', fri: 'P' }]);
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents(students.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const removeStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    setFees(fees.filter(f => f.studentId !== id));
    setAttendance(attendance.filter(a => a.studentId !== id));
  };

  const addStaff = (staffData: Omit<Staff, 'id'>) => {
    const newId = `STF-00${staff.length + 1}`;
    setStaff([{ ...staffData, id: newId }, ...staff]);
  };

  const updateStaff = (id: string, data: Partial<Staff>) => {
    setStaff(staff.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const removeStaff = (id: string) => {
    setStaff(staff.filter(s => s.id !== id));
  };

  const updateFee = (studentId: string, amountPaid: number) => {
    setFees(fees.map(f => f.studentId === studentId ? { ...f, paid: f.paid + amountPaid } : f));
  };

  const updateAttendance = (studentId: string, day: keyof Omit<AttendanceRecord, 'studentId'>, status: 'P' | 'A') => {
    setAttendance(attendance.map(a => a.studentId === studentId ? { ...a, [day]: status } : a));
  };

  return (
    <SchoolContext.Provider value={{
      students, staff, fees, attendance,
      addStudent, updateStudent, removeStudent,
      addStaff, updateStaff, removeStaff,
      updateFee, updateAttendance
    }}>
      {children}
    </SchoolContext.Provider>
  );
}

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) throw new Error('useSchool must be used within SchoolProvider');
  return context;
};
