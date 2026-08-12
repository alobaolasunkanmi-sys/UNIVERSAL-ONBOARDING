import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { FileText, Database, Code, Shield, GitBranch, Layers, Briefcase, Network, Blocks, FileCheck2, Map, Navigation } from 'lucide-react';

const docs = [
  {
    id: 'user-flows',
    title: '1. User Flow Diagrams',
    icon: Navigation,
    content: `
# Universal Onboarding User Flows

## Admin Onboarding Wizard Flow
1. **Start**: Admin selects "Onboard Business" from Sidebar.
2. **Step 1 (Category Selection)**: Admin selects from 6 templates (School, Pharmacy, Store, Corporate, Tailor, Real Estate).
3. **Step 2 (Basic Info)**: Form loads common fields (Name, Owner, Email, Address, TIN, Bank).
4. **Step 3 (Documents)**: Upload Logo, Registration (CAC), and specific IDs.
5. **Step 4 (Category Config)**: Form dynamically switches context:
   - *If School*: Shows Student capacity, Principal Name, Calendar.
   - *If Pharmacy*: Shows Superintendent Pharmacist, License Expiry.
6. **Step 5 (Review)**: Final read-only summary page.
7. **Step 6 (Submit)**: Payload sent to API. Rules Engine evaluates routing.
8. **Step 7 (Complete)**: Display success and route to dashboard.
    `
  },
  {
    id: 'wireframes',
    title: '2. Wireframes & UI Structure',
    icon: FileCheck2,
    content: `
# Wireframes & UI Design

## Main Layout
- **Sidebar (Fixed, Left)**: Navigation menus partitioned by Operations, Platform Builder, and System Admin.
- **Header (Fixed, Top)**: Global Search, Notification bell, Admin Profile drop-down.
- **Main Canvas**: Scrollable content area accommodating Dashboard, Wizards, and Data tables.

## Onboarding Wizard UI
- **Progress Indicator**: Horizontal step tracker with connected line. Completed steps shown in blue with checkmarks.
- **Category Selection**: 3x2 Grid of stylized cards with icons representing the 6 core business types.
- **Forms**: Clean, single-column or two-column grid layouts with required asterisks and inline validation feedback.
    `
  },
  {
    id: 'db-schema',
    title: '3. Database Schema',
    icon: Database,
    content: `
# Core Database Schema

## Entities
1. **Business** 
   - \`id\` (UUID), \`name\` (String), \`owner\` (String), \`category_id\` (FK), \`status\` (Enum), \`created_at\`
2. **BusinessCategory (Templates)**
   - \`id\` (String - e.g. "school"), \`name\` (String), \`icon\` (String)
3. **CategoryConfig (JSONB)**
   - \`business_id\` (FK)
   - \`payload\` (JSONB) - Stores the dynamic, category-specific fields (e.g. \`{ "principalName": "John", "students": 500 }\`)
4. **Documents**
   - \`id\` (UUID), \`business_id\` (FK), \`type\` (Enum: Logo, CAC, License), \`url\` (String)
5. **Users**
   - \`id\` (UUID), \`email\`, \`role\` (SuperAdmin, BusinessOwner, Staff), \`business_id\` (Nullable)
    `
  },
  {
    id: 'rest-api',
    title: '4. REST API Specification',
    icon: Code,
    content: `
# Core REST API Endpoints

## Onboarding
- \`POST /api/v1/onboarding/init\`: Create a draft onboarding session.
- \`POST /api/v1/onboarding/:id/step/:step_num\`: Save step data (Basic Info, Details).
- \`POST /api/v1/onboarding/:id/documents\`: Multipart form upload for logos/documents.
- \`POST /api/v1/onboarding/:id/submit\`: Finalize and submit for KYC workflow.

## Business Directory
- \`GET /api/v1/businesses\`: Retrieve paginated businesses (Supports \`?category=school\`).
- \`GET /api/v1/businesses/:id\`: Fetch comprehensive business profile including parsed JSON config.

## Category Engine
- \`GET /api/v1/categories\`: Fetch active templates and their expected JSON schemas.
    `
  },
  {
    id: 'architecture',
    title: '5. Component & Backend Architecture',
    icon: Layers,
    content: `
# Frontend Component Structure
- \`src/pages/OnboardingWizard.tsx\`: The stateful multi-step engine.
- \`src/components/layout/Sidebar.tsx\`: Dynamic navigation router.
- \`src/components/ui/*\`: Shadcn-like reusable primitive components (Cards, Buttons, Inputs, Badges).

# Backend Architecture (Node/Express)
- **API Gateway**: Handles rate limiting and JWT auth verification.
- **Onboarding Service**: Validates incoming payloads against the specific Category Schema (using Zod).
- **Rules Engine Service**: Evaluates business logic asynchronously upon submission.
- **Storage Service**: AWS S3 or GCS for handling document uploads securely.
    `
  },
  {
    id: 'roadmap',
    title: '6. Development Roadmap',
    icon: Map,
    content: `
# Development Roadmap

## Phase 1: Core Foundation (Weeks 1-2)
- Setup React/Vite frontend and Node/Express backend.
- Implement Authentication & RBAC.
- Build UI primitives and Dashboard layouts.

## Phase 2: Onboarding Wizard (Weeks 3-4)
- Implement 7-step Onboarding Wizard UI.
- Create dynamic JSON state management for the 6 core categories.
- Integrate Document Upload endpoints.

## Phase 3: Workflow & Verification (Weeks 5-6)
- Build Applications Review dashboard for Admins.
- Implement Rules Engine for Approval workflows.

## Phase 4: Expansion Modules (Weeks 7-8)
- Build Category Engine UI to allow dynamic creation of *new* templates beyond the original 6.
- Implement Template Marketplace UI and import/export logic.
    `
  }
];

export function Documentation() {
  const [activeDoc, setActiveDoc] = useState(docs[0].id);

  const currentDoc = docs.find(d => d.id === activeDoc);

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)]">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Project Deliverables</h2>
        <p className="text-slate-500 text-sm mt-1">Documentation, Architecture, Wireframes, and Roadmaps.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-full">
        <Card className="w-full md:w-80 h-full shrink-0 flex flex-col">
          <div className="p-4 border-b border-slate-100 font-semibold text-sm">Requested Deliverables</div>
          <div className="p-2 space-y-1 overflow-y-auto">
            {docs.map(doc => (
              <button
                key={doc.id}
                onClick={() => setActiveDoc(doc.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                  activeDoc === doc.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <doc.icon className={`w-4 h-4 shrink-0 ${activeDoc === doc.id ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="truncate">{doc.title}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="flex-1 h-full flex flex-col min-w-0">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              {currentDoc && <currentDoc.icon className="w-5 h-5" />}
            </div>
            <h3 className="text-lg font-semibold">{currentDoc?.title}</h3>
          </div>
          <CardContent className="p-0 flex-1 overflow-y-auto">
            <div className="p-8 prose prose-slate max-w-none prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-4 prose-p:text-slate-600 prose-li:text-slate-600">
              <div dangerouslySetInnerHTML={{ __html: formatMarkdown(currentDoc?.content || '') }} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Simple markdown formatter for the prototype
function formatMarkdown(text: string) {
  let html = text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
    .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
    .replace(/\n$/gim, '<br />');

  // Handle lists simply
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^[0-9]\. (.*$)/gim, '<li>$1</li>');
  
  return html;
}
