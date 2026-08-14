export type ApplicationStatus = 'Pending' | 'In Review' | 'Under Review' | 'Approved' | 'Rejected' | 'Returned';

export type UserRole = 'superadmin' | 'admin' | 'staff' | 'driver' | 'user';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businessId?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  target: string;
  details: string;
  ipAddress?: string;
}

export interface Application {
  id: string;
  businessName: string;
  type: string;
  applicant: string;
  submittedAt: string;
  status: ApplicationStatus;
  riskScore: number;
  email?: string;
  phone?: string;
  registeredByUserId?: string;
  documents?: { id?: string; type: string; name: string; url?: string; uploadedAt?: string; verified?: boolean }[];
  details?: Record<string, any>;
}

export interface ClusterNode {
  id: string;
  name: string;
  type: string;
  children?: ClusterNode[];
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'file' | 'select' | 'checkbox';
  required: boolean;
  options?: string[];
}

export interface DynamicForm {
  id: string;
  name: string;
  businessType: string;
  fields: FormField[];
}

export interface CategoryModule {
  id: string;
  name: string;
  enabled: boolean;
  icon?: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'Verification' | 'Approval' | 'Setup' | 'Integration';
  assigneeRole: string;
}

export interface BusinessCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  themeColor: string;
  status: 'Active' | 'Draft' | 'Inactive';
  modules: CategoryModule[];
  workflow: WorkflowStep[];
  isTemplate?: boolean;
}
