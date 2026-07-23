export interface AdminWorkflowModel {
  id: string;
  name?: string | null;
  description?: string | null;
  status?: string | null;
  type?: string | null;
  steps?: unknown[] | null;
  companyIds?: string[] | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  [key: string]: unknown;
}

export interface AdminWorkflowStepPayload {
  stepNumber: number;
  stepOrder: number;
  stepName: string;
  content: string;
  mediaType: string;
  instruction: string;
  sampleUrl?: string | null;
}

export interface CreateAdminWorkflowPayload {
  name: string;
  description: string;
  type?: string;
  companyIds?: string[];
  steps: AdminWorkflowStepPayload[];
  [key: string]: unknown;
}

export type UpdateAdminWorkflowPayload = Partial<CreateAdminWorkflowPayload>;

export interface DuplicateAdminWorkflowPayload {
  newName: string;
  companyIds: string[];
}

export interface AdminWorkflowsListParams extends Record<string, unknown> {
  type?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface AdminWorkflowStepChatModel {
  id: string;
  [key: string]: unknown;
}

export interface AdminStepChatHistoryParams extends Record<string, unknown> {
  jobId: string;
  stepId: string;
  reportId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface AdminStepChatsParams extends Record<string, unknown> {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}
