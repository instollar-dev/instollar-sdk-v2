export interface GetAllAssessmentsParams {
  status?: string;
  page?: number;
  limit?: number;
  sortedBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** @deprecated Prefer empty body via `startAssessment()`. */
export interface StartAssessmentPayload {
  [key: string]: unknown;
}

export interface SubmitAssessmentPayloadItem {
  question: string;
  answer?: string;
  textAnswer?: string;
}

/** Assessment submit body is an array of question/answer items. */
export type SubmitAssessmentPayload = SubmitAssessmentPayloadItem[];

export interface SubmitAssessmentModel {
  attemptsRemaining: number;
  level: string;
  scorePercentage: number;
  [key: string]: unknown;
}
