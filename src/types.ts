export type ApplicationStatus = 'Pending' | 'In Review' | 'Approved' | 'Rejected' | 'Returned';

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
  documents?: { type: string; name: string }[];
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
