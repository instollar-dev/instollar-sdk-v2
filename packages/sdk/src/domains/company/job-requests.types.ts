export interface CreateJobRequestPayload {
  [key: string]: unknown;
}

export interface CreateJobRequestResultModel {
  requestId?: string;
  message?: string;
  [key: string]: unknown;
}

export interface JobRequestActionResultModel {
  message?: string;
  [key: string]: unknown;
}
