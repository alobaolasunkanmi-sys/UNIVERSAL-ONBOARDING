import React, { useState, useRef } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { School, Cross, Store, Building2, Scissors, Home, CheckCircle2, ChevronRight, UploadCloud, File as FileIcon, Truck } from 'lucide-react';
import { cn } from '../lib/utils';
import { Application } from '../types';

const categories = [
  { id: 'school', name: 'School', icon: School, color: 'blue' },
  { id: 'pharmacy', name: 'Pharmacy', icon: Cross, color: 'green' },
  { id: 'supermarket', name: 'Supermarket / Store', icon: Store, color: 'orange' },
  { id: 'corporate', name: 'Corporate Business', icon: Building2, color: 'indigo' },
  { id: 'tailor', name: 'Tailor / Fashion House', icon: Scissors, color: 'pink' },
  { id: 'realestate', name: 'Real Estate Company', icon: Home, color: 'teal' },
  { id: 'logistics', name: 'Logistics Company', icon: Truck, color: 'slate' },
];

interface OnboardingWizardProps {
  onComplete?: (app: Omit<Application, 'id' | 'submittedAt' | 'status' | 'riskScore'>) => void;
  onGoToDashboard?: () => void;
}

export function OnboardingWizard({ onComplete, onGoToDashboard }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    businessName: '',
    owner: '',
    phone: '',
    email: '',
    address: '',
    state: '',
    staffCount: '',
    rcNumber: '',
    tin: '',
    bankName: '',
    accountNumber: ''
  });

  const [documents, setDocuments] = useState<{ type: string; name: string }[]>([]);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const cacInputRef = useRef<HTMLInputElement>(null);
  const otherInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocuments(prev => [...prev.filter(d => d.type !== type), { type, name: file.name }]);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      'Category', 'Basic Info', 'Documents', 'Details', 'Review', 'Submit', 'Done'
    ];

    return (
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-10"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-blue-600 -z-10 transition-all duration-500" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>
        
        {steps.map((s, i) => {
          const isCompleted = i + 1 < step;
          const isCurrent = i + 1 === step;
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300",
                isCompleted ? "bg-blue-600 text-white" : isCurrent ? "bg-white border-2 border-blue-600 text-blue-600" : "bg-white border-2 border-slate-200 text-slate-400"
              )}>
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
              </div>
              <span className={cn(
                "text-xs font-medium absolute -bottom-6 w-20 text-center -ml-6",
                isCurrent ? "text-blue-600" : isCompleted ? "text-slate-700" : "text-slate-400"
              )}>
                {s}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCategorySelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4">
      {categories.map((cat) => (
        <Card 
          key={cat.id} 
          className={cn(
            "cursor-pointer transition-all hover:border-blue-400 hover:shadow-md",
            selectedCategory === cat.id ? "ring-2 ring-blue-600 border-transparent bg-blue-50/50" : ""
          )}
          onClick={() => setSelectedCategory(cat.id)}
        >
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className={cn(`w-16 h-16 rounded-2xl flex items-center justify-center`, 
              selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
            )}>
              <cat.icon className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-lg text-slate-900">{cat.name}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderCommonInfo = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900 block">Business Name <span className="text-red-500">*</span></label>
          <Input name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="E.g. Acme Corporation" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900 block">Business Owner <span className="text-red-500">*</span></label>
          <Input name="owner" value={formData.owner} onChange={handleInputChange} placeholder="Full Name" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900 block">Phone Number <span className="text-red-500">*</span></label>
          <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+234..." />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900 block">Email Address <span className="text-red-500">*</span></label>
          <Input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="contact@example.com" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-900 block">Business Address <span className="text-red-500">*</span></label>
          <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="Full street address" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900 block">State/Region</label>
          <select name="state" value={formData.state} onChange={handleInputChange} className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
            <option value="">Select State</option>
            <option value="lagos">Lagos</option>
            <option value="abuja">Abuja (FCT)</option>
            <option value="rivers">Rivers</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900 block">Staff Count</label>
          <select name="staffCount" value={formData.staffCount} onChange={handleInputChange} className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
            <option value="">Select size</option>
            <option value="1-10">1 - 10 employees</option>
            <option value="11-50">11 - 50 employees</option>
            <option value="50+">50+ employees</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900 block">Registration Number (Optional)</label>
          <Input name="rcNumber" value={formData.rcNumber} onChange={handleInputChange} placeholder="RC Number / BN" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900 block">Tax Identification Number (Optional)</label>
          <Input name="tin" value={formData.tin} onChange={handleInputChange} placeholder="TIN" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-900 block">Bank Account Details</label>
          <div className="grid grid-cols-2 gap-4">
            <Input name="bankName" value={formData.bankName} onChange={handleInputChange} placeholder="Bank Name" />
            <Input name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} placeholder="Account Number" />
          </div>
        </div>
      </div>
    </div>
  );

  const getDocumentName = (type: string) => documents.find(d => d.type === type)?.name;

  const renderDocuments = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload('Logo', e)} />
        <div onClick={() => logoInputRef.current?.click()} className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer flex flex-col items-center">
          {getDocumentName('Logo') ? (
            <><FileIcon className="w-10 h-10 text-blue-500 mb-4" /><p className="text-sm font-medium text-blue-700">{getDocumentName('Logo')}</p></>
          ) : (
            <><UploadCloud className="w-10 h-10 text-slate-400 mb-4" /><p className="text-sm font-medium text-slate-900">Upload Business Logo</p><p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p></>
          )}
        </div>
        
        <input type="file" ref={cacInputRef} className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileUpload('CAC', e)} />
        <div onClick={() => cacInputRef.current?.click()} className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer flex flex-col items-center">
          {getDocumentName('CAC') ? (
            <><FileIcon className="w-10 h-10 text-blue-500 mb-4" /><p className="text-sm font-medium text-blue-700">{getDocumentName('CAC')}</p></>
          ) : (
            <><UploadCloud className="w-10 h-10 text-slate-400 mb-4" /><p className="text-sm font-medium text-slate-900">Upload CAC / Registration Document</p><p className="text-xs text-slate-500 mt-1">PDF up to 10MB</p></>
          )}
        </div>
        
        <input type="file" ref={otherInputRef} className="hidden" multiple onChange={(e) => handleFileUpload('Other', e)} />
        <div onClick={() => otherInputRef.current?.click()} className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer md:col-span-2 flex flex-col items-center">
          {getDocumentName('Other') ? (
            <><FileIcon className="w-10 h-10 text-blue-500 mb-4" /><p className="text-sm font-medium text-blue-700">{getDocumentName('Other')}</p></>
          ) : (
            <><UploadCloud className="w-10 h-10 text-slate-400 mb-4" /><p className="text-sm font-medium text-slate-900">Upload Additional Supporting Documents</p><p className="text-xs text-slate-500 mt-1">Utility Bill, ID Card, etc.</p></>
          )}
        </div>
      </div>
    </div>
  );

  const renderCategorySpecific = () => {
    switch (selectedCategory) {
      case 'school':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 block">School Type</label>
                <select className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                  <option value="primary">Primary School</option>
                  <option value="secondary">Secondary School</option>
                  <option value="college">College / University</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 block">Principal / Head Teacher</label>
                <Input placeholder="Name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 block">Number of Students</label>
                <Input type="number" placeholder="Estimated capacity" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 block">Number of Teachers</label>
                <Input type="number" placeholder="Teaching staff count" />
              </div>
            </div>
          </div>
        );
      case 'pharmacy':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 block">Pharmacy License Number</label>
                <Input placeholder="License ID" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 block">Superintendent Pharmacist</label>
                <Input placeholder="Full Name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 block">License Expiry Date</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 block">Number of Branches</label>
                <Input type="number" defaultValue={1} />
              </div>
            </div>
          </div>
        );
      case 'supermarket':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 block">Store Type</label>
                <select className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                  <option value="retail">Retail Minimart</option>
                  <option value="wholesale">Wholesale Distributor</option>
                  <option value="hypermarket">Hypermarket</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 block">Number of Cashiers/Registers</label>
                <Input type="number" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 block">Warehouse Available?</label>
                <select className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'corporate':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 block">Industry Sector</label>
                <Input placeholder="E.g. Technology, Finance, Manufacturing" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 block">Number of Departments</label>
                <Input type="number" />
              </div>
            </div>
          </div>
        );
      case 'tailor':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 block">Fashion Specialization</label>
                <select className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                  <option value="bespoke">Bespoke Tailoring</option>
                  <option value="ready_to_wear">Ready-to-Wear</option>
                  <option value="bridal">Bridal Wear</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 block">Number of Tailors/Artisans</label>
                <Input type="number" />
              </div>
            </div>
          </div>
        );
      case 'realestate':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 block">Company Type</label>
                <select className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                  <option value="agency">Real Estate Agency</option>
                  <option value="developer">Property Developer</option>
                  <option value="management">Facility Management</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 block">Number of Managed Properties</label>
                <Input type="number" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 block">Number of Agents</label>
                <Input type="number" />
              </div>
            </div>
          </div>
        );
      default:
        return <div>Select a category first.</div>;
    }
  };

  const renderReview = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h3 className="font-semibold text-lg mb-4">Summary</h3>
        <p className="text-slate-600 text-sm mb-6">Please review the details before submitting for approval.</p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-200">
            <div className="text-sm font-medium text-slate-500">Business Name</div>
            <div className="col-span-2 text-sm font-semibold text-slate-900">{formData.businessName || 'Not provided'}</div>
          </div>
          <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-200">
            <div className="text-sm font-medium text-slate-500">Category</div>
            <div className="col-span-2 text-sm capitalize text-slate-900">{selectedCategory}</div>
          </div>
          <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-200">
            <div className="text-sm font-medium text-slate-500">Contact</div>
            <div className="col-span-2 text-sm text-slate-900">{formData.email} • {formData.phone}</div>
          </div>
          <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-200">
            <div className="text-sm font-medium text-slate-500">Documents Attached</div>
            <div className="col-span-2 text-sm text-slate-900">
              {documents.length > 0 ? (
                <ul className="list-disc pl-4">
                  {documents.map(d => <li key={d.type}>{d.type}: {d.name}</li>)}
                </ul>
              ) : 'None'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
      <p className="text-slate-500 text-center max-w-md mb-8">
        The onboarding application has been successfully routed to the Compliance and Risk teams. You will be notified once it is approved and activated.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => { setStep(1); setSelectedCategory(null); setFormData({businessName: '', owner: '', phone: '', email: '', address: '', state: '', staffCount: '', rcNumber: '', tin: '', bankName: '', accountNumber: ''}); setDocuments([]); }}>Start Another</Button>
        <Button onClick={onGoToDashboard}>Go to Dashboard</Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 mb-24">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Onboard New Business</h2>
        <p className="text-slate-500 mt-2">Follow the standardized journey to onboard any organization type.</p>
      </div>

      <div className="px-8">
        {renderStepIndicator()}
      </div>

      <Card className="mt-12 shadow-sm border-slate-200">
        <CardContent className="p-8">
          {step === 1 && renderCategorySelection()}
          {step === 2 && renderCommonInfo()}
          {step === 3 && renderDocuments()}
          {step === 4 && renderCategorySpecific()}
          {step === 5 && renderReview()}
          {step === 6 && (
            <div className="py-20 text-center animate-pulse">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 font-medium">Processing application and applying rules...</p>
            </div>
          )}
          {step === 7 && renderSuccess()}
        </CardContent>
      </Card>

      {step < 6 && (
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            Back
          </Button>
          <Button 
            onClick={() => {
              if (step === 5) {
                setStep(6);
                setTimeout(() => {
                  if (onComplete) {
                    onComplete({
                      businessName: formData.businessName || 'Unnamed Business',
                      type: categories.find(c => c.id === selectedCategory)?.name || 'Unknown',
                      applicant: formData.owner || 'Unknown Applicant',
                      email: formData.email,
                      phone: formData.phone,
                      documents
                    });
                  }
                  setStep(7);
                }, 2000);
              } else {
                setStep(s => Math.min(6, s + 1));
              }
            }}
            disabled={step === 1 && !selectedCategory}
            className="gap-2"
          >
            {step === 5 ? 'Submit Application' : 'Continue'} 
            {step !== 5 && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      )}
    </div>
  );
}
