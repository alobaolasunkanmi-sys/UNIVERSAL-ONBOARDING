import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'staff' | 'driver' | 'user';

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  phone?: string;
  nin?: string; // National Identification Number
  email?: string;
  role: UserRole;
  vehicleId?: string;
  mustChangePassword?: boolean;
}

export interface BusinessOnboarding {
  id: string;
  adminId: string;
  businessName: string;
  businessType: string;
  cacNumber?: string;
  address?: string;
  phone?: string;
  email?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt?: string;
}

interface AuthContextType {
  currentUser: UserAccount | null;
  businessOnboarding: BusinessOnboarding | null;
  isAuthenticated: boolean;
  loading: boolean;
  setDemoUser: (user: UserAccount | null) => void;
  setBusinessOnboarding: (onboarding: BusinessOnboarding | null) => void;
  adminSignUp: (data: {
    name: string;
    phone: string;
    nin?: string;
    username: string;
    email?: string;
    password: string;
    businessName?: string;
    businessType?: string;
  }) => Promise<{ success: boolean; message: string }>;
  login: (data: {
    usernameOrEmail: string;
    password: string;
    role?: UserRole;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  applyForOnboarding: (data: {
    businessName: string;
    businessType: string;
    cacNumber?: string;
    address?: string;
    phone?: string;
    email?: string;
  }) => Promise<{ success: boolean; message: string }>;
  changePassword: (data: {
    newPassword: string;
    currentPassword?: string;
  }) => Promise<{ success: boolean; message: string }>;
  driverSetupPassword: (data: {
    username: string;
    newPassword: string;
  }) => Promise<{ success: boolean; message: string }>;
  refreshOnboardingStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('uniboard_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default fallback to Demo Admin if not set
    return {
      id: 'ACC-ADMIN-001',
      username: 'admin',
      name: 'Suntracomm Super Admin',
      phone: '+234 800 111 2222',
      nin: '12345678901',
      email: 'admin@suntracomm.com',
      role: 'admin',
      mustChangePassword: false,
    };
  });

  const [businessOnboarding, setBusinessOnboarding] = useState<BusinessOnboarding | null>(() => {
    const saved = localStorage.getItem('uniboard_onboarding');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return {
      id: 'BIZ-001',
      adminId: 'ACC-ADMIN-001',
      businessName: 'Suntracomm Logistics Ltd',
      businessType: 'logistics',
      cacNumber: 'RC-1892041',
      address: 'Plot 12 Commercial Avenue, Ikeja, Lagos State',
      status: 'Approved',
    };
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('uniboard_user', JSON.stringify(currentUser));
      refreshOnboardingStatus();
    } else {
      localStorage.removeItem('uniboard_user');
      localStorage.removeItem('uniboard_onboarding');
      setBusinessOnboarding(null);
    }
  }, [currentUser?.id]);

  const refreshOnboardingStatus = async () => {
    if (!currentUser || currentUser.role !== 'admin') return;
    try {
      const res = await fetch(`/api/onboarding/my-business/${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setBusinessOnboarding(data);
          localStorage.setItem('uniboard_onboarding', JSON.stringify(data));
        }
      }
    } catch (err) {
      console.warn("Failed to refresh onboarding status:", err);
    }
  };

  const adminSignUp = async (data: {
    name: string;
    phone: string;
    nin?: string;
    username: string;
    email?: string;
    password: string;
    businessName?: string;
    businessType?: string;
  }) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.error || 'Registration failed.' };
      }

      setCurrentUser(result.user);
      if (result.businessOnboarding) {
        setBusinessOnboarding(result.businessOnboarding);
        localStorage.setItem('uniboard_onboarding', JSON.stringify(result.businessOnboarding));
      }

      return { success: true, message: result.message || 'Admin sign-up successful!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'An unexpected error occurred.' };
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: {
    usernameOrEmail: string;
    password: string;
    role?: UserRole;
  }) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.error || 'Login failed.' };
      }

      setCurrentUser(result.user);
      if (result.businessOnboarding) {
        setBusinessOnboarding(result.businessOnboarding);
        localStorage.setItem('uniboard_onboarding', JSON.stringify(result.businessOnboarding));
      }

      return { success: true, message: 'Login successful!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Server error during login.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setBusinessOnboarding(null);
    localStorage.removeItem('uniboard_user');
    localStorage.removeItem('uniboard_onboarding');
  };

  const applyForOnboarding = async (data: {
    businessName: string;
    businessType: string;
    cacNumber?: string;
    address?: string;
    phone?: string;
    email?: string;
  }) => {
    if (!currentUser) {
      return { success: false, message: 'You must be signed in as Admin to apply for onboarding.' };
    }

    setLoading(true);
    try {
      const res = await fetch('/api/onboarding/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: currentUser.id,
          ...data,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.error || 'Application failed.' };
      }

      setBusinessOnboarding(result.businessOnboarding);
      localStorage.setItem('uniboard_onboarding', JSON.stringify(result.businessOnboarding));

      return { success: true, message: 'Onboarding application submitted successfully!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error submitting application.' };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (data: { newPassword: string; currentPassword?: string }) => {
    if (!currentUser) {
      return { success: false, message: 'No active session.' };
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          role: currentUser.role,
          newPassword: data.newPassword,
          currentPassword: data.currentPassword,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.error || 'Failed to update password.' };
      }

      setCurrentUser(prev => prev ? { ...prev, mustChangePassword: false } : null);
      return { success: true, message: 'Password changed successfully!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error changing password.' };
    } finally {
      setLoading(false);
    }
  };

  const driverSetupPassword = async (data: { username: string; newPassword: string }) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/driver-setup-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.error || 'Failed to set password.' };
      }

      setCurrentUser(result.user);
      return { success: true, message: 'Password created! Welcome to your Driver Portal.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error setting password.' };
    } finally {
      setLoading(false);
    }
  };

  const handleSetBusinessOnboarding = (data: BusinessOnboarding | null) => {
    setBusinessOnboarding(data);
    if (data) {
      localStorage.setItem('uniboard_onboarding', JSON.stringify(data));
    } else {
      localStorage.removeItem('uniboard_onboarding');
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      businessOnboarding,
      isAuthenticated: Boolean(currentUser),
      loading,
      setDemoUser: setCurrentUser,
      setBusinessOnboarding: handleSetBusinessOnboarding,
      adminSignUp,
      login,
      logout,
      applyForOnboarding,
      changePassword,
      driverSetupPassword,
      refreshOnboardingStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
