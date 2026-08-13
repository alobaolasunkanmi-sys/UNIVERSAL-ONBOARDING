import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Driver {
  id: string;
  name: string;
  username?: string;
  password?: string;
  address?: string;
  phone?: string;
  email?: string;
  nin?: string;
  licenseNumber?: string;
  idCardUrl?: string;
  licenseUrl?: string;
  vehicleId?: string;
  status: 'Active' | 'Suspended' | 'Terminated';
  canLogin?: boolean;
  mustChangePassword?: boolean;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  name: string;
  type?: string;
  trackerId?: string;
  trackerSerialNumber?: string;
  status: 'Active' | 'Shut Down' | 'Recovered' | 'Reassigned' | 'Sold' | 'Unassigned';
  driverId?: string;
  hirePurchaseTotal: number;
  weeklyPaymentDue: number;
  dueDate?: string;
}

export interface Payment {
  id: string;
  driverId: string;
  amount: number;
  date: string;
  receiptUrl?: string;
  status: 'Pending' | 'Confirmed' | 'Rejected';
}

interface LogisticsState {
  drivers: Driver[];
  vehicles: Vehicle[];
  payments: Payment[];
  loading: boolean;
  addDriver: (driver: Omit<Driver, 'id'>) => Promise<void>;
  updateDriver: (id: string, data: Partial<Driver>) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
  updateVehicle: (id: string, data: Partial<Vehicle>) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'status'>) => Promise<void>;
  confirmPayment: (id: string) => Promise<void>;
  rejectPayment: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const defaultDrivers: Driver[] = [
  { id: 'DRV-001', name: 'Ibrahim Babangida', username: 'ibrahim', phone: '+234 803 123 4567', email: 'ibrahim@suntracomm.com', nin: '23456789012', vehicleId: 'VEH-001', status: 'Active', canLogin: true },
  { id: 'DRV-002', name: 'Chinedu Okafor', username: 'chinedu', phone: '+234 802 987 6543', email: 'chinedu@suntracomm.com', nin: '34567890123', vehicleId: 'VEH-002', status: 'Active', canLogin: true },
];

const defaultVehicles: Vehicle[] = [
  { id: 'VEH-001', plateNumber: 'KJA-458-XY', name: 'Howo Dump Truck 30T', type: 'Heavy Truck', driverId: 'DRV-001', status: 'Active', hirePurchaseTotal: 25000000, weeklyPaymentDue: 150000 },
  { id: 'VEH-002', plateNumber: 'LSD-892-AB', name: 'Shacman Tipper 20T', type: 'Tipper', driverId: 'DRV-002', status: 'Active', hirePurchaseTotal: 18000000, weeklyPaymentDue: 120000 },
  { id: 'VEH-003', plateNumber: 'GGE-112-ZZ', name: 'Foton Cargo Van', type: 'Van', driverId: undefined, status: 'Unassigned', hirePurchaseTotal: 12000000, weeklyPaymentDue: 80000 },
];

const defaultPayments: Payment[] = [
  { id: 'PAY-001', driverId: 'DRV-001', amount: 25000, date: new Date().toISOString(), status: 'Pending', receiptUrl: '' }
];

const LogisticsContext = createContext<LogisticsState | undefined>(undefined);

export function LogisticsProvider({ children }: { children: ReactNode }) {
  const [drivers, setDrivers] = useState<Driver[]>(defaultDrivers);
  const [vehicles, setVehicles] = useState<Vehicle[]>(defaultVehicles);
  const [payments, setPayments] = useState<Payment[]>(defaultPayments);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshData = async () => {
    try {
      const res = await fetch('/api/logistics');
      if (res.ok) {
        const data = await res.json();
        if (data.drivers && data.drivers.length > 0) {
          setDrivers(data.drivers);
        }
        if (data.vehicles && data.vehicles.length > 0) {
          setVehicles(data.vehicles.map((v: any) => ({
            ...v,
            weeklyPaymentDue: v.weeklyHirePurchaseRate || v.weeklyPaymentDue || 0,
            hirePurchaseTotal: v.hirePurchaseTotal || 0,
          })));
        }
        if (data.payments && data.payments.length > 0) {
          setPayments(data.payments.map((p: any) => ({
            ...p,
            date: new Date(p.date).toISOString()
          })));
        }
      }
    } catch (err) {
      console.warn("Could not fetch logistics data from Cloud SQL API, falling back to cached state:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addDriver = async (driver: Omit<Driver, 'id'>) => {
    try {
      const res = await fetch('/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(driver),
      });
      if (res.ok) {
        await refreshData();
        return;
      }
    } catch (e) {
      console.warn('API call failed, updating local state:', e);
    }
    const newId = `DRV-00${drivers.length + 1}`;
    setDrivers([{ ...driver, id: newId }, ...drivers]);
  };

  const updateDriver = (id: string, data: Partial<Driver>) => {
    setDrivers(drivers.map(d => d.id === id ? { ...d, ...data } : d));
  };

  const addVehicle = async (vehicle: Omit<Vehicle, 'id'>) => {
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicle),
      });
      if (res.ok) {
        await refreshData();
        return;
      }
    } catch (e) {
      console.warn('API call failed, updating local state:', e);
    }
    const newId = `VEH-00${vehicles.length + 1}`;
    setVehicles([{ ...vehicle, id: newId }, ...vehicles]);
  };

  const updateVehicle = (id: string, data: Partial<Vehicle>) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, ...data } : v));
  };

  const addPayment = async (payment: Omit<Payment, 'id' | 'status'>) => {
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment),
      });
      if (res.ok) {
        await refreshData();
        return;
      }
    } catch (e) {
      console.warn('API call failed, updating local state:', e);
    }
    const newId = `PAY-00${payments.length + 1}`;
    setPayments([{ ...payment, id: newId, status: 'Pending' }, ...payments]);
  };

  const confirmPayment = async (id: string) => {
    try {
      const res = await fetch(`/api/payments/${id}/confirm`, { method: 'PATCH' });
      if (res.ok) {
        await refreshData();
        return;
      }
    } catch (e) {
      console.warn('API call failed, updating local state:', e);
    }
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'Confirmed' } : p));
  };

  const rejectPayment = async (id: string) => {
    try {
      const res = await fetch(`/api/payments/${id}/reject`, { method: 'PATCH' });
      if (res.ok) {
        await refreshData();
        return;
      }
    } catch (e) {
      console.warn('API call failed, updating local state:', e);
    }
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'Rejected' } : p));
  };

  return (
    <LogisticsContext.Provider value={{
      drivers, vehicles, payments, loading,
      addDriver, updateDriver, addVehicle, updateVehicle, addPayment, confirmPayment, rejectPayment, refreshData
    }}>
      {children}
    </LogisticsContext.Provider>
  );
}

export function useLogistics() {
  const context = useContext(LogisticsContext);
  if (!context) {
    throw new Error('useLogistics must be used within a LogisticsProvider');
  }
  return context;
}
