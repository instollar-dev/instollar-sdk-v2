export interface InstallerWorkflowRowModel {
  id: string | null;
  name: string | null;
  description: string | null;
  status: string | null;
  type: string | null;
  category?: string | null;
  steps: unknown[] | null;
  companyIds: string[] | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  createdByCompany: string | null;
  completionStatus?: string | null;
  requiresSiteAudit?: boolean;
  siteAuditType?: string | null;
}

export interface InstallerWorkflowStepModel {
  content: string | null;
  createdAt: string | null;
  id: string | null;
  instruction: string | null;
  mediaType: string | null;
  sampleUrl: string | null;
  status: string | null;
  stepName: string | null;
  stepNumber: number | null;
  updatedAt: string | null;
  workflowContents?: Array<{ url?: string | null; caption?: string | null }> | null;
}

export interface InstallerWorkflowSingleModel {
  id: string | null;
  name: string | null;
  description: string | null;
  status: string | null;
  type: string | null;
  category?: string | null;
  steps: InstallerWorkflowStepModel[] | null;
  companyIds: string[] | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  createdByCompany: string | null;
  requiresSiteAudit?: boolean;
  siteAuditType?: string | null;
}

export interface WorkflowContentStepSubmitPayload {
  workflowStepId: string;
  url: string[];
  caption?: string;
  reportId?: string;
  form?: unknown[];
}

export interface WorkflowStepChatModel {
  id: string;
  [key: string]: unknown;
}

export interface InstallerProjectWorkflowsParams extends Record<string, unknown> {
  page?: number;
  limit?: number;
  sortedBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface InstallerStepChatHistoryParams extends Record<string, unknown> {
  jobId: string;
  stepId: string;
  reportId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface InstallerStepChatsParams extends Record<string, unknown> {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}
