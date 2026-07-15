export interface WorkflowItemModel {
  id: string | null;
  name: string | null;
  description: string | null;
  status: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface WorkflowStepModel {
  stepNumber: number | null;
  stepOrder?: number | null;
  stepName: string | null;
  content: string | null;
  instruction: string | null;
  mediaType: string | null;
  sampleUrl: string | null;
}

export interface WorkflowDetailModel {
  id: string | null;
  name: string | null;
  description: string | null;
  status: string | null;
  type: string | null;
  companyIds: string[] | null;
  createdBy: string | null;
  createdByCompany: string | null;
  steps: WorkflowStepModel[] | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateWorkflowStepPayload {
  stepNumber: number;
  stepOrder: number;
  stepName: string;
  content: string;
  mediaType: string;
  instruction: string;
  sampleUrl?: string | null;
}

export interface CreateWorkflowPayload {
  name: string;
  description: string;
  type?: string;
  createdByCompany?: string | null;
  steps: CreateWorkflowStepPayload[];
}

export type UpdateWorkflowPayload = CreateWorkflowPayload;

export interface CreateWorkflowModel {
  id: string | null;
  name: string | null;
  message?: string;
}

export interface WorkflowsListParams extends Record<string, unknown> {
  types: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | 'ASC' | 'DESC';
  search?: string;
}
