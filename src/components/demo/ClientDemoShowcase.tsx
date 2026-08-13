import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Users, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  UserCheck, 
  Key, 
  Copy, 
  Check, 
  Play, 
  RefreshCw, 
  FileText, 
  CreditCard,
  Building,
  Zap,
  Award
} from 'lucide-react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useLogistics } from '../modules/logistics/LogisticsContext';

interface ClientDemoShowcaseProps {
  onNavigateTab: (tab: string) => void;
  onOpenAuthModal: () => void;
}

export function ClientDemoShowcase({ onNavigateTab, onOpenAuthModal }: ClientDemoShowcaseProps) {
  const { currentUser, setDemoUser, businessOnboarding, setBusinessOnboarding } = useAuth();
  const { drivers, vehicles, addDriver, addVehicle, addPayment } = useLogistics();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simStepText, setSimStepText] = useState<string>('');

  const recommendedPrompt = `Create a high-converting, modern logistics & transport management portal with seamless role-based onboarding (Super Admin, Business Admin, Staff, Drivers). The system must include driver credential management (@username login access), weekly hire purchase target tracking, vehicle tracker serial monitoring, payment receipt uploads with instant staff verification, and a sleek dark/light UX UI dashboard interface.`;

  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(recommendedPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // 1-Click Persona Quick Switchers
  const switchRoleTo = (role: UserRole, username: string, name: string) => {
    setDemoUser({
      id: `DEMO-${role.toUpperCase()}-01`,
      username,
      name,
      role,
      email: `${username}@suntracomm.com`,
      phone: '+234 803 123 4567',
      nin: '23456789012'
    });
  };

  const handleQuickSeedDemoData = async () => {
    setIsSimulating(true);
    setSimStepText('Initializing Logistics Business Profile...');

    // 1. Set Onboarding Business State
    setBusinessOnboarding({
      id: 'BIZ-DEMO-99',
      businessName: 'Trans-Sahara Haulage & Freight Ltd',
      businessCategory: 'Logistics & Heavy Transport',
      cacNumber: 'RC-1829402',
      address: 'Plot 45 Commercial Avenue, Ikeja Industrial Estate, Lagos',
      status: 'Active',
      verifiedAt: new Date().toISOString()
    });

    setSimStepText('Registering Fleet Vehicles & Trackers...');
    await new Promise(r => setTimeout(r, 600));

    // 2. Add realistic vehicles
    await addVehicle({
      plateNumber: 'LSD-902-XK',
      name: 'Howo Sinotruk 30-Ton Dump Truck',
      type: 'Heavy Truck',
      trackerId: 'TRK-98210',
      trackerSerialNumber: 'SN-SINO-2026-90',
      status: 'Active',
      hirePurchaseTotal: 28000000,
      weeklyPaymentDue: 180000
    });

    await addVehicle({
      plateNumber: 'KJA-118-YY',
      name: 'Shacman Tipper 20T Heavy Freight',
      type: 'Tipper',
      trackerId: 'TRK-98211',
      trackerSerialNumber: 'SN-SHAC-2026-11',
      status: 'Active',
      hirePurchaseTotal: 22000000,
      weeklyPaymentDue: 140000
    });

    setSimStepText('Onboarding Fleet Drivers with Login Credentials...');
    await new Promise(r => setTimeout(r, 600));

    // 3. Add realistic drivers with usernames & login enabled
    await addDriver({
      name: 'Ibrahim Babangida',
      username: 'ibrahim',
      phone: '+234 803 123 4567',
      email: 'ibrahim@transsahara.com',
      nin: '23456789012',
      licenseNumber: 'FRSC-NG-90182',
      status: 'Active',
      canLogin: true,
      vehicleId: 'VEH-001'
    });

    await addDriver({
      name: 'Chinedu Okafor',
      username: 'chinedu',
      phone: '+234 802 987 6543',
      email: 'chinedu@transsahara.com',
      nin: '34567890123',
      licenseNumber: 'FRSC-NG-77123',
      status: 'Active',
      canLogin: true,
      vehicleId: 'VEH-002'
    });

    setSimStepText('Submitting Driver Payment Receipt...');
    await new Promise(r => setTimeout(r, 600));

    // 4. Add realistic pending payment
    await addPayment({
      driverId: 'DRV-001',
      amount: 180000,
      date: new Date().toISOString(),
      receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
    });

    setIsSimulating(false);
    setSimStepText('');
    onNavigateTab('dashboard');
  };

  const steps = [
    {
      step: 1,
      title: 'Super Admin Oversight',
      role: 'superadmin',
      roleBadge: 'Platform Super Admin',
      icon: ShieldCheck,
      color: 'from-blue-600 to-indigo-700',
      desc: 'Review incoming logistics business applications, inspect CAC registration numbers, check automated risk scores, and approve company verification.',
      actions: [
        { label: 'View Pending Applications', tab: 'applications' },
        { label: 'Inspect System RBAC Matrix', tab: 'users' },
      ],
      quickLogin: () => switchRoleTo('admin', 'superadmin', 'Super Administrator')
    },
    {
      step: 2,
      title: 'Logistics Admin Onboarding',
      role: 'admin',
      roleBadge: 'Business Admin / Fleet Owner',
      icon: Building2,
      color: 'from-emerald-600 to-teal-700',
      desc: 'Self-register with NIN and Phone number, apply for company verification, register fleet vehicles with tracker IDs, and onboard drivers with username access.',
      actions: [
        { label: 'Company Onboarding Application', tab: 'onboard' },
        { label: 'Register Fleet Vehicles', tab: 'vehicles' },
        { label: 'Onboard Drivers & Grant Access', tab: 'drivers' }
      ],
      quickLogin: () => switchRoleTo('admin', 'suntracomm_admin', 'Ibrahim (Business Owner)')
    },
    {
      step: 3,
      title: 'Operations Staff Workflow',
      role: 'staff',
      roleBadge: 'Operations Staff',
      icon: Users,
      color: 'from-purple-600 to-indigo-800',
      desc: 'Monitor live fleet status, track tracker serial numbers, inspect driver weekly hire purchase progress, and verify incoming payment receipts.',
      actions: [
        { label: 'Fleet Dashboard Monitoring', tab: 'dashboard' },
        { label: 'Verify Income & Receipts', tab: 'income' },
      ],
      quickLogin: () => switchRoleTo('staff', 'staff_ops', 'Fatima (Ops Manager)')
    },
    {
      step: 4,
      title: 'Driver Portal Experience',
      role: 'driver',
      roleBadge: 'Logistics Driver',
      icon: Truck,
      color: 'from-amber-600 to-orange-700',
      desc: 'Drivers sign in with their assigned username & password, view weekly hire purchase target progress, track outstanding balance, and submit payment receipt proofs.',
      actions: [
        { label: 'Launch Driver Portal View', tab: 'driver-portal' },
      ],
      quickLogin: () => switchRoleTo('driver', 'ibrahim', 'Ibrahim Babangida (Driver)')
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Client Pitch Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>Client Demo Showcase & UX/UI Wizard</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Logistics & Transport Onboarding Journey
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
            Present a complete, end-to-end interactive demo for logistics business owners, fleet managers, and drivers. 
            Experience seamless role transitions from <strong className="text-white">Super Admin</strong> approval to <strong className="text-white">Admin fleet setup</strong>, <strong className="text-white">Staff payment verification</strong>, and <strong className="text-white">Driver weekly target tracking</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleQuickSeedDemoData}
              disabled={isSimulating}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-2xl text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center space-x-2 disabled:opacity-60"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{isSimulating ? simStepText || 'Loading Demo...' : '1-Click Full Fleet Demo Setup'}</span>
            </button>

            <button
              onClick={onOpenAuthModal}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-5 rounded-2xl text-xs sm:text-sm border border-white/20 backdrop-blur-sm transition-all flex items-center space-x-2"
            >
              <Key className="w-4 h-4 text-blue-300" />
              <span>Switch Live Persona / Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recommended UX/UI Prompt Box */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Recommended Design Prompt for Logistics Clients</h2>
              <p className="text-xs text-slate-500">Copy this natural language prompt when presenting or creating future logistics web apps</p>
            </div>
          </div>

          <button
            onClick={copyPromptToClipboard}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm"
          >
            {copiedPrompt ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Recommended Prompt</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono leading-relaxed border border-slate-800 select-all">
          "{recommendedPrompt}"
        </div>
      </div>

      {/* Interactive Role Journey Stepper */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Role-Based Onboarding Journey</h2>
            <p className="text-xs text-slate-500 mt-0.5">Click any persona step below to preview the role's dashboard & permissions</p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <span className="text-slate-500 px-2">Active Persona:</span>
            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold uppercase tracking-wider text-[10px]">
              {currentUser?.role || 'Admin'} ({currentUser?.name || 'Demo Administrator'})
            </span>
          </div>
        </div>

        {/* Step Progress Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCurrent = currentUser?.role === s.role;

            return (
              <div
                key={s.step}
                className={`bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-md ${
                  isCurrent ? 'ring-2 ring-blue-600 border-blue-200 bg-blue-50/20' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-r ${s.color} text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      Step {s.step}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{s.title}</h3>
                  <div className="text-[11px] font-semibold text-blue-600 mb-2">{s.roleBadge}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                  <button
                    onClick={s.quickLogin}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all shadow-xs"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Play as {s.roleBadge.split('/')[0]}</span>
                  </button>

                  <div className="space-y-1">
                    {s.actions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigateTab(act.tab)}
                        className="w-full text-left py-1.5 px-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors flex items-center justify-between"
                      >
                        <span>{act.label}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <Building className="w-5 h-5 text-blue-600" />
          <span>Core Capabilities Built for Logistics Clients</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">1</div>
            <h4 className="font-bold text-slate-900 text-sm">Automated Driver Credentials</h4>
            <p className="text-slate-600 leading-relaxed">
              Admins assign custom `@usernames` and default passwords. Onboarded drivers log into their portal without requiring personal email setups.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">2</div>
            <h4 className="font-bold text-slate-900 text-sm">Hire Purchase & Tracker Link</h4>
            <p className="text-slate-600 leading-relaxed">
              Track vehicle total hire purchase costs, weekly targets, assigned tracker serial numbers, and shut-down capabilities for non-compliance.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">3</div>
            <h4 className="font-bold text-slate-900 text-sm">Receipt Verification Queue</h4>
            <p className="text-slate-600 leading-relaxed">
              Drivers upload payment receipts directly from their mobile devices. Operations staff verify payments in real-time to update balances.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
